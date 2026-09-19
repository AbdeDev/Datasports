import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { currentUserQueryOptions } from "@/features/auth/api";
import { clubsQueryOptions } from "@/features/clubs/api";
import {
  type Mission,
  missionQueryOptions,
  missionStatusLabels,
  missionStatusVariants,
} from "@/features/missions/api";
import {
  useAddSpottedPlayer,
  useCancelMission,
  useRespondMission,
  useWithdrawMission,
} from "@/features/missions/hooks";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ClipboardCheck, MapPin, Trophy, UserRound, XCircle } from "lucide-react";
import { type FormEvent, useState } from "react";

export const Route = createFileRoute("/missions/$id")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(missionQueryOptions(Number(params.id))),
  component: MissionDetail,
});

function MissionDetail() {
  const { id } = Route.useParams();
  const missionId = Number(id);
  const { data: mission } = useSuspenseQuery(missionQueryOptions(missionId));
  const { data: currentUser } = useQuery(currentUserQueryOptions);
  const isAdmin = currentUser?.role === "admin";
  const isScout = currentUser?.role === "scout";

  const respond = useRespondMission(missionId);
  const withdraw = useWithdrawMission(missionId);
  const cancel = useCancelMission(missionId);
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);

  // Declining or withdrawing doesn't lose the mission — the scout can still
  // change their mind and respond again as long as it hasn't been
  // reassigned to someone else.
  const canRespond =
    isScout &&
    (mission.status === "proposee" ||
      mission.status === "a_reattribuer" ||
      mission.status === "scout_indisponible");
  const canWithdraw = isScout && mission.status === "acceptee";
  const canCancel = isAdmin && mission.status !== "annulee" && mission.status !== "terminee";

  return (
    <div className="space-y-6 p-6 pb-24">
      <div>
        <div className="flex items-start justify-between gap-2">
          <Badge variant={missionStatusVariants[mission.status]}>
            {missionStatusLabels[mission.status]}
          </Badge>
          {canCancel && !showCancelForm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => setShowCancelForm(true)}
            >
              <XCircle className="size-3.5" />
              Annuler la mission
            </Button>
          )}
        </div>

        <h1 className="mt-3 font-heading text-2xl font-bold">
          {mission.match.homeClub?.name ?? "?"} – {mission.match.awayClub?.name ?? "?"}
        </h1>

        <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0" />
            {new Date(mission.match.matchDate).toLocaleDateString("fr-CH", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>
          {mission.match.competition && (
            <div className="flex items-center gap-2">
              <Trophy className="size-4 shrink-0" />
              {mission.match.competition}
            </div>
          )}
          {mission.match.venue && (
            <div className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0" />
              {mission.match.venue}
            </div>
          )}
        </div>
      </div>

      {showCancelForm && (
        <ReasonForm
          label="Motif d'annulation (facultatif)"
          confirmLabel="Confirmer l'annulation"
          isPending={cancel.isPending}
          onCancel={() => setShowCancelForm(false)}
          onConfirm={(value) =>
            cancel.mutate(
              { reason: value || undefined },
              { onSuccess: () => setShowCancelForm(false) },
            )
          }
        />
      )}

      <TargetPlayers mission={mission} />

      {mission.declineReason &&
        (mission.status === "a_reattribuer" ||
          mission.status === "scout_indisponible" ||
          mission.status === "annulee") && (
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="pt-4 text-sm text-muted-foreground">
              Motif : {mission.declineReason}
            </CardContent>
          </Card>
        )}

      {canRespond && (
        <section className="space-y-3">
          {!showDeclineForm ? (
            <div className="grid grid-cols-2 gap-3">
              <Button
                size="lg"
                onClick={() => respond.mutate({ decision: "accept" })}
                disabled={respond.isPending}
              >
                Je suis dispo
              </Button>
              <Button size="lg" variant="outline" onClick={() => setShowDeclineForm(true)}>
                Indispo
              </Button>
            </div>
          ) : (
            <ReasonForm
              label="Justification (facultatif)"
              confirmLabel="Confirmer"
              isPending={respond.isPending}
              onCancel={() => setShowDeclineForm(false)}
              onConfirm={(value) =>
                respond.mutate(
                  { decision: "decline", declineReason: value || undefined },
                  { onSuccess: () => setShowDeclineForm(false) },
                )
              }
            />
          )}
        </section>
      )}

      {canWithdraw && (
        <section className="space-y-3">
          {!showWithdrawForm ? (
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={() => setShowWithdrawForm(true)}
            >
              Me désister
            </Button>
          ) : (
            <ReasonForm
              label="Motif du désistement (facultatif)"
              confirmLabel="Confirmer le désistement"
              isPending={withdraw.isPending}
              onCancel={() => setShowWithdrawForm(false)}
              onConfirm={(value) =>
                withdraw.mutate(
                  { reason: value || undefined },
                  { onSuccess: () => setShowWithdrawForm(false) },
                )
              }
            />
          )}
        </section>
      )}

      {isScout && mission.status === "acceptee" && (
        <Link to="/evaluate/$id" params={{ id }}>
          <Button size="lg" className="w-full">
            <ClipboardCheck className="size-4" />
            Évaluer le joueur
          </Button>
        </Link>
      )}

      {isScout && <SpottedPlayerForm missionId={missionId} />}
    </div>
  );
}

function ReasonForm({
  label,
  confirmLabel,
  isPending,
  onCancel,
  onConfirm,
}: {
  label: string;
  confirmLabel: string;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: (value: string) => void;
}) {
  const [value, setValue] = useState("");

  return (
    <Card>
      <CardContent className="space-y-3 pt-4">
        <div className="space-y-2">
          <Label htmlFor="reason">{label}</Label>
          <Textarea
            id="reason"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            rows={3}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => onConfirm(value)} disabled={isPending}>
            {confirmLabel}
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TargetPlayers({ mission }: { mission: Mission }) {
  return (
    <section>
      <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        Joueurs à observer
      </h2>
      <ul className="mt-2 space-y-2">
        {mission.targets.map((target) => (
          <li key={target.id}>
            <Card className="flex items-center gap-3 p-3">
              <div className="flex size-9 shrink-0 items-center justify-center border border-border bg-muted">
                <UserRound className="size-4 text-muted-foreground" />
              </div>
              <p className="text-sm">
                {target.player.firstName ? `${target.player.firstName} ` : ""}
                <span className="font-medium">{target.player.lastName}</span>
                {target.player.officialPosition ? ` — ${target.player.officialPosition}` : ""}
              </p>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SpottedPlayerForm({ missionId }: { missionId: number }) {
  const addSpotted = useAddSpottedPlayer(missionId);
  const { data: clubs } = useQuery(clubsQueryOptions);
  const [open, setOpen] = useState(false);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [position, setPosition] = useState("");
  const [clubId, setClubId] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    addSpotted.mutate(
      {
        lastName,
        firstName,
        officialPosition: position,
        clubId: Number(clubId),
      },
      {
        onSuccess: () => {
          setLastName("");
          setFirstName("");
          setPosition("");
          setClubId("");
          setOpen(false);
        },
      },
    );
  }

  if (!open) {
    return (
      <Button variant="outline" size="lg" className="w-full" onClick={() => setOpen(true)}>
        + Joueur repéré
      </Button>
    );
  }

  return (
    <Card>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Joueur repéré
          </h2>

          <div className="space-y-2">
            <Label htmlFor="spotted-lastname">Nom</Label>
            <Input
              id="spotted-lastname"
              required
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spotted-firstname">Prénom</Label>
            <Input
              id="spotted-firstname"
              required
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spotted-position">Poste</Label>
            <Input
              id="spotted-position"
              required
              value={position}
              onChange={(event) => setPosition(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spotted-club">Club</Label>
            <Select
              id="spotted-club"
              required
              value={clubId}
              onChange={(event) => setClubId(event.target.value)}
            >
              <option value="" disabled>
                Sélectionner un club
              </option>
              {clubs?.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </Select>
            {clubs?.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aucun club enregistré — demande à un admin d'en créer un avant d'ajouter ce joueur.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button type="submit" disabled={addSpotted.isPending}>
              Ajouter
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
