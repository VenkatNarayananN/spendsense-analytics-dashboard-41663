import React from "react";

/**
 * PUBLIC_INTERFACE
 */
export function cssVar(name, fallback) {
  /** Returns a CSS var() reference with an optional fallback. */
  if (!fallback) return `var(${name})`;
  return `var(${name}, ${fallback})`;
}

/**
 * Attempts to read a CSS variable from the current document root.
 * This is only used to supply literal color strings to Recharts where required.
 */
function readCssVar(name, fallback = "") {
  if (typeof window === "undefined" || !window?.getComputedStyle) return fallback;
  const v = window.getComputedStyle(document.documentElement).getPropertyValue(name);
  return (v || "").trim() || fallback;
}

/**
 * PUBLIC_INTERFACE
 */
export function useChartCssColors() {
  /** Reads the current theme's chart colors from CSS variables at runtime. */
  return React.useMemo(() => {
    return {
      axis: readCssVar("--chart-axis", "rgba(17,24,39,0.55)"),
      grid: readCssVar("--chart-grid", "rgba(17,24,39,0.10)"),
      tooltipBg: readCssVar("--chart-tooltip-bg", "rgba(255,255,255,0.92)"),
      tooltipBorder: readCssVar("--chart-tooltip-border", "rgba(17,24,39,0.12)"),

      series1: readCssVar("--chart-series-1", "#F472B6"),
      series2: readCssVar("--chart-series-2", "#F59E0B"),
      series3: readCssVar("--chart-series-3", "#10B981"),
      series4: readCssVar("--chart-series-4", "#EF4444"),

      fill1: readCssVar("--chart-fill-1", "rgba(244,114,182,0.18)"),
      fill2: readCssVar("--chart-fill-2", "rgba(245,158,11,0.14)"),
    };
  }, []);
}

/**
 * PUBLIC_INTERFACE
 */
export function makeAriaDescription({ isMock, dataLength }) {
  /** Generates an aria-description string; used to disclose mock usage without visual text. */
  if (!isMock) return undefined;
  return `Mock data is being shown because live data is unavailable. Series length: ${dataLength}.`;
}

/**
 * PUBLIC_INTERFACE
 */
export function ChartTooltip({ active, payload, label, formatter, labelFormatter }) {
  /** A theme-aware tooltip for Recharts using CSS variables. */
  if (!active || !payload || payload.length === 0) return null;

  const labelText = labelFormatter ? labelFormatter(label) : String(label ?? "");
  const rows = payload
    .filter((p) => p && typeof p.value !== "undefined")
    .map((p, idx) => {
      const valueText = formatter ? formatter(p.value, p.name, p, idx) : p.value;
      return {
        key: `${p.dataKey || p.name || idx}`,
        name: p.name || String(p.dataKey || "Value"),
        value: valueText,
        color: p.color || (p.payload && p.payload.color) || "var(--chart-series-1)",
      };
    });

  return (
    <div className="ss-chartTooltip" role="tooltip" aria-label="Chart tooltip">
      <div className="ss-chartTooltip__label">{labelText}</div>
      <div className="ss-chartTooltip__rows">
        {rows.map((r) => (
          <div key={r.key} className="ss-chartTooltip__row">
            <span className="ss-chartTooltip__dot" style={{ background: r.color }} aria-hidden="true" />
            <span className="ss-chartTooltip__name">{r.name}</span>
            <span className="ss-chartTooltip__value">{r.value}</span>
          </div>
        ))}
      </div>

      <style>{`
        .ss-chartTooltip{
          padding: 10px 12px;
          border-radius: var(--radius-lg);
          background: var(--chart-tooltip-bg);
          border: 1px solid var(--chart-tooltip-border);
          box-shadow: var(--shadow-sm);
          color: var(--text-default);
          backdrop-filter: blur(10px);
          min-width: 160px;
        }
        .ss-chartTooltip__label{
          font-size: 12px;
          font-weight: var(--weight-black);
          color: var(--text-strong);
          margin-bottom: 6px;
        }
        .ss-chartTooltip__rows{
          display:flex;
          flex-direction:column;
          gap: 6px;
        }
        .ss-chartTooltip__row{
          display:grid;
          grid-template-columns: 10px 1fr auto;
          align-items:center;
          gap: 8px;
          font-size: 12px;
          font-weight: var(--weight-bold);
        }
        .ss-chartTooltip__dot{
          width: 10px;
          height: 10px;
          border-radius: 999px;
          box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 10%, transparent);
        }
        .ss-chartTooltip__name{
          color: var(--text-muted);
          font-weight: var(--weight-semibold);
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
        .ss-chartTooltip__value{
          color: var(--text-strong);
          font-weight: var(--weight-black);
          white-space:nowrap;
          text-align:right;
        }
      `}</style>
    </div>
  );
}
