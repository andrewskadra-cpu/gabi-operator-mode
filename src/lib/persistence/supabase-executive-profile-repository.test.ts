import test from "node:test";
import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../supabase/database.types.ts";
import { SupabaseExecutiveProfileRepository } from "./supabase-executive-profile-repository.ts";

test("role selection is persisted through the authenticated assignment RPC", async () => {
  const calls: { name: string; args: unknown }[] = [];
  const client = {
    rpc: async (name: string, args: unknown) => {
      calls.push({ name, args });
      return {
        data: {
          role: "ceo",
          selectedAt: "2026-08-18T12:00:00.000Z",
        },
        error: null,
      };
    },
  } as unknown as SupabaseClient<Database>;
  const repository = new SupabaseExecutiveProfileRepository(client);

  const result = await repository.assignRole("ceo");

  assert.deepEqual(calls, [
    { name: "assign_executive_role", args: { p_role: "ceo" } },
  ]);
  assert.equal(result.role, "ceo");
  assert.equal(result.selectedAt, "2026-08-18T12:00:00.000Z");
});

test("role selection fails closed when Supabase does not confirm it", async () => {
  const client = {
    rpc: async () => ({ data: { role: "owner" }, error: null }),
  } as unknown as SupabaseClient<Database>;
  const repository = new SupabaseExecutiveProfileRepository(client);

  await assert.rejects(
    () => repository.assignRole("coo"),
    /did not confirm the executive role assignment/,
  );
});
