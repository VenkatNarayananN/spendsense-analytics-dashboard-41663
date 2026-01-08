import React, { useMemo, useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { theme } from "../theme";
import { useAuth } from "../auth/AuthContext";

/**
 * PUBLIC_INTERFACE
 */
export function SettingsPage() {
  const [emailReports, setEmailReports] = useState(true);
  const [anomalyPush, setAnomalyPush] = useState(false);
  const [profile, setProfile] = useState({ name: "Avery Chen", email: "avery@example.com" });

  const { generateSampleData, supabaseConfigured, session } = useAuth();

  const [seedState, setSeedState] = useState({ status: "idle", message: "", mode: "" });

  const seedTone = useMemo(() => {
    if (seedState.status === "success") return "success";
    if (seedState.status === "error") return "danger";
    if (seedState.status === "working") return "info";
    return "info";
  }, [seedState.status]);

  const onGenerateSampleData = async () => {
    setSeedState({ status: "working", message: "Generating demo data…", mode: "" });
    try {
      const res = await generateSampleData({ countTransactions: 24, countAlerts: 6 });
      if (res?.ok) {
        setSeedState({
          status: "success",
          message: res.message || "Sample data generated.",
          mode: res.mode || "",
        });
      } else {
        setSeedState({
          status: "error",
          message: res?.message || "Unable to generate sample data.",
          mode: res?.mode || "",
        });
      }
    } catch (e) {
      setSeedState({
        status: "error",
        message: e?.message || "Unable to generate sample data.",
        mode: "",
      });
    }
  };

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

          <div
            style={{
              marginTop: theme.spacing.lg,
              display: "flex",
              gap: theme.spacing.md,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Badge tone="info">Saved locally (UI only)</Badge>
            <Button variant="secondary" size="sm" disabled aria-disabled="true">
              Save changes
            </Button>
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

        <Card title="Demo tools" subtitle="Generate realistic sample transactions and alerts for previews and demos">
          <div className="ss-demo">
            <div className="ss-demo__meta">
              <div className="ss-demo__title">Generate sample data</div>
              <div className="ss-demo__desc">
                Seeds demo transactions + alerts into Supabase for your signed-in user.
              </div>
            </div>

            {!supabaseConfigured ? (
              <div className="ss-demo__hint">
                Supabase is not configured in this environment. Set <strong>REACT_APP_SUPABASE_URL</strong> and{" "}
                <strong>REACT_APP_SUPABASE_KEY</strong> to enable seeding.
              </div>
            ) : !session ? (
              <div className="ss-demo__hint">Sign in to enable demo seeding.</div>
            ) : (
              <>
                <div className="ss-demo__actions">
                  <Button
                    variant="primary"
                    onClick={onGenerateSampleData}
                    disabled={seedState.status === "working"}
                  >
                    {seedState.status === "working" ? "Generating…" : "Generate sample data"}
                  </Button>

                  {seedState.message ? (
                    <div className="ss-demo__status" aria-live="polite">
                      <Badge tone={seedTone}>
                        {seedState.message}
                      </Badge>
                    </div>
                  ) : (
                    <Badge tone="info">Supabase only</Badge>
                  )}
                </div>

                <div className="ss-demo__hint">
                  Tip: ensure your <code>transactions</code> and <code>alerts</code> tables exist and RLS permits inserts for this user.
                </div>
              </>
            )}
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
          border-radius:${theme.radii.xl}px;
          border:1px solid ${theme.colors.border};
          background: rgba(255,255,255,0.72);
          box-shadow: ${theme.shadows.sm};
          backdrop-filter: blur(10px);
        }
        .ss-setting__title{ font-size:13px; font-weight:${theme.typography.weights.black}; color:${theme.colors.textStrong}; }
        .ss-setting__desc{ margin-top:${theme.spacing.sm}px; font-size:12px; color:${theme.colors.textMuted}; font-weight:${theme.typography.weights.semibold}; }

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
          background: rgba(255,255,255,0.92);
          border-radius:${theme.radii.pill}px;
          box-shadow: 0 10px 24px rgba(17,24,39,0.16);
          transition: 160ms ease;
        }
        .ss-switch input:checked + .ss-switch__slider{
          background: ${theme.gradients.accentSoft};
          border-color: rgba(244,114,182,0.30);
        }
        .ss-switch input:checked + .ss-switch__slider:before{
          transform: translate(18px, -50%);
        }
        .ss-switch input:focus-visible + .ss-switch__slider{
          box-shadow: 0 0 0 4px rgba(244,114,182,0.18);
        }

        .ss-form{ display:flex; flex-direction:column; gap:${theme.spacing.md}px; }
        .ss-label{ display:flex; flex-direction:column; gap:${theme.spacing.sm}px; font-size:12px; font-weight:${theme.typography.weights.black}; color:${theme.colors.textStrong}; }
        .ss-input{
          border-radius:${theme.radii.xl}px;
          border:1px solid ${theme.colors.border};
          background: rgba(255,255,255,0.86);
          padding: 11px 14px;
          font-size: 13px;
          outline:none;
          transition: box-shadow 140ms ease, border-color 140ms ease, background 140ms ease;
          color: ${theme.colors.text};
          font-weight:${theme.typography.weights.semibold};
          backdrop-filter: blur(10px);
        }
        .ss-input:focus{
          border-color: rgba(244,114,182,0.45);
          box-shadow: 0 0 0 4px rgba(244,114,182,0.18);
          background: rgba(255,255,255,0.98);
        }
        .ss-actions{ display:flex; gap:${theme.spacing.md}px; margin-top:${theme.spacing.md}px; flex-wrap:wrap; }

        .ss-demo{
          display:flex;
          flex-direction:column;
          gap:${theme.spacing.md}px;
          padding:${theme.spacing.lg}px;
          border-radius:${theme.radii.xl}px;
          border: 1px dashed rgba(244,114,182,0.45);
          background: linear-gradient(180deg, rgba(244,114,182,0.08), rgba(245,158,11,0.06));
          box-shadow: ${theme.shadows.sm};
        }
        .ss-demo__meta{ display:flex; flex-direction:column; gap:${theme.spacing.sm}px; }
        .ss-demo__title{ font-size: 13px; font-weight:${theme.typography.weights.black}; color:${theme.colors.textStrong}; }
        .ss-demo__desc{ font-size: 12px; color:${theme.colors.textMuted}; font-weight:${theme.typography.weights.semibold}; line-height: 1.5; }
        .ss-demo__actions{ display:flex; gap:${theme.spacing.md}px; align-items:center; flex-wrap:wrap; }
        .ss-demo__status{ display:flex; align-items:center; }
        .ss-demo__hint{ font-size: 12px; color:${theme.colors.textMuted}; font-weight:${theme.typography.weights.semibold}; }

        @media (max-width: 1100px){
          .ss-grid{ grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
