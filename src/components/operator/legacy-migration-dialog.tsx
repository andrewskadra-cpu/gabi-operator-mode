"use client";

import { useState } from "react";
import type { OperatorStateController } from "@/hooks/use-operator-state";

function recordCount(state: OperatorStateController["state"]): number {
  return (
    Object.keys(state.levelProgress).length +
    state.fieldMissions.length +
    state.relationships.length +
    state.customerAudits.length +
    state.processMaps.length +
    state.journalEntries.length +
    state.locations.length +
    state.sharedVentures.length +
    state.peopleLabSessions.length +
    state.founderMissions.length
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function LegacyMigrationDialog({
  controller,
}: {
  readonly controller: OperatorStateController;
}) {
  const migration = controller.migration;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!migration) {
    return null;
  }

  const decide = async (choice: "import" | "merge" | "keep-cloud") => {
    setBusy(true);
    setError(null);
    try {
      await controller.resolveMigration(choice);
    } catch {
      setError(
        "The cloud did not confirm the migration. Your original device copy is unchanged; please try again when connected.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="migration-backdrop" role="presentation">
      <section
        className="migration-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="migration-title"
      >
        <span className="kicker kicker--gold">SAFE PROGRESS MIGRATION</span>
        <h2 id="migration-title">Existing progress was found on this device.</h2>
        <p>
          The original browser data will stay in place. Operator Mode will only
          mark migration complete after Supabase confirms the cloud write.
        </p>

        <div className="migration-compare">
          <article>
            <span>DEVICE COPY</span>
            <strong>{recordCount(migration.legacyState)} saved records</strong>
            <small>Updated {formatDate(migration.legacyState.updatedAt)}</small>
          </article>
          {migration.cloudState && (
            <article>
              <span>CLOUD COPY</span>
              <strong>{recordCount(migration.cloudState)} saved records</strong>
              <small>Updated {formatDate(migration.cloudState.updatedAt)}</small>
            </article>
          )}
        </div>

        {error && <p className="auth-message auth-message--error">{error}</p>}

        <div className="migration-actions">
          {migration.cloudState ? (
            <>
              <button
                className="primary-button"
                type="button"
                disabled={busy}
                onClick={() => void decide("merge")}
              >
                MERGE SAFELY
              </button>
              <button
                className="secondary-button"
                type="button"
                disabled={busy}
                onClick={() => void decide("keep-cloud")}
              >
                KEEP CLOUD COPY
              </button>
              <button
                className="text-button"
                type="button"
                disabled={busy}
                onClick={() => void decide("import")}
              >
                REPLACE CLOUD WITH DEVICE COPY
              </button>
            </>
          ) : (
            <button
              className="primary-button"
              type="button"
              disabled={busy}
              onClick={() => void decide("import")}
            >
              {busy ? "VERIFYING CLOUD SAVE..." : "IMPORT EXISTING PROGRESS"}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
