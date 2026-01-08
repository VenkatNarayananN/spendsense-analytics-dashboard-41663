import React, { useMemo } from "react";
import { useDemo } from "../demo/DemoContext";
import { theme } from "../theme";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

/**
 * PUBLIC_INTERFACE
 */
export function DemoModeBanner() {
  /**
   * Shows an unobtrusive banner when demo mode is enabled.
   * Allows the user to exit demo mode (unless env forces demo).
   */
  const { demoMode, setDemoMode, envForcesDemo, seedsOk, supabaseConfigured } = useDemo();

  const canExit = useMemo(() => {
    if (!demoMode) return false;
    if (envForcesDemo) return false;
    if (!supabaseConfigured) return false;
    // Prefer allowing exit once seeds are confirmed, but still allow manual exit
    // to test Supabase paths if user wants.
    return true;
  }, [demoMode, envForcesDemo, seedsOk, supabaseConfigured]);

  if (!demoMode) return null;

  return (
    <div className="ss-demoBanner" role="status" aria-label="Demo mode banner">
      <div className="ss-demoBanner__left">
        <Badge tone="warning">Demo mode</Badge>
        <div className="ss-demoBanner__text">
          Data shown is mock/demo only. Supabase reads & realtime are temporarily disabled.
          {seedsOk ? " Seeds appear ready—feel free to exit demo mode." : " Seed/schema not confirmed yet."}
        </div>
      </div>

      <div className="ss-demoBanner__right">
        <Button
          variant="secondary"
          size="sm"
          disabled={!canExit}
          aria-disabled={!canExit}
          onClick={() => setDemoMode(false)}
          title={
            envForcesDemo
              ? "Demo mode is forced by REACT_APP_DEMO_MODE=true"
              : !supabaseConfigured
                ? "Supabase is not configured in this environment"
                : "Exit demo mode"
          }
        >
          Exit demo
        </Button>
      </div>

      <style>{`
        .ss-demoBanner{
          width: 100%;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:${theme.spacing.md}px;
          padding: 10px 14px;
          border-radius:${theme.radii.xl}px;
          border: 1px dashed color-mix(in srgb, var(--brand-primary) 40%, transparent);
          background: color-mix(in srgb, var(--bg-card) 78%, transparent);
          box-shadow: var(--shadow-sm);
          backdrop-filter: blur(10px);
        }
        .ss-demoBanner__left{
          display:flex;
          align-items:center;
          gap:${theme.spacing.sm}px;
          min-width:0;
        }
        .ss-demoBanner__text{
          font-size: 12px;
          font-weight:${theme.typography.weights.semibold};
          color:${theme.colors.textMuted};
          line-height: 1.4;
        }
        .ss-demoBanner__right{
          display:flex;
          align-items:center;
          gap:${theme.spacing.sm}px;
          flex-shrink:0;
        }
      `}</style>
    </div>
  );
}
