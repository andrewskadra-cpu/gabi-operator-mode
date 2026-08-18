import type { OperatorState } from "./operator-state.ts";
import { getCompletedLevelIds } from "./progression.ts";
import type { ExecutiveRole } from "./executive-role.ts";

export interface Achievement {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly mark: string;
  readonly audience: ExecutiveRole | "shared";
}

export const ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: "mission-accepted",
    title: "Mission Accepted",
    description: "Began the Operator Mode training path.",
    mark: "01",
    audience: "coo",
  },
  {
    id: "financially-fluent",
    title: "Financially Fluent",
    description: "Completed Follow the Money.",
    mark: "$",
    audience: "coo",
  },
  {
    id: "field-operator",
    title: "Field Operator",
    description: "Logged the first real-world mission.",
    mark: "F",
    audience: "coo",
  },
  {
    id: "build-the-room",
    title: "Build the Room",
    description: "Added the first professional relationship.",
    mark: "N",
    audience: "coo",
  },
  {
    id: "customer-lens",
    title: "Customer Lens",
    description: "Completed a customer-experience audit.",
    mark: "CX",
    audience: "coo",
  },
  {
    id: "systems-thinker",
    title: "Systems Thinker",
    description: "Mapped and improved a process.",
    mark: "S",
    audience: "coo",
  },
  {
    id: "reflective-operator",
    title: "Reflective Operator",
    description: "Saved the first weekly journal.",
    mark: "J",
    audience: "coo",
  },
  {
    id: "pipeline-builder",
    title: "Pipeline Builder",
    description: "Advanced a location to proposal or beyond.",
    mark: "P",
    audience: "coo",
  },
  {
    id: "integration-commander",
    title: "Integration Commander",
    description: "Completed the Year One operator campaign.",
    mark: "IC",
    audience: "coo",
  },
  {
    id: "ceo-read-the-numbers",
    title: "Read the Numbers",
    description: "Completed the first financial-statement analysis.",
    mark: "FS",
    audience: "ceo",
  },
  {
    id: "ceo-capital-allocator",
    title: "Capital Allocator",
    description: "Completed the first return-on-capital comparison.",
    mark: "CA",
    audience: "ceo",
  },
  {
    id: "ceo-deal-screen",
    title: "Deal Screen",
    description: "Analyzed the first business acquisition listing.",
    mark: "DS",
    audience: "ceo",
  },
  {
    id: "ceo-underwriter",
    title: "Underwriter",
    description: "Completed the first property underwriting.",
    mark: "UW",
    audience: "ceo",
  },
  {
    id: "ceo-asset-001",
    title: "Asset #001",
    description: "Completed the first integrated investment model.",
    mark: "A1",
    audience: "ceo",
  },
  {
    id: "ceo-campaign-one",
    title: "CEO Campaign I",
    description: "Completed all sixteen Owner's Foundation levels.",
    mark: "C1",
    audience: "ceo",
  },
  {
    id: "first-founder-mission",
    title: "First Founder Mission",
    description: "Completed one side of a shared founder mission.",
    mark: "FM",
    audience: "shared",
  },
  {
    id: "first-investment-committee",
    title: "First Investment Committee",
    description: "Submitted a role-specific acquisition case.",
    mark: "IC",
    audience: "shared",
  },
  {
    id: "first-real-location",
    title: "First Real Location",
    description: "Advanced a real location to installed or active.",
    mark: "L1",
    audience: "shared",
  },
  {
    id: "first-operating-asset",
    title: "First Operating Asset",
    description: "Activated a location or completed the Asset #001 model.",
    mark: "O1",
    audience: "shared",
  },
];

export function getUnlockedAchievementIds(
  state: OperatorState,
  role: ExecutiveRole = state.profile.executiveRole ?? "coo",
): readonly string[] {
  const completed = getCompletedLevelIds(state);
  const ids: string[] = [];

  if (
    role === "coo" &&
    Object.entries(state.levelProgress).some(
      ([levelId, progress]) =>
        !levelId.startsWith("ceo-") && progress.maxStep > 0,
    )
  ) {
    ids.push("mission-accepted");
  }
  if (role === "coo" && completed.includes("follow-the-money")) {
    ids.push("financially-fluent");
  }
  if (role === "coo" && state.fieldMissions.length > 0) {
    ids.push("field-operator");
  }
  if (role === "coo" && state.relationships.length > 0) {
    ids.push("build-the-room");
  }
  if (role === "coo" && state.customerAudits.length > 0) {
    ids.push("customer-lens");
  }
  if (role === "coo" && state.processMaps.length > 0) {
    ids.push("systems-thinker");
  }
  if (role === "coo" && state.journalEntries.length > 0) {
    ids.push("reflective-operator");
  }
  if (role === "coo" &&
    state.locations.some((location) =>
      ["Proposal", "Negotiation", "Approved", "Installed", "Active"].includes(location.stage),
    )
  ) {
    ids.push("pipeline-builder");
  }
  if (role === "coo" && completed.includes("integration-commander")) {
    ids.push("integration-commander");
  }

  if (role === "ceo" && completed.includes("ceo-financial-statements")) {
    ids.push("ceo-read-the-numbers");
  }
  if (role === "ceo" && completed.includes("ceo-roi-roic")) {
    ids.push("ceo-capital-allocator");
  }
  if (role === "ceo" && completed.includes("ceo-business-acquisitions")) {
    ids.push("ceo-deal-screen");
  }
  if (role === "ceo" && completed.includes("ceo-real-estate-underwriting")) {
    ids.push("ceo-underwriter");
  }
  if (role === "ceo" && completed.includes("ceo-financial-modeling")) {
    ids.push("ceo-asset-001");
  }
  if (role === "ceo" && completed.includes("ceo-capital-allocation")) {
    ids.push("ceo-campaign-one");
  }

  const completedFounderMissions = state.founderMissions.filter(
    (mission) => mission.status === "complete",
  );
  if (completedFounderMissions.length > 0) {
    ids.push("first-founder-mission");
  }
  if (
    completedFounderMissions.some(
      (mission) => mission.missionId === "founder-hvac-acquisition",
    )
  ) {
    ids.push("first-investment-committee");
  }
  if (
    state.locations.some((location) =>
      ["Installed", "Active"].includes(location.stage),
    )
  ) {
    ids.push("first-real-location");
  }
  if (
    state.locations.some((location) => location.stage === "Active") ||
    completed.includes("ceo-financial-modeling")
  ) {
    ids.push("first-operating-asset");
  }

  return ids;
}

export function getUnlockedAchievements(
  state: OperatorState,
  role: ExecutiveRole = state.profile.executiveRole ?? "coo",
): readonly Achievement[] {
  const unlocked = new Set(getUnlockedAchievementIds(state, role));
  return ACHIEVEMENTS.filter(
    (achievement) =>
      unlocked.has(achievement.id) &&
      (achievement.audience === role || achievement.audience === "shared"),
  );
}
