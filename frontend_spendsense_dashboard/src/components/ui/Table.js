import React from "react";
import { theme } from "../../theme";

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
          border: 1px solid rgba(226,232,240,0.18);
          border-radius:${theme.radii.lg}px;
          background:${theme.colors.surfaceSolid};
          box-shadow: ${theme.colors.shadowSm};
        }
        .ss-table{
          width:100%;
          border-collapse:separate;
          border-spacing:0;
          min-width: 720px;
        }
        thead th{
          text-align:left;
          font-size:12px;
          color:${theme.colors.mutedText};
          padding:${theme.spacing.md}px ${theme.spacing.lg}px;
          background: rgba(99,102,241,0.10);
          position: sticky;
          top: 0;
          z-index: 1;
          border-bottom: 1px solid rgba(226,232,240,0.20);
          font-weight: 900;
        }
        tbody td{
          padding:${theme.spacing.md}px ${theme.spacing.lg}px;
          border-bottom: 1px solid rgba(15,23,42,0.10);
          color:${theme.colors.text};
          font-size:13px;
          font-weight: 700;
          background: ${theme.colors.surfaceSolid};
        }
        tbody tr:hover td{
          background: rgba(6,182,212,0.06);
        }
        tbody tr:last-child td{
          border-bottom:none;
        }
      `}</style>
    </div>
  );
}
