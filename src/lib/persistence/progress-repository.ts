import type { TrainingProgress } from "./progress.ts";

export interface ProgressRepository {
  load(): TrainingProgress;
  save(progress: TrainingProgress): void;
  clear(): void;
}
