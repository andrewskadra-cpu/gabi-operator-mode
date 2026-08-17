import { createBrowserClient } from "@supabase/ssr";
import { requireSupabasePublicConfig } from "./config";
import type { Database } from "./database.types";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  const config = requireSupabasePublicConfig();
  browserClient ??= createBrowserClient<Database>(
    config.url,
    config.publishableKey,
  );
  return browserClient;
}
