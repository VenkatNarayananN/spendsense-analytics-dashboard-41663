import React from "react";

/**
 * PUBLIC_INTERFACE
 */
export function Badge({ tone = "neutral", children, className = "" }) {
  return (
    <>
      <span className={`ss-badge ${className}`} data-tone={tone}>
        {children}
      </span>

      <style>{`
        .ss-badge{
          display:inline-flex;
          align-items:center;
          height:24px;
          padding: 0 10px;
          border-radius: var(--radius-pill);
          font-size: var(--text-xs);
          font-weight: var(--weight-black);
          line-height: var(--line-tight);
          white-space:nowrap;

          border: 1px solid var(--border-subtle);
          background: var(--bg-muted);
          color: var(--text-default);
          transition: var(--theme-transitions);
        }

        .ss-badge[data-tone="info"]{
          background: var(--grad-accent-soft);
          color: var(--text-strong);
          border-color: color-mix(in srgb, var(--brand-primary) 22%, transparent);
        }

        .ss-badge[data-tone="warning"]{
          background: color-mix(in srgb, var(--brand-secondary) 18%, transparent);
          color: var(--text-strong);
          border-color: color-mix(in srgb, var(--brand-secondary) 28%, transparent);
        }

        .ss-badge[data-tone="success"]{
          background: color-mix(in srgb, var(--success) 16%, transparent);
          color: var(--text-strong);
          border-color: color-mix(in srgb, var(--success) 24%, transparent);
        }

        .ss-badge[data-tone="error"]{
          background: color-mix(in srgb, var(--danger) 14%, transparent);
          color: var(--text-strong);
          border-color: color-mix(in srgb, var(--danger) 22%, transparent);
        }
      `}</style>
    </>
  );
}
