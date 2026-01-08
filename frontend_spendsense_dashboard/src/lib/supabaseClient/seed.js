import { getSupabaseClient } from "../../supabaseClient";

/**
 * Generates deterministic-ish IDs for demo rows.
 * Not crypto-secure; only intended for seed/demo data.
 */
function makeId(prefix) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function isoDateDaysAgo(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

/**
 * Builds a set of realistic demo transactions and alerts for a specific user.
 * These shapes intentionally mirror existing UI mock data so tables/cards can use them.
 */
function buildDemoRows({ userId, countTransactions = 24, countAlerts = 6 } = {}) {
  const merchants = [
    { merchant: "Nimbus Grocers", category: "Groceries", method: "Card •••• 2048", min: 18, max: 210 },
    { merchant: "Aurora Transit", category: "Transport", method: "Card •••• 2048", min: 2.5, max: 38 },
    { merchant: "Cedar Coffee", category: "Dining", method: "Card •••• 7712", min: 3.5, max: 18 },
    { merchant: "Atlas Cloud", category: "Software", method: "Bank", min: 19, max: 129 },
    { merchant: "Velvet Boutique", category: "Shopping", method: "Card •••• 7712", min: 35, max: 420 },
    { merchant: "Sunrise Energy", category: "Utilities", method: "Bank", min: 65, max: 240 },
    { merchant: "Zenith Hotel", category: "Travel", method: "Card •••• 9981", min: 180, max: 980 },
    { merchant: "Luna Pharmacy", category: "Health", method: "Card •••• 2048", min: 12, max: 120 },
    { merchant: "Orchid Streaming", category: "Entertainment", method: "Bank", min: 9.99, max: 24.99 },
    { merchant: "Evergreen Fitness", category: "Health", method: "Card •••• 7712", min: 29, max: 89 },
  ];

  const statuses = ["Cleared", "Cleared", "Cleared", "Pending"];

  const transactions = Array.from({ length: countTransactions }).map((_, idx) => {
    const m = pick(merchants);
    const amount = round2(m.min + Math.random() * (m.max - m.min));
    return {
      id: makeId("tx"),
      user_id: userId,
      date: isoDateDaysAgo(idx % 28),
      merchant: m.merchant,
      category: m.category,
      method: m.method,
      amount,
      status: pick(statuses),
      created_at: new Date().toISOString(),
    };
  });

  const alertsTemplates = [
    { severity: "High", title: "Unusual travel spend", detail: "A travel charge is significantly higher than your typical pattern." },
    { severity: "Medium", title: "Subscription increased", detail: "A recurring subscription billed higher than last month." },
    { severity: "Low", title: "New merchant detected", detail: "A merchant appears for the first time in your recent history." },
    { severity: "High", title: "Multiple declines", detail: "Several declined attempts occurred within a short timeframe." },
    { severity: "Medium", title: "Budget pacing risk", detail: "Current month pacing is trending above your soft budget." },
    { severity: "Low", title: "Category drift", detail: "Spending mix shifted slightly vs last month; review for optimization." },
  ];

  const alerts = Array.from({ length: countAlerts }).map((_, idx) => {
    const t = alertsTemplates[idx % alertsTemplates.length];
    return {
      id: makeId("al"),
      user_id: userId,
      severity: t.severity,
      title: t.title,
      detail: t.detail,
      created_at: new Date(Date.now() - idx * 3600_000).toISOString(),
    };
  });

  return { transactions, alerts };
}

/**
 * Safe local fallback: store demo data into localStorage.
 * This makes the "Generate sample data" button still do something useful
 * in demo mode (no Supabase configured) without breaking the app.
 */
function seedToLocalStorage({ transactions, alerts }) {
  try {
    const payload = {
      seededAt: new Date().toISOString(),
      transactions,
      alerts,
    };
    window.localStorage.setItem("ss_demo_seed", JSON.stringify(payload));
    return { ok: true, mode: "localStorage", message: "Demo data generated locally (no Supabase configured)." };
  } catch (e) {
    return {
      ok: false,
      mode: "localStorage",
      message: "Unable to write demo data locally (storage unavailable).",
      error: e?.message || String(e),
    };
  }
}

/**
 * PUBLIC_INTERFACE
 */
export async function generateSampleDataSeed(options = {}) {
  /**
   * Generate realistic sample data for the current logged-in user.
   *
   * Behavior:
   * - If Supabase is configured + available + a session exists:
   *    attempts to insert rows into `transactions` and `alerts` tables.
   * - Otherwise:
   *    falls back to saving demo data into localStorage.
   *
   * Options:
   * - countTransactions: number (default 24)
   * - countAlerts: number (default 6)
   */
  const { countTransactions = 24, countAlerts = 6 } = options;

  // 1) Try Supabase path (best effort, fully guarded).
  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        // If auth is misconfigured, fall back.
        const demoRows = buildDemoRows({ userId: "demo_user", countTransactions, countAlerts });
        return seedToLocalStorage(demoRows);
      }

      const userId = authData?.user?.id;
      if (!userId) {
        const demoRows = buildDemoRows({ userId: "demo_user", countTransactions, countAlerts });
        return seedToLocalStorage(demoRows);
      }

      const demoRows = buildDemoRows({ userId, countTransactions, countAlerts });

      // We intentionally do NOT attempt to create tables; only insert if tables exist.
      // If the schema isn't present, this will error and we fall back to local.
      const txInsert = await supabase.from("transactions").insert(demoRows.transactions);
      if (txInsert?.error) throw txInsert.error;

      const alInsert = await supabase.from("alerts").insert(demoRows.alerts);
      if (alInsert?.error) throw alInsert.error;

      return {
        ok: true,
        mode: "supabase",
        message: `Seeded ${demoRows.transactions.length} transactions and ${demoRows.alerts.length} alerts into Supabase.`,
      };
    } catch (e) {
      // Supabase available but schema / RLS / permissions missing; fall back to local.
      const demoRows = buildDemoRows({ userId: "demo_user", countTransactions, countAlerts });
      const localRes = seedToLocalStorage(demoRows);
      return {
        ...localRes,
        message:
          localRes.ok
            ? "Supabase seed failed (missing tables/RLS?). Generated demo data locally instead."
            : "Supabase seed failed and local demo fallback also failed.",
        error: e?.message || String(e),
      };
    }
  }

  // 2) No Supabase configured -> local demo seed.
  const demoRows = buildDemoRows({ userId: "demo_user", countTransactions, countAlerts });
  return seedToLocalStorage(demoRows);
}
