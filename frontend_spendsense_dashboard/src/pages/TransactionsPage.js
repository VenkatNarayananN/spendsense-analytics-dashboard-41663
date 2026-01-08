import React, { useCallback, useMemo, useState } from "react";
import { Card } from "../components/ui/Card";
import { Table } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { TableSkeleton } from "../components/ui/Skeleton";
import { transactions as allTx } from "../mockData";
import { theme } from "../theme";
import { useMockFetch } from "../hooks/useMockFetch";

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

  const categories = useMemo(() => uniq(allTx.map((t) => t.category)), []);
  const statuses = useMemo(() => uniq(allTx.map((t) => t.status)), []);

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

    return allTx.filter((t) => {
      const matchesQ =
        !q ||
        t.merchant.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.method.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q);

      const matchesStatus = status === "All" ? true : t.status === status;
      const matchesCategory = category === "All" ? true : t.category === category;
      const matchesDate = inDateRange(t.date, dateFrom, dateTo);
      const matchesAmount = inRange(Number(t.amount), min, max);

      return matchesQ && matchesStatus && matchesCategory && matchesDate && matchesAmount;
    });
  }, [amountMax, amountMin, category, dateFrom, dateTo, search, status]);

  // Mock async layer (for Supabase readiness)
  const fetchState = useMockFetch(
    () => filtered,
    [filtered.length, search, status, category, dateFrom, dateTo, amountMin, amountMax],
    { delayMs: 550 }
  );

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
      render: (r) => (
        <Badge tone={r.status === "Pending" ? "warning" : "success"}>{r.status}</Badge>
      ),
    },
  ];

  return (
    <div className="ss-page">
      <Card
        title="Transactions"
        subtitle="Filter, search, and export your activity. (Mock data)"
        action={<Button variant="primary" size="sm">Export</Button>}
      >
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
              <Badge tone="info">{(fetchState.data || []).length} results</Badge>
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
                <span className="ss-chip__x" aria-hidden="true">×</span>
              </button>
            ))}
            <button className="ss-chip ss-chip--link" type="button" onClick={resetFilters}>
              Clear all
            </button>
          </div>
        )}

        <div style={{ marginTop: theme.spacing.lg }}>
          {fetchState.loading ? (
            <TableSkeleton columns={6} rows={7} />
          ) : fetchState.data && fetchState.data.length > 0 ? (
            <Table columns={columns} rows={fetchState.data} getRowKey={(r) => r.id} />
          ) : (
            <EmptyState
              icon="⧉"
              title="No transactions match these filters"
              description="Try widening the date/amount range, clearing filters, or adjusting your search."
              primaryActionLabel="Reset filters"
              onPrimaryAction={resetFilters}
              secondaryActionLabel="Clear search"
              onSecondaryAction={() => setSearch("")}
            />
          )}
        </div>
      </Card>

      <style>{`
        .ss-page{ display:flex; flex-direction:column; gap:${theme.spacing.xl}px; }

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
          border-color: rgba(244,114,182,0.42);
          box-shadow: 0 0 0 4px rgba(244,114,182,0.18);
          background: rgba(255,255,255,0.98);
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
          background: ${theme.gradients.accentSoft};
          border-color: rgba(244,114,182,0.20);
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
      `}</style>
    </div>
  );
}
