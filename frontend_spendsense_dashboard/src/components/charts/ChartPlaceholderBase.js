import React, { useId, useMemo } from "react";
import { theme } from "../../theme";

/**
 * Create a deterministic "sample series" from labels/values for placeholder visuals.
 */
function normalizeSeries(data) {
  if (!Array.isArray(data) || data.length === 0) return [];
  const values = data.map((d) => (typeof d?.value === "number" ? d.value : 0));
  const max = Math.max(...values, 1);
  return data.map((d, i) => ({
    label: String(d?.label ?? `Item ${i + 1}`),
    value: typeof d?.value === "number" ? d.value : 0,
    pct: (typeof d?.value === "number" ? d.value : 0) / max,
  }));
}

/**
 * PUBLIC_INTERFACE
 */
export function ChartPlaceholderFrame({
  title,
  description,
  height = 220,
  legend = [],
  children,
}) {
  /**
   * A reusable frame that:
   * - renders accessible SVG container (role=img, title/desc)
   * - includes subtle grid/background consistent with Ocean Professional theme
   */
  const uid = useId();
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;

  const computedLegend = useMemo(() => {
    if (Array.isArray(legend) && legend.length > 0) return legend;
    return [];
  }, [legend]);

  return (
    <div className="ss-chartPh" style={{ height }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 640 260"
        preserveAspectRatio="none"
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
      >
        <title id={titleId}>{title || "Chart placeholder"}</title>
        <desc id={descId}>
          {description ||
            "A placeholder visualization rendered as an SVG to be replaced with a real chart later."}
        </desc>

        {/* Background */}
        <defs>
          <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--chart-ph-stop-1)" />
            <stop offset="100%" stopColor="var(--chart-ph-stop-2)" />
          </linearGradient>

          <linearGradient id={`${uid}-stroke`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={theme.colors.primary} />
            <stop offset="100%" stopColor={theme.colors.secondary} />
          </linearGradient>
        </defs>

        <rect
          x="12"
          y="12"
          width="616"
          height="236"
          rx="18"
          fill={`url(#${uid}-bg)`}
          stroke="rgba(55,65,81,0.16)"
        />

        {/* Grid */}
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1="24"
            y1={40 + i * 32}
            x2="616"
            y2={40 + i * 32}
            stroke="rgba(55,65,81,0.08)"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={52 + i * 58}
            y1="24"
            x2={52 + i * 58}
            y2="236"
            stroke="rgba(55,65,81,0.06)"
            strokeWidth="1"
          />
        ))}

        {/* Plot area */}
        <g transform="translate(24,24)">{children({ uid })}</g>

        {/* Legend */}
        {computedLegend.length > 0 && (
          <g>
            {computedLegend.slice(0, 3).map((l, idx) => (
              <g key={l.label} transform={`translate(${28 + idx * 196}, 228)`}>
                <rect
                  x="0"
                  y="-8"
                  width="12"
                  height="12"
                  rx="6"
                  fill={l.color}
                  opacity="0.95"
                />
                <text
                  x="18"
                  y="2"
                  fontSize="12"
                  fontWeight="700"
                  fill={theme.colors.mutedText}
                >
                  {l.label}
                </text>
              </g>
            ))}
          </g>
        )}
      </svg>

      <style>{`
        .ss-chartPh{
          width:100%;
          border-radius:${theme.radii.lg}px;
          overflow:hidden;
        }
      `}</style>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 */
export function normalizeChartData(data) {
  /** Normalizes data entries into {label, value, pct} for placeholders. */
  return normalizeSeries(data);
}
