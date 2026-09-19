type Point = { date: string; level: number };

const WIDTH = 100;
const HEIGHT = 40;
const PADDING_X = 6;

export function ProgressionChart({ points }: { points: Point[] }) {
  const usableWidth = WIDTH - PADDING_X * 2;
  const stepX = points.length > 1 ? usableWidth / (points.length - 1) : 0;
  const yForLevel = (level: number) => HEIGHT - 6 - ((level - 1) / 4) * (HEIGHT - 12);

  const pathD = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${PADDING_X + index * stepX} ${yForLevel(point.level)}`,
    )
    .join(" ");

  return (
    <div className="space-y-2">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-32 w-full" role="img">
        <title>Courbe de progression du niveau évalué au fil des observations</title>
        {[1, 2, 3, 4, 5].map((level) => (
          <line
            key={level}
            x1={PADDING_X}
            x2={WIDTH - PADDING_X}
            y1={yForLevel(level)}
            y2={yForLevel(level)}
            className="stroke-border"
            strokeWidth={0.3}
          />
        ))}
        <path
          d={pathD}
          fill="none"
          className="stroke-primary"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((point, index) => (
          <circle
            key={point.date}
            cx={PADDING_X + index * stepX}
            cy={yForLevel(point.level)}
            r={1.8}
            className="fill-primary"
          />
        ))}
      </svg>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        {points.map((point) => (
          <span key={point.date}>
            {new Date(point.date).toLocaleDateString("fr-CH", { day: "2-digit", month: "2-digit" })}
          </span>
        ))}
      </div>
    </div>
  );
}
