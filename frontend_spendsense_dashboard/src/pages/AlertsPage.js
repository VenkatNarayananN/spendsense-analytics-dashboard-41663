import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { CardSkeleton } from "../components/ui/Skeleton";
import { theme } from "../theme";
import { useAuth } from "../auth/AuthContext";
import { dismissAlert, listAlerts } from "../lib/supabaseClient/db";
import { subscribeToTableChanges } from "../lib/supabaseClient/realtime";

function toneForSeverity(sev) {
  if (sev === "High") return "danger";
  if (sev === "Medium") return "warning";
  return "info";
}

function uniq(arr) {
  return Array.from(new Set(arr)).sort((a, b) => String(a).localeCompare(String(b)));
}

/**
 * Simple heuristic "type" derived from alert content.
 */
function typeForAlert(a) {
  const s = `${a.title || ""} ${a.detail || ""}`.toLowerCase();
  if (s.includes("subscription") || s.includes("billed")) return "Subscription";
  if (s.includes("decline") || s.includes("declined")) return "Card";
  if (s.includes("travel") || s.includes("hotel")) return "Travel";
  if (s.includes("merchant")) return "Merchant";
  return "General";
}

/**
 * PUBLIC_INTERFACE
 */
export function AlertsPage() {
  const { session, user, supabaseConfigured } = useAuth();

  const [rows, setRows] = useState([]);
  const [fetchState, setFetchState] = useState({ loading: true, error: null });
  const [actionState, setActionState] = useState({ workingId: null, error: null });

  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");
  const [type, setType] = useState("All");

  const reset = useCallback(() => {
    setSearch("");
    setSeverity("All");
    setType("All");
  }, []);

  const load = useCallback(async () => {
    if (!supabaseConfigured) {
      setFetchState({
        loading: false,
        error: new Error("Supabase is not configured."),
      });
      setRows([]);
      return;
    }
    if (!session?.user?.id) return;

    setFetchState({ loading: true, error: null });
    try {
      const data = await listAlerts({ userId: session.user.id });
      setRows(Array.isArray(data) ? data : []);
      setFetchState({ loading: false, error: null });
    } catch (e) {
      setRows([]);
      setFetchState({ loading: false, error: e });
    }
  }, [session?.user?.id, session, supabaseConfigured]);

  useEffect(() => {
    if (!session?.user?.id) return;
    load();
  }, [load, session?.user?.id]);

  // Realtime subscription
  const subRef = useRef(null);
  useEffect(() => {
    let alive = true;

    async function sub() {
      if (!supabaseConfigured || !user?.id) return;
      try {
        const s = await subscribeToTableChanges({
          table: "alerts",
          filter: `user_id=eq.${user.id}`,
          onChange: () => {
            if (alive) load();
          },
        });
        subRef.current = s;
      } catch {
        // ignore; non-fatal
      }
    }

    sub();

    return () => {
      alive = false;
      try {
        subRef.current?.unsubscribe?.();
      } catch {
        // ignore
      }
      subRef.current = null;
    };
  }, [load, supabaseConfigured, user?.id]);

  const severities = useMemo(() => uniq(rows.map((a) => a.severity).filter(Boolean)), [rows]);
  const types = useMemo(() => uniq(rows.map((a) => typeForAlert(a))), [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((a) => {
      const matchesQ =
        !q ||
        String(a.title || "").toLowerCase().includes(q) ||
        String(a.detail || "").toLowerCase().includes(q) ||
        String(a.id || "").toLowerCase().includes(q);

      const matchesSeverity = severity === "All" ? true : a.severity === severity;
      const matchesType = type === "All" ? true : typeForAlert(a) === type;

      return matchesQ && matchesSeverity && matchesType;
    });
  }, [rows, search, severity, type]);

  const activeCount = useMemo(() => {
    let n = 0;
    if (search.trim()) n += 1;
    if (severity !== "All") n += 1;
    if (type !== "All") n += 1;
    return n;
  }, [search, severity, type]);

  const onDismiss = useCallback(
    async (id) => {
      setActionState({ workingId: id, error: null });
      try {
        await dismissAlert(id);
        setActionState({ workingId: null, error: null });
        // optimistic removal
        setRows((prev) => prev.filter((a) => a.id !== id));
      } catch (e) {
        setActionState({ workingId: null, error: e });
      }
    },
    [setRows]
  );

  return (
    <div className="ss-page">
      <Card
        title="Alerts"
        subtitle="Anomaly and policy notifications"
        action={
          <div style={{ display: "flex", gap: theme.spacing.sm, alignItems: "center" }}>
            <Badge tone="success">Live</Badge>
            <Button variant="ghost" size="sm" onClick={load} aria-label="Refresh alerts">
              Refresh
            </Button>
          </div>
        }
      >
        <div className="ss-controls" aria-label="Alert filters">
          <input
            className="ss-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search alerts…"
            aria-label="Search alerts"
          />

          <div className="ss-row">
            <label className="ss-field">
              <span className="ss-field__label">Severity</span>
              <select
                className="ss-select"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                aria-label="Filter by severity"
              >
                <option>All</option>
                {severities.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>

            <label className="ss-field">
              <span className="ss-field__label">Type</span>
              <select
                className="ss-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
                aria-label="Filter by type"
              >
                <option>All</option>
                {types.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>

            <div className="ss-controls__meta">
              <Badge tone="info">{filtered.length} results</Badge>
              {activeCount > 0 && (
                <Button variant="secondary" size="sm" onClick={reset} aria-label="Clear filters">
                  Clear filters
                </Button>
              )}
            </div>
          </div>

          {actionState.error && (
            <div aria-live="polite" style={{ marginTop: theme.spacing.sm }}>
              <Badge tone="danger">{actionState.error?.message || "Unable to dismiss alert."}</Badge>
            </div>
          )}
        </div>

        <div style={{ marginTop: theme.spacing.lg }}>
          {fetchState.loading ? (
            <div className="ss-skelStack">
              <CardSkeleton rows={2} />
              <CardSkeleton rows={2} />
              <CardSkeleton rows={2} />
            </div>
          ) : fetchState.error ? (
            <EmptyState
              icon="⚠"
              title="Unable to load alerts"
              description={fetchState.error?.message || "An unexpected error occurred while loading your alerts."}
              primaryActionLabel="Retry"
              onPrimaryAction={load}
            />
          ) : filtered.length > 0 ? (
            <div className="ss-alerts">
              {filtered.map((a) => (
                <div key={a.id} className="ss-alert">
                  <div className="ss-alert__left">
                    <div className="ss-alert__title">{a.title}</div>
                    <div className="ss-alert__detail">{a.detail}</div>
                    <div className="ss-alert__meta">
                      <Badge tone="neutral">{typeForAlert(a)}</Badge>
                      <span className="ss-alert__id">{a.id}</span>
                    </div>
                  </div>

                  <div className="ss-alert__right">
                    <Badge tone={toneForSeverity(a.severity)}>{a.severity}</Badge>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onDismiss(a.id)}
                      disabled={actionState.workingId === a.id}
                      aria-label={`Dismiss alert ${a.id}`}
                    >
                      {actionState.workingId === a.id ? "Dismissing…" : "Dismiss"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="⚑"
              title="No alerts match these filters"
              description="Try clearing filters or searching for a different keyword."
              primaryActionLabel="Clear filters"
              onPrimaryAction={reset}
              secondaryActionLabel="Refresh"
              onSecondaryAction={load}
            />
          )}
        </div>
      </Card>

      <style>{`
        .ss-page{ display:flex; flex-direction:column; gap:${theme.spacing.xl}px; }

        .ss-controls{ display:flex; flex-direction:column; gap:${theme.spacing.md}px; }
        .ss-row{ display:flex; flex-wrap:wrap; gap:${theme.spacing.md}px; align-items:flex-end; }

        .ss-field{
          display:flex;
          flex-direction:column;
          gap:${theme.spacing.xs}px;
          min-width: 180px;
        }

        .ss-field__label{
          font-size: 11px;
          font-weight: ${theme.typography.weights.black};
          color: ${theme.colors.textMuted};
          letter-spacing: 0.25px;
        }

        .ss-input, .ss-select{
          border-radius:${theme.radii.xl}px;
          border:1px solid ${theme.colors.border};
          background: rgba(255,255,255,0.86);
          padding: 11px 14px;
          font-size: 13px;
          outline:none;
          transition: box-shadow 140ms ease, border-color 140ms ease, background 140ms ease;
          color: ${theme.colors.text};
          font-weight: ${theme.typography.weights.semibold};
          backdrop-filter: blur(10px);
        }

        .ss-input::placeholder{ color: rgba(55,65,81,0.52); font-weight: ${theme.typography.weights.medium}; }

        .ss-input:focus, .ss-select:focus{
          border-color: rgba(244,114,182,0.42);
          box-shadow: 0 0 0 4px rgba(244,114,182,0.18);
          background: rgba(255,255,255,0.98);
        }

        .ss-controls__meta{
          margin-left:auto;
          display:flex;
          gap:${theme.spacing.md}px;
          align-items:center;
          flex-wrap:wrap;
        }

        .ss-skelStack{
          display:flex;
          flex-direction:column;
          gap:${theme.spacing.md}px;
        }

        .ss-alerts{ display:flex; flex-direction:column; gap:${theme.spacing.md}px; }

        .ss-alert{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:${theme.spacing.lg}px;
          padding:${theme.spacing.lg}px;
          border-radius:${theme.radii.xl}px;
          border:1px solid ${theme.colors.border};
          background: rgba(255,255,255,0.78);
          color: ${theme.colors.text};
          box-shadow: ${theme.shadows.sm};
          backdrop-filter: blur(10px);
        }

        .ss-alert__title{ font-size:13px; font-weight:${theme.typography.weights.black}; color:${theme.colors.textStrong}; }
        .ss-alert__detail{
          margin-top:${theme.spacing.sm}px;
          font-size:12.5px;
          color: ${theme.colors.textMuted};
          font-weight:${theme.typography.weights.semibold};
          line-height:1.55;
        }
        .ss-alert__meta{
          margin-top:${theme.spacing.md}px;
          display:flex;
          align-items:center;
          gap:${theme.spacing.sm}px;
          flex-wrap:wrap;
        }
        .ss-alert__id{
          font-size: 11px;
          font-weight: ${theme.typography.weights.black};
          color: rgba(55,65,81,0.55);
          font-family:${theme.typography.monoFamily};
        }
        .ss-alert__right{ display:flex; align-items:center; gap:${theme.spacing.sm}px; }
      `}</style>
    </div>
  );
}
