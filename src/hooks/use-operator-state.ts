"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createEmptyLevelProgress,
  createInitialOperatorState,
  type AppView,
  type CustomerExperienceAudit,
  type FieldMissionLog,
  type JournalEntry,
  type LevelProgress,
  type LocationOpportunity,
  type OperatorPreferences,
  type OperatorState,
  type ProcessMap,
  type Relationship,
  type SharedVenture,
} from "@/lib/domain/operator-state";
import { advanceLocation } from "@/lib/domain/pipeline";
import { LocalSyncMetadataRepository } from "@/lib/persistence/local-sync-metadata-repository";
import {
  materializeAchievementUnlocks,
  mergeOperatorStates,
} from "@/lib/persistence/operator-state-merge";
import {
  getUserOperatorStateStorageKey,
  LocalOperatorStateRepository,
} from "@/lib/persistence/operator-state-repository";
import {
  OperatorStateSyncEngine,
  type LegacyMigrationCandidate,
  type MigrationChoice,
  type SyncStatus,
} from "@/lib/persistence/operator-state-sync-engine";
import { parseOperatorState } from "@/lib/persistence/operator-state-codec";
import { SupabaseOperatorStateRepository } from "@/lib/persistence/supabase-operator-state-repository";
import { createClient } from "@/lib/supabase/client";

type NewRecord<T extends { id: string; createdAt: string; updatedAt: string }> =
  Omit<T, "id" | "createdAt" | "updatedAt">;

export interface OperatorAccount {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
}

function makeId(prefix: string): string {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  return prefix + "-" + suffix;
}

function withRecordMetadata<T extends object>(
  prefix: string,
  record: T,
): T & { id: string; createdAt: string; updatedAt: string } {
  const now = new Date().toISOString();
  return {
    ...record,
    id: makeId(prefix),
    createdAt: now,
    updatedAt: now,
  };
}

function stamp(state: OperatorState, updatedAt: string): OperatorState {
  return materializeAchievementUnlocks(
    {
      ...state,
      updatedAt,
    },
    updatedAt,
  );
}

export function useOperatorState(account: OperatorAccount) {
  const [state, setState] = useState<OperatorState>(() =>
    createInitialOperatorState(),
  );
  const [hydrated, setHydrated] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    phase: "loading",
    lastSuccessfulSyncAt: null,
    message: null,
  });
  const [migration, setMigration] =
    useState<LegacyMigrationCandidate | null>(null);
  const urgentSaveRef = useRef(false);
  const skipNextSaveRef = useRef(false);
  const syncEngineRef = useRef<OperatorStateSyncEngine | null>(null);

  const repository = useMemo(
    () => new LocalOperatorStateRepository(undefined, account.id),
    [account.id],
  );
  useEffect(() => {
    let cancelled = false;
    const cloudRepository = new SupabaseOperatorStateRepository(createClient());
    const metadataRepository = new LocalSyncMetadataRepository(account.id);
    const syncEngine = new OperatorStateSyncEngine(
      repository,
      cloudRepository,
      metadataRepository,
      setSyncStatus,
      (resolvedState) => {
        skipNextSaveRef.current = true;
        setState(resolvedState);
      },
    );
    syncEngineRef.current = syncEngine;

    void syncEngine.hydrate().then((result) => {
      if (cancelled) {
        return;
      }

      skipNextSaveRef.current = true;
      setState(result.state);
      setMigration(result.migration);
      setHydrated(true);
    });

    return () => {
      cancelled = true;
      syncEngine.dispose();
      if (syncEngineRef.current === syncEngine) {
        syncEngineRef.current = null;
      }
    };
  }, [account.id, repository]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    syncEngineRef.current?.save(state, urgentSaveRef.current);
    urgentSaveRef.current = false;
  }, [hydrated, state]);

  useEffect(() => {
    const retry = () => void syncEngineRef.current?.retry();
    const acceptOtherTabBackup = (event: StorageEvent) => {
      if (
        event.key !== getUserOperatorStateStorageKey(account.id) ||
        !event.newValue
      ) {
        return;
      }

      try {
        const incoming = parseOperatorState(JSON.parse(event.newValue) as unknown);
        if (incoming) {
          setState((current) => mergeOperatorStates(current, incoming));
        }
      } catch {
        // Ignore malformed cross-tab messages; the last valid backup remains intact.
      }
    };

    window.addEventListener("online", retry);
    window.addEventListener("storage", acceptOtherTabBackup);
    return () => {
      window.removeEventListener("online", retry);
      window.removeEventListener("storage", acceptOtherTabBackup);
    };
  }, [account.id]);

  const updateState = useCallback(
    (
      updater: (current: OperatorState) => OperatorState,
      immediate = false,
    ) => {
      urgentSaveRef.current ||= immediate;
      setState((current) => {
        const updatedAt = new Date().toISOString();
        return stamp(updater(current), updatedAt);
      });
    },
    [],
  );

  const setView = useCallback(
    (view: AppView) =>
      updateState((current) => ({ ...current, lastView: view })),
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
    (levelId: string, updates: Partial<LevelProgress>) => {
      const immediate =
        "completedAt" in updates ||
        "quizScore" in updates ||
        "bossScore" in updates;

      updateState(
        (current) => {
          const updatedAt = new Date().toISOString();
          const existing =
            current.levelProgress[levelId] ??
            createEmptyLevelProgress(updatedAt);

          return {
            ...current,
            levelProgress: {
              ...current.levelProgress,
              [levelId]: {
                ...existing,
                ...updates,
                updatedAt,
              },
            },
          };
        },
        immediate,
      );
    },
    [updateState],
  );

  const unlockLevelStep = useCallback(
    (levelId: string, step: number) =>
      updateState(
        (current) => {
          const updatedAt = new Date().toISOString();
          const existing =
            current.levelProgress[levelId] ??
            createEmptyLevelProgress(updatedAt);

          return {
            ...current,
            levelProgress: {
              ...current.levelProgress,
              [levelId]: {
                ...existing,
                maxStep: Math.max(existing.maxStep, step),
                updatedAt,
              },
            },
          };
        },
        true,
      ),
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
      updateState(
        (current) => ({
          ...current,
          fieldMissions: [
            withRecordMetadata("field", mission),
            ...current.fieldMissions,
          ],
        }),
        true,
      ),
    [updateState],
  );

  const addRelationship = useCallback(
    (relationship: NewRecord<Relationship>) =>
      updateState(
        (current) => ({
          ...current,
          relationships: [
            withRecordMetadata("relationship", relationship),
            ...current.relationships,
          ],
        }),
        true,
      ),
    [updateState],
  );

  const updateRelationship = useCallback(
    (relationshipId: string, updates: Partial<NewRecord<Relationship>>) =>
      updateState(
        (current) => {
          const updatedAt = new Date().toISOString();
          return {
            ...current,
            relationships: current.relationships.map((relationship) =>
              relationship.id === relationshipId
                ? { ...relationship, ...updates, updatedAt }
                : relationship,
            ),
          };
        },
        true,
      ),
    [updateState],
  );

  const removeRelationship = useCallback(
    (relationshipId: string) =>
      updateState(
        (current) => ({
          ...current,
          relationships: current.relationships.filter(
            (relationship) => relationship.id !== relationshipId,
          ),
        }),
        true,
      ),
    [updateState],
  );

  const addCustomerAudit = useCallback(
    (audit: NewRecord<CustomerExperienceAudit>) =>
      updateState(
        (current) => ({
          ...current,
          customerAudits: [
            withRecordMetadata("audit", audit),
            ...current.customerAudits,
          ],
        }),
        true,
      ),
    [updateState],
  );

  const addProcessMap = useCallback(
    (processMap: NewRecord<ProcessMap>) =>
      updateState(
        (current) => ({
          ...current,
          processMaps: [
            withRecordMetadata("process", processMap),
            ...current.processMaps,
          ],
        }),
        true,
      ),
    [updateState],
  );

  const addJournalEntry = useCallback(
    (entry: NewRecord<JournalEntry>) =>
      updateState(
        (current) => ({
          ...current,
          journalEntries: [
            withRecordMetadata("journal", entry),
            ...current.journalEntries,
          ],
        }),
        true,
      ),
    [updateState],
  );

  const addLocation = useCallback(
    (location: NewRecord<LocationOpportunity>) =>
      updateState(
        (current) => ({
          ...current,
          locations: [
            withRecordMetadata("location", location),
            ...current.locations,
          ],
        }),
        true,
      ),
    [updateState],
  );

  const advanceLocationStage = useCallback(
    (locationId: string) =>
      updateState(
        (current) => {
          const updatedAt = new Date().toISOString();
          return {
            ...current,
            locations: current.locations.map((location) =>
              location.id === locationId
                ? { ...advanceLocation(location), updatedAt }
                : location,
            ),
          };
        },
        true,
      ),
    [updateState],
  );

  const addSharedVenture = useCallback(
    (venture: NewRecord<SharedVenture>) =>
      updateState(
        (current) => ({
          ...current,
          sharedVentures: [
            withRecordMetadata("venture", venture),
            ...current.sharedVentures,
          ],
        }),
        true,
      ),
    [updateState],
  );

  const savePeopleLabAnswer = useCallback(
    (scenarioId: string, choiceId: string) =>
      updateState(
        (current) => {
          const now = new Date().toISOString();
          const existing = current.peopleLabSessions.find(
            (session) => session.scenarioId === scenarioId,
          );
          const session = {
            id: existing?.id ?? makeId("people"),
            scenarioId,
            choiceId,
            score: existing?.score ?? null,
            reflection: existing?.reflection ?? "",
            completedAt: existing?.completedAt ?? now,
            createdAt: existing?.createdAt ?? now,
            updatedAt: now,
          };

          return {
            ...current,
            peopleLabSessions: [
              session,
              ...current.peopleLabSessions.filter(
                (item) => item.scenarioId !== scenarioId,
              ),
            ],
          };
        },
        true,
      ),
    [updateState],
  );

  const updatePreferences = useCallback(
    (updates: Partial<OperatorPreferences>) =>
      updateState(
        (current) => ({
          ...current,
          preferences: { ...current.preferences, ...updates },
        }),
        true,
      ),
    [updateState],
  );

  const resolveMigration = useCallback(
    async (choice: MigrationChoice) => {
      const syncEngine = syncEngineRef.current;
      if (!syncEngine) {
        throw new Error("Cloud sync is still starting.");
      }

      const resolved = await syncEngine.resolveMigration(choice);
      skipNextSaveRef.current = true;
      setState(resolved);
      setMigration(null);
    },
    [],
  );

  const retrySync = useCallback(
    () => syncEngineRef.current?.retry() ?? Promise.resolve(),
    [],
  );

  const resetState = useCallback(() => {
    urgentSaveRef.current = true;
    setState(createInitialOperatorState());
  }, []);

  return {
    state,
    hydrated,
    syncStatus,
    migration,
    setView,
    selectLevel,
    updateLevel,
    unlockLevelStep,
    completeLevel,
    addFieldMission,
    addRelationship,
    updateRelationship,
    removeRelationship,
    addCustomerAudit,
    addProcessMap,
    addJournalEntry,
    addLocation,
    advanceLocationStage,
    addSharedVenture,
    savePeopleLabAnswer,
    updatePreferences,
    resolveMigration,
    retrySync,
    resetState,
  };
}

export type OperatorStateController = ReturnType<typeof useOperatorState>;
