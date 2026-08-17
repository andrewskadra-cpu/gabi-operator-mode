import {
  createEmptyLevelProgress,
  createInitialOperatorState,
  type OperatorState,
} from "../domain/operator-state.ts";
import {
  LEGACY_TRAINING_PROGRESS_STORAGE_KEY,
  isTrainingProgress,
} from "./local-progress-repository.ts";
import {
  isMeaningfulOperatorState,
  parseOperatorState,
} from "./operator-state-codec.ts";

export const LEGACY_OPERATOR_STATE_STORAGE_KEY =
  "skadra.operator-mode.state.v1";

export function getUserOperatorStateStorageKey(userId: string): string {
  return `skadra.operator-mode.state.v2.${userId}`;
}

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface LocalStateRepository {
  load(): OperatorState;
  save(state: OperatorState): void;
  clear(): void;
}

export class LocalOperatorStateRepository implements LocalStateRepository {
  private readonly storage?: StorageAdapter;
  private readonly userId?: string;

  constructor(storage?: StorageAdapter, userId?: string) {
    this.storage = storage;
    this.userId = userId;
  }

  private getStorage(): StorageAdapter | undefined {
    if (this.storage) {
      return this.storage;
    }

    if (typeof window !== "undefined") {
      return window.localStorage;
    }

    return undefined;
  }

  private readKey(key: string): OperatorState | null {
    try {
      const stored = this.getStorage()?.getItem(key);
      const parsed: unknown = stored ? JSON.parse(stored) : null;
      return parseOperatorState(parsed);
    } catch {
      return null;
    }
  }

  private get storageKey(): string {
    return this.userId
      ? getUserOperatorStateStorageKey(this.userId)
      : LEGACY_OPERATOR_STATE_STORAGE_KEY;
  }

  load(): OperatorState {
    return this.readKey(this.storageKey) ?? createInitialOperatorState();
  }

  loadStored(): OperatorState | null {
    return this.readKey(this.storageKey);
  }

  loadLegacy(): OperatorState | null {
    const operatorState = this.readKey(LEGACY_OPERATOR_STATE_STORAGE_KEY);
    if (operatorState && isMeaningfulOperatorState(operatorState)) {
      return operatorState;
    }

    try {
      const stored = this.getStorage()?.getItem(
        LEGACY_TRAINING_PROGRESS_STORAGE_KEY,
      );
      const parsed: unknown = stored ? JSON.parse(stored) : null;
      if (!isTrainingProgress(parsed) || parsed.completedLessonIds.length === 0) {
        return operatorState;
      }

      const initial = createInitialOperatorState();
      const completedAt = parsed.updatedAt;
      return {
        ...initial,
        activeLevelId: parsed.lastLessonId ?? initial.activeLevelId,
        levelProgress: Object.fromEntries(
          parsed.completedLessonIds.map((lessonId) => [
            lessonId,
            {
              ...createEmptyLevelProgress(completedAt),
              maxStep: 7,
              completedAt,
            },
          ]),
        ),
        updatedAt: completedAt,
      };
    } catch {
      return operatorState;
    }
  }

  save(state: OperatorState): void {
    this.getStorage()?.setItem(this.storageKey, JSON.stringify(state));
  }

  clear(): void {
    this.getStorage()?.removeItem(this.storageKey);
  }
}
