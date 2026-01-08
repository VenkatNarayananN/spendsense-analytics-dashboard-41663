import React from "react";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/**
 * PUBLIC_INTERFACE
 */
export function Skeleton({ width = "100%", height = 14, radius = "var(--radius-md)", style }) {
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
          background: var(--grad-shimmer);
          background-size: 200% 100%;
          animation: ssShimmer 1200ms ease-in-out infinite;
        }
        @keyframes ssShimmer{
          0%{ background-position: 0% 0%; }
          100%{ background-position: -200% 0%; }
        }
        @media (prefers-reduced-motion: reduce){
          .ss-skel{ animation: none; }
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
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          background: color-mix(in srgb, var(--bg-card) 70%, transparent);
          padding: var(--space-6);
          box-shadow: var(--shadow-sm);
          backdrop-filter: blur(10px);
          transition: var(--theme-transitions);
        }
        .ss-cardSkel__head{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap: var(--space-4);
          margin-bottom: var(--space-5);
        }
        .ss-cardSkel__body{
          display:flex;
          flex-direction:column;
          gap: var(--space-3);
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
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          background: color-mix(in srgb, var(--bg-card) 76%, transparent);
          overflow:hidden;
          box-shadow: var(--shadow-sm);
          backdrop-filter: blur(10px);
          transition: var(--theme-transitions);
        }
        .ss-tableSkel__head{
          display:grid;
          grid-template-columns: repeat(${columns}, minmax(0, 1fr));
          gap: var(--space-4);
          padding: var(--space-4) var(--space-5);
          background: var(--grad-header);
          border-bottom: 1px solid var(--border-subtle);
        }
        .ss-tableSkel__rows{
          display:flex;
          flex-direction:column;
        }
        .ss-tableSkel__row{
          display:grid;
          grid-template-columns: repeat(${columns}, minmax(0, 1fr));
          gap: var(--space-4);
          padding: var(--space-4) var(--space-5);
          border-bottom: 1px solid var(--border-subtle);
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
          <Skeleton height="100%" width="100%" radius="var(--radius-lg)" />
        </div>
        <div className="ss-chartSkel__meta">
          <Skeleton width="44%" height={12} />
          <Skeleton width="28%" height={12} />
        </div>
      </div>

      <style>{`
        .ss-chartSkel{
          width:100%;
          border-radius: var(--radius-lg);
          overflow:hidden;
          border: 1px solid var(--border-default);
          background: color-mix(in srgb, var(--bg-card) 70%, transparent);
          box-shadow: var(--shadow-sm);
          backdrop-filter: blur(10px);
          transition: var(--theme-transitions);
        }
        .ss-chartSkel__inner{
          padding: var(--space-5);
          display:flex;
          flex-direction:column;
          gap: var(--space-4);
        }
        .ss-chartSkel__grid{
          flex:1;
        }
        .ss-chartSkel__meta{
          display:flex;
          justify-content:space-between;
          gap: var(--space-4);
        }
      `}</style>
    </div>
  );
}
