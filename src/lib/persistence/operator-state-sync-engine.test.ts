import test from "node:test";
import assert from "node:assert/strict";
import {
  createEmptyLevelProgress,
  createInitialOperatorState,
  type OperatorState,
} from "../domain/operator-state.ts";
import {
  CloudConflictError,
  type CloudOperatorStateRepository,
  type CloudSaveResult,
  type CloudStateSnapshot,
} from "./cloud-operator-state-repository.ts";
import { LocalSyncMetadataRepository } from "./local-sync-metadata-repository.ts";
import { LocalOperatorStateRepository, type StorageAdapter } from "./operator-state-repository.ts";
import {
  OperatorStateSyncEngine,
  type SyncStatus,
} from "./operator-state-sync-engine.ts";

class MemoryStorage implements StorageAdapter {
  readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

class MockCloudRepository implements CloudOperatorStateRepository {
  snapshot: CloudStateSnapshot = {
    exists: false,
    state: null,
    revision: 0,
    updatedAt: null,
  };
  failLoad = false;
  failSave = false;
  failAfterCommitOnce = false;
  conflictOnce = false;
  readonly requestIds: string[] = [];
  private readonly completed = new Map<string, CloudSaveResult>();

  async load(): Promise<CloudStateSnapshot> {
    if (this.failLoad) {
      throw new Error("network unavailable");
    }
    return this.snapshot;
  }

  async save(
    state: OperatorState,
    expectedRevision: number,
    requestId: string,
  ): Promise<CloudSaveResult> {
    this.requestIds.push(requestId);
    const completed = this.completed.get(requestId);
    if (completed) {
      return completed;
    }
    if (this.failSave) {
      throw new Error("save unavailable");
    }
    if (this.conflictOnce) {
      this.conflictOnce = false;
      throw new CloudConflictError();
    }
    if (expectedRevision !== this.snapshot.revision) {
      throw new CloudConflictError();
    }

    const result = {
      revision: expectedRevision + 1,
      updatedAt: state.updatedAt,
    };
    this.snapshot = {
      exists: true,
      state,
      revision: result.revision,
      updatedAt: result.updatedAt,
    };
    this.completed.set(requestId, result);
    if (this.failAfterCommitOnce) {
      this.failAfterCommitOnce = false;
      throw new Error("response was lost after commit");
    }
    return result;
  }
}

function createEngine(
  storage: MemoryStorage,
  cloud: MockCloudRepository,
  statusLog: SyncStatus[],
  onResolvedState: (state: OperatorState) => void = () => undefined,
  isOnline: () => boolean = () => true,
) {
  return new OperatorStateSyncEngine(
    new LocalOperatorStateRepository(storage, "user-1"),
    cloud,
    new LocalSyncMetadataRepository("user-1", storage),
    (status) => statusLog.push(status),
    onResolvedState,
    {
      debounceMs: 60_000,
      isOnline,
      makeRequestId: (() => {
        let next = 0;
        return () => `00000000-0000-4000-8000-${String(++next).padStart(12, "0")}`;
      })(),
      now: () => "2026-08-17T12:00:00.000Z",
    },
  );
}

test("new accounts initialize cloud state and later sessions restore it", async () => {
  const cloud = new MockCloudRepository();
  const firstStorage = new MemoryStorage();
  const firstStatuses: SyncStatus[] = [];
  const firstEngine = createEngine(firstStorage, cloud, firstStatuses);

  const first = await firstEngine.hydrate();
  firstEngine.dispose();

  assert.equal(cloud.snapshot.exists, true);
  assert.equal(cloud.snapshot.revision, 1);
  assert.equal(first.state.activeLevelId, "follow-the-money");
  assert.equal(firstStatuses.at(-1)?.phase, "saved");

  const secondStorage = new MemoryStorage();
  const secondStatuses: SyncStatus[] = [];
  const secondEngine = createEngine(secondStorage, cloud, secondStatuses);
  const restored = await secondEngine.hydrate();
  secondEngine.dispose();

  assert.equal(restored.state.updatedAt, cloud.snapshot.state?.updatedAt);
  assert.equal(secondStatuses.at(-1)?.phase, "saved");
});

test("role and founder mission progress restore on a second device", async () => {
  const cloud = new MockCloudRepository();
  const firstStorage = new MemoryStorage();
  const firstEngine = createEngine(firstStorage, cloud, []);
  await firstEngine.hydrate();

  const timestamp = "2026-08-18T12:00:00.000Z";
  const state: OperatorState = {
    ...createInitialOperatorState({
      name: "Andrew",
      title: "CEO / President in Training",
      executiveRole: "ceo",
      roleSelectedAt: timestamp,
      onboardingCompletedAt: timestamp,
    }),
    currentCampaignId: "ceo-owners-foundation",
    activeLevelId: "ceo-financial-statements",
    founderMissions: [
      {
        id: "founder-case-1",
        missionId: "founder-first-vending-location",
        executiveRole: "ceo",
        status: "complete",
        analysis: "The location clears the base-case return threshold.",
        recommendation: "Deploy subject to verified demand.",
        decision: "deploy",
        reflection: "The COO site visit can change the volume assumption.",
        completedAt: timestamp,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],
    updatedAt: timestamp,
  };
  firstEngine.save(state);
  await firstEngine.flush();
  firstEngine.dispose();

  const secondEngine = createEngine(new MemoryStorage(), cloud, []);
  const restored = await secondEngine.hydrate();
  secondEngine.dispose();

  assert.equal(restored.state.profile.executiveRole, "ceo");
  assert.equal(restored.state.currentCampaignId, "ceo-owners-foundation");
  assert.equal(restored.state.founderMissions[0].decision, "deploy");
});

test("offline hydration uses the per-user device backup without discarding it", async () => {
  const cloud = new MockCloudRepository();
  cloud.failLoad = true;
  const storage = new MemoryStorage();
  const backup = {
    ...createInitialOperatorState(),
    activeLevelId: "relationship-builder",
  };
  new LocalOperatorStateRepository(storage, "user-1").save(backup);
  const statuses: SyncStatus[] = [];
  const engine = createEngine(storage, cloud, statuses, () => undefined, () => false);

  const hydrated = await engine.hydrate();
  engine.dispose();

  assert.equal(hydrated.state.activeLevelId, "relationship-builder");
  assert.equal(statuses.at(-1)?.phase, "offline");
});

test("a lost save response retries with the same idempotency key", async () => {
  const cloud = new MockCloudRepository();
  cloud.snapshot = {
    exists: true,
    state: createInitialOperatorState(),
    revision: 1,
    updatedAt: "2026-08-17T10:00:00.000Z",
  };
  const storage = new MemoryStorage();
  const statuses: SyncStatus[] = [];
  const engine = createEngine(storage, cloud, statuses);
  await engine.hydrate();

  const changed = {
    ...createInitialOperatorState(),
    levelProgress: {
      "follow-the-money": createEmptyLevelProgress(
        "2026-08-17T11:00:00.000Z",
      ),
    },
    updatedAt: "2026-08-17T11:00:00.000Z",
  };
  cloud.failAfterCommitOnce = true;
  engine.save(changed);
  await engine.flush();
  await engine.retry();
  engine.dispose();

  assert.equal(cloud.snapshot.revision, 2);
  assert.equal(cloud.requestIds.at(-1), cloud.requestIds.at(-2));
  assert.equal(statuses.at(-1)?.phase, "saved");
});

test("conflicts merge cloud and device progress before retrying", async () => {
  const base = createInitialOperatorState();
  const cloud = new MockCloudRepository();
  cloud.snapshot = {
    exists: true,
    state: base,
    revision: 4,
    updatedAt: base.updatedAt,
  };
  const storage = new MemoryStorage();
  const statuses: SyncStatus[] = [];
  const resolvedStates: OperatorState[] = [];
  const engine = createEngine(storage, cloud, statuses, (state) => {
    resolvedStates.push(state);
  });
  await engine.hydrate();

  const deviceState = {
    ...base,
    levelProgress: {
      "follow-the-money": {
        ...createEmptyLevelProgress("2026-08-17T12:00:00.000Z"),
        practiceDraft: "Device answer",
      },
    },
    updatedAt: "2026-08-17T12:00:00.000Z",
  };
  cloud.snapshot = {
    exists: true,
    state: {
      ...base,
      peopleLabSessions: [
        {
          id: "people-promotion",
          scenarioId: "promotion",
          choiceId: "c",
          score: null,
          reflection: "",
          completedAt: "2026-08-17T11:00:00.000Z",
          createdAt: "2026-08-17T11:00:00.000Z",
          updatedAt: "2026-08-17T11:00:00.000Z",
        },
      ],
      updatedAt: "2026-08-17T11:00:00.000Z",
    },
    revision: 5,
    updatedAt: "2026-08-17T11:00:00.000Z",
  };

  engine.save(deviceState);
  await engine.flush();
  engine.dispose();

  const resolved = resolvedStates.at(-1);
  assert.ok(resolved);
  assert.equal(resolved.peopleLabSessions.length, 1);
  assert.equal(
    resolved.levelProgress["follow-the-money"].practiceDraft,
    "Device answer",
  );
  assert.equal(cloud.snapshot.revision, 6);
});

test("failed legacy migration remains pending and leaves the original backup", async () => {
  const storage = new MemoryStorage();
  const legacy = {
    ...createInitialOperatorState(),
    levelProgress: {
      "follow-the-money": {
        ...createEmptyLevelProgress("2026-08-17T09:00:00.000Z"),
        practiceDraft: "Legacy work",
      },
    },
  };
  new LocalOperatorStateRepository(storage).save(legacy);
  const cloud = new MockCloudRepository();
  const statuses: SyncStatus[] = [];
  const engine = createEngine(storage, cloud, statuses);

  const hydrated = await engine.hydrate();
  assert.equal(hydrated.migration?.kind, "legacy-only");

  cloud.failSave = true;
  await assert.rejects(() => engine.resolveMigration("import"));
  engine.dispose();

  const metadata = new LocalSyncMetadataRepository("user-1", storage).load();
  assert.equal(metadata.legacyMigrationDecision, null);
  assert.equal(
    new LocalOperatorStateRepository(storage).load().levelProgress[
      "follow-the-money"
    ].practiceDraft,
    "Legacy work",
  );
});
