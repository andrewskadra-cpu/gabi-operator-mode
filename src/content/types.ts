import type {
  ExecutiveRole,
  ExecutiveSkill,
} from "@/lib/domain/executive-role";

export interface TeachingConcept {
  readonly term: string;
  readonly plainEnglish: string;
  readonly whyItMatters: string;
  readonly example: string;
  readonly gabiUse: string;
  readonly roleApplication?: string;
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

export type CampaignLessonStatus = "available" | "locked" | "draft";

export interface CampaignLesson {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly durationMinutes: number;
  readonly status: CampaignLessonStatus;
}

export interface Campaign {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly outcome: string;
  readonly lessons: readonly CampaignLesson[];
}

export interface OperatorLevel {
  readonly id: string;
  readonly number: number;
  readonly skill: string;
  readonly title: string;
  readonly tagline: string;
  readonly durationMinutes: number;
  readonly xpReward: number;
  readonly executiveRole?: ExecutiveRole;
  readonly campaignId?: string;
  readonly scoreSkills?: readonly ExecutiveSkill[];
  readonly missionBrief: string;
  readonly whyGabiNeedsThis: string;
  readonly whyExecutiveNeedsThis?: string;
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
