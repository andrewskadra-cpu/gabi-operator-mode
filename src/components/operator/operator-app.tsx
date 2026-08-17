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
import { yearOneLevels } from "@/content/levels";
import {
  useOperatorState,
  type OperatorAccount,
} from "@/hooks/use-operator-state";
import { getUnlockedAchievements } from "@/lib/domain/achievements";
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

  const xp = useMemo(() => calculateXp(state, yearOneLevels), [state]);
  const rank = getRank(xp);
  const currentLevel = getCurrentLevel(state, yearOneLevels);
  const campaignProgress = getCampaignProgress(state, yearOneLevels);
  const achievements = getUnlockedAchievements(state);

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

  return (
    <AppShell
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
          />
        ) : (
          <CampaignView
            state={state}
            currentLevel={currentLevel}
            onOpenLevel={openLevel}
          />
        ))}

      {state.lastView === "field-ops" && <FieldOpsView controller={controller} />}
      {state.lastView === "network" && <NetworkView controller={controller} />}
      {state.lastView === "labs" && <LabsView controller={controller} />}
      {state.lastView === "journal" && <JournalView controller={controller} />}
      {state.lastView === "ventures" && <VenturesView controller={controller} />}
      {state.lastView === "settings" && (
        <SettingsView account={account} controller={controller} />
      )}
      <LegacyMigrationDialog controller={controller} />
    </AppShell>
  );
}
