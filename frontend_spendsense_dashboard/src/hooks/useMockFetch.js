import { useEffect, useMemo, useState } from "react";

/**
 * PUBLIC_INTERFACE
 */
export function useMockFetch(factory, deps = [], { delayMs = 500 } = {}) {
  /**
   * Simulates an async fetch:
   * - sets loading true
   * - waits delayMs
   * - resolves value from factory()
   *
   * Designed so we can later replace with real fetch/Supabase calls without
   * rewriting page-level state patterns.
   */
  const stableDeps = useMemo(() => deps, deps); // eslint-disable-line react-hooks/exhaustive-deps
  const [state, setState] = useState({ loading: true, error: null, data: null });

  useEffect(() => {
    let alive = true;
    setState({ loading: true, error: null, data: null });

    const t = setTimeout(() => {
      try {
        const data = factory();
        if (alive) setState({ loading: false, error: null, data });
      } catch (e) {
        if (alive) setState({ loading: false, error: e, data: null });
      }
    }, delayMs);

    return () => {
      alive = false;
      clearTimeout(t);
    };
    // stableDeps is intentionally memoized from deps for ergonomics
  }, [delayMs, factory, stableDeps]);

  return state;
}
