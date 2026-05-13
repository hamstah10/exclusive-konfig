import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: { label: string }[];
  current: number;
}

export const Stepper = ({ steps, current }: StepperProps) => {
  const progress = ((current) / (steps.length - 1)) * 100;

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative mb-7">
        <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-accent transition-smooth shadow-accent"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <ol className="flex items-start justify-between gap-1 sm:gap-2">
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={s.label} className="flex flex-col items-center text-center flex-1 min-w-0">
              <div
                className={cn(
                  "grid place-items-center rounded-full font-bold transition-smooth shrink-0",
                  active
                    ? "h-10 w-10 bg-gradient-accent text-accent-foreground text-sm ring-4 ring-accent/20 shadow-accent"
                    : done
                      ? "h-8 w-8 bg-accent text-accent-foreground text-xs"
                      : "h-8 w-8 bg-secondary text-muted-foreground text-xs border border-border",
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "mt-2 text-[10px] sm:text-xs leading-tight px-0.5 truncate w-full",
                  active
                    ? "text-foreground font-semibold"
                    : done
                      ? "text-foreground/70 font-medium"
                      : "text-muted-foreground font-normal",
                )}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
