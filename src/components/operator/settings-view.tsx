"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  OperatorAccount,
  OperatorStateController,
} from "@/hooks/use-operator-state";
import { createClient } from "@/lib/supabase/client";

interface SettingsViewProps {
  readonly account: OperatorAccount;
  readonly controller: OperatorStateController;
}

function formatTimestamp(value: string | null): string {
  return value
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "Not synced yet";
}

export function SettingsView({ account, controller }: SettingsViewProps) {
  const router = useRouter();
  const [exported, setExported] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const exportData = () => {
    const payload = {
      format: "skadra-operator-mode-backup",
      formatVersion: 1,
      exportedAt: new Date().toISOString(),
      account: {
        id: account.id,
        email: account.email,
        displayName: account.displayName,
      },
      operatorState: controller.state,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `g-ops-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setExported(true);
  };

  const logout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  return (
    <main className="workspace-page settings-page">
      <div className="page-masthead">
        <div>
          <span className="kicker">SETTINGS / DATA COMMAND</span>
          <h2>Your account. Your operating record.</h2>
          <p>Review cloud status, keep a portable backup, and manage access.</p>
        </div>
      </div>

      <div className="settings-grid">
        <section className="card settings-card">
          <div className="card__header">
            <span className="kicker">ACCOUNT</span>
            <span className="card__code">AUTHENTICATED</span>
          </div>
          <div className="settings-identity">
            <span>{account.displayName.slice(0, 1).toUpperCase()}</span>
            <div>
              <h3>{account.displayName}</h3>
              <p>{account.email}</p>
            </div>
          </div>
          <button
            className="secondary-button"
            type="button"
            onClick={logout}
            disabled={loggingOut}
          >
            {loggingOut ? "SIGNING OUT..." : "LOG OUT"}
          </button>
        </section>

        <section className="card settings-card">
          <div className="card__header">
            <span className="kicker">CLOUD SYNC</span>
            <span className={`sync-dot sync-dot--${controller.syncStatus.phase}`} />
          </div>
          <h3 className="settings-status">
            {controller.syncStatus.phase === "saved"
              ? "Safely saved"
              : controller.syncStatus.phase === "offline"
                ? "Device backup active"
                : controller.syncStatus.phase === "issue"
                  ? "Sync needs attention"
                  : "Sync in progress"}
          </h3>
          <dl className="settings-details">
            <div><dt>Last successful sync</dt><dd>{formatTimestamp(controller.syncStatus.lastSuccessfulSyncAt)}</dd></div>
            <div><dt>Local backup</dt><dd>Active on this device</dd></div>
          </dl>
          {controller.syncStatus.message && <p className="settings-note">{controller.syncStatus.message}</p>}
          {(controller.syncStatus.phase === "offline" || controller.syncStatus.phase === "issue") && (
            <button className="secondary-button" type="button" onClick={() => void controller.retrySync()}>
              RETRY CLOUD SYNC
            </button>
          )}
        </section>

        <section className="card settings-card settings-card--wide">
          <div className="card__header">
            <span className="kicker">PORTABLE BACKUP</span>
            <span className="card__code">JSON</span>
          </div>
          <h3>Export my Operator Mode data</h3>
          <p>
            Download a readable backup containing your training progress,
            projects, missions, network, labs, journal, pipeline, achievements,
            preferences, and Founders Mode assessments.
          </p>
          <div className="settings-actions">
            <button className="primary-button" type="button" onClick={exportData}>
              EXPORT MY DATA
            </button>
            {exported && <span>Backup downloaded.</span>}
          </div>
          <p className="settings-note">
            Import is intentionally not automatic in this release: a future
            restore flow must compare timestamps and never overwrite newer cloud
            data without confirmation.
          </p>
        </section>

        <section className="card settings-card settings-card--wide">
          <div className="card__header"><span className="kicker">DISPLAY PREFERENCES</span></div>
          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={controller.state.preferences.reducedMotion}
              onChange={(event) =>
                controller.updatePreferences({ reducedMotion: event.target.checked })
              }
            />
            <span><strong>Reduce motion</strong><small>Limit smooth scrolling and nonessential movement.</small></span>
          </label>
          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={controller.state.preferences.compactMode}
              onChange={(event) =>
                controller.updatePreferences({ compactMode: event.target.checked })
              }
            />
            <span><strong>Compact workspace</strong><small>Use tighter spacing on dense operating screens.</small></span>
          </label>
        </section>
      </div>
    </main>
  );
}
