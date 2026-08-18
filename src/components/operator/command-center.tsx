"use client";

import type { Achievement } from "@/lib/domain/achievements";
import type { AppView, OperatorState } from "@/lib/domain/operator-state";
import type { OperatorLevel } from "@/content/types";
import type { ExecutiveRole } from "@/lib/domain/executive-role";
import {
  formatExecutiveSkill,
  getExecutiveRoleDefinition,
} from "@/lib/domain/executive-role";
import {
  getExecutiveNextAction,
  type ExecutiveSkillScore,
} from "@/lib/domain/executive-scorecards";
import type { SyncStatus } from "@/lib/persistence/operator-state-sync-engine";
import {
  getRankProgress,
  type Rank,
} from "@/lib/domain/progression";

interface CommandCenterProps {
  readonly state: OperatorState;
  readonly xp: number;
  readonly rank: Rank;
  readonly campaignProgress: number;
  readonly currentLevel: OperatorLevel;
  readonly achievements: readonly Achievement[];
  readonly role: ExecutiveRole;
  readonly skillScores: readonly ExecutiveSkillScore[];
  readonly syncStatus: SyncStatus;
  readonly onOpenLevel: () => void;
  readonly onNavigate: (view: AppView) => void;
}

export function CommandCenter({
  state,
  xp,
  rank,
  campaignProgress,
  currentLevel,
  achievements,
  role,
  skillScores,
  syncStatus,
  onOpenLevel,
  onNavigate,
}: CommandCenterProps) {
  const rankProgress = getRankProgress(xp, rank);
  const nextRankXp = rank.nextMinimumXp;
  const recentAchievements = achievements.slice(-3).reverse();
  const roleDefinition = getExecutiveRoleDefinition(role);
  const nextAction = getExecutiveNextAction(state, currentLevel);

  return (
    <main className="workspace-page">
      <div className="page-masthead">
        <div>
          <span className="kicker">G-OPS / {roleDefinition.commandName}</span>
          <h2>Good morning, {state.profile.name}.</h2>
          <p>{roleDefinition.commandLede}</p>
        </div>
        <div className={`status-chip status-chip--${syncStatus.phase}`}>
          <span className="status-chip__pulse" aria-hidden="true" />
          {syncStatus.phase === "saved"
            ? "CLOUD + DEVICE SAVED"
            : syncStatus.phase === "offline"
              ? "DEVICE BACKUP ACTIVE"
              : syncStatus.phase === "issue"
                ? "CLOUD SYNC NEEDS ATTENTION"
                : "SECURE SYNC ACTIVE"}
        </div>
      </div>

      <section className="command-grid" aria-label="Operator command center">
        <article className="card rank-card">
          <div className="card__header">
            <span className="kicker">{roleDefinition.shortLabel} RANK</span>
            <span className="card__code">R-01</span>
          </div>
          <div className="rank-card__body">
            <span className="rank-card__mark">{rank.name.slice(0, 1)}</span>
            <div>
              <h3>{rank.name}</h3>
              <p>{xp.toLocaleString()} total XP</p>
            </div>
          </div>
          <div className="progress-track" aria-label={rankProgress + "% toward next rank"}>
            <span style={{ width: rankProgress + "%" }} />
          </div>
          <div className="progress-meta">
            <span>{rankProgress}% THROUGH RANK</span>
            <span>{nextRankXp ? (nextRankXp - xp) + " XP TO NEXT" : "TOP CORE RANK"}</span>
          </div>
        </article>

        <article className="card level-card">
          <div className="card__header">
            <span className="kicker">CURRENT LEVEL</span>
            <span className="card__code">{String(currentLevel.number).padStart(2, "0")} / 16</span>
          </div>
          <span className="level-card__number">{String(currentLevel.number).padStart(2, "0")}</span>
          <div>
            <span className="gold-label">{currentLevel.skill}</span>
            <h3>{currentLevel.title}</h3>
            <p>{currentLevel.tagline}</p>
          </div>
        </article>

        <article className="card progress-card">
          <div className="card__header">
            <span className="kicker">CAMPAIGN PROGRESS</span>
            <span className="card__code">CAMPAIGN I</span>
          </div>
          <div className="progress-card__ring" style={{ "--progress": campaignProgress } as React.CSSProperties}>
            <span>{campaignProgress}%</span>
          </div>
          <div>
            <h3>{Object.values(state.levelProgress).filter((item) => item.completedAt).length} of 16 levels complete</h3>
            <p>{roleDefinition.campaignName}</p>
          </div>
        </article>

        <article className="next-action-card">
          <div className="next-action-card__top">
            <span className="kicker kicker--gold">PRIORITY / NEXT ACTION</span>
            <span>+{currentLevel.xpReward} XP</span>
          </div>
          <div className="next-action-card__content">
            <div className="next-action-card__index">
              <span>LEVEL</span>
              {String(currentLevel.number).padStart(2, "0")}
            </div>
            <div>
              <span className="gold-label">{nextAction.label}</span>
              <h3>{nextAction.title}</h3>
              <p>{nextAction.description}</p>
              <button className="primary-button primary-button--gold" type="button" onClick={onOpenLevel}>
                CONTINUE MISSION
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </article>

        <article className="card weekly-card">
          <div className="card__header">
            <span className="kicker">THIS WEEK&apos;S MISSION</span>
            <span className="card__code">FIELD / 01</span>
          </div>
          <div className="weekly-card__icon">F</div>
          <h3>{currentLevel.fieldMission.title}</h3>
          <p>{currentLevel.fieldMission.prompt}</p>
          <button className="text-button" type="button" onClick={() => onNavigate("field-ops")}>
            OPEN FIELD OPS <span aria-hidden="true">→</span>
          </button>
        </article>

        <article className="card pulse-card">
          <div className="card__header">
            <span className="kicker">{roleDefinition.shortLabel} PULSE</span>
            <span className="card__code">LIVE</span>
          </div>
          <div className="metric-row">
            <div>
              <strong>{state.fieldMissions.length}</strong>
              <span>{role === "ceo" ? "Investment reps" : "Field ops"}</span>
            </div>
            <div>
              <strong>{state.relationships.length}</strong>
              <span>Network</span>
            </div>
            <div>
              <strong>
                {role === "ceo"
                  ? state.sharedVentures.length + state.founderMissions.length
                  : state.locations.length}
              </strong>
              <span>{role === "ceo" ? "Cases" : "Locations"}</span>
            </div>
          </div>
          <div className="principle-line">
            {roleDefinition.principles.map((principle) => (
              <span key={principle}>{principle}</span>
            ))}
          </div>
        </article>

        <article className="card executive-scorecard">
          <div className="card__header">
            <span className="kicker">EXECUTIVE SCORECARD</span>
            <span className="card__code">EVIDENCE-BASED</span>
          </div>
          <div className="executive-scorecard__grid">
            {skillScores.map((item) => (
              <div key={item.skill}>
                <span>{formatExecutiveSkill(item.skill)}</span>
                <strong>{item.score}</strong>
                <div aria-label={`${item.score} out of 100`}>
                  <i style={{ width: `${item.score}%` }} />
                </div>
                <small>
                  {item.evidenceCount === 0
                    ? "No evidence yet"
                    : `${item.evidenceCount} evidence ${item.evidenceCount === 1 ? "source" : "sources"}`}
                </small>
              </div>
            ))}
          </div>
        </article>

        <article className="card role-card">
          <div className="card__header">
            <span className="kicker">THE EXECUTIVE PARTNERSHIP</span>
            <span className="card__code">SV</span>
          </div>
          <div className="role-split">
            <div>
              <span>ANDREW / CEO</span>
              <h3>Capital.<br />Strategy.<br />Deals.</h3>
            </div>
            <div>
              <span>GABI / COO</span>
              <h3>People.<br />Operations.<br />Execution.</h3>
            </div>
          </div>
          <p className="role-card__note">
            Shared fundamentals. Complementary depth. One institution.
          </p>
        </article>

        <article className="card achievements-card">
          <div className="card__header">
            <span className="kicker">RECENT ACHIEVEMENTS</span>
            <span className="card__code">{achievements.length} UNLOCKED</span>
          </div>
          {recentAchievements.length === 0 ? (
            <div className="empty-compact">
              <span>◇</span>
              <p>Your first achievement unlocks when you open the mission brief.</p>
            </div>
          ) : (
            <div className="achievement-list">
              {recentAchievements.map((achievement) => (
                <div className="achievement-row" key={achievement.id}>
                  <span>{achievement.mark}</span>
                  <div>
                    <strong>{achievement.title}</strong>
                    <small>{achievement.description}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <blockquote className="command-quote">
        {role === "ceo"
          ? "The CEO's job is not to predict perfectly. It is to build the people, evidence, systems, and capital discipline that make better decisions compound."
          : "Great businesses are created by serving customers, building strong teams, creating reliable systems, protecting culture, developing leaders, and executing consistently."}
      </blockquote>
    </main>
  );
}
