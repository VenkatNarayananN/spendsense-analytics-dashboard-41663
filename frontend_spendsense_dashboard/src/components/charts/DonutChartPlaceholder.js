import React, { useMemo } from "react";
import { theme } from "../../theme";
import { ChartPlaceholderFrame, normalizeChartData } from "./ChartPlaceholderBase";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Convert percent slice into dasharray for a circular path.
 */
function ringStroke(pct, circumference) {
  const slice = clamp(pct, 0, 1) * circumference;
  const rest = circumference - slice;
  return `${slice} ${rest}`;
}

/**
 * PUBLIC_INTERFACE
 */
export function DonutChartPlaceholder({
  title = "Donut Chart",
  data = [
    { label: "Needs", value: 52 },
    { label: "Wants", value: 28 },
    { label: "Savings", value: 20 },
  ],
  height = 220,
}) {
  const series = useMemo(() => normalizeChartData(data), [data]);

  const total = useMemo(() => {
    const t = series.reduce((acc, d) => acc + (typeof d.value === "number" ? d.value : 0), 0);
    return t || 1;
  }, [series]);

  const slices = useMemo(() => {
    // Compute start offsets around the circle.
    const colors = [theme.colors.primary, theme.colors.secondary, theme.colors.success, theme.colors.error];
    let acc = 0;
    return series.map((d, idx) => {
      const pct = (d.value || 0) / total;
      const start = acc;
      acc += pct;
      return {
        label: d.label,
        value: d.value,
        pct,
        start,
        color: colors[idx % colors.length],
      };
    });
  }, [series, total]);

  return (
    <ChartPlaceholderFrame
      title={title}
      description="A donut chart placeholder rendered in SVG."
      height={height}
      legend={slices.map((s) => ({ label: s.label, color: s.color }))}
    >
      {() => {
        const cx = 320;
        const cy = 112;
        const r = 56;
        const stroke = 18;
        const circumference = 2 * Math.PI * r;

        return (
          <>
            {/* Base ring */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="rgba(55,65,81,0.10)"
              strokeWidth={stroke}
            />

            {/* Slices */}
            {slices.map((s) => (
              <circle
                key={s.label}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={ringStroke(s.pct, circumference)}
                strokeDashoffset={-s.start * circumference}
                transform={`rotate(-90 ${cx} ${cy})`}
                opacity="0.90"
              />
            ))}

            {/* Center label */}
            <text
              x={cx}
              y={cy - 4}
              textAnchor="middle"
              fontSize="14"
              fontWeight="900"
              fill={theme.colors.text}
            >
              {Math.round((slices[0]?.pct || 0) * 100)}%
            </text>
            <text
              x={cx}
              y={cy + 16}
              textAnchor="middle"
              fontSize="12"
              fontWeight="800"
              fill={theme.colors.mutedText}
            >
              largest share
            </text>
          </>
        );
      }}
    </ChartPlaceholderFrame>
  );
}
