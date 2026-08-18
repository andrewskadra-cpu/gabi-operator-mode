import test from "node:test";
import assert from "node:assert/strict";
import {
  createEmptyLevelProgress,
  createInitialOperatorState,
  type LocationOpportunity,
} from "../domain/operator-state.ts";
import { mergeOperatorStates } from "./operator-state-merge.ts";

function location(stage: LocationOpportunity["stage"], updatedAt: string) {
  return {
    id: "location-stable-id",
    company: "North Plant",
    contact: "Gabi",
    employeesOrTraffic: "300",
    currentVending: "None",
    problems: "No food access",
    commission: "",
    followUp: "",
    notes: "",
    stage,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt,
  } satisfies LocationOpportunity;
}

test("conflict merge preserves milestones, drafts, records, and furthest pipeline stage", () => {
  const initial = createInitialOperatorState();
  const first = {
    ...initial,
    levelProgress: {
      "follow-the-money": {
        ...createEmptyLevelProgress("2026-01-02T00:00:00.000Z"),
        maxStep: 5,
        projectDraft: "Device project work",
      },
    },
    locations: [location("Proposal", "2026-01-02T00:00:00.000Z")],
    achievementUnlocks: {
      "mission-accepted": "2026-01-02T00:00:00.000Z",
    },
    updatedAt: "2026-01-02T00:00:00.000Z",
  };
  const second = {
    ...initial,
    levelProgress: {
      "follow-the-money": {
        ...createEmptyLevelProgress("2026-01-03T00:00:00.000Z"),
        maxStep: 7,
        completedAt: "2026-01-03T00:00:00.000Z",
      },
    },
    locations: [location("Contacted", "2026-01-03T00:00:00.000Z")],
    updatedAt: "2026-01-03T00:00:00.000Z",
  };

  const merged = mergeOperatorStates(first, second);

  assert.equal(merged.levelProgress["follow-the-money"].maxStep, 7);
  assert.equal(
    merged.levelProgress["follow-the-money"].projectDraft,
    "Device project work",
  );
  assert.equal(merged.locations.length, 1);
  assert.equal(merged.locations[0].stage, "Proposal");
  assert.equal(
    merged.achievementUnlocks["mission-accepted"],
    "2026-01-02T00:00:00.000Z",
  );
});

test("conflict merge preserves role identity and founder mission evidence", () => {
  const base = createInitialOperatorState({
    name: "Andrew",
    executiveRole: "ceo",
    roleSelectedAt: "2026-08-18T08:00:00.000Z",
  });
  const first = {
    ...base,
    founderMissions: [
      {
        id: "founder-case-1",
        missionId: "founder-hvac-acquisition",
        executiveRole: "ceo" as const,
        status: "in-progress" as const,
        analysis: "Device analysis",
        recommendation: "",
        decision: null,
        reflection: "",
        completedAt: null,
        createdAt: "2026-08-18T09:00:00.000Z",
        updatedAt: "2026-08-18T09:00:00.000Z",
      },
    ],
    updatedAt: "2026-08-18T09:00:00.000Z",
  };
  const second = {
    ...base,
    founderMissions: [
      {
        ...first.founderMissions[0],
        status: "complete" as const,
        recommendation: "Renegotiate",
        decision: "renegotiate" as const,
        reflection: "Operating diligence is still required.",
        completedAt: "2026-08-18T10:00:00.000Z",
        updatedAt: "2026-08-18T10:00:00.000Z",
      },
    ],
    updatedAt: "2026-08-18T10:00:00.000Z",
  };

  const merged = mergeOperatorStates(first, second);

  assert.equal(merged.profile.executiveRole, "ceo");
  assert.equal(merged.profile.roleSelectedAt, "2026-08-18T08:00:00.000Z");
  assert.equal(merged.founderMissions.length, 1);
  assert.equal(merged.founderMissions[0].status, "complete");
  assert.equal(merged.founderMissions[0].decision, "renegotiate");
});
