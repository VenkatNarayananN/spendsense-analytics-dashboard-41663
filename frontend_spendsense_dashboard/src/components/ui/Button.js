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
      bg: theme.gradients.accent,
      color: "#FFFFFF",
      border: "transparent",
      hoverBg: theme.gradients.accent,
      shadow: theme.colors.shadowSm,
    },
    secondary: {
      bg: "rgba(255,255,255,0.72)",
      color: theme.colors.text,
      border: "rgba(99,102,241,0.24)",
      hoverBg: "rgba(255,255,255,0.86)",
      shadow: "none",
    },
    ghost: {
      bg: "transparent",
      color: "#E5E7EB",
      border: "rgba(226,232,240,0.18)",
      hoverBg: "rgba(226,232,240,0.08)",
      shadow: "none",
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
          transition: transform 140ms ease, box-shadow 140ms ease, background 140ms ease, opacity 140ms ease, border-color 140ms ease;
          box-shadow: ${v.shadow || "none"};
          position: relative;
          overflow:hidden;
        }
        .ss-btn__inner{ position: relative; z-index: 1; }
        .ss-btn--primary:before{
          content:"";
          position:absolute;
          inset:-1px;
          background: radial-gradient(420px 180px at 20% 10%, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.00) 56%);
          opacity: 0.95;
          transition: opacity 140ms ease;
        }
        .ss-btn:hover{
          background:${v.hoverBg};
          transform: translateY(-1px);
          border-color: rgba(255,255,255,0.08);
        }
        .ss-btn--secondary:hover{ border-color: rgba(99,102,241,0.32); }
        .ss-btn--ghost:hover{ border-color: rgba(226,232,240,0.26); }
        .ss-btn--primary:hover:before{ opacity: 1; }
        .ss-btn:active{
          transform: translateY(0);
          box-shadow: ${variant === "primary" ? "0 14px 34px rgba(2,6,23,0.22)" : "none"};
        }
        .ss-btn:disabled{
          opacity:0.55;
          cursor:not-allowed;
          transform:none;
          box-shadow:none;
        }
        .ss-btn:focus-visible{
          outline: 3px solid rgba(99,102,241,0.42);
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
}
