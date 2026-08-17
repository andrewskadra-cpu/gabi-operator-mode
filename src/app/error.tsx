"use client";

export default function ErrorPage({ reset }: { readonly reset: () => void }) {
  return (
    <main className="auth-simple-page">
      <section className="auth-simple-card">
        <span className="kicker">G-OPS / RECOVERY</span>
        <h1>The command center hit a problem.</h1>
        <p>
          Your most recent valid work remains in the device backup. Try opening
          the command center again; pending cloud changes will retry.
        </p>
        <button className="primary-button" type="button" onClick={reset}>
          TRY AGAIN
        </button>
      </section>
    </main>
  );
}
