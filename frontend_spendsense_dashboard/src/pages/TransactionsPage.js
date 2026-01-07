import React, { useMemo, useState } from "react";
import { Card } from "../components/ui/Card";
import { Table } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { transactions as allTx } from "../mockData";
import { theme } from "../theme";

function formatMoney(v) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(v);
}

/**
 * PUBLIC_INTERFACE
 */
export function TransactionsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allTx.filter((t) => {
      const matchesQ =
        !q ||
        t.merchant.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.method.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q);

      const matchesStatus = status === "All" ? true : t.status === status;
      return matchesQ && matchesStatus;
    });
  }, [query, status]);

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
        <Badge tone={r.status === "Pending" ? "warning" : "success"}>
          {r.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="ss-page">
      <Card
        title="Transactions"
        subtitle="Search and filter your activity. (Mock data)"
        action={<Button variant="primary" size="sm">Export</Button>}
      >
        <div className="ss-controls">
          <input
            className="ss-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search merchant, category, id…"
            aria-label="Search transactions"
          />
          <select
            className="ss-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter by status"
          >
            <option>All</option>
            <option>Cleared</option>
            <option>Pending</option>
          </select>
          <div className="ss-controls__meta">
            <Badge tone="info">{filtered.length} results</Badge>
          </div>
        </div>

        <div style={{ marginTop: theme.spacing.lg }}>
          <Table columns={columns} rows={filtered} getRowKey={(r) => r.id} />
        </div>
      </Card>

      <style>{`
        .ss-page{ display:flex; flex-direction:column; gap:${theme.spacing.xl}px; }
        .ss-controls{
          display:flex;
          flex-wrap:wrap;
          gap:${theme.spacing.md}px;
          align-items:center;
        }
        .ss-controls__meta{ margin-left:auto; }
        .ss-input, .ss-select{
          border-radius:${theme.radii.lg}px;
          border:1px solid ${theme.colors.border};
          background:${theme.colors.surface};
          padding: 11px 14px;
          font-size: 13px;
          outline:none;
          transition: box-shadow 140ms ease, border-color 140ms ease;
        }
        .ss-input{ flex:1; min-width: 260px; }
        .ss-select{ min-width: 170px; font-weight:800; color:${theme.colors.text}; }
        .ss-input:focus, .ss-select:focus{
          border-color: rgba(244,114,182,0.45);
          box-shadow: 0 0 0 4px rgba(244,114,182,0.18);
        }
      `}</style>
    </div>
  );
}
