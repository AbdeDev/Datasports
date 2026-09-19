import { currentUserQueryOptions } from "@/features/auth/api";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(currentUserQueryOptions);
    if (user.role !== "admin") {
      throw redirect({ to: "/" });
    }
  },
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl font-bold">Pilotage</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Missions du jour, joueurs prioritaires, alertes de réattribution — à venir.
      </p>
    </div>
  );
}
