import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, redirect, useLocation } from "@tanstack/react-router";

import { TanStackDevtools } from "@tanstack/react-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { AppSidebar } from "@/components/app-sidebar";
import { BottomNav } from "@/components/bottom-nav";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabase";
import "../styles.css";

const PUBLIC_PATHS = ["/login", "/signup", "/forgot-password", "/reset-password"];

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
  const showNav = !PUBLIC_PATHS.includes(pathname) && !pathname.startsWith("/evaluate/");

  return (
    <>
      {showNav && <AppSidebar />}
      <main className={showNav ? "pb-20 md:pb-0 md:pl-64" : undefined}>
        {showNav ? (
          <div className="mx-auto max-w-3xl">
            <Outlet />
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      {showNav && <BottomNav />}
      <Toaster />
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
