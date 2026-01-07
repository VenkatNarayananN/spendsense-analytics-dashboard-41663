/**
 * Optional Supabase setup.
 * UI must remain functional even when env vars are undefined.
 *
 * Env vars (already defined by container):
 * - REACT_APP_SUPABASE_URL
 * - REACT_APP_SUPABASE_KEY
 */

const url = process.env.REACT_APP_SUPABASE_URL;
const key = process.env.REACT_APP_SUPABASE_KEY;

// PUBLIC_INTERFACE
export function getSupabaseClient() {
  /**
   * Returns a Supabase client if configuration exists and library is available.
   * Otherwise returns null.
   */
  if (!url || !key) return null;

  // Avoid hard dependency: only attempt dynamic import if configured.
  // This keeps build working even if @supabase/supabase-js isn't installed yet.
  return import("@supabase/supabase-js")
    .then((m) => m.createClient(url, key))
    .catch(() => null);
}
