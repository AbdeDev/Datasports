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
import { CalendarDays, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/missions/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(missionsQueryOptions),
  component: Missions,
});

function Missions() {
  const { data: missions } = useSuspenseQuery(missionsQueryOptions);

  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl font-bold">Missions</h1>

      {missions.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Aucune mission pour l'instant.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {missions.map((mission) => (
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
      <Card className="flex items-center gap-3 p-4 transition-colors active:bg-muted">
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
