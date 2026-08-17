"use client";

import type { ReactNode } from "react";
import type { AppView } from "@/lib/domain/operator-state";
import type { Rank } from "@/lib/domain/progression";

interface AppShellProps {
  readonly activeView: AppView;
  readonly onNavigate: (view: AppView) => void;
  readonly xp: number;
  readonly rank: Rank;
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
];

export function AppShell({
  activeView,
  onNavigate,
  xp,
  rank,
  children,
}: AppShellProps) {
  return (
    <div className="operator-shell">
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

        <div className="sidebar__profile">
          <div className="avatar">G</div>
          <div>
            <strong>Gabi</strong>
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
        </header>
        {children}
      </div>
    </div>
  );
}

