import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card } from "../components/ui/Card";
import { Table } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { LiveBadge } from "../components/ui/LiveBadge";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { TableSkeleton } from "../components/ui/Skeleton";
import { theme } from "../theme";
import { useAuth } from "../auth/AuthContext";
import { listTransactions } from "../lib/supabaseClient/db";
import { subscribeToTableChanges } from "../lib/supabaseClient/realtime";
import { useDemo } from "../demo/DemoContext";
import { getDemoTransactions, makeDemoTransactionId } from "../demo/demoData";

function formatMoney(v) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(v);
}

function uniq(arr) {
  return Array.from(new Set(arr)).sort((a, b) => String(a).localeCompare(String(b)));
}

function inRange(n, min, max) {
  if (typeof n !== "number") return false;
  if (min !== "" && typeof min === "number" && n < min) return false;
  if (max !== "" && typeof max === "number" && n > max) return false;
  return true;
}

function inDateRange(iso, from, to) {
  if (!iso) return false;
  const d = new Date(iso + "T00:00:00");
  if (from) {
    const f = new Date(from + "T00:00:00");
    if (d < f) return false;
  }
  if (to) {
    const t = new Date(to + "T00:00:00");
    if (d > t) return false;
  }
  return true;
}

/**
 * PUBLIC_INTERFACE
 */
export function TransactionsPage() {
  const { session, user, supabaseConfigured } = useAuth();
  const { demoMode } = useDemo();

  // Data state
  const [rows, setRows] = useState([]);
  const [fetchState, setFetchState] = useState({ loading: true, error: null });

  // Demo-only create state (local-only; no Supabase writes).
  const [demoCreate, setDemoCreate] = useState({
    open: false,
    merchant: "",
    category: "Groceries",
    method: "Card •••• 2048",
    amount: "",
    status: "Cleared",
    date: new Date().toISOString().slice(0, 10),
  });

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");

  const resetFilters = useCallback(() => {
    setSearch("");
    setStatus("All");
    setCategory("All");
    setDateFrom("");
    setDateTo("");
    setAmountMin("");
    setAmountMax("");
  }, []);

  const load = useCallback(async () => {
    // Demo mode: render immediately with mock data, no buffering.
    if (demoMode) {
      setRows(getDemoTransactions());
      setFetchState({ loading: false, error: null });
      return;
    }

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
      const data = await listTransactions({ userId: session.user.id });
      setRows(Array.isArray(data) ? data : []);
      setFetchState({ loading: false, error: null });
    } catch (e) {
      setRows([]);
      setFetchState({ loading: false, error: e });
    }
  }, [demoMode, session?.user?.id, session, supabaseConfigured]);

  // Fetch on mount/session changes (demo mode should still populate instantly)
  useEffect(() => {
    load();
  }, [load]);

  // Realtime subscription (disabled in demo mode)
  const subRef = useRef(null);
  useEffect(() => {
    let alive = true;

    async function sub() {
      if (demoMode) return;
      if (!supabaseConfigured || !user?.id) return;
      try {
        const s = await subscribeToTableChanges({
          table: "transactions",
          filter: `user_id=eq.${user.id}`,
          onChange: () => {
            // simplest reliable path: refetch on any change
            if (alive) load();
          },
        });
        subRef.current = s;
      } catch (e) {
        // do not fail the page if realtime is unavailable; data still loads via fetch
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
  }, [demoMode, load, supabaseConfigured, user?.id]);

  const categories = useMemo(() => uniq(rows.map((t) => t.category).filter(Boolean)), [rows]);
  const statuses = useMemo(() => uniq(rows.map((t) => t.status).filter(Boolean)), [rows]);

  const activeFilters = useMemo(() => {
    const chips = [];
    if (search.trim())
      chips.push({ key: "search", label: `Search: “${search.trim()}”`, onRemove: () => setSearch("") });
    if (status !== "All")
      chips.push({ key: "status", label: `Status: ${status}`, onRemove: () => setStatus("All") });
    if (category !== "All")
      chips.push({ key: "category", label: `Category: ${category}`, onRemove: () => setCategory("All") });
    if (dateFrom) chips.push({ key: "from", label: `From: ${dateFrom}`, onRemove: () => setDateFrom("") });
    if (dateTo) chips.push({ key: "to", label: `To: ${dateTo}`, onRemove: () => setDateTo("") });
    if (amountMin !== "")
      chips.push({ key: "min", label: `Min: ${formatMoney(Number(amountMin))}`, onRemove: () => setAmountMin("") });
    if (amountMax !== "")
      chips.push({ key: "max", label: `Max: ${formatMoney(Number(amountMax))}`, onRemove: () => setAmountMax("") });
    return chips;
  }, [amountMax, amountMin, category, dateFrom, dateTo, search, status]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const min = amountMin === "" ? "" : Number(amountMin);
    const max = amountMax === "" ? "" : Number(amountMax);

    return rows.filter((t) => {
      const matchesQ =
        !q ||
        String(t.merchant || "").toLowerCase().includes(q) ||
        String(t.category || "").toLowerCase().includes(q) ||
        String(t.method || "").toLowerCase().includes(q) ||
        String(t.id || "").toLowerCase().includes(q);

      const matchesStatus = status === "All" ? true : t.status === status;
      const matchesCategory = category === "All" ? true : t.category === category;
      const matchesDate = inDateRange(t.date, dateFrom, dateTo);
      const matchesAmount = inRange(Number(t.amount), min, max);

      return matchesQ && matchesStatus && matchesCategory && matchesDate && matchesAmount;
    });
  }, [amountMax, amountMin, category, dateFrom, dateTo, rows, search, status]);

  const columns = [
    { key: "date", header: "Date", width: "120px" },
    { key: "merchant", header: "Merchant" },
    { key: "category", header: "Category", width: "140px" },
    { key: "method", header: "Method", width: "160px" },
    {
      key: "amount",
      header: "Amount",
      width: "140px",
      render: (r) => <strong>{formatMoney(r.amount)}</strong>,
    },
    {
      key: "status",
      header: "Status",
      width: "140px",
      render: (r) => <Badge tone={r.status === "Pending" ? "warning" : "success"}>{r.status}</Badge>,
    },
  ];

  const showEmpty =
    !fetchState.loading && !fetchState.error && Array.isArray(filtered) && filtered.length === 0;

  return (
    <div className="ss-page">
      <Card
        title="Transactions"
        subtitle={demoMode ? "Demo mode: add and filter transactions locally (no sync)." : "Filter, search, and export your activity."}
        action={
          <div style={{ display: "flex", gap: theme.spacing.sm, alignItems: "center" }}>
            {!demoMode ? <LiveBadge /> : <Badge tone="warning">Demo</Badge>}
            {demoMode ? (
              <Button variant="primary" size="sm" onClick={() => setDemoCreate((s) => ({ ...s, open: !s.open }))}>
                {demoCreate.open ? "Close" : "New transaction"}
              </Button>
            ) : (
              <Button variant="primary" size="sm">
                Export
              </Button>
            )}
          </div>
        }
      >
        {demoMode && demoCreate.open && (
          <div className="ss-demoCreate" aria-label="Create demo transaction">
            <div className="ss-demoCreate__title">New transaction (demo only)</div>
            <div className="ss-demoCreate__grid">
              <label className="ss-field">
                <span className="ss-field__label">Merchant</span>
                <input
                  className="ss-input ss-input--dense"
                  value={demoCreate.merchant}
                  onChange={(e) => setDemoCreate((s) => ({ ...s, merchant: e.target.value }))}
                  placeholder="e.g., Nimbus Grocers"
                />
              </label>

              <label className="ss-field">
                <span className="ss-field__label">Category</span>
                <input
                  className="ss-input ss-input--dense"
                  value={demoCreate.category}
                  onChange={(e) => setDemoCreate((s) => ({ ...s, category: e.target.value }))}
                  placeholder="e.g., Groceries"
                />
              </label>

              <label className="ss-field">
                <span className="ss-field__label">Method</span>
                <input
                  className="ss-input ss-input--dense"
                  value={demoCreate.method}
                  onChange={(e) => setDemoCreate((s) => ({ ...s, method: e.target.value }))}
                  placeholder="e.g., Card •••• 2048"
                />
              </label>

              <label className="ss-field">
                <span className="ss-field__label">Date</span>
                <input
                  className="ss-input ss-input--dense"
                  type="date"
                  value={demoCreate.date}
                  onChange={(e) => setDemoCreate((s) => ({ ...s, date: e.target.value }))}
                />
              </label>

              <label className="ss-field">
                <span className="ss-field__label">Amount</span>
                <input
                  className="ss-input ss-input--dense"
                  inputMode="decimal"
                  value={demoCreate.amount}
                  onChange={(e) => setDemoCreate((s) => ({ ...s, amount: e.target.value }))}
                  placeholder="0.00"
                />
              </label>

              <label className="ss-field">
                <span className="ss-field__label">Status</span>
                <select
                  className="ss-select ss-select--dense"
                  value={demoCreate.status}
                  onChange={(e) => setDemoCreate((s) => ({ ...s, status: e.target.value }))}
                >
                  <option>Cleared</option>
                  <option>Pending</option>
                </select>
              </label>
            </div>

            <div className="ss-demoCreate__actions">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const amt = Number(demoCreate.amount);
                  const safeAmt = Number.isFinite(amt) ? amt : 0;
                  const merchant = demoCreate.merchant.trim() || "New merchant";

                  setRows((prev) => [
                    {
                      id: makeDemoTransactionId(),
                      date: demoCreate.date || new Date().toISOString().slice(0, 10),
                      merchant,
                      category: demoCreate.category || "Uncategorized",
                      method: demoCreate.method || "Card",
                      amount: safeAmt,
                      status: demoCreate.status || "Cleared",
                    },
                    ...prev,
                  ]);

                  setDemoCreate((s) => ({
                    ...s,
                    merchant: "",
                    amount: "",
                    open: false,
                  }));
                }}
              >
                Add (local)
              </Button>

              <Badge tone="info">This change is not saved to Supabase.</Badge>
            </div>
          </div>
        )}

        <div className="ss-controls" aria-label="Transaction filters">
          <input
            className="ss-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search merchant, category, method, id…"
            aria-label="Search transactions"
          />

          <div className="ss-row">
            <label className="ss-field">
              <span className="ss-field__label">Date from</span>
              <input
                className="ss-input ss-input--dense"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                aria-label="Filter date from"
              />
            </label>
            <label className="ss-field">
              <span className="ss-field__label">Date to</span>
              <input
                className="ss-input ss-input--dense"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                aria-label="Filter date to"
              />
            </label>
          </div>

          <div className="ss-row">
            <label className="ss-field">
              <span className="ss-field__label">Category</span>
              <select
                className="ss-select ss-select--dense"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Filter by category"
              >
                <option>All</option>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>

            <label className="ss-field">
              <span className="ss-field__label">Status</span>
              <select
                className="ss-select ss-select--dense"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                aria-label="Filter by status"
              >
                <option>All</option>
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>

            <label className="ss-field">
              <span className="ss-field__label">Min amount</span>
              <input
                className="ss-input ss-input--dense"
                inputMode="decimal"
                value={amountMin}
                onChange={(e) => setAmountMin(e.target.value)}
                placeholder="0"
                aria-label="Filter minimum amount"
              />
            </label>

            <label className="ss-field">
              <span className="ss-field__label">Max amount</span>
              <input
                className="ss-input ss-input--dense"
                inputMode="decimal"
                value={amountMax}
                onChange={(e) => setAmountMax(e.target.value)}
                placeholder="1000"
                aria-label="Filter maximum amount"
              />
            </label>

            <div className="ss-controls__actions">
              <Button variant="secondary" size="sm" onClick={resetFilters} aria-label="Reset filters">
                Reset
              </Button>
              <Button variant="ghost" size="sm" onClick={load} aria-label="Refresh transactions">
                Refresh
              </Button>
              <Badge tone="info">{filtered.length} results</Badge>
            </div>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="ss-chips" aria-label="Active filters">
            {activeFilters.map((c) => (
              <button
                key={c.key}
                className="ss-chip"
                type="button"
                onClick={c.onRemove}
                aria-label={`Remove filter: ${c.label}`}
              >
                <span className="ss-chip__label">{c.label}</span>
                <span className="ss-chip__x" aria-hidden="true">
                  ×
                </span>
              </button>
            ))}
            <button className="ss-chip ss-chip--link" type="button" onClick={resetFilters}>
              Clear all
            </button>
          </div>
        )}

        <div style={{ marginTop: theme.spacing.lg }}>
          {fetchState.loading && !demoMode ? (
            <TableSkeleton columns={6} rows={7} />
          ) : fetchState.error ? (
            <EmptyState
              icon="⚠"
              title="Unable to load transactions"
              description={fetchState.error?.message || "An unexpected error occurred while loading your transactions."}
              primaryActionLabel="Retry"
              onPrimaryAction={load}
            />
          ) : showEmpty ? (
            <EmptyState
              icon="⧉"
              title="No transactions match these filters"
              description="Try widening the date/amount range, clearing filters, or adjusting your search."
              primaryActionLabel="Reset filters"
              onPrimaryAction={resetFilters}
              secondaryActionLabel="Clear search"
              onSecondaryAction={() => setSearch("")}
            />
          ) : (
            <Table columns={columns} rows={filtered} getRowKey={(r) => r.id} />
          )}
        </div>
      </Card>

      <style>{`
        .ss-page{ display:flex; flex-direction:column; gap:${theme.spacing.xl}px; }

        .ss-demoCreate{
          margin-top:${theme.spacing.md}px;
          padding:${theme.spacing.lg}px;
          border-radius:${theme.radii.xl}px;
          border: 1px dashed color-mix(in srgb, var(--brand-primary) 45%, transparent);
          background: var(--grad-stripe-subtle);
          box-shadow: ${theme.shadows.sm};
        }
        .ss-demoCreate__title{
          font-size: 13px;
          font-weight:${theme.typography.weights.black};
          color:${theme.colors.textStrong};
        }
        .ss-demoCreate__grid{
          margin-top:${theme.spacing.md}px;
          display:grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap:${theme.spacing.md}px;
        }
        .ss-demoCreate__actions{
          margin-top:${theme.spacing.md}px;
          display:flex;
          flex-wrap:wrap;
          gap:${theme.spacing.md}px;
          align-items:center;
        }

        .ss-controls{
          display:flex;
          flex-direction:column;
          gap:${theme.spacing.md}px;
        }

        .ss-row{
          display:flex;
          flex-wrap:wrap;
          gap:${theme.spacing.md}px;
          align-items:flex-end;
        }

        .ss-field{
          display:flex;
          flex-direction:column;
          gap:${theme.spacing.xs}px;
          min-width: 160px;
          flex: 1;
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
        .ss-input{ width: 100%; }
        .ss-select{ font-weight:${theme.typography.weights.black}; }

        .ss-input:focus, .ss-select:focus{
          border-color: color-mix(in srgb, var(--brand-primary) 42%, transparent);
          box-shadow: 0 0 0 4px var(--focus-soft);
          background: color-mix(in srgb, var(--bg-card) 96%, transparent);
        }

        .ss-input--dense, .ss-select--dense{
          padding: 10px 12px;
          font-size: 12.5px;
        }

        .ss-controls__actions{
          margin-left:auto;
          display:flex;
          gap:${theme.spacing.md}px;
          align-items:center;
          flex-wrap:wrap;
        }

        .ss-chips{
          margin-top:${theme.spacing.md}px;
          display:flex;
          flex-wrap:wrap;
          gap:${theme.spacing.sm}px;
        }

        .ss-chip{
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding: 8px 10px;
          border-radius:${theme.radii.pill}px;
          border: 1px solid ${theme.colors.border};
          background: rgba(255,255,255,0.78);
          color: ${theme.colors.text};
          font-size: 12px;
          font-weight: ${theme.typography.weights.black};
          cursor:pointer;
          transition: transform 120ms ease, background 120ms ease, border-color 120ms ease;
          backdrop-filter: blur(10px);
        }

        .ss-chip:hover{
          background: var(--grad-accent-soft);
          border-color: color-mix(in srgb, var(--brand-primary) 20%, transparent);
          transform: translateY(-1px);
        }

        .ss-chip:focus-visible{
          outline: 3px solid ${theme.effects.focusRing};
          outline-offset: 2px;
        }

        .ss-chip__x{
          width: 18px;
          height: 18px;
          display:flex;
          align-items:center;
          justify-content:center;
          border-radius: ${theme.radii.pill}px;
          background: rgba(55,65,81,0.08);
        }

        .ss-chip--link{
          background: transparent;
          border-style: dashed;
          color: ${theme.colors.text};
        }

        @media (max-width: 1100px){
          .ss-demoCreate__grid{ grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
