"use client";

import { useState, type FormEvent } from "react";
import type { OperatorStateController } from "@/hooks/use-operator-state";
import {
  LOCATION_STAGES,
  type LocationStage,
} from "@/lib/domain/operator-state";
import { getPipelineProgress } from "@/lib/domain/pipeline";
import { getVentureSignal } from "@/lib/domain/scoring";

const emptyLocation = {
  company: "",
  contact: "",
  employeesOrTraffic: "",
  currentVending: "",
  problems: "",
  commission: "",
  followUp: "",
  notes: "",
  stage: "Identified" as LocationStage,
};

const emptyVenture = {
  name: "",
  financialAttractiveness: 5,
  operationalAttractiveness: 5,
  peopleRisk: "",
  customerRisk: "",
  managementRisk: "",
  integrationNote: "",
};

export function VenturesView({
  controller,
}: {
  readonly controller: OperatorStateController;
}) {
  const [activeTab, setActiveTab] = useState<"pipeline" | "founders">("pipeline");
  const [locationForm, setLocationForm] = useState(emptyLocation);
  const [ventureForm, setVentureForm] = useState(emptyVenture);
  const [showLocationForm, setShowLocationForm] = useState(false);

  const saveLocation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    controller.addLocation(locationForm);
    setLocationForm(emptyLocation);
    setShowLocationForm(false);
  };

  const saveVenture = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    controller.addSharedVenture(ventureForm);
    setVentureForm(emptyVenture);
  };

  return (
    <main className="workspace-page">
      <div className="page-masthead">
        <div>
          <span className="kicker">VENTURES / OPPORTUNITY OPERATIONS</span>
          <h2>Build the pipeline. Assess the operation.</h2>
          <p>V1 stays local. Future founder integration remains a deliberate boundary.</p>
        </div>
      </div>

      <div className="tabs" role="tablist">
        <button type="button" className={activeTab === "pipeline" ? "tab tab--active" : "tab"} onClick={() => setActiveTab("pipeline")}>Location Pipeline</button>
        <button type="button" className={activeTab === "founders" ? "tab tab--active" : "tab"} onClick={() => setActiveTab("founders")}>Founders Mode</button>
      </div>

      {activeTab === "pipeline" && (
        <>
          <section className="pipeline-header">
            <div>
              <span className="kicker kicker--gold">SKADRA VENDING</span>
              <h3>Location pipeline</h3>
            </div>
            <button className="primary-button primary-button--small" type="button" onClick={() => setShowLocationForm((value) => !value)}>
              {showLocationForm ? "CLOSE FORM" : "+ ADD LOCATION"}
            </button>
          </section>

          <div className="stage-track" aria-label="Location stages">
            {LOCATION_STAGES.map((stage, index) => (
              <div key={stage}><span>{String(index + 1).padStart(2, "0")}</span>{stage}</div>
            ))}
          </div>

          {showLocationForm && (
            <section className="inline-form-panel">
              <div><span className="kicker kicker--gold">NEW OPPORTUNITY</span><h3>Capture the location and its operating context.</h3></div>
              <form className="form-grid form-grid--three" onSubmit={saveLocation}>
                {[
                  ["company", "COMPANY"],
                  ["contact", "CONTACT"],
                  ["employeesOrTraffic", "EMPLOYEES / TRAFFIC"],
                  ["currentVending", "CURRENT VENDING"],
                  ["problems", "PROBLEMS"],
                  ["commission", "COMMISSION"],
                  ["followUp", "FOLLOW-UP"],
                  ["notes", "NOTES"],
                ].map(([key, label]) => (
                  <label className={key === "notes" ? "field-group field-group--wide" : "field-group"} key={key}>
                    <span>{label}</span>
                    {key === "notes" ? (
                      <textarea rows={3} value={locationForm[key]} onChange={(event) => setLocationForm((current) => ({ ...current, [key]: event.target.value }))} />
                    ) : (
                      <input required={key === "company"} value={locationForm[key as keyof typeof locationForm]} onChange={(event) => setLocationForm((current) => ({ ...current, [key]: event.target.value }))} />
                    )}
                  </label>
                ))}
                <label className="field-group">
                  <span>STAGE</span>
                  <select value={locationForm.stage} onChange={(event) => setLocationForm((current) => ({ ...current, stage: event.target.value as LocationStage }))}>
                    {LOCATION_STAGES.map((stage) => <option key={stage}>{stage}</option>)}
                  </select>
                </label>
                <button className="primary-button field-group--wide" type="submit">SAVE LOCATION <span>→</span></button>
              </form>
            </section>
          )}

          {controller.state.locations.length === 0 ? (
            <div className="empty-state empty-state--large">
              <span>LOC</span>
              <h3>No locations in the pipeline.</h3>
              <p>Start with an identified company. Progress becomes real through a clear stage and follow-up.</p>
              <button className="secondary-button" type="button" onClick={() => setShowLocationForm(true)}>ADD THE FIRST LOCATION</button>
            </div>
          ) : (
            <section className="pipeline-list">
              {controller.state.locations.map((location) => (
                <article className="pipeline-card" key={location.id}>
                  <div className="pipeline-card__main">
                    <span className="gold-label">{location.stage}</span>
                    <h3>{location.company}</h3>
                    <p>{location.contact || "Contact not identified"} · {location.employeesOrTraffic || "Traffic unknown"}</p>
                  </div>
                  <div className="pipeline-card__problem"><span>PROBLEM TO SOLVE</span><p>{location.problems || "Not documented"}</p></div>
                  <div className="pipeline-card__progress">
                    <div><span style={{ width: getPipelineProgress(location.stage) + "%" }} /></div>
                    <small>{getPipelineProgress(location.stage)}% THROUGH PIPELINE</small>
                  </div>
                  <button
                    className="secondary-button"
                    type="button"
                    disabled={location.stage === "Active"}
                    onClick={() => controller.advanceLocationStage(location.id)}
                  >
                    {location.stage === "Active" ? "ACTIVE" : "ADVANCE STAGE →"}
                  </button>
                </article>
              ))}
            </section>
          )}
        </>
      )}

      {activeTab === "founders" && (
        <div className="founders-layout">
          <section className="founders-brief">
            <span className="kicker kicker--gold">FUTURE INTEGRATION SEAM</span>
            <h2>Two lenses.<br />One investment decision.</h2>
            <div className="founder-lenses">
              <div><span>ANDREW / CEO</span><strong>Financial attractiveness</strong><p>Price, return, financing, structure, capital allocation.</p></div>
              <div><span>GABI / COO</span><strong>Operational attractiveness</strong><p>People, customers, management, systems, culture, integration.</p></div>
            </div>
            <p className="founders-boundary">This V1 does not connect to Andrew&apos;s application. It stores Gabi&apos;s independent operating assessment locally through a future-ready SharedVenture record.</p>
          </section>

          <section className="tool-form-card">
            <div className="tool-form-card__head"><span className="kicker kicker--gold">ASSESS A SHARED VENTURE</span><h3>Keep economics and operating reality visible.</h3></div>
            <form className="form-grid" onSubmit={saveVenture}>
              <label className="field-group field-group--wide"><span>VENTURE / TARGET</span><input required value={ventureForm.name} onChange={(event) => setVentureForm((current) => ({ ...current, name: event.target.value }))} /></label>
              <label className="field-group"><span>FINANCIAL / {ventureForm.financialAttractiveness}/10</span><input type="range" min="1" max="10" value={ventureForm.financialAttractiveness} onChange={(event) => setVentureForm((current) => ({ ...current, financialAttractiveness: Number(event.target.value) }))} /></label>
              <label className="field-group"><span>OPERATIONAL / {ventureForm.operationalAttractiveness}/10</span><input type="range" min="1" max="10" value={ventureForm.operationalAttractiveness} onChange={(event) => setVentureForm((current) => ({ ...current, operationalAttractiveness: Number(event.target.value) }))} /></label>
              {[
                ["peopleRisk", "PEOPLE RISK"],
                ["customerRisk", "CUSTOMER RISK"],
                ["managementRisk", "MANAGEMENT RISK"],
                ["integrationNote", "INTEGRATION NOTE"],
              ].map(([key, label]) => (
                <label className="field-group field-group--wide" key={key}><span>{label}</span><textarea rows={3} value={ventureForm[key as keyof typeof ventureForm]} onChange={(event) => setVentureForm((current) => ({ ...current, [key]: event.target.value }))} /></label>
              ))}
              <div className="venture-signal field-group--wide"><span>COMBINED SIGNAL</span><strong>{getVentureSignal(ventureForm.financialAttractiveness, ventureForm.operationalAttractiveness)}</strong></div>
              <button className="primary-button field-group--wide" type="submit">SAVE ASSESSMENT <span>→</span></button>
            </form>
          </section>

          <section className="venture-list">
            {controller.state.sharedVentures.map((venture) => (
              <article className="venture-card" key={venture.id}>
                <span>{getVentureSignal(venture.financialAttractiveness, venture.operationalAttractiveness)}</span>
                <h3>{venture.name}</h3>
                <div><strong>{venture.financialAttractiveness}/10</strong><small>FINANCIAL</small><strong>{venture.operationalAttractiveness}/10</strong><small>OPERATIONAL</small></div>
                <p>{venture.integrationNote || venture.managementRisk || "Assessment saved for future review."}</p>
              </article>
            ))}
          </section>
        </div>
      )}
    </main>
  );
}

