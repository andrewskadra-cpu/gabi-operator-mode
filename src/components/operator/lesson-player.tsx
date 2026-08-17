"use client";

import { useMemo, useState } from "react";
import { getLevel, yearOneLevels } from "@/content/levels";
import type { OperatorStateController } from "@/hooks/use-operator-state";
import { createEmptyLevelProgress } from "@/lib/domain/operator-state";
import { scoreBossBattle, scoreKnowledgeCheck } from "@/lib/domain/scoring";

interface LessonPlayerProps {
  readonly controller: OperatorStateController;
  readonly levelId: string;
  readonly onBack: () => void;
}

const phases = [
  { label: "Mission Brief", short: "BRIEF" },
  { label: "Teach Me", short: "LEARN" },
  { label: "Practice", short: "PRACTICE" },
  { label: "Knowledge Check", short: "CHECK" },
  { label: "Project", short: "BUILD" },
  { label: "Field Mission", short: "FIELD" },
  { label: "Boss Battle", short: "BOSS" },
  { label: "Reflection + XP", short: "DEBRIEF" },
] as const;

export function LessonPlayer({
  controller,
  levelId,
  onBack,
}: LessonPlayerProps) {
  const level = getLevel(levelId);
  const progress =
    controller.state.levelProgress[levelId] ?? createEmptyLevelProgress();
  const [activeStep, setActiveStep] = useState(() =>
    Math.min(progress.maxStep, phases.length - 1),
  );
  const [quizSubmitted, setQuizSubmitted] = useState(progress.quizScore !== null);
  const [bossSubmitted, setBossSubmitted] = useState(progress.bossScore !== null);
  const [completionMoment, setCompletionMoment] = useState(false);

  const quizScore = useMemo(
    () =>
      level
        ? scoreKnowledgeCheck(level.knowledgeChecks, progress.quizAnswers)
        : null,
    [level, progress.quizAnswers],
  );

  if (!level) {
    return (
      <main className="workspace-page">
        <button type="button" className="back-button" onClick={onBack}>
          ← BACK TO CAMPAIGN
        </button>
        <div className="empty-state">
          <span>404</span>
          <h2>Level not found.</h2>
        </div>
      </main>
    );
  }

  const goForward = (nextStep: number) => {
    controller.unlockLevelStep(level.id, nextStep);
    setActiveStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitQuiz = () => {
    if (!quizScore) {
      return;
    }

    setQuizSubmitted(true);
    controller.updateLevel(level.id, { quizScore: quizScore.percent });

    if (quizScore.passed) {
      controller.unlockLevelStep(level.id, 4);
    }
  };

  const submitBoss = () => {
    const score = scoreBossBattle(
      level.bossBattle.options,
      progress.bossAnswerId,
    );
    setBossSubmitted(true);
    controller.updateLevel(level.id, { bossScore: score });
    controller.unlockLevelStep(level.id, 7);
  };

  const finishLevel = () => {
    controller.completeLevel(level.id);
    setCompletionMoment(true);
  };

  const nextLevel = yearOneLevels[level.number];

  return (
    <main className="lesson-page">
      <header className="lesson-masthead">
        <button type="button" className="back-button" onClick={onBack}>
          ← YEAR ONE CAMPAIGN
        </button>
        <div className="lesson-masthead__identity">
          <span>LEVEL {String(level.number).padStart(2, "0")}</span>
          <strong>{level.title}</strong>
        </div>
        <div className="lesson-masthead__xp">+{level.xpReward} XP</div>
      </header>

      <div className="lesson-layout">
        <aside className="lesson-nav">
          <div className="lesson-nav__intro">
            <span className="kicker kicker--gold">{level.skill}</span>
            <h1>{level.title}</h1>
            <p>{level.tagline}</p>
          </div>
          <nav aria-label="Lesson phases">
            {phases.map((phase, index) => {
              const unlocked = index <= progress.maxStep;
              const done = index < progress.maxStep || Boolean(progress.completedAt);

              return (
                <button
                  type="button"
                  key={phase.label}
                  disabled={!unlocked}
                  className={
                    "lesson-step" +
                    (activeStep === index ? " lesson-step--active" : "") +
                    (done ? " lesson-step--done" : "")
                  }
                  onClick={() => setActiveStep(index)}
                >
                  <span>{done ? "✓" : String(index + 1).padStart(2, "0")}</span>
                  <span>
                    <small>{phase.short}</small>
                    {phase.label}
                  </span>
                </button>
              );
            })}
          </nav>
          <div className="lesson-nav__promise">
            <span>THE G-OPS METHOD</span>
            <p>Understand → Practice → Test → Apply</p>
          </div>
        </aside>

        <section className="lesson-stage">
          {activeStep === 0 && (
            <div className="lesson-panel">
              <span className="lesson-panel__index">01 / MISSION BRIEF</span>
              <h2>{level.missionBrief}</h2>
              <div className="briefing-grid">
                <article>
                  <span className="kicker">WHY GABI NEEDS THIS</span>
                  <p>{level.whyGabiNeedsThis}</p>
                </article>
                <article>
                  <span className="kicker">MISSION LENGTH</span>
                  <strong>{level.durationMinutes} minutes</strong>
                  <p>Self-paced. Your progress saves to this device and your secure cloud account.</p>
                </article>
              </div>
              <div className="outcome-block">
                <span className="kicker">WHEN THIS MISSION IS COMPLETE, YOU CAN:</span>
                <ul>
                  {level.outcomes.map((outcome) => (
                    <li key={outcome}>
                      <span>→</span>
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="method-strip" aria-label="Lesson method">
                {["Understand", "Practice", "Test", "Apply"].map((item, index) => (
                  <div key={item}>
                    <span>0{index + 1}</span>
                    <strong>{item}</strong>
                  </div>
                ))}
              </div>
              <button className="primary-button" type="button" onClick={() => goForward(1)}>
                BEGIN TEACH ME <span aria-hidden="true">→</span>
              </button>
            </div>
          )}

          {activeStep === 1 && (
            <div className="lesson-panel">
              <span className="lesson-panel__index">02 / TEACH ME</span>
              <h2>Build the language. Then use it.</h2>
              <p className="panel-lede">
                No jargon is assumed. Open each concept and connect it to the
                operating decisions you will make as COO.
              </p>

              <div className="concept-list">
                {level.concepts.map((item, index) => (
                  <details className="concept-card" key={item.term} open={index === 0}>
                    <summary>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{item.term}</strong>
                      <span className="concept-card__toggle">+</span>
                    </summary>
                    <div className="concept-card__body">
                      <div className="definition-block">
                        <span>WHAT IT IS</span>
                        <p>{item.plainEnglish}</p>
                      </div>
                      <div className="concept-grid">
                        <div>
                          <span>WHY IT MATTERS</span>
                          <p>{item.whyItMatters}</p>
                        </div>
                        <div>
                          <span>SIMPLE EXAMPLE</span>
                          <p>{item.example}</p>
                        </div>
                        <div>
                          <span>HOW GABI USES IT</span>
                          <p>{item.gabiUse}</p>
                        </div>
                        <div className="mistake-box">
                          <span>COMMON MISTAKE</span>
                          <p>{item.commonMistake}</p>
                        </div>
                      </div>
                    </div>
                  </details>
                ))}
              </div>

              <div className="supporting-topics">
                <span className="kicker">ALSO IN THIS LEVEL</span>
                <div>
                  {level.supportingTopics.map((topic) => (
                    <span key={topic}>{topic}</span>
                  ))}
                </div>
              </div>

              <article className="skadra-example">
                <span className="kicker kicker--gold">SKADRA EXAMPLE</span>
                <h3>{level.example.title}</h3>
                <p>{level.example.description}</p>
                <blockquote>{level.example.takeaway}</blockquote>
              </article>

              <button className="primary-button" type="button" onClick={() => goForward(2)}>
                PRACTICE THE CONCEPT <span aria-hidden="true">→</span>
              </button>
            </div>
          )}

          {activeStep === 2 && (
            <div className="lesson-panel">
              <span className="lesson-panel__index">03 / WHAT WOULD YOU DO?</span>
              <h2>Make the idea your own.</h2>
              <div className="practice-prompt">
                <span>OPERATOR PROMPT</span>
                <p>{level.practice.prompt}</p>
              </div>
              <label className="field-group">
                <span>YOUR WORKING ANSWER</span>
                <textarea
                  rows={8}
                  value={progress.practiceDraft}
                  onChange={(event) =>
                    controller.updateLevel(level.id, {
                      practiceDraft: event.target.value,
                    })
                  }
                  placeholder="Think in plain language. Show your reasoning."
                />
              </label>
              <div className="coach-note">
                <span>COACHING NOTE</span>
                <p>{level.practice.guidance}</p>
              </div>
              <button
                className="primary-button"
                type="button"
                disabled={progress.practiceDraft.trim().length < 10}
                onClick={() => goForward(3)}
              >
                ENTER KNOWLEDGE CHECK <span aria-hidden="true">→</span>
              </button>
            </div>
          )}

          {activeStep === 3 && (
            <div className="lesson-panel">
              <span className="lesson-panel__index">04 / KNOWLEDGE CHECK</span>
              <h2>Use the concept—not the vocabulary alone.</h2>
              <p className="panel-lede">Score 70% or better to unlock the project. Every answer includes an explanation.</p>
              <div className="quiz-list">
                {level.knowledgeChecks.map((item, questionIndex) => (
                  <fieldset className="quiz-card" key={item.id}>
                    <legend>
                      <span>QUESTION {String(questionIndex + 1).padStart(2, "0")}</span>
                      {item.prompt}
                    </legend>
                    {item.options.map((option) => {
                      const selected = progress.quizAnswers[item.id] === option.id;
                      const correct = item.correctOptionId === option.id;
                      const showState = quizSubmitted && selected;

                      return (
                        <label
                          className={
                            "answer-option" +
                            (selected ? " answer-option--selected" : "") +
                            (showState && correct ? " answer-option--correct" : "") +
                            (showState && !correct ? " answer-option--incorrect" : "")
                          }
                          key={option.id}
                        >
                          <input
                            type="radio"
                            name={item.id}
                            value={option.id}
                            checked={selected}
                            onChange={() => {
                              setQuizSubmitted(false);
                              controller.updateLevel(level.id, {
                                quizAnswers: {
                                  ...progress.quizAnswers,
                                  [item.id]: option.id,
                                },
                                quizScore: null,
                              });
                            }}
                          />
                          <span className="answer-option__letter">{option.id.toUpperCase()}</span>
                          <span>
                            {option.label}
                            {showState && <small>{option.feedback}</small>}
                          </span>
                        </label>
                      );
                    })}
                  </fieldset>
                ))}
              </div>

              {quizSubmitted && quizScore && (
                <div className={quizScore.passed ? "score-result score-result--pass" : "score-result"}>
                  <span>{quizScore.percent}%</span>
                  <div>
                    <strong>{quizScore.passed ? "CHECK PASSED" : "REVIEW AND TRY AGAIN"}</strong>
                    <p>{quizScore.correct} of {quizScore.total} applied questions correct.</p>
                  </div>
                </div>
              )}

              <button
                className="primary-button"
                type="button"
                disabled={
                  Object.keys(progress.quizAnswers).length < level.knowledgeChecks.length
                }
                onClick={submitQuiz}
              >
                {quizSubmitted ? "RECHECK ANSWERS" : "CHECK MY ANSWERS"}
              </button>
              {quizSubmitted && quizScore?.passed && (
                <button className="secondary-button" type="button" onClick={() => goForward(4)}>
                  OPEN PROJECT <span aria-hidden="true">→</span>
                </button>
              )}
            </div>
          )}

          {activeStep === 4 && (
            <div className="lesson-panel">
              <span className="lesson-panel__index">05 / PROJECT</span>
              <span className="project-badge">HANDS-ON APPLICATION</span>
              <h2>{level.project.title}</h2>
              <p className="panel-lede">{level.project.prompt}</p>
              <div className="deliverables">
                <span className="kicker">DELIVERABLES</span>
                {level.project.deliverables.map((deliverable, index) => (
                  <div key={deliverable}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {deliverable}
                  </div>
                ))}
              </div>
              <label className="field-group">
                <span>PROJECT WORKSPACE</span>
                <textarea
                  rows={14}
                  value={progress.projectDraft}
                  onChange={(event) =>
                    controller.updateLevel(level.id, {
                      projectDraft: event.target.value,
                    })
                  }
                  placeholder="Build the deliverable here. Your work saves automatically."
                />
              </label>
              <button
                className="primary-button"
                type="button"
                disabled={progress.projectDraft.trim().length < 20}
                onClick={() => goForward(5)}
              >
                SAVE PROJECT + CONTINUE <span aria-hidden="true">→</span>
              </button>
            </div>
          )}

          {activeStep === 5 && (
            <div className="lesson-panel">
              <span className="lesson-panel__index">06 / FIELD MISSION</span>
              <div className="field-mission-hero">
                <span className="field-mission-hero__mark">F</span>
                <div>
                  <span className="kicker kicker--gold">REAL-WORLD REP</span>
                  <h2>{level.fieldMission.title}</h2>
                  <p>{level.fieldMission.prompt}</p>
                </div>
              </div>
              <div className="field-mission-note">
                <strong>Why this counts</strong>
                <p>
                  Business skill becomes durable when it survives contact with a
                  real person, place, constraint, or uncomfortable moment.
                  Rejection and imperfect attempts still count as useful reps.
                </p>
              </div>
              <div className="button-row">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => controller.setView("field-ops")}
                >
                  OPEN FIELD OPS
                </button>
                <button className="primary-button" type="button" onClick={() => goForward(6)}>
                  CONTINUE TO BOSS BATTLE <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          )}

          {activeStep === 6 && (
            <div className="lesson-panel lesson-panel--boss">
              <span className="lesson-panel__index">07 / BOSS BATTLE</span>
              <span className="boss-label">DECISION UNDER PRESSURE</span>
              <h2>{level.bossBattle.title}</h2>
              <div className="scenario-box">
                <span>SCENARIO</span>
                <p>{level.bossBattle.scenario}</p>
              </div>
              <h3 className="boss-prompt">{level.bossBattle.prompt}</h3>
              <div className="boss-options">
                {level.bossBattle.options.map((option) => {
                  const selected = progress.bossAnswerId === option.id;

                  return (
                    <button
                      type="button"
                      key={option.id}
                      className={selected ? "boss-option boss-option--selected" : "boss-option"}
                      onClick={() => {
                        setBossSubmitted(false);
                        controller.updateLevel(level.id, {
                          bossAnswerId: option.id,
                          bossScore: null,
                        });
                      }}
                    >
                      <span>{option.id.toUpperCase()}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
              {bossSubmitted && (
                <div className="boss-feedback">
                  <span>{progress.bossScore}/100</span>
                  <p>
                    {level.bossBattle.options.find(
                      (option) => option.id === progress.bossAnswerId,
                    )?.feedback}
                  </p>
                </div>
              )}
              <button
                className="primary-button primary-button--gold"
                type="button"
                disabled={!progress.bossAnswerId}
                onClick={submitBoss}
              >
                LOCK DECISION
              </button>
              {bossSubmitted && (
                <button className="secondary-button secondary-button--light" type="button" onClick={() => goForward(7)}>
                  DEBRIEF MISSION <span aria-hidden="true">→</span>
                </button>
              )}
            </div>
          )}

          {activeStep === 7 && (
            <div className="lesson-panel">
              <span className="lesson-panel__index">08 / REFLECTION + XP</span>
              {completionMoment || progress.completedAt ? (
                <div className="completion-card">
                  <span className="completion-card__mark">✓</span>
                  <span className="kicker kicker--gold">MISSION COMPLETE</span>
                  <h2>{level.title}</h2>
                  <p>You taught it, practiced it, tested it, and applied it.</p>
                  <div className="completion-card__xp">+{level.xpReward} XP</div>
                  <div className="button-row">
                    <button className="secondary-button secondary-button--light" type="button" onClick={onBack}>
                      VIEW CAMPAIGN
                    </button>
                    {nextLevel && (
                      <button
                        className="primary-button primary-button--gold"
                        type="button"
                        onClick={() => {
                          controller.selectLevel(nextLevel.id);
                          setCompletionMoment(false);
                          setActiveStep(0);
                          setQuizSubmitted(false);
                          setBossSubmitted(false);
                        }}
                      >
                        NEXT LEVEL <span aria-hidden="true">→</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <h2>Convert experience into judgment.</h2>
                  <div className="reflection-prompt">
                    <span>REFLECTION</span>
                    <p>{level.reflectionPrompt}</p>
                  </div>
                  <label className="field-group">
                    <span>YOUR DEBRIEF</span>
                    <textarea
                      rows={9}
                      value={progress.reflection}
                      onChange={(event) =>
                        controller.updateLevel(level.id, {
                          reflection: event.target.value,
                        })
                      }
                      placeholder="What changed in how you see the business?"
                    />
                  </label>
                  <div className="xp-preview">
                    <div>
                      <span>LEVEL REWARD</span>
                      <strong>+{level.xpReward} XP</strong>
                    </div>
                    <p>
                      Completing this level unlocks the next Year One mission and
                      may unlock a new achievement.
                    </p>
                  </div>
                  <button
                    className="primary-button"
                    type="button"
                    disabled={progress.reflection.trim().length < 20}
                    onClick={finishLevel}
                  >
                    COMPLETE LEVEL <span aria-hidden="true">→</span>
                  </button>
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
