/**
 * SpendSense theme tokens (Modern Fintech).
 * Centralized design system primitives for consistent styling.
 */

export const theme = {
  colors: {
    // Brand accents (fintech: cool + crisp, with subtle gradient support)
    primary: "#6366F1", // indigo-500
    secondary: "#06B6D4", // cyan-500
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",

    // Neutrals
    background: "#0B1220", // deep navy for gradient base
    surface: "rgba(255,255,255,0.86)", // glassy surface for cards
    surfaceSolid: "#FFFFFF",
    text: "#0F172A", // slate-900
    mutedText: "rgba(15,23,42,0.66)",
    border: "rgba(15, 23, 42, 0.12)",

    // Shadows
    shadowSm: "0 10px 24px rgba(2, 6, 23, 0.10)",
    shadow: "0 18px 44px rgba(2, 6, 23, 0.16)",
  },

  gradients: {
    // Dark-to-light fintech background with subtle color bloom
    page:
      "radial-gradient(1200px 680px at 18% 8%, rgba(99,102,241,0.22) 0%, rgba(99,102,241,0.00) 60%), radial-gradient(900px 520px at 86% 18%, rgba(6,182,212,0.18) 0%, rgba(6,182,212,0.00) 55%), linear-gradient(180deg, #0B1220 0%, #0A1326 34%, #0B1B34 100%)",
    primarySoft:
      "linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(6,182,212,0.14) 100%)",
    accent:
      "linear-gradient(90deg, rgba(99,102,241,1) 0%, rgba(6,182,212,1) 100%)",
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
    fontFamily:
      "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    monoFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
};

export const navItems = [
  { key: "dashboard", label: "Dashboard", path: "/" },
  { key: "transactions", label: "Transactions", path: "/transactions" },
  { key: "insights", label: "Insights", path: "/insights" },
  { key: "alerts", label: "Alerts", path: "/alerts" },
  { key: "settings", label: "Settings", path: "/settings" },
];
