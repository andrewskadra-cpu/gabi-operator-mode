"use client";

import { useState, type FormEvent } from "react";
import { journalPrompts } from "@/content/field-mission-templates";
import type { OperatorStateController } from "@/hooks/use-operator-state";

export function JournalView({
  controller,
}: {
  readonly controller: OperatorStateController;
}) {
  const [weekOf, setWeekOf] = useState("");
  const [responses, setResponses] = useState<Record<string, string>>({});

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    controller.addJournalEntry({ weekOf, responses });
    setWeekOf("");
    setResponses({});
  };

  return (
    <main className="workspace-page journal-page">
      <div className="page-masthead">
        <div>
          <span className="kicker">OPERATOR JOURNAL / WEEKLY DEBRIEF</span>
          <h2>Experience is not the teacher.<br />Reflection is.</h2>
          <p>Turn the week&apos;s details into better future judgment.</p>
        </div>
        <div className="page-stat">
          <strong>{controller.state.journalEntries.length}</strong>
          <span>DEBRIEFS SAVED</span>
        </div>
      </div>

      <div className="journal-layout">
        <form className="journal-form" onSubmit={save}>
          <div className="journal-form__top">
            <div>
              <span className="kicker kicker--gold">NEW WEEKLY DEBRIEF</span>
              <h3>Notice the pattern beneath the event.</h3>
            </div>
            <label className="field-group">
              <span>WEEK OF</span>
              <input required type="date" value={weekOf} onChange={(event) => setWeekOf(event.target.value)} />
            </label>
          </div>
          <div className="journal-prompts">
            {journalPrompts.map((prompt, index) => (
              <label className="journal-prompt" key={prompt}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{prompt}</strong>
                <textarea
                  rows={3}
                  value={responses[prompt] ?? ""}
                  onChange={(event) =>
                    setResponses((current) => ({
                      ...current,
                      [prompt]: event.target.value,
                    }))
                  }
                />
              </label>
            ))}
          </div>
          <button
            className="primary-button"
            type="submit"
            disabled={!weekOf || Object.values(responses).filter((value) => value.trim()).length < 3}
          >
            SAVE WEEKLY DEBRIEF <span>→</span>
          </button>
        </form>

        <aside className="journal-history">
          <span className="kicker">DEBRIEF ARCHIVE</span>
          {controller.state.journalEntries.length === 0 ? (
            <div className="empty-state">
              <span>J</span>
              <h3>No journal entries yet.</h3>
              <p>Answer at least three prompts to save your first debrief.</p>
            </div>
          ) : (
            controller.state.journalEntries.map((entry) => (
              <article className="journal-entry" key={entry.id}>
                <span>WEEK OF {entry.weekOf}</span>
                {Object.entries(entry.responses)
                  .filter(([, answer]) => answer.trim())
                  .slice(0, 3)
                  .map(([prompt, answer]) => (
                    <div key={prompt}>
                      <strong>{prompt}</strong>
                      <p>{answer}</p>
                    </div>
                  ))}
              </article>
            ))
          )}
        </aside>
      </div>
    </main>
  );
}
