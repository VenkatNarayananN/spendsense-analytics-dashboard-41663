import React from "react";
import { theme } from "../../theme";

/**
 * PUBLIC_INTERFACE
 */
export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) {
  const sizes = {
    sm: { padY: 8, padX: 12, font: 12 },
    md: { padY: 10, padX: 14, font: 13 },
    lg: { padY: 12, padX: 16, font: 14 },
  };
  const s = sizes[size] || sizes.md;

  const variants = {
    primary: {
      bg: theme.colors.primary,
      color: "#111827",
      border: "transparent",
      hoverBg: "#FB7185", // slightly warmer rose
    },
    secondary: {
      bg: theme.colors.secondary,
      color: "#111827",
      border: "transparent",
      hoverBg: "#FBBF24",
    },
    ghost: {
      bg: "transparent",
      color: theme.colors.text,
      border: theme.colors.border,
      hoverBg: "rgba(244, 114, 182, 0.10)",
    },
  };

  const v = variants[variant] || variants.primary;

  return (
    <>
      <button className={`ss-btn ss-btn--${variant} ${className}`} {...props}>
        {children}
      </button>
      <style>{`
        .ss-btn{
          appearance:none;
          border-radius:${theme.radii.md}px;
          border:1px solid ${v.border};
          background:${v.bg};
          color:${v.color};
          padding:${s.padY}px ${s.padX}px;
          font-size:${s.font}px;
          font-weight:700;
          letter-spacing: 0.2px;
          cursor:pointer;
          transition: transform 140ms ease, box-shadow 140ms ease, background 140ms ease, opacity 140ms ease;
          box-shadow: 0 6px 18px rgba(17, 24, 39, 0.10);
        }
        .ss-btn:hover{ background:${v.hoverBg}; transform: translateY(-1px); }
        .ss-btn:active{ transform: translateY(0); box-shadow: 0 4px 12px rgba(17,24,39,0.10); }
        .ss-btn:disabled{ opacity:0.55; cursor:not-allowed; transform:none; box-shadow:none; }
        .ss-btn--ghost{ box-shadow:none; }
        .ss-btn--ghost:hover{ box-shadow:none; }
        .ss-btn:focus-visible{
          outline: 3px solid rgba(244, 114, 182, 0.35);
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
}
