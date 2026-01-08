import React, { useMemo, useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EmptyState } from "../ui/EmptyState";
import { ChartTooltip, makeAriaDescription, useChartCssColors } from "./chartTheme";

/**
 * PUBLIC_INTERFACE
 */
export function AreaChartPro({
  ariaLabel = "Trend area chart",
  title = "Trend",
  height = 220,
  data = [],
  xKey = "label",
  yKey = "value",
  isMock = false,
  valueFormatter,
}) {
  /** Responsive area chart using Recharts with CSS-variable theming and accessibility hooks. */
  const uid = useId();
  const colors = useChartCssColors();

  const safeData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data
      .map((d) => ({
        ...d,
        [xKey]: d?.[xKey] ?? "",
        [yKey]: typeof d?.[yKey] === "number" ? d[yKey] : Number(d?.[yKey] ?? 0),
      }))
      .filter((d) => String(d?.[xKey] ?? "").length > 0);
  }, [data, xKey, yKey]);

  if (safeData.length === 0) {
    return (
      <div style={{ height }}>
        <EmptyState
          icon="◌"
          title="No data to chart"
          description="Add transactions or widen the time range to see trends."
        />
      </div>
    );
  }

  const ariaDescription = makeAriaDescription({ isMock, dataLength: safeData.length });

  return (
    <div
      className="ss-chartPro"
      style={{ height }}
      role="img"
      aria-label={ariaLabel}
      aria-description={ariaDescription}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={safeData} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.series1} stopOpacity={0.30} />
              <stop offset="100%" stopColor={colors.series1} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke={colors.grid} strokeDasharray="4 8" />
          <XAxis
            dataKey={xKey}
            tick={{ fill: colors.axis, fontSize: 12, fontWeight: 800 }}
            axisLine={{ stroke: colors.grid }}
            tickLine={{ stroke: colors.grid }}
            minTickGap={14}
          />
          <YAxis
            tick={{ fill: colors.axis, fontSize: 12, fontWeight: 800 }}
            axisLine={{ stroke: colors.grid }}
            tickLine={{ stroke: colors.grid }}
            width={44}
            tickFormatter={(v) => (valueFormatter ? valueFormatter(v) : v)}
          />
          <Tooltip
            content={
              <ChartTooltip
                labelFormatter={(l) => String(l)}
                formatter={(v) => (valueFormatter ? valueFormatter(v) : v)}
              />
            }
          />
          <Area
            type="monotone"
            dataKey={yKey}
            name={title}
            stroke={colors.series1}
            strokeWidth={3}
            fill={`url(#${uid}-fill)`}
            dot={false}
            activeDot={{ r: 5, stroke: colors.series1, strokeWidth: 2, fill: "var(--bg-card)" }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <style>{`
        .ss-chartPro{
          width:100%;
          border-radius: var(--radius-lg);
        }
      `}</style>
    </div>
  );
}
