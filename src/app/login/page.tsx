import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

function LoginPageFallback() {
  return (
    <main className="auth-simple-page" aria-busy="true">
      <section className="auth-simple-card">
        <span className="kicker">G-OPS / SECURE ACCESS</span>
        <h1>Preparing secure access.</h1>
        <p>Loading the sign-in controls...</p>
      </section>
    </main>
  );
}

export default function LoginPage() {
  if (!getSupabasePublicConfig()) {
    return (
      <main className="auth-simple-page">
        <section className="auth-simple-card">
          <span className="kicker">G-OPS / SETUP REQUIRED</span>
          <h1>Cloud access is not configured yet.</h1>
          <p>
            Add the two public Supabase environment variables described in
            CLOUD_SETUP.md, then restart or redeploy the application.
          </p>
        </section>
      </main>
    );
  }

  return (
    <Suspense fallback={<LoginPageFallback />}>
      <AuthCard />
    </Suspense>
  );
}
