"use client";

import { useState, type FormEvent } from "react";
import { getFieldMissionTemplates } from "@/content/field-mission-templates";
import type { OperatorStateController } from "@/hooks/use-operator-state";
import type { ExecutiveRole } from "@/lib/domain/executive-role";

function emptyForm(role: ExecutiveRole) {
  return {
  template: getFieldMissionTemplates(role)[0] as string,
  date: "",
  person: "",
  place: "",
  happened: "",
  learned: "",
  uncomfortable: "",
  wentWell: "",
  changeNextTime: "",
  followUp: "",
  };
}

export function FieldOpsView({
  controller,
  role,
}: {
  readonly controller: OperatorStateController;
  readonly role: ExecutiveRole;
}) {
  const templates = getFieldMissionTemplates(role);
  const [form, setForm] = useState(() => emptyForm(role));
  const [saved, setSaved] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    controller.addFieldMission(form);
    setForm(emptyForm(role));
    setSaved(true);
  };

  return (
    <main className="workspace-page">
      <div className="page-masthead">
        <div>
          <span className="kicker">FIELD OPS / {role.toUpperCase()} REPS</span>
          <h2>
            {role === "ceo"
              ? "Put the investment thesis in contact with reality."
              : "Learn where the business lives."}
          </h2>
          <p>
            {role === "ceo"
              ? "Numbers, owners, lenders, listings, assets, assumptions, decisions."
              : "Observation, conversation, discomfort, follow-up, improvement."}
          </p>
        </div>
        <div className="page-stat">
          <strong>{controller.state.fieldMissions.length}</strong>
          <span>MISSIONS LOGGED</span>
        </div>
      </div>

      <div className="tool-layout">
        <section className="tool-form-card">
          <div className="tool-form-card__head">
            <span className="kicker kicker--gold">LOG A FIELD MISSION</span>
            <h3>Capture the rep while it is fresh.</h3>
          </div>
          <form className="form-grid" onSubmit={submit}>
            <label className="field-group field-group--wide">
              <span>MISSION</span>
              <select
                value={form.template}
                onChange={(event) =>
                  setForm((current) => ({ ...current, template: event.target.value }))
                }
              >
                {templates.map((template) => (
                  <option value={template} key={template}>{template}</option>
                ))}
              </select>
            </label>
            <label className="field-group">
              <span>DATE</span>
              <input
                required
                type="date"
                value={form.date}
                onChange={(event) =>
                  setForm((current) => ({ ...current, date: event.target.value }))
                }
              />
            </label>
            <label className="field-group">
              <span>PERSON</span>
              <input
                required
                value={form.person}
                onChange={(event) =>
                  setForm((current) => ({ ...current, person: event.target.value }))
                }
                placeholder="Who did you speak with?"
              />
            </label>
            <label className="field-group field-group--wide">
              <span>PLACE</span>
              <input
                required
                value={form.place}
                onChange={(event) =>
                  setForm((current) => ({ ...current, place: event.target.value }))
                }
                placeholder="Company, location, event, or setting"
              />
            </label>
            {[
              ["happened", "WHAT HAPPENED?"],
              ["learned", "WHAT DID I LEARN?"],
              ["uncomfortable", "WHAT FELT UNCOMFORTABLE?"],
              ["wentWell", "WHAT WENT WELL?"],
              ["changeNextTime", "WHAT WOULD I CHANGE?"],
              ["followUp", "FOLLOW-UP"],
            ].map(([key, label]) => (
              <label className="field-group field-group--wide" key={key}>
                <span>{label}</span>
                <textarea
                  required={key === "happened" || key === "learned"}
                  rows={3}
                  value={form[key as keyof typeof form]}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [key]: event.target.value,
                    }))
                  }
                />
              </label>
            ))}
            <button className="primary-button field-group--wide" type="submit">
              SAVE FIELD MISSION <span aria-hidden="true">→</span>
            </button>
            {saved && <p className="save-confirmation field-group--wide">Mission saved to the device backup and queued for cloud sync. +50 XP</p>}
          </form>
        </section>

        <section className="tool-feed">
          <div className="section-heading section-heading--compact">
            <span className="kicker">MISSION LOG</span>
            <h3>Evidence from the field</h3>
          </div>
          {controller.state.fieldMissions.length === 0 ? (
            <div className="empty-state">
              <span>F</span>
              <h3>No field missions yet.</h3>
              <p>Your first real-world rep can be a conversation, observation, or low-stakes attempt.</p>
            </div>
          ) : (
            controller.state.fieldMissions.map((mission) => (
              <article className="log-card" key={mission.id}>
                <div className="log-card__head">
                  <span>{mission.template}</span>
                  <time>{mission.date}</time>
                </div>
                <h3>{mission.person} · {mission.place}</h3>
                <p>{mission.happened}</p>
                <div className="log-card__lesson">
                  <span>KEY LEARNING</span>
                  <p>{mission.learned}</p>
                </div>
                {mission.followUp && <small>Follow-up: {mission.followUp}</small>}
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
