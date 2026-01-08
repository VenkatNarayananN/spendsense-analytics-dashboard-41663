import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { navItems } from "../../theme";
import { DemoModeBanner } from "../DemoModeBanner";

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
    <div className="ss-app" style={{ fontFamily: "var(--font-family)" }}>
      <Sidebar isOpen={navOpen} onClose={() => setNavOpen(false)} />

      <div className="ss-main">
        <TopBar title={title} onOpenNav={() => setNavOpen(true)} />
        <div className="ss-body">
          <main className="ss-content" aria-label="Main content">
            <DemoModeBanner />
            {children}
          </main>

          {/* Right rail is rendered by DashboardPage only (so non-dashboard pages keep their layouts).
              We still reserve the column for >=900px to match the intended dashboard feel. */}
          <aside className="ss-rightRail" aria-label="Summary rail">
            <div className="ss-rightRail__hint">{/* dashboard injects its own rail */}</div>
          </aside>
        </div>
      </div>

      <style>{`
        .ss-app{
          min-height:100vh;
          background: var(--grad-canvas);
          color: var(--text-default);
          display:flex;
          transition: var(--theme-transitions);
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
          grid-template-columns: 1fr 300px;
          gap:24px;
          padding:24px;
          align-items:start;
          min-width:0;
        }

        .ss-content{
          min-width:0;
          display:flex;
          flex-direction:column;
          gap:24px;
        }

        .ss-rightRail{
          position: sticky;
          top: 76px; /* aligns under TopBar */
          align-self:start;
          min-width:0;

          display:flex;
          flex-direction:column;
          gap:16px;
        }

        .ss-rightRail__hint{
          min-height: 1px;
        }

        @media (max-width: 1200px){
          .ss-body{
            grid-template-columns: 1fr 260px;
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
