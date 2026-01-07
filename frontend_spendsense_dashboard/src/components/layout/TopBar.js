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
        <input
          className="ss-topbar__search"
          placeholder="Search…"
          aria-label="Search"
        />
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

          background: ${theme.colors.sidebar};
          border-bottom: 1px solid ${theme.colors.border};
          position: sticky;
          top: 0;
          z-index: 10;
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
          background:${theme.colors.card};
          cursor:pointer;
          font-weight:${theme.typography.weights.bold};
          color:${theme.colors.textStrong};
          transition: background 140ms ease, transform 140ms ease;
        }

        .ss-topbar__menuBtn:hover{
          background:${theme.colors.mutedSurface};
          transform: translateY(-1px);
        }

        .ss-topbar__menuBtn:focus-visible{
          outline: 3px solid rgba(249,115,22,0.25);
          outline-offset: 2px;
        }

        .ss-topbar__crumb{
          font-size:${theme.typography.sizes.xs}px;
          color:${theme.colors.textMuted};
          font-weight:${theme.typography.weights.medium};
          line-height:${theme.typography.lineHeights.tight};
        }

        .ss-topbar__title{
          margin:2px 0 0 0;
          font-size:${theme.typography.sizes.lg}px;
          color:${theme.colors.textStrong};
          font-weight:${theme.typography.weights.semibold};
          line-height:${theme.typography.lineHeights.tight};
        }

        .ss-topbar__center{
          flex:1;
          display:flex;
          justify-content:center;
        }

        .ss-topbar__search{
          width:min(520px, 100%);
          height: 32px;
          border-radius:${theme.radii.md}px;
          border:1px solid ${theme.colors.border};
          background:${theme.colors.card};
          padding: 0 12px;
          font-size:${theme.typography.sizes.sm}px;
          outline:none;
          color:${theme.colors.text};
        }

        .ss-topbar__search::placeholder{
          color:${theme.colors.textDisabled};
        }

        .ss-topbar__search:focus{
          border-color: rgba(249,115,22,0.35);
          box-shadow: 0 0 0 4px rgba(249,115,22,0.14);
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
