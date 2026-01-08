import React from "react";

/**
 * PUBLIC_INTERFACE
 */
export function Table({ columns, rows, getRowKey }) {
  return (
    <div className="ss-tableWrap">
      <table className="ss-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={{ width: c.width || "auto" }}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={(getRowKey && getRowKey(r)) || idx}>
              {columns.map((c) => (
                <td key={c.key}>{c.render ? c.render(r) : r[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .ss-tableWrap{
          width:100%;
          overflow:auto;
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          background: color-mix(in srgb, var(--bg-card) 86%, transparent);
          backdrop-filter: blur(10px);
          box-shadow: var(--shadow-sm);
          transition: var(--theme-transitions);
        }

        .ss-table{
          width:100%;
          border-collapse:separate;
          border-spacing:0;
          min-width: 720px;
        }

        thead th{
          text-align:left;
          font-size: var(--text-xs);
          color: var(--text-muted);
          padding:16px 20px;
          background: var(--grad-header);
          position: sticky;
          top: 0;
          z-index: 1;
          border-bottom: 1px solid var(--border-subtle);
          font-weight: var(--weight-black);
          letter-spacing: 0.25px;
          transition: var(--theme-transitions);
        }

        tbody td{
          padding:16px 20px;
          border-bottom: 1px solid var(--border-subtle);
          color: var(--text-default);
          font-size: var(--text-sm);
          font-weight: var(--weight-semibold);
          background: color-mix(in srgb, var(--bg-card) 82%, transparent);
          transition: var(--theme-transitions);
        }

        tbody tr:hover td{
          background: color-mix(in srgb, var(--brand-primary) 6%, transparent);
        }

        tbody tr:last-child td{
          border-bottom:none;
        }
      `}</style>
    </div>
  );
}
