"use client";

import { useState, type FormEvent } from "react";
import { founderMissions } from "@/content/founder-missions";
import type { OperatorStateController } from "@/hooks/use-operator-state";
import type { ExecutiveRole } from "@/lib/domain/executive-role";
import type { FounderDecision } from "@/lib/domain/operator-state";

interface FounderMissionDraft {
  readonly analysis: string;
  readonly recommendation: string;
  readonly decision: FounderDecision;
  readonly reflection: string;
}

const emptyDraft: FounderMissionDraft = {
  analysis: "",
  recommendation: "",
  decision: null,
  reflection: "",
};

export function FounderMissionsPanel({
  controller,
  role,
}: {
  readonly controller: OperatorStateController;
  readonly role: ExecutiveRole;
}) {
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [draft, setDraft] = useState<FounderMissionDraft>(emptyDraft);
  const [saved, setSaved] = useState(false);

  const openMission = (missionId: string) => {
    const progress = controller.state.founderMissions.find(
      (mission) =>
        mission.missionId === missionId && mission.executiveRole === role,
    );
    setActiveMissionId(missionId);
    setDraft(
      progress
        ? {
            analysis: progress.analysis,
            recommendation: progress.recommendation,
            decision: progress.decision,
            reflection: progress.reflection,
          }
        : emptyDraft,
    );
    setSaved(false);
  };

  const saveDraft = () => {
    if (!activeMissionId) {
      return;
    }
    controller.saveFounderMission(activeMissionId, {
      ...draft,
      status: draft.decision ? "ready-for-decision" : "in-progress",
    });
    setSaved(true);
  };

  const complete = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeMissionId || !draft.decision) {
      return;
    }
    controller.saveFounderMission(activeMissionId, {
      ...draft,
      status: "complete",
    });
    setSaved(true);
  };

  return (
    <section className="founder-missions-panel">
      <div className="section-heading">
        <span className="kicker">FOUNDER MISSIONS / ASYNCHRONOUS CASEWORK</span>
        <h2>Two responsibilities. One eventual decision.</h2>
        <p>
          Complete the {role.toUpperCase()} side independently. Your analysis is
          private to your account; no other user&apos;s data is exposed or combined.
        </p>
      </div>

      <div className="founder-mission-grid">
        {founderMissions.map((mission) => {
          const brief = mission.roles[role];
          const progress = controller.state.founderMissions.find(
            (item) =>
              item.missionId === mission.id && item.executiveRole === role,
          );
          const active = activeMissionId === mission.id;

          return (
            <article
              className={
                "founder-mission-card" +
                (active ? " founder-mission-card--active" : "")
              }
              key={mission.id}
            >
              <div className="founder-mission-card__head">
                <span>{mission.category}</span>
                <span>{progress?.status.replaceAll("-", " ") ?? "not started"}</span>
              </div>
              <h3>{mission.title}</h3>
              <p>{mission.scenario}</p>
              <div className="founder-mission-role-brief">
                <span>{role.toUpperCase()} RESPONSIBILITY</span>
                <strong>{brief.objective}</strong>
                <ul>
                  {brief.responsibilities.map((responsibility) => (
                    <li key={responsibility}>{responsibility}</li>
                  ))}
                </ul>
              </div>
              <button
                className="secondary-button"
                type="button"
                onClick={() => openMission(mission.id)}
              >
                {progress ? "OPEN SAVED CASE" : "BEGIN MY SIDE"}
              </button>

              {active && (
                <form className="founder-mission-form" onSubmit={complete}>
                  <label className="field-group">
                    <span>ANALYSIS + EVIDENCE</span>
                    <textarea
                      rows={9}
                      required
                      value={draft.analysis}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          analysis: event.target.value,
                        }))
                      }
                      placeholder={brief.evidencePrompt}
                    />
                  </label>
                  <label className="field-group">
                    <span>RECOMMENDATION</span>
                    <textarea
                      rows={4}
                      required
                      value={draft.recommendation}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          recommendation: event.target.value,
                        }))
                      }
                      placeholder="State what should happen and which conditions matter."
                    />
                  </label>
                  <fieldset className="founder-decision-options">
                    <legend>{mission.decisionPrompt}</legend>
                    {mission.decisions.map((decision) => (
                      <label key={decision.value}>
                        <input
                          type="radio"
                          name={`${mission.id}-decision`}
                          value={decision.value}
                          checked={draft.decision === decision.value}
                          onChange={() =>
                            setDraft((current) => ({
                              ...current,
                              decision: decision.value,
                            }))
                          }
                        />
                        <span>{decision.label}</span>
                      </label>
                    ))}
                  </fieldset>
                  <label className="field-group">
                    <span>EXECUTIVE REFLECTION</span>
                    <textarea
                      rows={4}
                      required
                      value={draft.reflection}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          reflection: event.target.value,
                        }))
                      }
                      placeholder="What evidence or counterpart perspective could change your decision?"
                    />
                  </label>
                  <div className="button-row">
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={saveDraft}
                    >
                      SAVE DRAFT
                    </button>
                    <button
                      className="primary-button"
                      type="submit"
                      disabled={
                        draft.analysis.trim().length < 30 ||
                        draft.recommendation.trim().length < 15 ||
                        draft.reflection.trim().length < 15 ||
                        !draft.decision
                      }
                    >
                      SUBMIT {role.toUpperCase()} CASE
                    </button>
                  </div>
                  {saved && (
                    <p className="save-confirmation">
                      Founder mission saved to the device backup and queued for
                      private cloud sync.
                    </p>
                  )}
                </form>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
