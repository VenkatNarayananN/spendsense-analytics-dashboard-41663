import React from "react";
import { theme } from "../../theme";

/**
 * PUBLIC_INTERFACE
 */
export function Badge({ tone = "neutral", children, className = "" }) {
  const tones = {
    neutral: {
      bg: theme.colors.mutedSurface,
      fg: theme.colors.text,
      border: theme.colors.borderSubtle,
    },
    info: {
      bg: theme.colors.orangeSoft,
      fg: theme.colors.orange,
      border: "rgba(249,115,22,0.18)",
    },
    warning: {
      bg: "rgba(245,158,11,0.18)",
      fg: theme.colors.textStrong,
      border: "rgba(245,158,11,0.28)",
    },
    success: {
      bg: "rgba(34,197,94,0.16)",
      fg: theme.colors.textStrong,
      border: "rgba(34,197,94,0.24)",
    },
    error: {
      bg: theme.colors.redSoft,
      fg: theme.colors.red,
      border: "rgba(239,68,68,0.22)",
    },
  };

  const t = tones[tone] || tones.neutral;

  return (
    <>
      <span className={`ss-badge ${className}`} data-tone={tone}>
        {children}
      </span>
      <style>{`
        .ss-badge{
          display:inline-flex;
          align-items:center;
          height:24px;
          padding: 0 8px;
          border-radius:${theme.radii.pill}px;
          border:1px solid ${t.border};
          background:${t.bg};
          color:${t.fg};
          font-size:${theme.typography.sizes.xs}px;
          font-weight:${theme.typography.weights.medium};
          line-height:${theme.typography.lineHeights.tight};
          white-space:nowrap;
        }
      `}</style>
    </>
  );
}
