import React from "react";
import { theme } from "../../theme";
import { Button } from "../ui/Button";

/**
 * PUBLIC_INTERFACE
 */
export function TopBar({ title, onOpenNav, rightSlot }) {
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
          <h1 className="ss-topbar__title">{title}</h1>
          <div className="ss-topbar__subtitle">SpendSense • Elegant Analytics</div>
        </div>
      </div>

      <div className="ss-topbar__center" role="search">
        <input
          className="ss-topbar__search"
          placeholder="Search merchants, categories, alerts…"
          aria-label="Search"
        />
      </div>

      <div className="ss-topbar__right">
        {rightSlot}
        <Button variant="ghost" size="sm" aria-label="Open profile">
          Avery Chen
        </Button>
      </div>

      <style>{`
        .ss-topbar{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:${theme.spacing.lg}px;
          padding:${theme.spacing.lg}px ${theme.spacing.xl}px;
          border-bottom: 1px solid ${theme.colors.border};
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .ss-topbar__left{
          display:flex;
          align-items:center;
          gap:${theme.spacing.md}px;
          min-width: 240px;
        }
        .ss-topbar__menuBtn{
          display:none;
          width:42px;
          height:42px;
          border-radius:${theme.radii.md}px;
          border:1px solid ${theme.colors.border};
          background:${theme.colors.surface};
          cursor:pointer;
          font-weight:900;
        }
        .ss-topbar__menuBtn:focus-visible{
          outline: 3px solid rgba(244, 114, 182, 0.35);
          outline-offset: 2px;
        }
        .ss-topbar__title{
          margin:0;
          font-size:16px;
          color:${theme.colors.text};
          font-weight: 900;
          letter-spacing: 0.3px;
        }
        .ss-topbar__subtitle{
          margin-top:2px;
          font-size:12px;
          color:${theme.colors.mutedText};
          font-weight:700;
        }
        .ss-topbar__center{
          flex:1;
          display:flex;
          justify-content:center;
        }
        .ss-topbar__search{
          width:min(560px, 100%);
          border-radius:${theme.radii.lg}px;
          border:1px solid ${theme.colors.border};
          background:${theme.colors.surface};
          padding: 11px 14px;
          font-size: 13px;
          outline:none;
          transition: box-shadow 140ms ease, border-color 140ms ease;
        }
        .ss-topbar__search:focus{
          border-color: rgba(244,114,182,0.45);
          box-shadow: 0 0 0 4px rgba(244,114,182,0.18);
        }
        .ss-topbar__right{
          display:flex;
          align-items:center;
          justify-content:flex-end;
          gap:${theme.spacing.sm}px;
          min-width: 200px;
        }

        @media (max-width: 980px){
          .ss-topbar__menuBtn{ display:inline-flex; align-items:center; justify-content:center; }
          .ss-topbar__center{ display:none; }
        }
      `}</style>
    </header>
  );
}
