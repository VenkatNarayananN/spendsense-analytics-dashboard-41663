import React, { useMemo } from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { EmptyState } from "../ui/EmptyState";
import { ChartTooltip, makeAriaDescription, useChartCssColors } from "./chartTheme";

function sum(values) {
  return values.reduce((acc, v) => acc + (typeof v === "number" ? v : 0), 0);
}

/**
 * PUBLIC_INTERFACE
 */
export function DonutChartPro({
  ariaLabel = "Distribution donut chart",
  title = "Distribution",
  height = 220,
  data = [],
  nameKey = "label",
  valueKey = "value",
  isMock = false,
  valueFormatter,
  centerLabel,
}) {
  /** Responsive donut chart using Recharts with CSS-variable theming and accessibility hooks. */
  const colors = useChartCssColors();

  const safeData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data
      .map((d) => ({
        ...d,
        [nameKey]: d?.[nameKey] ?? "",
        [valueKey]: typeof d?.[valueKey] === "number" ? d[valueKey] : Number(d?.[valueKey] ?? 0),
      }))
      .filter((d) => String(d?.[nameKey] ?? "").length > 0);
  }, [data, nameKey, valueKey]);

  const total = useMemo(() => sum(safeData.map((d) => d[valueKey])) || 0, [safeData, valueKey]);

  if (safeData.length === 0 || total <= 0) {
    return (
      <div style={{ height }}>
        <EmptyState
          icon="◔"
          title="No distribution yet"
          description="Add transactions to see allocation by category."
        />
      </div>
    );
  }

  const top = safeData
    .slice()
    .sort((a, b) => Number(b[valueKey] || 0) - Number(a[valueKey] || 0))[0];

  const topPct = Math.round((Number(top?.[valueKey] || 0) / Math.max(1, total)) * 100);
  const ariaDescription = makeAriaDescription({ isMock, dataLength: safeData.length });

  const centerMain = centerLabel || `${topPct}%`;
  const centerSub = centerLabel ? "allocation" : "largest share";

  const palette = [colors.series1, colors.series2, colors.series3, colors.series4];

  return (
    <div className="ss-chartPro" style={{ height }} role="img" aria-label={ariaLabel} aria-description={ariaDescription}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            content={
              <ChartTooltip
                labelFormatter={(l) => String(l)}
                formatter={(v) => (valueFormatter ? valueFormatter(v) : v)}
              />
            }
          />
          <Pie
            data={safeData}
            dataKey={valueKey}
            nameKey={nameKey}
            innerRadius="62%"
            outerRadius="86%"
            paddingAngle={3}
            cornerRadius={10}
            stroke="var(--bg-card)"
            strokeWidth={2}
          >
            {safeData.map((_, idx) => (
              <Cell key={`slice-${idx}`} fill={palette[idx % palette.length]} opacity={0.90} />
            ))}
          </Pie>

          {/* Center label */}
          <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" className="ss-donutCenterMain">
            {centerMain}
          </text>
          <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="ss-donutCenterSub">
            {centerSub}
          </text>
        </PieChart>
      </ResponsiveContainer>

      <style>{`
        .ss-chartPro{
          width:100%;
          border-radius: var(--radius-lg);
        }
        .ss-donutCenterMain{
          font-size: 16px;
          font-weight: var(--weight-black);
          fill: var(--text-strong);
        }
        .ss-donutCenterSub{
          font-size: 12px;
          font-weight: var(--weight-bold);
          fill: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
