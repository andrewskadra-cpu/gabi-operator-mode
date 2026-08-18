import { getUnlockedAchievementIds } from "../domain/achievements.ts";
import {
  LOCATION_STAGES,
  type LevelProgress,
  type LocationOpportunity,
  type OperatorState,
} from "../domain/operator-state.ts";

function laterTimestamp(first: string, second: string): string {
  return first >= second ? first : second;
}

function earlierTimestamp(first: string, second: string): string {
  return first <= second ? first : second;
}

function latestNonEmpty(
  first: string,
  second: string,
  preferSecond: boolean,
): string {
  const preferred = preferSecond ? second : first;
  const fallback = preferSecond ? first : second;
  return preferred.trim() ? preferred : fallback;
}

function mergeLevelProgress(
  first: LevelProgress,
  second: LevelProgress,
): LevelProgress {
  const preferSecond = second.updatedAt >= first.updatedAt;
  const newer = preferSecond ? second : first;
  const older = preferSecond ? first : second;

  return {
    maxStep: Math.max(first.maxStep, second.maxStep),
    quizAnswers: {
      ...older.quizAnswers,
      ...newer.quizAnswers,
    },
    quizScore: newer.quizScore ?? older.quizScore,
    practiceDraft: latestNonEmpty(
      first.practiceDraft,
      second.practiceDraft,
      preferSecond,
    ),
    projectDraft: latestNonEmpty(
      first.projectDraft,
      second.projectDraft,
      preferSecond,
    ),
    bossAnswerId: newer.bossAnswerId ?? older.bossAnswerId,
    bossScore: newer.bossScore ?? older.bossScore,
    reflection: latestNonEmpty(
      first.reflection,
      second.reflection,
      preferSecond,
    ),
    completedAt:
      first.completedAt && second.completedAt
        ? earlierTimestamp(first.completedAt, second.completedAt)
        : first.completedAt ?? second.completedAt,
    updatedAt: laterTimestamp(first.updatedAt, second.updatedAt),
  };
}

function mergeLevelProgressMap(
  first: OperatorState["levelProgress"],
  second: OperatorState["levelProgress"],
): OperatorState["levelProgress"] {
  const levelIds = new Set([...Object.keys(first), ...Object.keys(second)]);

  return Object.fromEntries(
    [...levelIds].map((levelId) => {
      const firstProgress = first[levelId];
      const secondProgress = second[levelId];

      return [
        levelId,
        firstProgress && secondProgress
          ? mergeLevelProgress(firstProgress, secondProgress)
          : firstProgress ?? secondProgress,
      ];
    }),
  );
}

function mergeRecords<T extends { id: string; createdAt: string; updatedAt: string }>(
  first: readonly T[],
  second: readonly T[],
  mergeSameId?: (firstRecord: T, secondRecord: T) => T,
): readonly T[] {
  const records = new Map<string, T>();

  for (const record of [...first, ...second]) {
    const existing = records.get(record.id);
    if (!existing) {
      records.set(record.id, record);
      continue;
    }

    records.set(
      record.id,
      mergeSameId
        ? mergeSameId(existing, record)
        : record.updatedAt >= existing.updatedAt
          ? record
          : existing,
    );
  }

  return [...records.values()].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  );
}

function mergeLocation(
  first: LocationOpportunity,
  second: LocationOpportunity,
): LocationOpportunity {
  const newer = second.updatedAt >= first.updatedAt ? second : first;
  const furthestStage =
    LOCATION_STAGES.indexOf(first.stage) >= LOCATION_STAGES.indexOf(second.stage)
      ? first.stage
      : second.stage;

  return {
    ...newer,
    stage: furthestStage,
    createdAt: earlierTimestamp(first.createdAt, second.createdAt),
    updatedAt: laterTimestamp(first.updatedAt, second.updatedAt),
  };
}

export function materializeAchievementUnlocks(
  state: OperatorState,
  unlockedAt = new Date().toISOString(),
): OperatorState {
  const achievementUnlocks = { ...state.achievementUnlocks };

  for (const achievementId of getUnlockedAchievementIds(state)) {
    achievementUnlocks[achievementId] ??= unlockedAt;
  }

  return {
    ...state,
    achievementUnlocks,
  };
}

export function mergeOperatorStates(
  first: OperatorState,
  second: OperatorState,
): OperatorState {
  const preferSecond = second.updatedAt >= first.updatedAt;
  const newer = preferSecond ? second : first;
  const older = preferSecond ? first : second;
  const achievementIds = new Set([
    ...Object.keys(first.achievementUnlocks),
    ...Object.keys(second.achievementUnlocks),
  ]);
  const achievementUnlocks = Object.fromEntries(
    [...achievementIds].map((achievementId) => {
      const firstDate = first.achievementUnlocks[achievementId];
      const secondDate = second.achievementUnlocks[achievementId];
      return [
        achievementId,
        firstDate && secondDate
          ? earlierTimestamp(firstDate, secondDate)
          : firstDate ?? secondDate,
      ];
    }),
  );

  return materializeAchievementUnlocks({
    ...older,
    ...newer,
    profile: {
      ...newer.profile,
      executiveRole:
        newer.profile.executiveRole ?? older.profile.executiveRole,
      roleSelectedAt:
        newer.profile.roleSelectedAt && older.profile.roleSelectedAt
          ? earlierTimestamp(
              newer.profile.roleSelectedAt,
              older.profile.roleSelectedAt,
            )
          : newer.profile.roleSelectedAt ?? older.profile.roleSelectedAt,
      onboardingCompletedAt:
        newer.profile.onboardingCompletedAt &&
        older.profile.onboardingCompletedAt
          ? earlierTimestamp(
              newer.profile.onboardingCompletedAt,
              older.profile.onboardingCompletedAt,
            )
          : newer.profile.onboardingCompletedAt ??
            older.profile.onboardingCompletedAt,
    },
    preferences: newer.preferences,
    levelProgress: mergeLevelProgressMap(first.levelProgress, second.levelProgress),
    fieldMissions: mergeRecords(first.fieldMissions, second.fieldMissions),
    relationships: mergeRecords(first.relationships, second.relationships),
    customerAudits: mergeRecords(first.customerAudits, second.customerAudits),
    processMaps: mergeRecords(first.processMaps, second.processMaps),
    journalEntries: mergeRecords(first.journalEntries, second.journalEntries),
    locations: mergeRecords(first.locations, second.locations, mergeLocation),
    sharedVentures: mergeRecords(first.sharedVentures, second.sharedVentures),
    peopleLabSessions: mergeRecords(
      first.peopleLabSessions,
      second.peopleLabSessions,
    ),
    founderMissions: mergeRecords(
      first.founderMissions,
      second.founderMissions,
    ),
    achievementUnlocks,
    createdAt: earlierTimestamp(first.createdAt, second.createdAt),
    updatedAt: laterTimestamp(first.updatedAt, second.updatedAt),
  });
}
