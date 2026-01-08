import { getSupabaseClient } from "../../supabaseClient";

/**
 * Internal utility to ensure we always have a configured Supabase client.
 */
async function requireSupabase() {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY."
    );
  }
  return supabase;
}

/**
 * PUBLIC_INTERFACE
 */
export async function getCurrentUserId() {
  /**
   * Returns current authed user's id (string) or throws if not authenticated.
   */
  const supabase = await requireSupabase();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  const userId = data?.user?.id;
  if (!userId) throw new Error("No authenticated user.");
  return userId;
}

/**
 * PUBLIC_INTERFACE
 */
export async function listTransactions({ userId } = {}) {
  /**
   * Fetch transactions for a user ordered by date desc then created_at desc.
   */
  const supabase = await requireSupabase();
  const uid = userId || (await getCurrentUserId());
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", uid)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

/**
 * PUBLIC_INTERFACE
 */
export async function createTransaction(payload) {
  /**
   * Insert a new transaction row.
   * Expects payload to include required columns for your schema.
   */
  const supabase = await requireSupabase();
  const { data, error } = await supabase.from("transactions").insert(payload).select("*").single();
  if (error) throw error;
  return data;
}

/**
 * PUBLIC_INTERFACE
 */
export async function updateTransaction(id, patch) {
  /**
   * Update transaction by primary key id.
   */
  const supabase = await requireSupabase();
  const { data, error } = await supabase
    .from("transactions")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

/**
 * PUBLIC_INTERFACE
 */
export async function deleteTransaction(id) {
  /**
   * Delete transaction by primary key id.
   */
  const supabase = await requireSupabase();
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
  return true;
}

/**
 * PUBLIC_INTERFACE
 */
export async function listAlerts({ userId } = {}) {
  /**
   * Fetch alerts for a user ordered by created_at desc.
   */
  const supabase = await requireSupabase();
  const uid = userId || (await getCurrentUserId());
  const { data, error } = await supabase
    .from("alerts")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

/**
 * PUBLIC_INTERFACE
 */
export async function dismissAlert(id) {
  /**
   * Dismiss/delete an alert.
   * If your schema uses a `dismissed` boolean instead, change this to update.
   */
  const supabase = await requireSupabase();
  const { error } = await supabase.from("alerts").delete().eq("id", id);
  if (error) throw error;
  return true;
}

/**
 * PUBLIC_INTERFACE
 */
export async function listInsightsSourceTransactions({ userId, fromDate, toDate } = {}) {
  /**
   * Fetch transactions for insights computations.
   * This is intentionally simple: pages can aggregate client-side.
   */
  const supabase = await requireSupabase();
  const uid = userId || (await getCurrentUserId());

  let q = supabase
    .from("transactions")
    .select("id,user_id,date,category,amount,merchant,status,created_at")
    .eq("user_id", uid);

  if (fromDate) q = q.gte("date", fromDate);
  if (toDate) q = q.lte("date", toDate);

  const { data, error } = await q.order("date", { ascending: false });
  if (error) throw error;
  return data || [];
}
