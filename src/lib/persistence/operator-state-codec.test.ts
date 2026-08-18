import test from "node:test";
import assert from "node:assert/strict";
import {
  createEmptyLevelProgress,
  createInitialOperatorState,
} from "../domain/operator-state.ts";
import {
  isMeaningfulOperatorState,
  parseOperatorState,
} from "./operator-state-codec.ts";

test("legacy version-one state is upgraded without losing lesson work", () => {
  const initial = createInitialOperatorState();
  const legacy = {
    ...initial,
    version: 1,
    levelProgress: {
      "follow-the-money": {
        ...createEmptyLevelProgress("2026-01-01T00:00:00.000Z"),
        practiceDraft: "A durable working answer",
        updatedAt: undefined,
      },
    },
    peopleLabSessions: undefined,
    achievementUnlocks: undefined,
    preferences: undefined,
    currentCampaignId: undefined,
    updatedAt: "2026-01-02T00:00:00.000Z",
  };

  const upgraded = parseOperatorState(legacy);

  assert.ok(upgraded);
  assert.equal(upgraded.version, 3);
  assert.equal(upgraded.profile.executiveRole, "coo");
  assert.ok(upgraded.profile.roleSelectedAt);
  assert.ok(upgraded.profile.onboardingCompletedAt);
  assert.equal(
    upgraded.levelProgress["follow-the-money"].practiceDraft,
    "A durable working answer",
  );
  assert.equal(
    upgraded.levelProgress["follow-the-money"].updatedAt,
    "2026-01-02T00:00:00.000Z",
  );
  assert.deepEqual(upgraded.peopleLabSessions, []);
  assert.equal(upgraded.currentCampaignId, "year-one-core-operator");
});

test("malformed roots are rejected instead of becoming authoritative state", () => {
  assert.equal(parseOperatorState({ version: 2, activeLevelId: 42 }), null);
  assert.equal(parseOperatorState("not state"), null);
});

test("meaningful progress detection ignores a fresh empty account", () => {
  const initial = createInitialOperatorState();
  assert.equal(isMeaningfulOperatorState(initial), false);
  assert.equal(
    isMeaningfulOperatorState({
      ...initial,
      levelProgress: {
        "follow-the-money": createEmptyLevelProgress(),
      },
    }),
    true,
  );
});

test("a fresh version-three account remains eligible for role selection", () => {
  const parsed = parseOperatorState(createInitialOperatorState({ name: "Andrew" }));

  assert.ok(parsed);
  assert.equal(parsed.profile.executiveRole, null);
  assert.equal(parsed.profile.roleSelectedAt, null);
  assert.equal(parsed.profile.onboardingCompletedAt, null);
});

test("founder mission evidence round-trips through the version-three codec", () => {
  const initial = createInitialOperatorState({
    name: "Andrew",
    executiveRole: "ceo",
    roleSelectedAt: "2026-08-18T10:00:00.000Z",
  });
  const parsed = parseOperatorState({
    ...initial,
    founderMissions: [
      {
        id: "founder-case-1",
        missionId: "founder-hvac-acquisition",
        executiveRole: "ceo",
        status: "complete",
        analysis: "Normalized earnings and downside evidence.",
        recommendation: "Renegotiate with a seller note.",
        decision: "renegotiate",
        reflection: "Operations evidence could change the structure.",
        completedAt: "2026-08-18T12:00:00.000Z",
        createdAt: "2026-08-18T10:00:00.000Z",
        updatedAt: "2026-08-18T12:00:00.000Z",
      },
    ],
  });

  assert.ok(parsed);
  assert.equal(parsed.founderMissions.length, 1);
  assert.equal(parsed.founderMissions[0].executiveRole, "ceo");
  assert.equal(parsed.founderMissions[0].decision, "renegotiate");
});
