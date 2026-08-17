"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export function PasswordResetCard({ update = false }: { readonly update?: boolean }) {
  const router = useRouter();
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
      if (update) {
        const { error: updateError } = await supabase.auth.updateUser({
          password,
        });
        if (updateError) {
          throw updateError;
        }
        setMessage("Password updated. Returning to your command center...");
        window.setTimeout(() => {
          router.replace("/");
          router.refresh();
        }, 800);
      } else {
        const redirectTo = `${window.location.origin}/auth/callback?next=/update-password`;
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          email,
          { redirectTo },
        );
        if (resetError) {
          throw resetError;
        }
        setMessage("Check your email for a secure password-reset link.");
      }
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
    <main className="auth-simple-page">
      <section className="auth-simple-card">
        <div className="auth-brand__wordmark auth-brand__wordmark--dark">
          <span>SV</span>
          <div><strong>SKADRA VENTURES</strong><small>OPERATOR MODE</small></div>
        </div>
        <span className="kicker">G-OPS / ACCOUNT RECOVERY</span>
        <h1>{update ? "Set a new password." : "Reset your password."}</h1>
        <p>
          {update
            ? "Choose a strong password with at least eight characters."
            : "Enter your account email and we will send a secure recovery link."}
        </p>
        <form className="auth-form" onSubmit={submit}>
          {update ? (
            <label className="field-group">
              <span>NEW PASSWORD</span>
              <input
                required
                minLength={8}
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
          ) : (
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
          )}
          {error && <p className="auth-message auth-message--error">{error}</p>}
          {message && <p className="auth-message auth-message--success">{message}</p>}
          <button className="primary-button" type="submit" disabled={busy}>
            {busy ? "WORKING..." : update ? "SAVE NEW PASSWORD" : "SEND RESET LINK"}
          </button>
        </form>
        {!update && <Link className="auth-link" href="/login">Back to sign in</Link>}
      </section>
    </main>
  );
}
