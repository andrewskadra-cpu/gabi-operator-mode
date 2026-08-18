"use client";

import { useState, type FormEvent } from "react";
import type { OperatorStateController } from "@/hooks/use-operator-state";
import type { CustomerExperienceMetric } from "@/lib/domain/operator-state";
import type { ExecutiveRole } from "@/lib/domain/executive-role";
import { averageScore } from "@/lib/domain/scoring";
import { roleLabLenses } from "@/content/executive-tracks";

const metricLabels: Readonly<Record<CustomerExperienceMetric, string>> = {
  greeting: "Greeting",
  speed: "Speed",
  cleanliness: "Cleanliness",
  communication: "Communication",
  problemResolution: "Problem resolution",
  ease: "Ease",
  value: "Value",
  consistency: "Consistency",
  personalization: "Personalization",
  likelihoodToReturn: "Likelihood to return",
};

const initialScores = Object.fromEntries(
  Object.keys(metricLabels).map((metric) => [metric, 3]),
) as Record<CustomerExperienceMetric, number>;

const peopleScenarios = [
  {
    id: "promotion",
    category: "PROMOTION",
    title: "The dependable expert",
    scenario:
      "Maya is the team's most reliable technician and people ask her for help. She has never managed, avoids conflict, and wants the open supervisor role.",
    choices: [
      {
        id: "a",
        label: "Promote immediately because the best technician deserves the role.",
        feedback:
          "This rewards performance, but it assumes technical excellence proves readiness for a different job.",
      },
      {
        id: "b",
        label: "Reject the idea because conflict avoidance means she cannot lead.",
        feedback:
          "This protects the team from risk, but closes the door without testing whether coaching and experience could build the missing skill.",
      },
      {
        id: "c",
        label: "Define the supervisor outcomes, run a 60-day leadership trial with coaching, and evaluate evidence.",
        feedback:
          "This creates a fair experiment. It still carries risk, but it separates potential from wishful thinking and gives Maya real support.",
      },
    ],
  },
  {
    id: "compensation",
    category: "COMPENSATION",
    title: "The retention request",
    scenario:
      "A high-performing manager requests a 15% raise after receiving outside interest. Internal pay is inconsistent and no manager scorecard exists.",
    choices: [
      {
        id: "a",
        label: "Match immediately to prevent a resignation.",
        feedback:
          "Fast action may retain the manager, but can deepen pay inconsistency and avoid the underlying role and performance questions.",
      },
      {
        id: "b",
        label: "Discuss role scope, performance evidence, market context, internal equity, and a dated decision process.",
        feedback:
          "This is slower than an instant answer but protects fairness and makes the decision explainable.",
      },
      {
        id: "c",
        label: "Refuse because employees should not use outside interest in compensation discussions.",
        feedback:
          "This may feel principled, but it ignores real labor-market information and may sacrifice a strong leader without learning.",
      },
    ],
  },
  {
    id: "conflict",
    category: "CONFLICT",
    title: "The two strong managers",
    scenario:
      "Sales promises custom service that operations says it cannot deliver. Both managers are capable and both blame the other team.",
    choices: [
      {
        id: "a",
        label: "Choose the stronger manager's version and move forward.",
        feedback:
          "This creates speed, but may leave the broken commercial-to-operating handoff untouched.",
      },
      {
        id: "b",
        label: "Tell them to work it out privately.",
        feedback:
          "Autonomy can be useful, but the conflict involves shared standards and customer promises that need executive clarity.",
      },
      {
        id: "c",
        label: "Map the customer promise, capacity, economics, handoff, decision rights, and escalation rule together.",
        feedback:
          "This may expose hard tradeoffs, but it turns blame into a shared operating design and a repeatable decision path.",
      },
    ],
  },
] as const;

const ceoPeopleScenarios = [
  {
    id: "ceo-controller-hire",
    category: "EXECUTIVE HIRING",
    title: "The first finance leader",
    scenario:
      "Skadra's reporting is late and Andrew owns every model. A strong controller candidate costs more than budget, while a cheaper candidate needs substantial development.",
    choices: [
      { id: "a", label: "Hire the cheaper candidate and keep reviewing every detail.", feedback: "This protects near-term cash but may preserve the CEO bottleneck and weak controls." },
      { id: "b", label: "Define the outcomes, quantify the cost of weak reporting, assess both candidates against the role, and stage the investment if needed.", feedback: "This connects talent cost to decision quality, capacity, controls, and a measurable transition." },
      { id: "c", label: "Hire the strongest candidate immediately because finance is critical.", feedback: "The capability may be right, but the decision still needs role scope, economics, references, and success measures." },
    ],
  },
  {
    id: "ceo-manager-performance",
    category: "MANAGING MANAGERS",
    title: "The results-only manager",
    scenario:
      "A portfolio manager hits profit targets while turnover, customer complaints, and control exceptions rise. Replacing the manager could disrupt the year.",
    choices: [
      { id: "a", label: "Keep the manager because profit is the CEO's primary score.", feedback: "Current earnings may be consuming future capability, trust, and control quality." },
      { id: "b", label: "Set a time-bound improvement plan across financial and operating evidence, protect customers and staff, and prepare a succession option.", feedback: "This preserves accountability without pretending the transition risk is zero." },
      { id: "c", label: "Replace the manager immediately to signal culture matters.", feedback: "Urgency may be warranted, but succession capacity and verified facts still matter." },
    ],
  },
  {
    id: "ceo-capital-conflict",
    category: "CAPITAL CONFLICT",
    title: "The two credible proposals",
    scenario:
      "The COO recommends a systems hire to protect execution. The acquisition pipeline needs the same cash for a deposit. Both cases are credible and time-sensitive.",
    choices: [
      { id: "a", label: "Fund the acquisition because deals create growth.", feedback: "This may underprice the operating capacity needed to integrate and compound the asset." },
      { id: "b", label: "Compare return, downside, reversibility, capacity, and staged options with the COO, then make and document the allocation.", feedback: "This treats operating capacity and deal opportunity as parts of one capital system." },
      { id: "c", label: "Split the cash evenly to preserve the partnership.", feedback: "Fairness is not necessarily an economically coherent allocation." },
    ],
  },
] as const;

export function LabsView({
  controller,
  role,
}: {
  readonly controller: OperatorStateController;
  readonly role: ExecutiveRole;
}) {
  const [activeLab, setActiveLab] = useState<"cx" | "operations" | "people">("cx");
  const [cxForm, setCxForm] = useState({
    business: "",
    visitDate: "",
    scores: { ...initialScores },
    skadraDifference: "",
  });
  const [processForm, setProcessForm] = useState({
    name: "",
    input: "",
    stepsText: "",
    output: "",
    bottleneck: "",
    delay: "",
    waste: "",
    risk: "",
    customerImpact: "",
    owner: "",
    improvement: "",
  });
  const lens = roleLabLenses[role];
  const activePeopleScenarios =
    role === "ceo" ? ceoPeopleScenarios : peopleScenarios;

  const saveAudit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    controller.addCustomerAudit(cxForm);
    setCxForm({
      business: "",
      visitDate: "",
      scores: { ...initialScores },
      skadraDifference: "",
    });
  };

  const saveProcess = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { stepsText, ...rest } = processForm;
    controller.addProcessMap({
      ...rest,
      steps: stepsText
        .split("\n")
        .map((step) => step.trim())
        .filter(Boolean),
    });
    setProcessForm({
      name: "",
      input: "",
      stepsText: "",
      output: "",
      bottleneck: "",
      delay: "",
      waste: "",
      risk: "",
      customerImpact: "",
      owner: "",
      improvement: "",
    });
  };

  return (
    <main className="workspace-page">
      <div className="page-masthead">
        <div>
          <span className="kicker">{lens.eyebrow}</span>
          <h2>{lens.title}</h2>
          <p>{lens.description}</p>
        </div>
      </div>

      <div className="tabs" role="tablist" aria-label="Operator labs">
        {[
          ["cx", "Customer Experience Lab"],
          ["operations", "Operations Lab"],
          ["people", "People Lab"],
        ].map(([id, label]) => (
          <button
            type="button"
            role="tab"
            aria-selected={activeLab === id}
            className={activeLab === id ? "tab tab--active" : "tab"}
            key={id}
            onClick={() => setActiveLab(id as typeof activeLab)}
          >
            {label}
          </button>
        ))}
      </div>

      {activeLab === "cx" && (
        <div className="lab-layout">
          <section className="tool-form-card">
            <div className="tool-form-card__head">
              <span className="kicker kicker--gold">CUSTOMER EXPERIENCE AUDIT</span>
              <h3>Score what the customer actually experiences.</h3>
              <p>{lens.customerPrompt}</p>
            </div>
            <form className="form-grid" onSubmit={saveAudit}>
              <label className="field-group">
                <span>BUSINESS</span>
                <input required value={cxForm.business} onChange={(event) => setCxForm((current) => ({ ...current, business: event.target.value }))} />
              </label>
              <label className="field-group">
                <span>VISIT DATE</span>
                <input required type="date" value={cxForm.visitDate} onChange={(event) => setCxForm((current) => ({ ...current, visitDate: event.target.value }))} />
              </label>
              <div className="score-grid field-group--wide">
                {(Object.entries(metricLabels) as [CustomerExperienceMetric, string][]).map(([metric, label]) => (
                  <label className="score-control" key={metric}>
                    <span>{label}</span>
                    <div>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          type="button"
                          key={value}
                          className={cxForm.scores[metric] === value ? "active" : ""}
                          onClick={() =>
                            setCxForm((current) => ({
                              ...current,
                              scores: { ...current.scores, [metric]: value },
                            }))
                          }
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </label>
                ))}
              </div>
              <div className="audit-average field-group--wide">
                <span>EXPERIENCE SCORE</span>
                <strong>{averageScore(cxForm.scores)} / 5</strong>
              </div>
              <label className="field-group field-group--wide">
                <span>WHAT WOULD SKADRA VENTURES DO DIFFERENTLY?</span>
                <textarea required rows={5} value={cxForm.skadraDifference} onChange={(event) => setCxForm((current) => ({ ...current, skadraDifference: event.target.value }))} />
              </label>
              <button className="primary-button field-group--wide" type="submit">SAVE EXPERIENCE AUDIT <span>→</span></button>
            </form>
          </section>
          <section className="tool-feed">
            <div className="section-heading section-heading--compact">
              <span className="kicker">AUDIT HISTORY</span>
              <h3>{controller.state.customerAudits.length} businesses observed</h3>
            </div>
            {controller.state.customerAudits.length === 0 ? (
              <div className="empty-state"><span>CX</span><h3>No audits yet.</h3><p>Visit a business and score the whole experience, not just the transaction.</p></div>
            ) : (
              controller.state.customerAudits.map((audit) => (
                <article className="log-card" key={audit.id}>
                  <div className="log-card__head"><span>{audit.business}</span><time>{audit.visitDate}</time></div>
                  <div className="audit-result"><strong>{averageScore(audit.scores)}</strong><span>/ 5 EXPERIENCE</span></div>
                  <p>{audit.skadraDifference}</p>
                </article>
              ))
            )}
          </section>
        </div>
      )}

      {activeLab === "operations" && (
        <div className="lab-layout">
          <section className="tool-form-card">
            <div className="tool-form-card__head">
              <span className="kicker kicker--gold">PROCESS MAPPER</span>
              <h3>Make the invisible operating system visible.</h3>
              <p>{lens.operationsPrompt}</p>
            </div>
            <form className="form-grid" onSubmit={saveProcess}>
              <label className="field-group field-group--wide"><span>PROCESS NAME</span><input required value={processForm.name} onChange={(event) => setProcessForm((current) => ({ ...current, name: event.target.value }))} placeholder="Example: Restock a vending machine" /></label>
              <label className="field-group"><span>INPUT</span><input required value={processForm.input} onChange={(event) => setProcessForm((current) => ({ ...current, input: event.target.value }))} /></label>
              <label className="field-group"><span>OUTPUT</span><input required value={processForm.output} onChange={(event) => setProcessForm((current) => ({ ...current, output: event.target.value }))} /></label>
              <label className="field-group field-group--wide"><span>STEPS / ONE PER LINE</span><textarea required rows={6} value={processForm.stepsText} onChange={(event) => setProcessForm((current) => ({ ...current, stepsText: event.target.value }))} /></label>
              {[
                ["bottleneck", "BOTTLENECK"],
                ["delay", "DELAY"],
                ["waste", "WASTE"],
                ["risk", "RISK"],
                ["customerImpact", "CUSTOMER IMPACT"],
                ["owner", "OWNER"],
                ["improvement", "IMPROVEMENT"],
              ].map(([key, label]) => (
                <label className={key === "improvement" ? "field-group field-group--wide" : "field-group"} key={key}>
                  <span>{label}</span>
                  <input required={key === "owner" || key === "improvement"} value={processForm[key as keyof typeof processForm]} onChange={(event) => setProcessForm((current) => ({ ...current, [key]: event.target.value }))} />
                </label>
              ))}
              <button className="primary-button field-group--wide" type="submit">SAVE PROCESS MAP <span>→</span></button>
            </form>
          </section>
          <section className="tool-feed">
            <div className="section-heading section-heading--compact"><span className="kicker">PROCESS LIBRARY</span><h3>{controller.state.processMaps.length} systems mapped</h3></div>
            {controller.state.processMaps.length === 0 ? (
              <div className="empty-state"><span>OPS</span><h3>No process maps yet.</h3><p>Start with a repeated activity that depends too much on memory.</p></div>
            ) : (
              controller.state.processMaps.map((process) => (
                <article className="process-card" key={process.id}>
                  <span className="gold-label">{process.owner || "OWNER UNASSIGNED"}</span>
                  <h3>{process.name}</h3>
                  <div className="process-flow">
                    <span>{process.input}</span>
                    {process.steps.map((step) => <span key={step}>{step}</span>)}
                    <span>{process.output}</span>
                  </div>
                  <div className="process-risk"><span>BOTTLENECK</span><p>{process.bottleneck || "Not identified"}</p></div>
                  <div className="process-improvement"><span>IMPROVEMENT</span><p>{process.improvement}</p></div>
                </article>
              ))
            )}
          </section>
        </div>
      )}

      {activeLab === "people" && (
        <section className="people-lab">
          <div className="section-heading">
            <span className="kicker">PEOPLE LAB / JUDGMENT PRACTICE</span>
            <h2>No perfect candidates. No obvious answers.</h2>
            <p>Choose, then inspect the tradeoff and consequence.</p>
          </div>
          <div className="people-scenarios">
            {activePeopleScenarios.map((scenario, scenarioIndex) => {
              const answer = controller.state.peopleLabSessions.find(
                (session) => session.scenarioId === scenario.id,
              )?.choiceId;
              const selected = scenario.choices.find((choice) => choice.id === answer);

              return (
                <article className="people-card" key={scenario.id}>
                  <div className="people-card__index">
                    <span>{String(scenarioIndex + 1).padStart(2, "0")}</span>
                    {scenario.category}
                  </div>
                  <h3>{scenario.title}</h3>
                  <p>{scenario.scenario}</p>
                  <div className="people-choices">
                    {scenario.choices.map((choice) => (
                      <button
                        type="button"
                        key={choice.id}
                        className={answer === choice.id ? "active" : ""}
                        onClick={() =>
                          controller.savePeopleLabAnswer(scenario.id, choice.id)
                        }
                      >
                        <span>{choice.id.toUpperCase()}</span>
                        {choice.label}
                      </button>
                    ))}
                  </div>
                  {selected && <div className="consequence"><span>CONSEQUENCE LENS</span><p>{selected.feedback}</p></div>}
                </article>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
