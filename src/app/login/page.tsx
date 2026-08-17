import { AuthCard } from "@/components/auth/auth-card";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

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

  return <AuthCard />;
}
