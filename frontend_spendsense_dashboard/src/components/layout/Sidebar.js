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
            <div className="ss-sidebar__tag">Fintech Analytics</div>
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
            <div className="ss-sidebar__metaTitle">Modern Fintech</div>
            <div className="ss-sidebar__metaSub">Crisp • Accessible • Fast</div>
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
          width: 288px;
          padding: ${theme.spacing.xl}px ${theme.spacing.lg}px;
          display:flex;
          flex-direction:column;
          gap:${theme.spacing.xl}px;

          background:
            radial-gradient(520px 320px at 18% 6%, rgba(99,102,241,0.30) 0%, rgba(99,102,241,0.00) 62%),
            radial-gradient(520px 320px at 84% 16%, rgba(6,182,212,0.22) 0%, rgba(6,182,212,0.00) 60%),
            linear-gradient(180deg, rgba(15,23,42,0.92) 0%, rgba(2,6,23,0.90) 100%);
          border-right: 1px solid rgba(226,232,240,0.12);
          color: #E5E7EB;
        }

        .ss-sidebar__brand{
          display:flex;
          align-items:center;
          gap:${theme.spacing.md}px;
          padding:${theme.spacing.md}px;
          border-radius:${theme.radii.lg}px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(226,232,240,0.14);
          box-shadow: 0 16px 40px rgba(2,6,23,0.26);
        }
        .ss-sidebar__logo{
          width:44px;
          height:44px;
          border-radius:${theme.radii.md}px;
          background: ${theme.gradients.accent};
          color:#FFFFFF;
          font-weight:900;
          display:flex;
          align-items:center;
          justify-content:center;
          letter-spacing:0.6px;
          box-shadow: 0 16px 36px rgba(2,6,23,0.30);
        }
        .ss-sidebar__name{ font-weight: 900; color:#F8FAFC; font-size:14px; }
        .ss-sidebar__tag{ margin-top:2px; font-size:12px; color: rgba(226,232,240,0.72); font-weight:700; }

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
          color: rgba(226,232,240,0.88);
          font-weight:900;
          font-size:13px;
          letter-spacing:0.2px;
          transition: background 140ms ease, transform 140ms ease, border-color 140ms ease, color 140ms ease;
        }
        .ss-sidebar__dot{
          width:10px;
          height:10px;
          border-radius:${theme.radii.pill}px;
          background: rgba(226,232,240,0.32);
        }
        .ss-sidebar__link:hover{
          background: rgba(226,232,240,0.08);
          transform: translateY(-1px);
          border-color: rgba(226,232,240,0.14);
          color: #F8FAFC;
        }
        .ss-sidebar__link.active{
          background: rgba(99,102,241,0.20);
          border-color: rgba(99,102,241,0.30);
          color:#F8FAFC;
        }
        .ss-sidebar__link.active .ss-sidebar__dot{
          background:${theme.colors.secondary};
        }

        .ss-sidebar__footer{
          margin-top:auto;
          padding:${theme.spacing.md}px;
          border-radius:${theme.radii.lg}px;
          border: 1px solid rgba(226,232,240,0.14);
          background: rgba(255,255,255,0.06);
        }
        .ss-sidebar__metaTitle{ font-size:12px; font-weight:900; color:#F8FAFC; }
        .ss-sidebar__metaSub{ margin-top:2px; font-size:11px; color: rgba(226,232,240,0.70); font-weight:700; }

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
          }
          .ss-sidebar.open{ transform: translateX(0); }
          .ss-sidebarBackdrop{
            display:block;
            position: fixed;
            inset: 0;
            background: rgba(2,6,23,0.64);
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
