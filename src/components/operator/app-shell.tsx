"use client";

import type { ReactNode } from "react";
import type { AppView } from "@/lib/domain/operator-state";
import type { Rank } from "@/lib/domain/progression";
import type { SyncStatus } from "@/lib/persistence/operator-state-sync-engine";

interface AppShellProps {
  readonly activeView: AppView;
  readonly onNavigate: (view: AppView) => void;
  readonly xp: number;
  readonly rank: Rank;
  readonly displayName: string;
  readonly syncStatus: SyncStatus;
  readonly compactMode: boolean;
  readonly reducedMotion: boolean;
  readonly children: ReactNode;
}

const navigation: readonly {
  view: AppView;
  label: string;
  short: string;
}[] = [
  { view: "command", label: "Command Center", short: "01" },
  { view: "campaign", label: "Year One Campaign", short: "02" },
  { view: "field-ops", label: "Field Ops", short: "03" },
  { view: "network", label: "Relationship Network", short: "04" },
  { view: "labs", label: "Operator Labs", short: "05" },
  { view: "journal", label: "Operator Journal", short: "06" },
  { view: "ventures", label: "Ventures & Pipeline", short: "07" },
  { view: "settings", label: "Settings & Data", short: "08" },
];

const syncLabels: Readonly<Record<SyncStatus["phase"], string>> = {
  loading: "Loading cloud",
  saving: "Saving...",
  saved: "Saved",
  offline: "Offline backup",
  syncing: "Syncing...",
  issue: "Sync issue",
};

export function AppShell({
  activeView,
  onNavigate,
  xp,
  rank,
  displayName,
  syncStatus,
  compactMode,
  reducedMotion,
  children,
}: AppShellProps) {
  return (
    <div
      className={
        "operator-shell" +
        (compactMode ? " operator-shell--compact" : "") +
        (reducedMotion ? " operator-shell--reduced-motion" : "")
      }
    >
      <aside className="sidebar">
        <button
          className="wordmark"
          type="button"
          onClick={() => onNavigate("command")}
          aria-label="Open G-OPS command center"
        >
          <span className="wordmark__seal">SV</span>
          <span>
            <strong>SKADRA VENTURES</strong>
            <small>OPERATOR MODE</small>
          </span>
        </button>

        <div className="sidebar__identity">
          <span className="kicker kicker--gold">G-OPS / 01</span>
          <h1>Operator<br />Command</h1>
          <p>Gabi Operations Command System</p>
        </div>

        <nav className="sidebar__nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <button
              className={activeView === item.view ? "nav-item nav-item--active" : "nav-item"}
              key={item.view}
              type="button"
              onClick={() => onNavigate(item.view)}
              aria-current={activeView === item.view ? "page" : undefined}
            >
              <span>{item.short}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className={`sidebar__sync sidebar__sync--${syncStatus.phase}`}>
          <span className="sync-dot" aria-hidden="true" />
          <div>
            <strong>{syncLabels[syncStatus.phase]}</strong>
            <small>Cloud + device backup</small>
          </div>
        </div>

        <div className="sidebar__profile">
          <div className="avatar">{displayName.slice(0, 1).toUpperCase()}</div>
          <div>
            <strong>{displayName}</strong>
            <span>{rank.name}</span>
          </div>
          <div className="sidebar__xp">{xp.toLocaleString()} XP</div>
        </div>
      </aside>

      <div className="main-frame">
        <header className="mobile-bar">
          <button
            className="mobile-wordmark"
            type="button"
            onClick={() => onNavigate("command")}
          >
            <span>SV</span>
            G-OPS
          </button>
          <label>
            <span className="sr-only">Navigate to</span>
            <select
              value={activeView}
              onChange={(event) => onNavigate(event.target.value as AppView)}
            >
              {navigation.map((item) => (
                <option value={item.view} key={item.view}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <span className={`mobile-sync mobile-sync--${syncStatus.phase}`}>
            {syncLabels[syncStatus.phase]}
          </span>
        </header>
        {children}
      </div>
    </div>
  );
}
