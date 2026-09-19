import { cn } from "cn";

const PITCH_ROWS: string[][] = [
  ["AG", "BU", "AD"],
  ["MG", "MOC", "MD"],
  ["MDC", "MC"],
  ["DG", "DC", "DC", "DD"],
  ["GB"],
];

export function PitchPicker({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (position: string) => void;
}) {
  return (
    <div className="relative space-y-2 border-2 border-white/40 bg-gradient-to-b from-emerald-700 to-emerald-800 p-4">
      <div className="pointer-events-none absolute inset-x-4 top-1/2 h-px -translate-y-1/2 bg-white/25" />
      {PITCH_ROWS.map((row, rowIndex) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: rows are a static layout, never reordered
        <div key={rowIndex} className="relative z-10 flex justify-center gap-2">
          {row.map((position, index) => {
            const key = `${position}-${rowIndex}-${index}`;
            const isSelected = selected.includes(position);
            return (
              <button
                key={key}
                type="button"
                onClick={() => onToggle(position)}
                className={cn(
                  "flex h-11 w-14 items-center justify-center border text-xs font-semibold tracking-wide uppercase transition-colors",
                  isSelected
                    ? "border-white bg-white text-emerald-900"
                    : "border-white/50 bg-white/10 text-white hover:bg-white/20",
                )}
              >
                {position}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
