import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  type Mission,
  missionStatusLabels,
  missionStatusVariants,
  missionsQueryOptions,
} from "@/features/missions/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/missions/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(missionsQueryOptions),
  component: Missions,
});

function Missions() {
  const { data: missions } = useSuspenseQuery(missionsQueryOptions);

  const [filter, setFilter] = useState("all");
  const visibleMissions = missions.filter(
    (mission) =>
      filter === "all" ||
      (filter === "active"
        ? !["terminee", "annulee"].includes(mission.status)
        : mission.status === filter),
  );
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
      <p className="elite-kicker">Au plus près du terrain</p>
      <h1 className="mt-3 font-heading text-4xl font-black tracking-tight uppercase">
        Vos missions<span className="text-primary">.</span>
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Préparez le match. Observez les détails. Faites la différence.
      </p>
      <div className="my-7 flex flex-wrap gap-2" aria-label="Filtrer les missions">
        {[
          ["all", "Toutes"],
          ["active", "Actives"],
          ["proposee", "À répondre"],
          ["terminee", "Terminées"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
            className={
              filter === value
                ? "rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                : "rounded-full border border-border px-4 py-2 text-xs text-muted-foreground hover:text-foreground"
            }
          >
            {label}
          </button>
        ))}
      </div>

      {visibleMissions.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Aucune mission dans cette sélection.</p>
      ) : (
        <ul className="mt-4 grid gap-4 xl:grid-cols-2">
          {visibleMissions.map((mission) => (
            <li key={mission.id}>
              <MissionCard mission={mission} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MissionCard({ mission }: { mission: Mission }) {
  const opponent =
    mission.match.homeClub?.name && mission.match.awayClub?.name
      ? `${mission.match.homeClub.name} – ${mission.match.awayClub.name}`
      : "Match à confirmer";

  return (
    <Link to="/missions/$id" params={{ id: String(mission.id) }} className="block">
      <Card className="flex items-center gap-3 p-4 transition-colors hover:bg-muted active:bg-muted">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium">{opponent}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {new Date(mission.match.matchDate).toLocaleDateString("fr-CH", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
          <Badge variant={missionStatusVariants[mission.status]} className="mt-2">
            {missionStatusLabels[mission.status]}
          </Badge>
        </div>
        <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
      </Card>
    </Link>
  );
}
