import React from "react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { alerts } from "../mockData";
import { theme } from "../theme";

function toneForSeverity(sev) {
  if (sev === "High") return "error";
  if (sev === "Medium") return "warning";
  return "info";
}

/**
 * PUBLIC_INTERFACE
 */
export function AlertsPage() {
  return (
    <div className="ss-page">
      <Card
        title="Alerts"
        subtitle="Anomaly and policy notifications (mock)"
        action={<Button variant="ghost" size="sm">Mark all as read</Button>}
      >
        <div className="ss-alerts">
          {alerts.map((a) => (
            <div key={a.id} className="ss-alert">
              <div className="ss-alert__left">
                <div className="ss-alert__title">{a.title}</div>
                <div className="ss-alert__detail">{a.detail}</div>
              </div>
              <div className="ss-alert__right">
                <Badge tone={toneForSeverity(a.severity)}>{a.severity}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <style>{`
        .ss-page{ display:flex; flex-direction:column; gap:${theme.spacing.xl}px; }
        .ss-alerts{ display:flex; flex-direction:column; gap:${theme.spacing.md}px; }
        .ss-alert{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:${theme.spacing.lg}px;
          padding:${theme.spacing.lg}px;
          border-radius:${theme.radii.lg}px;
          border:1px solid ${theme.colors.border};
          background: rgba(255,255,255,0.70);
        }
        .ss-alert__title{ font-size:13px; font-weight:900; color:${theme.colors.text}; }
        .ss-alert__detail{ margin-top:${theme.spacing.sm}px; font-size:12px; color:${theme.colors.mutedText}; font-weight:700; line-height:1.55; }
        .ss-alert__right{ display:flex; align-items:center; }
      `}</style>
    </div>
  );
}
