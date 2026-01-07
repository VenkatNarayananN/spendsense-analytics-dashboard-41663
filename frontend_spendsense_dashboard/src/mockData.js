/**
 * Mock data for SpendSense UI scaffolding.
 * Keep UI fully functional without backend/Supabase configuration.
 */

export const dashboardSummary = {
  monthlySpend: 4820.45,
  monthlyBudget: 6000,
  activeCards: 3,
  flaggedTransactions: 5,
};

export const transactions = [
  { id: "tx_1001", date: "2026-01-05", merchant: "Nimbus Grocers", category: "Groceries", method: "Card •••• 2048", amount: 128.43, status: "Cleared" },
  { id: "tx_1002", date: "2026-01-04", merchant: "Aurora Transit", category: "Transport", method: "Card •••• 2048", amount: 22.0, status: "Cleared" },
  { id: "tx_1003", date: "2026-01-03", merchant: "Cedar Coffee", category: "Dining", method: "Card •••• 7712", amount: 6.75, status: "Cleared" },
  { id: "tx_1004", date: "2026-01-02", merchant: "Atlas Cloud", category: "Software", method: "Bank", amount: 89.99, status: "Pending" },
  { id: "tx_1005", date: "2026-01-02", merchant: "Velvet Boutique", category: "Shopping", method: "Card •••• 7712", amount: 214.3, status: "Cleared" },
  { id: "tx_1006", date: "2026-01-01", merchant: "Sunrise Energy", category: "Utilities", method: "Bank", amount: 146.1, status: "Cleared" },
  { id: "tx_1007", date: "2025-12-31", merchant: "Zenith Hotel", category: "Travel", method: "Card •••• 9981", amount: 612.0, status: "Cleared" },
];

export const insights = {
  topCategories: [
    { label: "Groceries", value: 1240, changePct: 6.1 },
    { label: "Dining", value: 680, changePct: -2.4 },
    { label: "Software", value: 420, changePct: 12.2 },
    { label: "Travel", value: 980, changePct: 3.3 },
  ],
  trends: [
    { label: "Recurring subscriptions", detail: "Up 12% vs last month — review Atlas Cloud and streaming renewals." },
    { label: "Dining out", detail: "Slightly down — good consistency with weekday patterns." },
    { label: "Weekend spikes", detail: "Spending peaks on Saturdays; set a soft cap to smooth variability." },
  ],
};

export const alerts = [
  { id: "al_2001", severity: "High", title: "Unusual travel spend", detail: "Zenith Hotel charge is 2.3× your typical travel expense." },
  { id: "al_2002", severity: "Medium", title: "Subscription increased", detail: "Atlas Cloud billed $89.99 — up from $69.99 last month." },
  { id: "al_2003", severity: "Low", title: "New merchant detected", detail: "Velvet Boutique appears for the first time in your history." },
  { id: "al_2004", severity: "High", title: "Multiple declines", detail: "3 declined attempts at Aurora Transit within 10 minutes." },
];
