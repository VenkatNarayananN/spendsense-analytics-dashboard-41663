import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * AuthContext provides a minimal, placeholder authentication state for UI scaffolding.
 * This is intentionally dummy logic so the app remains fully functional without backend/Supabase.
 */
const AuthContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 */
export function AuthProvider({ children }) {
  /**
   * Placeholder auth state:
   * - Defaults to "signed out"
   * - Persists to localStorage so refreshes behave predictably during UI review.
   */
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return window.localStorage.getItem("ss_isAuthed") === "true";
    } catch {
      return false;
    }
  });

  const signIn = useCallback(async () => {
    setIsAuthenticated(true);
    try {
      window.localStorage.setItem("ss_isAuthed", "true");
    } catch {
      // ignore storage failures (private mode etc.)
    }
    return true;
  }, []);

  const signOut = useCallback(async () => {
    setIsAuthenticated(false);
    try {
      window.localStorage.setItem("ss_isAuthed", "false");
    } catch {
      // ignore storage failures
    }
    return true;
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      signIn,
      signOut,
    }),
    [isAuthenticated, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 */
export function useAuth() {
  /**
   * Access the placeholder auth context.
   */
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
