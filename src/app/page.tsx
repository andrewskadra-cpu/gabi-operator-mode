import { redirect } from "next/navigation";
import { OperatorApp } from "@/components/operator/operator-app";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function displayNameFromMetadata(metadata: Record<string, unknown>): string {
  const displayName = metadata.display_name;
  const fullName = metadata.full_name;
  return typeof displayName === "string" && displayName.trim()
    ? displayName
    : typeof fullName === "string" && fullName.trim()
      ? fullName
      : "Executive";
}

export default async function Home() {
  if (!getSupabasePublicConfig()) {
    return (
      <main className="auth-simple-page">
        <section className="auth-simple-card">
          <span className="kicker">G-OPS / CLOUD SETUP</span>
          <h1>G-OPS is ready for Supabase configuration.</h1>
          <p>
            Follow CLOUD_SETUP.md to create the project, apply the migration,
            and add the required environment variables to this application and
            Vercel.
          </p>
        </section>
      </main>
    );
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims?.sub) {
    redirect("/login");
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect("/login");
  }

  return (
    <OperatorApp
      account={{
        id: data.user.id,
        email: data.user.email ?? "",
        displayName: displayNameFromMetadata(data.user.user_metadata),
      }}
    />
  );
}
