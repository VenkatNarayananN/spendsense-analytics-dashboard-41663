import React, { useMemo } from "react";
import { theme } from "../../theme";
import { ChartPlaceholderFrame, normalizeChartData } from "./ChartPlaceholderBase";

/**
 * PUBLIC_INTERFACE
 */
export function AreaChartPlaceholder({
  title = "Area Chart",
  data = [
    { label: "Mon", value: 34 },
    { label: "Tue", value: 58 },
    { label: "Wed", value: 42 },
    { label: "Thu", value: 76 },
    { label: "Fri", value: 62 },
    { label: "Sat", value: 88 },
    { label: "Sun", value: 54 },
  ],
  height = 220,
}) {
  const series = useMemo(() => normalizeChartData(data), [data]);

  const points = useMemo(() => {
    if (series.length === 0) return [];
    const w = 592; // inside frame after translate + padding-ish
    const h = 180;
    const left = 8;
    const top = 12;

    const step = series.length === 1 ? 0 : w / (series.length - 1);

    return series.map((d, i) => {
      const x = left + i * step;
      const y = top + (1 - d.pct) * h;
      return { x, y, label: d.label, value: d.value };
    });
  }, [series]);

  const dLine = useMemo(() => {
    if (points.length === 0) return "";
    return points
      .map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(" ");
  }, [points]);

  const dArea = useMemo(() => {
    if (points.length === 0) return "";
    const bottomY = 12 + 180;
    const last = points[points.length - 1];
    const first = points[0];
    return `${dLine} L ${last.x.toFixed(1)} ${bottomY.toFixed(1)} L ${first.x.toFixed(
      1
    )} ${bottomY.toFixed(1)} Z`;
  }, [points, dLine]);

  return (
    <ChartPlaceholderFrame
      title={title}
      description="An area chart placeholder rendered in SVG."
      height={height}
      legend={[
        { label: "Spend", color: theme.colors.primary },
        { label: "Budget", color: theme.colors.secondary },
      ]}
    >
      {({ uid }) => (
        <>
          <defs>
            <linearGradient id={`${uid}-area`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.colors.primary} stopOpacity="0.35" />
              <stop offset="100%" stopColor={theme.colors.primary} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Area + line */}
          <path d={dArea} fill={`url(#${uid}-area)`} />
          <path
            d={dLine}
            fill="none"
            stroke={`url(#${uid}-stroke)`}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {points.map((p) => (
            <circle
              key={p.label}
              cx={p.x}
              cy={p.y}
              r="4.5"
              fill={theme.colors.surface}
              stroke={theme.colors.primary}
              strokeWidth="2"
            />
          ))}

          {/* Baseline accent */}
          <line
            x1="8"
            y1={12 + 180}
            x2="600"
            y2={12 + 180}
            stroke="rgba(55,65,81,0.14)"
            strokeWidth="2"
            strokeDasharray="6 8"
          />
        </>
      )}
    </ChartPlaceholderFrame>
  );
}
