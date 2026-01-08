import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";

/**
 * DemoContext centralizes demo-mode gating across the app.
 *
 * Demo mode is intended to keep the UI usable while Supabase configuration and/or
 * seeding is unavailable. When enabled:
 * - Pages should render immediately using mock/local demo data.
 * - Supabase fetches and realtime subscriptions should be bypassed.
 */
const DemoContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 */
export function DemoProvider({ children }) {
  /**
   * Demo mode defaults to true when:
   * - Env flag REACT_APP_DEMO_MODE is set to "true", OR
   * - Supabase is not configured, OR
   * - A previous session persisted demo mode preference in localStorage, OR
   * - Seeds have not been marked as succeeded yet (user can still manually toggle off).
   */
  const { supabaseConfigured } = useAuth();

  const envForcesDemo = String(process.env.REACT_APP_DEMO_MODE || "")
    .trim()
    .toLowerCase() === "true";

  const persistedDemoMode = useMemo(() => {
    try {
      const v = window.localStorage.getItem("ss_demo_mode");
      if (v === null || v === undefined) return null;
      return v === "true";
    } catch {
      return null;
    }
  }, []);

  const persistedSeedsOk = useMemo(() => {
    try {
      const v = window.localStorage.getItem("ss_seeds_ok");
      return v === "true";
    } catch {
      return false;
    }
  }, []);

  // Initial mode is derived once, then can be user-toggled (unless env forces demo).
  const [demoMode, setDemoModeState] = useState(() => {
    if (envForcesDemo) return true;
    if (!supabaseConfigured) return true;
    if (persistedDemoMode !== null) return persistedDemoMode;
    // Default to demo until seeds are confirmed.
    return !persistedSeedsOk;
  });

  const [seedsOk, setSeedsOkState] = useState(() => {
    // If env forces demo we still track seedsOk, but it does not disable demo.
    return persistedSeedsOk;
  });

  const setDemoMode = useCallback(
    (next) => {
      // When env forces demo, ignore any request to disable.
      if (envForcesDemo) {
        setDemoModeState(true);
        try {
          window.localStorage.setItem("ss_demo_mode", "true");
        } catch {
          // ignore
        }
        return;
      }

      setDemoModeState(Boolean(next));
      try {
        window.localStorage.setItem("ss_demo_mode", Boolean(next) ? "true" : "false");
      } catch {
        // ignore
      }
    },
    [envForcesDemo]
  );

  // PUBLIC_INTERFACE
  const setSeedsOk = useCallback((ok) => {
    /**
     * Marks whether Supabase seed/schema is confirmed usable.
     * In the UI we use this as a hint that the user can safely exit demo mode.
     */
    const next = Boolean(ok);
    setSeedsOkState(next);
    try {
      window.localStorage.setItem("ss_seeds_ok", next ? "true" : "false");
    } catch {
      // ignore
    }
  }, []);

  // Keep demo mode true when Supabase becomes unconfigured.
  // (This can happen if env vars are removed and the app hot reloads.)
  if (!supabaseConfigured && !demoMode) {
    // Avoid setState during render loops: this is a rare edge; safe as state is stable otherwise.
    // eslint-disable-next-line no-console
    console.warn("Supabase became unconfigured; forcing demo mode.");
    // best effort
    try {
      window.setTimeout(() => setDemoMode(true), 0);
    } catch {
      // ignore
    }
  }

  const value = useMemo(
    () => ({
      demoMode,
      setDemoMode,
      seedsOk,
      setSeedsOk,
      envForcesDemo,
      supabaseConfigured,
    }),
    [demoMode, envForcesDemo, seedsOk, setDemoMode, setSeedsOk, supabaseConfigured]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 */
export function useDemo() {
  /**
   * Access the demo-mode context.
   */
  const ctx = useContext(DemoContext);
  if (!ctx) {
    throw new Error("useDemo must be used within a DemoProvider");
  }
  return ctx;
}
