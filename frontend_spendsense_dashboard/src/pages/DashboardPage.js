import React, { useMemo } from "react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
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
    <div className="ss-page">
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

        <Card title="Flagged" subtitle="Transactions requiring attention" action={<Badge tone="warning">Review</Badge>}>
          <div className="ss-statValue">{dashboardSummary.flaggedTransactions}</div>
          <div className="ss-statHint">High-signal anomalies detected</div>
          <Button variant="secondary" size="sm">Open Alerts</Button>
        </Card>

        <Card title="Active Cards" subtitle="Payment methods tracked" action={<Badge tone="success">Healthy</Badge>}>
          <div className="ss-statValue">{dashboardSummary.activeCards}</div>
          <div className="ss-statHint">All cards syncing normally</div>
          <Button variant="ghost" size="sm">Manage</Button>
        </Card>
      </div>

      <div className="ss-grid ss-grid--two">
        <Card title="Spending Pulse" subtitle="Placeholder chart (weekly pattern)">
          <div className="ss-spark" role="img" aria-label="Sparkline chart">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className="ss-spark__bar"
                style={{
                  height: `${22 + ((i * 17) % 58)}%`,
                  background:
                    i % 3 === 0
                      ? theme.colors.primary
                      : i % 3 === 1
                        ? theme.colors.secondary
                        : "rgba(55,65,81,0.22)",
                }}
              />
            ))}
          </div>
          <div className="ss-footnote">Tip: connect real data later via Supabase or backend API.</div>
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

      <style>{`
        .ss-page{ display:flex; flex-direction:column; gap:${theme.spacing.xl}px; }
        .ss-grid{ display:grid; gap:${theme.spacing.xl}px; }
        .ss-grid--stats{ grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .ss-grid--two{ grid-template-columns: repeat(2, minmax(0, 1fr)); }

        .ss-statValue{
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 0.2px;
          color:${theme.colors.text};
        }
        .ss-statHint{ margin-top:${theme.spacing.sm}px; font-size:12px; color:${theme.colors.mutedText}; font-weight:700; }

        .ss-progress{
          margin-top:${theme.spacing.md}px;
          height: 10px;
          border-radius:${theme.radii.pill}px;
          background: rgba(55,65,81,0.10);
          overflow:hidden;
        }
        .ss-progress__bar{
          height:100%;
          border-radius:${theme.radii.pill}px;
          background: linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary});
        }

        .ss-spark{
          height: 170px;
          display:flex;
          align-items:flex-end;
          gap: 6px;
          padding: 10px;
          border-radius:${theme.radii.lg}px;
          border: 1px dashed rgba(55,65,81,0.20);
          background: rgba(253,242,248,0.55);
        }
        .ss-spark__bar{
          flex:1;
          border-radius:${theme.radii.pill}px;
          opacity: 0.9;
        }
        .ss-footnote{
          margin-top:${theme.spacing.md}px;
          font-size:12px;
          color:${theme.colors.mutedText};
          font-weight:700;
        }

        .ss-list{ display:flex; flex-direction:column; gap:${theme.spacing.md}px; }
        .ss-listItem{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:${theme.spacing.lg}px;
          padding:${theme.spacing.md}px;
          border-radius:${theme.radii.lg}px;
          border: 1px solid ${theme.colors.border};
          background: rgba(255,255,255,0.70);
        }
        .ss-listItem__title{ font-size:13px; font-weight:900; color:${theme.colors.text}; }
        .ss-listItem__sub{ margin-top:2px; font-size:12px; color:${theme.colors.mutedText}; font-weight:700; }
        .ss-listItem__right{ display:flex; flex-direction:column; align-items:flex-end; gap:${theme.spacing.sm}px; }
        .ss-listItem__amount{ font-size:13px; font-weight:900; color:${theme.colors.text}; }

        @media (max-width: 1100px){
          .ss-grid--stats{ grid-template-columns: 1fr; }
          .ss-grid--two{ grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
