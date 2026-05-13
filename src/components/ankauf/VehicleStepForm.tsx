import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { vehicleStepSchema, type VehicleStep, carBrands } from "@/lib/valuation-schema";
import { ArrowRight, Fuel, Zap, Flame, Leaf, ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AiFieldHighlight } from "@/components/ankauf/AiFieldHighlight";
import { SectionCard } from "@/components/ankauf/SectionCard";
import { trackEvent, trackFirstInteraction, trackValidationErrors } from "@/lib/ankauf-analytics";

interface Props {
  defaults?: Partial<VehicleStep>;
  onNext: (data: VehicleStep) => void;
}

const popularBrands: { value: string; label: string; logo: string }[] = [
  { value: "Volkswagen", label: "VW", logo: "https://cdn.simpleicons.org/volkswagen" },
  { value: "BMW", label: "BMW", logo: "https://cdn.simpleicons.org/bmw" },
  { value: "Mercedes-Benz", label: "Mercedes", logo: "https://cdn.simpleicons.org/mercedes" },
  { value: "Audi", label: "Audi", logo: "https://cdn.simpleicons.org/audi" },
  { value: "Opel", label: "Opel", logo: "https://cdn.simpleicons.org/opel" },
  { value: "Ford", label: "Ford", logo: "https://cdn.simpleicons.org/ford" },
  { value: "Škoda", label: "Škoda", logo: "https://cdn.simpleicons.org/skoda" },
  { value: "Toyota", label: "Toyota", logo: "https://cdn.simpleicons.org/toyota" },
];

const fuels = [
  { value: "benzin" as const, label: "Benzin", icon: Fuel },
  { value: "diesel" as const, label: "Diesel", icon: Fuel },
  { value: "hybrid" as const, label: "Hybrid", icon: Leaf },
  { value: "elektro" as const, label: "Elektro", icon: Zap },
  { value: "lpg" as const, label: "LPG", icon: Flame },
  { value: "cng" as const, label: "CNG", icon: Flame },
];

const gearboxes = [
  { value: "manuell" as const, label: "Manuell" },
  { value: "automatik" as const, label: "Automatik" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_MIN = 1980;
const YEAR_MAX = CURRENT_YEAR + 1;
const MILEAGE_MAX = 400_000;

const formatNum = (n: number) => n.toLocaleString("de-DE");

// Beliebte Modelle pro Marke für Suggest-Chips
const popularModelsByBrand: Record<string, string[]> = {
  Volkswagen: ["Golf", "Polo", "Tiguan", "Passat"],
  BMW: ["1er", "3er", "5er", "X1"],
  "Mercedes-Benz": ["A-Klasse", "C-Klasse", "E-Klasse", "GLA"],
  Audi: ["A3", "A4", "A6", "Q3"],
  Opel: ["Corsa", "Astra", "Insignia", "Mokka"],
  Ford: ["Fiesta", "Focus", "Kuga", "Mondeo"],
  "Škoda": ["Fabia", "Octavia", "Superb", "Kodiaq"],
  Toyota: ["Yaris", "Corolla", "RAV4", "Prius"],
};

export const VehicleStepForm = ({ defaults, onNext }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VehicleStep>({
    resolver: zodResolver(vehicleStepSchema),
    defaultValues: defaults,
    mode: "onTouched",
  });

  useEffect(() => {
    if (defaults) reset(defaults, { keepDirtyValues: true, keepTouched: true });
  }, [defaults, reset]);

  const currentBrand = watch("brand");
  const currentModel = watch("model");
  const [showOtherBrands, setShowOtherBrands] = useState(
    () => !!defaults?.brand && !popularBrands.some((p) => p.value === defaults.brand),
  );
  const modelSuggestions = currentBrand ? popularModelsByBrand[currentBrand] ?? [] : [];

  const handleFirstInteraction = (e: React.FocusEvent<HTMLFormElement> | React.PointerEvent<HTMLFormElement>) => {
    const target = e.target as HTMLElement;
    const field = target.getAttribute?.("name") ?? target.tagName?.toLowerCase() ?? "unknown";
    trackFirstInteraction({ funnelStep: 0, stepLabel: "Fahrzeug", field });
  };

  const onInvalid = (errs: typeof errors) => {
    trackValidationErrors({ funnelStep: 0, stepLabel: "Fahrzeug", errors: errs as never });
  };

  return (
    <form
      onSubmit={handleSubmit(onNext, onInvalid)}
      onFocusCapture={handleFirstInteraction}
      onPointerDownCapture={handleFirstInteraction}
      className="space-y-6"
    >
      {/* 1. Marke & Modell */}
      <SectionCard
        step="1"
        title="Marke & Modell"
        subtitle="Wähle den Hersteller und gib das Modell an."
      >
        <div>
          <Label className="text-sm font-medium">Marke</Label>
        <AiFieldHighlight fields="brand">
          <Controller
            control={control}
            name="brand"
            render={({ field }) => (
              <div className="mt-2 space-y-3">
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                  {popularBrands.map((b) => {
                    const active = field.value === b.value;
                    return (
                      <button
                        type="button"
                        key={b.value}
                        onClick={() => field.onChange(b.value)}
                        className={cn(
                          "group flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-smooth",
                          active
                            ? "border-accent bg-accent/10 shadow-accent -translate-y-0.5"
                            : "border-border hover:border-accent/40 hover:bg-secondary/40 hover:-translate-y-0.5",
                        )}
                        aria-pressed={active}
                      >
                        <img
                          src={b.logo}
                          alt={b.label}
                          width={32}
                          height={32}
                          className={cn(
                            "h-8 w-8 object-contain transition-base",
                            active ? "" : "opacity-70 group-hover:opacity-100",
                          )}
                          loading="lazy"
                        />
                        <span className="text-[11px] font-medium leading-none">{b.label}</span>
                      </button>
                    );
                  })}
                </div>
                {!showOtherBrands ? (
                  <button
                    type="button"
                    onClick={() => setShowOtherBrands(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-accent transition-base"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Weitere Marken anzeigen
                  </button>
                ) : (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <span className="whitespace-nowrap text-xs text-muted-foreground">Andere Marke:</span>
                    <div className="relative flex-1">
                      <select
                        value={popularBrands.some((p) => p.value === field.value) ? "" : (field.value || "")}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="h-9 w-full appearance-none rounded-md border border-input bg-background pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Bitte wählen</option>
                        {carBrands
                          .filter((b) => !popularBrands.some((p) => p.value === b))
                          .map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            )}
          />
        </AiFieldHighlight>
        {errors.brand && <p className="mt-1 text-xs text-destructive">{errors.brand.message}</p>}
        </div>

        <Field label="Modell" error={errors.model?.message} field="model">
          <Input {...register("model")} placeholder="z. B. Golf, A3, 320d" maxLength={60} />
          {modelSuggestions.length > 0 && !currentModel && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5 animate-in fade-in duration-200">
              <span className="text-[11px] text-muted-foreground">Beliebt:</span>
              {modelSuggestions.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setValue("model", m, { shouldValidate: true, shouldDirty: true })}
                onClickCapture={() =>
                  trackEvent({
                    eventName: "funnel_model_suggestion_clicked",
                    source: "valuation_funnel",
                    funnelStep: 0,
                    stepLabel: "Fahrzeug",
                    metadata: { brand: currentBrand, model: m },
                  })
                }
                  className="inline-flex h-6 items-center rounded-full border border-border bg-background px-2.5 text-[11px] font-medium text-muted-foreground transition-base hover:border-accent/50 hover:bg-accent/5 hover:text-foreground"
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </Field>
      </SectionCard>

      {/* 2. Antrieb (vorgezogen — schnelle Klicks) */}
      <SectionCard
        step="2"
        title="Antrieb"
        subtitle="Kraftstoff und Getriebe."
      >
        <div>
          <Label className="text-sm font-medium">Kraftstoff</Label>
        <AiFieldHighlight fields="fuel">
          <Controller
            control={control}
            name="fuel"
            render={({ field }) => (
              <div className="mt-2 flex flex-wrap gap-2">
                {fuels.map((f) => {
                  const Icon = f.icon;
                  const active = field.value === f.value;
                  return (
                    <button
                      type="button"
                      key={f.value}
                      onClick={() => field.onChange(f.value)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-smooth",
                        active
                          ? "border-accent bg-accent text-accent-foreground shadow-accent"
                          : "border-border text-muted-foreground hover:border-accent/40 hover:text-foreground hover:bg-secondary/40",
                      )}
                      aria-pressed={active}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {f.label}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </AiFieldHighlight>
        {errors.fuel && <p className="mt-1 text-xs text-destructive">{errors.fuel.message}</p>}
        </div>

        <Field label="Getriebe" error={errors.gearbox?.message} field="gearbox">
          <Controller
            control={control}
            name="gearbox"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2 sm:max-w-xs">
                {gearboxes.map((g) => {
                  const active = field.value === g.value;
                  return (
                    <button
                      type="button"
                      key={g.value}
                      onClick={() => field.onChange(g.value)}
                      className={cn(
                        "h-11 rounded-md border text-sm font-medium transition-smooth",
                        active
                          ? "border-accent bg-accent text-accent-foreground shadow-accent"
                          : "border-border hover:border-accent/40 hover:bg-secondary/40",
                      )}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </Field>
      </SectionCard>

      {/* 3. Eckdaten (ans Ende — höhere kognitive Last) */}
      <SectionCard
        step="3"
        title="Eckdaten"
        subtitle="Baujahr und aktueller Kilometerstand."
      >
        <div>
          <Label className="text-sm font-medium">Baujahr</Label>
          <AiFieldHighlight fields="year">
            <Controller
              control={control}
              name="year"
              render={({ field }) => {
                const value = typeof field.value === "number" ? field.value : CURRENT_YEAR - 5;
                return (
                  <div className="mt-2 space-y-3">
                    <div className="flex items-center gap-3">
                      <Slider
                        min={YEAR_MIN}
                        max={YEAR_MAX}
                        step={1}
                        value={[value]}
                        onValueChange={(v) => field.onChange(v[0])}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        inputMode="numeric"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const n = e.target.valueAsNumber;
                          field.onChange(Number.isFinite(n) ? n : undefined);
                        }}
                        min={YEAR_MIN}
                        max={YEAR_MAX}
                        className="w-24 text-center"
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>{YEAR_MIN}</span>
                      <span>{YEAR_MAX}</span>
                    </div>
                  </div>
                );
              }}
            />
          </AiFieldHighlight>
          {errors.year && <p className="mt-1 text-xs text-destructive">{errors.year.message}</p>}
        </div>

        <div>
          <Label className="text-sm font-medium">Kilometerstand</Label>
          <AiFieldHighlight fields="mileage">
            <Controller
              control={control}
              name="mileage"
              render={({ field }) => {
                const value = typeof field.value === "number" ? field.value : 80_000;
                return (
                  <div className="mt-2 space-y-3">
                    <div className="flex items-center gap-3">
                      <Slider
                        min={0}
                        max={MILEAGE_MAX}
                        step={1000}
                        value={[Math.min(value, MILEAGE_MAX)]}
                        onValueChange={(v) => field.onChange(v[0])}
                        className="flex-1"
                      />
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          inputMode="numeric"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const n = e.target.valueAsNumber;
                            field.onChange(Number.isFinite(n) ? n : undefined);
                          }}
                          min={0}
                          className="w-28 text-right"
                        />
                        <span className="text-xs text-muted-foreground">km</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>0 km</span>
                      <span>{formatNum(MILEAGE_MAX)}+ km</span>
                    </div>
                  </div>
                );
              }}
            />
          </AiFieldHighlight>
          {errors.mileage && <p className="mt-1 text-xs text-destructive">{errors.mileage.message}</p>}
        </div>
      </SectionCard>

      <div className="flex justify-end pt-2">
        <Button type="submit" variant="cta" size="lg">
          Weiter zum Zustand <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

const Field = ({
  label,
  error,
  field,
  children,
}: {
  label: string;
  error?: string;
  field: keyof VehicleStep;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-medium">{label}</Label>
    <AiFieldHighlight fields={field}>{children}</AiFieldHighlight>
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);