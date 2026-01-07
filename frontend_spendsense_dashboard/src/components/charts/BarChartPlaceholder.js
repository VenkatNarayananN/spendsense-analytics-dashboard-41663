import React, { useMemo } from "react";
import { theme } from "../../theme";
import { ChartPlaceholderFrame, normalizeChartData } from "./ChartPlaceholderBase";

/**
 * PUBLIC_INTERFACE
 */
export function BarChartPlaceholder({
  title = "Bar Chart",
  data = [
    { label: "Groceries", value: 62 },
    { label: "Dining", value: 38 },
    { label: "Travel", value: 52 },
    { label: "Software", value: 26 },
    { label: "Utilities", value: 41 },
  ],
  height = 220,
}) {
  const series = useMemo(() => normalizeChartData(data), [data]);

  const bars = useMemo(() => {
    const w = 592;
    const h = 176;
    const left = 8;
    const top = 12;
    const baselineY = top + h;
    const count = Math.max(series.length, 1);
    const slot = w / count;
    const bw = Math.min(44, Math.max(18, slot * 0.55));

    return series.map((d, i) => {
      const x = left + i * slot + (slot - bw) / 2;
      const barH = Math.max(8, d.pct * h);
      const y = baselineY - barH;
      const color = i % 2 === 0 ? theme.colors.primary : theme.colors.secondary;
      return { x, y, w: bw, h: barH, label: d.label, value: d.value, color };
    });
  }, [series]);

  return (
    <ChartPlaceholderFrame
      title={title}
      description="A bar chart placeholder rendered in SVG."
      height={height}
      legend={[
        { label: "Category spend", color: theme.colors.primary },
        { label: "Comparison", color: theme.colors.secondary },
      ]}
    >
      {() => (
        <>
          {/* Bars */}
          {bars.map((b) => (
            <g key={b.label}>
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                rx="10"
                fill={b.color}
                opacity="0.85"
              />
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                rx="10"
                fill="transparent"
                stroke="rgba(55,65,81,0.10)"
              />
            </g>
          ))}

          {/* Baseline */}
          <line
            x1="8"
            y1={12 + 176}
            x2="600"
            y2={12 + 176}
            stroke="rgba(55,65,81,0.14)"
            strokeWidth="2"
          />
        </>
      )}
    </ChartPlaceholderFrame>
  );
}
