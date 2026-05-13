import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, Check, Search, SlidersHorizontal,
  User, CheckCircle2, Loader2, Lock, ShieldCheck, Clock,
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Stepper } from '@/components/ankauf/Stepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';

// ─── Schemas ─────────────────────────────────────────────────────────────────

const step1Schema = z.object({
  brand:      z.string().min(1, 'Marke angeben'),
  model:      z.string().optional(),
  year_from:  z.coerce.number().min(1990).max(2030).optional().or(z.literal('')),
  year_to:    z.coerce.number().min(1990).max(2030).optional().or(z.literal('')),
  budget_max: z.coerce.number().min(1000, 'Budget angeben'),
  fuel:       z.string().min(1, 'Kraftstoff wählen'),
});

const step2Schema = z.object({
  body_types: z.array(z.string()).optional(),
  km_max:     z.coerce.number().optional().or(z.literal('')),
  gearbox:    z.string().optional(),
  color:      z.string().optional(),
  notes:      z.string().max(800).optional(),
});

const step3Schema = z.object({
  first_name: z.string().min(1, 'Vorname angeben'),
  last_name:  z.string().min(1, 'Nachname angeben'),
  email:      z.string().email('Gültige E-Mail angeben'),
  phone:      z.string().optional(),
  consent:    z.literal(true, { errorMap: () => ({ message: 'Zustimmung erforderlich' }) }),
});

type Step1 = z.infer<typeof step1Schema>;
type Step2 = z.infer<typeof step2Schema>;
type Step3 = z.infer<typeof step3Schema>;

// ─── Constants ────────────────────────────────────────────────────────────────

const FUEL_OPTIONS = ['Benzin', 'Diesel', 'Hybrid', 'Elektro', 'Egal'];
const GEARBOX_OPTIONS = ['Schaltgetriebe', 'Automatik', 'Egal'];
const BODY_OPTIONS = ['Limousine', 'Kombi', 'SUV', 'Coupé', 'Cabrio', 'Van', 'Pickup'];

const STEPS = [
  { label: 'Fahrzeug', icon: Search },
  { label: 'Details', icon: SlidersHorizontal },
  { label: 'Kontakt', icon: User },
];

const TRUST = [
  { icon: Lock, label: 'SSL-verschlüsselt' },
  { icon: ShieldCheck, label: 'DSGVO-konform' },
  { icon: Clock, label: 'Antwort in 24 h' },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VermittlungPage() {
  const [step, setStep] = useState(0);
  const [s1, setS1] = useState<Partial<Step1>>({});
  const [s2, setS2] = useState<Partial<Step2>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goBack = () => {
    setStep((p) => Math.max(0, p - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep1 = (data: Step1) => {
    setS1(data);
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep2 = (data: Step2) => {
    setS2(data);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep3 = async (data: Step3) => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        brand:      s1.brand ?? null,
        model:      s1.model || null,
        year_from:  s1.year_from ? Number(s1.year_from) : null,
        year_to:    s1.year_to ? Number(s1.year_to) : null,
        budget_max: s1.budget_max ? Number(s1.budget_max) : null,
        fuel:       s1.fuel ?? null,
        body_types: s2.body_types && s2.body_types.length > 0 ? s2.body_types : null,
        km_max:     s2.km_max ? Number(s2.km_max) : null,
        gearbox:    s2.gearbox || null,
        color:      s2.color || null,
        notes:      s2.notes || null,
        first_name: data.first_name,
        last_name:  data.last_name,
        email:      data.email,
        phone:      data.phone || null,
      };
      const { error: err } = await supabase.from('vermittlung_anfragen').insert(payload);
      if (err) throw new Error(err.message);
      setDone(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <SiteHeader variant="solid" />

      <main className="flex-1 py-10 md:py-16">
        <div className="max-w-2xl mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="h-px w-10 bg-[hsl(var(--brand-gold))]" />
              <span className="text-[11px] uppercase tracking-[0.3em] text-[hsl(var(--brand-gold))] font-semibold">Vermittlung</span>
              <span className="h-px w-10 bg-[hsl(var(--brand-gold))]" />
            </div>
            <h1 className="font-display text-3xl md:text-5xl tracking-tight text-[hsl(var(--brand-dark))]">
              Wir finden Ihr <span className="italic text-[hsl(var(--brand-gold))]">Wunschfahrzeug</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Suchauftrag erteilen – wir kümmern uns um den Rest. Persönlich, diskret, ohne Aufwand.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl shadow-sm border border-border p-10 text-center"
              >
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[hsl(var(--success))]/10 mb-5">
                  <CheckCircle2 className="h-8 w-8 text-[hsl(var(--success))]" />
                </div>
                <h2 className="font-display text-2xl text-foreground mb-2">Suchauftrag erhalten</h2>
                <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  Wir melden uns innerhalb von 24 Stunden mit passenden Fahrzeugen oder Rückfragen.
                  Vielen Dank für Ihr Vertrauen.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-10"
              >
                <Stepper steps={STEPS} current={step} />

                <div className="mt-9">
                  <div className="mb-7">
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                      {step === 0 && 'Wunschfahrzeug'}
                      {step === 1 && 'Weitere Details'}
                      {step === 2 && 'Kontaktdaten'}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {step === 0 && 'Was suchen Sie? Je mehr Sie angeben, desto gezielter suchen wir.'}
                      {step === 1 && 'Optional, aber hilfreich für eine präzise Suche.'}
                      {step === 2 && 'Wie können wir Sie mit den Ergebnissen erreichen?'}
                    </p>
                  </div>

                  {step === 0 && <Step1Form defaults={s1} onNext={handleStep1} />}
                  {step === 1 && <Step2Form defaults={s2} onNext={handleStep2} onBack={goBack} />}
                  {step === 2 && (
                    <Step3Form submitting={submitting} error={error} onNext={handleStep3} onBack={goBack} />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trust row */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {TRUST.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 text-xs text-muted-foreground">
                <Icon className="h-4 w-4 text-[hsl(var(--brand-gold))]" />
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────

function Step1Form({ defaults, onNext }: { defaults: Partial<Step1>; onNext: (d: Step1) => void }) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<Step1>({
    resolver: zodResolver(step1Schema),
    defaultValues: defaults,
    mode: 'onTouched',
  });
  const fuel = watch('fuel');

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Marke <span className="text-destructive">*</span></Label>
          <Input {...register('brand')} placeholder="z. B. BMW, Mercedes, Porsche" />
          {errors.brand && <p className="text-xs text-destructive">{errors.brand.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Modell</Label>
          <Input {...register('model')} placeholder="z. B. 3er, C-Klasse, 911" />
        </div>
        <div className="space-y-1.5">
          <Label>Baujahr von</Label>
          <Input type="number" {...register('year_from')} placeholder="z. B. 2018" min={1990} max={2030} />
        </div>
        <div className="space-y-1.5">
          <Label>Baujahr bis</Label>
          <Input type="number" {...register('year_to')} placeholder="z. B. 2023" min={1990} max={2030} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Budget (max.) <span className="text-destructive">*</span></Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
            <Input type="number" {...register('budget_max')} placeholder="z. B. 45000" className="pl-7" min={1000} />
          </div>
          {errors.budget_max && <p className="text-xs text-destructive">{errors.budget_max.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Kraftstoff <span className="text-destructive">*</span></Label>
        <div className="flex flex-wrap gap-2">
          {FUEL_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setValue('fuel', opt, { shouldValidate: true })}
              className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${
                fuel === opt
                  ? 'border-[hsl(var(--brand-gold))] bg-[hsl(var(--brand-gold))]/10 text-[hsl(var(--brand-gold))]'
                  : 'border-border bg-background text-muted-foreground hover:border-muted-foreground'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {errors.fuel && <p className="text-xs text-destructive">{errors.fuel.message}</p>}
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" size="lg" className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2">
          Weiter <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────

function Step2Form({
  defaults, onNext, onBack,
}: { defaults: Partial<Step2>; onNext: (d: Step2) => void; onBack: () => void }) {
  const { register, handleSubmit, setValue, watch } = useForm<Step2>({
    resolver: zodResolver(step2Schema),
    defaultValues: defaults,
    mode: 'onTouched',
  });
  const bodyTypes = watch('body_types') ?? [];
  const gearbox = watch('gearbox');

  const toggleBody = (val: string) => {
    const next = bodyTypes.includes(val)
      ? bodyTypes.filter((b) => b !== val)
      : [...bodyTypes, val];
    setValue('body_types', next);
  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <div className="space-y-2">
        <Label>Karosserie</Label>
        <div className="flex flex-wrap gap-2">
          {BODY_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => toggleBody(opt)}
              className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${
                bodyTypes.includes(opt)
                  ? 'border-[hsl(var(--brand-gold))] bg-[hsl(var(--brand-gold))]/10 text-[hsl(var(--brand-gold))]'
                  : 'border-border bg-background text-muted-foreground hover:border-muted-foreground'
              }`}
            >
              {bodyTypes.includes(opt) && <Check className="h-3 w-3 inline mr-1" />}
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Kilometerstand (max.)</Label>
          <div className="relative">
            <Input type="number" {...register('km_max')} placeholder="z. B. 80000" min={0} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">km</span>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Farbe</Label>
          <Input {...register('color')} placeholder="z. B. Weiß, Schwarz, egal" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Getriebe</Label>
        <div className="flex flex-wrap gap-2">
          {GEARBOX_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setValue('gearbox', opt)}
              className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${
                gearbox === opt
                  ? 'border-[hsl(var(--brand-gold))] bg-[hsl(var(--brand-gold))]/10 text-[hsl(var(--brand-gold))]'
                  : 'border-border bg-background text-muted-foreground hover:border-muted-foreground'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Sonderwünsche & Ausstattung</Label>
        <Textarea
          {...register('notes')}
          placeholder="z. B. Panoramadach, Sitzheizung, unfallfrei, Scheckheft gepflegt, …"
          rows={3}
          className="resize-none"
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button type="button" variant="outline" size="lg" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Zurück
        </Button>
        <Button type="submit" size="lg" className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2">
          Weiter <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────

function Step3Form({
  submitting, error, onNext, onBack,
}: { submitting: boolean; error: string | null; onNext: (d: Step3) => void; onBack: () => void }) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<Step3>({
    resolver: zodResolver(step3Schema),
    mode: 'onTouched',
  });
  const consent = watch('consent');

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Vorname <span className="text-destructive">*</span></Label>
          <Input {...register('first_name')} placeholder="Max" maxLength={60} />
          {errors.first_name && <p className="text-xs text-destructive">{errors.first_name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Nachname <span className="text-destructive">*</span></Label>
          <Input {...register('last_name')} placeholder="Mustermann" maxLength={60} />
          {errors.last_name && <p className="text-xs text-destructive">{errors.last_name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>E-Mail <span className="text-destructive">*</span></Label>
          <Input type="email" {...register('email')} placeholder="max@beispiel.de" maxLength={255} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Telefon</Label>
          <Input type="tel" {...register('phone')} placeholder="0151 234 567 89" maxLength={30} />
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/40 p-4">
        <Checkbox
          id="consent"
          checked={!!consent}
          onCheckedChange={(v) => setValue('consent', (v === true) as true, { shouldValidate: true })}
          className="mt-0.5"
        />
        <div className="space-y-1">
          <Label htmlFor="consent" className="text-sm font-normal leading-relaxed cursor-pointer">
            Ich habe die{' '}
            <a href="#" className="underline underline-offset-2 text-[hsl(var(--brand-gold))]">
              Datenschutzerklärung
            </a>{' '}
            gelesen und bin damit einverstanden, dass meine Angaben zur Bearbeitung meines Suchauftrags
            verwendet werden.
          </Label>
          {errors.consent && <p className="text-xs text-destructive">{errors.consent.message}</p>}
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-4 py-3">
          Fehler beim Senden: {error}. Bitte versuchen Sie es erneut.
        </p>
      )}

      <div className="flex items-center justify-between pt-2">
        <Button type="button" variant="outline" size="lg" onClick={onBack} className="gap-2" disabled={submitting}>
          <ArrowLeft className="h-4 w-4" /> Zurück
        </Button>
        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
        >
          {submitting ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Wird gesendet…</>
          ) : (
            <>Suchauftrag senden <ArrowRight className="h-4 w-4" /></>
          )}
        </Button>
      </div>
    </form>
  );
}
