import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { theme, navItems } from "../../theme";

/**
 * PUBLIC_INTERFACE
 */
export function AppShell({ children }) {
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  const title = useMemo(() => {
    const match =
      navItems.find((n) => n.path === location.pathname) ||
      (location.pathname.startsWith("/transactions")
        ? navItems.find((n) => n.key === "transactions")
        : undefined);
    return (match && match.label) || "SpendSense";
  }, [location.pathname]);

  return (
    <div className="ss-app" style={{ fontFamily: theme.typography.fontFamily }}>
      <Sidebar isOpen={navOpen} onClose={() => setNavOpen(false)} />

      <div className="ss-main">
        <TopBar title={title} onOpenNav={() => setNavOpen(true)} />
        <div className="ss-body">
          <main className="ss-content" aria-label="Main content">
            {children}
          </main>

          {/* Right rail is rendered by DashboardPage only (so non-dashboard pages keep their layouts).
              We still reserve the column for >=900px to match the screenshot feel. */}
          <aside className="ss-rightRail" aria-label="Summary rail">
            <div className="ss-rightRail__hint">
              {/* visually empty by default; dashboard injects its own rail. */}
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .ss-app{
          min-height:100vh;
          background: ${theme.colors.canvas};
          color: ${theme.colors.text};
          display:flex;
        }

        .ss-main{
          flex:1;
          min-width:0;
          display:flex;
          flex-direction:column;
        }

        .ss-body{
          flex:1;
          display:grid;
          grid-template-columns: 1fr ${theme.layout.rightRailWidth}px;
          gap:${theme.spacing.xl}px;
          padding:${theme.spacing.xl}px;
          align-items:start;
          min-width:0;
        }

        .ss-content{
          min-width:0;
          display:flex;
          flex-direction:column;
          gap:${theme.spacing.xl}px;
        }

        .ss-rightRail{
          position: sticky;
          top: 76px; /* aligns under TopBar */
          align-self:start;
          min-width:0;

          display:flex;
          flex-direction:column;
          gap:${theme.spacing.md}px;
        }

        .ss-rightRail__hint{
          min-height: 1px;
        }

        @media (max-width: 1200px){
          .ss-body{
            grid-template-columns: 1fr ${theme.layout.rightRailWidthNarrow}px;
          }
        }

        @media (max-width: 900px){
          .ss-body{
            grid-template-columns: 1fr;
          }
          .ss-rightRail{
            position: static;
          }
        }

        @media (max-width: 1024px){
          /* Sidebar becomes drawer via Sidebar component */
          .ss-app{ display:block; }
        }
      `}</style>
    </div>
  );
}
