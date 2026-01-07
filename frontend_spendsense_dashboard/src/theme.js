/**
 * Ocean Professional theme tokens for SpendSense.
 * Centralized design system primitives for consistent styling.
 */

export const theme = {
  colors: {
    primary: "#F472B6",
    secondary: "#F59E0B",
    success: "#10B981",
    error: "#EF4444",
    background: "#FDF2F8",
    surface: "#FFFFFF",
    text: "#374151",
    mutedText: "#6B7280",
    border: "rgba(55, 65, 81, 0.12)",
    shadow: "0 12px 30px rgba(17, 24, 39, 0.08)",
  },
  gradients: {
    page: "linear-gradient(135deg, #FFF1F2 0%, #FAE8FF 100%)", // rose-50 -> purple-50
    primarySoft: "linear-gradient(135deg, rgba(244, 114, 182, 0.20) 0%, rgba(245, 158, 11, 0.12) 100%)",
  },
  radii: {
    sm: 10,
    md: 14,
    lg: 18,
    pill: 999,
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
    "2xl": 32,
  },
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    monoFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
};

export const navItems = [
  { key: "dashboard", label: "Dashboard", path: "/" },
  { key: "transactions", label: "Transactions", path: "/transactions" },
  { key: "insights", label: "Insights", path: "/insights" },
  { key: "alerts", label: "Alerts", path: "/alerts" },
  { key: "settings", label: "Settings", path: "/settings" },
];
