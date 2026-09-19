import { type Mission, missionStatusLabels, missionsQueryOptions } from "@/features/missions/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

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
        <p className="mt-4 text-sm text-muted-foreground">Aucune mission pour l'instant.</p>
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
    mission.match.awayClub?.name && mission.match.homeClub?.name
      ? `${mission.match.homeClub.name} – ${mission.match.awayClub.name}`
      : "Match à confirmer";

  return (
    <Link
      to="/missions/$id"
      params={{ id: String(mission.id) }}
      className="block rounded-lg border border-border p-4 active:bg-muted"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium">{opponent}</span>
        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs uppercase text-muted-foreground">
          {missionStatusLabels[mission.status]}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {new Date(mission.match.matchDate).toLocaleDateString("fr-CH", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>
    </Link>
  );
}
