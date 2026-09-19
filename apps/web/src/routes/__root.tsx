import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, useLocation } from "@tanstack/react-router";

import { TanStackDevtools } from "@tanstack/react-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { BottomNav } from "@/components/bottom-nav";
import "../styles.css";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
});

function RootComponent() {
  const { pathname } = useLocation();
  const showNav = pathname !== "/login" && pathname !== "/signup";

  return (
    <>
      <main className={showNav ? "pb-20" : undefined}>
        <Outlet />
      </main>
      {showNav && <BottomNav />}
      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "TanStack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  );
}
