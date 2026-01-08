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
          border: 1px solid ${theme.colors.border};
          border-radius:${theme.radii.xl}px;
          background: rgba(255,255,255,0.86);
          backdrop-filter: blur(10px);
          box-shadow: ${theme.shadows.sm};
        }

        .ss-table{
          width:100%;
          border-collapse:separate;
          border-spacing:0;
          min-width: 720px;
        }

        thead th{
          text-align:left;
          font-size:${theme.typography.sizes.xs}px;
          color:${theme.colors.textMuted};
          padding:${theme.spacing.md}px ${theme.spacing.lg}px;
          background: ${theme.gradients.header};
          position: sticky;
          top: 0;
          z-index: 1;
          border-bottom: 1px solid ${theme.colors.borderSubtle};
          font-weight: ${theme.typography.weights.black};
          letter-spacing: 0.25px;
        }

        tbody td{
          padding:${theme.spacing.md}px ${theme.spacing.lg}px;
          border-bottom: 1px solid ${theme.colors.borderSubtle};
          color:${theme.colors.text};
          font-size:${theme.typography.sizes.sm}px;
          font-weight: ${theme.typography.weights.semibold};
          background: rgba(255,255,255,0.82);
        }

        tbody tr:hover td{
          background: rgba(244,114,182,0.06);
        }

        tbody tr:last-child td{
          border-bottom:none;
        }
      `}</style>
    </div>
  );
}
