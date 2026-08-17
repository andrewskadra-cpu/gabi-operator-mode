import type { StorageAdapter } from "./operator-state-repository.ts";

const SYNC_METADATA_VERSION = 1 as const;

export type LegacyMigrationDecision = "imported" | "kept-cloud";

export interface LocalSyncMetadata {
  readonly version: typeof SYNC_METADATA_VERSION;
  readonly userId: string;
  readonly cloudRevision: number;
  readonly pending: boolean;
  readonly pendingRequestId: string | null;
  readonly lastSuccessfulSyncAt: string | null;
  readonly lastCloudUpdatedAt: string | null;
  readonly legacyMigrationDecision: LegacyMigrationDecision | null;
}

function getStorageKey(userId: string): string {
  return `skadra.operator-mode.sync.v1.${userId}`;
}

function isMetadata(value: unknown, userId: string): value is LocalSyncMetadata {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<LocalSyncMetadata>;
  return (
    candidate.version === SYNC_METADATA_VERSION &&
    candidate.userId === userId &&
    typeof candidate.cloudRevision === "number" &&
    typeof candidate.pending === "boolean" &&
    (candidate.pendingRequestId === null ||
      typeof candidate.pendingRequestId === "string") &&
    (candidate.lastSuccessfulSyncAt === null ||
      typeof candidate.lastSuccessfulSyncAt === "string") &&
    (candidate.lastCloudUpdatedAt === null ||
      typeof candidate.lastCloudUpdatedAt === "string") &&
    (candidate.legacyMigrationDecision === null ||
      candidate.legacyMigrationDecision === "imported" ||
      candidate.legacyMigrationDecision === "kept-cloud")
  );
}

export class LocalSyncMetadataRepository {
  private readonly userId: string;
  private readonly storage?: StorageAdapter;

  constructor(userId: string, storage?: StorageAdapter) {
    this.userId = userId;
    this.storage = storage;
  }

  private getStorage(): StorageAdapter | undefined {
    if (this.storage) {
      return this.storage;
    }

    return typeof window !== "undefined" ? window.localStorage : undefined;
  }

  load(): LocalSyncMetadata {
    try {
      const stored = this.getStorage()?.getItem(getStorageKey(this.userId));
      const parsed: unknown = stored ? JSON.parse(stored) : null;
      if (isMetadata(parsed, this.userId)) {
        return parsed;
      }
    } catch {
      // A malformed sync marker must not make the underlying local backup unreadable.
    }

    return {
      version: SYNC_METADATA_VERSION,
      userId: this.userId,
      cloudRevision: 0,
      pending: false,
      pendingRequestId: null,
      lastSuccessfulSyncAt: null,
      lastCloudUpdatedAt: null,
      legacyMigrationDecision: null,
    };
  }

  save(metadata: LocalSyncMetadata): void {
    this.getStorage()?.setItem(
      getStorageKey(this.userId),
      JSON.stringify(metadata),
    );
  }
}
