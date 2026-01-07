import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * PUBLIC_INTERFACE
 */
export function ProtectedRoute({ children }) {
  /**
   * Simple route guard for scaffolding.
   * Redirects to /login when not authenticated. Uses location state so we can return after login.
   */
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname || "/" }}
      />
    );
  }

  return children;
}
