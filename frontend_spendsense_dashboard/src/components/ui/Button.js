import React from "react";
import { theme } from "../../theme";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function hexToRgb(hex) {
  const h = String(hex || "").replace("#", "");
  if (h.length !== 6) return null;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return { r, g, b };
}

/**
 * Simple hover shade for solid colors (darken slightly).
 */
function shade(hex, amount = -10) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const r = clamp(rgb.r + amount, 0, 255);
  const g = clamp(rgb.g + amount, 0, 255);
  const b = clamp(rgb.b + amount, 0, 255);
  return `rgb(${r}, ${g}, ${b})`;
}

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
    sm: { h: 32, padX: 12, font: theme.typography.sizes.sm, radius: theme.radii.md },
    md: { h: 36, padX: 16, font: theme.typography.sizes.md, radius: theme.radii.md },
    lg: { h: 40, padX: 18, font: theme.typography.sizes.lg, radius: theme.radii.md },
    pill: { h: 26, padX: 10, font: theme.typography.sizes.sm, radius: theme.radii.pill },
  };
  const s = sizes[size] || sizes.md;

  const variants = {
    primary: {
      bg: theme.colors.orange,
      color: "#FFFFFF",
      border: "transparent",
      hoverBg: theme.colors.orangeHover,
      activeBg: shade(theme.colors.orangeHover, -10),
      shadow: theme.shadows.sm,
      focus: "rgba(249,115,22,0.32)",
      focusSoft: "rgba(249,115,22,0.14)",
    },
    secondary: {
      bg: theme.colors.card,
      color: theme.colors.textStrong,
      border: theme.colors.border,
      hoverBg: theme.colors.mutedSurface,
      activeBg: "rgba(17,24,39,0.06)",
      shadow: "none",
      focus: "rgba(17,24,39,0.18)",
      focusSoft: "rgba(17,24,39,0.08)",
    },
    ghost: {
      bg: "transparent",
      color: theme.colors.textStrong,
      border: "transparent",
      hoverBg: "rgba(17,24,39,0.04)",
      activeBg: "rgba(17,24,39,0.06)",
      shadow: "none",
      focus: "rgba(17,24,39,0.18)",
      focusSoft: "rgba(17,24,39,0.08)",
    },
    danger: {
      bg: theme.colors.red,
      color: "#FFFFFF",
      border: "transparent",
      hoverBg: shade(theme.colors.red, -14),
      activeBg: shade(theme.colors.red, -22),
      shadow: "none",
      focus: "rgba(239,68,68,0.35)",
      focusSoft: "rgba(239,68,68,0.14)",
    },
  };

  const v = variants[variant] || variants.primary;

  return (
    <>
      <button className={`ss-btn ss-btn--${variant} ${className}`} {...props}>
        <span className="ss-btn__inner">{children}</span>
      </button>

      <style>{`
        .ss-btn{
          appearance:none;
          height:${s.h}px;
          border-radius:${s.radius}px;
          border:1px solid ${v.border};
          background:${v.bg};
          color:${v.color};
          padding:0 ${s.padX}px;
          font-size:${s.font}px;
          font-weight:${theme.typography.weights.semibold};
          line-height:${theme.typography.lineHeights.tight};
          cursor:pointer;
          transition:
            transform 140ms ease,
            box-shadow 140ms ease,
            background 140ms ease,
            opacity 140ms ease,
            border-color 140ms ease;
          box-shadow: ${v.shadow || "none"};
          position: relative;
          white-space:nowrap;
        }

        .ss-btn:hover{
          background:${v.hoverBg};
          transform: translateY(-1px);
        }

        .ss-btn:active{
          background:${v.activeBg || v.hoverBg};
          transform: translateY(0);
        }

        .ss-btn:disabled{
          opacity:0.55;
          cursor:not-allowed;
          transform:none;
          box-shadow:none;
        }

        .ss-btn:focus-visible{
          outline: 3px solid ${v.focus};
          outline-offset: 2px;
          box-shadow: 0 0 0 4px ${v.focusSoft};
        }
      `}</style>
    </>
  );
}
