import test from "node:test";
import assert from "node:assert/strict";
import {
  createEmptyLevelProgress,
  createInitialOperatorState,
} from "../domain/operator-state.ts";
import {
  LocalOperatorStateRepository,
  type StorageAdapter,
} from "./operator-state-repository.ts";

class MemoryStorage implements StorageAdapter {
  private readonly values = new Map<string, string>();

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

test("local repository persists and restores operator progress", () => {
  const storage = new MemoryStorage();
  const repository = new LocalOperatorStateRepository(storage);
  const initial = createInitialOperatorState();
  const state = {
    ...initial,
    activeLevelId: "relationship-builder",
    levelProgress: {
      "follow-the-money": {
        ...createEmptyLevelProgress(),
        completedAt: "2026-01-01T00:00:00.000Z",
      },
    },
  };

  repository.save(state);
  const restored = repository.load();

  assert.equal(restored.activeLevelId, "relationship-builder");
  assert.equal(
    restored.levelProgress["follow-the-money"].completedAt,
    "2026-01-01T00:00:00.000Z",
  );
});

test("invalid stored data fails safely to a fresh state", () => {
  const storage = new MemoryStorage();
  storage.setItem("skadra.operator-mode.state.v1", "{not valid json");
  const repository = new LocalOperatorStateRepository(storage);

  assert.equal(repository.load().version, 3);
  assert.equal(repository.load().activeLevelId, "follow-the-money");
});

test("clear removes persisted state", () => {
  const storage = new MemoryStorage();
  const repository = new LocalOperatorStateRepository(storage);
  repository.save(createInitialOperatorState());
  repository.clear();

  assert.equal(repository.load().activeLevelId, "follow-the-money");
});

test("journal, field mission, relationship, and pipeline records round-trip locally", () => {
  const storage = new MemoryStorage();
  const repository = new LocalOperatorStateRepository(storage, "gabi-user");
  const initial = createInitialOperatorState();
  const now = "2026-08-17T12:00:00.000Z";
  const state = {
    ...initial,
    fieldMissions: [
      {
        id: "field-1",
        template: "Interview an operator",
        date: "2026-08-17",
        person: "Maya",
        place: "North Plant",
        happened: "Observed the handoff.",
        learned: "Ownership was unclear.",
        uncomfortable: "Asked a direct question.",
        wentWell: "The team engaged.",
        changeNextTime: "Bring the process map.",
        followUp: "Send notes.",
        createdAt: now,
        updatedAt: now,
      },
    ],
    relationships: [
      {
        id: "relationship-1",
        name: "Maya",
        company: "North Plant",
        role: "Operations Manager",
        category: "Operator",
        howWeMet: "Field mission",
        caresAbout: "Reliable handoffs",
        lastContact: "2026-08-17",
        nextContact: "2026-08-24",
        notes: "Send process notes.",
        strength: 3,
        createdAt: now,
        updatedAt: now,
      },
    ],
    journalEntries: [
      {
        id: "journal-1",
        weekOf: "2026-08-17",
        responses: { "What did I learn?": "Clear ownership matters." },
        createdAt: now,
        updatedAt: now,
      },
    ],
    locations: [
      {
        id: "location-1",
        company: "North Plant",
        contact: "Maya",
        employeesOrTraffic: "300",
        currentVending: "None",
        problems: "No meal option",
        commission: "",
        followUp: "2026-08-24",
        notes: "",
        stage: "Proposal" as const,
        createdAt: now,
        updatedAt: now,
      },
    ],
  };

  repository.save(state);
  const restored = repository.load();

  assert.equal(restored.fieldMissions[0].learned, "Ownership was unclear.");
  assert.equal(restored.relationships[0].nextContact, "2026-08-24");
  assert.equal(restored.journalEntries[0].responses["What did I learn?"], "Clear ownership matters.");
  assert.equal(restored.locations[0].stage, "Proposal");

  repository.save({
    ...restored,
    relationships: [
      { ...restored.relationships[0], notes: "Updated follow-up note.", updatedAt: "2026-08-18T12:00:00.000Z" },
    ],
  });
  assert.equal(repository.load().relationships[0].notes, "Updated follow-up note.");

  repository.save({ ...repository.load(), relationships: [] });
  assert.equal(repository.load().relationships.length, 0);
});

test("the older training-progress key remains a migration source", () => {
  const storage = new MemoryStorage();
  storage.setItem(
    "skadra.operator-mode.progress.v1",
    JSON.stringify({
      version: 1,
      completedLessonIds: ["follow-the-money"],
      lastLessonId: "relationship-builder",
      updatedAt: "2026-05-01T12:00:00.000Z",
    }),
  );
  const repository = new LocalOperatorStateRepository(storage, "gabi-user");

  const legacy = repository.loadLegacy();

  assert.ok(legacy);
  assert.equal(legacy.activeLevelId, "relationship-builder");
  assert.equal(
    legacy.levelProgress["follow-the-money"].completedAt,
    "2026-05-01T12:00:00.000Z",
  );
  assert.equal(legacy.profile.executiveRole, "coo");
  assert.equal(legacy.profile.onboardingCompletedAt, "2026-05-01T12:00:00.000Z");
});

test("the account factory avoids assigning a role or another user's identity", () => {
  const storage = new MemoryStorage();
  const repository = new LocalOperatorStateRepository(
    storage,
    "andrew-user",
    () => createInitialOperatorState({ name: "Andrew" }),
  );

  const state = repository.load();
  assert.equal(state.profile.name, "Andrew");
  assert.equal(state.profile.executiveRole, null);
});
