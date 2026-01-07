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
        <main className="ss-content" aria-label="Main content">
          {children}
        </main>
      </div>

      <style>{`
        .ss-app{
          min-height:100vh;
          background: ${theme.gradients.page};
          color: ${theme.colors.text};
          display:flex;
        }
        .ss-main{
          flex:1;
          display:flex;
          flex-direction:column;
          min-width:0;
        }
        .ss-content{
          padding:${theme.spacing.xl}px;
          display:flex;
          flex-direction:column;
          gap:${theme.spacing.xl}px;
        }

        /* Mobile: sidebar is overlay (Sidebar handles) */
        @media (max-width: 980px){
          .ss-app{ display:block; }
        }
      `}</style>
    </div>
  );
}
