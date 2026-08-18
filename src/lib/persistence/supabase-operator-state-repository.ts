import type { SupabaseClient } from "@supabase/supabase-js";
import { parseOperatorState } from "./operator-state-codec.ts";
import {
  CloudConflictError,
  type CloudOperatorStateRepository,
  type CloudSaveResult,
  type CloudStateSnapshot,
} from "./cloud-operator-state-repository.ts";
import type { Database, Json } from "../supabase/database.types.ts";
import type { OperatorState } from "../domain/operator-state.ts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function toJson(state: OperatorState): Json {
  return JSON.parse(JSON.stringify(state)) as Json;
}

function parseLoadResult(value: unknown): CloudStateSnapshot {
  if (!isRecord(value) || typeof value.exists !== "boolean") {
    throw new Error("Supabase returned an invalid progress response.");
  }

  if (!value.exists) {
    return {
      exists: false,
      state: null,
      revision: 0,
      updatedAt: null,
    };
  }

  const state = parseOperatorState(value.state);
  if (
    !state ||
    typeof value.revision !== "number" ||
    typeof value.updatedAt !== "string"
  ) {
    throw new Error("Cloud progress is present but malformed.");
  }

  return {
    exists: true,
    state,
    revision: value.revision,
    updatedAt: value.updatedAt,
  };
}

function parseSaveResult(value: unknown): CloudSaveResult {
  if (
    !isRecord(value) ||
    typeof value.revision !== "number" ||
    typeof value.updatedAt !== "string"
  ) {
    throw new Error("Supabase did not confirm the progress save.");
  }

  return {
    revision: value.revision,
    updatedAt: value.updatedAt,
  };
}

export class SupabaseOperatorStateRepository
  implements CloudOperatorStateRepository
{
  private readonly client: SupabaseClient<Database>;

  constructor(client: SupabaseClient<Database>) {
    this.client = client;
  }

  async load(): Promise<CloudStateSnapshot> {
    const { data, error } = await this.client.rpc("load_executive_state");

    if (error) {
      throw new Error(`Unable to load cloud progress: ${error.message}`);
    }

    return parseLoadResult(data);
  }

  async save(
    state: OperatorState,
    expectedRevision: number,
    requestId: string,
  ): Promise<CloudSaveResult> {
    const { data, error } = await this.client.rpc("save_executive_state", {
      p_state: toJson(state),
      p_expected_revision: expectedRevision,
      p_request_id: requestId,
    });

    if (error) {
      if (
        error.code === "40001" ||
        error.message.toLowerCase().includes("operator_state_conflict")
      ) {
        throw new CloudConflictError();
      }

      throw new Error(`Unable to save cloud progress: ${error.message}`);
    }

    return parseSaveResult(data);
  }
}
