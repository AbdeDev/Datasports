import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Dashboard });

function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl font-bold">Bonjour</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Prochaine mission, stats de la semaine, joueurs à revoir — à venir.
      </p>
    </div>
  );
}
