import {
  LOCATION_STAGES,
  OPERATOR_STATE_VERSION,
  createEmptyLevelProgress,
  createInitialOperatorState,
  type AppView,
  type CustomerExperienceAudit,
  type FieldMissionLog,
  type JournalEntry,
  type LevelProgress,
  type LocationOpportunity,
  type LocationStage,
  type OperatorState,
  type PeopleLabSession,
  type ProcessMap,
  type Relationship,
  type SharedVenture,
} from "../domain/operator-state.ts";

const APP_VIEWS: readonly AppView[] = [
  "command",
  "campaign",
  "field-ops",
  "network",
  "labs",
  "journal",
  "ventures",
  "settings",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function numberValue(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function nullableNumber(value: unknown): number | null {
  return value === null ? null : typeof value === "number" && Number.isFinite(value) ? value : null;
}

function nullableString(value: unknown): string | null {
  return value === null ? null : typeof value === "string" ? value : null;
}

function timestampValue(value: unknown, fallback: string): string {
  if (typeof value !== "string" || value.length === 0) {
    return fallback;
  }

  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? fallback : new Date(timestamp).toISOString();
}

function stringRecord(value: unknown): Readonly<Record<string, string>> {
  if (!isRecord(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] =>
      typeof entry[1] === "string",
    ),
  );
}

function numberRecord(value: unknown): Readonly<Record<string, number>> {
  if (!isRecord(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, number] =>
      typeof entry[1] === "number" && Number.isFinite(entry[1]),
    ),
  );
}

function normalizeLevelProgress(
  value: unknown,
  fallbackUpdatedAt: string,
): LevelProgress | null {
  if (!isRecord(value)) {
    return null;
  }

  const fallback = createEmptyLevelProgress(fallbackUpdatedAt);

  return {
    maxStep: Math.max(0, Math.min(7, Math.trunc(numberValue(value.maxStep)))),
    quizAnswers: stringRecord(value.quizAnswers),
    quizScore: nullableNumber(value.quizScore),
    practiceDraft: stringValue(value.practiceDraft),
    projectDraft: stringValue(value.projectDraft),
    bossAnswerId: nullableString(value.bossAnswerId),
    bossScore: nullableNumber(value.bossScore),
    reflection: stringValue(value.reflection),
    completedAt: nullableString(value.completedAt),
    updatedAt: timestampValue(value.updatedAt, fallback.updatedAt),
  };
}

function normalizeTimestampedRecord(
  value: unknown,
  fallbackUpdatedAt: string,
): (Record<string, unknown> & { id: string; createdAt: string; updatedAt: string }) | null {
  if (!isRecord(value) || typeof value.id !== "string" || value.id.length === 0) {
    return null;
  }

  const createdAt = timestampValue(value.createdAt, fallbackUpdatedAt);

  return {
    ...value,
    id: value.id,
    createdAt,
    updatedAt: timestampValue(value.updatedAt, createdAt),
  };
}

function normalizeFieldMission(value: unknown, updatedAt: string): FieldMissionLog | null {
  const record = normalizeTimestampedRecord(value, updatedAt);
  return record
    ? {
        id: record.id,
        template: stringValue(record.template),
        date: stringValue(record.date),
        person: stringValue(record.person),
        place: stringValue(record.place),
        happened: stringValue(record.happened),
        learned: stringValue(record.learned),
        uncomfortable: stringValue(record.uncomfortable),
        wentWell: stringValue(record.wentWell),
        changeNextTime: stringValue(record.changeNextTime),
        followUp: stringValue(record.followUp),
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      }
    : null;
}

function normalizeRelationship(value: unknown, updatedAt: string): Relationship | null {
  const record = normalizeTimestampedRecord(value, updatedAt);
  return record
    ? {
        id: record.id,
        name: stringValue(record.name),
        company: stringValue(record.company),
        role: stringValue(record.role),
        category: stringValue(record.category),
        howWeMet: stringValue(record.howWeMet),
        caresAbout: stringValue(record.caresAbout),
        lastContact: stringValue(record.lastContact),
        nextContact: stringValue(record.nextContact),
        notes: stringValue(record.notes),
        strength: Math.max(1, Math.min(5, Math.trunc(numberValue(record.strength, 1)))),
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      }
    : null;
}

function normalizeCustomerAudit(
  value: unknown,
  updatedAt: string,
): CustomerExperienceAudit | null {
  const record = normalizeTimestampedRecord(value, updatedAt);
  return record
    ? {
        id: record.id,
        business: stringValue(record.business),
        visitDate: stringValue(record.visitDate),
        scores: numberRecord(record.scores),
        skadraDifference: stringValue(record.skadraDifference),
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      }
    : null;
}

function normalizeProcessMap(value: unknown, updatedAt: string): ProcessMap | null {
  const record = normalizeTimestampedRecord(value, updatedAt);
  const steps = Array.isArray(record?.steps)
    ? record.steps.filter((step): step is string => typeof step === "string")
    : [];

  return record
    ? {
        id: record.id,
        name: stringValue(record.name),
        input: stringValue(record.input),
        steps,
        output: stringValue(record.output),
        bottleneck: stringValue(record.bottleneck),
        delay: stringValue(record.delay),
        waste: stringValue(record.waste),
        risk: stringValue(record.risk),
        customerImpact: stringValue(record.customerImpact),
        owner: stringValue(record.owner),
        improvement: stringValue(record.improvement),
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      }
    : null;
}

function normalizeJournalEntry(value: unknown, updatedAt: string): JournalEntry | null {
  const record = normalizeTimestampedRecord(value, updatedAt);
  return record
    ? {
        id: record.id,
        weekOf: stringValue(record.weekOf),
        responses: stringRecord(record.responses),
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      }
    : null;
}

function normalizeLocation(value: unknown, updatedAt: string): LocationOpportunity | null {
  const record = normalizeTimestampedRecord(value, updatedAt);
  const stage = LOCATION_STAGES.includes(record?.stage as LocationStage)
    ? (record?.stage as LocationStage)
    : "Identified";

  return record
    ? {
        id: record.id,
        company: stringValue(record.company),
        contact: stringValue(record.contact),
        employeesOrTraffic: stringValue(record.employeesOrTraffic),
        currentVending: stringValue(record.currentVending),
        problems: stringValue(record.problems),
        commission: stringValue(record.commission),
        followUp: stringValue(record.followUp),
        notes: stringValue(record.notes),
        stage,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      }
    : null;
}

function normalizeSharedVenture(value: unknown, updatedAt: string): SharedVenture | null {
  const record = normalizeTimestampedRecord(value, updatedAt);
  return record
    ? {
        id: record.id,
        name: stringValue(record.name),
        financialAttractiveness: numberValue(record.financialAttractiveness, 1),
        operationalAttractiveness: numberValue(record.operationalAttractiveness, 1),
        peopleRisk: stringValue(record.peopleRisk),
        customerRisk: stringValue(record.customerRisk),
        managementRisk: stringValue(record.managementRisk),
        integrationNote: stringValue(record.integrationNote),
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      }
    : null;
}

function normalizePeopleLabSession(
  value: unknown,
  updatedAt: string,
): PeopleLabSession | null {
  const record = normalizeTimestampedRecord(value, updatedAt);
  if (!record || typeof record.scenarioId !== "string" || typeof record.choiceId !== "string") {
    return null;
  }

  return {
    id: record.id,
    scenarioId: record.scenarioId,
    choiceId: record.choiceId,
    score: nullableNumber(record.score),
    reflection: stringValue(record.reflection),
    completedAt: timestampValue(record.completedAt, record.updatedAt),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function normalizedArray<T>(
  value: unknown,
  normalize: (item: unknown) => T | null,
): readonly T[] {
  return Array.isArray(value)
    ? value.map(normalize).filter((item): item is T => item !== null)
    : [];
}

export function parseOperatorState(value: unknown): OperatorState | null {
  if (!isRecord(value) || (value.version !== 1 && value.version !== OPERATOR_STATE_VERSION)) {
    return null;
  }

  if (
    typeof value.activeLevelId !== "string" ||
    !isRecord(value.levelProgress) ||
    !Array.isArray(value.fieldMissions) ||
    !Array.isArray(value.relationships) ||
    !Array.isArray(value.customerAudits) ||
    !Array.isArray(value.processMaps) ||
    !Array.isArray(value.journalEntries) ||
    !Array.isArray(value.locations) ||
    !Array.isArray(value.sharedVentures)
  ) {
    return null;
  }

  const initial = createInitialOperatorState();
  const updatedAt = timestampValue(value.updatedAt, initial.updatedAt);
  const createdAt = timestampValue(value.createdAt, updatedAt);
  const profile = isRecord(value.profile) ? value.profile : {};
  const preferences = isRecord(value.preferences) ? value.preferences : {};
  const levelProgress = Object.fromEntries(
    Object.entries(value.levelProgress)
      .map(([levelId, progress]) => [
        levelId,
        normalizeLevelProgress(progress, updatedAt),
      ] as const)
      .filter((entry): entry is readonly [string, LevelProgress] => entry[1] !== null),
  );

  return {
    version: OPERATOR_STATE_VERSION,
    profile: {
      name: stringValue(profile.name, initial.profile.name),
      title: stringValue(profile.title, initial.profile.title),
    },
    currentCampaignId: stringValue(
      value.currentCampaignId,
      initial.currentCampaignId,
    ),
    lastView: APP_VIEWS.includes(value.lastView as AppView)
      ? (value.lastView as AppView)
      : initial.lastView,
    activeLevelId: value.activeLevelId,
    levelProgress,
    fieldMissions: normalizedArray(value.fieldMissions, (item) =>
      normalizeFieldMission(item, updatedAt),
    ),
    relationships: normalizedArray(value.relationships, (item) =>
      normalizeRelationship(item, updatedAt),
    ),
    customerAudits: normalizedArray(value.customerAudits, (item) =>
      normalizeCustomerAudit(item, updatedAt),
    ),
    processMaps: normalizedArray(value.processMaps, (item) =>
      normalizeProcessMap(item, updatedAt),
    ),
    journalEntries: normalizedArray(value.journalEntries, (item) =>
      normalizeJournalEntry(item, updatedAt),
    ),
    locations: normalizedArray(value.locations, (item) =>
      normalizeLocation(item, updatedAt),
    ),
    sharedVentures: normalizedArray(value.sharedVentures, (item) =>
      normalizeSharedVenture(item, updatedAt),
    ),
    peopleLabSessions: normalizedArray(value.peopleLabSessions, (item) =>
      normalizePeopleLabSession(item, updatedAt),
    ),
    achievementUnlocks: stringRecord(value.achievementUnlocks),
    preferences: {
      reducedMotion:
        typeof preferences.reducedMotion === "boolean"
          ? preferences.reducedMotion
          : initial.preferences.reducedMotion,
      compactMode:
        typeof preferences.compactMode === "boolean"
          ? preferences.compactMode
          : initial.preferences.compactMode,
    },
    createdAt,
    updatedAt,
  };
}

export function isMeaningfulOperatorState(state: OperatorState): boolean {
  const initial = createInitialOperatorState();

  return (
    Object.keys(state.levelProgress).length > 0 ||
    state.fieldMissions.length > 0 ||
    state.relationships.length > 0 ||
    state.customerAudits.length > 0 ||
    state.processMaps.length > 0 ||
    state.journalEntries.length > 0 ||
    state.locations.length > 0 ||
    state.sharedVentures.length > 0 ||
    state.peopleLabSessions.length > 0 ||
    Object.keys(state.achievementUnlocks).length > 0 ||
    state.activeLevelId !== initial.activeLevelId ||
    state.profile.name !== initial.profile.name ||
    state.profile.title !== initial.profile.title
  );
}
