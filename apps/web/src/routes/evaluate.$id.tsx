import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { currentUserQueryOptions } from "@/features/auth/api";
import {
  type EvaluationCriterion,
  type ObservationDecision,
  type Potential,
  activeEvaluationGridQueryOptions,
  decisionLabels,
  decisionOptions,
  potentialOptions,
} from "@/features/evaluations/api";
import { PitchPicker } from "@/features/evaluations/components/pitch-picker";
import { ScoreScale } from "@/features/evaluations/components/score-scale";
import { TagInput } from "@/features/evaluations/components/tag-input";
import { useCreateObservation } from "@/features/evaluations/hooks";
import { missionQueryOptions } from "@/features/missions/api";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, UserRound } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/evaluate/$id")({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(missionQueryOptions(Number(params.id))),
      context.queryClient.ensureQueryData(activeEvaluationGridQueryOptions),
    ]),
  component: EvaluateMission,
});

const decisionDescriptions: Record<ObservationDecision, string> = {
  suivi: "Continuer à suivre ce joueur lors de prochains matchs",
  prioritaire: "Profil prioritaire à pousser rapidement en interne",
  prise_de_contact: "Engager un premier contact avec le joueur ou son club",
  non_retenu: "Ne pas donner suite pour le moment",
};

const weatherOptions = ["Ensoleillé", "Nuageux", "Pluie", "Vent"];
const pitchConditionOptions = ["Excellent", "Bon", "Moyen", "Mauvais"];

type Answer = { score: number | null; comment: string };

type FormState = {
  playerId: number | null;
  playingTimeMinutes: string;
  weather: string;
  pitchCondition: string;
  observedPositions: string[];
  answers: Record<number, Answer>;
  currentLevel: number | null;
  potential: Potential | null;
  strengths: string[];
  weaknesses: string[];
  generalComment: string;
  decision: ObservationDecision | null;
};

type CriterionWithCategory = EvaluationCriterion & { categoryName: string };

type Step =
  | { type: "player" }
  | { type: "context" }
  | { type: "position" }
  | { type: "criterion"; criterion: CriterionWithCategory; index: number; total: number }
  | { type: "impression" }
  | { type: "tags" }
  | { type: "comment" }
  | { type: "decision" }
  | { type: "review" };

function EvaluateMission() {
  const { id } = Route.useParams();
  const missionId = Number(id);
  const navigate = useNavigate();
  const { data: mission } = useSuspenseQuery(missionQueryOptions(missionId));
  const { data: grid } = useSuspenseQuery(activeEvaluationGridQueryOptions);
  const { data: currentUser } = useQuery(currentUserQueryOptions);

  const criteria = useMemo<CriterionWithCategory[]>(
    () =>
      grid.categories
        .slice()
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .flatMap((category) =>
          category.criteria
            .slice()
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((criterion) => ({ ...criterion, categoryName: category.name })),
        ),
    [grid],
  );

  const [form, setForm] = useState<FormState>({
    playerId: mission.targets.length === 1 ? mission.targets[0].player.id : null,
    playingTimeMinutes: "",
    weather: "",
    pitchCondition: "",
    observedPositions: [],
    answers: {},
    currentLevel: null,
    potential: null,
    strengths: [],
    weaknesses: [],
    generalComment: "",
    decision: null,
  });

  const steps = useMemo<Step[]>(() => {
    const list: Step[] = [];
    if (mission.targets.length > 1) {
      list.push({ type: "player" });
    }
    list.push({ type: "context" });
    list.push({ type: "position" });
    criteria.forEach((criterion, index) =>
      list.push({ type: "criterion", criterion, index, total: criteria.length }),
    );
    list.push({ type: "impression" });
    list.push({ type: "tags" });
    list.push({ type: "comment" });
    list.push({ type: "decision" });
    list.push({ type: "review" });
    return list;
  }, [mission.targets.length, criteria]);

  const [stepIndex, setStepIndex] = useState(0);
  const createObservation = useCreateObservation(missionId);

  if (currentUser && currentUser.role !== "scout") {
    return (
      <StatusMessage
        title="Accès réservé aux scouts"
        description="Seul le scout assigné peut soumettre une évaluation pour cette mission."
        missionId={missionId}
      />
    );
  }

  if (mission.status !== "acceptee") {
    return (
      <StatusMessage
        title="Évaluation indisponible"
        description="Seule une mission acceptée peut être évaluée."
        missionId={missionId}
      />
    );
  }

  const step = steps[stepIndex];
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);

  function updateAnswer(criterionId: number, patch: Partial<Answer>) {
    setForm((prev) => {
      const existing: Answer = prev.answers[criterionId] ?? { score: null, comment: "" };
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [criterionId]: { ...existing, ...patch },
        },
      };
    });
  }

  function canGoNext(): boolean {
    switch (step.type) {
      case "player":
        return form.playerId !== null;
      case "position":
        return form.observedPositions.length > 0;
      case "criterion":
        return (form.answers[step.criterion.id]?.score ?? null) !== null;
      case "impression":
        return form.currentLevel !== null && form.potential !== null;
      case "decision":
        return form.decision !== null;
      default:
        return true;
    }
  }

  function goNext() {
    if (stepIndex < steps.length - 1) {
      setStepIndex((current) => current + 1);
    }
  }

  function goBack() {
    if (stepIndex > 0) {
      setStepIndex((current) => current - 1);
    }
  }

  function handleSubmit() {
    if (!form.playerId || form.currentLevel === null || !form.potential || !form.decision) {
      return;
    }

    createObservation.mutate(
      {
        playerId: form.playerId,
        playingTimeMinutes: form.playingTimeMinutes ? Number(form.playingTimeMinutes) : undefined,
        weather: form.weather || undefined,
        pitchCondition: form.pitchCondition || undefined,
        observedPositions: form.observedPositions,
        currentLevel: form.currentLevel,
        potential: form.potential,
        strengths: form.strengths,
        weaknesses: form.weaknesses,
        generalComment: form.generalComment || undefined,
        decision: form.decision,
        answers: criteria.map((criterion) => ({
          criterionId: criterion.id,
          score: form.answers[criterion.id]?.score ?? 1,
          comment: form.answers[criterion.id]?.comment || undefined,
        })),
      },
      {
        onSuccess: () => navigate({ to: "/missions/$id", params: { id } }),
      },
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 space-y-2 border-b border-border bg-background/95 p-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon-sm" onClick={goBack} disabled={stepIndex === 0}>
            <ArrowLeft className="size-4" />
          </Button>
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            {stepIndex + 1} / {steps.length}
          </p>
          <Link to="/missions/$id" params={{ id }} className="text-xs text-muted-foreground">
            Quitter
          </Link>
        </div>
        <div className="h-1 w-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6 pb-28">
        {step.type === "player" && (
          <StepShell title="Quel joueur évaluez-vous ?">
            <div className="space-y-2">
              {mission.targets.map((target) => (
                <button
                  key={target.id}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, playerId: target.player.id }))}
                  className="w-full text-left"
                >
                  <Card
                    className={
                      form.playerId === target.player.id
                        ? "flex items-center gap-3 border-primary p-3"
                        : "flex items-center gap-3 p-3"
                    }
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center border border-border bg-muted">
                      <UserRound className="size-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm">
                      {target.player.firstName ? `${target.player.firstName} ` : ""}
                      <span className="font-medium">{target.player.lastName}</span>
                      {target.player.officialPosition ? ` — ${target.player.officialPosition}` : ""}
                    </p>
                  </Card>
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {step.type === "context" && (
          <StepShell title="Contexte du match" subtitle="Facultatif">
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  Temps de jeu observé (minutes)
                </p>
                <Input
                  type="number"
                  min={0}
                  max={120}
                  value={form.playingTimeMinutes}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, playingTimeMinutes: event.target.value }))
                  }
                />
              </div>
              <ChipGroup
                label="Météo"
                options={weatherOptions}
                value={form.weather}
                onChange={(value) => setForm((prev) => ({ ...prev, weather: value }))}
              />
              <ChipGroup
                label="État du terrain"
                options={pitchConditionOptions}
                value={form.pitchCondition}
                onChange={(value) => setForm((prev) => ({ ...prev, pitchCondition: value }))}
              />
            </div>
          </StepShell>
        )}

        {step.type === "position" && (
          <StepShell
            title="Poste(s) observé(s)"
            subtitle="Sélectionnez au moins un poste occupé pendant le match"
          >
            <PitchPicker
              selected={form.observedPositions}
              onToggle={(position) =>
                setForm((prev) => ({
                  ...prev,
                  observedPositions: prev.observedPositions.includes(position)
                    ? prev.observedPositions.filter((p) => p !== position)
                    : [...prev.observedPositions, position],
                }))
              }
            />
          </StepShell>
        )}

        {step.type === "criterion" && (
          <StepShell
            title={step.criterion.name}
            subtitle={`${step.criterion.categoryName} · Question ${step.index + 1}/${step.total}`}
          >
            <div className="space-y-5">
              <ScoreScale
                value={form.answers[step.criterion.id]?.score ?? null}
                onChange={(score) => updateAnswer(step.criterion.id, { score })}
              />
              <Textarea
                placeholder="Commentaire (facultatif)"
                rows={2}
                value={form.answers[step.criterion.id]?.comment ?? ""}
                onChange={(event) =>
                  updateAnswer(step.criterion.id, { comment: event.target.value })
                }
              />
            </div>
          </StepShell>
        )}

        {step.type === "impression" && (
          <StepShell title="Impression générale">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  Niveau actuel
                </p>
                <ScoreScale
                  value={form.currentLevel}
                  onChange={(score) => setForm((prev) => ({ ...prev, currentLevel: score }))}
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  Potentiel
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {potentialOptions.map((potential) => (
                    <Button
                      key={potential}
                      type="button"
                      variant={form.potential === potential ? "default" : "outline"}
                      onClick={() => setForm((prev) => ({ ...prev, potential }))}
                    >
                      {potential}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </StepShell>
        )}

        {step.type === "tags" && (
          <StepShell title="Points forts / axes de travail" subtitle="Facultatif · 3 max chacun">
            <div className="space-y-6">
              <TagInput
                label="Points forts"
                values={form.strengths}
                onChange={(values) => setForm((prev) => ({ ...prev, strengths: values }))}
                placeholder="Ex. Vision de jeu"
              />
              <TagInput
                label="Axes de travail"
                values={form.weaknesses}
                onChange={(values) => setForm((prev) => ({ ...prev, weaknesses: values }))}
                placeholder="Ex. Vitesse"
              />
            </div>
          </StepShell>
        )}

        {step.type === "comment" && (
          <StepShell title="Commentaire général" subtitle="Facultatif">
            <Textarea
              rows={6}
              placeholder="Vos observations libres sur ce joueur..."
              value={form.generalComment}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, generalComment: event.target.value }))
              }
            />
          </StepShell>
        )}

        {step.type === "decision" && (
          <StepShell title="Décision">
            <div className="space-y-2">
              {decisionOptions.map((decision) => (
                <button
                  key={decision}
                  type="button"
                  className="w-full text-left"
                  onClick={() => setForm((prev) => ({ ...prev, decision }))}
                >
                  <Card
                    className={
                      form.decision === decision ? "space-y-1 border-primary p-4" : "space-y-1 p-4"
                    }
                  >
                    <p className="text-sm font-semibold">{decisionLabels[decision]}</p>
                    <p className="text-xs text-muted-foreground">
                      {decisionDescriptions[decision]}
                    </p>
                  </Card>
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {step.type === "review" && (
          <StepShell title="Récapitulatif" subtitle="Vérifiez avant l'envoi">
            <div className="space-y-3">
              <SummaryRow label="Postes observés" value={form.observedPositions.join(", ")} />
              <SummaryRow
                label="Niveau / Potentiel"
                value={`${form.currentLevel ?? "-"} / 5 · ${form.potential ?? "-"}`}
              />
              {form.decision && (
                <SummaryRow label="Décision" value={decisionLabels[form.decision]} />
              )}
              {form.strengths.length > 0 && (
                <SummaryRow label="Points forts" value={form.strengths.join(", ")} />
              )}
              {form.weaknesses.length > 0 && (
                <SummaryRow label="Axes de travail" value={form.weaknesses.join(", ")} />
              )}
              <SummaryRow
                label="Critères notés"
                value={`${criteria.length} / ${criteria.length}`}
              />
            </div>
          </StepShell>
        )}
      </div>

      <footer className="sticky bottom-0 border-t border-border bg-background p-4">
        {step.type === "review" ? (
          <Button
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            disabled={createObservation.isPending}
          >
            <Check className="size-4" />
            Envoyer l'évaluation
          </Button>
        ) : (
          <Button size="lg" className="w-full" onClick={goNext} disabled={!canGoNext()}>
            Suivant
            <ArrowRight className="size-4" />
          </Button>
        )}
      </footer>
    </div>
  );
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option}
            type="button"
            size="sm"
            variant={value === option ? "default" : "outline"}
            onClick={() => onChange(value === option ? "" : option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <Card className="flex items-center justify-between gap-3 p-3">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="text-sm font-medium">{value || "-"}</p>
    </Card>
  );
}

function StatusMessage({
  title,
  description,
  missionId,
}: {
  title: string;
  description: string;
  missionId: number;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <Badge variant="warning">Info</Badge>
      <h1 className="font-heading text-xl font-bold">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
      <Link to="/missions/$id" params={{ id: String(missionId) }}>
        <Button variant="outline">Retour à la mission</Button>
      </Link>
    </div>
  );
}
