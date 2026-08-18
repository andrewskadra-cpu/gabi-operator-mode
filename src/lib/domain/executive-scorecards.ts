import type { OperatorLevel } from "@/content/types";
import type {
  ExecutiveRole,
  ExecutiveSkill,
} from "./executive-role.ts";
import { getExecutiveRoleDefinition } from "./executive-role.ts";
import type { LevelProgress, OperatorState } from "./operator-state.ts";

export interface ExecutiveSkillScore {
  readonly skill: ExecutiveSkill;
  readonly score: number;
  readonly evidenceCount: number;
}

const COO_LEVEL_SKILLS: Readonly<Record<string, readonly ExecutiveSkill[]>> = {
  "follow-the-money": ["operations", "execution"],
  "relationship-builder": ["relationships", "customers"],
  "the-deal-room": ["relationships", "leadership"],
  "sell-without-being-salesy": ["customers", "relationships"],
  "run-the-machine": ["operations", "process-improvement", "execution"],
  "executive-presence-one": ["leadership", "execution"],
  "build-the-room": ["relationships", "field-experience"],
  "customer-hero": ["customers", "execution"],
  "brand-guardian": ["customers", "leadership"],
  "inventory-boss": ["operations", "process-improvement"],
  "build-the-team": ["people", "leadership"],
  "lead-the-team": ["people", "leadership", "execution"],
  "fire-yourself": ["leadership", "process-improvement"],
  "skadra-realty-operator": ["operations", "field-experience"],
  "multi-unit-mindset": ["operations", "process-improvement"],
  "integration-commander": ["people", "execution", "leadership"],
};

function levelEvidenceScore(progress: LevelProgress | undefined): number {
  if (!progress) {
    return 0;
  }

  const stepScore = Math.round((Math.min(progress.maxStep, 7) / 7) * 15);
  const quizScore = Math.round((progress.quizScore ?? 0) * 0.2);
  const bossScore = Math.round((progress.bossScore ?? 0) * 0.2);
  const projectScore = progress.projectDraft.trim().length >= 20 ? 15 : 0;
  const reflectionScore = progress.reflection.trim().length >= 20 ? 10 : 0;
  const completionScore = progress.completedAt ? 20 : 0;

  return Math.min(
    100,
    stepScore + quizScore + bossScore + projectScore + reflectionScore + completionScore,
  );
}

function skillsForLevel(
  role: ExecutiveRole,
  level: OperatorLevel,
): readonly ExecutiveSkill[] {
  return role === "ceo"
    ? level.scoreSkills ?? []
    : COO_LEVEL_SKILLS[level.id] ?? [];
}

export function getExecutiveSkillScores(
  state: OperatorState,
  levels: readonly OperatorLevel[],
  role: ExecutiveRole,
): readonly ExecutiveSkillScore[] {
  const configuredSkills = getExecutiveRoleDefinition(role).scorecardSkills;

  return configuredSkills.map((skill) => {
    const evidence = levels
      .filter((level) => skillsForLevel(role, level).includes(skill))
      .map((level) => levelEvidenceScore(state.levelProgress[level.id]))
      .filter((score) => score > 0);

    if (skill === "field-experience" && state.fieldMissions.length > 0) {
      evidence.push(Math.min(100, state.fieldMissions.length * 20));
    }

    return {
      skill,
      score:
        evidence.length === 0
          ? 0
          : Math.round(
              evidence.reduce((total, score) => total + score, 0) /
                evidence.length,
            ),
      evidenceCount: evidence.length,
    };
  });
}

export interface ExecutiveNextAction {
  readonly kind: "lesson" | "field" | "project" | "decision" | "reflection";
  readonly label: string;
  readonly title: string;
  readonly description: string;
}

export function getExecutiveNextAction(
  state: OperatorState,
  level: OperatorLevel,
): ExecutiveNextAction {
  const progress = state.levelProgress[level.id];

  if (!progress || progress.maxStep === 0) {
    return {
      kind: "lesson",
      label: "Open the mission brief",
      title: level.title,
      description: level.missionBrief,
    };
  }
  if (progress.quizScore === null) {
    return {
      kind: "lesson",
      label: "Continue · Teach + practice",
      title: level.title,
      description: level.practice.prompt,
    };
  }
  if (!progress.projectDraft.trim()) {
    return {
      kind: "project",
      label: "Build the project",
      title: level.project.title,
      description: level.project.prompt,
    };
  }
  if (progress.maxStep < 6 && state.fieldMissions.length === 0) {
    return {
      kind: "field",
      label: "Complete a field mission",
      title: level.fieldMission.title,
      description: level.fieldMission.prompt,
    };
  }
  if (progress.bossScore === null) {
    return {
      kind: "decision",
      label: "Enter the boss battle",
      title: level.bossBattle.title,
      description: level.bossBattle.scenario,
    };
  }

  return {
    kind: "reflection",
    label: progress.completedAt ? "Review the completed level" : "Complete the reflection",
    title: level.title,
    description: level.reflectionPrompt,
  };
}
