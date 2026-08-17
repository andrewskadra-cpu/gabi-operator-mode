"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup";

export function AuthCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("login");
  const [displayName, setDisplayName] = useState("Gabi");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createClient();
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName.trim() || "Gabi" },
          },
        });
        if (signUpError) {
          throw signUpError;
        }

        if (!data.session) {
          setMessage(
            "Account created. Check your email to confirm it, then return here to sign in.",
          );
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          throw signInError;
        }
      }

      const requestedNext = searchParams.get("next");
      const nextPath = requestedNext?.startsWith("/") ? requestedNext : "/";
      router.replace(nextPath);
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "We could not complete that request. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-brand" aria-label="Skadra Ventures Operator Mode">
        <div className="auth-brand__wordmark">
          <span>SV</span>
          <div>
            <strong>SKADRA VENTURES</strong>
            <small>OPERATOR MODE</small>
          </div>
        </div>
        <div>
          <span className="kicker kicker--gold">G-OPS / SECURE ACCESS</span>
          <h1>Build the operator.<br />Keep the progress.</h1>
          <p>
            Your training, field work, relationships, journal, and operating
            assessments follow you securely across devices.
          </p>
        </div>
        <div className="auth-brand__principles">
          <span>UNDERSTAND</span>
          <span>CONNECT</span>
          <span>LEAD</span>
          <span>EXECUTE</span>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-panel__inner">
          <span className="kicker">GABI OPERATIONS COMMAND SYSTEM</span>
          <h2>{mode === "login" ? "Welcome back." : "Create your operator account."}</h2>
          <p>
            {mode === "login"
              ? "Sign in to load your cloud-backed command center."
              : "Use the email address that should own this training record."}
          </p>

          <div className="auth-switch" aria-label="Authentication mode">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => {
                setMode("login");
                setError(null);
                setMessage(null);
              }}
            >
              SIGN IN
            </button>
            <button
              type="button"
              className={mode === "signup" ? "active" : ""}
              onClick={() => {
                setMode("signup");
                setError(null);
                setMessage(null);
              }}
            >
              CREATE ACCOUNT
            </button>
          </div>

          <form className="auth-form" onSubmit={submit}>
            {mode === "signup" && (
              <label className="field-group">
                <span>DISPLAY NAME</span>
                <input
                  required
                  autoComplete="name"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                />
              </label>
            )}
            <label className="field-group">
              <span>EMAIL</span>
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label className="field-group">
              <span>PASSWORD</span>
              <input
                required
                minLength={8}
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            {error && <p className="auth-message auth-message--error">{error}</p>}
            {message && <p className="auth-message auth-message--success">{message}</p>}
            <button className="primary-button" type="submit" disabled={busy}>
              {busy
                ? "WORKING..."
                : mode === "login"
                  ? "ENTER COMMAND CENTER"
                  : "CREATE SECURE ACCOUNT"}
            </button>
          </form>

          {mode === "login" && (
            <Link className="auth-link" href="/forgot-password">
              Forgot your password?
            </Link>
          )}
          <p className="auth-security-note">
            Protected by Supabase Auth and database row-level security.
          </p>
        </div>
      </section>
    </main>
  );
}
