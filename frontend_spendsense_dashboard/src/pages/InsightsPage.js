import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { ChartSkeleton } from "../components/ui/Skeleton";
import { BarChartPro, DonutChartPro } from "../components/charts";
import { theme } from "../theme";
import { Button } from "../components/ui/Button";
import { useAuth } from "../auth/AuthContext";
import { listInsightsSourceTransactions } from "../lib/supabaseClient/db";
import { useDemo } from "../demo/DemoContext";
import { getDemoTransactions } from "../demo/demoData";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function uniq(arr) {
  return Array.from(new Set(arr)).sort((a, b) => String(a).localeCompare(String(b)));
}

function isoDateDaysAgo(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function dateRangeForTimeRange(timeRange) {
  if (timeRange === "7d") return { from: isoDateDaysAgo(7), to: isoDateDaysAgo(0) };
  if (timeRange === "90d") return { from: isoDateDaysAgo(90), to: isoDateDaysAgo(0) };
  return { from: isoDateDaysAgo(30), to: isoDateDaysAgo(0) };
}

function sumByCategory(rows) {
  const m = new Map();
  for (const r of rows) {
    const cat = r.category || "Uncategorized";
    const amt = Number(r.amount || 0);
    m.set(cat, (m.get(cat) || 0) + amt);
  }
  return Array.from(m.entries())
    .map(([label, value]) => ({ label, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value);
}

function buildTrends(rows) {
  // Keep trends simple and explainable without SQL/RPC:
  // - Most frequent merchant
  // - Pending count
  // - Highest single transaction
  if (!rows.length) return [];

  const merchantCounts = new Map();
  let pending = 0;
  let maxTx = null;

  for (const r of rows) {
    const m = r.merchant || "Unknown";
    merchantCounts.set(m, (merchantCounts.get(m) || 0) + 1);
    if (r.status === "Pending") pending += 1;

    const amt = Number(r.amount || 0);
    if (!maxTx || amt > Number(maxTx.amount || 0)) maxTx = r;
  }

  const topMerchant = Array.from(merchantCounts.entries()).sort((a, b) => b[1] - a[1])[0];

  return [
    {
      label: "Top merchant",
      detail: topMerchant ? `${topMerchant[0]} (${topMerchant[1]} transactions in range)` : "Not enough data yet.",
    },
    {
      label: "Pending transactions",
      detail: pending ? `${pending} transaction(s) are still pending.` : "No pending transactions in this range.",
    },
    {
      label: "Largest transaction",
      detail: maxTx
        ? `${maxTx.merchant || "Unknown"} • $${Number(maxTx.amount || 0).toFixed(2)}`
        : "Not enough data yet.",
    },
  ];
}

/**
 * PUBLIC_INTERFACE
 */
export function InsightsPage() {
  const { session, supabaseConfigured } = useAuth();
  const { demoMode } = useDemo();

  const [timeRange, setTimeRange] = useState("30d");
  const [category, setCategory] = useState("All");

  const [rows, setRows] = useState([]);
  const [fetchState, setFetchState] = useState({ loading: true, error: null });

  const load = useCallback(async () => {
    if (demoMode) {
      // Demo mode: compute client-side from demo transactions.
      const demoRows = getDemoTransactions().map((t) => ({
        id: t.id,
        user_id: "demo_user",
        date: t.date,
        category: t.category,
        amount: t.amount,
        merchant: t.merchant,
        status: t.status,
        created_at: new Date().toISOString(),
      }));

      const { from, to } = dateRangeForTimeRange(timeRange);
      const filtered = demoRows.filter((r) => {
        if (from && String(r.date || "") < from) return false;
        if (to && String(r.date || "") > to) return false;
        return true;
      });

      setRows(filtered);
      setFetchState({ loading: false, error: null });
      return;
    }

    if (!supabaseConfigured) {
      setFetchState({ loading: false, error: new Error("Supabase is not configured.") });
      setRows([]);
      return;
    }
    if (!session?.user?.id) return;

    const { from, to } = dateRangeForTimeRange(timeRange);

    setFetchState({ loading: true, error: null });
    try {
      const data = await listInsightsSourceTransactions({
        userId: session.user.id,
        fromDate: from,
        toDate: to,
      });
      setRows(Array.isArray(data) ? data : []);
      setFetchState({ loading: false, error: null });
    } catch (e) {
      setRows([]);
      setFetchState({ loading: false, error: e });
    }
  }, [demoMode, session?.user?.id, session, supabaseConfigured, timeRange]);

  useEffect(() => {
    load();
  }, [load]);

  const categories = useMemo(() => {
    const base = uniq(rows.map((r) => r.category).filter(Boolean));
    return ["All", ...base];
  }, [rows]);

  const topCategories = useMemo(() => {
    const base = sumByCategory(rows);
    if (category === "All") return base.slice(0, 6);
    return base.filter((c) => c.label === category);
  }, [category, rows]);

  const trends = useMemo(() => buildTrends(rows), [rows]);

  const reset = useCallback(() => {
    setTimeRange("30d");
    setCategory("All");
  }, []);

  const empty = !fetchState.loading && !fetchState.error && topCategories.length === 0;

  return (
    <div className="ss-page">
      <div className="ss-toolbar" aria-label="Insights filters">
        <div className="ss-toolbar__left">
          <div className="ss-toolbar__title">Insights</div>
          <div className="ss-toolbar__subtitle">Real-time summaries from your transactions</div>
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

          <Button variant="secondary" size="sm" onClick={reset} aria-label="Reset insights filters">
            Reset
          </Button>

          <Button variant="ghost" size="sm" onClick={load} aria-label="Refresh insights">
            Refresh
          </Button>

          {demoMode ? <Badge tone="warning">Demo</Badge> : <Badge tone="success">Live</Badge>}
        </div>
      </div>

      <div className="ss-grid">
        <Card title="Category Performance" subtitle="Top categories">
          <div className="ss-section">
            {fetchState.loading && !demoMode ? (
              <ChartSkeleton height={220} />
            ) : fetchState.error ? (
              <EmptyState
                icon="⚠"
                title="Unable to load insights"
                description={fetchState.error?.message || "An unexpected error occurred while loading insights."}
                primaryActionLabel="Retry"
                onPrimaryAction={load}
              />
            ) : empty ? (
              <EmptyState
                icon="◷"
                title="No category data for this selection"
                description="Try widening the time range or generating some transactions."
                primaryActionLabel="Reset"
                onPrimaryAction={reset}
              />
            ) : (
              <BarChartPro
                ariaLabel="Category performance bar chart"
                title="Category spend"
                height={220}
                data={topCategories.map((c) => ({ label: c.label, value: c.value }))}
                isMock={rows.length === 0}
                valueFormatter={(v) => `$${Number(v || 0).toLocaleString()}`}
              />
            )}
          </div>

          {!fetchState.loading && !fetchState.error && !empty && (
            <div className="ss-cats">
              {topCategories.map((c) => (
                <div key={c.label} className="ss-cat">
                  <div className="ss-cat__left">
                    <div className="ss-cat__label">{c.label}</div>
                    <div className="ss-cat__bar">
                      <div
                        className="ss-cat__fill"
                        style={{ width: `${clamp((c.value / Math.max(1, topCategories[0]?.value || 1)) * 100, 4, 100)}%` }}
                      />
                    </div>
                    <div className="ss-cat__meta">{c.value.toLocaleString()} total</div>
                  </div>
                  <div className="ss-cat__right">
                    <Badge tone="info">Range {timeRange.toUpperCase()}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Trend Summaries" subtitle="Actionable patterns">
          <div className="ss-section">
            {fetchState.loading ? (
              <ChartSkeleton height={220} />
            ) : fetchState.error ? (
              <ChartSkeleton height={220} />
            ) : (
              <DonutChartPro
                ariaLabel="Category allocation donut chart"
                title="Allocation"
                height={220}
                data={topCategories.slice(0, 4).map((c) => ({ label: c.label, value: c.value }))}
                isMock={rows.length === 0}
                valueFormatter={(v) => `$${Number(v || 0).toLocaleString()}`}
              />
            )}
          </div>

          {!fetchState.loading && !fetchState.error && (
            <div className="ss-trends">
              {trends.map((t) => (
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
          border-radius:${theme.radii.xl}px;
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(10px);
          box-shadow: ${theme.shadows.sm};
        }

        .ss-toolbar__title{
          font-size: 14px;
          font-weight: ${theme.typography.weights.black};
          color:${theme.colors.textStrong};
        }

        .ss-toolbar__subtitle{
          margin-top: 2px;
          font-size: 12px;
          font-weight: ${theme.typography.weights.semibold};
          color: ${theme.colors.textMuted};
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
          background: ${theme.gradients.accentSoft};
        }

        .ss-seg__btn{
          appearance:none;
          border:none;
          background: transparent;
          color: ${theme.colors.textStrong};
          font-weight: ${theme.typography.weights.black};
          font-size: 12px;
          letter-spacing: 0.2px;
          padding: 10px 12px;
          cursor:pointer;
          transition: background 120ms ease, color 120ms ease;
        }

        .ss-seg__btn:hover{ background: color-mix(in srgb, var(--brand-primary) 12%, transparent); }

        .ss-seg__btn.active{
          background: rgba(255,255,255,0.72);
          color:${theme.colors.textStrong};
        }

        .ss-seg__btn:focus-visible{
          outline: 3px solid ${theme.effects.focusRing};
          outline-offset: 2px;
        }

        .ss-select{
          border-radius:${theme.radii.xl}px;
          border:1px solid ${theme.colors.border};
          background: rgba(255,255,255,0.86);
          padding: 10px 12px;
          font-size: 13px;
          outline:none;
          transition: box-shadow 140ms ease, border-color 140ms ease, background 140ms ease;
          color: ${theme.colors.textStrong};
          font-weight: ${theme.typography.weights.black};
          min-width: 190px;
          backdrop-filter: blur(10px);
        }

        .ss-select:focus{
          border-color: color-mix(in srgb, var(--brand-primary) 42%, transparent);
          box-shadow: 0 0 0 4px var(--focus-soft);
          background: color-mix(in srgb, var(--bg-card) 96%, transparent);
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
          border-radius:${theme.radii.xl}px;
          border:1px solid ${theme.colors.border};
          background: rgba(255,255,255,0.78);
          box-shadow: ${theme.shadows.sm};
          backdrop-filter: blur(10px);
        }

        .ss-cat__label{ font-size:13px; font-weight:${theme.typography.weights.black}; color:${theme.colors.textStrong}; }

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
          font-weight: ${theme.typography.weights.bold};
          color: ${theme.colors.textMuted};
        }

        .ss-trends{ display:flex; flex-direction:column; gap:${theme.spacing.md}px; }

        .ss-trend{
          padding:${theme.spacing.lg}px;
          border-radius:${theme.radii.xl}px;
          border:1px solid ${theme.colors.border};
          background: rgba(255,255,255,0.72);
          box-shadow: ${theme.shadows.sm};
          backdrop-filter: blur(10px);
        }

        .ss-trend__title{ font-size:13px; font-weight:${theme.typography.weights.black}; color:${theme.colors.textStrong}; }
        .ss-trend__detail{
          margin-top:${theme.spacing.sm}px;
          font-size:12.5px;
          color: ${theme.colors.textMuted};
          font-weight:${theme.typography.weights.semibold};
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
