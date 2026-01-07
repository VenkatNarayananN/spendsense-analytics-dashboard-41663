import React from "react";
import { theme } from "../../theme";

/**
 * PUBLIC_INTERFACE
 */
export function Card({ title, subtitle, action, children, className = "" }) {
  return (
    <section
      className={`ss-card ${className}`}
      aria-label={title ? `Card: ${title}` : "Card"}
    >
      {(title || subtitle || action) && (
        <header className="ss-card__header">
          <div className="ss-card__titles">
            {title && <h2 className="ss-card__title">{title}</h2>}
            {subtitle && <p className="ss-card__subtitle">{subtitle}</p>}
          </div>
          {action && <div className="ss-card__action">{action}</div>}
        </header>
      )}
      <div className="ss-card__body">{children}</div>

      <style>{`
        .ss-card {
          background: ${theme.colors.surface};
          border: 1px solid rgba(226,232,240,0.18);
          border-radius: ${theme.radii.lg}px;
          box-shadow: ${theme.colors.shadow};
          overflow: hidden;
          backdrop-filter: blur(10px);
        }
        .ss-card__header{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:${theme.spacing.md}px;
          padding:${theme.spacing.lg}px ${theme.spacing.xl}px;
          border-bottom: 1px solid rgba(226,232,240,0.18);
          background: ${theme.gradients.primarySoft};
        }
        .ss-card__titles{ min-width: 0; }
        .ss-card__title{
          margin:0;
          font-size: 14px;
          letter-spacing: 0.2px;
          color: ${theme.colors.text};
          font-weight: 900;
        }
        .ss-card__subtitle{
          margin:${theme.spacing.xs}px 0 0 0;
          font-size: 12px;
          color: ${theme.colors.mutedText};
          line-height: 1.45;
          font-weight: 700;
        }
        .ss-card__body{
          padding:${theme.spacing.xl}px;
        }
      `}</style>
    </section>
  );
}
