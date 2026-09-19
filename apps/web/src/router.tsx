import { RouteError, RoutePending } from "@/components/route-states";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { queryClient } from "./lib/query";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultPendingComponent: RoutePending,
    defaultPendingMs: 300,
    defaultErrorComponent: ({ error }) => <RouteError error={error} />,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
