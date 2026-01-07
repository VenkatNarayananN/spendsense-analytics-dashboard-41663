import React, { useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { theme } from "../theme";

/**
 * PUBLIC_INTERFACE
 */
export function SettingsPage() {
  const [emailReports, setEmailReports] = useState(true);
  const [anomalyPush, setAnomalyPush] = useState(false);
  const [profile, setProfile] = useState({ name: "Avery Chen", email: "avery@example.com" });

  return (
    <div className="ss-page">
      <div className="ss-grid">
        <Card title="Preferences" subtitle="Notifications and privacy controls">
          <div className="ss-setting">
            <div className="ss-setting__left">
              <div className="ss-setting__title">Weekly email report</div>
              <div className="ss-setting__desc">Get a calm summary every Monday morning.</div>
            </div>
            <label className="ss-switch">
              <input
                type="checkbox"
                checked={emailReports}
                onChange={(e) => setEmailReports(e.target.checked)}
                aria-label="Toggle weekly email report"
              />
              <span className="ss-switch__slider" />
            </label>
          </div>

          <div className="ss-setting">
            <div className="ss-setting__left">
              <div className="ss-setting__title">Push notifications for anomalies</div>
              <div className="ss-setting__desc">Immediate alerts for high severity events.</div>
            </div>
            <label className="ss-switch">
              <input
                type="checkbox"
                checked={anomalyPush}
                onChange={(e) => setAnomalyPush(e.target.checked)}
                aria-label="Toggle push anomaly alerts"
              />
              <span className="ss-switch__slider" />
            </label>
          </div>

          <div style={{ marginTop: theme.spacing.lg, display: "flex", gap: theme.spacing.md, alignItems: "center" }}>
            <Badge tone="info">Saved locally (mock)</Badge>
            <Button variant="secondary" size="sm">Save changes</Button>
          </div>
        </Card>

        <Card title="Profile" subtitle="Basic account settings">
          <div className="ss-form">
            <label className="ss-label">
              Name
              <input
                className="ss-input"
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              />
            </label>

            <label className="ss-label">
              Email
              <input
                className="ss-input"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              />
            </label>

            <div className="ss-actions">
              <Button variant="primary">Update profile</Button>
              <Button variant="ghost">Reset</Button>
            </div>
          </div>
        </Card>
      </div>

      <style>{`
        .ss-page{ display:flex; flex-direction:column; gap:${theme.spacing.xl}px; }
        .ss-grid{ display:grid; grid-template-columns: 1fr 1fr; gap:${theme.spacing.xl}px; }

        .ss-setting{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:${theme.spacing.lg}px;
          padding:${theme.spacing.lg}px;
          border-radius:${theme.radii.lg}px;
          border:1px solid ${theme.colors.border};
          background: rgba(255,255,255,0.70);
        }
        .ss-setting__title{ font-size:13px; font-weight:900; color:${theme.colors.text}; }
        .ss-setting__desc{ margin-top:${theme.spacing.sm}px; font-size:12px; color:${theme.colors.mutedText}; font-weight:700; }

        .ss-switch{ position:relative; display:inline-block; width: 46px; height: 28px; }
        .ss-switch input{ opacity:0; width:0; height:0; }
        .ss-switch__slider{
          position:absolute; cursor:pointer;
          inset:0;
          background: rgba(55,65,81,0.16);
          border: 1px solid ${theme.colors.border};
          transition: 160ms ease;
          border-radius:${theme.radii.pill}px;
        }
        .ss-switch__slider:before{
          position:absolute; content:"";
          height: 22px; width: 22px;
          left: 3px; top: 50%;
          transform: translateY(-50%);
          background: ${theme.colors.surface};
          border-radius:${theme.radii.pill}px;
          box-shadow: 0 6px 16px rgba(17,24,39,0.16);
          transition: 160ms ease;
        }
        .ss-switch input:checked + .ss-switch__slider{
          background: rgba(244,114,182,0.22);
          border-color: rgba(244,114,182,0.35);
        }
        .ss-switch input:checked + .ss-switch__slider:before{
          transform: translate(18px, -50%);
        }
        .ss-switch input:focus-visible + .ss-switch__slider{
          box-shadow: 0 0 0 4px rgba(244,114,182,0.18);
        }

        .ss-form{ display:flex; flex-direction:column; gap:${theme.spacing.md}px; }
        .ss-label{ display:flex; flex-direction:column; gap:${theme.spacing.sm}px; font-size:12px; font-weight:900; color:${theme.colors.text}; }
        .ss-input{
          border-radius:${theme.radii.lg}px;
          border:1px solid ${theme.colors.border};
          background:${theme.colors.surface};
          padding: 11px 14px;
          font-size: 13px;
          outline:none;
          transition: box-shadow 140ms ease, border-color 140ms ease;
        }
        .ss-input:focus{
          border-color: rgba(244,114,182,0.45);
          box-shadow: 0 0 0 4px rgba(244,114,182,0.18);
        }
        .ss-actions{ display:flex; gap:${theme.spacing.md}px; margin-top:${theme.spacing.md}px; }

        @media (max-width: 1100px){
          .ss-grid{ grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
