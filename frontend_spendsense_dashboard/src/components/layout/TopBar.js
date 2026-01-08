import React from "react";
import { theme } from "../../theme";
import { Button } from "../ui/Button";
import { useAuth } from "../../auth/AuthContext";

/**
 * PUBLIC_INTERFACE
 */
export function TopBar({ title, onOpenNav, rightSlot }) {
  const { isAuthenticated, signOut } = useAuth();

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
        <Button variant="danger" size="pill" aria-label="Alerts (mock)">
          3 Alerts
        </Button>

        {isAuthenticated ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={signOut}
            aria-label="Sign out (placeholder)"
          >
            Sign out
          </Button>
        ) : (
          <Button variant="secondary" size="sm" aria-label="Profile placeholder">
            Avery Chen
          </Button>
        )}
      </div>

      <style>{`
        .ss-topbar{
          height: 64px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:${theme.spacing.lg}px;
          padding: 0 ${theme.spacing.xl}px;

          background: rgba(255,255,255,0.78);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid ${theme.colors.border};
          position: sticky;
          top: 0;
          z-index: 10;
        }

        /* subtle gradient hairline across top bar */
        .ss-topbar::before{
          content:"";
          position:absolute;
          left:0;
          right:0;
          top:0;
          height: 3px;
          background: ${theme.gradients.header};
        }

        .ss-topbar__left{
          display:flex;
          align-items:center;
          gap:${theme.spacing.md}px;
          min-width: 220px;
        }

        .ss-topbar__menuBtn{
          display:none;
          width:36px;
          height:36px;
          border-radius:${theme.radii.md}px;
          border:1px solid ${theme.colors.border};
          background: rgba(255,255,255,0.85);
          cursor:pointer;
          font-weight:${theme.typography.weights.black};
          color:${theme.colors.textStrong};
          transition: background 140ms ease, transform 140ms ease, border-color 140ms ease;
        }

        .ss-topbar__menuBtn:hover{
          background:${theme.gradients.accentSoft};
          transform: translateY(-1px);
          border-color: rgba(244,114,182,0.18);
        }

        .ss-topbar__menuBtn:focus-visible{
          outline: 3px solid ${theme.effects.focusRing};
          outline-offset: 2px;
        }

        .ss-topbar__crumb{
          font-size:${theme.typography.sizes.xs}px;
          color:${theme.colors.textMuted};
          font-weight:${theme.typography.weights.bold};
          line-height:${theme.typography.lineHeights.tight};
          letter-spacing: 0.2px;
        }

        .ss-topbar__title{
          margin:2px 0 0 0;
          font-size:${theme.typography.sizes.lg}px;
          color:${theme.colors.textStrong};
          font-weight:${theme.typography.weights.black};
          line-height:${theme.typography.lineHeights.tight};
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
          border-radius:${theme.radii.lg}px;
          border:1px solid ${theme.colors.border};
          background: rgba(255,255,255,0.86);
          padding: 0 12px;
          font-size:${theme.typography.sizes.sm}px;
          outline:none;
          color:${theme.colors.text};
          font-weight:${theme.typography.weights.semibold};
          transition: box-shadow 140ms ease, border-color 140ms ease, background 140ms ease;
        }

        .ss-topbar__search::placeholder{
          color:${theme.colors.textDisabled};
        }

        .ss-topbar__search:focus{
          border-color: rgba(244,114,182,0.42);
          box-shadow: 0 0 0 4px rgba(244,114,182,0.18);
          background: rgba(255,255,255,0.98);
        }

        .ss-topbar__right{
          display:flex;
          align-items:center;
          justify-content:flex-end;
          gap:${theme.spacing.sm}px;
          min-width: 260px;
        }

        @media (max-width: 1024px){
          .ss-topbar__menuBtn{ display:inline-flex; align-items:center; justify-content:center; }
          .ss-topbar__center{ display:none; }
        }
      `}</style>
    </header>
  );
}
