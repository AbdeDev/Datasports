import { Card } from "@/components/ui/card";
import type { Mission } from "@/features/missions/api";

export function MissionChart({ missions }: { missions: Mission[] }) {
  const segments = [
    {
      label: "Actives",
      color: "var(--primary)",
      count: missions.filter((m) => !["terminee", "annulee"].includes(m.status)).length,
    },
    {
      label: "Terminées",
      color: "#34d399",
      count: missions.filter((m) => m.status === "terminee").length,
    },
    {
      label: "Annulées",
      color: "#94a3b8",
      count: missions.filter((m) => m.status === "annulee").length,
    },
  ];
  const total = missions.length;
  let offset = 0;
  const arcs = segments.map((segment) => {
    const length = total ? (segment.count / total) * 100 : 0;
    const arc = { ...segment, length, offset };
    offset += length;
    return arc;
  });

  return (
    <Card className="overflow-hidden p-5">
      <p className="elite-kicker">Répartition des missions</p>
      <h2 className="mt-2 font-heading text-xl font-black uppercase">Le terrain en chiffres</h2>
      <p className="mt-2 text-xs text-muted-foreground">
        Toutes les missions accessibles à votre compte.
      </p>
      <div className="relative mx-auto my-6 size-44">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
          <circle cx="60" cy="60" r="48" fill="none" stroke="var(--muted)" strokeWidth="10" />
          {arcs
            .filter((arc) => arc.length > 0)
            .map((arc) => (
              <circle
                key={arc.label}
                cx="60"
                cy="60"
                r="48"
                pathLength="100"
                fill="none"
                stroke={arc.color}
                strokeWidth="10"
                strokeDasharray={`${arc.length} ${100 - arc.length}`}
                strokeDashoffset={-arc.offset}
              />
            ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <strong className="text-4xl font-black tabular-nums">{total}</strong>
          <span className="mt-1 text-xs text-muted-foreground">missions</span>
        </div>
      </div>
      {total === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          Le graphique se remplira avec vos premières missions.
        </p>
      ) : (
        <ul className="space-y-3" aria-label="Nombre de missions par statut">
          {segments.map((segment) => (
            <li key={segment.label} className="flex items-center gap-2 text-xs">
              <span
                className="size-2 rounded-full"
                style={{ background: segment.color }}
                aria-hidden="true"
              />
              <span className="flex-1 text-muted-foreground">{segment.label}</span>
              <strong className="tabular-nums">{segment.count}</strong>
              <span className="w-10 text-right text-muted-foreground tabular-nums">
                {Math.round((segment.count / total) * 100)} %
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
