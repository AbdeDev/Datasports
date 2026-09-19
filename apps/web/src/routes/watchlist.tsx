import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/watchlist")({ component: Watchlist });

function Watchlist() {
  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl font-bold">Watchlist</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Joueurs suivis, groupés par statut — à venir.
      </p>
    </div>
  );
}
