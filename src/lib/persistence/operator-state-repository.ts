import {
  OPERATOR_STATE_VERSION,
  createInitialOperatorState,
  type OperatorState,
} from "../domain/operator-state.ts";

const STORAGE_KEY = "skadra.operator-mode.state.v1";

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface OperatorStateRepository {
  load(): OperatorState;
  save(state: OperatorState): void;
  clear(): void;
}

function hasOperatorStateShape(value: unknown): value is OperatorState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<OperatorState>;

  return (
    candidate.version === OPERATOR_STATE_VERSION &&
    typeof candidate.activeLevelId === "string" &&
    typeof candidate.levelProgress === "object" &&
    Array.isArray(candidate.fieldMissions) &&
    Array.isArray(candidate.relationships) &&
    Array.isArray(candidate.customerAudits) &&
    Array.isArray(candidate.processMaps) &&
    Array.isArray(candidate.journalEntries) &&
    Array.isArray(candidate.locations) &&
    Array.isArray(candidate.sharedVentures)
  );
}

export class LocalOperatorStateRepository implements OperatorStateRepository {
  private readonly storage?: StorageAdapter;

  constructor(storage?: StorageAdapter) {
    this.storage = storage;
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

  load(): OperatorState {
    try {
      const stored = this.getStorage()?.getItem(STORAGE_KEY);
      const parsed: unknown = stored ? JSON.parse(stored) : null;
      return hasOperatorStateShape(parsed) ? parsed : createInitialOperatorState();
    } catch {
      return createInitialOperatorState();
    }
  }

  save(state: OperatorState): void {
    this.getStorage()?.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  clear(): void {
    this.getStorage()?.removeItem(STORAGE_KEY);
  }
}
