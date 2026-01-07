import React from "react";
import { theme } from "../../theme";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/**
 * PUBLIC_INTERFACE
 */
export function Skeleton({ width = "100%", height = 14, radius = theme.radii.md, style }) {
  const h = typeof height === "number" ? `${clamp(height, 8, 64)}px` : height;
  return (
    <>
      <div
        className="ss-skel"
        style={{
          width,
          height: h,
          borderRadius: radius,
          ...style,
        }}
        aria-hidden="true"
      />
      <style>{`
        .ss-skel{
          background: linear-gradient(
            90deg,
            rgba(15,23,42,0.06),
            rgba(15,23,42,0.10),
            rgba(15,23,42,0.06)
          );
          background-size: 200% 100%;
          animation: ssShimmer 1200ms ease-in-out infinite;
        }
        @keyframes ssShimmer{
          0%{ background-position: 0% 0%; }
          100%{ background-position: -200% 0%; }
        }
      `}</style>
    </>
  );
}

/**
 * PUBLIC_INTERFACE
 */
export function CardSkeleton({ rows = 3 }) {
  return (
    <div className="ss-cardSkel" role="status" aria-live="polite" aria-label="Loading">
      <div className="ss-cardSkel__head">
        <Skeleton width="48%" height={14} />
        <Skeleton width="22%" height={12} />
      </div>
      <div className="ss-cardSkel__body">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} height={12} width={`${92 - i * 8}%`} />
        ))}
      </div>

      <style>{`
        .ss-cardSkel{
          border: 1px solid ${theme.colors.border};
          border-radius:${theme.radii.lg}px;
          background: rgba(255,255,255,0.65);
          padding:${theme.spacing.xl}px;
          box-shadow: ${theme.colors.shadowSm};
        }
        .ss-cardSkel__head{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:${theme.spacing.md}px;
          margin-bottom:${theme.spacing.lg}px;
        }
        .ss-cardSkel__body{
          display:flex;
          flex-direction:column;
          gap:${theme.spacing.sm}px;
        }
      `}</style>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 */
export function TableSkeleton({ columns = 6, rows = 6 }) {
  return (
    <div className="ss-tableSkel" role="status" aria-live="polite" aria-label="Loading table">
      <div className="ss-tableSkel__head">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height={10} width={`${clamp(40 + (i % 3) * 18, 40, 90)}%`} />
        ))}
      </div>

      <div className="ss-tableSkel__rows">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="ss-tableSkel__row">
            {Array.from({ length: columns }).map((_, c) => (
              <Skeleton
                key={c}
                height={10}
                width={`${clamp(46 + ((r + c) % 4) * 12, 46, 92)}%`}
              />
            ))}
          </div>
        ))}
      </div>

      <style>{`
        .ss-tableSkel{
          width:100%;
          border: 1px solid ${theme.colors.border};
          border-radius:${theme.radii.lg}px;
          background:${theme.colors.surface};
          overflow:hidden;
        }
        .ss-tableSkel__head{
          display:grid;
          grid-template-columns: repeat(${columns}, minmax(0, 1fr));
          gap:${theme.spacing.md}px;
          padding:${theme.spacing.md}px ${theme.spacing.lg}px;
          background: rgba(99,102,241,0.08);
          border-bottom: 1px solid ${theme.colors.border};
        }
        .ss-tableSkel__rows{
          display:flex;
          flex-direction:column;
        }
        .ss-tableSkel__row{
          display:grid;
          grid-template-columns: repeat(${columns}, minmax(0, 1fr));
          gap:${theme.spacing.md}px;
          padding:${theme.spacing.md}px ${theme.spacing.lg}px;
          border-bottom: 1px solid ${theme.colors.border};
        }
        .ss-tableSkel__row:last-child{ border-bottom:none; }
      `}</style>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 */
export function ChartSkeleton({ height = 220 }) {
  return (
    <div className="ss-chartSkel" role="status" aria-live="polite" aria-label="Loading chart">
      <div className="ss-chartSkel__inner" style={{ height }}>
        <div className="ss-chartSkel__grid">
          <Skeleton height="100%" width="100%" radius={theme.radii.lg} />
        </div>
        <div className="ss-chartSkel__meta">
          <Skeleton width="44%" height={12} />
          <Skeleton width="28%" height={12} />
        </div>
      </div>

      <style>{`
        .ss-chartSkel{
          width:100%;
          border-radius:${theme.radii.lg}px;
          overflow:hidden;
          border: 1px solid ${theme.colors.border};
          background: rgba(255,255,255,0.65);
          box-shadow: ${theme.colors.shadowSm};
        }
        .ss-chartSkel__inner{
          padding:${theme.spacing.lg}px;
          display:flex;
          flex-direction:column;
          gap:${theme.spacing.md}px;
        }
        .ss-chartSkel__grid{
          flex:1;
        }
        .ss-chartSkel__meta{
          display:flex;
          justify-content:space-between;
          gap:${theme.spacing.md}px;
        }
      `}</style>
    </div>
  );
}
