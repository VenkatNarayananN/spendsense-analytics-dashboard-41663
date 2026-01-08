/**
 * SpendSense theme tokens (Ocean Professional).
 * Source of truth:
 * - assets/style_guide.md
 * - assets/component_specs.md
 *
 * This file centralizes primitives so components can reference semantic roles
 * (theme.colors.*, theme.gradients.*, theme.shadows.*) instead of hard-coded values.
 */

export const theme = {
  colors: {
    // Brand (Ocean Professional)
    primary: "#F472B6", // pink / rose
    secondary: "#F59E0B", // amber

    // Canvas / surfaces
    canvas: "#FDF2F8", // rose-50-ish
    sidebar: "#FFFFFF",
    card: "#FFFFFF",
    surface: "#FFFFFF",
    mutedSurface: "rgba(255,255,255,0.72)",

    // Text
    textStrong: "#111827",
    text: "#374151",
    textMuted: "#6B7280",
    textDisabled: "#9CA3AF",

    // Borders / dividers
    border: "rgba(17,24,39,0.10)",
    borderSubtle: "rgba(17,24,39,0.06)",

    // Status
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",

    // Legacy aliases (keep existing components working)
    orange: "#F59E0B",
    orangeHover: "#D97706",
    orangeSoft: "rgba(245,158,11,0.18)",
    red: "#EF4444",
    redSoft: "rgba(239,68,68,0.14)",

    // Helper semantic
    mutedText: "#6B7280",
  },

  gradients: {
    /**
     * These are used as backgrounds/accents, so keep them light and elegant.
     * Prefer subtle, accessible gradients (not overly saturated).
     */
    canvas:
      "radial-gradient(1200px 700px at 10% 0%, rgba(244,114,182,0.18), rgba(244,114,182,0) 55%), radial-gradient(900px 520px at 95% 8%, rgba(245,158,11,0.18), rgba(245,158,11,0) 55%), linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.72))",
    header:
      "linear-gradient(90deg, rgba(244,114,182,0.14), rgba(245,158,11,0.12))",
    accent:
      "linear-gradient(135deg, rgba(244,114,182,1), rgba(168,85,247,1))", // rose -> purple
    accentSoft:
      "linear-gradient(135deg, rgba(244,114,182,0.16), rgba(168,85,247,0.10))",
    amberGlow:
      "linear-gradient(135deg, rgba(245,158,11,0.18), rgba(245,158,11,0.06))",
  },

  typography: {
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
    monoFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    sizes: { xs: 12, sm: 13, md: 14, lg: 16, xl: 18 },
    weights: { regular: 400, medium: 500, semibold: 600, bold: 700, black: 900 },
    lineHeights: { tight: 1.2, normal: 1.4, relaxed: 1.6 },
  },

  radii: { sm: 10, md: 12, lg: 14, xl: 16, pill: 999 },

  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    "2xl": 32,
  },

  shadows: {
    sm: "0 1px 2px rgba(16,24,40,0.08)",
    md: "0 10px 30px rgba(16,24,40,0.10)",
    glowPink: "0 18px 50px rgba(244,114,182,0.18)",
    glowAmber: "0 18px 50px rgba(245,158,11,0.16)",
  },

  effects: {
    /**
     * Accessible focus ring using the primary brand color.
     * (Used in global CSS and components where applicable.)
     */
    focusRing: "rgba(244,114,182,0.45)",
    focusSoft: "rgba(244,114,182,0.18)",
  },

  layout: {
    sidebarWidth: 240,
    rightRailWidth: 300,
    rightRailWidthNarrow: 260,
  },
};

export const navItems = [
  { key: "dashboard", label: "Dashboard", path: "/" },
  { key: "transactions", label: "Transactions", path: "/transactions" },
  { key: "insights", label: "Insights", path: "/insights" },
  { key: "alerts", label: "Alerts", path: "/alerts" },
  { key: "settings", label: "Settings", path: "/settings" },
];
