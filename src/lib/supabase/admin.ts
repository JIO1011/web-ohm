import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { Database } from "./types";

/**
 * Service-role Supabase client — bypasses RLS. Server-only.
 * Used for the public-by-code paths (participant submits a need, results view
 * loads a session by code) where there is no authenticated user but access is
 * gated by knowing the session code + our own Zod validation and rate limiting.
 *
 * Returns null when env is not configured; callers must surface 503.
 */
export function createAdminClient() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return null;

  return createSupabaseClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
