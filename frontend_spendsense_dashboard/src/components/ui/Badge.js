import React from "react";
import { theme } from "../../theme";

/**
 * PUBLIC_INTERFACE
 */
export function Badge({ tone = "neutral", children, className = "" }) {
  const tones = {
    neutral: {
      bg: "rgba(55,65,81,0.06)",
      fg: theme.colors.text,
      border: theme.colors.border,
    },
    info: {
      bg: "rgba(244,114,182,0.14)",
      fg: theme.colors.text,
      border: "rgba(244,114,182,0.30)",
    },
    warning: {
      bg: "rgba(245,158,11,0.16)",
      fg: theme.colors.text,
      border: "rgba(245,158,11,0.32)",
    },
    success: {
      bg: "rgba(16,185,129,0.14)",
      fg: theme.colors.text,
      border: "rgba(16,185,129,0.28)",
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
