import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { useAuth } from "../auth/AuthContext";
import { theme } from "../theme";

/**
 * PUBLIC_INTERFACE
 */
export function LoginPage() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  async function handleSignIn() {
    setLoading(true);
    try {
      await signIn();
      navigate(from, { replace: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ss-login">
      <div className="ss-login__wrap">
        <Card
          title="Sign in"
          subtitle="Placeholder authentication for UI scaffolding."
          action={<Badge tone="info">Mock</Badge>}
        >
          <div className="ss-login__body">
            <p className="ss-login__hint">
              This login does not contact a backend. It simply toggles an in-app
              auth flag.
            </p>

            <div className="ss-login__actions">
              <Button
                variant="primary"
                onClick={handleSignIn}
                disabled={loading}
                aria-label="Sign in (placeholder)"
              >
                {loading ? "Signing in…" : "Sign in"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/", { replace: true })}
                aria-label="Continue to dashboard without signing in"
              >
                Continue without signing in
              </Button>
            </div>
          </div>
        </Card>

        <div className="ss-login__note">
          <strong>Note:</strong> Protected routes redirect here when signed out.
        </div>
      </div>

      <style>{`
        .ss-login{
          min-height: calc(100vh - 88px);
          display:flex;
          align-items:center;
          justify-content:center;
          padding:${theme.spacing["2xl"]}px ${theme.spacing.xl}px;
        }
        .ss-login__wrap{
          width: min(720px, 100%);
          display:flex;
          flex-direction:column;
          gap:${theme.spacing.lg}px;
        }
        .ss-login__body{
          display:flex;
          flex-direction:column;
          gap:${theme.spacing.lg}px;
        }
        .ss-login__hint{
          margin:0;
          color:${theme.colors.mutedText};
          font-size:13px;
          font-weight:700;
          line-height:1.55;
        }
        .ss-login__actions{
          display:flex;
          flex-wrap:wrap;
          gap:${theme.spacing.md}px;
          align-items:center;
        }
        .ss-login__note{
          font-size:12px;
          font-weight:800;
          color:${theme.colors.mutedText};
          padding:${theme.spacing.md}px ${theme.spacing.lg}px;
          border:1px dashed rgba(55,65,81,0.20);
          border-radius:${theme.radii.lg}px;
          background: rgba(255,255,255,0.55);
        }
      `}</style>
    </div>
  );
}
