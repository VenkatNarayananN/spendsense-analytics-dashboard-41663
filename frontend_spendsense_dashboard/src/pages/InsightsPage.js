import React, { useCallback, useMemo, useState } from "react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { ChartSkeleton } from "../components/ui/Skeleton";
import { BarChartPlaceholder, DonutChartPlaceholder } from "../components/charts";
import { insights as baseInsights } from "../mockData";
import { theme } from "../theme";
import { useMockFetch } from "../hooks/useMockFetch";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function uniq(arr) {
  return Array.from(new Set(arr)).sort((a, b) => String(a).localeCompare(String(b)));
}

function transformInsights(insights, timeRange, category) {
  // Keep it mock, but deterministic so controls feel real.
  // timeRange scales values slightly; category filters down to one item.
  const factor = timeRange === "7d" ? 0.78 : timeRange === "30d" ? 1.0 : 1.18;

  let cats = insights.topCategories.map((c) => ({
    ...c,
    value: Math.round(c.value * factor),
    changePct:
      Math.round(
        (c.changePct + (timeRange === "90d" ? 1.6 : timeRange === "7d" ? -0.8 : 0)) * 10
      ) / 10,
  }));

  if (category !== "All") {
    cats = cats.filter((c) => c.label === category);
  }

  const trends = insights.trends.map((t, idx) => ({
    ...t,
    detail:
      timeRange === "7d"
        ? `Last 7 days: ${t.detail}`
        : timeRange === "90d"
          ? `Last 90 days: ${t.detail} (zoomed out)`
          : `Last 30 days: ${t.detail}`,
    // keep key stable-ish
    label: `${t.label}${category !== "All" ? ` • ${category}` : ""}${idx === 0 ? "" : ""}`,
  }));

  return { topCategories: cats, trends };
}

/**
 * PUBLIC_INTERFACE
 */
export function InsightsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...uniq(baseInsights.topCategories.map((c) => c.label))],
    []
  );

  const derived = useMemo(() => transformInsights(baseInsights, timeRange, category), [
    timeRange,
    category,
  ]);

  const fetchState = useMockFetch(
    () => derived,
    [timeRange, category, derived.topCategories.length],
    { delayMs: 520 }
  );

  const reset = useCallback(() => {
    setTimeRange("30d");
    setCategory("All");
  }, []);

  const empty =
    !fetchState.loading && fetchState.data && fetchState.data.topCategories.length === 0;

  return (
    <div className="ss-page">
      <div className="ss-toolbar" aria-label="Insights filters">
        <div className="ss-toolbar__left">
          <div className="ss-toolbar__title">Insights</div>
          <div className="ss-toolbar__subtitle">Adjust time range and focus category</div>
        </div>

        <div className="ss-toolbar__right">
          <div className="ss-seg" role="group" aria-label="Time range">
            {["7d", "30d", "90d"].map((k) => (
              <button
                key={k}
                type="button"
                className={`ss-seg__btn ${timeRange === k ? "active" : ""}`}
                onClick={() => setTimeRange(k)}
              >
                {k.toUpperCase()}
              </button>
            ))}
          </div>

          <select
            className="ss-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Select category"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <ButtonLike onClick={reset} label="Reset" />
        </div>
      </div>

      <div className="ss-grid">
        <Card title="Category Performance" subtitle="Top categories (mock)">
          <div className="ss-section">
            {fetchState.loading ? (
              <ChartSkeleton height={220} />
            ) : empty ? (
              <EmptyState
                icon="◷"
                title="No category data for this selection"
                description="Try selecting a different category or widening the time range."
                primaryActionLabel="Reset"
                onPrimaryAction={reset}
              />
            ) : (
              <BarChartPlaceholder
                title="Category Spend (placeholder)"
                height={220}
                data={(fetchState.data?.topCategories || []).map((c) => ({
                  label: c.label,
                  value: c.value,
                }))}
              />
            )}
          </div>

          {!fetchState.loading && !empty && (
            <div className="ss-cats">
              {(fetchState.data?.topCategories || []).map((c) => (
                <div key={c.label} className="ss-cat">
                  <div className="ss-cat__left">
                    <div className="ss-cat__label">{c.label}</div>
                    <div className="ss-cat__bar">
                      <div
                        className="ss-cat__fill"
                        style={{ width: `${clamp((c.value / 1600) * 100, 4, 100)}%` }}
                      />
                    </div>
                    <div className="ss-cat__meta">{c.value.toLocaleString()} total</div>
                  </div>
                  <div className="ss-cat__right">
                    <Badge tone={c.changePct >= 0 ? "success" : "error"}>
                      {c.changePct >= 0 ? `+${c.changePct}%` : `${c.changePct}%`}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Trend Summaries" subtitle="Actionable patterns (mock)">
          <div className="ss-section">
            {fetchState.loading ? (
              <ChartSkeleton height={220} />
            ) : (
              <DonutChartPlaceholder
                title="Allocation (placeholder)"
                height={220}
                data={[
                  { label: "Core", value: category === "All" ? 46 : 52 },
                  { label: "Flex", value: category === "All" ? 28 : 24 },
                  { label: "Future", value: category === "All" ? 18 : 16 },
                  { label: "Other", value: category === "All" ? 8 : 8 },
                ]}
              />
            )}
          </div>

          {!fetchState.loading && (
            <div className="ss-trends">
              {(fetchState.data?.trends || []).map((t) => (
                <div key={t.label} className="ss-trend">
                  <div className="ss-trend__title">{t.label}</div>
                  <div className="ss-trend__detail">{t.detail}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <style>{`
        .ss-page{ display:flex; flex-direction:column; gap:${theme.spacing.xl}px; }

        .ss-toolbar{
          display:flex;
          justify-content:space-between;
          gap:${theme.spacing.lg}px;
          padding:${theme.spacing.lg}px ${theme.spacing.xl}px;
          border: 1px solid ${theme.colors.border};
          border-radius:${theme.radii.lg}px;
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(10px);
          box-shadow: ${theme.colors.elevation1};
        }

        .ss-toolbar__title{
          font-size: 14px;
          font-weight: 900;
          color:${theme.colors.text};
        }

        .ss-toolbar__subtitle{
          margin-top: 2px;
          font-size: 12px;
          font-weight: 700;
          color: ${theme.colors.mutedText};
        }

        .ss-toolbar__right{
          display:flex;
          align-items:center;
          gap:${theme.spacing.md}px;
          flex-wrap:wrap;
          justify-content:flex-end;
        }

        .ss-seg{
          display:inline-flex;
          border: 1px solid ${theme.colors.border};
          border-radius:${theme.radii.pill}px;
          overflow:hidden;
          background: rgba(244,114,182,0.08);
        }

        .ss-seg__btn{
          appearance:none;
          border:none;
          background: transparent;
          color: ${theme.colors.text};
          font-weight: 900;
          font-size: 12px;
          letter-spacing: 0.2px;
          padding: 10px 12px;
          cursor:pointer;
          transition: background 120ms ease, color 120ms ease;
        }

        .ss-seg__btn:hover{ background: rgba(244,114,182,0.10); }

        .ss-seg__btn.active{
          background: rgba(244,114,182,0.16);
          color:${theme.colors.text};
        }

        .ss-seg__btn:focus-visible{
          outline: 3px solid rgba(244,114,182,0.45);
          outline-offset: 2px;
        }

        .ss-select{
          border-radius:${theme.radii.lg}px;
          border:1px solid ${theme.colors.border};
          background: rgba(255,255,255,0.88);
          padding: 10px 12px;
          font-size: 13px;
          outline:none;
          transition: box-shadow 140ms ease, border-color 140ms ease, background 140ms ease;
          color: ${theme.colors.text};
          font-weight: 900;
          min-width: 190px;
        }

        .ss-select:focus{
          border-color: rgba(244,114,182,0.42);
          box-shadow: 0 0 0 4px rgba(244,114,182,0.18);
          background: rgba(255,255,255,0.98);
        }

        .ss-grid{ display:grid; grid-template-columns: 1.1fr 0.9fr; gap:${theme.spacing.xl}px; }
        .ss-section{ margin-bottom:${theme.spacing.lg}px; }

        .ss-cats{ display:flex; flex-direction:column; gap:${theme.spacing.md}px; }
        .ss-cat{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:${theme.spacing.lg}px;
          padding:${theme.spacing.md}px;
          border-radius:${theme.radii.lg}px;
          border:1px solid ${theme.colors.border};
          background: rgba(255,255,255,0.80);
          box-shadow: ${theme.colors.elevation1};
        }

        .ss-cat__label{ font-size:13px; font-weight:900; color:${theme.colors.text}; }

        .ss-cat__bar{
          margin-top:${theme.spacing.sm}px;
          height: 10px;
          border-radius:${theme.radii.pill}px;
          background: rgba(55,65,81,0.10);
          overflow:hidden;
          width: min(520px, 52vw);
        }

        .ss-cat__fill{
          height:100%;
          border-radius:${theme.radii.pill}px;
          background: ${theme.gradients.accent};
        }

        .ss-cat__meta{
          margin-top:${theme.spacing.sm}px;
          font-size: 12px;
          font-weight: 800;
          color: ${theme.colors.mutedText};
        }

        .ss-trends{ display:flex; flex-direction:column; gap:${theme.spacing.md}px; }

        .ss-trend{
          padding:${theme.spacing.lg}px;
          border-radius:${theme.radii.lg}px;
          border:1px solid ${theme.colors.border};
          background: rgba(255,255,255,0.72);
          box-shadow: ${theme.colors.elevation1};
        }

        .ss-trend__title{ font-size:13px; font-weight:900; color:${theme.colors.text}; }
        .ss-trend__detail{
          margin-top:${theme.spacing.sm}px;
          font-size:12.5px;
          color: ${theme.colors.mutedText};
          font-weight:700;
          line-height:1.55;
        }

        @media (max-width: 1100px){
          .ss-grid{ grid-template-columns: 1fr; }
          .ss-cat__bar{ width: 100%; }
        }
      `}</style>
    </div>
  );
}

/**
 * Small internal “link-like” button to avoid importing Button (keeps layout tidy).
 */
function ButtonLike({ label, onClick }) {
  return (
    <>
      <button className="ss-btnLike" type="button" onClick={onClick}>
        {label}
      </button>
      <style>{`
        .ss-btnLike{
          appearance:none;
          border: 1px solid ${theme.colors.border};
          background: rgba(255,255,255,0.80);
          color: ${theme.colors.text};
          font-weight: 900;
          font-size: 12px;
          padding: 10px 12px;
          border-radius:${theme.radii.lg}px;
          cursor:pointer;
          transition: background 120ms ease, transform 120ms ease, border-color 120ms ease;
        }

        .ss-btnLike:hover{
          background: rgba(244,114,182,0.10);
          transform: translateY(-1px);
          border-color: rgba(244,114,182,0.18);
        }

        .ss-btnLike:focus-visible{
          outline: 3px solid rgba(244,114,182,0.45);
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
}
