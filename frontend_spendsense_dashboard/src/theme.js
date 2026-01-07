/**
 * SpendSense theme tokens (Ocean Professional).
 * Centralized design system primitives for consistent styling.
 *
 * Style guide:
 * - primary:   #F472B6
 * - secondary: #F59E0B
 * - success:   #10B981
 * - error:     #EF4444
 * - text:      #374151
 * - background:#FDF2F8
 * - surface:   #FFFFFF
 * - gradient:  rose-50 -> purple-50 (soft, elegant)
 */

export const theme = {
  tokens: {
    primary: "#F472B6",
    secondary: "#F59E0B",
    success: "#10B981",
    error: "#EF4444",
    text: "#374151",
    background: "#FDF2F8",
    surface: "#FFFFFF",
  },

  /**
   * Semantic color roles. Keep this as the single source-of-truth for components.
   * (Components should pull from these rather than inventing ad-hoc colors.)
   */
  colors: {
    // Core roles
    primary: "#F472B6",
    secondary: "#F59E0B",
    success: "#10B981",
    error: "#EF4444",
    warning: "#F59E0B",
    info: "#F472B6",

    // Neutrals / text roles
    text: "#374151",
    textPrimary: "#374151",
    mutedText: "rgba(55,65,81,0.68)",

    // Surfaces / borders
    background: "#FDF2F8",
    surface: "#FFFFFF",
    surfaceSolid: "#FFFFFF",
    border: "rgba(55,65,81,0.14)",

    /**
     * Surface elevations.
     * Use subtle, elegant elevation on light surfaces (no harsh shadows).
     */
    elevation1: "0 10px 24px rgba(17,24,39,0.08)",
    elevation2: "0 18px 44px rgba(17,24,39,0.12)",
  },

  gradients: {
    /**
     * Page background: gentle, pastel gradient (rose-50 -> purple-50),
     * layered with soft radial accents using primary/secondary.
     */
    page:
      "radial-gradient(920px 520px at 14% 12%, rgba(244,114,182,0.22) 0%, rgba(244,114,182,0.00) 62%), radial-gradient(880px 520px at 84% 16%, rgba(245,158,11,0.16) 0%, rgba(245,158,11,0.00) 58%), linear-gradient(135deg, #FDF2F8 0%, #FAF5FF 100%)",

    // Soft highlight backgrounds for headers/sections
    primarySoft:
      "linear-gradient(135deg, rgba(244,114,182,0.14) 0%, rgba(217,70,239,0.10) 100%)",

    // Primary/secondary accent gradient (used sparingly for primary CTAs)
    accent:
      "linear-gradient(90deg, rgba(244,114,182,1) 0%, rgba(245,158,11,1) 100%)",
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
