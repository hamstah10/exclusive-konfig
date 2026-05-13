import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { appointmentStepSchema, type AppointmentStep } from "@/lib/valuation-schema";
import { ArrowLeft, Send, Loader2, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AiFieldHighlight } from "@/components/funnel/AiFieldHighlight";
import { trackFirstInteraction, trackValidationErrors } from "@/lib/analytics";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parse, isValid } from "date-fns";
import { de } from "date-fns/locale";
import Holidays from "date-holidays";

interface Props {
  defaults?: Partial<AppointmentStep>;
  onSubmit: (data: AppointmentStep) => void;
  onBack: () => void;
  submitting?: boolean;
}

const times = [
  { value: "vormittag", label: "Vormittag", desc: "08–12 Uhr" },
  { value: "nachmittag", label: "Nachmittag", desc: "12–17 Uhr" },
  { value: "abend", label: "Abend", desc: "17–20 Uhr" },
  { value: "egal", label: "Egal", desc: "Jederzeit" },
] as const;

const channels = [
  { value: "telefon", label: "Telefon" },
  { value: "email", label: "E-Mail" },
  { value: "whatsapp", label: "WhatsApp" },
] as const;

const todayStart = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
})();

// Deutsche bundesweite Feiertage (ohne länderspezifische wie Fronleichnam,
// Reformationstag etc., damit wir niemanden ungewollt aussperren).
const holidays = new Holidays("DE");
const isHoliday = (date: Date): { holiday: true; name: string } | { holiday: false } => {
  const matches = holidays.isHoliday(date);
  if (!matches) return { holiday: false };
  const list = Array.isArray(matches) ? matches : [matches];
  const publicHoliday = list.find((h) => h.type === "public");
  if (!publicHoliday) return { holiday: false };
  return { holiday: true, name: publicHoliday.name };
};

const isSunday = (date: Date): boolean => date.getDay() === 0;

const isDateDisabled = (date: Date): boolean => {
  if (date < todayStart) return true;
  if (isSunday(date)) return true;
  return isHoliday(date).holiday;
};

const toIsoDate = (d: Date): string => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const fromIsoDate = (s: string | undefined): Date | undefined => {
  if (!s) return undefined;
  const d = parse(s, "yyyy-MM-dd", new Date());
  return isValid(d) ? d : undefined;
};

export const AppointmentStepForm = ({ defaults, onSubmit, onBack, submitting }: Props) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AppointmentStep>({
    resolver: zodResolver(appointmentStepSchema),
    defaultValues: defaults,
    mode: "onTouched",
  });

  useEffect(() => {
    if (defaults) reset(defaults, { keepDirtyValues: true, keepTouched: true });
  }, [defaults, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errs) =>
        trackValidationErrors({ funnelStep: 4, stepLabel: "Termin", errors: errs as never }),
      )}
      onFocusCapture={(e) => {
        const t = e.target as HTMLElement;
        const field = t.getAttribute?.("name") ?? t.tagName?.toLowerCase() ?? "unknown";
        trackFirstInteraction({ funnelStep: 4, stepLabel: "Termin", field });
      }}
      onPointerDownCapture={(e) => {
        const t = e.target as HTMLElement;
        const field = t.getAttribute?.("name") ?? t.tagName?.toLowerCase() ?? "unknown";
        trackFirstInteraction({ funnelStep: 4, stepLabel: "Termin", field });
      }}
      className="space-y-6"
    >
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Wunschtermin</Label>
        <AiFieldHighlight fields="preferredDate">
          <Controller
            control={control}
            name="preferredDate"
            render={({ field }) => {
              const selected = fromIsoDate(field.value);
              return (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selected && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selected
                        ? format(selected, "EEEE, d. MMMM yyyy", { locale: de })
                        : "Datum wählen"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      locale={de}
                      weekStartsOn={1}
                      selected={selected}
                      onSelect={(d) => field.onChange(d ? toIsoDate(d) : "")}
                      disabled={isDateDisabled}
                      modifiers={{
                        sunday: (d) => d >= todayStart && isSunday(d),
                        holiday: (d) => d >= todayStart && isHoliday(d).holiday,
                      }}
                      modifiersClassNames={{
                        sunday: "text-destructive/60 line-through",
                        holiday: "text-destructive/60 line-through",
                      }}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              );
            }}
          />
        </AiFieldHighlight>
        <p className="text-[11px] text-muted-foreground">
          Sonntage und gesetzliche Feiertage sind nicht buchbar.
        </p>
        {errors.preferredDate && (
          <p className="text-xs text-destructive">{errors.preferredDate.message}</p>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium">Zeitfenster</Label>
        <AiFieldHighlight fields="preferredTime">
        <Controller
          control={control}
          name="preferredTime"
          render={({ field }) => (
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {times.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => field.onChange(t.value)}
                  className={cn(
                    "rounded-lg border p-3 text-left transition-base",
                    field.value === t.value
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent/40",
                  )}
                >
                  <p className="text-sm font-semibold">{t.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          )}
        />
        </AiFieldHighlight>
        {errors.preferredTime && <p className="text-xs text-destructive mt-1">{errors.preferredTime.message}</p>}
      </div>

      <div>
        <Label className="text-sm font-medium">Bevorzugter Kontaktweg</Label>
        <AiFieldHighlight fields="contactChannel">
        <Controller
          control={control}
          name="contactChannel"
          render={({ field }) => (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {channels.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => field.onChange(c.value)}
                  className={cn(
                    "h-11 rounded-md border text-sm font-medium transition-base",
                    field.value === c.value
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent/40",
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        />
        </AiFieldHighlight>
        {errors.contactChannel && <p className="text-xs text-destructive mt-1">{errors.contactChannel.message}</p>}
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Zurück
        </Button>
        <Button type="submit" variant="cta" size="lg" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Wird gesendet …
            </>
          ) : (
            <>
              Anfrage absenden <Send className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
