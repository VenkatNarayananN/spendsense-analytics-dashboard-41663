import React from "react";
import { NavLink } from "react-router-dom";
import { navItems, theme } from "../../theme";

/**
 * PUBLIC_INTERFACE
 */
export function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <aside className={`ss-sidebar ${isOpen ? "open" : ""}`} aria-label="Primary">
        <div className="ss-sidebar__brand">
          <div className="ss-sidebar__name">SpendSense</div>
          <div className="ss-sidebar__tag">Analytics Dashboard</div>
        </div>

        <nav className="ss-sidebar__nav">
          {navItems.map((it) => (
            <NavLink
              key={it.key}
              to={it.path}
              end={it.path === "/"}
              className={({ isActive }) => `ss-sidebar__link ${isActive ? "active" : ""}`}
              onClick={onClose}
            >
              <span className="ss-sidebar__icon" aria-hidden="true" />
              <span className="ss-sidebar__label">{it.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="ss-sidebar__footer">
          <div className="ss-sidebar__metaTitle">Overview</div>
          <div className="ss-sidebar__metaSub">Clean • Bright • Orange accent</div>
        </div>
      </aside>

      <div
        className={`ss-sidebarBackdrop ${isOpen ? "show" : ""}`}
        onClick={onClose}
        role="button"
        tabIndex={-1}
        aria-label="Close navigation"
      />

      <style>{`
        .ss-sidebar{
          width:${theme.layout.sidebarWidth}px;
          padding:${theme.spacing.xl}px ${theme.spacing.lg}px;
          display:flex;
          flex-direction:column;
          gap:${theme.spacing.lg}px;

          background:${theme.colors.sidebar};
          border-right: 1px solid ${theme.colors.border};
        }

        .ss-sidebar__brand{
          padding:${theme.spacing.md}px;
        }

        .ss-sidebar__name{
          font-size:${theme.typography.sizes.lg}px;
          font-weight:${theme.typography.weights.bold};
          color:${theme.colors.textStrong};
          line-height:${theme.typography.lineHeights.tight};
        }

        .ss-sidebar__tag{
          margin-top:2px;
          font-size:${theme.typography.sizes.sm}px;
          font-weight:${theme.typography.weights.medium};
          color:${theme.colors.textMuted};
        }

        .ss-sidebar__nav{
          display:flex;
          flex-direction:column;
          gap:6px;
        }

        .ss-sidebar__link{
          height: 40px;
          padding: 8px 10px;
          border-radius:${theme.radii.md}px;

          display:flex;
          align-items:center;
          gap:10px;

          text-decoration:none;
          color:${theme.colors.text};
          font-size:${theme.typography.sizes.sm}px;
          font-weight:${theme.typography.weights.medium};

          border: 1px solid transparent;
          transition: background 140ms ease, border-color 140ms ease, transform 140ms ease, color 140ms ease;
        }

        .ss-sidebar__icon{
          width:16px;
          height:16px;
          border-radius: 999px;
          background: ${theme.colors.textMuted};
          opacity:0.25;
          flex:0 0 auto;
        }

        .ss-sidebar__link:hover{
          background: rgba(249,115,22,0.06);
          transform: translateY(-1px);
          border-color: rgba(249,115,22,0.10);
        }

        .ss-sidebar__link.active{
          background: rgba(249,115,22,0.10);
          border-color: rgba(249,115,22,0.16);
          color:${theme.colors.textStrong};
        }

        .ss-sidebar__link.active .ss-sidebar__icon{
          background:${theme.colors.orange};
          opacity:1;
        }

        .ss-sidebar__footer{
          margin-top:auto;
          padding:${theme.spacing.md}px;
          border-radius:${theme.radii.lg}px;
          border: 1px solid ${theme.colors.borderSubtle};
          background:${theme.colors.mutedSurface};
        }

        .ss-sidebar__metaTitle{
          font-size:${theme.typography.sizes.sm}px;
          font-weight:${theme.typography.weights.semibold};
          color:${theme.colors.textStrong};
        }

        .ss-sidebar__metaSub{
          margin-top:2px;
          font-size:${theme.typography.sizes.xs}px;
          font-weight:${theme.typography.weights.medium};
          color:${theme.colors.textMuted};
          line-height:${theme.typography.lineHeights.normal};
        }

        /* Mobile/tablet drawer */
        .ss-sidebarBackdrop{ display:none; }

        @media (max-width: 1024px){
          .ss-sidebar{
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 50;
            transform: translateX(-110%);
            transition: transform 180ms ease;
            box-shadow: ${theme.shadows.md};
          }
          .ss-sidebar.open{ transform: translateX(0); }

          .ss-sidebarBackdrop{
            display:block;
            position: fixed;
            inset: 0;
            background: rgba(17,24,39,0.35);
            opacity: 0;
            pointer-events: none;
            z-index: 40;
            transition: opacity 180ms ease;
          }
          .ss-sidebarBackdrop.show{
            opacity: 1;
            pointer-events: auto;
          }
        }
      `}</style>
    </>
  );
}
