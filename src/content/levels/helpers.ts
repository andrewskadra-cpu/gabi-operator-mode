import type {
  BossOption,
  KnowledgeQuestion,
  OperatorLevel,
  TeachingConcept,
} from "@/content/types";

export function concept(
  term: string,
  plainEnglish: string,
  whyItMatters: string,
  example: string,
  gabiUse: string,
  commonMistake: string,
): TeachingConcept {
  return { term, plainEnglish, whyItMatters, example, gabiUse, commonMistake };
}

export function question(
  id: string,
  prompt: string,
  correct: string,
  wrongOne: string,
  wrongTwo: string,
  explanation: string,
): KnowledgeQuestion {
  return {
    id,
    prompt,
    correctOptionId: "b",
    options: [
      {
        id: "a",
        label: wrongOne,
        feedback: "Not quite. " + explanation,
      },
      {
        id: "b",
        label: correct,
        feedback: "Exactly. " + explanation,
      },
      {
        id: "c",
        label: wrongTwo,
        feedback: "Not quite. " + explanation,
      },
    ],
  };
}

export function bossOptions(
  strongest: string,
  acceptable: string,
  weakest: string,
  strongestFeedback: string,
): readonly BossOption[] {
  return [
    {
      id: "a",
      label: weakest,
      points: 25,
      feedback: "This reacts quickly, but misses important operating context and creates avoidable risk.",
    },
    {
      id: "b",
      label: strongest,
      points: 100,
      feedback: strongestFeedback,
    },
    {
      id: "c",
      label: acceptable,
      points: 65,
      feedback: "This is a reasonable start, but a stronger operator would add a clearer owner, standard, or follow-up loop.",
    },
  ];
}

export function defineLevel(level: OperatorLevel): OperatorLevel {
  return level;
}

