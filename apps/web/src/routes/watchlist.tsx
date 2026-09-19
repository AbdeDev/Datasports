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
  const { data: players } = useQuery(playersQueryOptions);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!players) return players;
    const query = search.trim().toLowerCase();
    if (!query) return players;
    return players.filter((p) =>
      `${p.firstName ?? ""} ${p.lastName} ${p.club?.name ?? ""}`.toLowerCase().includes(query),
    );
  }, [players, search]);

  const groups = playerStatusOrder
    .map((status) => ({
      status,
      players: filtered?.filter((p) => p.status === status) ?? [],
    }))
    .filter((group) => group.players.length > 0);

  return (
    <div className="space-y-6 p-6">
      <h1 className="font-heading text-2xl font-bold">Watchlist</h1>

      {players && players.length > 0 && (
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un joueur, un club..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
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
            <ul className="mt-2 space-y-2">
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
      <Card className="flex items-center gap-3 p-3">
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
