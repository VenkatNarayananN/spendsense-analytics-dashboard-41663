import React from "react";

/**
 * PUBLIC_INTERFACE
 */
export function Card({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`ss-card ${className}`} aria-label={title ? `Card: ${title}` : "Card"}>
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
          background: color-mix(in srgb, var(--bg-card) 86%, transparent);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          backdrop-filter: blur(10px);
          transition: var(--theme-transitions);
        }

        .ss-card__header{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:16px;
          padding:20px;
          border-bottom: 1px solid var(--border-subtle);

          background: var(--grad-header);
          transition: var(--theme-transitions);
        }

        .ss-card__titles{ min-width: 0; }

        .ss-card__title{
          margin:0;
          font-size: var(--text-lg);
          color: var(--text-strong);
          font-weight: var(--weight-black);
          line-height: var(--line-tight);
          letter-spacing: 0.1px;
        }

        .ss-card__subtitle{
          margin: 6px 0 0 0;
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: var(--line-normal);
          font-weight: var(--weight-medium);
        }

        .ss-card__body{
          padding:20px;
        }
      `}</style>
    </section>
  );
}
