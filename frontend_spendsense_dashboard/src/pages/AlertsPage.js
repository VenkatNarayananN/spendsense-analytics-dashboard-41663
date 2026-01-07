import React, { useCallback, useMemo, useState } from "react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { CardSkeleton } from "../components/ui/Skeleton";
import { alerts as allAlerts } from "../mockData";
import { theme } from "../theme";
import { useMockFetch } from "../hooks/useMockFetch";

function toneForSeverity(sev) {
  if (sev === "High") return "error";
  if (sev === "Medium") return "warning";
  return "info";
}

function uniq(arr) {
  return Array.from(new Set(arr)).sort((a, b) => String(a).localeCompare(String(b)));
}

/**
 * Simple heuristic "type" for mock alerts.
 */
function typeForAlert(a) {
  const s = `${a.title} ${a.detail}`.toLowerCase();
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
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");
  const [type, setType] = useState("All");

  const reset = useCallback(() => {
    setSearch("");
    setSeverity("All");
    setType("All");
  }, []);

  const severities = useMemo(() => uniq(allAlerts.map((a) => a.severity)), []);
  const types = useMemo(() => uniq(allAlerts.map((a) => typeForAlert(a))), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allAlerts.filter((a) => {
      const matchesQ =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.detail.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q);

      const matchesSeverity = severity === "All" ? true : a.severity === severity;
      const matchesType = type === "All" ? true : typeForAlert(a) === type;

      return matchesQ && matchesSeverity && matchesType;
    });
  }, [search, severity, type]);

  const fetchState = useMockFetch(
    () => filtered,
    [filtered.length, search, severity, type],
    { delayMs: 450 }
  );

  const activeCount = useMemo(() => {
    let n = 0;
    if (search.trim()) n += 1;
    if (severity !== "All") n += 1;
    if (type !== "All") n += 1;
    return n;
  }, [search, severity, type]);

  return (
    <div className="ss-page">
      <Card
        title="Alerts"
        subtitle="Anomaly and policy notifications (mock)"
        action={<Button variant="ghost" size="sm">Mark all as read</Button>}
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
              <Badge tone="info">{(fetchState.data || []).length} results</Badge>
              {activeCount > 0 && (
                <Button variant="secondary" size="sm" onClick={reset} aria-label="Clear filters">
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: theme.spacing.lg }}>
          {fetchState.loading ? (
            <div className="ss-skelStack">
              <CardSkeleton rows={2} />
              <CardSkeleton rows={2} />
              <CardSkeleton rows={2} />
            </div>
          ) : fetchState.data && fetchState.data.length > 0 ? (
            <div className="ss-alerts">
              {fetchState.data.map((a) => (
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
              onSecondaryAction={() => {
                // placeholder for future refresh action
                reset();
              }}
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
          font-weight: 900;
          color: rgba(226,232,240,0.72);
          letter-spacing: 0.25px;
        }

        .ss-input, .ss-select{
          border-radius:${theme.radii.lg}px;
          border:1px solid rgba(226,232,240,0.16);
          background: rgba(255,255,255,0.10);
          padding: 11px 14px;
          font-size: 13px;
          outline:none;
          transition: box-shadow 140ms ease, border-color 140ms ease, background 140ms ease;
          color: #F8FAFC;
          font-weight: 800;
        }
        .ss-input::placeholder{ color: rgba(226,232,240,0.56); font-weight: 800; }
        .ss-input:focus, .ss-select:focus{
          border-color: rgba(99,102,241,0.46);
          box-shadow: 0 0 0 4px rgba(99,102,241,0.22);
          background: rgba(255,255,255,0.14);
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
          border-radius:${theme.radii.lg}px;
          border:1px solid rgba(226,232,240,0.16);
          background: rgba(255,255,255,0.10);
          color: rgba(226,232,240,0.92);
        }
        .ss-alert__title{ font-size:13px; font-weight:900; color:#F8FAFC; }
        .ss-alert__detail{ margin-top:${theme.spacing.sm}px; font-size:12.5px; color: rgba(226,232,240,0.70); font-weight:700; line-height:1.55; }
        .ss-alert__meta{ margin-top:${theme.spacing.md}px; display:flex; align-items:center; gap:${theme.spacing.sm}px; flex-wrap:wrap; }
        .ss-alert__id{ font-size: 11px; font-weight: 900; color: rgba(226,232,240,0.60); font-family:${theme.typography.monoFamily}; }
        .ss-alert__right{ display:flex; align-items:center; }
      `}</style>
    </div>
  );
}
