import test from "node:test";
import assert from "node:assert/strict";
import { createExecutiveDataExport } from "./data-export.ts";
import { createInitialOperatorState } from "./operator-state.ts";

test("portable exports include role selection and founder mission evidence", () => {
  const state = {
    ...createInitialOperatorState({
      name: "Andrew",
      executiveRole: "ceo" as const,
      roleSelectedAt: "2026-08-18T10:00:00.000Z",
    }),
    founderMissions: [
      {
        id: "founder-case-1",
        missionId: "founder-first-vending-location",
        executiveRole: "ceo" as const,
        status: "complete" as const,
        analysis: "The base case clears the return threshold.",
        recommendation: "Deploy within a fixed capital limit.",
        decision: "deploy" as const,
        reflection: "The COO site evidence can change the demand case.",
        completedAt: "2026-08-18T12:00:00.000Z",
        createdAt: "2026-08-18T10:00:00.000Z",
        updatedAt: "2026-08-18T12:00:00.000Z",
      },
    ],
  };
  const exported = createExecutiveDataExport(
    { id: "andrew-user", email: "andrew@example.com", displayName: "Andrew" },
    state,
    "2026-08-18T13:00:00.000Z",
  );

  assert.equal(exported.format, "skadra-g-ops-backup");
  assert.equal(exported.formatVersion, 2);
  assert.equal(exported.account.executiveRole, "ceo");
  assert.equal(exported.operatorState.founderMissions[0].decision, "deploy");
});
