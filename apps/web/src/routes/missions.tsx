import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/missions")({ component: Missions });

function Missions() {
  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl font-bold">Missions</h1>
      <p className="mt-2 text-sm text-muted-foreground">Liste des missions du scout — à venir.</p>
    </div>
  );
}
