export interface TeachingConcept {
  readonly term: string;
  readonly plainEnglish: string;
  readonly whyItMatters: string;
  readonly example: string;
  readonly gabiUse: string;
  readonly commonMistake: string;
}

export interface AnswerOption {
  readonly id: string;
  readonly label: string;
  readonly feedback: string;
}

export interface KnowledgeQuestion {
  readonly id: string;
  readonly prompt: string;
  readonly options: readonly AnswerOption[];
  readonly correctOptionId: string;
}

export interface BossOption extends AnswerOption {
  readonly points: number;
}

export interface OperatorLevel {
  readonly id: string;
  readonly number: number;
  readonly skill: string;
  readonly title: string;
  readonly tagline: string;
  readonly durationMinutes: number;
  readonly xpReward: number;
  readonly missionBrief: string;
  readonly whyGabiNeedsThis: string;
  readonly outcomes: readonly string[];
  readonly concepts: readonly TeachingConcept[];
  readonly supportingTopics: readonly string[];
  readonly example: {
    readonly title: string;
    readonly description: string;
    readonly takeaway: string;
  };
  readonly practice: {
    readonly prompt: string;
    readonly guidance: string;
  };
  readonly knowledgeChecks: readonly KnowledgeQuestion[];
  readonly project: {
    readonly title: string;
    readonly prompt: string;
    readonly deliverables: readonly string[];
  };
  readonly fieldMission: {
    readonly title: string;
    readonly prompt: string;
  };
  readonly bossBattle: {
    readonly title: string;
    readonly scenario: string;
    readonly prompt: string;
    readonly options: readonly BossOption[];
  };
  readonly reflectionPrompt: string;
}

export interface FutureCampaign {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly topics: readonly string[];
}

