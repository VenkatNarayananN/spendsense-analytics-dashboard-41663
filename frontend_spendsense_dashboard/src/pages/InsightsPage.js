import React from "react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { BarChartPlaceholder, DonutChartPlaceholder } from "../components/charts";
import { insights } from "../mockData";
import { theme } from "../theme";

/**
 * PUBLIC_INTERFACE
 */
export function InsightsPage() {
  return (
    <div className="ss-page">
      <div className="ss-grid">
        <Card title="Category Performance" subtitle="Top categories (mock)">
          <div className="ss-section">
            <BarChartPlaceholder
              title="Category Spend (placeholder)"
              height={220}
              data={insights.topCategories.map((c) => ({ label: c.label, value: c.value }))}
            />
          </div>

          <div className="ss-cats">
            {insights.topCategories.map((c) => (
              <div key={c.label} className="ss-cat">
                <div className="ss-cat__left">
                  <div className="ss-cat__label">{c.label}</div>
                  <div className="ss-cat__bar">
                    <div
                      className="ss-cat__fill"
                      style={{ width: `${Math.min(100, (c.value / 1400) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="ss-cat__right">
                  <Badge tone={c.changePct >= 0 ? "success" : "error"}>
                    {c.changePct >= 0 ? `+${c.changePct}%` : `${c.changePct}%`}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Trend Summaries" subtitle="Actionable patterns (mock)">
          <div className="ss-section">
            <DonutChartPlaceholder
              title="Allocation (placeholder)"
              height={220}
              data={[
                { label: "Groceries", value: 44 },
                { label: "Dining", value: 26 },
                { label: "Travel", value: 18 },
                { label: "Other", value: 12 },
              ]}
            />
          </div>

          <div className="ss-trends">
            {insights.trends.map((t) => (
              <div key={t.label} className="ss-trend">
                <div className="ss-trend__title">{t.label}</div>
                <div className="ss-trend__detail">{t.detail}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <style>{`
        .ss-page{ display:flex; flex-direction:column; gap:${theme.spacing.xl}px; }
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
          background: rgba(255,255,255,0.70);
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
          background: linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary});
        }

        .ss-trends{ display:flex; flex-direction:column; gap:${theme.spacing.md}px; }
        .ss-trend{
          padding:${theme.spacing.lg}px;
          border-radius:${theme.radii.lg}px;
          border:1px solid ${theme.colors.border};
          background: rgba(253,242,248,0.55);
        }
        .ss-trend__title{ font-size:13px; font-weight:900; color:${theme.colors.text}; }
        .ss-trend__detail{ margin-top:${theme.spacing.sm}px; font-size:12px; color:${theme.colors.mutedText}; font-weight:700; line-height:1.55; }

        @media (max-width: 1100px){
          .ss-grid{ grid-template-columns: 1fr; }
          .ss-cat__bar{ width: 100%; }
        }
      `}</style>
    </div>
  );
}
