import { RouteError, RoutePending } from "@/components/route-states";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  type Player,
  playerStatusLabels,
  playerStatusOrder,
  playersQueryOptions,
} from "@/features/players/api";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Search, UserRound } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/watchlist")({ component: Watchlist });

function Watchlist() {
  const { data: players, isPending, error } = useQuery(playersQueryOptions);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!players) return players;
    const query = search.trim().toLowerCase();

    return players.filter(
      (p) =>
        (statusFilter === "all" || p.status === statusFilter) &&
        `${p.firstName ?? ""} ${p.lastName} ${p.club?.name ?? ""} ${p.officialPosition ?? ""}`
          .toLowerCase()
          .includes(query),
    );
  }, [players, search, statusFilter]);

  const groups = playerStatusOrder
    .map((status) => ({
      status,
      players: filtered?.filter((p) => p.status === status) ?? [],
    }))
    .filter((group) => group.players.length > 0);

  if (isPending) return <RoutePending />;
  if (error) return <RouteError error={error} />;
  return (
    <div className="space-y-7 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="elite-kicker">Le radar des talents</p>
          <h1 className="mt-3 font-heading text-4xl font-black tracking-tight uppercase">
            Watchlist<span className="text-primary">.</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Chaque profil, une trajectoire à suivre.
          </p>
        </div>
        <span className="rounded-full border border-border px-4 py-2 text-sm">
          {players?.length ?? 0} profils
        </span>
      </header>
      <div className="flex flex-wrap gap-2" aria-label="Filtrer par statut">
        {["all", ...playerStatusOrder].map((status) => (
          <button
            key={status}
            type="button"
            aria-pressed={statusFilter === status}
            onClick={() => setStatusFilter(status)}
            className={
              statusFilter === status
                ? "rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                : "rounded-full border border-border px-4 py-2 text-xs text-muted-foreground hover:text-foreground"
            }
          >
            {status === "all" ? "Tous les profils" : playerStatusLabels[status]}
          </button>
        ))}
      </div>

      {players && players.length > 0 && (
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Rechercher un joueur, un club ou un poste"
            placeholder="Rechercher un joueur, un club, un poste..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-12 bg-card pl-9"
          />
        </div>
      )}

      {!players || players.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun joueur suivi pour l'instant.</p>
      ) : groups.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun résultat pour "{search}".</p>
      ) : (
        groups.map((group) => (
          <section key={group.status}>
            <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              {playerStatusLabels[group.status] ?? group.status} ({group.players.length})
            </h2>
            <ul className="mt-3 grid gap-3 xl:grid-cols-2">
              {group.players.map((player) => (
                <li key={player.id}>
                  <PlayerRow player={player} />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

function PlayerRow({ player }: { player: Player }) {
  return (
    <Link to="/players/$id" params={{ id: String(player.id) }} className="block">
      <Card className="flex items-center gap-3 p-3 transition-colors hover:bg-muted active:bg-muted">
        <div className="flex size-9 shrink-0 items-center justify-center border border-border bg-muted">
          <UserRound className="size-4 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {player.firstName ? `${player.firstName} ` : ""}
            {player.lastName}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {player.officialPosition ?? "Poste inconnu"}
            {player.club ? ` · ${player.club.name}` : ""}
          </p>
        </div>
        <Badge variant="outline">{playerStatusLabels[player.status] ?? player.status}</Badge>
      </Card>
    </Link>
  );
}
