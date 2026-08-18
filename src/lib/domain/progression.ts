import type { OperatorLevel } from "@/content/types";
import type { ExecutiveRole } from "@/lib/domain/executive-role";
import type { OperatorState } from "@/lib/domain/operator-state";

export interface Rank {
  readonly name: string;
  readonly minimumXp: number;
  readonly nextMinimumXp: number | null;
}

export const RANKS: readonly Rank[] = [
  { name: "Explorer", minimumXp: 0, nextMinimumXp: 400 },
  { name: "Relationship Builder", minimumXp: 400, nextMinimumXp: 800 },
  { name: "Operator", minimumXp: 800, nextMinimumXp: 1200 },
  { name: "Team Leader", minimumXp: 1200, nextMinimumXp: 1600 },
  { name: "Business Leader", minimumXp: 1600, nextMinimumXp: null },
];

export const CEO_RANKS: readonly Rank[] = [
  { name: "Business Analyst", minimumXp: 0, nextMinimumXp: 550 },
  { name: "Owner", minimumXp: 550, nextMinimumXp: 1200 },
  { name: "Investor", minimumXp: 1200, nextMinimumXp: 1900 },
  { name: "Dealmaker", minimumXp: 1900, nextMinimumXp: 2700 },
  { name: "Capital Allocator", minimumXp: 2700, nextMinimumXp: null },
];

export const PRESTIGE_RANKS = [
  "General Manager",
  "COO",
  "Portfolio Operator",
  "Vice President — Skadra Ventures",
  "Institution Builder",
] as const;

export const XP_VALUES = {
  fieldMission: 50,
  relationship: 15,
  customerAudit: 30,
  processMap: 30,
  journalEntry: 20,
  sharedVenture: 25,
  pipelineStage: 5,
} as const;

export function getCompletedLevelIds(
  state: OperatorState,
  levels?: readonly OperatorLevel[],
): readonly string[] {
  const allowedIds = levels
    ? new Set(levels.map((level) => level.id))
    : null;

  return Object.entries(state.levelProgress)
    .filter(([levelId]) => allowedIds === null || allowedIds.has(levelId))
    .filter(([, progress]) => progress.completedAt !== null)
    .map(([levelId]) => levelId);
}

export function calculateXp(
  state: OperatorState,
  levels: readonly OperatorLevel[],
  role: ExecutiveRole = state.profile.executiveRole ?? "coo",
): number {
  const completed = new Set(getCompletedLevelIds(state, levels));
  const levelXp = levels
    .filter((level) => completed.has(level.id))
    .reduce((total, level) => total + level.xpReward, 0);

  const pipelineXp = state.locations.reduce((total, location) => {
    const stageIndex = [
      "Identified",
      "Contacted",
      "Conversation",
      "Interested",
      "Meeting",
      "Proposal",
      "Negotiation",
      "Approved",
      "Installed",
      "Active",
    ].indexOf(location.stage);

    return total + Math.max(stageIndex, 0) * XP_VALUES.pipelineStage;
  }, 0);

  const roleMultiplier = role === "ceo" ? 1.1 : 1;
  const operatingEvidenceXp = Math.round(
    (
    levelXp +
    state.fieldMissions.length *
      (role === "ceo" ? 60 : XP_VALUES.fieldMission) +
    state.relationships.length * XP_VALUES.relationship +
    state.customerAudits.length * XP_VALUES.customerAudit +
    state.processMaps.length * XP_VALUES.processMap +
    state.journalEntries.length * XP_VALUES.journalEntry +
    state.sharedVentures.length *
      (role === "ceo" ? 40 : XP_VALUES.sharedVenture) +
    pipelineXp
    ) * roleMultiplier,
  );

  return operatingEvidenceXp + state.founderMissions.filter(
    (mission) =>
      mission.executiveRole === role && mission.status === "complete",
  ).length * 100;
}

export function getRank(xp: number, role: ExecutiveRole = "coo"): Rank {
  const ranks = role === "ceo" ? CEO_RANKS : RANKS;
  return [...ranks].reverse().find((rank) => xp >= rank.minimumXp) ?? ranks[0];
}

export function getRankProgress(xp: number, rank: Rank): number {
  if (rank.nextMinimumXp === null) {
    return 100;
  }

  return Math.min(
    100,
    Math.round(
      ((xp - rank.minimumXp) / (rank.nextMinimumXp - rank.minimumXp)) * 100,
    ),
  );
}

export function isLevelUnlocked(
  levelId: string,
  state: OperatorState,
  levels: readonly OperatorLevel[],
): boolean {
  const index = levels.findIndex((level) => level.id === levelId);

  if (index <= 0) {
    return index === 0;
  }

  return state.levelProgress[levels[index - 1].id]?.completedAt !== null &&
    state.levelProgress[levels[index - 1].id]?.completedAt !== undefined;
}

export function getCurrentLevel(
  state: OperatorState,
  levels: readonly OperatorLevel[],
): OperatorLevel {
  const nextIncomplete = levels.find(
    (level) => state.levelProgress[level.id]?.completedAt == null,
  );

  return nextIncomplete ?? levels[levels.length - 1];
}

export function getCampaignProgress(
  state: OperatorState,
  levels: readonly OperatorLevel[],
): number {
  const completed = getCompletedLevelIds(state, levels).length;
  return Math.round((completed / levels.length) * 100);
}

export function getNextActionLabel(state: OperatorState, level: OperatorLevel): string {
  const progress = state.levelProgress[level.id];

  if (!progress || progress.maxStep === 0) {
    return "Open the mission brief";
  }

  if (progress.quizScore === null) {
    return "Continue the teaching path";
  }

  if (!progress.projectDraft.trim()) {
    return "Build the level project";
  }

  if (progress.bossScore === null) {
    return "Enter the boss battle";
  }

  if (!progress.reflection.trim()) {
    return "Complete the reflection";
  }

  return "Complete the level";
}
