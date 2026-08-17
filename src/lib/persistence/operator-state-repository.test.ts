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

  assert.equal(repository.load().version, 1);
  assert.equal(repository.load().activeLevelId, "follow-the-money");
});

test("clear removes persisted state", () => {
  const storage = new MemoryStorage();
  const repository = new LocalOperatorStateRepository(storage);
  repository.save(createInitialOperatorState());
  repository.clear();

  assert.equal(repository.load().activeLevelId, "follow-the-money");
});

