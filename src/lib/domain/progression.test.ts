import test from "node:test";
import assert from "node:assert/strict";
import type { OperatorLevel } from "../../content/types.ts";
import {
  calculateXp,
  getCampaignProgress,
  getRank,
  getRankProgress,
  isLevelUnlocked,
} from "./progression.ts";
import {
  createEmptyLevelProgress,
  createInitialOperatorState,
  type FieldMissionLog,
  type OperatorState,
} from "./operator-state.ts";

const levels = [
  { id: "one", xpReward: 120 },
  { id: "two", xpReward: 130 },
] as unknown as readonly OperatorLevel[];

test("rank progression follows the core XP thresholds", () => {
  assert.equal(getRank(0).name, "Explorer");
  assert.equal(getRank(399).name, "Explorer");
  assert.equal(getRank(400).name, "Relationship Builder");
  assert.equal(getRank(800).name, "Operator");
  assert.equal(getRank(1200).name, "Team Leader");
  assert.equal(getRank(1600).name, "Business Leader");
  assert.equal(getRankProgress(200, getRank(200)), 50);
});

test("XP is derived from completed work and cannot be double-awarded by rerendering", () => {
  const base = createInitialOperatorState();
  const state: OperatorState = {
    ...base,
    levelProgress: {
      one: {
        ...createEmptyLevelProgress(),
        completedAt: "2026-01-01T00:00:00.000Z",
      },
    },
    fieldMissions: [{} as FieldMissionLog],
  };

  assert.equal(calculateXp(state, levels), 170);
  assert.equal(calculateXp(state, levels), 170);
});

test("mission completion unlocks the next level and advances campaign progress", () => {
  const base = createInitialOperatorState();
  assert.equal(isLevelUnlocked("one", base, levels), true);
  assert.equal(isLevelUnlocked("two", base, levels), false);

  const state: OperatorState = {
    ...base,
    levelProgress: {
      one: {
        ...createEmptyLevelProgress(),
        completedAt: "2026-01-01T00:00:00.000Z",
      },
    },
  };

  assert.equal(isLevelUnlocked("two", state, levels), true);
  assert.equal(getCampaignProgress(state, levels), 50);
});

