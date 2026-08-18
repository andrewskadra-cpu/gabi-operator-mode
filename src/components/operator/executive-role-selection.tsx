"use client";

import { useState } from "react";
import {
  EXECUTIVE_ROLE_DEFINITIONS,
  type ExecutiveRole,
} from "@/lib/domain/executive-role";

export function ExecutiveRoleSelection({
  displayName,
  onSelect,
}: {
  readonly displayName: string;
  readonly onSelect: (role: ExecutiveRole) => Promise<void>;
}) {
  const [pendingRole, setPendingRole] = useState<ExecutiveRole | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pendingDefinition = pendingRole
    ? EXECUTIVE_ROLE_DEFINITIONS[pendingRole]
    : null;

  const confirm = async () => {
    if (!pendingRole) {
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await onSelect(pendingRole);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The role could not be confirmed. Your account was not changed.",
      );
      setBusy(false);
    }
  };

  return (
    <main className="role-selection-page">
      <section className="role-selection-shell">
        <header className="role-selection-header">
          <div className="auth-brand__wordmark auth-brand__wordmark--dark">
            <span>SV</span>
            <div>
              <strong>SKADRA VENTURES</strong>
              <small>EXECUTIVE DEVELOPMENT SYSTEM</small>
            </div>
          </div>
          <span className="kicker kicker--gold">G-OPS / ROLE SELECTION</span>
          <h1>Choose your operating role.</h1>
          <p>
            Welcome, {displayName}. This determines your primary training path,
            missions, dashboard, and executive development system.
          </p>
        </header>

        <div className="role-choice-grid">
          {(["ceo", "coo"] as const).map((role) => {
            const definition = EXECUTIVE_ROLE_DEFINITIONS[role];
            return (
              <button
                className={`role-choice role-choice--${role}`}
                type="button"
                key={role}
                onClick={() => {
                  setPendingRole(role);
                  setError(null);
                }}
              >
                <span className="role-choice__code">
                  {role === "ceo" ? "01 / CAPITAL" : "02 / OPERATIONS"}
                </span>
                <strong>{definition.label}</strong>
                <p>{definition.selectionSummary}</p>
                <span className="role-choice__action">SELECT TRACK →</span>
              </button>
            );
          })}
        </div>

        {pendingDefinition && (
          <section className="role-confirmation" aria-live="polite">
            <span className="kicker">CONFIRM PRIMARY TRAINING PROFILE</span>
            <h2>{pendingDefinition.label}</h2>
            <p>
              This is a meaningful, account-level choice stored securely in
              Supabase. G-OPS does not offer casual daily role switching. A
              future controlled role-change process would preserve—not delete—
              progress from either track.
            </p>
            {error && (
              <p className="auth-message auth-message--error">{error}</p>
            )}
            <div className="button-row">
              <button
                className="secondary-button"
                type="button"
                disabled={busy}
                onClick={() => setPendingRole(null)}
              >
                CHOOSE AGAIN
              </button>
              <button
                className="primary-button"
                type="button"
                disabled={busy}
                onClick={() => void confirm()}
              >
                {busy ? "SECURING ROLE..." : `CONFIRM ${pendingDefinition.shortLabel} TRACK`}
              </button>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

