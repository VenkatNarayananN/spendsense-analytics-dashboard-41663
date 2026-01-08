import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { AreaChartPlaceholder } from "../components/charts";
import { theme } from "../theme";
import { useAuth } from "../auth/AuthContext";
import { listTransactions } from "../lib/supabaseClient/db";
import { EmptyState } from "../components/ui/EmptyState";
import { CardSkeleton } from "../components/ui/Skeleton";

function formatMoney(v) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(v);
}

function monthPrefix(d = new Date()) {
  // YYYY-MM
  return d.toISOString().slice(0, 7);
}

/**
 * PUBLIC_INTERFACE
 */
export function DashboardPage() {
  const { session, supabaseConfigured } = useAuth();

  const [rows, setRows] = useState([]);
  const [fetchState, setFetchState] = useState({ loading: true, error: null });

  const load = useCallback(async () => {
    if (!supabaseConfigured) {
      setFetchState({ loading: false, error: new Error("Supabase is not configured.") });
      setRows([]);
      return;
    }
    if (!session?.user?.id) return;

    setFetchState({ loading: true, error: null });
    try {
      const data = await listTransactions({ userId: session.user.id });
      setRows(Array.isArray(data) ? data : []);
      setFetchState({ loading: false, error: null });
    } catch (e) {
      setRows([]);
      setFetchState({ loading: false, error: e });
    }
  }, [session?.user?.id, session, supabaseConfigured]);

  useEffect(() => {
    if (!session?.user?.id) return;
    load();
  }, [load, session?.user?.id]);

  const month = useMemo(() => monthPrefix(new Date()), []);
  const monthlySpend = useMemo(() => {
    return rows
      .filter((t) => String(t.date || "").startsWith(month))
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);
  }, [month, rows]);

  const flaggedTransactions = useMemo(() => {
    // Basic heuristic: pending transactions are "flagged"
    return rows.filter((t) => t.status === "Pending").length;
  }, [rows]);

  const recent = useMemo(() => rows.slice(0, 5), [rows]);

  const spendPct = useMemo(() => {
    // Without a budgets table, show a soft budget based on recent activity.
    const softBudget = Math.max(1, monthlySpend * 1.25);
    const pct = (monthlySpend / softBudget) * 100;
    return Math.max(0, Math.min(100, pct));
  }, [monthlySpend]);

  if (fetchState.loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.xl }}>
        <CardSkeleton rows={3} />
        <CardSkeleton rows={3} />
      </div>
    );
  }

  if (fetchState.error) {
    return (
      <div style={{ padding: `${theme.spacing.xl}px`, maxWidth: 1100 }}>
        <EmptyState
          icon="⚠"
          title="Unable to load dashboard"
          description={fetchState.error?.message || "An unexpected error occurred while loading your dashboard."}
          primaryActionLabel="Retry"
          onPrimaryAction={load}
        />
      </div>
    );
  }

  return (
    <>
      <div className="ss-dashboard">
        <div className="ss-mainCol">
          <div className="ss-grid ss-grid--stats">
            <Card
              title="Monthly Spend"
              subtitle="Total spend for the current month"
              action={<Badge tone="info">{Math.round(spendPct)}% of pacing</Badge>}
            >
              <div className="ss-statValue">{formatMoney(monthlySpend)}</div>
              <div className="ss-progress" aria-label="Budget progress">
                <div className="ss-progress__bar" style={{ width: `${spendPct}%` }} />
              </div>
              <div className="ss-statHint">Pacing indicator based on current month activity</div>
            </Card>

            <Card title="Flagged" subtitle="Transactions requiring attention" action={<Badge tone="warning">Review</Badge>}>
              <div className="ss-statValue">{flaggedTransactions}</div>
              <div className="ss-statHint">Pending transactions in this month</div>
              <Button variant="secondary" size="sm">
                Open Alerts
              </Button>
            </Card>

            <Card title="Active Cards" subtitle="Payment methods tracked" action={<Badge tone="success">Live</Badge>}>
              <div className="ss-statValue">—</div>
              <div className="ss-statHint">Connect cards in your data model to populate this.</div>
              <Button variant="secondary" size="sm" disabled aria-disabled="true">
                Manage
              </Button>
            </Card>
          </div>

          <div className="ss-grid ss-grid--two">
            <Card title="Spending Pulse" subtitle="Weekly pattern (placeholder chart)">
              <AreaChartPlaceholder
                title="Spending Pulse (placeholder)"
                height={220}
                data={[
                  { label: "Mon", value: 34 },
                  { label: "Tue", value: 58 },
                  { label: "Wed", value: 42 },
                  { label: "Thu", value: 76 },
                  { label: "Fri", value: 62 },
                  { label: "Sat", value: 88 },
                  { label: "Sun", value: 54 },
                ]}
              />
              <div className="ss-footnote">Chart uses placeholder series; totals reflect live Supabase transactions.</div>
            </Card>

            <Card title="Recent Activity" subtitle="Latest transactions">
              {recent.length === 0 ? (
                <EmptyState
                  icon="⧉"
                  title="No transactions yet"
                  description="Create or seed some transactions to see recent activity."
                  primaryActionLabel="Refresh"
                  onPrimaryAction={load}
                />
              ) : (
                <div className="ss-list">
                  {recent.map((t) => (
                    <div key={t.id} className="ss-listItem">
                      <div className="ss-listItem__left">
                        <div className="ss-listItem__title">{t.merchant}</div>
                        <div className="ss-listItem__sub">
                          {t.date} • {t.category} • {t.method}
                        </div>
                      </div>
                      <div className="ss-listItem__right">
                        <div className="ss-listItem__amount">{formatMoney(t.amount)}</div>
                        <Badge tone={t.status === "Pending" ? "warning" : "success"}>{t.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        <aside className="ss-rightCol" aria-label="Summary">
          <Card title="Summary" subtitle="Overview" action={<span className="ss-link">View</span>}>
            <div className="ss-rows">
              <Row label="Monthly spend" value={formatMoney(monthlySpend)} />
              <Row label="Flagged" value={`${flaggedTransactions}`} />
              <div className="ss-divider" />
              <Row label="Transactions" value={`${rows.length}`} />
            </div>
          </Card>

          <Card title="Quick actions" subtitle="Common tasks">
            <div className="ss-actions">
              <Button variant="primary" size="md" disabled aria-disabled="true">
                New transaction
              </Button>
              <Button variant="secondary" size="md" disabled aria-disabled="true">
                Create alert
              </Button>
            </div>
            <div className="ss-footnote">Create flows are not implemented in this UI template.</div>
          </Card>

          <Card title="Status" subtitle="Connectivity">
            <div className="ss-rows">
              <Row label="Sync" value="Online" badgeTone="success" />
              <Row label="Source" value="Supabase" badgeTone="info" />
            </div>
          </Card>
        </aside>
      </div>

      <style>{`
        .ss-dashboard{
          display:grid;
          grid-template-columns: 1fr ${theme.layout.rightRailWidth}px;
          gap:${theme.spacing.xl}px;
          align-items:start;
        }

        .ss-mainCol{ min-width:0; }
        .ss-rightCol{
          display:flex;
          flex-direction:column;
          gap:${theme.spacing.md}px;
          position: sticky;
          top: 88px;
          align-self:start;
        }

        .ss-grid{ display:grid; gap:${theme.spacing.xl}px; }
        .ss-grid--stats{ grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .ss-grid--two{ grid-template-columns: repeat(2, minmax(0, 1fr)); }

        .ss-statValue{
          font-size: 28px;
          font-weight:${theme.typography.weights.black};
          color:${theme.colors.textStrong};
        }
        .ss-statHint{
          margin-top:${theme.spacing.sm}px;
          font-size:${theme.typography.sizes.sm}px;
          color:${theme.colors.textMuted};
          font-weight:${theme.typography.weights.medium};
        }

        .ss-progress{
          margin-top:${theme.spacing.md}px;
          height: 10px;
          border-radius:${theme.radii.pill}px;
          background: rgba(17,24,39,0.10);
          overflow:hidden;
        }
        .ss-progress__bar{
          height:100%;
          border-radius:${theme.radii.pill}px;
          background: ${theme.gradients.accent};
        }

        .ss-footnote{
          margin-top:${theme.spacing.md}px;
          font-size:${theme.typography.sizes.sm}px;
          color:${theme.colors.textMuted};
          font-weight:${theme.typography.weights.medium};
        }

        .ss-list{ display:flex; flex-direction:column; gap:${theme.spacing.md}px; }
        .ss-listItem{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:${theme.spacing.lg}px;
          padding:${theme.spacing.md}px;
          border-radius:${theme.radii.xl}px;
          border: 1px solid ${theme.colors.borderSubtle};
          background: rgba(255,255,255,0.72);
          box-shadow: ${theme.shadows.sm};
          backdrop-filter: blur(10px);
        }
        .ss-listItem__title{ font-size:${theme.typography.sizes.sm}px; font-weight:${theme.typography.weights.black}; color:${theme.colors.textStrong}; }
        .ss-listItem__sub{ margin-top:2px; font-size:${theme.typography.sizes.xs}px; color:${theme.colors.textMuted}; font-weight:${theme.typography.weights.semibold}; }
        .ss-listItem__right{ display:flex; flex-direction:column; align-items:flex-end; gap:${theme.spacing.sm}px; }
        .ss-listItem__amount{ font-size:${theme.typography.sizes.sm}px; font-weight:${theme.typography.weights.black}; color:${theme.colors.textStrong}; }

        .ss-link{
          font-size:${theme.typography.sizes.sm}px;
          font-weight:${theme.typography.weights.bold};
          color:${theme.colors.primary};
        }

        .ss-rows{ display:flex; flex-direction:column; gap:10px; }
        .ss-divider{ height:1px; background:${theme.colors.borderSubtle}; margin: 2px 0; }

        .ss-actions{
          display:flex;
          flex-direction:column;
          gap:${theme.spacing.sm}px;
        }

        .ss-row{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:${theme.spacing.md}px;
        }
        .ss-row__label{
          font-size:${theme.typography.sizes.sm}px;
          color:${theme.colors.textMuted};
          font-weight:${theme.typography.weights.semibold};
        }
        .ss-row__value{
          display:flex;
          align-items:center;
          gap:${theme.spacing.sm}px;
          font-size:${theme.typography.sizes.sm}px;
          color:${theme.colors.textStrong};
          font-weight:${theme.typography.weights.black};
          text-align:right;
          white-space:nowrap;
        }

        @media (max-width: 1200px){
          .ss-dashboard{
            grid-template-columns: 1fr ${theme.layout.rightRailWidthNarrow}px;
          }
        }

        @media (max-width: 1100px){
          .ss-grid--stats{ grid-template-columns: 1fr; }
          .ss-grid--two{ grid-template-columns: 1fr; }
        }

        @media (max-width: 900px){
          .ss-dashboard{ grid-template-columns: 1fr; }
          .ss-rightCol{ position: static; }
        }
      `}</style>
    </>
  );
}

function Row({ label, value, badgeTone }) {
  return (
    <div className="ss-row">
      <div className="ss-row__label">{label}</div>
      <div className="ss-row__value">{badgeTone ? <Badge tone={badgeTone}>{value}</Badge> : value}</div>
    </div>
  );
}
