import React from "react";

/**
 * PUBLIC_INTERFACE
 */
export function LiveBadge({ children = "Live", className = "" }) {
  /** A theme-adaptive "Live" badge with an animated status dot. */
  return (
    <>
      <span className={`ss-liveBadge ${className}`} aria-label="Live updates enabled">
        <span className="ss-liveBadge__dot" aria-hidden="true" />
        <span className="ss-liveBadge__text">{children}</span>
      </span>

      <style>{`
        .ss-liveBadge{
          display:inline-flex;
          align-items:center;
          gap:8px;
          height:24px;
          padding: 0 10px;
          border-radius: var(--radius-pill);
          font-size: var(--text-xs);
          font-weight: var(--weight-black);
          line-height: var(--line-tight);
          white-space:nowrap;

          /* Theme-adaptive via App.css variables */
          background: var(--live-badge-bg);
          color: var(--live-badge-text);
          border: 1px solid var(--live-badge-border);
          box-shadow: var(--shadow-sm);
          transition: var(--theme-transitions);
        }

        .ss-liveBadge__dot{
          width: 8px;
          height: 8px;
          border-radius: 999px;

          background: var(--live-badge-dot);
          box-shadow:
            0 0 0 3px var(--live-badge-dotRing),
            0 0 18px var(--live-badge-dotGlow);

          animation: ss-livePulse 1.2s ease-in-out infinite;
        }

        @keyframes ss-livePulse{
          0%, 100%{
            transform: scale(1);
            opacity: 1;
          }
          50%{
            transform: scale(0.82);
            opacity: 0.72;
          }
        }

        @media (prefers-reduced-motion: reduce){
          .ss-liveBadge__dot{ animation: none; }
        }

        .ss-liveBadge__text{
          letter-spacing: 0.2px;
        }
      `}</style>
    </>
  );
}
