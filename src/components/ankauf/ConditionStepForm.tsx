import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { conditionStepSchema, type ConditionStep, type Feature } from "@/lib/valuation-schema";
import {
  ArrowRight, ArrowLeft, Snowflake, Navigation, Flame, Armchair, Link2, Sun,
  Radar, Gauge, Lightbulb, MonitorSmartphone, Disc3, ThermometerSun, Camera,
  Crosshair, Crosshair as CrosshairIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AiFieldHighlight } from "@/components/ankauf/AiFieldHighlight";
import { SectionCard } from "@/components/ankauf/SectionCard";
import { trackFirstInteraction, trackValidationErrors } from "@/lib/ankauf-analytics";

interface Props {
  defaults?: Partial<ConditionStep>;
  onNext: (data: ConditionStep) => void;
  onBack: () => void;
}

const conditions = [
  { value: "sehr_gut", label: "Sehr gut", desc: "Wenige bis keine Gebrauchsspuren" },
  { value: "gut", label: "Gut", desc: "Normale altersgemäße Spuren" },
  { value: "gebraucht", label: "Gebraucht", desc: "Sichtbare Gebrauchsspuren" },
  { value: "maengel", label: "Mit Mängeln", desc: "Reparaturbedarf vorhanden" },
  { value: "defekt", label: "Defekt", desc: "Nicht fahrbereit / Motorschaden" },
] as const;

const standardFeatures: { value: Feature; label: string; icon: typeof Snowflake }[] = [
  { value: "klima", label: "Klimaanlage", icon: Snowflake },
  { value: "navi", label: "Navigation", icon: Navigation },
  { value: "sitzheizung", label: "Sitzheizung", icon: Flame },
  { value: "leder", label: "Leder", icon: Armchair },
  { value: "ahk", label: "Anhängerkupplung", icon: Link2 },
  { value: "schiebedach", label: "Schiebedach", icon: Sun },
  { value: "pdc", label: "Parksensoren", icon: Radar },
  { value: "tempomat", label: "Tempomat", icon: Gauge },
];

const premiumFeatures: { value: Feature; label: string; icon: typeof Lightbulb }[] = [
  { value: "led_xenon", label: "LED / Xenon", icon: Lightbulb },
  { value: "head_up", label: "Head-Up-Display", icon: MonitorSmartphone },
  { value: "alufelgen", label: "Alufelgen", icon: Disc3 },
  { value: "standheizung", label: "Standheizung", icon: ThermometerSun },
  { value: "kamera_360", label: "360°-Kamera", icon: Camera },
  { value: "spurhalte", label: "Spurhalteassistent", icon: Crosshair },
  { value: "acc", label: "Adapt. Tempomat", icon: CrosshairIcon },
];

const colors: { value: string; label: string; swatch: string }[] = [
  { value: "schwarz", label: "Schwarz", swatch: "#0a0a0a" },
  { value: "weiss", label: "Weiß", swatch: "#f5f5f5" },
  { value: "silber", label: "Silber", swatch: "#c0c4c9" },
  { value: "grau", label: "Grau", swatch: "#6b7280" },
  { value: "blau", label: "Blau", swatch: "#1e40af" },
  { value: "rot", label: "Rot", swatch: "#b91c1c" },
  { value: "gruen", label: "Grün", swatch: "#15803d" },
  { value: "braun", label: "Braun", swatch: "#78350f" },
  { value: "beige", label: "Beige", swatch: "#d6c8a8" },
  { value: "gelb", label: "Gelb", swatch: "#eab308" },
  { value: "orange", label: "Orange", swatch: "#ea580c" },
  { value: "andere", label: "Andere", swatch: "linear-gradient(135deg,#ef4444,#3b82f6,#22c55e)" },
];

const doorOptions = ["2", "3", "4", "5"] as const;
const seatOptions = ["2", "4", "5", "7"] as const;

export const ConditionStepForm = ({ defaults, onNext, onBack }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ConditionStep>({
    resolver: zodResolver(conditionStepSchema),
    defaultValues: defaults,
    mode: "onTouched",
  });

  useEffect(() => {
    if (defaults) reset(defaults, { keepDirtyValues: true, keepTouched: true });
  }, [defaults, reset]);

  return (
    <form
      onSubmit={handleSubmit(onNext, (errs) =>
        trackValidationErrors({ funnelStep: 1, stepLabel: "Zustand", errors: errs as never }),
      )}
      onFocusCapture={(e) => {
        const t = e.target as HTMLElement;
        const field = t.getAttribute?.("name") ?? t.tagName?.toLowerCase() ?? "unknown";
        trackFirstInteraction({ funnelStep: 1, stepLabel: "Zustand", field });
      }}
      onPointerDownCapture={(e) => {
        const t = e.target as HTMLElement;
        const field = t.getAttribute?.("name") ?? t.tagName?.toLowerCase() ?? "unknown";
        trackFirstInteraction({ funnelStep: 1, stepLabel: "Zustand", field });
      }}
      className="space-y-6"
    >
      {/* 1. Allgemeiner Zustand */}
      <SectionCard
        step="1"
        title="Allgemeiner Zustand"
        subtitle="Beschreibe den Gesamteindruck und Pflichtangaben."
      >
        <div>
          <Label className="text-sm font-medium">Zustand</Label>
          <AiFieldHighlight fields="condition">
            <Controller
              control={control}
              name="condition"
              render={({ field }) => (
                <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {conditions.map((c) => (
                    <button
                      type="button"
                      key={c.value}
                      onClick={() => field.onChange(c.value)}
                      className={cn(
                        "text-left rounded-lg border p-3 transition-smooth",
                        field.value === c.value
                          ? "border-accent bg-accent/10 shadow-accent -translate-y-0.5"
                          : "border-border hover:border-accent/40 hover:bg-secondary/40",
                      )}
                    >
                      <p className="text-sm font-semibold">{c.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{c.desc}</p>
                    </button>
                  ))}
                </div>
              )}
            />
          </AiFieldHighlight>
          {errors.condition && (
            <p className="text-xs text-destructive mt-1">{errors.condition.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <RadioGroupField
            label="Hat das Fahrzeug TÜV?"
            name="hasTuev"
            control={control}
            error={errors.hasTuev?.message}
            options={[
              { value: "ja", label: "Ja, gültig" },
              { value: "abgelaufen", label: "Abgelaufen" },
              { value: "nein", label: "Nein" },
            ]}
          />
          <RadioGroupField
            label="Unfallfrei?"
            name="accidentFree"
            control={control}
            error={errors.accidentFree?.message}
            options={[
              { value: "ja", label: "Ja" },
              { value: "nein", label: "Nein" },
            ]}
          />
        </div>
      </SectionCard>

      {/* 2. Ausstattung */}
      <SectionCard
        step="2"
        title="Ausstattung"
        subtitle="Was ist verbaut? Mehrfachauswahl, optional."
      >
        <Controller
          control={control}
          name="features"
          render={({ field }) => {
            const selected = new Set<Feature>(field.value ?? []);
            const toggle = (val: Feature) => {
              const next = new Set(selected);
              if (next.has(val)) next.delete(val);
              else next.add(val);
              field.onChange(Array.from(next));
            };
            return (
              <div className="grid gap-4 lg:grid-cols-2">
                <FeatureGroup
                  label="Standard"
                  features={standardFeatures}
                  selected={selected}
                  onToggle={toggle}
                />
                <FeatureGroup
                  label="Premium"
                  accent
                  features={premiumFeatures}
                  selected={selected}
                  onToggle={toggle}
                />
              </div>
            );
          }}
        />
      </SectionCard>

      {/* 3. Optik & Konfiguration */}
      <SectionCard
        step="3"
        title="Optik & Konfiguration"
        subtitle="Farbe, Türen und Sitzplätze."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label className="text-sm font-medium">Außenfarbe</Label>
            <Controller
              control={control}
              name="color"
              render={({ field }) => (
                <div className="mt-2 flex flex-wrap gap-2">
                  {colors.map((c) => {
                    const active = field.value === c.value;
                    return (
                      <button
                        type="button"
                        key={c.value}
                        onClick={() => field.onChange(c.value)}
                        title={c.label}
                        aria-label={c.label}
                        aria-pressed={active}
                        className={cn(
                          "h-9 w-9 rounded-full border-2 transition-smooth",
                          active
                            ? "border-accent ring-2 ring-accent/50 scale-110 shadow-accent"
                            : "border-border hover:border-accent/40 hover:scale-105",
                        )}
                        style={{ background: c.swatch }}
                      />
                    );
                  })}
                </div>
              )}
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Türen</Label>
            <Controller
              control={control}
              name="doors"
              render={({ field }) => (
                <div className="mt-2 grid grid-cols-4 gap-1.5">
                  {doorOptions.map((d) => {
                    const active = field.value === d;
                    return (
                      <button
                        type="button"
                        key={d}
                        onClick={() => field.onChange(d)}
                        className={cn(
                          "h-9 rounded-md border text-xs font-medium transition-smooth",
                          active
                            ? "border-accent bg-accent text-accent-foreground shadow-accent"
                            : "border-border hover:border-accent/40 hover:bg-secondary/40",
                        )}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Sitze</Label>
            <Controller
              control={control}
              name="seats"
              render={({ field }) => (
                <div className="mt-2 grid grid-cols-4 gap-1.5">
                  {seatOptions.map((s) => {
                    const active = field.value === s;
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => field.onChange(s)}
                        className={cn(
                          "h-9 rounded-md border text-xs font-medium transition-smooth",
                          active
                            ? "border-accent bg-accent text-accent-foreground shadow-accent"
                            : "border-border hover:border-accent/40 hover:bg-secondary/40",
                        )}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="notes" className="text-sm font-medium">
            Anmerkungen <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <AiFieldHighlight fields="notes">
            <Textarea
              id="notes"
              rows={3}
              maxLength={500}
              placeholder="Besonderheiten, Schäden, Sonderausstattung …"
              {...register("notes")}
            />
          </AiFieldHighlight>
          {errors.notes && <p className="text-xs text-destructive">{errors.notes.message}</p>}
        </div>
      </SectionCard>

      <div className="flex items-center justify-between gap-3 pt-2">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Zurück
        </Button>
        <Button type="submit" variant="cta" size="lg">
          Weiter zu Kontakt <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

interface RadioGroupFieldProps {
  label: string;
  name: "hasTuev" | "accidentFree";
  control: ReturnType<typeof useForm<ConditionStep>>["control"];
  options: { value: string; label: string }[];
  error?: string;
}

const RadioGroupField = ({ label, name, control, options, error }: RadioGroupFieldProps) => (
  <div>
    <Label className="text-sm font-medium">{label}</Label>
    <AiFieldHighlight fields={name}>
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="mt-2 grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
          {options.map((o) => (
            <button
              type="button"
              key={o.value}
              onClick={() => field.onChange(o.value)}
              className={cn(
                "h-11 rounded-md border text-sm font-medium transition-smooth",
                field.value === o.value
                  ? "border-accent bg-accent text-accent-foreground shadow-accent"
                  : "border-border hover:border-accent/40 hover:bg-secondary/40",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    />
    </AiFieldHighlight>
    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
  </div>
);

interface FeatureGroupProps {
  label: string;
  accent?: boolean;
  features: { value: Feature; label: string; icon: typeof Snowflake }[];
  selected: Set<Feature>;
  onToggle: (val: Feature) => void;
}

const FeatureGroup = ({ label, accent, features, selected, onToggle }: FeatureGroupProps) => (
  <div className="rounded-lg border border-border/60 bg-background/40 p-3">
    <p
      className={cn(
        "mb-2 text-[11px] font-semibold uppercase tracking-wider",
        accent ? "text-accent" : "text-muted-foreground",
      )}
    >
      {label}
    </p>
    <div className="flex flex-wrap gap-1.5">
      {features.map((f) => {
        const Icon = f.icon;
        const active = selected.has(f.value);
        return (
          <button
            type="button"
            key={f.value}
            onClick={() => onToggle(f.value)}
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
  </div>
);
