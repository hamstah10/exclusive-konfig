import { useState } from "react";
import { ChevronDown, Loader2, Sparkles, AlertCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ValuationResult } from "@/components/ankauf/ValuationPreview";
import { useCountUp } from "@/hooks/use-count-up";

interface Props {
  loading: boolean;
  error: string | null;
  result: ValuationResult | null;
  onRetry?: () => void;
}

const formatEur = (n: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

export const ValuationSummaryBar = ({ loading, error, result, onRetry }: Props) => {
  const [open, setOpen] = useState(false);
  const minValue = useCountUp(result?.min_eur ?? null);
  const typicalValue = useCountUp(result?.typical_eur ?? null);
  const maxValue = useCountUp(result?.max_eur ?? null);

  if (loading) {
    return (
      <div className="rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 flex items-center gap-3">
        <Loader2 className="h-4 w-4 animate-spin text-accent shrink-0" />
        <p className="text-sm font-medium">KI-Bewertung wird berechnet …</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">Bewertung nicht verfügbar</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{error}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-1 text-xs font-medium text-accent hover:underline"
              >
                Erneut versuchen
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="rounded-xl border border-accent/40 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent shadow-soft overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-accent/5 transition-base"
        aria-expanded={open}
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-accent-foreground shrink-0">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-accent leading-tight">
            KI-Sofortbewertung
          </p>
          <p className="text-sm font-bold text-foreground truncate tabular-nums">
            {formatEur(Math.round(minValue))} – {formatEur(Math.round(maxValue))}
            <span className="ml-2 font-normal text-xs text-muted-foreground tabular-nums">
              Ø {formatEur(Math.round(typicalValue))}
            </span>
          </p>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground shrink-0 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 pt-0 border-t border-accent/20 space-y-3">
          {result.rationale && (
            <p className="text-sm text-muted-foreground leading-relaxed pt-3">
              {result.rationale}
            </p>
          )}
          <p className="text-xs text-muted-foreground flex items-start gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            Unverbindliche Markteinschätzung. Das verbindliche Angebot erstellen wir nach
            kurzer Rücksprache.
          </p>
        </div>
      )}
    </div>
  );
};