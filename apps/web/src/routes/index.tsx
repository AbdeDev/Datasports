import { MissionChart } from "@/components/mission-chart";
import { RouteError, RoutePending } from "@/components/route-states";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { currentUserQueryOptions } from "@/features/auth/api";
import {
  missionStatusLabels,
  missionStatusVariants,
  missionsQueryOptions,
} from "@/features/missions/api";
import { playerStatusLabels, playersQueryOptions } from "@/features/players/api";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  Plus,
  Radio,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";

export const Route = createFileRoute("/")({ component: Dashboard });

function Dashboard() {
  const { data: user } = useQuery(currentUserQueryOptions);
  const missionsQuery = useQuery(missionsQueryOptions);
  const playersQuery = useQuery(playersQueryOptions);
  const missions = missionsQuery.data ?? [];
  const players = playersQuery.data ?? [];
  if (missionsQuery.isPending || playersQuery.isPending) return <RoutePending />;
  if (missionsQuery.isError || playersQuery.isError)
    return <RouteError error={missionsQuery.error ?? playersQuery.error} />;
  const completedCount = missions.filter((mission) => mission.status === "terminee").length;
  const completionRate = missions.length ? Math.round((completedCount / missions.length) * 100) : 0;

  const now = Date.now();
  const activeMissions = missions.filter(
    (mission) => !["terminee", "annulee"].includes(mission.status),
  );
  const nextMission = [...activeMissions]
    .filter((mission) => new Date(mission.match.matchDate).getTime() >= now)
    .sort(
      (a, b) => new Date(a.match.matchDate).getTime() - new Date(b.match.matchDate).getTime(),
    )[0];
  const toRespondCount = missions.filter((mission) => mission.status === "proposee").length;
  const followedPlayers = players.filter((player) =>
    ["suivi", "prioritaire", "prise_de_contact"].includes(player.status),
  );
  const firstName = user?.fullName?.split(" ")[0] ?? user?.email.split("@")[0] ?? "Scout";
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] text-primary uppercase">
            <Radio className="size-3.5" /> Centre de scouting Elite75
          </div>
          <h1 className="font-heading text-3xl leading-none font-black tracking-tight uppercase sm:text-4xl">
            Bonjour, {firstName}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground capitalize">
            {today} · Prêt pour le terrain ?
          </p>
        </div>
        <Link
          to="/missions"
          aria-label="Consulter les missions en attente"
          className="relative flex size-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
        >
          <Bell className="size-4" />
          {toRespondCount > 0 && (
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
          )}
        </Link>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <MetricCard
          icon={CalendarDays}
          label="Missions actives"
          value={activeMissions.length}
          detail="Planning actuel"
        />
        <MetricCard
          icon={Clock3}
          label="À traiter"
          value={toRespondCount}
          detail="Réponse attendue"
          alert={toRespondCount > 0}
        />
        <MetricCard
          icon={Star}
          label="Joueurs suivis"
          value={followedPlayers.length}
          detail="Dans la watchlist"
        />
      </section>

      <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,.75fr)]">
        <div className="space-y-8">
          <section>
            <SectionHeading
              eyebrow="Prochaine mission"
              title="Votre rendez-vous"
              link="/missions"
            />
            {nextMission ? (
              <Link
                to="/missions/$id"
                params={{ id: String(nextMission.id) }}
                className="group block"
              >
                <Card className="relative overflow-hidden border-primary/15 bg-[radial-gradient(circle_at_80%_20%,rgba(239,35,42,.16),transparent_38%),linear-gradient(145deg,var(--card),rgba(21,26,29,.86))] p-5 sm:p-7">
                  <div className="absolute inset-y-0 left-0 w-1 bg-primary" />
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                      <CalendarDays className="size-3.5 text-primary" />
                      {formatMissionDate(nextMission.match.matchDate)}
                    </div>
                    <Badge variant={missionStatusVariants[nextMission.status]}>
                      {missionStatusLabels[nextMission.status]}
                    </Badge>
                  </div>

                  <div className="my-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-8">
                    <Club name={nextMission.match.homeClub?.name ?? "Club domicile"} side="home" />
                    <div className="text-center">
                      <p className="text-[8px] font-bold tracking-widest text-muted-foreground uppercase">
                        Coup d'envoi
                      </p>
                      <p className="mt-1 font-heading text-3xl font-black italic">VS</p>
                      <p className="text-xs font-bold text-primary">
                        {new Date(nextMission.match.matchDate).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <Club name={nextMission.match.awayClub?.name ?? "Club extérieur"} side="away" />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5" />
                      {nextMission.match.venue ?? "Lieu à confirmer"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Target className="size-3.5" />
                      {nextMission.targets.length} joueur{nextMission.targets.length > 1 ? "s" : ""}{" "}
                      à observer
                    </span>
                    <span className="ml-auto flex items-center gap-2 font-bold tracking-wider text-primary uppercase transition-transform group-hover:translate-x-1">
                      Voir la mission <ArrowRight className="size-4" />
                    </span>
                  </div>
                </Card>
              </Link>
            ) : (
              <Card className="border-dashed p-8 text-center">
                <CalendarDays className="mx-auto size-7 text-muted-foreground" />
                <p className="mt-3 font-semibold">Aucune mission à venir</p>
                <p className="mt-1 text-sm text-muted-foreground">Votre planning est à jour.</p>
              </Card>
            )}
          </section>

          <section>
            <SectionHeading eyebrow="Suivi" title="Profils à surveiller" link="/watchlist" />
            {followedPlayers.length === 0 && (
              <Card className="border-dashed p-6">
                <p className="font-semibold">Votre prochaine découverte commence ici.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Les joueurs suivis et prioritaires apparaîtront ici après vos observations.
                </p>
                <Link
                  to="/watchlist"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-primary"
                >
                  Explorer les profils <ArrowRight className="size-4" />
                </Link>
              </Card>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              {followedPlayers.slice(0, 4).map((player) => (
                <Link key={player.id} to="/players/$id" params={{ id: String(player.id) }}>
                  <Card className="flex items-center gap-3 p-3.5 transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:bg-muted/50">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 font-heading text-sm font-black text-primary">
                      {initials(player.firstName, player.lastName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {[player.firstName, player.lastName].filter(Boolean).join(" ")}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {player.club?.name ?? "Club inconnu"} ·{" "}
                        {player.officialPosition ?? "Poste à définir"}
                      </p>
                      <p className="mt-1 text-[9px] font-bold tracking-widest text-primary uppercase">
                        {playerStatusLabels[player.status] ?? player.status}
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <MissionChart missions={missions} />
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="elite-kicker">Vue d’ensemble</p>
                <h2 className="mt-2 font-heading text-xl font-black uppercase">Votre activité</h2>
              </div>
              <TrendingUp className="size-5 text-primary" />
            </div>
            <div className="mt-6 grid grid-cols-3 divide-x divide-border rounded-md border border-border bg-background/40 py-4 text-center">
              <MiniStat value={missions.length} label="Missions" />
              <MiniStat
                value={missions.filter((m) => m.status === "terminee").length}
                label="Terminées"
              />
              <MiniStat value={activeMissions.length} label="Actives" />
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Missions terminées</span>
                <strong className="text-foreground">{completionRate}%</strong>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary" style={{ width: `${completionRate}%` }} />
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden border-primary/15 p-5">
            <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Sparkles className="size-4" />
            </div>
            <h2 className="mt-4 font-heading text-xl font-black uppercase">Un talent repéré ?</h2>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Ajoutez-le depuis sa mission pour conserver immédiatement le contexte du match.
            </p>
            <Link
              to="/missions"
              className="mt-5 flex h-11 items-center justify-center gap-2 rounded-sm bg-primary text-xs font-bold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-primary/85"
            >
              <Plus className="size-4" /> Ouvrir mes missions
            </Link>
          </Card>

          <div className="flex items-center gap-3 rounded-lg border border-emerald-500/15 bg-emerald-500/5 p-4">
            <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.7)]" />
            <div>
              <p className="text-xs font-semibold">Données chargées</p>
              <p className="text-[10px] text-muted-foreground">
                Missions et joueurs issus de votre API
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  alert,
}: { icon: typeof UsersRound; label: string; value: number; detail: string; alert?: boolean }) {
  return (
    <Card className={alert ? "border-amber-500/30 p-4" : "p-4"}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[9px] font-bold tracking-[.15em] text-muted-foreground uppercase">
            {label}
          </p>
          <p className="mt-2 font-heading text-3xl font-black">{value}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">{detail}</p>
        </div>
        <div
          className={
            alert
              ? "rounded-md bg-amber-500/10 p-2 text-amber-400"
              : "rounded-md bg-primary/10 p-2 text-primary"
          }
        >
          <Icon className="size-4" />
        </div>
      </div>
    </Card>
  );
}

function SectionHeading({
  eyebrow,
  title,
  link,
}: { eyebrow: string; title: string; link: "/missions" | "/watchlist" }) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        <p className="elite-kicker">{eyebrow}</p>
        <h2 className="mt-2 font-heading text-2xl font-black uppercase">{title}</h2>
      </div>
      <Link
        to={link}
        className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase hover:text-primary"
      >
        Voir tout <ArrowRight className="size-3" />
      </Link>
    </div>
  );
}

function Club({ name, side }: { name: string; side: "home" | "away" }) {
  return (
    <div className="min-w-0 text-center">
      <div
        className={
          side === "home"
            ? "mx-auto flex size-14 items-center justify-center rounded-full border-2 border-primary bg-[#13213a] font-heading text-xs font-black sm:size-16"
            : "mx-auto flex size-14 items-center justify-center rounded-full border-2 border-sky-400 bg-[#18234a] font-heading text-xs font-black sm:size-16"
        }
      >
        {initials(null, name)}
      </div>
      <p className="mt-3 truncate text-xs font-bold sm:text-sm">{name}</p>
    </div>
  );
}

function MiniStat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="font-heading text-2xl font-black">{value}</p>
      <p className="mt-1 text-[8px] font-bold tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  );
}

function initials(firstName: string | null, lastName: string) {
  return `${firstName?.[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

function formatMissionDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}
