"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/operator/app-shell";
import { CampaignView } from "@/components/operator/campaign-view";
import { CommandCenter } from "@/components/operator/command-center";
import { FieldOpsView } from "@/components/operator/field-ops-view";
import { JournalView } from "@/components/operator/journal-view";
import { LabsView } from "@/components/operator/labs-view";
import { LessonPlayer } from "@/components/operator/lesson-player";
import { NetworkView } from "@/components/operator/network-view";
import { SettingsView } from "@/components/operator/settings-view";
import { VenturesView } from "@/components/operator/ventures-view";
import { LegacyMigrationDialog } from "@/components/operator/legacy-migration-dialog";
import { ExecutiveOnboarding } from "@/components/operator/executive-onboarding";
import { ExecutiveRoleSelection } from "@/components/operator/executive-role-selection";
import { getLevelsForRole } from "@/content/levels";
import {
  useOperatorState,
  type OperatorAccount,
} from "@/hooks/use-operator-state";
import { getUnlockedAchievements } from "@/lib/domain/achievements";
import { getExecutiveSkillScores } from "@/lib/domain/executive-scorecards";
import {
  calculateXp,
  getCampaignProgress,
  getCurrentLevel,
  getRank,
} from "@/lib/domain/progression";

export function OperatorApp({ account }: { readonly account: OperatorAccount }) {
  const controller = useOperatorState(account);
  const { state } = controller;
  const [campaignMode, setCampaignMode] = useState<"roadmap" | "lesson">("roadmap");
  const role = state.profile.executiveRole;
  const resolvedRole = role ?? "coo";
  const levels = useMemo(() => getLevelsForRole(resolvedRole), [resolvedRole]);

  const xp = useMemo(
    () => calculateXp(state, levels, resolvedRole),
    [levels, resolvedRole, state],
  );
  const rank = getRank(xp, resolvedRole);
  const currentLevel = getCurrentLevel(state, levels);
  const campaignProgress = getCampaignProgress(state, levels);
  const achievements = getUnlockedAchievements(state, resolvedRole);
  const skillScores = useMemo(
    () => getExecutiveSkillScores(state, levels, resolvedRole),
    [levels, resolvedRole, state],
  );

  const openLevel = (levelId: string) => {
    controller.selectLevel(levelId);
    setCampaignMode("lesson");
  };

  const navigate = (view: typeof state.lastView) => {
    if (view === "campaign") {
      setCampaignMode("roadmap");
    }
    controller.setView(view);
  };

  if (!controller.hydrated) {
    return (
      <main className="auth-simple-page" aria-busy="true">
        <section className="auth-simple-card">
          <span className="kicker">G-OPS / SECURE SYNC</span>
          <h1>Loading your executive record.</h1>
          <p>Checking cloud progress and the protected device backup...</p>
        </section>
      </main>
    );
  }

  if (controller.migration && !role) {
    return (
      <main className="auth-simple-page">
        <section className="auth-simple-card">
          <span className="kicker">G-OPS / LEGACY ACCOUNT</span>
          <h1>Preserve the operator record first.</h1>
          <p>
            This device contains progress from the original COO training
            system. Import it securely before opening the dual-track app.
          </p>
        </section>
        <LegacyMigrationDialog controller={controller} />
      </main>
    );
  }

  if (!role) {
    return (
      <ExecutiveRoleSelection
        displayName={state.profile.name || account.displayName}
        onSelect={controller.assignExecutiveRole}
      />
    );
  }

  if (!state.profile.onboardingCompletedAt) {
    return (
      <ExecutiveOnboarding
        role={role}
        displayName={state.profile.name || account.displayName}
        onComplete={controller.completeRoleOnboarding}
      />
    );
  }

  return (
    <AppShell
      role={role}
      activeView={state.lastView}
      onNavigate={navigate}
      xp={xp}
      rank={rank}
      displayName={state.profile.name || account.displayName}
      syncStatus={controller.syncStatus}
      compactMode={state.preferences.compactMode}
      reducedMotion={state.preferences.reducedMotion}
    >
      {state.lastView === "command" && (
        <CommandCenter
          state={state}
          xp={xp}
          rank={rank}
          campaignProgress={campaignProgress}
          currentLevel={currentLevel}
          achievements={achievements}
          role={role}
          skillScores={skillScores}
          syncStatus={controller.syncStatus}
          onOpenLevel={() => openLevel(currentLevel.id)}
          onNavigate={navigate}
        />
      )}

      {state.lastView === "campaign" &&
        (campaignMode === "lesson" ? (
          <LessonPlayer
            key={state.activeLevelId}
            controller={controller}
            levelId={state.activeLevelId}
            onBack={() => setCampaignMode("roadmap")}
            levels={levels}
            role={role}
          />
        ) : (
          <CampaignView
            state={state}
            currentLevel={currentLevel}
            onOpenLevel={openLevel}
            levels={levels}
            role={role}
          />
        ))}

      {state.lastView === "field-ops" && (
        <FieldOpsView controller={controller} role={role} />
      )}
      {state.lastView === "network" && <NetworkView controller={controller} />}
      {state.lastView === "labs" && (
        <LabsView controller={controller} role={role} />
      )}
      {state.lastView === "journal" && (
        <JournalView controller={controller} role={role} />
      )}
      {state.lastView === "ventures" && (
        <VenturesView controller={controller} role={role} />
      )}
      {state.lastView === "settings" && (
        <SettingsView account={account} controller={controller} />
      )}
      <LegacyMigrationDialog controller={controller} />
    </AppShell>
  );
}
