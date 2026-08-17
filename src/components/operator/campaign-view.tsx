"use client";

import { futureCampaigns } from "@/content/future-campaigns";
import { yearOneLevels } from "@/content/levels";
import type { OperatorLevel } from "@/content/types";
import type { OperatorState } from "@/lib/domain/operator-state";
import {
  getCampaignProgress,
  isLevelUnlocked,
} from "@/lib/domain/progression";

interface CampaignViewProps {
  readonly state: OperatorState;
  readonly currentLevel: OperatorLevel;
  readonly onOpenLevel: (levelId: string) => void;
}

export function CampaignView({
  state,
  currentLevel,
  onOpenLevel,
}: CampaignViewProps) {
  const progress = getCampaignProgress(state, yearOneLevels);

  return (
    <main className="workspace-page">
      <div className="page-masthead page-masthead--campaign">
        <div>
          <span className="kicker">YEAR ONE / CORE OPERATOR CAMPAIGN</span>
          <h2>Build the operator.</h2>
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
          <h3>People + Operations + Relationships + Execution</h3>
        </div>
        <p>
          Sixteen levels build the financial, relationship, operating, and
          leadership foundation of a future Skadra Ventures COO.
        </p>
      </section>

      <section className="roadmap" aria-label="Year One levels">
        {yearOneLevels.map((level) => {
          const unlocked = isLevelUnlocked(level.id, state, yearOneLevels);
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

