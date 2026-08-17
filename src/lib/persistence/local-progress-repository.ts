import {
  TRAINING_PROGRESS_VERSION,
  createEmptyProgress,
  type TrainingProgress,
} from "@/lib/persistence/progress";
import type { ProgressRepository } from "@/lib/persistence/progress-repository";

const STORAGE_KEY = "skadra.operator-mode.progress.v1";

function isTrainingProgress(value: unknown): value is TrainingProgress {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<TrainingProgress>;

  return (
    candidate.version === TRAINING_PROGRESS_VERSION &&
    Array.isArray(candidate.completedLessonIds) &&
    candidate.completedLessonIds.every((id) => typeof id === "string") &&
    (candidate.lastLessonId === null || typeof candidate.lastLessonId === "string") &&
    typeof candidate.updatedAt === "string"
  );
}

export class LocalProgressRepository implements ProgressRepository {
  load(): TrainingProgress {
    if (typeof window === "undefined") {
      return createEmptyProgress();
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = stored ? JSON.parse(stored) : null;
      return isTrainingProgress(parsed) ? parsed : createEmptyProgress();
    } catch {
      return createEmptyProgress();
    }
  }

  save(progress: TrainingProgress): void {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }

  clear(): void {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }
}

