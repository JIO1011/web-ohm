import "server-only";

import { env } from "@/lib/env";

/**
 * Publish a Realtime Broadcast message from the server using the service-role
 * key, via Supabase's stable HTTP broadcast endpoint. The results dashboard
 * subscribes to the public channel `consensus-<code>` and refetches on receipt.
 *
 * We broadcast on a code-named channel (no table data in the payload) so the
 * needs/sessions tables stay locked down by RLS — knowing the code is the gate,
 * which matches the rest of the access model. Best-effort: failures are ignored
 * (the dashboard also keeps a slow polling fallback).
 */
export async function broadcastSessionChanged(code: string): Promise<void> {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;

  try {
    await fetch(`${url}/realtime/v1/api/broadcast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        messages: [
          { topic: `consensus-${code.toUpperCase()}`, event: "session_changed", payload: {} },
        ],
      }),
    });
  } catch {
    /* best-effort — the dashboard polling fallback covers misses */
  }
}
