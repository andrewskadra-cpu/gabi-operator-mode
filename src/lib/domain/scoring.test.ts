import test from "node:test";
import assert from "node:assert/strict";
import type { BossOption, KnowledgeQuestion } from "../../content/types.ts";
import {
  averageScore,
  getVentureSignal,
  scoreBossBattle,
  scoreKnowledgeCheck,
} from "./scoring.ts";

const questions: readonly KnowledgeQuestion[] = [
  {
    id: "q1",
    prompt: "Question one",
    correctOptionId: "b",
    options: [
      { id: "a", label: "Wrong", feedback: "Review." },
      { id: "b", label: "Right", feedback: "Correct." },
    ],
  },
  {
    id: "q2",
    prompt: "Question two",
    correctOptionId: "a",
    options: [
      { id: "a", label: "Right", feedback: "Correct." },
      { id: "b", label: "Wrong", feedback: "Review." },
    ],
  },
];

test("knowledge checks score applied answers and enforce the 70 percent gate", () => {
  assert.deepEqual(scoreKnowledgeCheck(questions, { q1: "b", q2: "a" }), {
    correct: 2,
    total: 2,
    percent: 100,
    passed: true,
  });
  assert.equal(scoreKnowledgeCheck(questions, { q1: "b", q2: "b" }).passed, false);
});

test("boss battles return the points attached to the selected response", () => {
  const options: readonly BossOption[] = [
    { id: "a", label: "Weak", feedback: "Risky", points: 25 },
    { id: "b", label: "Strong", feedback: "Sound", points: 100 },
  ];

  assert.equal(scoreBossBattle(options, "b"), 100);
  assert.equal(scoreBossBattle(options, null), 0);
});

test("customer and venture scores produce stable operating signals", () => {
  assert.equal(averageScore({ a: 5, b: 3, c: 4 }), 4);
  assert.equal(getVentureSignal(9, 4), "Investigate");
  assert.equal(getVentureSignal(8, 8), "Advance");
  assert.equal(getVentureSignal(3, 3), "Pass for now");
});

