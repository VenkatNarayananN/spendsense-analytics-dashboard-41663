/**
 * Demo/mock data utilities.
 *
 * This module intentionally avoids Supabase. It provides:
 * - built-in mock transactions + alerts
 * - optional localStorage override (from seed.js local fallback)
 */

function isoDateDaysAgo(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function sortByDateDesc(rows) {
  return [...(rows || [])].sort((a, b) => {
    const da = String(a.date || a.created_at || "");
    const db = String(b.date || b.created_at || "");
    // Descending
    if (db < da) return -1;
    if (db > da) return 1;
    return 0;
  });
}

const BUILTIN_TRANSACTIONS = sortByDateDesc([
  {
    id: "tx_demo_001",
    date: isoDateDaysAgo(0),
    merchant: "Nimbus Grocers",
    category: "Groceries",
    method: "Card •••• 2048",
    amount: 84.32,
    status: "Cleared",
  },
  {
    id: "tx_demo_002",
    date: isoDateDaysAgo(1),
    merchant: "Cedar Coffee",
    category: "Dining",
    method: "Card •••• 7712",
    amount: 12.9,
    status: "Cleared",
  },
  {
    id: "tx_demo_003",
    date: isoDateDaysAgo(2),
    merchant: "Atlas Cloud",
    category: "Software",
    method: "Bank",
    amount: 49.0,
    status: "Cleared",
  },
  {
    id: "tx_demo_004",
    date: isoDateDaysAgo(3),
    merchant: "Aurora Transit",
    category: "Transport",
    method: "Card •••• 2048",
    amount: 7.2,
    status: "Pending",
  },
  {
    id: "tx_demo_005",
    date: isoDateDaysAgo(4),
    merchant: "Orchid Streaming",
    category: "Entertainment",
    method: "Bank",
    amount: 12.99,
    status: "Cleared",
  },
  {
    id: "tx_demo_006",
    date: isoDateDaysAgo(5),
    merchant: "Sunrise Energy",
    category: "Utilities",
    method: "Bank",
    amount: 124.55,
    status: "Cleared",
  },
]);

const BUILTIN_ALERTS = sortByDateDesc([
  {
    id: "al_demo_001",
    severity: "High",
    title: "Unusual travel spend",
    detail: "A travel charge is significantly higher than your typical pattern.",
    created_at: new Date(Date.now() - 3600_000).toISOString(),
  },
  {
    id: "al_demo_002",
    severity: "Medium",
    title: "Subscription increased",
    detail: "A recurring subscription billed higher than last month.",
    created_at: new Date(Date.now() - 2 * 3600_000).toISOString(),
  },
  {
    id: "al_demo_003",
    severity: "Low",
    title: "New merchant detected",
    detail: "A merchant appears for the first time in your recent history.",
    created_at: new Date(Date.now() - 3 * 3600_000).toISOString(),
  },
]);

function readLocalSeed() {
  try {
    const raw = window.localStorage.getItem("ss_demo_seed");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    const transactions = Array.isArray(parsed.transactions) ? parsed.transactions : null;
    const alerts = Array.isArray(parsed.alerts) ? parsed.alerts : null;

    return {
      seededAt: parsed.seededAt || null,
      transactions,
      alerts,
    };
  } catch {
    return null;
  }
}

/**
 * PUBLIC_INTERFACE
 */
export function getDemoTransactions() {
  /**
   * Returns demo transactions immediately (no loading).
   * Prefers localStorage-seeded rows (seed.js fallback) when present.
   */
  const local = readLocalSeed();
  if (local?.transactions) {
    return sortByDateDesc(
      local.transactions.map((t) => ({
        id: t.id,
        date: t.date,
        merchant: t.merchant,
        category: t.category,
        method: t.method,
        amount: Number(t.amount || 0),
        status: t.status,
      }))
    );
  }
  return BUILTIN_TRANSACTIONS;
}

/**
 * PUBLIC_INTERFACE
 */
export function getDemoAlerts() {
  /**
   * Returns demo alerts immediately (no loading).
   * Prefers localStorage-seeded rows (seed.js fallback) when present.
   */
  const local = readLocalSeed();
  if (local?.alerts) {
    return sortByDateDesc(
      local.alerts.map((a) => ({
        id: a.id,
        severity: a.severity,
        title: a.title,
        detail: a.detail,
        created_at: a.created_at,
      }))
    );
  }
  return BUILTIN_ALERTS;
}

/**
 * PUBLIC_INTERFACE
 */
export function makeDemoTransactionId() {
  /** Creates a local-only ID for demo transactions created client-side. */
  return `tx_local_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}
