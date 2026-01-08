import React from "react";
import { useTheme } from "../../theme/ThemeProvider";
import { Button } from "../ui/Button";

/**
 * PUBLIC_INTERFACE
 */
export function TopBar({ title, onOpenNav, rightSlot }) {
  const { mode, themeName, setThemeMode, toggleTheme } = useTheme();

  return (
    <header className="ss-topbar" aria-label="Top navigation">
      <div className="ss-topbar__left">
        <button
          className="ss-topbar__menuBtn"
          onClick={onOpenNav}
          aria-label="Open navigation"
          type="button"
        >
          <span aria-hidden="true">☰</span>
        </button>

        <div className="ss-topbar__titleWrap">
          <div className="ss-topbar__crumb">Dashboard</div>
          <h1 className="ss-topbar__title">{title}</h1>
        </div>
      </div>

      <div className="ss-topbar__center" role="search">
        <input className="ss-topbar__search" placeholder="Search…" aria-label="Search" />
      </div>

      <div className="ss-topbar__right">
        {rightSlot}

        <div className="ss-topbar__theme" aria-label="Theme settings">
          <button
            type="button"
            className="ss-topbar__themeBtn"
            onClick={toggleTheme}
            aria-label={`Toggle theme (currently ${themeName})`}
            title="Toggle theme"
          >
            <span className="ss-topbar__themeIcon" aria-hidden="true">
              {themeName === "dark" ? "🌙" : "☀"}
            </span>
          </button>

          <select
            className="ss-topbar__themeSelect"
            aria-label="Theme mode"
            value={mode}
            onChange={(e) => setThemeMode(e.target.value)}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <Button variant="danger" size="pill" aria-label="Alerts (mock)">
          3 Alerts
        </Button>

        <Button variant="secondary" size="sm" aria-label="Profile placeholder">
          Avery Chen
        </Button>
      </div>

      <style>{`
        .ss-topbar{
          height: 64px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:20px;
          padding: 0 24px;

          background: color-mix(in srgb, var(--bg-card) 78%, transparent);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-default);
          position: sticky;
          top: 0;
          z-index: 10;

          transition: var(--theme-transitions);
        }

        /* subtle gradient hairline across top bar */
        .ss-topbar::before{
          content:"";
          position:absolute;
          left:0;
          right:0;
          top:0;
          height: 3px;
          background: var(--grad-header);
        }

        .ss-topbar__left{
          display:flex;
          align-items:center;
          gap:16px;
          min-width: 220px;
        }

        .ss-topbar__menuBtn{
          display:none;
          width:36px;
          height:36px;
          border-radius: var(--radius-md);
          border:1px solid var(--border-default);
          background: color-mix(in srgb, var(--bg-card) 86%, transparent);
          cursor:pointer;
          font-weight: var(--weight-black);
          color: var(--text-strong);
          transition: background 140ms ease, transform 140ms ease, border-color 140ms ease, color 140ms ease;
        }

        .ss-topbar__menuBtn:hover{
          background: var(--grad-accent-soft);
          transform: translateY(-1px);
          border-color: color-mix(in srgb, var(--brand-primary) 18%, transparent);
        }

        .ss-topbar__menuBtn:focus-visible{
          outline: 3px solid var(--focus-ring);
          outline-offset: 2px;
        }

        .ss-topbar__crumb{
          font-size: var(--text-xs);
          color: var(--text-muted);
          font-weight: var(--weight-bold);
          line-height: var(--line-tight);
          letter-spacing: 0.2px;
        }

        .ss-topbar__title{
          margin:2px 0 0 0;
          font-size: var(--text-lg);
          color: var(--text-strong);
          font-weight: var(--weight-black);
          line-height: var(--line-tight);
          letter-spacing: 0.1px;
        }

        .ss-topbar__center{
          flex:1;
          display:flex;
          justify-content:center;
        }

        .ss-topbar__search{
          width:min(520px, 100%);
          height: 34px;
          border-radius: var(--radius-lg);
          border:1px solid var(--border-default);
          background: color-mix(in srgb, var(--bg-card) 86%, transparent);
          padding: 0 12px;
          font-size: var(--text-sm);
          outline:none;
          color: var(--text-default);
          font-weight: var(--weight-semibold);
          transition: box-shadow 140ms ease, border-color 140ms ease, background 140ms ease, color 140ms ease;
        }

        .ss-topbar__search::placeholder{
          color: var(--text-disabled);
        }

        .ss-topbar__search:focus{
          border-color: color-mix(in srgb, var(--brand-primary) 42%, transparent);
          box-shadow: 0 0 0 4px var(--focus-soft);
          background: color-mix(in srgb, var(--bg-card) 96%, transparent);
        }

        .ss-topbar__right{
          display:flex;
          align-items:center;
          justify-content:flex-end;
          gap:12px;
          min-width: 260px;
        }

        .ss-topbar__theme{
          display:flex;
          align-items:center;
          gap:8px;
          padding: 6px 8px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
          background: color-mix(in srgb, var(--bg-card) 74%, transparent);
          transition: var(--theme-transitions);
        }

        .ss-topbar__themeBtn{
          width:32px;
          height:32px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-default);
          background: color-mix(in srgb, var(--bg-card) 86%, transparent);
          color: var(--text-strong);
          cursor: pointer;
          transition: var(--theme-transitions), transform 140ms ease;
        }

        .ss-topbar__themeBtn:hover{
          transform: translateY(-1px);
          background: var(--grad-accent-soft);
          border-color: color-mix(in srgb, var(--brand-primary) 18%, transparent);
        }

        .ss-topbar__themeBtn:focus-visible{
          outline: 3px solid var(--focus-ring);
          outline-offset: 2px;
        }

        .ss-topbar__themeIcon{
          display:inline-flex;
          width:100%;
          height:100%;
          align-items:center;
          justify-content:center;
          font-size: 14px;
          font-weight: var(--weight-black);
        }

        .ss-topbar__themeSelect{
          height: 32px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-default);
          background: color-mix(in srgb, var(--bg-card) 86%, transparent);
          color: var(--text-default);
          padding: 0 10px;
          font-size: var(--text-xs);
          font-weight: var(--weight-black);
          outline: none;
          transition: var(--theme-transitions);
        }

        .ss-topbar__themeSelect:focus-visible{
          outline: 3px solid var(--focus-ring);
          outline-offset: 2px;
        }

        @media (max-width: 1024px){
          .ss-topbar__menuBtn{ display:inline-flex; align-items:center; justify-content:center; }
          .ss-topbar__center{ display:none; }
        }
      `}</style>
    </header>
  );
}
