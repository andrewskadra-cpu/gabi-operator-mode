import type { BossOption, KnowledgeQuestion } from "@/content/types";

export interface KnowledgeScore {
  readonly correct: number;
  readonly total: number;
  readonly percent: number;
  readonly passed: boolean;
}

export function scoreKnowledgeCheck(
  questions: readonly KnowledgeQuestion[],
  answers: Readonly<Record<string, string>>,
): KnowledgeScore {
  const correct = questions.reduce(
    (total, question) => total + Number(answers[question.id] === question.correctOptionId),
    0,
  );
  const total = questions.length;
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);

  return {
    correct,
    total,
    percent,
    passed: percent >= 70,
  };
}

export function scoreBossBattle(
  options: readonly BossOption[],
  answerId: string | null,
): number {
  return options.find((option) => option.id === answerId)?.points ?? 0;
}

export function averageScore(scores: Readonly<Record<string, number>>): number {
  const values = Object.values(scores);

  if (values.length === 0) {
    return 0;
  }

  return Math.round((values.reduce((total, value) => total + value, 0) / values.length) * 10) / 10;
}

export function getVentureSignal(financial: number, operational: number): string {
  const average = (financial + operational) / 2;

  if (financial >= 7 && operational < 5) {
    return "Investigate";
  }

  if (operational >= 7 && financial < 5) {
    return "Validate economics";
  }

  if (average >= 7) {
    return "Advance";
  }

  if (average >= 5) {
    return "Study";
  }

  return "Pass for now";
}

