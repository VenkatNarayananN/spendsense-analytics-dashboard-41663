import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { theme } from "../theme";
import { useAuth } from "./AuthContext";

/**
 * PUBLIC_INTERFACE
 */
export function ProtectedRoute({ children }) {
  /**
   * Route guard backed by Supabase session.
   * - While auth is loading, show a lightweight loading card.
   * - If Supabase isn't configured, send user to login where we show setup guidance.
   * - If not authenticated, redirect to /login.
   */
  const { isAuthenticated, loading, supabaseConfigured } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ padding: `${theme.spacing.xl}px`, maxWidth: 960 }}>
        <Card
          title="Loading session…"
          subtitle="Connecting to Supabase"
          action={<Badge tone="info">Loading</Badge>}
        >
          <div style={{ color: theme.colors.textMuted, fontWeight: 700, fontSize: 13 }}>
            Please wait while we verify your session.
          </div>
        </Card>
      </div>
    );
  }

  if (!supabaseConfigured) {
    return (
      <Navigate to="/login" replace state={{ from: location.pathname || "/" }} />
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" replace state={{ from: location.pathname || "/" }} />
    );
  }

  return children;
}
