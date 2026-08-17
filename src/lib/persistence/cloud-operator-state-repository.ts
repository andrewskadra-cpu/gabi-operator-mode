import type { OperatorState } from "../domain/operator-state.ts";

export interface CloudStateSnapshot {
  readonly exists: boolean;
  readonly state: OperatorState | null;
  readonly revision: number;
  readonly updatedAt: string | null;
}

export interface CloudSaveResult {
  readonly revision: number;
  readonly updatedAt: string;
}

export interface CloudOperatorStateRepository {
  load(): Promise<CloudStateSnapshot>;
  save(
    state: OperatorState,
    expectedRevision: number,
    requestId: string,
  ): Promise<CloudSaveResult>;
}

export class CloudConflictError extends Error {
  constructor(message = "Cloud progress changed on another device.") {
    super(message);
    this.name = "CloudConflictError";
  }
}
