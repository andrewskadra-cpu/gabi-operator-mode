export const OPERATOR_STATE_VERSION = 1 as const;

export type AppView =
  | "command"
  | "campaign"
  | "field-ops"
  | "network"
  | "labs"
  | "journal"
  | "ventures";

export interface LevelProgress {
  readonly maxStep: number;
  readonly quizAnswers: Readonly<Record<string, string>>;
  readonly quizScore: number | null;
  readonly practiceDraft: string;
  readonly projectDraft: string;
  readonly bossAnswerId: string | null;
  readonly bossScore: number | null;
  readonly reflection: string;
  readonly completedAt: string | null;
}

export interface FieldMissionLog {
  readonly id: string;
  readonly template: string;
  readonly date: string;
  readonly person: string;
  readonly place: string;
  readonly happened: string;
  readonly learned: string;
  readonly uncomfortable: string;
  readonly wentWell: string;
  readonly changeNextTime: string;
  readonly followUp: string;
  readonly createdAt: string;
}

export interface Relationship {
  readonly id: string;
  readonly name: string;
  readonly company: string;
  readonly role: string;
  readonly category: string;
  readonly howWeMet: string;
  readonly caresAbout: string;
  readonly lastContact: string;
  readonly nextContact: string;
  readonly notes: string;
  readonly strength: number;
  readonly createdAt: string;
}

export type CustomerExperienceMetric =
  | "greeting"
  | "speed"
  | "cleanliness"
  | "communication"
  | "problemResolution"
  | "ease"
  | "value"
  | "consistency"
  | "personalization"
  | "likelihoodToReturn";

export interface CustomerExperienceAudit {
  readonly id: string;
  readonly business: string;
  readonly visitDate: string;
  readonly scores: Readonly<Record<CustomerExperienceMetric, number>>;
  readonly skadraDifference: string;
  readonly createdAt: string;
}

export interface ProcessMap {
  readonly id: string;
  readonly name: string;
  readonly input: string;
  readonly steps: readonly string[];
  readonly output: string;
  readonly bottleneck: string;
  readonly delay: string;
  readonly waste: string;
  readonly risk: string;
  readonly customerImpact: string;
  readonly owner: string;
  readonly improvement: string;
  readonly createdAt: string;
}

export interface JournalEntry {
  readonly id: string;
  readonly weekOf: string;
  readonly responses: Readonly<Record<string, string>>;
  readonly createdAt: string;
}

export const LOCATION_STAGES = [
  "Identified",
  "Contacted",
  "Conversation",
  "Interested",
  "Meeting",
  "Proposal",
  "Negotiation",
  "Approved",
  "Installed",
  "Active",
] as const;

export type LocationStage = (typeof LOCATION_STAGES)[number];

export interface LocationOpportunity {
  readonly id: string;
  readonly company: string;
  readonly contact: string;
  readonly employeesOrTraffic: string;
  readonly currentVending: string;
  readonly problems: string;
  readonly commission: string;
  readonly followUp: string;
  readonly notes: string;
  readonly stage: LocationStage;
  readonly createdAt: string;
}

export interface SharedVenture {
  readonly id: string;
  readonly name: string;
  readonly financialAttractiveness: number;
  readonly operationalAttractiveness: number;
  readonly peopleRisk: string;
  readonly customerRisk: string;
  readonly managementRisk: string;
  readonly integrationNote: string;
  readonly createdAt: string;
}

export interface OperatorState {
  readonly version: typeof OPERATOR_STATE_VERSION;
  readonly profile: {
    readonly name: string;
    readonly title: string;
  };
  readonly lastView: AppView;
  readonly activeLevelId: string;
  readonly levelProgress: Readonly<Record<string, LevelProgress>>;
  readonly fieldMissions: readonly FieldMissionLog[];
  readonly relationships: readonly Relationship[];
  readonly customerAudits: readonly CustomerExperienceAudit[];
  readonly processMaps: readonly ProcessMap[];
  readonly journalEntries: readonly JournalEntry[];
  readonly locations: readonly LocationOpportunity[];
  readonly sharedVentures: readonly SharedVenture[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export function createEmptyLevelProgress(): LevelProgress {
  return {
    maxStep: 0,
    quizAnswers: {},
    quizScore: null,
    practiceDraft: "",
    projectDraft: "",
    bossAnswerId: null,
    bossScore: null,
    reflection: "",
    completedAt: null,
  };
}

export function createInitialOperatorState(): OperatorState {
  const now = new Date().toISOString();

  return {
    version: OPERATOR_STATE_VERSION,
    profile: {
      name: "Gabi",
      title: "Future Vice President / COO",
    },
    lastView: "command",
    activeLevelId: "follow-the-money",
    levelProgress: {},
    fieldMissions: [],
    relationships: [],
    customerAudits: [],
    processMaps: [],
    journalEntries: [],
    locations: [],
    sharedVentures: [],
    createdAt: now,
    updatedAt: now,
  };
}

