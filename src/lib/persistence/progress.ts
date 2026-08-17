export const TRAINING_PROGRESS_VERSION = 1 as const;

export interface TrainingProgress {
  readonly version: typeof TRAINING_PROGRESS_VERSION;
  readonly completedLessonIds: readonly string[];
  readonly lastLessonId: string | null;
  readonly updatedAt: string;
}

export function createEmptyProgress(): TrainingProgress {
  return {
    version: TRAINING_PROGRESS_VERSION,
    completedLessonIds: [],
    lastLessonId: null,
    updatedAt: new Date(0).toISOString(),
  };
}

