/**
 * SpendSense theme tokens (Screenshot Extract).
 * Source of truth:
 * - assets/style_guide.md
 * - assets/component_specs.md
 *
 * This file intentionally centralizes primitives so components can reference
 * semantic roles (theme.colors.*) instead of hard-coded hex values.
 */

export const theme = {
  colors: {
    // Canvas / surfaces
    canvas: "#F7E6EF", // --bg-canvas
    sidebar: "#FFFFFF", // --bg-sidebar
    card: "#FFFFFF", // --bg-card
    mutedSurface: "#F6F7F9", // --bg-muted

    // Text
    textStrong: "#111827",
    text: "#374151",
    textMuted: "#6B7280",
    textDisabled: "#9CA3AF",

    // Borders / dividers
    border: "#E5E7EB",
    borderSubtle: "#EEF2F7",

    // Brand / accent
    orange: "#F97316",
    orangeHover: "#EA580C",
    orangeSoft: "#FFEDD5",
    red: "#EF4444",
    redSoft: "#FEE2E2",

    // Status
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",

    // Back-compat aliases (older components use these names)
    primary: "#F97316",
    secondary: "#FFEDD5",
    info: "#F97316",
    error: "#EF4444",
  },

  typography: {
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    monoFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    sizes: { xs: 12, sm: 13, md: 14, lg: 16, xl: 18 },
    weights: { regular: 400, medium: 500, semibold: 600, bold: 700 },
    lineHeights: { tight: 1.2, normal: 1.4, relaxed: 1.6 },
  },

  radii: { sm: 8, md: 10, lg: 12, xl: 16, pill: 999 },

  spacing: {
    // Keep existing keys used throughout pages, but align values to spec scale.
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    "2xl": 32,
  },

  shadows: {
    sm: "0 1px 2px rgba(16,24,40,0.08)",
    md: "0 6px 18px rgba(16,24,40,0.10)",
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
