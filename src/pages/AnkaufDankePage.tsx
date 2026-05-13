import { Link, useLocation } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles } from "lucide-react";
import type { ValuationResult } from "@/components/ankauf/ValuationPreview";

interface DankeState {
  leadId?: string;
  brand?: string;
  model?: string;
  valuation?: ValuationResult | null;
}

const formatEur = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const AnkaufDankePage = () => {
  const { state } = useLocation();
  const s = (state ?? {}) as DankeState;

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <SiteHeader variant="solid" />
      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--brand-gold))]/15 text-[hsl(var(--brand-gold))] mb-6">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl">
            Vielen <span className="italic text-[hsl(var(--brand-gold))]">Dank</span>!
          </h1>
          <p className="mt-4 text-muted-foreground">
            Wir haben Ihre Anfrage erhalten{s.brand && s.model ? ` für Ihren ${s.brand} ${s.model}` : ""}.
            Unser Team meldet sich innerhalb von 24 Stunden mit einem verbindlichen Angebot.
          </p>

          {s.valuation && (
            <div className="mt-8 rounded-2xl border border-[hsl(var(--brand-gold))]/40 bg-gradient-to-br from-[hsl(var(--brand-gold))]/10 via-[hsl(var(--brand-gold))]/5 to-transparent p-6 text-left shadow-soft">
              <div className="flex items-center gap-2 text-[hsl(var(--brand-gold))]">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">KI-Sofortbewertung</span>
              </div>
              <p className="mt-3 text-3xl font-extrabold tracking-tight tabular-nums">
                {formatEur(s.valuation.min_eur)} – {formatEur(s.valuation.max_eur)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Typisch <span className="font-semibold text-foreground">{formatEur(s.valuation.typical_eur)}</span>
              </p>
              {s.valuation.rationale && (
                <p className="mt-4 text-sm text-muted-foreground border-t border-[hsl(var(--brand-gold))]/20 pt-3">
                  {s.valuation.rationale}
                </p>
              )}
            </div>
          )}

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="cta" size="lg"><Link to="/">Zur Startseite</Link></Button>
            <Button asChild variant="outline" size="lg"><Link to="/fahrzeuge">Unsere Fahrzeuge</Link></Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default AnkaufDankePage;