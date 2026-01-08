import React, { useMemo } from "react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { AreaChartPlaceholder } from "../components/charts";
import { dashboardSummary, transactions } from "../mockData";
import { theme } from "../theme";

function formatMoney(v) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(v);
}

/**
 * PUBLIC_INTERFACE
 */
export function DashboardPage() {
  const spendPct = useMemo(() => {
    const pct = (dashboardSummary.monthlySpend / dashboardSummary.monthlyBudget) * 100;
    return Math.max(0, Math.min(100, pct));
  }, []);

  const recent = transactions.slice(0, 5);

  return (
    <>
      <div className="ss-dashboard">
        <div className="ss-mainCol">
          <div className="ss-grid ss-grid--stats">
            <Card
              title="Monthly Spend"
              subtitle="Total spend for the current month"
              action={<Badge tone="info">{Math.round(spendPct)}% of budget</Badge>}
            >
              <div className="ss-statValue">{formatMoney(dashboardSummary.monthlySpend)}</div>
              <div className="ss-progress" aria-label="Budget progress">
                <div className="ss-progress__bar" style={{ width: `${spendPct}%` }} />
              </div>
              <div className="ss-statHint">
                Budget: <strong>{formatMoney(dashboardSummary.monthlyBudget)}</strong>
              </div>
            </Card>

            <Card
              title="Flagged"
              subtitle="Transactions requiring attention"
              action={<Badge tone="warning">Review</Badge>}
            >
              <div className="ss-statValue">{dashboardSummary.flaggedTransactions}</div>
              <div className="ss-statHint">High-signal anomalies detected</div>
              <Button variant="secondary" size="sm">
                Open Alerts
              </Button>
            </Card>

            <Card
              title="Active Cards"
              subtitle="Payment methods tracked"
              action={<Badge tone="success">Healthy</Badge>}
            >
              <div className="ss-statValue">{dashboardSummary.activeCards}</div>
              <div className="ss-statHint">All cards syncing normally</div>
              <Button variant="secondary" size="sm">
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
              <div className="ss-footnote">
                Tip: connect real data later via Supabase or backend API.
              </div>
            </Card>

            <Card title="Recent Activity" subtitle="Latest transactions (mock)">
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
            </Card>
          </div>
        </div>

        <aside className="ss-rightCol" aria-label="Summary">
          <Card title="Summary" subtitle="Overview (mock)" action={<span className="ss-link">View</span>}>
            <div className="ss-rows">
              <Row label="Monthly spend" value={formatMoney(dashboardSummary.monthlySpend)} />
              <Row label="Budget" value={formatMoney(dashboardSummary.monthlyBudget)} />
              <div className="ss-divider" />
              <Row label="Flagged" value={`${dashboardSummary.flaggedTransactions}`} />
              <Row label="Active cards" value={`${dashboardSummary.activeCards}`} />
            </div>
          </Card>

          <Card title="Quick actions" subtitle="Common tasks">
            <div className="ss-actions">
              <Button variant="primary" size="md">New transaction</Button>
              <Button variant="secondary" size="md">Create alert</Button>
            </div>
          </Card>

          <Card title="Status" subtitle="Connectivity">
            <div className="ss-rows">
              <Row label="Sync" value="Online" badgeTone="success" />
              <Row label="Last refresh" value="2m ago" />
              <Row label="Risk" value="Low" badgeTone="info" />
            </div>
          </Card>
        </aside>
      </div>

      {/* Floating Action Button (FAB) */}
      <button className="ss-fab" type="button" aria-label="Create (mock)">
        +
      </button>

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

        .ss-fab{
          position: fixed;
          right: 16px;
          bottom: 16px;
          z-index: 50;

          width: 42px;
          height: 42px;
          border-radius: 999px;
          border: none;

          background: ${theme.gradients.accent};
          color: #fff;
          font-size: 22px;
          line-height: 1;
          box-shadow: ${theme.shadows.md}, ${theme.shadows.glowPink};
          cursor: pointer;
          transition: transform 140ms ease, filter 140ms ease;
        }

        .ss-fab:hover{
          transform: translateY(-1px);
          filter: saturate(1.05);
        }

        .ss-fab:focus-visible{
          outline: 3px solid ${theme.effects.focusRing};
          outline-offset: 2px;
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
      <div className="ss-row__value">
        {badgeTone ? <Badge tone={badgeTone}>{value}</Badge> : value}
      </div>
    </div>
  );
}
