import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { currentUserQueryOptions } from "@/features/auth/api";
import { missionsQueryOptions } from "@/features/missions/api";
import { playersQueryOptions } from "@/features/players/api";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { AlertCircle, CalendarClock, CalendarDays, ChevronRight, Star } from "lucide-react";
import type { ComponentType } from "react";

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
  const today = new Date().toLocaleDateString("fr-CH", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Bonjour {firstName}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground capitalize">{today}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatTile icon={CalendarClock} label="À venir" value={upcomingCount} />
        <StatTile
          icon={AlertCircle}
          label="À traiter"
          value={toRespondCount}
          highlight={toRespondCount > 0}
        />
        <StatTile icon={Star} label="Suivis" value={followedCount} />
      </div>

      <section>
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Prochaine mission
        </h2>
        {nextMission ? (
          <Link to="/missions/$id" params={{ id: String(nextMission.id) }} className="mt-2 block">
            <Card className="flex items-center gap-3 p-4 transition-colors hover:bg-muted active:bg-muted">
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
            <Card className="flex items-center justify-between p-4 transition-colors hover:bg-muted active:bg-muted">
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
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "space-y-1.5 p-3 border-amber-500/40" : "space-y-1.5 p-3"}>
      <Icon className={highlight ? "size-4 text-amber-500" : "size-4 text-muted-foreground"} />
      <p className="font-heading text-2xl font-bold">{value}</p>
      <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{label}</p>
    </Card>
  );
}
