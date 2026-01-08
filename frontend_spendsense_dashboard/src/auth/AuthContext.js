import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "../supabaseClient";
import { generateSampleDataSeed } from "../lib/supabaseClient/seed";

/**
 * AuthContext is the single source of truth for Supabase auth session.
 */
const AuthContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 */
export function AuthProvider({ children }) {
  /**
   * Auth state is derived from Supabase only.
   * Pages should rely on `session` and `loading` from this context.
   */
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [supabaseConfigured, setSupabaseConfigured] = useState(true);

  useEffect(() => {
    let alive = true;
    let unsubscribe = null;

    async function init() {
      setLoading(true);
      const supabase = await getSupabaseClient();

      if (!supabase) {
        if (!alive) return;
        setSupabaseConfigured(false);
        setSession(null);
        setLoading(false);
        return;
      }

      setSupabaseConfigured(true);

      const { data, error } = await supabase.auth.getSession();
      if (!alive) return;

      if (error) {
        // Keep session null; surface error on Login page and/or protected pages.
        setSession(null);
        setLoading(false);
      } else {
        setSession(data?.session || null);
        setLoading(false);
      }

      const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
        if (!alive) return;
        setSession(newSession || null);
      });

      unsubscribe = () => listener?.subscription?.unsubscribe?.();
    }

    init();

    return () => {
      alive = false;
      try {
        unsubscribe?.();
      } catch {
        // ignore
      }
    };
  }, []);

  // PUBLIC_INTERFACE
  const signIn = useCallback(async (email, password) => {
    /**
     * Signs in with Supabase email/password.
     */
    const supabase = await getSupabaseClient();
    if (!supabase) {
      throw new Error(
        "Supabase is not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY."
      );
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data?.session || null;
  }, []);

  // PUBLIC_INTERFACE
  const signOut = useCallback(async () => {
    /**
     * Signs out the current user.
     */
    const supabase = await getSupabaseClient();
    if (!supabase) return true;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  }, []);

  // PUBLIC_INTERFACE
  const generateSampleData = useCallback(
    async (options = {}) => {
      /**
       * Seeds sample data into Supabase for the current logged-in user.
       * Note: seed.js still contains a guarded localStorage fallback, but SettingsPage
       * will only expose this action when Supabase + session exist.
       */
      return generateSampleDataSeed(options);
    },
    []
  );

  const value = useMemo(
    () => ({
      loading,
      session,
      user: session?.user || null,
      isAuthenticated: !!session,
      supabaseConfigured,
      signIn,
      signOut,
      generateSampleData,
    }),
    [generateSampleData, loading, session, signIn, signOut, supabaseConfigured]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 */
export function useAuth() {
  /**
   * Access the authentication context.
   */
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
