import { z } from "zod";

const envSchema = z.object({
  GEMINI_API_KEY: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  LEADS_ADMIN_TOKEN: z.string().min(8).optional(),
  // Supabase — optional so the app still builds without them; the Consensus
  // feature degrades gracefully (503) when absent, mirroring LEADS_ADMIN_TOKEN.
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
});

export const env = envSchema.parse({
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  LEADS_ADMIN_TOKEN: process.env.LEADS_ADMIN_TOKEN,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
});

/** True when all Supabase env vars are present (server-side check). */
export const isSupabaseConfigured =
  !!env.NEXT_PUBLIC_SUPABASE_URL &&
  !!env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !!env.SUPABASE_SERVICE_ROLE_KEY;
