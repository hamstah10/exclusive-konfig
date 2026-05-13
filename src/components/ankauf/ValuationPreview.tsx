import { Loader2, TrendingUp, Sparkles, AlertCircle } from "lucide-react";

export interface ValuationResult {
  min_eur: number;
  typical_eur: number;
  max_eur: number;
  rationale: string;
}

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

export const ValuationPreview = ({ loading, error, result, onRetry }: Props) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-accent shrink-0" />
        <div>
          <p className="text-sm font-semibold">Bewertung wird berechnet …</p>
          <p className="text-xs text-muted-foreground">
            Unsere KI analysiert gerade aktuelle Marktpreise für Ihr Fahrzeug.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold">Bewertung nicht verfügbar</p>
            <p className="text-xs text-muted-foreground mt-1">{error}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Sie erhalten trotzdem ein verbindliches Angebot von unserem Team.
            </p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-2 text-xs font-medium text-accent hover:underline"
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
    <div className="rounded-xl border border-accent/40 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent p-5 shadow-soft">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-accent-foreground">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          KI-Sofortbewertung
        </p>
      </div>

      <div className="mt-3 flex items-baseline gap-2 flex-wrap">
        <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          {formatEur(result.min_eur)} – {formatEur(result.max_eur)}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Typisch: <span className="font-semibold text-foreground">{formatEur(result.typical_eur)}</span>
      </p>

      {result.rationale && (
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed border-t border-accent/20 pt-3">
          {result.rationale}
        </p>
      )}

      <p className="mt-3 text-xs text-muted-foreground flex items-start gap-1.5">
        <TrendingUp className="h-3.5 w-3.5 shrink-0 mt-0.5" />
        Unverbindliche Markteinschätzung. Das verbindliche Angebot erstellen wir nach kurzer Rücksprache.
      </p>
    </div>
  );
};
