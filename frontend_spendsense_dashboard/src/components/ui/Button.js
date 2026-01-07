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
 * Keeps us within tokens without introducing a new palette.
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
    sm: { padY: 8, padX: 12, font: 12 },
    md: { padY: 10, padX: 14, font: 13 },
    lg: { padY: 12, padX: 16, font: 14 },
  };
  const s = sizes[size] || sizes.md;

  const variants = {
    primary: {
      bg: theme.colors.primary,
      color: "#FFFFFF",
      border: "transparent",
      hoverBg: shade(theme.colors.primary, -12),
      activeBg: shade(theme.colors.primary, -18),
      shadow: theme.colors.elevation1,
      focus: "rgba(244,114,182,0.45)",
      focusSoft: "rgba(244,114,182,0.18)",
    },
    secondary: {
      bg: theme.colors.secondary,
      color: "#111827",
      border: "transparent",
      hoverBg: shade(theme.colors.secondary, -14),
      activeBg: shade(theme.colors.secondary, -20),
      shadow: theme.colors.elevation1,
      focus: "rgba(245,158,11,0.45)",
      focusSoft: "rgba(245,158,11,0.18)",
    },
    ghost: {
      bg: "transparent",
      color: theme.colors.text,
      border: theme.colors.border,
      hoverBg: "rgba(244,114,182,0.10)",
      activeBg: "rgba(244,114,182,0.14)",
      shadow: "none",
      focus: "rgba(244,114,182,0.45)",
      focusSoft: "rgba(244,114,182,0.18)",
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
          border-radius:${theme.radii.md}px;
          border:1px solid ${v.border};
          background:${v.bg};
          color:${v.color};
          padding:${s.padY}px ${s.padX}px;
          font-size:${s.font}px;
          font-weight:800;
          letter-spacing: 0.2px;
          cursor:pointer;
          transition:
            transform 140ms ease,
            box-shadow 140ms ease,
            background 140ms ease,
            opacity 140ms ease,
            border-color 140ms ease,
            filter 140ms ease;
          box-shadow: ${v.shadow || "none"};
          position: relative;
        }

        .ss-btn:hover{
          background:${v.hoverBg};
          transform: translateY(-1px);
          border-color: ${variant === "ghost" ? "rgba(244,114,182,0.22)" : "transparent"};
        }

        .ss-btn:active{
          background:${v.activeBg || v.hoverBg};
          transform: translateY(0);
          box-shadow: ${variant === "ghost" ? "none" : theme.colors.elevation2};
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
          box-shadow:
            0 0 0 4px ${v.focusSoft},
            ${v.shadow || "none"};
        }
      `}</style>
    </>
  );
}
