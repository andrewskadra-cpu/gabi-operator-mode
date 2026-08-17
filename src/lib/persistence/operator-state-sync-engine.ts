import type { OperatorState } from "../domain/operator-state.ts";
import {
  CloudConflictError,
  type CloudOperatorStateRepository,
  type CloudStateSnapshot,
} from "./cloud-operator-state-repository.ts";
import { isMeaningfulOperatorState } from "./operator-state-codec.ts";
import { mergeOperatorStates } from "./operator-state-merge.ts";
import type { LocalSyncMetadata } from "./local-sync-metadata-repository.ts";
import { LocalSyncMetadataRepository } from "./local-sync-metadata-repository.ts";
import { LocalOperatorStateRepository } from "./operator-state-repository.ts";

export type SyncPhase =
  | "loading"
  | "saving"
  | "saved"
  | "offline"
  | "syncing"
  | "issue";

export interface SyncStatus {
  readonly phase: SyncPhase;
  readonly lastSuccessfulSyncAt: string | null;
  readonly message: string | null;
}

export interface LegacyMigrationCandidate {
  readonly kind: "legacy-only" | "legacy-and-cloud";
  readonly legacyState: OperatorState;
  readonly cloudState: OperatorState | null;
  readonly cloudRevision: number;
}

export interface SyncHydrationResult {
  readonly state: OperatorState;
  readonly migration: LegacyMigrationCandidate | null;
}

export type MigrationChoice = "import" | "merge" | "keep-cloud";

interface SyncEngineOptions {
  readonly debounceMs?: number;
  readonly isOnline?: () => boolean;
  readonly now?: () => string;
  readonly makeRequestId?: () => string;
}

function defaultRequestId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `sync-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export class OperatorStateSyncEngine {
  private readonly localRepository: LocalOperatorStateRepository;
  private readonly cloudRepository: CloudOperatorStateRepository;
  private readonly metadataRepository: LocalSyncMetadataRepository;
  private readonly onStatus: (status: SyncStatus) => void;
  private readonly onResolvedState: (state: OperatorState) => void;
  private readonly debounceMs: number;
  private readonly isOnline: () => boolean;
  private readonly now: () => string;
  private readonly makeRequestId: () => string;
  private metadata: LocalSyncMetadata;
  private cloudRevision = 0;
  private pendingState: OperatorState | null = null;
  private pendingRequestId: string | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private syncing = false;
  private migration: LegacyMigrationCandidate | null = null;

  constructor(
    localRepository: LocalOperatorStateRepository,
    cloudRepository: CloudOperatorStateRepository,
    metadataRepository: LocalSyncMetadataRepository,
    onStatus: (status: SyncStatus) => void,
    onResolvedState: (state: OperatorState) => void,
    options: SyncEngineOptions = {},
  ) {
    this.localRepository = localRepository;
    this.cloudRepository = cloudRepository;
    this.metadataRepository = metadataRepository;
    this.onStatus = onStatus;
    this.onResolvedState = onResolvedState;
    this.debounceMs = options.debounceMs ?? 900;
    this.isOnline = options.isOnline ?? (() => navigator.onLine);
    this.now = options.now ?? (() => new Date().toISOString());
    this.makeRequestId = options.makeRequestId ?? defaultRequestId;
    this.metadata = metadataRepository.load();
  }

  private emit(
    phase: SyncPhase,
    message: string | null = null,
  ): void {
    this.onStatus({
      phase,
      lastSuccessfulSyncAt: this.metadata.lastSuccessfulSyncAt,
      message,
    });
  }

  private saveMetadata(updates: Partial<LocalSyncMetadata>): void {
    this.metadata = { ...this.metadata, ...updates };
    this.metadataRepository.save(this.metadata);
  }

  async hydrate(): Promise<SyncHydrationResult> {
    this.emit("loading");
    const backup = this.localRepository.loadStored();
    const legacy = this.localRepository.loadLegacy();
    let cloud: CloudStateSnapshot;

    try {
      cloud = await this.cloudRepository.load();
    } catch (error) {
      const state = backup ?? legacy ?? this.localRepository.load();
      this.localRepository.save(state);
      this.emit(
        this.isOnline() ? "issue" : "offline",
        "Your device backup is available. Cloud progress could not be loaded yet.",
      );
      console.error("Operator Mode cloud hydration failed", error);
      return { state, migration: null };
    }

    this.cloudRevision = cloud.revision;
    this.saveMetadata({
      cloudRevision: cloud.revision,
      lastCloudUpdatedAt: cloud.updatedAt,
    });

    if (
      cloud.state &&
      backup &&
      isMeaningfulOperatorState(backup) &&
      (this.metadata.pending || backup.updatedAt > cloud.state.updatedAt)
    ) {
      const merged = mergeOperatorStates(cloud.state, backup);
      this.localRepository.save(merged);
      this.pendingState = merged;
      this.pendingRequestId =
        this.metadata.pendingRequestId ?? this.makeRequestId();
      this.saveMetadata({
        pending: true,
        pendingRequestId: this.pendingRequestId,
      });
      this.emit("syncing");
      await this.flush();
      return { state: merged, migration: null };
    }

    if (
      legacy &&
      isMeaningfulOperatorState(legacy) &&
      this.metadata.legacyMigrationDecision === null
    ) {
      this.migration = {
        kind: cloud.state ? "legacy-and-cloud" : "legacy-only",
        legacyState: legacy,
        cloudState: cloud.state,
        cloudRevision: cloud.revision,
      };
      const state = cloud.state ?? legacy;
      this.emit(cloud.state ? "saved" : "syncing");
      return { state, migration: this.migration };
    }

    if (cloud.state) {
      this.localRepository.save(cloud.state);
      this.emit("saved");
      return { state: cloud.state, migration: null };
    }

    const initialState = backup ?? this.localRepository.load();
    this.localRepository.save(initialState);
    this.pendingState = initialState;
    this.pendingRequestId = this.makeRequestId();
    this.saveMetadata({ pending: true, pendingRequestId: this.pendingRequestId });
    await this.flush();
    return { state: initialState, migration: null };
  }

  async resolveMigration(choice: MigrationChoice): Promise<OperatorState> {
    if (!this.migration) {
      throw new Error("There is no legacy progress waiting for a decision.");
    }

    const migration = this.migration;
    if (choice === "keep-cloud") {
      if (!migration.cloudState) {
        throw new Error("There is no cloud progress to keep.");
      }

      this.localRepository.save(migration.cloudState);
      this.saveMetadata({ legacyMigrationDecision: "kept-cloud" });
      this.migration = null;
      this.emit("saved");
      return migration.cloudState;
    }

    let state =
      choice === "merge" && migration.cloudState
        ? mergeOperatorStates(migration.cloudState, migration.legacyState)
        : migration.legacyState;

    this.emit("syncing");
    const requestId = this.makeRequestId();

    try {
      let result;
      try {
        result = await this.cloudRepository.save(
          state,
          migration.cloudRevision,
          requestId,
        );
      } catch (error) {
        if (!(error instanceof CloudConflictError)) {
          throw error;
        }

        const latest = await this.cloudRepository.load();
        if (!latest.state) {
          throw error;
        }

        state = mergeOperatorStates(latest.state, state);
        result = await this.cloudRepository.save(
          state,
          latest.revision,
          this.makeRequestId(),
        );
      }
      this.cloudRevision = result.revision;
      this.localRepository.save(state);
      this.saveMetadata({
        cloudRevision: result.revision,
        pending: false,
        pendingRequestId: null,
        lastSuccessfulSyncAt: this.now(),
        lastCloudUpdatedAt: result.updatedAt,
        legacyMigrationDecision: "imported",
      });
      this.migration = null;
      this.emit("saved");
      return state;
    } catch (error) {
      this.emit(
        this.isOnline() ? "issue" : "offline",
        "Existing progress is still safe on this device. Import was not marked complete.",
      );
      console.error("Operator Mode legacy import failed", error);
      throw error;
    }
  }

  save(state: OperatorState, immediate = false): void {
    this.localRepository.save(state);
    this.pendingState = state;
    this.pendingRequestId = this.makeRequestId();
    this.saveMetadata({
      pending: true,
      pendingRequestId: this.pendingRequestId,
    });

    if (!this.isOnline()) {
      this.emit(
        "offline",
        "Your changes are saved on this device and will sync when the connection returns.",
      );
      return;
    }

    this.emit(immediate ? "syncing" : "saving");
    if (this.timer) {
      clearTimeout(this.timer);
    }

    if (immediate) {
      void this.flush();
      return;
    }

    this.timer = setTimeout(() => {
      this.timer = null;
      void this.flush();
    }, this.debounceMs);
  }

  async retry(): Promise<void> {
    if (!this.pendingState) {
      const backup = this.localRepository.loadStored();
      if (backup && this.metadata.pending) {
        this.pendingState = backup;
        this.pendingRequestId =
          this.metadata.pendingRequestId ?? this.makeRequestId();
      }
    }

    await this.flush();
  }

  async flush(): Promise<void> {
    if (this.syncing || !this.pendingState) {
      return;
    }

    if (!this.isOnline()) {
      this.emit(
        "offline",
        "Your changes are saved on this device and will sync when the connection returns.",
      );
      return;
    }

    this.syncing = true;
    const stateToSave = this.pendingState;
    let requestId = this.pendingRequestId ?? this.makeRequestId();
    this.emit("syncing");

    try {
      let result;
      try {
        result = await this.cloudRepository.save(
          stateToSave,
          this.cloudRevision,
          requestId,
        );
      } catch (error) {
        if (!(error instanceof CloudConflictError)) {
          throw error;
        }

        const latest = await this.cloudRepository.load();
        if (!latest.state) {
          throw error;
        }

        const merged = mergeOperatorStates(latest.state, stateToSave);
        this.onResolvedState(merged);
        this.localRepository.save(merged);
        this.cloudRevision = latest.revision;
        requestId = this.makeRequestId();
        result = await this.cloudRepository.save(
          merged,
          latest.revision,
          requestId,
        );
      }

      this.cloudRevision = result.revision;
      if (this.pendingState === stateToSave) {
        this.pendingState = null;
        this.pendingRequestId = null;
      }
      this.saveMetadata({
        cloudRevision: result.revision,
        pending: this.pendingState !== null,
        pendingRequestId: this.pendingRequestId,
        lastSuccessfulSyncAt: this.now(),
        lastCloudUpdatedAt: result.updatedAt,
      });
      this.emit(this.pendingState ? "saving" : "saved");
    } catch (error) {
      this.saveMetadata({ pending: true, pendingRequestId: requestId });
      this.emit(
        this.isOnline() ? "issue" : "offline",
        "Your latest work is safe on this device. Cloud sync will retry.",
      );
      console.error("Operator Mode cloud save failed", error);
    } finally {
      this.syncing = false;
      if (this.pendingState && this.pendingState !== stateToSave && this.isOnline()) {
        this.save(this.pendingState, true);
      }
    }
  }

  dispose(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
