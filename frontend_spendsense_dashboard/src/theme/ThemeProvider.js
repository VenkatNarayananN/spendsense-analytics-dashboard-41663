import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getThemeTokens } from "../theme";

/**
 * Theme modes supported by the app.
 * - "light": forced light theme
 * - "dark": forced dark theme
 * - "system": follow prefers-color-scheme
 */
const ThemeContext = createContext(null);

const STORAGE_KEY = "spendsense.theme.mode";

function safeGetStoredMode() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    // ignore
  }
  return null;
}

function safeStoreMode(mode) {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore
  }
}

function getSystemTheme() {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyHtmlTheme(themeName) {
  // Prevent initial flash: apply on <html> which drives CSS vars.
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", themeName);
}

/**
 * PUBLIC_INTERFACE
 */
export function useTheme() {
  /** React hook that returns theme mode, effective theme name, and token set. */
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within <ThemeProvider />");
  }
  return ctx;
}

/**
 * PUBLIC_INTERFACE
 */
export function ThemeProvider({ children }) {
  /** Provides theme selection + tokens to the app, applying global CSS vars via `data-theme`. */
  const initialMode = useMemo(() => safeGetStoredMode() || "system", []);
  const [mode, setMode] = useState(initialMode);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    const onChange = () => setSystemTheme(mql.matches ? "dark" : "light");

    // Safari fallback
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, []);

  const effectiveTheme = mode === "system" ? systemTheme : mode;

  // Apply theme attribute early and whenever it changes.
  useEffect(() => {
    applyHtmlTheme(effectiveTheme);
  }, [effectiveTheme]);

  const setThemeMode = useCallback((nextMode) => {
    const normalized = nextMode === "light" || nextMode === "dark" || nextMode === "system" ? nextMode : "system";
    setMode(normalized);
    safeStoreMode(normalized);
  }, []);

  const tokens = useMemo(() => getThemeTokens(effectiveTheme), [effectiveTheme]);

  const value = useMemo(
    () => ({
      mode,
      themeName: effectiveTheme,
      tokens,
      setThemeMode,
      toggleTheme: () => setThemeMode(effectiveTheme === "dark" ? "light" : "dark"),
    }),
    [mode, effectiveTheme, tokens, setThemeMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
