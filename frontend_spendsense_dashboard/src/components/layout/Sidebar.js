import React from "react";
import { NavLink } from "react-router-dom";
import { navItems } from "../../theme";

/**
 * PUBLIC_INTERFACE
 */
export function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <aside className={`ss-sidebar ${isOpen ? "open" : ""}`} aria-label="Primary">
        <div className="ss-sidebar__brand">
          <div className="ss-sidebar__brandGlow" aria-hidden="true" />
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
          <div className="ss-sidebar__metaTitle">Ocean Professional</div>
          <div className="ss-sidebar__metaSub">Soft gradients • Modern fintech • Focus-first</div>
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
          width:240px;
          padding:24px 20px;
          display:flex;
          flex-direction:column;
          gap:20px;

          background: color-mix(in srgb, var(--bg-sidebar) 82%, transparent);
          backdrop-filter: blur(12px);
          border-right: 1px solid var(--border-default);
          transition: var(--theme-transitions);
        }

        .ss-sidebar__brand{
          padding:16px;
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-subtle);
          background: var(--grad-header);
          position: relative;
          overflow:hidden;
          transition: var(--theme-transitions);
        }

        .ss-sidebar__brandGlow{
          position:absolute;
          inset:-40px;
          background:
            radial-gradient(260px 140px at 20% 10%, rgba(244,114,182,0.35), rgba(244,114,182,0) 60%),
            radial-gradient(240px 140px at 85% 65%, rgba(245,158,11,0.30), rgba(245,158,11,0) 60%);
          filter: blur(2px);
          pointer-events:none;
        }

        .ss-sidebar__name{
          position:relative;
          font-size: var(--text-lg);
          font-weight: var(--weight-black);
          color: var(--text-strong);
          line-height: var(--line-tight);
          letter-spacing: 0.1px;
        }

        .ss-sidebar__tag{
          position:relative;
          margin-top:2px;
          font-size: var(--text-sm);
          font-weight: var(--weight-semibold);
          color: var(--text-muted);
        }

        .ss-sidebar__nav{
          display:flex;
          flex-direction:column;
          gap:6px;
        }

        .ss-sidebar__link{
          height: 40px;
          padding: 8px 10px;
          border-radius: var(--radius-lg);

          display:flex;
          align-items:center;
          gap:10px;

          text-decoration:none;
          color: var(--text-default);
          font-size: var(--text-sm);
          font-weight: var(--weight-bold);

          border: 1px solid transparent;
          transition: var(--theme-transitions), transform 140ms ease;
        }

        .ss-sidebar__icon{
          width:16px;
          height:16px;
          border-radius: 999px;
          background: var(--text-muted);
          opacity:0.25;
          flex:0 0 auto;
        }

        .ss-sidebar__link:hover{
          background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
          transform: translateY(-1px);
          border-color: color-mix(in srgb, var(--brand-primary) 16%, transparent);
        }

        .ss-sidebar__link.active{
          background: var(--grad-accent-soft);
          border-color: color-mix(in srgb, var(--brand-primary) 22%, transparent);
          color: var(--text-strong);
          box-shadow: var(--shadow-sm);
        }

        .ss-sidebar__link.active .ss-sidebar__icon{
          background: var(--brand-primary);
          opacity:1;
        }

        .ss-sidebar__footer{
          margin-top:auto;
          padding:16px;
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-subtle);
          background: var(--bg-muted);
          box-shadow: var(--shadow-sm);
          transition: var(--theme-transitions);
        }

        .ss-sidebar__metaTitle{
          font-size: var(--text-sm);
          font-weight: var(--weight-black);
          color: var(--text-strong);
        }

        .ss-sidebar__metaSub{
          margin-top:2px;
          font-size: var(--text-xs);
          font-weight: var(--weight-semibold);
          color: var(--text-muted);
          line-height: var(--line-normal);
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
            transition: transform 180ms ease, var(--theme-transitions);
            box-shadow: var(--shadow-md);
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
