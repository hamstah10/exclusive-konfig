import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Stepper } from "@/components/ankauf/Stepper";
import type { ValuationData } from "@/lib/valuation-schema";
import { toast } from "@/hooks/use-toast";
import { useVehicleValuation } from "@/hooks/use-vehicle-valuation";
import { FunnelHeader } from "@/components/ankauf/FunnelHeader";
import { FunnelTrustRow } from "@/components/ankauf/FunnelTrustRow";
import { FunnelStepRouter } from "@/components/ankauf/FunnelStepRouter";
import { ValuationSummaryBar } from "@/components/ankauf/ValuationSummaryBar";
import { submitValuationLead } from "@/lib/valuation-lead-submission";
import { useValuationDraft } from "@/contexts/ValuationDraftContext";
import { computeStartStep } from "@/lib/valuation-draft-mapper";
import { trackEvent, resetFirstInteractionTracker } from "@/lib/ankauf-analytics";
import { useFunnelProgress } from "@/contexts/FunnelProgressContext";

const steps = [
  { label: "Fahrzeug" },
  { label: "Zustand" },
  { label: "Fotos" },
  { label: "Kontakt" },
  { label: "Termin" },
];

const stepTitles = [
  { label: "Fahrzeug", title: "Fahrzeugdaten", sub: "Ein paar Eckdaten zu Ihrem Auto." },
  { label: "Zustand", title: "Zustand", sub: "Wie ist der aktuelle Zustand?" },
  { label: "Fotos", title: "Fotos (optional)", sub: "Bilder helfen uns, ein präziseres Angebot zu machen." },
  { label: "Kontakt", title: "Kontaktdaten", sub: "Wohin sollen wir das Angebot senden?" },
  { label: "Termin", title: "Wunschtermin", sub: "Wann passt es Ihnen am besten?" },
];

const AnkaufFunnelPage = () => {
  const { draft, applyDraft, clearDraft } = useValuationDraft();
  const [step, setStep] = useState(() => computeStartStep(draft));
  const [data, setData] = useState<ValuationData>(() => ({ ...draft }));
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const valuation = useVehicleValuation();
  const userAdvancedStep = useRef(false);
  const lastValuationKey = useRef<string>("");
  const latestStep = useRef(step);
  const leadSubmitted = useRef(false);
  const { setProgress } = useFunnelProgress();
  const stepEnteredAt = useRef<number>(performance.now());

  useEffect(() => {
    document.title = "Auto verkaufen · exclusiv Automobile Rügen";
  }, []);

  useEffect(() => {
    setProgress({ current: step, total: steps.length });
    return () => setProgress(null);
  }, [step, setProgress]);

  useEffect(() => {
    latestStep.current = step;
    stepEnteredAt.current = performance.now();
    const currentStep = stepTitles[step];
    trackEvent({
      eventName: "funnel_step_viewed",
      source: "valuation_funnel",
      funnelStep: step,
      stepLabel: currentStep.label,
      metadata: { title: currentStep.title },
    });
  }, [step]);

  useEffect(() => {
    const trackAbandonment = () => {
      if (leadSubmitted.current) return;
      const abandonedStep = latestStep.current;
      trackEvent({
        eventName: "funnel_abandoned",
        source: "valuation_funnel",
        funnelStep: abandonedStep,
        stepLabel: stepTitles[abandonedStep].label,
      });
    };
    window.addEventListener("pagehide", trackAbandonment);
    return () => window.removeEventListener("pagehide", trackAbandonment);
  }, []);

  useEffect(() => {
    setData((prev) => ({ ...prev, ...draft }));
    if (!userAdvancedStep.current) {
      const next = computeStartStep({ ...draft });
      setStep((current) => (next > current ? next : current));
    }
  }, [draft]);

  useEffect(() => {
    const merged: ValuationData = {
      condition: "gut",
      hasTuev: "ja",
      accidentFree: "ja",
      ...data,
    };
    if (
      !merged.brand || !merged.model || !merged.year ||
      merged.mileage === undefined || !merged.fuel || !merged.gearbox
    ) return;
    const key = [merged.brand, merged.model, merged.year, merged.mileage, merged.fuel, merged.gearbox, merged.condition, merged.hasTuev, merged.accidentFree].join("|");
    if (lastValuationKey.current === key) return;
    lastValuationKey.current = key;
    void valuation.fetchValuation(merged);
  }, [data, valuation]);

  const advance = (target: number, patch: Partial<ValuationData>, applyToDraft = true) => {
    const merged = { ...data, ...patch };
    setData(merged);
    if (applyToDraft) applyDraft(patch);
    userAdvancedStep.current = true;
    setStep(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return merged;
  };

  const handleVehicle = (d: ValuationData) => {
    const merged = advance(1, d);
    void valuation.fetchValuation({ condition: "gut", hasTuev: "ja", accidentFree: "ja", ...merged });
  };
  const handleCondition = (d: ValuationData) => {
    const merged = advance(2, d);
    void valuation.fetchValuation(merged);
  };
  const handlePhotos = (d: ValuationData) => advance(3, d, false);
  const handleContact = (d: ValuationData) => advance(4, d);

  const handleAppointment = async (d: ValuationData) => {
    const final = { ...data, ...d };
    setSubmitting(true);
    try {
      const { leadId } = await submitValuationLead(final, valuation.result);
      leadSubmitted.current = true;
      trackEvent({ eventName: "funnel_lead_submitted", source: "valuation_funnel", funnelStep: 4, stepLabel: "Termin" });
      resetFirstInteractionTracker();
      clearDraft();
      navigate("/ankauf/danke", {
        state: { leadId, brand: final.brand, model: final.model, valuation: valuation.result },
      });
    } catch (err) {
      toast({
        title: "Anfrage konnte nicht gesendet werden",
        description: err instanceof Error ? err.message : "Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const current = stepTitles[step];

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <SiteHeader variant="solid" />
      <main className="flex-1 py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="h-px w-10 bg-[hsl(var(--brand-gold))]" />
              <span className="text-[11px] uppercase tracking-[0.3em] text-[hsl(var(--brand-gold))] font-semibold">Ankauf</span>
              <span className="h-px w-10 bg-[hsl(var(--brand-gold))]" />
            </div>
            <h1 className="font-display text-3xl md:text-5xl tracking-tight text-[hsl(var(--brand-dark))]">
              Ihr Auto in <span className="italic text-[hsl(var(--brand-gold))]">2 Minuten</span> bewertet
            </h1>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Verbindliches Angebot innerhalb von 24 Stunden – unverbindlich und kostenlos.
            </p>
          </div>

          {(valuation.loading || valuation.error || valuation.result) && (
            <div className="mb-4">
              <ValuationSummaryBar
                loading={valuation.loading}
                error={valuation.error}
                result={valuation.result}
                onRetry={() => valuation.fetchValuation(data)}
              />
            </div>
          )}

          <div className="bg-card rounded-2xl shadow-elevated border border-border p-6 md:p-10">
            <Stepper steps={steps} current={step} />
            <div className="mt-9">
              <div className="mb-7">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">{current.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{current.sub}</p>
              </div>
              <FunnelStepRouter
                step={step}
                data={data}
                submitting={submitting}
                onVehicle={handleVehicle}
                onCondition={handleCondition}
                onPhotos={handlePhotos}
                onContact={handleContact}
                onAppointment={handleAppointment}
                onBack={setStep}
              />
            </div>
          </div>

          <FunnelTrustRow />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default AnkaufFunnelPage;