"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createEmptyLevelProgress,
  createInitialOperatorState,
  type AppView,
  type CustomerExperienceAudit,
  type FieldMissionLog,
  type JournalEntry,
  type LevelProgress,
  type LocationOpportunity,
  type OperatorState,
  type ProcessMap,
  type Relationship,
  type SharedVenture,
} from "@/lib/domain/operator-state";
import { advanceLocation } from "@/lib/domain/pipeline";
import { LocalOperatorStateRepository } from "@/lib/persistence/operator-state-repository";

type NewRecord<T extends { id: string; createdAt: string }> = Omit<T, "id" | "createdAt">;

function makeId(prefix: string): string {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  return prefix + "-" + suffix;
}

function stamp(state: OperatorState): OperatorState {
  return {
    ...state,
    updatedAt: new Date().toISOString(),
  };
}

export function useOperatorState() {
  const repository = useMemo(() => new LocalOperatorStateRepository(), []);
  const [state, setState] = useState<OperatorState>(() => createInitialOperatorState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      setState(repository.load());
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, [repository]);

  useEffect(() => {
    if (hydrated) {
      repository.save(state);
    }
  }, [hydrated, repository, state]);

  const updateState = useCallback(
    (updater: (current: OperatorState) => OperatorState) => {
      setState((current) => stamp(updater(current)));
    },
    [],
  );

  const setView = useCallback(
    (view: AppView) => updateState((current) => ({ ...current, lastView: view })),
    [updateState],
  );

  const selectLevel = useCallback(
    (levelId: string) =>
      updateState((current) => ({
        ...current,
        activeLevelId: levelId,
        lastView: "campaign",
      })),
    [updateState],
  );

  const updateLevel = useCallback(
    (levelId: string, updates: Partial<LevelProgress>) =>
      updateState((current) => {
        const existing = current.levelProgress[levelId] ?? createEmptyLevelProgress();

        return {
          ...current,
          levelProgress: {
            ...current.levelProgress,
            [levelId]: {
              ...existing,
              ...updates,
            },
          },
        };
      }),
    [updateState],
  );

  const unlockLevelStep = useCallback(
    (levelId: string, step: number) =>
      updateState((current) => {
        const existing = current.levelProgress[levelId] ?? createEmptyLevelProgress();

        return {
          ...current,
          levelProgress: {
            ...current.levelProgress,
            [levelId]: {
              ...existing,
              maxStep: Math.max(existing.maxStep, step),
            },
          },
        };
      }),
    [updateState],
  );

  const completeLevel = useCallback(
    (levelId: string) =>
      updateLevel(levelId, {
        completedAt: new Date().toISOString(),
        maxStep: 7,
      }),
    [updateLevel],
  );

  const addFieldMission = useCallback(
    (mission: NewRecord<FieldMissionLog>) =>
      updateState((current) => ({
        ...current,
        fieldMissions: [
          {
            ...mission,
            id: makeId("field"),
            createdAt: new Date().toISOString(),
          },
          ...current.fieldMissions,
        ],
      })),
    [updateState],
  );

  const addRelationship = useCallback(
    (relationship: NewRecord<Relationship>) =>
      updateState((current) => ({
        ...current,
        relationships: [
          {
            ...relationship,
            id: makeId("relationship"),
            createdAt: new Date().toISOString(),
          },
          ...current.relationships,
        ],
      })),
    [updateState],
  );

  const addCustomerAudit = useCallback(
    (audit: NewRecord<CustomerExperienceAudit>) =>
      updateState((current) => ({
        ...current,
        customerAudits: [
          {
            ...audit,
            id: makeId("audit"),
            createdAt: new Date().toISOString(),
          },
          ...current.customerAudits,
        ],
      })),
    [updateState],
  );

  const addProcessMap = useCallback(
    (processMap: NewRecord<ProcessMap>) =>
      updateState((current) => ({
        ...current,
        processMaps: [
          {
            ...processMap,
            id: makeId("process"),
            createdAt: new Date().toISOString(),
          },
          ...current.processMaps,
        ],
      })),
    [updateState],
  );

  const addJournalEntry = useCallback(
    (entry: NewRecord<JournalEntry>) =>
      updateState((current) => ({
        ...current,
        journalEntries: [
          {
            ...entry,
            id: makeId("journal"),
            createdAt: new Date().toISOString(),
          },
          ...current.journalEntries,
        ],
      })),
    [updateState],
  );

  const addLocation = useCallback(
    (location: NewRecord<LocationOpportunity>) =>
      updateState((current) => ({
        ...current,
        locations: [
          {
            ...location,
            id: makeId("location"),
            createdAt: new Date().toISOString(),
          },
          ...current.locations,
        ],
      })),
    [updateState],
  );

  const advanceLocationStage = useCallback(
    (locationId: string) =>
      updateState((current) => ({
        ...current,
        locations: current.locations.map((location) =>
          location.id === locationId ? advanceLocation(location) : location,
        ),
      })),
    [updateState],
  );

  const addSharedVenture = useCallback(
    (venture: NewRecord<SharedVenture>) =>
      updateState((current) => ({
        ...current,
        sharedVentures: [
          {
            ...venture,
            id: makeId("venture"),
            createdAt: new Date().toISOString(),
          },
          ...current.sharedVentures,
        ],
      })),
    [updateState],
  );

  const resetState = useCallback(() => {
    repository.clear();
    setState(createInitialOperatorState());
  }, [repository]);

  return {
    state,
    hydrated,
    setView,
    selectLevel,
    updateLevel,
    unlockLevelStep,
    completeLevel,
    addFieldMission,
    addRelationship,
    addCustomerAudit,
    addProcessMap,
    addJournalEntry,
    addLocation,
    advanceLocationStage,
    addSharedVenture,
    resetState,
  };
}

export type OperatorStateController = ReturnType<typeof useOperatorState>;
