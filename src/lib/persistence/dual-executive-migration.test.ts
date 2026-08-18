import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const migration = readFileSync(
  new URL("../../../supabase/migrations/202608180001_dual_executive_tracks.sql", import.meta.url),
  "utf8",
).toLowerCase();

test("the V2 migration is additive and backfills existing training accounts to COO", () => {
  assert.equal(/\bdrop\s+(table|type|column|schema)\b/.test(migration), false);
  assert.equal(/\btruncate\b/.test(migration), false);
  assert.match(migration, /add column if not exists executive_role/);
  assert.match(migration, /set executive_role = 'coo'/);
  assert.match(migration, /from public\.training_progress/);
});

test("founder mission storage has own-user and role-matching RLS", () => {
  assert.match(migration, /alter table public\.founder_mission_progress enable row level security/);
  assert.match(migration, /founder_mission_progress_select_own/);
  assert.match(migration, /founder_mission_progress_insert_own/);
  assert.match(migration, /founder_mission_progress_update_own/);
  assert.match(migration, /auth\.uid\(\)\) = user_id/);
  assert.match(migration, /executive_role = founder_mission_progress\.executive_role/);
});

test("role assignment is one-time and executive saves reject role mismatches", () => {
  assert.match(migration, /executive_role_already_assigned/);
  assert.match(migration, /executive_role_mismatch/);
  assert.match(migration, /founder_mission_role_mismatch/);
  assert.match(migration, /revoke execute on function public\.assign_executive_role/);
  assert.match(migration, /grant execute on function public\.assign_executive_role/);
});
