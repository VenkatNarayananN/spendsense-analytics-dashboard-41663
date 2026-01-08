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
      /**
       * Use a rose→purple gradient for the main CTA.
       * Keep text white for contrast.
       */
      bg: theme.gradients.accent,
      color: "#FFFFFF",
      border: "transparent",
      hoverBg: "linear-gradient(135deg, rgba(244,114,182,0.92), rgba(168,85,247,0.92))",
      activeBg: "linear-gradient(135deg, rgba(244,114,182,0.82), rgba(168,85,247,0.82))",
      shadow: `${theme.shadows.sm}, ${theme.shadows.glowPink}`,
      focus: theme.effects.focusRing,
      focusSoft: theme.effects.focusSoft,
    },
    secondary: {
      bg: "rgba(255,255,255,0.86)",
      color: theme.colors.textStrong,
      border: theme.colors.border,
      hoverBg: "rgba(244,114,182,0.10)",
      activeBg: "rgba(244,114,182,0.14)",
      shadow: "none",
      focus: theme.effects.focusRing,
      focusSoft: theme.effects.focusSoft,
    },
    ghost: {
      bg: "transparent",
      color: theme.colors.textStrong,
      border: "transparent",
      hoverBg: "rgba(17,24,39,0.04)",
      activeBg: "rgba(17,24,39,0.06)",
      shadow: "none",
      focus: theme.effects.focusRing,
      focusSoft: theme.effects.focusSoft,
    },
    danger: {
      bg: theme.colors.danger,
      color: "#FFFFFF",
      border: "transparent",
      hoverBg: shade(theme.colors.danger, -14),
      activeBg: shade(theme.colors.danger, -22),
      shadow: "none",
      focus: "rgba(239,68,68,0.40)",
      focusSoft: "rgba(239,68,68,0.16)",
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
            box-shadow 160ms ease,
            background 160ms ease,
            opacity 140ms ease,
            border-color 140ms ease,
            filter 160ms ease;
          box-shadow: ${v.shadow || "none"};
          position: relative;
          white-space:nowrap;
          letter-spacing: 0.1px;
        }

        /* Soft highlight overlay for gradient button to feel more "fintech" */
        .ss-btn--primary::after{
          content:"";
          position:absolute;
          inset:0;
          border-radius: inherit;
          background:
            radial-gradient(700px 120px at 20% 0%, rgba(255,255,255,0.40), rgba(255,255,255,0) 60%),
            radial-gradient(500px 180px at 80% 100%, rgba(255,255,255,0.18), rgba(255,255,255,0) 65%);
          pointer-events:none;
          opacity: 0.9;
          transition: opacity 160ms ease;
        }

        .ss-btn:hover{
          background:${v.hoverBg};
          transform: translateY(-1px);
        }

        .ss-btn--primary:hover{
          filter: saturate(1.02);
        }

        .ss-btn--primary:hover::after{
          opacity: 1;
        }

        .ss-btn:active{
          background:${v.activeBg || v.hoverBg};
          transform: translateY(0);
          filter: saturate(0.98);
        }

        .ss-btn:disabled{
          opacity:0.55;
          cursor:not-allowed;
          transform:none;
          box-shadow:none;
          filter:none;
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
