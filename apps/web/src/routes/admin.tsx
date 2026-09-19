import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { currentUserQueryOptions } from "@/features/auth/api";
import { type Club, clubsQueryOptions } from "@/features/clubs/api";
import { useCreateClub } from "@/features/clubs/hooks";
import { matchesQueryOptions } from "@/features/matches/api";
import { useCreateMatch } from "@/features/matches/hooks";
import {
  type Mission,
  missionStatusLabels,
  missionStatusVariants,
  missionsQueryOptions,
} from "@/features/missions/api";
import { useCancelMission, useCreateMission, useReassignMission } from "@/features/missions/hooks";
import { playersQueryOptions } from "@/features/players/api";
import { useCreatePlayer } from "@/features/players/hooks";
import { type Scout, scoutsQueryOptions } from "@/features/scouts/api";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { AlertTriangle, ChevronDown, Plus, XCircle } from "lucide-react";
import { type FormEvent, type ReactNode, useState } from "react";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(currentUserQueryOptions);
    if (user.role !== "admin") {
      throw redirect({ to: "/" });
    }
  },
  component: AdminDashboard,
});

const ALERT_STATUSES = ["a_reattribuer", "scout_indisponible"];

function AdminDashboard() {
  const { data: missions } = useQuery(missionsQueryOptions);
  const alerts = missions?.filter((m) => ALERT_STATUSES.includes(m.status)) ?? [];

  return (
    <div className="space-y-8 p-6 pb-24">
      <h1 className="font-heading text-2xl font-bold">Pilotage</h1>

      {alerts.length > 0 && (
        <div className="flex items-center gap-3 border border-amber-500/40 bg-amber-500/10 p-3">
          <AlertTriangle className="size-5 shrink-0 text-amber-500" />
          <p className="text-sm">
            <span className="font-semibold">{alerts.length}</span> mission
            {alerts.length > 1 ? "s" : ""} à réattribuer d'urgence
          </p>
        </div>
      )}

      <MissionsAttention />
      <CreateMissionSection />

      <section>
        <SectionTitle>Ajout rapide</SectionTitle>
        <div className="mt-3 space-y-3">
          <ClubQuickAdd />
          <MatchQuickAdd />
          <PlayerQuickAdd />
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ children, count }: { children: ReactNode; count?: number }) {
  return (
    <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
      {children}
      {typeof count === "number" && count > 0 && (
        <Badge variant="secondary" className="text-[10px]">
          {count}
        </Badge>
      )}
    </h2>
  );
}

// ---- Missions needing attention -------------------------------------------

const REASSIGNABLE_STATUSES = ["proposee", "a_reattribuer", "scout_indisponible"];
const CANCELLABLE_STATUSES_EXCLUDED = ["annulee", "terminee"];

function MissionsAttention() {
  const { data: missions } = useQuery(missionsQueryOptions);
  const { data: scouts } = useQuery(scoutsQueryOptions);

  // Alerts first, then everything else, most recent first.
  const sorted = missions
    ? [...missions].sort((a, b) => {
        const aAlert = ALERT_STATUSES.includes(a.status) ? 0 : 1;
        const bAlert = ALERT_STATUSES.includes(b.status) ? 0 : 1;
        if (aAlert !== bAlert) return aAlert - bAlert;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
    : undefined;

  return (
    <section>
      <SectionTitle count={sorted?.length}>Missions</SectionTitle>
      {!sorted || sorted.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Aucune mission pour l'instant.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {sorted.map((mission) => (
            <MissionAttentionCard key={mission.id} mission={mission} scouts={scouts ?? []} />
          ))}
        </ul>
      )}
    </section>
  );
}

function MissionAttentionCard({ mission, scouts }: { mission: Mission; scouts: Scout[] }) {
  const reassign = useReassignMission(mission.id);
  const cancel = useCancelMission(mission.id);
  const [scoutId, setScoutId] = useState("");
  const isAlert = ALERT_STATUSES.includes(mission.status);
  const canReassign = REASSIGNABLE_STATUSES.includes(mission.status);
  const canCancel = !CANCELLABLE_STATUSES_EXCLUDED.includes(mission.status);

  return (
    <li>
      <Card className={isAlert ? "border-amber-500/40" : undefined}>
        <CardContent className="space-y-3 pt-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium">
                {mission.match.homeClub?.name ?? "?"} – {mission.match.awayClub?.name ?? "?"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Scout actuel : {mission.scout.fullName ?? mission.scout.email}
              </p>
            </div>
            <Badge variant={missionStatusVariants[mission.status]} className="shrink-0">
              {missionStatusLabels[mission.status]}
            </Badge>
          </div>

          {mission.declineReason && (
            <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
              {mission.declineReason}
            </p>
          )}

          {canReassign && (
            <div className="flex gap-2">
              <Select value={scoutId} onChange={(event) => setScoutId(event.target.value)}>
                <option value="" disabled>
                  Réattribuer à...
                </option>
                {scouts.map((scout) => (
                  <option key={scout.id} value={scout.id}>
                    {scout.fullName ?? scout.email}
                  </option>
                ))}
              </Select>
              <Button
                disabled={!scoutId || reassign.isPending}
                onClick={() => reassign.mutate({ scoutId: Number(scoutId) })}
              >
                Réattribuer
              </Button>
            </div>
          )}

          {canCancel && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              disabled={cancel.isPending}
              onClick={() => cancel.mutate({})}
            >
              <XCircle className="size-3.5" />
              Annuler la mission
            </Button>
          )}
        </CardContent>
      </Card>
    </li>
  );
}

// ---- Create + assign a mission ---------------------------------------------

function CreateMissionSection() {
  const { data: matches } = useQuery(matchesQueryOptions);
  const { data: scouts } = useQuery(scoutsQueryOptions);
  const { data: players } = useQuery(playersQueryOptions);
  const createMission = useCreateMission();

  const [matchId, setMatchId] = useState("");
  const [scoutId, setScoutId] = useState("");
  const [playerIds, setPlayerIds] = useState<number[]>([]);

  function togglePlayer(id: number) {
    setPlayerIds((current) =>
      current.includes(id) ? current.filter((p) => p !== id) : [...current, id],
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    createMission.mutate(
      { matchId: Number(matchId), scoutId: Number(scoutId), playerIds },
      {
        onSuccess: () => {
          setMatchId("");
          setScoutId("");
          setPlayerIds([]);
        },
      },
    );
  }

  return (
    <section>
      <SectionTitle>Créer une mission</SectionTitle>
      <Card className="mt-3">
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mission-match">Match</Label>
              <Select
                id="mission-match"
                required
                value={matchId}
                onChange={(event) => setMatchId(event.target.value)}
              >
                <option value="" disabled>
                  Sélectionner un match
                </option>
                {matches?.map((match) => (
                  <option key={match.id} value={match.id}>
                    {match.homeClub?.name ?? "?"} – {match.awayClub?.name ?? "?"} (
                    {new Date(match.matchDate).toLocaleDateString("fr-CH")})
                  </option>
                ))}
              </Select>
              {matches?.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Aucun match — ajoute-en un dans "Ajout rapide" ci-dessous.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mission-scout">Scout</Label>
              <Select
                id="mission-scout"
                required
                value={scoutId}
                onChange={(event) => setScoutId(event.target.value)}
              >
                <option value="" disabled>
                  Sélectionner un scout
                </option>
                {scouts?.map((scout) => (
                  <option key={scout.id} value={scout.id}>
                    {scout.fullName ?? scout.email}
                  </option>
                ))}
              </Select>
              {scouts?.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucun scout inscrit pour l'instant.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Joueurs à observer</Label>
              <div className="max-h-44 space-y-1 overflow-y-auto border border-border p-2">
                {players?.map((player) => (
                  <label key={player.id} className="flex items-center gap-2 px-1 py-1.5 text-sm">
                    <input
                      type="checkbox"
                      checked={playerIds.includes(player.id)}
                      onChange={() => togglePlayer(player.id)}
                      className="size-4 accent-primary"
                    />
                    {player.firstName ? `${player.firstName} ` : ""}
                    {player.lastName}
                    {player.officialPosition ? ` — ${player.officialPosition}` : ""}
                  </label>
                ))}
                {players?.length === 0 && (
                  <p className="p-1 text-sm text-muted-foreground">Aucun joueur enregistré.</p>
                )}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={createMission.isPending}>
              Créer et attribuer
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

// ---- Quick add: club / match / player --------------------------------------

function Disclosure({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <Plus className="size-4 text-muted-foreground" />
          {title}
        </span>
        <ChevronDown
          className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>
      {open && <CardContent className="pt-0">{children}</CardContent>}
    </Card>
  );
}

function ClubQuickAdd() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const mutation = useCreateClub();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutation.mutate(
      { name, country: country || undefined },
      {
        onSuccess: () => {
          setName("");
          setCountry("");
        },
      },
    );
  }

  return (
    <Disclosure title="Nouveau club">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="Nom du club"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Input
          placeholder="Pays (facultatif)"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
        />
        <Button type="submit" variant="outline" className="w-full" disabled={mutation.isPending}>
          Ajouter le club
        </Button>
      </form>
    </Disclosure>
  );
}

function MatchQuickAdd() {
  const { data: clubs } = useQuery(clubsQueryOptions);
  const [homeClubId, setHomeClubId] = useState("");
  const [awayClubId, setAwayClubId] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [competition, setCompetition] = useState("");
  const [venue, setVenue] = useState("");
  const mutation = useCreateMatch();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutation.mutate(
      {
        homeClubId: homeClubId ? Number(homeClubId) : undefined,
        awayClubId: awayClubId ? Number(awayClubId) : undefined,
        matchDate,
        competition: competition || undefined,
        venue: venue || undefined,
      },
      {
        onSuccess: () => {
          setHomeClubId("");
          setAwayClubId("");
          setMatchDate("");
          setCompetition("");
          setVenue("");
        },
      },
    );
  }

  return (
    <Disclosure title="Nouveau match">
      <form onSubmit={handleSubmit} className="space-y-3">
        <ClubSelect
          clubs={clubs}
          value={homeClubId}
          onChange={setHomeClubId}
          placeholder="Club recevant"
        />
        <ClubSelect
          clubs={clubs}
          value={awayClubId}
          onChange={setAwayClubId}
          placeholder="Club visiteur"
        />
        <Input
          type="date"
          required
          value={matchDate}
          onChange={(event) => setMatchDate(event.target.value)}
        />
        <Input
          placeholder="Compétition (facultatif)"
          value={competition}
          onChange={(event) => setCompetition(event.target.value)}
        />
        <Input
          placeholder="Stade (facultatif)"
          value={venue}
          onChange={(event) => setVenue(event.target.value)}
        />
        <Button type="submit" variant="outline" className="w-full" disabled={mutation.isPending}>
          Ajouter le match
        </Button>
      </form>
    </Disclosure>
  );
}

function PlayerQuickAdd() {
  const { data: clubs } = useQuery(clubsQueryOptions);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState("");
  const [clubId, setClubId] = useState("");
  const mutation = useCreatePlayer();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutation.mutate(
      {
        firstName: firstName || undefined,
        lastName,
        officialPosition: position || undefined,
        clubId: clubId ? Number(clubId) : undefined,
      },
      {
        onSuccess: () => {
          setFirstName("");
          setLastName("");
          setPosition("");
          setClubId("");
        },
      },
    );
  }

  return (
    <Disclosure title="Nouveau joueur">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="Prénom (facultatif)"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />
        <Input
          placeholder="Nom"
          required
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
        />
        <Input
          placeholder="Poste (facultatif)"
          value={position}
          onChange={(event) => setPosition(event.target.value)}
        />
        <ClubSelect
          clubs={clubs}
          value={clubId}
          onChange={setClubId}
          placeholder="Club (facultatif)"
        />
        <Button type="submit" variant="outline" className="w-full" disabled={mutation.isPending}>
          Ajouter le joueur
        </Button>
      </form>
    </Disclosure>
  );
}

function ClubSelect({
  clubs,
  value,
  onChange,
  placeholder,
}: {
  clubs: Club[] | undefined;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <Select value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">{placeholder}</option>
      {clubs?.map((club) => (
        <option key={club.id} value={club.id}>
          {club.name}
        </option>
      ))}
    </Select>
  );
}
