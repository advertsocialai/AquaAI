import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client for the Aqua AI web app.
 *
 * Project: aqua-ai (rjhysiqqwgptqiwsonvd, us-east-1)
 * Schema:  backend/migrations/001_init.sql (22 tables, RLS enabled).
 *
 * Both URL and publishable key are safe to ship to the browser — they only
 * grant the anon role's RLS-allowed surface. The service_role secret is
 * backend-only and never imported here.
 *
 * Returns `null` when env vars are missing so the app degrades gracefully
 * (e.g. preview deploys, the marketing site without auth wired). Callers
 * should null-check before .from().
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }) : null;

/** Throws if the client isn't configured — use in code paths that require auth. */
export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase env not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
    );
  }
  return supabase;
}
