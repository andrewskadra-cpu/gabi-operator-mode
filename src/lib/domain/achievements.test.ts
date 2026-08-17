import test from "node:test";
import assert from "node:assert/strict";
import {
  createEmptyLevelProgress,
  createInitialOperatorState,
  type FieldMissionLog,
  type OperatorState,
  type Relationship,
} from "./operator-state.ts";
import { getUnlockedAchievementIds } from "./achievements.ts";

test("achievements unlock from durable milestone evidence", () => {
  const base = createInitialOperatorState();
  const state: OperatorState = {
    ...base,
    levelProgress: {
      "follow-the-money": {
        ...createEmptyLevelProgress(),
        maxStep: 7,
        completedAt: "2026-01-01T00:00:00.000Z",
      },
    },
    fieldMissions: [{} as FieldMissionLog],
    relationships: [{} as Relationship],
  };

  const unlocked = getUnlockedAchievementIds(state);

  assert.ok(unlocked.includes("mission-accepted"));
  assert.ok(unlocked.includes("financially-fluent"));
  assert.ok(unlocked.includes("field-operator"));
  assert.ok(unlocked.includes("build-the-room"));
  assert.equal(unlocked.includes("integration-commander"), false);
});

