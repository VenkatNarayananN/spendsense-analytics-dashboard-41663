import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { EmptyState } from "../ui/EmptyState";
import { ChartTooltip, makeAriaDescription, useChartCssColors } from "./chartTheme";

/**
 * PUBLIC_INTERFACE
 */
export function BarChartPro({
  ariaLabel = "Category bar chart",
  title = "Categories",
  height = 220,
  data = [],
  xKey = "label",
  yKey = "value",
  isMock = false,
  valueFormatter,
}) {
  /** Responsive bar chart using Recharts with CSS-variable theming and accessibility hooks. */
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
          icon="◻"
          title="No data to chart"
          description="Add transactions to see category breakdown."
        />
      </div>
    );
  }

  const ariaDescription = makeAriaDescription({ isMock, dataLength: safeData.length });

  return (
    <div className="ss-chartPro" style={{ height }} role="img" aria-label={ariaLabel} aria-description={ariaDescription}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={safeData} margin={{ top: 8, right: 12, bottom: 6, left: 0 }}>
          <CartesianGrid stroke={colors.grid} strokeDasharray="4 8" />
          <XAxis
            dataKey={xKey}
            tick={{ fill: colors.axis, fontSize: 12, fontWeight: 800 }}
            axisLine={{ stroke: colors.grid }}
            tickLine={{ stroke: colors.grid }}
            interval={0}
            height={42}
            tickFormatter={(v) => String(v).slice(0, 10)}
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
          <Bar dataKey={yKey} name={title} radius={[12, 12, 12, 12]}>
            {safeData.map((_, idx) => {
              const palette = [colors.series1, colors.series2, colors.series3, colors.series4];
              return <Cell key={`cell-${idx}`} fill={palette[idx % palette.length]} opacity={0.86} />;
            })}
          </Bar>
        </BarChart>
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
