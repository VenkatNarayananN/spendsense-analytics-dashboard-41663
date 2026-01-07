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
          background: ${theme.colors.card};
          border: 1px solid ${theme.colors.border};
          border-radius: ${theme.radii.lg}px;
          box-shadow: ${theme.shadows.sm};
          overflow: hidden;
        }

        .ss-card__header{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:${theme.spacing.md}px;
          padding:${theme.spacing.lg}px;
          border-bottom: 1px solid ${theme.colors.borderSubtle};
          background: ${theme.colors.card};
        }

        .ss-card__titles{ min-width: 0; }

        .ss-card__title{
          margin:0;
          font-size: ${theme.typography.sizes.lg}px;
          color: ${theme.colors.textStrong};
          font-weight: ${theme.typography.weights.semibold};
          line-height:${theme.typography.lineHeights.tight};
        }

        .ss-card__subtitle{
          margin: 6px 0 0 0;
          font-size: ${theme.typography.sizes.sm}px;
          color: ${theme.colors.textMuted};
          line-height: ${theme.typography.lineHeights.normal};
          font-weight: ${theme.typography.weights.medium};
        }

        .ss-card__body{
          padding:${theme.spacing.lg}px;
        }
      `}</style>
    </section>
  );
}
