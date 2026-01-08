import { getSupabaseClient } from "../../supabaseClient";

/**
 * PUBLIC_INTERFACE
 */
export async function subscribeToTableChanges({ table, filter, onChange }) {
  /**
   * Subscribes to realtime changes for a given table.
   *
   * Params:
   * - table: string (required)
   * - filter: string (optional) e.g. "user_id=eq.<uuid>"
   * - onChange: function(payload) (required)
   *
   * Returns:
   * - { unsubscribe: () => void }
   */
  const supabase = await getSupabaseClient();
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY."
    );
  }

  const channel = supabase.channel(`ss-rt:${table}:${filter || "all"}`);

  channel.on(
    "postgres_changes",
    { event: "*", schema: "public", table, filter },
    (payload) => {
      try {
        onChange?.(payload);
      } catch {
        // never throw inside realtime handler
      }
    }
  );

  const { error } = await channel.subscribe();
  if (error) throw error;

  return {
    unsubscribe: () => {
      try {
        supabase.removeChannel(channel);
      } catch {
        // ignore
      }
    },
  };
}
