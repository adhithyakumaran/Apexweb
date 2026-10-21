import "server-only";
import { createClient } from "@supabase/supabase-js";
import { cache } from "react";

export function configuration() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? { url, key } : null;
}
// URL-access workspace: every visitor has the same editing capabilities.
// No user sessions, service-role key, or simulated authenticated identity.
export const getAccess = cache(async () => {
  const config = configuration();
  if (!config) return { state: "configuration" as const };
  const db = createClient(config.url, config.key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  return { state: "ready" as const, db, canManage: true as const };
});
export async function requireWorkspace() {
  const access = await getAccess();
  if (access.state !== "ready")
    throw new Error(
      "Configure the Supabase URL and public API key to use the workspace.",
    );
  return access;
}
