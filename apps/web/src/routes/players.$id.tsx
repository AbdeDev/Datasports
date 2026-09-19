import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { decisionLabels } from "@/features/evaluations/api";
import { type PlayerDetail, playerQueryOptions, playerStatusLabels } from "@/features/players/api";
import { ProgressionChart } from "@/features/players/components/progression-chart";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, TrendingUp, UserRound } from "lucide-react";

export const Route = createFileRoute("/players/$id")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(playerQueryOptions(Number(params.id))),
  component: PlayerSheet,
});

const statusVariants: Record<
  string,
  "default" | "outline" | "muted" | "success" | "warning" | "destructive"
> = {
  decouvert: "muted",
  a_observer: "outline",
  suivi: "outline",
  prioritaire: "success",
  prise_de_contact: "warning",
  contacte: "warning",
  non_retenu: "destructive",
  archive: "muted",
};

function PlayerSheet() {
  const { id } = Route.useParams();
  const { data: player } = useSuspenseQuery(playerQueryOptions(Number(id)));

  const progressionPoints = player.observations
    .filter((observation) => observation.currentLevel !== null)
    .map((observation) => ({
      date: observation.createdAt,
      level: observation.currentLevel as number,
    }));

  const observationsDesc = [...player.observations].reverse();
  const statusHistoryDesc = [...player.statusHistory].reverse();

  return (
    <div className="space-y-6 p-6 pb-24">
      <div>
        <div className="flex items-start justify-between gap-2">
          <Badge variant={statusVariants[player.status] ?? "outline"}>
            {playerStatusLabels[player.status] ?? player.status}
          </Badge>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center border border-border bg-muted">
            <UserRound className="size-6 text-muted-foreground" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold">
              {player.firstName ? `${player.firstName} ` : ""}
              {player.lastName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {player.officialPosition ?? "Poste inconnu"}
              {player.club ? ` · ${player.club.name}` : ""}
            </p>
          </div>
        </div>
      </div>

      <section>
        <h2 className="flex items-center gap-1.5 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          <TrendingUp className="size-3.5" />
          Progression
        </h2>
        <Card className="mt-2 p-4">
          {progressionPoints.length >= 2 ? (
            <ProgressionChart points={progressionPoints} />
          ) : progressionPoints.length === 1 ? (
            <p className="text-sm text-muted-foreground">
              Niveau actuel : {progressionPoints[0].level}/5. Une seule observation pour l'instant —
              la courbe apparaîtra à partir de la 2e.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Aucune observation pour l'instant.</p>
          )}
        </Card>
      </section>

      <section>
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Observations ({observationsDesc.length})
        </h2>
        {observationsDesc.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Aucune observation enregistrée.</p>
        ) : (
          <ul className="mt-2 space-y-3">
            {observationsDesc.map((observation) => (
              <li key={observation.id}>
                <ObservationCard observation={observation} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Historique de statut
        </h2>
        {statusHistoryDesc.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Aucun changement de statut.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {statusHistoryDesc.map((entry) => (
              <li key={entry.id}>
                <Card className="flex items-center justify-between gap-3 p-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariants[entry.status] ?? "outline"}>
                      {playerStatusLabels[entry.status] ?? entry.status}
                    </Badge>
                    {entry.changedByUser && (
                      <span className="text-xs text-muted-foreground">
                        par {entry.changedByUser.fullName ?? entry.changedByUser.email}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleDateString("fr-CH")}
                  </span>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function ObservationCard({
  observation,
}: {
  observation: PlayerDetail["observations"][number];
}) {
  const analysisText = observation.analysisValidated ?? observation.analysisGenerated;

  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" />
          {new Date(observation.mission.match.matchDate).toLocaleDateString("fr-CH", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </div>
        {observation.decision && (
          <Badge variant="outline">{decisionLabels[observation.decision]}</Badge>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        {observation.mission.match.homeClub?.name ?? "?"} –{" "}
        {observation.mission.match.awayClub?.name ?? "?"}
        {observation.mission.match.competition ? ` · ${observation.mission.match.competition}` : ""}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {observation.currentLevel !== null && (
          <Badge variant="secondary">Niveau {observation.currentLevel}/5</Badge>
        )}
        {observation.potential && (
          <Badge variant="secondary">Potentiel {observation.potential}</Badge>
        )}
      </div>

      {observation.strengths.length > 0 && (
        <p className="text-sm">
          <span className="font-medium">Points forts :</span> {observation.strengths.join(", ")}
        </p>
      )}
      {observation.weaknesses.length > 0 && (
        <p className="text-sm">
          <span className="font-medium">Axes de travail :</span> {observation.weaknesses.join(", ")}
        </p>
      )}

      {analysisText && <p className="border-t border-border pt-3 text-sm">{analysisText}</p>}
    </Card>
  );
}
