import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { contactStepSchema, type ContactStep } from "@/lib/valuation-schema";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { AiFieldHighlight } from "@/components/ankauf/AiFieldHighlight";
import { trackFirstInteraction, trackValidationErrors } from "@/lib/ankauf-analytics";

interface Props {
  defaults?: Partial<ContactStep>;
  onNext: (data: ContactStep) => void;
  onBack: () => void;
}

export const ContactStepForm = ({ defaults, onNext, onBack }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactStep>({
    resolver: zodResolver(contactStepSchema),
    defaultValues: defaults,
    mode: "onTouched",
  });

  useEffect(() => {
    if (defaults) reset(defaults, { keepDirtyValues: true, keepTouched: true });
  }, [defaults, reset]);

  const consent = watch("consent");

  return (
    <form
      onSubmit={handleSubmit(onNext, (errs) =>
        trackValidationErrors({ funnelStep: 3, stepLabel: "Kontakt", errors: errs as never }),
      )}
      onFocusCapture={(e) => {
        const t = e.target as HTMLElement;
        const field = t.getAttribute?.("name") ?? t.tagName?.toLowerCase() ?? "unknown";
        trackFirstInteraction({ funnelStep: 3, stepLabel: "Kontakt", field });
      }}
      onPointerDownCapture={(e) => {
        const t = e.target as HTMLElement;
        const field = t.getAttribute?.("name") ?? t.tagName?.toLowerCase() ?? "unknown";
        trackFirstInteraction({ funnelStep: 3, stepLabel: "Kontakt", field });
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Vorname</Label>
          <AiFieldHighlight fields="firstName">
            <Input {...register("firstName")} maxLength={60} placeholder="Max" />
          </AiFieldHighlight>
          {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Nachname</Label>
          <AiFieldHighlight fields="lastName">
            <Input {...register("lastName")} maxLength={60} placeholder="Mustermann" />
          </AiFieldHighlight>
          {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">E-Mail</Label>
          <AiFieldHighlight fields="email">
            <Input type="email" {...register("email")} maxLength={255} placeholder="max@beispiel.de" />
          </AiFieldHighlight>
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Telefon</Label>
          <AiFieldHighlight fields="phone">
            <Input type="tel" {...register("phone")} maxLength={30} placeholder="0151 234 567 89" />
          </AiFieldHighlight>
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/40 p-4">
        <Checkbox
          id="consent"
          checked={!!consent}
          onCheckedChange={(v) => setValue("consent", (v === true) as true, { shouldValidate: true })}
          className="mt-0.5"
        />
        <div className="space-y-1">
          <Label htmlFor="consent" className="text-sm font-normal leading-relaxed cursor-pointer">
            Ich habe die <a href="#" className="text-accent underline underline-offset-2">Datenschutzerklärung</a> gelesen
            und bin damit einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage verwendet werden.
          </Label>
          {errors.consent && <p className="text-xs text-destructive">{errors.consent.message}</p>}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Zurück
        </Button>
        <Button type="submit" variant="cta" size="lg">
          Weiter zum Termin <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
