"use client";

import { getFutureCampaignsForRole } from "@/content/executive-tracks";
import type { OperatorLevel } from "@/content/types";
import {
  getExecutiveRoleDefinition,
  type ExecutiveRole,
} from "@/lib/domain/executive-role";
import type { OperatorState } from "@/lib/domain/operator-state";
import {
  getCampaignProgress,
  isLevelUnlocked,
} from "@/lib/domain/progression";

interface CampaignViewProps {
  readonly state: OperatorState;
  readonly currentLevel: OperatorLevel;
  readonly onOpenLevel: (levelId: string) => void;
  readonly levels: readonly OperatorLevel[];
  readonly role: ExecutiveRole;
}

export function CampaignView({
  state,
  currentLevel,
  onOpenLevel,
  levels,
  role,
}: CampaignViewProps) {
  const progress = getCampaignProgress(state, levels);
  const roleDefinition = getExecutiveRoleDefinition(role);
  const futureCampaigns = getFutureCampaignsForRole(role);

  return (
    <main className="workspace-page">
      <div className="page-masthead page-masthead--campaign">
        <div>
          <span className="kicker">{roleDefinition.campaignName}</span>
          <h2>{role === "ceo" ? "Build the owner." : "Build the operator."}</h2>
          <p>Teach first. Practice second. Test third. Apply fourth.</p>
        </div>
        <div className="campaign-summary">
          <strong>{progress}%</strong>
          <span>CAMPAIGN COMPLETE</span>
        </div>
      </div>

      <section className="campaign-banner">
        <div>
          <span className="kicker kicker--gold">CURRENT OBJECTIVE</span>
          <h3>{roleDefinition.objective}</h3>
        </div>
        <p>
          {role === "ceo"
            ? "Sixteen levels build the finance, investing, deal, leadership, systems, and capital-allocation foundation of a future Skadra Ventures CEO."
            : "Sixteen levels preserve and deepen Gabi's financial, relationship, operating, customer, and leadership foundation as a future Skadra Ventures COO."}
        </p>
      </section>

      <section className="roadmap" aria-label="Year One levels">
        {levels.map((level) => {
          const unlocked = isLevelUnlocked(level.id, state, levels);
          const levelProgress = state.levelProgress[level.id];
          const complete = Boolean(levelProgress?.completedAt);
          const current = currentLevel.id === level.id;

          return (
            <article
              className={
                "roadmap-item" +
                (complete ? " roadmap-item--complete" : "") +
                (current ? " roadmap-item--current" : "") +
                (!unlocked ? " roadmap-item--locked" : "")
              }
              key={level.id}
            >
              <div className="roadmap-item__rail">
                <span>{String(level.number).padStart(2, "0")}</span>
              </div>
              <div className="roadmap-item__body">
                <div>
                  <span className="gold-label">{level.skill}</span>
                  <h3>{level.title}</h3>
                  <p>{level.tagline}</p>
                </div>
                <div className="roadmap-item__meta">
                  <span>{level.durationMinutes} MIN</span>
                  <span>+{level.xpReward} XP</span>
                </div>
              </div>
              <button
                type="button"
                className="roadmap-item__action"
                disabled={!unlocked}
                onClick={() => onOpenLevel(level.id)}
              >
                {complete ? "REVIEW" : current ? "CONTINUE" : unlocked ? "BEGIN" : "LOCKED"}
                <span aria-hidden="true">{unlocked ? "→" : "◇"}</span>
              </button>
            </article>
          );
        })}
      </section>

      <section className="executive-roadmap-section">
        <div className="section-heading">
          <span className="kicker">SKADRA VENTURES / LONG-TERM MAP</span>
          <h2>{roleDefinition.label} progression</h2>
          <p>
            Titles follow durable capability: doer → operator → manager →
            executive → owner.
          </p>
        </div>
        <div className="executive-roadmap-track">
          {roleDefinition.roadmap.map((stage, index) => (
            <div key={stage}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{stage}</strong>
            </div>
          ))}
          <div className="executive-roadmap-track__convergence">
            <span>CEO + COO</span>
            <strong>Skadra Ventures Executive Team</strong>
          </div>
        </div>
      </section>

      <section className="future-campaigns">
        <div className="section-heading">
          <span className="kicker">LONG-TERM CAREER MODE</span>
          <h2>Future campaigns</h2>
          <p>Prestige phases unlock through campaign milestones, not XP alone.</p>
        </div>
        <div className="future-grid">
          {futureCampaigns.map((campaign, index) => (
            <article className="future-card" key={campaign.id}>
              <div className="future-card__head">
                <span>0{index + 2}</span>
                <span>LOCKED</span>
              </div>
              <h3>{campaign.title}</h3>
              <p>{campaign.description}</p>
              <div className="topic-cloud">
                {campaign.topics.slice(0, 7).map((topic) => (
                  <span key={topic}>{topic}</span>
                ))}
                <span>+{campaign.topics.length - 7} more</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
