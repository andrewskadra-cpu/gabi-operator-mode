import {
  LOCATION_STAGES,
  type LocationOpportunity,
  type LocationStage,
} from "./operator-state.ts";

export function getNextLocationStage(stage: LocationStage): LocationStage {
  const index = LOCATION_STAGES.indexOf(stage);
  return LOCATION_STAGES[Math.min(index + 1, LOCATION_STAGES.length - 1)];
}

export function advanceLocation(opportunity: LocationOpportunity): LocationOpportunity {
  return {
    ...opportunity,
    stage: getNextLocationStage(opportunity.stage),
  };
}

export function getPipelineProgress(stage: LocationStage): number {
  const index = LOCATION_STAGES.indexOf(stage);
  return Math.round(((index + 1) / LOCATION_STAGES.length) * 100);
}
