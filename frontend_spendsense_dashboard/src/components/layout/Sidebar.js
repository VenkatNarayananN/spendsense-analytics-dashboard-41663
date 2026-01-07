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
          <div className="ss-sidebar__logo" aria-hidden="true">
            SS
          </div>
          <div className="ss-sidebar__brandText">
            <div className="ss-sidebar__name">SpendSense</div>
            <div className="ss-sidebar__tag">Analytics</div>
          </div>
        </div>

        <nav className="ss-sidebar__nav">
          {navItems.map((it) => (
            <NavLink
              key={it.key}
              to={it.path}
              end={it.path === "/"}
              className={({ isActive }) =>
                `ss-sidebar__link ${isActive ? "active" : ""}`
              }
              onClick={onClose}
            >
              <span className="ss-sidebar__dot" aria-hidden="true" />
              <span className="ss-sidebar__label">{it.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="ss-sidebar__footer">
          <div className="ss-sidebar__meta">
            <div className="ss-sidebar__metaTitle">Ocean Professional</div>
            <div className="ss-sidebar__metaSub">Elegant • Pastels • Calm</div>
          </div>
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
          width: 272px;
          background: ${theme.colors.surface};
          border-right: 1px solid ${theme.colors.border};
          padding: ${theme.spacing.xl}px ${theme.spacing.lg}px;
          display:flex;
          flex-direction:column;
          gap:${theme.spacing.xl}px;
        }

        .ss-sidebar__brand{
          display:flex;
          align-items:center;
          gap:${theme.spacing.md}px;
          padding:${theme.spacing.md}px;
          border-radius:${theme.radii.lg}px;
          background: ${theme.gradients.primarySoft};
          border: 1px solid rgba(244,114,182,0.20);
        }
        .ss-sidebar__logo{
          width:44px;
          height:44px;
          border-radius:${theme.radii.md}px;
          background: ${theme.colors.primary};
          color:#111827;
          font-weight:900;
          display:flex;
          align-items:center;
          justify-content:center;
          letter-spacing:0.6px;
          box-shadow: 0 8px 20px rgba(244,114,182,0.25);
        }
        .ss-sidebar__name{ font-weight: 900; color:${theme.colors.text}; font-size:14px; }
        .ss-sidebar__tag{ margin-top:2px; font-size:12px; color:${theme.colors.mutedText}; font-weight:600; }

        .ss-sidebar__nav{
          display:flex;
          flex-direction:column;
          gap:${theme.spacing.sm}px;
        }
        .ss-sidebar__link{
          display:flex;
          align-items:center;
          gap:${theme.spacing.md}px;
          padding:${theme.spacing.md}px ${theme.spacing.md}px;
          border-radius:${theme.radii.md}px;
          border: 1px solid transparent;
          text-decoration:none;
          color:${theme.colors.text};
          font-weight:800;
          font-size:13px;
          letter-spacing:0.2px;
          transition: background 140ms ease, transform 140ms ease, border-color 140ms ease;
        }
        .ss-sidebar__dot{
          width:10px;
          height:10px;
          border-radius:${theme.radii.pill}px;
          background: rgba(55,65,81,0.25);
        }
        .ss-sidebar__link:hover{
          background: rgba(244,114,182,0.08);
          transform: translateY(-1px);
          border-color: rgba(244,114,182,0.25);
        }
        .ss-sidebar__link.active{
          background: rgba(245,158,11,0.10);
          border-color: rgba(245,158,11,0.30);
        }
        .ss-sidebar__link.active .ss-sidebar__dot{
          background:${theme.colors.secondary};
        }

        .ss-sidebar__footer{
          margin-top:auto;
          padding:${theme.spacing.md}px;
          border-radius:${theme.radii.lg}px;
          border: 1px solid ${theme.colors.border};
          background: rgba(253,242,248,0.65);
        }
        .ss-sidebar__metaTitle{ font-size:12px; font-weight:900; color:${theme.colors.text}; }
        .ss-sidebar__metaSub{ margin-top:2px; font-size:11px; color:${theme.colors.mutedText}; font-weight:700; }

        /* Mobile */
        .ss-sidebarBackdrop{ display:none; }
        @media (max-width: 980px){
          .ss-sidebar{
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 50;
            transform: translateX(-110%);
            transition: transform 180ms ease;
            box-shadow: 18px 0 40px rgba(17,24,39,0.18);
          }
          .ss-sidebar.open{ transform: translateX(0); }
          .ss-sidebarBackdrop{
            display:block;
            position: fixed;
            inset: 0;
            background: rgba(17,24,39,0.36);
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
