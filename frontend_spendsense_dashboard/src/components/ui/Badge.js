import React from "react";
import { theme } from "../../theme";

/**
 * PUBLIC_INTERFACE
 */
export function Badge({ tone = "neutral", children, className = "" }) {
  const tones = {
    neutral: {
      bg: "rgba(15,23,42,0.06)",
      fg: theme.colors.text,
      border: theme.colors.border,
    },
    info: {
      bg: "rgba(99,102,241,0.14)",
      fg: theme.colors.text,
      border: "rgba(99,102,241,0.30)",
    },
    warning: {
      bg: "rgba(245,158,11,0.16)",
      fg: theme.colors.text,
      border: "rgba(245,158,11,0.35)",
    },
    success: {
      bg: "rgba(34,197,94,0.14)",
      fg: theme.colors.text,
      border: "rgba(34,197,94,0.28)",
    },
    error: {
      bg: "rgba(239,68,68,0.14)",
      fg: theme.colors.text,
      border: "rgba(239,68,68,0.30)",
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
          gap:6px;
          padding:6px 10px;
          border-radius:${theme.radii.pill}px;
          border:1px solid ${t.border};
          background:${t.bg};
          color:${t.fg};
          font-size:12px;
          font-weight:800;
          letter-spacing:0.2px;
          white-space:nowrap;
        }
      `}</style>
    </>
  );
}
