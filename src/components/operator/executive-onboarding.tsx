"use client";

import {
  getExecutiveRoleDefinition,
  type ExecutiveRole,
} from "@/lib/domain/executive-role";

const onboardingQuestions: Readonly<Record<ExecutiveRole, readonly string[]>> = {
  ceo: [
    "Where should capital go?",
    "Who should run the businesses?",
    "What should Skadra Ventures own?",
    "What should it sell?",
    "What systems should exist?",
  ],
  coo: [
    "How should the businesses operate?",
    "How do we serve customers?",
    "How do we develop people?",
    "How do we execute consistently?",
    "How do we turn strategy into reality?",
  ],
};

export function ExecutiveOnboarding({
  role,
  displayName,
  onComplete,
}: {
  readonly role: ExecutiveRole;
  readonly displayName: string;
  readonly onComplete: () => void;
}) {
  const definition = getExecutiveRoleDefinition(role);

  return (
    <main className={`executive-onboarding executive-onboarding--${role}`}>
      <section>
        <span className="kicker kicker--gold">G-OPS / EXECUTIVE BRIEFING</span>
        <p className="executive-onboarding__name">{displayName}</p>
        <h1>Welcome, {definition.shortLabel}.</h1>
        <p className="executive-onboarding__lede">
          Your job is eventually to determine:
        </p>
        <ul>
          {onboardingQuestions[role].map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
        <p className="executive-onboarding__closing">
          {role === "ceo"
            ? "Your training begins with understanding the numbers."
            : "Your training begins with turning priorities into reliable execution."}
        </p>
        <button className="primary-button" type="button" onClick={onComplete}>
          ENTER {definition.shortLabel} COMMAND CENTER →
        </button>
      </section>
    </main>
  );
}
