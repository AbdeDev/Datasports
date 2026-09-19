import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { currentUserQueryOptions } from "@/features/auth/api";
import { missionsQueryOptions } from "@/features/missions/api";
import { playersQueryOptions } from "@/features/players/api";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/")({ component: Dashboard });

function Dashboard() {
  const { data: user } = useQuery(currentUserQueryOptions);
  const { data: missions } = useQuery(missionsQueryOptions);
  const { data: players } = useQuery(playersQueryOptions);

  const now = Date.now();
  const nextMission = missions
    ?.filter((m) => m.status === "acceptee" && new Date(m.match.matchDate).getTime() >= now)
    .sort(
      (a, b) => new Date(a.match.matchDate).getTime() - new Date(b.match.matchDate).getTime(),
    )[0];

  const toRespondCount = missions?.filter((m) => m.status === "proposee").length ?? 0;
  const upcomingCount =
    missions?.filter((m) => m.status === "acceptee" && new Date(m.match.matchDate).getTime() >= now)
      .length ?? 0;
  const followedCount =
    players?.filter((p) => !["non_retenu", "archive"].includes(p.status)).length ?? 0;

  const firstName = user?.fullName?.split(" ")[0] ?? user?.email.split("@")[0];

  return (
    <div className="space-y-6 p-6">
      <h1 className="font-heading text-2xl font-bold">Bonjour {firstName}</h1>

      <div className="grid grid-cols-3 gap-3">
        <StatTile label="À venir" value={upcomingCount} />
        <StatTile label="À traiter" value={toRespondCount} highlight={toRespondCount > 0} />
        <StatTile label="Suivis" value={followedCount} />
      </div>

      <section>
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Prochaine mission
        </h2>
        {nextMission ? (
          <Link to="/missions/$id" params={{ id: String(nextMission.id) }} className="mt-2 block">
            <Card className="flex items-center gap-3 p-4 active:bg-muted">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {nextMission.match.homeClub?.name ?? "?"} –{" "}
                  {nextMission.match.awayClub?.name ?? "?"}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CalendarDays className="size-3.5" />
                  {new Date(nextMission.match.matchDate).toLocaleDateString("fr-CH", {
                    day: "2-digit",
                    month: "long",
                  })}
                </div>
              </div>
              <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
            </Card>
          </Link>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">Aucune mission acceptée à venir.</p>
        )}
      </section>

      {toRespondCount > 0 && (
        <section>
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            À traiter
          </h2>
          <Link to="/missions" className="mt-2 block">
            <Card className="flex items-center justify-between p-4 active:bg-muted">
              <span className="text-sm">
                {toRespondCount} mission{toRespondCount > 1 ? "s" : ""} en attente de réponse
              </span>
              <Badge variant="warning">{toRespondCount}</Badge>
            </Card>
          </Link>
        </section>
      )}
    </div>
  );
}

function StatTile({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <Card className={`p-3 text-center ${highlight ? "border-amber-500/40" : ""}`}>
      <p className="font-heading text-2xl font-bold">{value}</p>
      <p className="mt-1 text-[11px] tracking-wide text-muted-foreground uppercase">{label}</p>
    </Card>
  );
}
