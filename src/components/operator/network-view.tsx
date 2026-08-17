"use client";

import { useState, type FormEvent } from "react";
import { relationshipCategories } from "@/content/field-mission-templates";
import type { OperatorStateController } from "@/hooks/use-operator-state";

const emptyRelationship = {
  name: "",
  company: "",
  role: "",
  category: relationshipCategories[0] as string,
  howWeMet: "",
  caresAbout: "",
  lastContact: "",
  nextContact: "",
  notes: "",
  strength: 1,
};

export function NetworkView({
  controller,
}: {
  readonly controller: OperatorStateController;
}) {
  const [form, setForm] = useState(emptyRelationship);
  const [showForm, setShowForm] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    controller.addRelationship(form);
    setForm(emptyRelationship);
    setShowForm(false);
  };

  const dueContacts = controller.state.relationships.filter(
    (item) => item.nextContact && item.nextContact <= new Date().toISOString().slice(0, 10),
  ).length;

  return (
    <main className="workspace-page">
      <div className="page-masthead">
        <div>
          <span className="kicker">RELATIONSHIP NETWORK / BUILD THE ROOM</span>
          <h2>Relationships before requests.</h2>
          <p>Remember what matters. Keep promises. Stay genuinely useful.</p>
        </div>
        <button className="primary-button primary-button--small" type="button" onClick={() => setShowForm((value) => !value)}>
          {showForm ? "CLOSE FORM" : "+ ADD RELATIONSHIP"}
        </button>
      </div>

      <section className="network-stats">
        <article>
          <span>NETWORK SIZE</span>
          <strong>{controller.state.relationships.length}</strong>
        </article>
        <article>
          <span>FOLLOW-UPS DUE</span>
          <strong>{dueContacts}</strong>
        </article>
        <article>
          <span>CATEGORIES ACTIVE</span>
          <strong>{new Set(controller.state.relationships.map((item) => item.category)).size}</strong>
        </article>
      </section>

      {showForm && (
        <section className="inline-form-panel">
          <div>
            <span className="kicker kicker--gold">NEW RELATIONSHIP</span>
            <h3>Record context, not just contact data.</h3>
          </div>
          <form className="form-grid form-grid--three" onSubmit={submit}>
            <label className="field-group">
              <span>NAME</span>
              <input required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            </label>
            <label className="field-group">
              <span>COMPANY</span>
              <input required value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} />
            </label>
            <label className="field-group">
              <span>ROLE</span>
              <input required value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} />
            </label>
            <label className="field-group">
              <span>CATEGORY</span>
              <select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}>
                {relationshipCategories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label className="field-group">
              <span>LAST CONTACT</span>
              <input type="date" value={form.lastContact} onChange={(event) => setForm((current) => ({ ...current, lastContact: event.target.value }))} />
            </label>
            <label className="field-group">
              <span>NEXT CONTACT</span>
              <input type="date" value={form.nextContact} onChange={(event) => setForm((current) => ({ ...current, nextContact: event.target.value }))} />
            </label>
            <label className="field-group field-group--wide">
              <span>HOW WE MET</span>
              <input value={form.howWeMet} onChange={(event) => setForm((current) => ({ ...current, howWeMet: event.target.value }))} />
            </label>
            <label className="field-group field-group--wide">
              <span>WHAT THEY CARE ABOUT</span>
              <textarea rows={3} value={form.caresAbout} onChange={(event) => setForm((current) => ({ ...current, caresAbout: event.target.value }))} />
            </label>
            <label className="field-group field-group--wide">
              <span>NOTES</span>
              <textarea rows={3} value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
            </label>
            <label className="field-group field-group--wide">
              <span>RELATIONSHIP STRENGTH / {form.strength}</span>
              <input type="range" min="1" max="5" value={form.strength} onChange={(event) => setForm((current) => ({ ...current, strength: Number(event.target.value) }))} />
            </label>
            <button className="primary-button field-group--wide" type="submit">SAVE RELATIONSHIP <span>→</span></button>
          </form>
        </section>
      )}

      {controller.state.relationships.length === 0 ? (
        <div className="empty-state empty-state--large">
          <span>N</span>
          <h3>Your future network starts with one person.</h3>
          <p>Add a business owner, customer, property manager, vendor, banker, CPA, attorney, executive, community leader, or mentor.</p>
          <button className="secondary-button" type="button" onClick={() => setShowForm(true)}>ADD THE FIRST RELATIONSHIP</button>
        </div>
      ) : (
        <section className="relationship-grid">
          {controller.state.relationships.map((relationship) => (
            <article className="relationship-card" key={relationship.id}>
              <div className="relationship-card__head">
                <span>{relationship.name.slice(0, 1).toUpperCase()}</span>
                <div className="strength-dots" aria-label={"Relationship strength " + relationship.strength + " of 5"}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <i className={value <= relationship.strength ? "active" : ""} key={value} />
                  ))}
                </div>
              </div>
              <span className="gold-label">{relationship.category}</span>
              <h3>{relationship.name}</h3>
              <p>{relationship.role} · {relationship.company}</p>
              {relationship.caresAbout && (
                <div className="relationship-card__detail">
                  <span>WHAT THEY CARE ABOUT</span>
                  <p>{relationship.caresAbout}</p>
                </div>
              )}
              <div className="relationship-card__dates">
                <div><span>LAST</span><strong>{relationship.lastContact || "—"}</strong></div>
                <div><span>NEXT</span><strong>{relationship.nextContact || "—"}</strong></div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

