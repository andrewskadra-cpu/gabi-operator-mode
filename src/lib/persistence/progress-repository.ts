import type { TrainingProgress } from "@/lib/persistence/progress";

export interface ProgressRepository {
  load(): TrainingProgress;
  save(progress: TrainingProgress): void;
  clear(): void;
}

