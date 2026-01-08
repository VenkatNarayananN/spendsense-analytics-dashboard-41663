import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { theme } from "../theme";
import { useAuth } from "../auth/AuthContext";

/**
 * PUBLIC_INTERFACE
 */
export function LoginPage() {
  const { signIn, loading: authLoading, supabaseConfigured, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState({ type: "idle", message: "" });

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const canSubmit = useMemo(() => {
    if (!supabaseConfigured) return false;
    if (authLoading) return false;
    if (!email.trim() || !password) return false;
    return true;
  }, [authLoading, email, password, supabaseConfigured]);

  async function handleSignIn(e) {
    e?.preventDefault?.();
    setStatus({ type: "working", message: "" });

    try {
      await signIn(email.trim(), password);
      setStatus({ type: "success", message: "Signed in." });
      navigate(from, { replace: true });
    } catch (err) {
      setStatus({
        type: "error",
        message: err?.message || "Unable to sign in. Check your credentials and try again.",
      });
    }
  }

  // If already authed, redirect silently.
  if (!authLoading && isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  return (
    <div className="ss-login">
      <div className="ss-login__wrap">
        <Card
          title="Sign in"
          subtitle="Authenticate with Supabase to access your dashboard."
          action={<Badge tone={supabaseConfigured ? "success" : "warning"}>{supabaseConfigured ? "Supabase" : "Setup required"}</Badge>}
        >
          {!supabaseConfigured ? (
            <div className="ss-login__body">
              <p className="ss-login__hint">
                Supabase is not configured for this environment.
                Please set <code>REACT_APP_SUPABASE_URL</code> and <code>REACT_APP_SUPABASE_KEY</code> in the frontend container .env.
              </p>
              <div className="ss-login__note">
                After configuring env vars, reload the page and sign in with your Supabase Auth user.
              </div>
            </div>
          ) : (
            <form className="ss-login__body" onSubmit={handleSignIn}>
              <label className="ss-label">
                Email
                <input
                  className="ss-input"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-label="Email"
                />
              </label>

              <label className="ss-label">
                Password
                <input
                  className="ss-input"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  aria-label="Password"
                />
              </label>

              {status.type === "error" && (
                <div className="ss-status" role="alert">
                  <Badge tone="danger">{status.message}</Badge>
                </div>
              )}

              {status.type === "success" && (
                <div className="ss-status" aria-live="polite">
                  <Badge tone="success">{status.message}</Badge>
                </div>
              )}

              <div className="ss-login__actions">
                <Button variant="primary" type="submit" disabled={!canSubmit} aria-label="Sign in">
                  {status.type === "working" || authLoading ? "Signing in…" : "Sign in"}
                </Button>
              </div>

              <div className="ss-login__note">
                <strong>Note:</strong> This app requires an authenticated Supabase session. Demo/mock sign-in has been removed.
              </div>
            </form>
          )}
        </Card>
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
        .ss-label{
          display:flex;
          flex-direction:column;
          gap:${theme.spacing.sm}px;
          font-size:12px;
          font-weight:${theme.typography.weights.black};
          color:${theme.colors.textStrong};
        }
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
        .ss-login__actions{
          display:flex;
          flex-wrap:wrap;
          gap:${theme.spacing.md}px;
          align-items:center;
        }
        .ss-status{ display:flex; }
        .ss-login__note{
          font-size:12px;
          font-weight:800;
          color:${theme.colors.mutedText};
          padding:${theme.spacing.md}px ${theme.spacing.lg}px;
          border:1px dashed rgba(55,65,81,0.20);
          border-radius:${theme.radii.lg}px;
          background: rgba(255,255,255,0.55);
        }
        code{
          font-family:${theme.typography.monoFamily};
          font-size: 12px;
          background: rgba(17,24,39,0.06);
          padding: 2px 6px;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
