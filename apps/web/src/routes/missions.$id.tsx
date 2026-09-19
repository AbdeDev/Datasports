import { Button } from "@/components/ui/button";
import { clubsQueryOptions } from "@/features/clubs/api";
import { type Mission, missionQueryOptions, missionStatusLabels } from "@/features/missions/api";
import {
  useAddSpottedPlayer,
  useRespondMission,
  useWithdrawMission,
} from "@/features/missions/hooks";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
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
  const respond = useRespondMission(missionId);
  const withdraw = useWithdrawMission(missionId);
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);

  // Withdrawing doesn't lose the mission — the scout can still change their
  // mind and re-accept as long as it hasn't been reassigned to someone else.
  const canRespond = mission.status === "proposee" || mission.status === "scout_indisponible";
  const canWithdraw = mission.status === "acceptee";

  return (
    <div className="p-6">
      <span className="rounded-full bg-muted px-2 py-0.5 text-xs uppercase text-muted-foreground">
        {missionStatusLabels[mission.status]}
      </span>

      <h1 className="mt-3 font-heading text-2xl font-bold">
        {mission.match.homeClub?.name ?? "?"} – {mission.match.awayClub?.name ?? "?"}
      </h1>

      <p className="mt-1 text-sm text-muted-foreground">
        {new Date(mission.match.matchDate).toLocaleDateString("fr-CH", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
        {mission.match.competition ? ` · ${mission.match.competition}` : ""}
        {mission.match.venue ? ` · ${mission.match.venue}` : ""}
      </p>

      <TargetPlayers mission={mission} />

      {mission.declineReason &&
        (mission.status === "a_reattribuer" || mission.status === "scout_indisponible") && (
          <p className="mt-6 text-sm text-muted-foreground">Motif : {mission.declineReason}</p>
        )}

      {canRespond && (
        <section className="mt-8 space-y-3">
          {!showDeclineForm ? (
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => respond.mutate({ decision: "accept" })}
                disabled={respond.isPending}
              >
                Je suis dispo
              </Button>
              <Button variant="outline" onClick={() => setShowDeclineForm(true)}>
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
                respond.mutate({ decision: "decline", declineReason: value || undefined })
              }
            />
          )}
          {respond.isError && (
            <p className="text-sm text-destructive">Une erreur est survenue, réessaie.</p>
          )}
        </section>
      )}

      {canWithdraw && (
        <section className="mt-8 space-y-3">
          {!showWithdrawForm ? (
            <Button variant="outline" className="w-full" onClick={() => setShowWithdrawForm(true)}>
              Me désister
            </Button>
          ) : (
            <ReasonForm
              label="Motif du désistement (facultatif)"
              confirmLabel="Confirmer le désistement"
              isPending={withdraw.isPending}
              onCancel={() => setShowWithdrawForm(false)}
              onConfirm={(value) => withdraw.mutate({ reason: value || undefined })}
            />
          )}
          {withdraw.isError && (
            <p className="text-sm text-destructive">Une erreur est survenue, réessaie.</p>
          )}
        </section>
      )}

      <SpottedPlayerForm missionId={missionId} />
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
    <div className="space-y-3">
      <label htmlFor="reason" className="text-sm font-medium">
        {label}
      </label>
      <textarea
        id="reason"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
        rows={3}
      />
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={() => onConfirm(value)} disabled={isPending}>
          {confirmLabel}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </div>
  );
}

function TargetPlayers({ mission }: { mission: Mission }) {
  return (
    <section className="mt-6">
      <h2 className="text-sm font-semibold uppercase text-muted-foreground">Joueurs à observer</h2>
      <ul className="mt-2 space-y-2">
        {mission.targets.map((target) => (
          <li key={target.id} className="rounded-lg border border-border p-3 text-sm">
            {target.player.firstName ? `${target.player.firstName} ` : ""}
            {target.player.lastName}
            {target.player.officialPosition ? ` — ${target.player.officialPosition}` : ""}
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
      <Button variant="outline" className="mt-8 w-full" onClick={() => setOpen(true)}>
        + Joueur repéré
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-3 rounded-lg border border-border p-4">
      <h2 className="text-sm font-semibold uppercase text-muted-foreground">Joueur repéré</h2>

      <input
        placeholder="Nom"
        required
        value={lastName}
        onChange={(event) => setLastName(event.target.value)}
        className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
      />
      <input
        placeholder="Prénom"
        required
        value={firstName}
        onChange={(event) => setFirstName(event.target.value)}
        className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
      />
      <input
        placeholder="Poste"
        required
        value={position}
        onChange={(event) => setPosition(event.target.value)}
        className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
      />
      <select
        required
        value={clubId}
        onChange={(event) => setClubId(event.target.value)}
        className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
      >
        <option value="" disabled>
          Club
        </option>
        {clubs?.map((club) => (
          <option key={club.id} value={club.id}>
            {club.name}
          </option>
        ))}
      </select>

      {clubs?.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Aucun club enregistré — demande à un admin d'en créer un avant d'ajouter ce joueur.
        </p>
      )}

      {addSpotted.isError && (
        <p className="text-sm text-destructive">Une erreur est survenue, réessaie.</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Button type="submit" disabled={addSpotted.isPending}>
          Ajouter
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
