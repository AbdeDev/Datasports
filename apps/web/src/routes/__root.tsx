import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, redirect, useLocation } from "@tanstack/react-router";

import { TanStackDevtools } from "@tanstack/react-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { BottomNav } from "@/components/bottom-nav";
import { supabase } from "@/lib/supabase";
import "../styles.css";

const PUBLIC_PATHS = ["/login", "/signup"];

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: async ({ location }) => {
    if (PUBLIC_PATHS.includes(location.pathname)) {
      return;
    }

    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/login" });
    }
  },
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
