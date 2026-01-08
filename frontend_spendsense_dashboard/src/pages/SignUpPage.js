import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { theme } from "../theme";
import { useAuth } from "../auth/AuthContext";

/**
 * PUBLIC_INTERFACE
 */
export function SignUpPage() {
  const { signUpWithEmail, loading: authLoading, supabaseConfigured, isAuthenticated } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const validationError = useMemo(() => {
    if (!email.trim()) return "Email is required.";
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (confirmPassword !== password) return "Passwords do not match.";
    return null;
  }, [confirmPassword, email, password]);

  const canSubmit = useMemo(() => {
    if (!supabaseConfigured) return false;
    if (authLoading) return false;
    if (status.type === "working") return false;
    if (validationError) return false;
    return true;
  }, [authLoading, status.type, supabaseConfigured, validationError]);

  async function handleSignUp(e) {
    e?.preventDefault?.();
    setStatus({ type: "working", message: "" });

    if (validationError) {
      setStatus({ type: "error", message: validationError });
      return;
    }

    try {
      const data = await signUpWithEmail({
        email: email.trim(),
        password,
        fullName: fullName.trim() || undefined,
        // Requirement: use origin (Supabase will use this for the confirmation callback)
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      });

      // If email confirmation is enabled, Supabase may not provide a session immediately.
      // data.user exists either way; session may be null.
      const hasSession = !!data?.session;
      const message = hasSession
        ? "Account created. You can sign in now."
        : "Account created. Check your email to verify your address, then sign in.";

      setStatus({ type: "success", message });

      // Navigate to login with a banner once the user sees success.
      window.setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            from,
            signupSuccess: true,
            signupMessage: message,
          },
        });
      }, 900);
    } catch (err) {
      setStatus({
        type: "error",
        message: err?.message || "Unable to create account. Please try again.",
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
          title="Create account"
          subtitle="Create your SpendSense account using Supabase Auth."
          action={
            <Badge tone={supabaseConfigured ? "success" : "warning"}>
              {supabaseConfigured ? "Supabase" : "Setup required"}
            </Badge>
          }
        >
          {!supabaseConfigured ? (
            <div className="ss-login__body">
              <p className="ss-login__hint">
                Supabase is not configured for this environment. Please set{" "}
                <code>REACT_APP_SUPABASE_URL</code> and <code>REACT_APP_SUPABASE_KEY</code> in the
                frontend container .env.
              </p>
              <div className="ss-login__note">
                After configuring env vars, reload the page and create an account.
              </div>
              <div className="ss-authSwitch">
                <span className="ss-authSwitch__text">Already have an account?</span>{" "}
                <Link className="ss-authSwitch__link" to="/login">
                  Sign in
                </Link>
              </div>
            </div>
          ) : (
            <form className="ss-login__body" onSubmit={handleSignUp}>
              <label className="ss-label">
                Full name <span className="ss-label__opt">(optional)</span>
                <input
                  className="ss-input"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Morgan"
                  aria-label="Full name"
                />
              </label>

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
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  aria-label="Password"
                />
              </label>

              <label className="ss-label">
                Confirm password
                <input
                  className="ss-input"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  aria-label="Confirm password"
                />
              </label>

              {validationError && status.type !== "error" && (
                <div className="ss-status" aria-live="polite">
                  <Badge tone="warning">{validationError}</Badge>
                </div>
              )}

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
                <Button variant="primary" type="submit" disabled={!canSubmit} aria-label="Create account">
                  {status.type === "working" || authLoading ? "Creating…" : "Create account"}
                </Button>

                <Link className="ss-linkBtn" to="/login" state={{ from }}>
                  Sign in instead
                </Link>
              </div>

              <div className="ss-login__note">
                <strong>Tip:</strong> If email confirmation is enabled in Supabase, you must verify your email before signing in.
              </div>
            </form>
          )}
        </Card>

        <div className="ss-authSwitch">
          <span className="ss-authSwitch__text">Already have an account?</span>{" "}
          <Link className="ss-authSwitch__link" to="/login" state={{ from }}>
            Sign in
          </Link>
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
        .ss-label{
          display:flex;
          flex-direction:column;
          gap:${theme.spacing.sm}px;
          font-size:12px;
          font-weight:${theme.typography.weights.black};
          color:${theme.colors.textStrong};
        }
        .ss-label__opt{
          font-weight:${theme.typography.weights.bold};
          color:${theme.colors.mutedText};
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
          border-color: color-mix(in srgb, var(--brand-primary) 45%, transparent);
          box-shadow: 0 0 0 4px var(--focus-soft);
          background: color-mix(in srgb, var(--bg-card) 96%, transparent);
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
        .ss-authSwitch{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:${theme.spacing.sm}px;
          font-size: 12px;
          font-weight: 800;
          color: ${theme.colors.mutedText};
        }
        .ss-authSwitch__link{
          color: ${theme.colors.textStrong};
          text-decoration: none;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid ${theme.colors.borderSubtle};
          background: color-mix(in srgb, var(--bg-card) 80%, transparent);
        }
        .ss-authSwitch__link:hover{
          border-color: ${theme.colors.border};
          box-shadow: var(--shadow-sm);
        }
        .ss-linkBtn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding: 10px 12px;
          border-radius: 999px;
          border: 1px solid ${theme.colors.borderSubtle};
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
          color: ${theme.colors.textStrong};
          background: color-mix(in srgb, var(--bg-card) 78%, transparent);
        }
        .ss-linkBtn:hover{
          border-color: ${theme.colors.border};
          box-shadow: var(--shadow-sm);
        }
      `}</style>
    </div>
  );
}
