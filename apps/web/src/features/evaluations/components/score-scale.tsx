import { Button } from "@/components/ui/button";

const SCORE_LABELS: Record<number, string> = {
  1: "Faible",
  2: "Limite",
  3: "Correct",
  4: "Bon",
  5: "Excellent",
};

export function ScoreScale({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (score: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {[1, 2, 3, 4, 5].map((score) => (
        <Button
          key={score}
          type="button"
          variant={value === score ? "default" : "outline"}
          size="lg"
          className="flex-col gap-1 normal-case"
          onClick={() => onChange(score)}
        >
          <span className="text-lg font-bold">{score}</span>
          <span className="text-[10px] font-normal tracking-normal opacity-80">
            {SCORE_LABELS[score]}
          </span>
        </Button>
      ))}
    </div>
  );
}
