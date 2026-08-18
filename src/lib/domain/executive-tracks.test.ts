import test from "node:test";
import assert from "node:assert/strict";
import { ceoYearOneLevels } from "../../content/levels/ceo-levels.ts";
import { levels01To04 } from "../../content/levels/levels-01-04.ts";
import { levels05To08 } from "../../content/levels/levels-05-08.ts";
import { levels09To12 } from "../../content/levels/levels-09-12.ts";
import { levels13To16 } from "../../content/levels/levels-13-16.ts";
import { founderMissions } from "../../content/founder-missions.ts";
import { getUnlockedAchievementIds } from "./achievements.ts";
import {
  EXECUTIVE_ROLE_DEFINITIONS,
  getExecutiveRoleDefinition,
} from "./executive-role.ts";
import {
  getExecutiveNextAction,
  getExecutiveSkillScores,
} from "./executive-scorecards.ts";
import {
  createEmptyLevelProgress,
  createInitialOperatorState,
  type OperatorState,
} from "./operator-state.ts";
import { calculateXp, getRank } from "./progression.ts";

const cooLevels = [
  ...levels01To04,
  ...levels05To08,
  ...levels09To12,
  ...levels13To16,
];

const expectedCeoTitles = [
  "Financial Statements",
  "Accounting",
  "Cash Flow",
  "Unit Economics",
  "ROI / ROIC",
  "Business Valuation",
  "SDE & EBITDA",
  "Debt & Financing",
  "Investment Analysis",
  "Negotiation",
  "Real Estate Underwriting",
  "Business Acquisition Fundamentals",
  "Due Diligence",
  "Financial Modeling",
  "Leadership & Delegation",
  "Capital Allocation",
];

test("CEO Campaign I has the required sixteen-level order and durable phase content", () => {
  assert.equal(ceoYearOneLevels.length, 16);
  assert.deepEqual(
    ceoYearOneLevels.map((level) => level.title),
    expectedCeoTitles,
  );
  assert.equal(new Set(ceoYearOneLevels.map((level) => level.id)).size, 16);

  for (const [index, level] of ceoYearOneLevels.entries()) {
    assert.equal(level.number, index + 1);
    assert.equal(level.executiveRole, "ceo");
    assert.equal(level.campaignId, "ceo-owners-foundation");
    assert.ok(level.concepts.length >= 3, `${level.id} needs teaching`);
    assert.ok(level.practice.prompt.length > 20, `${level.id} needs practice`);
    assert.ok(level.knowledgeChecks.length >= 2, `${level.id} needs a test`);
    assert.ok(level.project.deliverables.length >= 3, `${level.id} needs a project`);
    assert.ok(level.fieldMission.prompt.length > 20, `${level.id} needs field work`);
    assert.equal(level.bossBattle.options.length, 3, `${level.id} needs a boss`);
    assert.ok(level.reflectionPrompt.length > 20, `${level.id} needs reflection`);
  }
});

test("the original COO campaign remains intact with all stable level IDs", () => {
  assert.equal(cooLevels.length, 16);
  assert.deepEqual(
    cooLevels.map((level) => level.id),
    [
      "follow-the-money",
      "relationship-builder",
      "the-deal-room",
      "sell-without-being-salesy",
      "run-the-machine",
      "executive-presence-one",
      "build-the-room",
      "customer-hero",
      "brand-guardian",
      "inventory-boss",
      "build-the-team",
      "lead-the-team",
      "fire-yourself",
      "skadra-realty-operator",
      "multi-unit-mindset",
      "integration-commander",
    ],
  );
});

test("role definitions route accounts to distinct campaigns and first levels", () => {
  assert.equal(getExecutiveRoleDefinition("ceo").firstLevelId, "ceo-financial-statements");
  assert.equal(getExecutiveRoleDefinition("coo").firstLevelId, "follow-the-money");
  assert.notEqual(
    EXECUTIVE_ROLE_DEFINITIONS.ceo.campaignId,
    EXECUTIVE_ROLE_DEFINITIONS.coo.campaignId,
  );
  assert.equal(EXECUTIVE_ROLE_DEFINITIONS.ceo.commandName, "CEO Command Center");
  assert.equal(EXECUTIVE_ROLE_DEFINITIONS.coo.commandName, "COO Command Center");

  const fresh = createInitialOperatorState();
  assert.equal(
    getExecutiveNextAction(fresh, ceoYearOneLevels[0]).title,
    "Financial Statements",
  );
  assert.equal(
    getExecutiveNextAction(fresh, cooLevels[0]).title,
    "Follow the Money",
  );
});

test("executive scorecards and next actions are derived from durable lesson evidence", () => {
  const firstLevel = ceoYearOneLevels[0];
  const state: OperatorState = {
    ...createInitialOperatorState({ executiveRole: "ceo" }),
    levelProgress: {
      [firstLevel.id]: {
        ...createEmptyLevelProgress(),
        maxStep: 7,
        quizScore: 90,
        bossScore: 100,
        practiceDraft: "A complete practice answer with evidence.",
        projectDraft: "A complete financial statement analysis project.",
        reflection: "I need to reconcile cash, earnings, and balance-sheet change.",
        completedAt: "2026-08-18T12:00:00.000Z",
      },
    },
  };
  const scores = getExecutiveSkillScores(state, ceoYearOneLevels, "ceo");

  assert.ok(scores.find((item) => item.skill === "finance")?.score);
  assert.equal(getExecutiveNextAction(state, firstLevel).kind, "reflection");
});

test("CEO XP, ranks, and achievements are role-aware and deterministic", () => {
  const firstLevel = ceoYearOneLevels[0];
  const state: OperatorState = {
    ...createInitialOperatorState({ executiveRole: "ceo" }),
    levelProgress: {
      [firstLevel.id]: {
        ...createEmptyLevelProgress(),
        completedAt: "2026-08-18T12:00:00.000Z",
      },
    },
  };

  const firstXp = calculateXp(state, ceoYearOneLevels, "ceo");
  assert.equal(firstXp, calculateXp(state, ceoYearOneLevels, "ceo"));
  assert.equal(getRank(0, "ceo").name, "Business Analyst");
  assert.ok(getUnlockedAchievementIds(state, "ceo").includes("ceo-read-the-numbers"));
  assert.equal(getUnlockedAchievementIds(state, "ceo").includes("financially-fluent"), false);
});

test("founder missions define independent CEO and COO responsibilities", () => {
  assert.equal(founderMissions.length, 2);
  for (const mission of founderMissions) {
    assert.notEqual(mission.roles.ceo.objective, mission.roles.coo.objective);
    assert.ok(mission.roles.ceo.responsibilities.length >= 4);
    assert.ok(mission.roles.coo.responsibilities.length >= 4);
  }
});
