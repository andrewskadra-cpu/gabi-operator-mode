import type { OperatorState } from "./operator-state.ts";
import { getCompletedLevelIds } from "./progression.ts";

export interface Achievement {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly mark: string;
}

export const ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: "mission-accepted",
    title: "Mission Accepted",
    description: "Began the Operator Mode training path.",
    mark: "01",
  },
  {
    id: "financially-fluent",
    title: "Financially Fluent",
    description: "Completed Follow the Money.",
    mark: "$",
  },
  {
    id: "field-operator",
    title: "Field Operator",
    description: "Logged the first real-world mission.",
    mark: "F",
  },
  {
    id: "build-the-room",
    title: "Build the Room",
    description: "Added the first professional relationship.",
    mark: "N",
  },
  {
    id: "customer-lens",
    title: "Customer Lens",
    description: "Completed a customer-experience audit.",
    mark: "CX",
  },
  {
    id: "systems-thinker",
    title: "Systems Thinker",
    description: "Mapped and improved a process.",
    mark: "S",
  },
  {
    id: "reflective-operator",
    title: "Reflective Operator",
    description: "Saved the first weekly journal.",
    mark: "J",
  },
  {
    id: "pipeline-builder",
    title: "Pipeline Builder",
    description: "Advanced a location to proposal or beyond.",
    mark: "P",
  },
  {
    id: "integration-commander",
    title: "Integration Commander",
    description: "Completed the Year One operator campaign.",
    mark: "IC",
  },
];

export function getUnlockedAchievementIds(state: OperatorState): readonly string[] {
  const completed = getCompletedLevelIds(state);
  const ids: string[] = [];

  if (Object.values(state.levelProgress).some((progress) => progress.maxStep > 0)) {
    ids.push("mission-accepted");
  }
  if (completed.includes("follow-the-money")) {
    ids.push("financially-fluent");
  }
  if (state.fieldMissions.length > 0) {
    ids.push("field-operator");
  }
  if (state.relationships.length > 0) {
    ids.push("build-the-room");
  }
  if (state.customerAudits.length > 0) {
    ids.push("customer-lens");
  }
  if (state.processMaps.length > 0) {
    ids.push("systems-thinker");
  }
  if (state.journalEntries.length > 0) {
    ids.push("reflective-operator");
  }
  if (
    state.locations.some((location) =>
      ["Proposal", "Negotiation", "Approved", "Installed", "Active"].includes(location.stage),
    )
  ) {
    ids.push("pipeline-builder");
  }
  if (completed.length >= 16) {
    ids.push("integration-commander");
  }

  return ids;
}

export function getUnlockedAchievements(state: OperatorState): readonly Achievement[] {
  const unlocked = new Set(getUnlockedAchievementIds(state));
  return ACHIEVEMENTS.filter((achievement) => unlocked.has(achievement.id));
}
