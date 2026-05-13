import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { CalendarIcon, CheckCircle2, Loader2, Sparkles, Gauge, Zap, BarChart3, Activity, ArrowRight } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Reveal } from '@/components/Reveal';

type Service = {
  id: 'leistungsmessung' | 'tuning_session' | 'vorher_nachher' | 'datenlogging';
  label: string;
  duration: string;
  price: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const SERVICES: Service[] = [
  {
    id: 'leistungsmessung',
    label: 'Leistungsmessung',
    duration: '45 min',
    price: 'ab 149 €',
    description: '3 Hochläufe + Diagramm, Drehmoment & Leistung an der Welle.',
    icon: Gauge,
  },
  {
    id: 'tuning_session',
    label: 'Tuning-Session',
    duration: '2–3 h',
    price: 'ab 590 €',
    description: 'Live-Abstimmung auf der Rolle inkl. Logging & Optimierung.',
    icon: Zap,
  },
  {
    id: 'vorher_nachher',
    label: 'Vorher / Nachher',
    duration: '1,5 h',
    price: 'ab 249 €',
    description: 'Messung vor und nach Tuning inkl. Vergleichsdiagramm.',
    icon: BarChart3,
  },
  {
    id: 'datenlogging',
    label: 'Datenlogging',
    duration: '60 min',
    price: 'ab 199 €',
    description: 'OBD/CAN-Logging unter Last, ideal für Diagnose & Setup.',
    icon: Activity,
  },
];

const TIME_SLOTS = [
  '09:00', '10:30', '13:00', '14:30', '16:00',
] as const;

const FUELS = ['Benzin', 'Diesel', 'Hybrid', 'Elektro'] as const;

const schema = z.object({
  vehicle_brand: z.string().trim().min(2, 'Marke fehlt').max(60),
  vehicle_model: z.string().trim().min(1, 'Modell fehlt').max(80),
  vehicle_hp: z.number().int().positive().max(2000).optional(),
  fuel: z.string().optional(),
  name: z.string().trim().min(2, 'Name zu kurz').max(120),
  email: z.string().trim().email('Ungültige E-Mail').max(255),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
});

const STEPS = ['Service', 'Termin', 'Fahrzeug', 'Kontakt'] as const;

export default function DynoBookingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [slot, setSlot] = useState<string | null>(null);
  const [fuel, setFuel] = useState<string>('Benzin');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ id: string } | null>(null);
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('full_name, phone')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setProfileName(data?.full_name ?? '');
        setProfilePhone(data?.phone ?? '');
      });
  }, [user]);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const canNext =
    (step === 0 && !!service) ||
    (step === 1 && !!date && !!slot) ||
    (step === 2) ||
    step === 3;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!service || !date || !slot) {
      toast.error('Bitte vorherige Schritte vervollständigen.');
      return;
    }
    const data = new FormData(e.currentTarget);
    const hpRaw = data.get('vehicle_hp');
    const parsed = schema.safeParse({
      vehicle_brand: data.get('vehicle_brand'),
      vehicle_model: data.get('vehicle_model'),
      vehicle_hp: hpRaw ? Number(hpRaw) : undefined,
      fuel,
      name: data.get('name'),
      email: data.get('email'),
      phone: data.get('phone') ?? '',
      message: data.get('message') ?? '',
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);
    const { data: row, error } = await supabase
      .from('dyno_bookings')
      .insert({
        user_id: user?.id ?? null,
        service: service.id,
        preferred_date: format(date, 'yyyy-MM-dd'),
        time_slot: slot,
        vehicle_brand: parsed.data.vehicle_brand,
        vehicle_model: parsed.data.vehicle_model,
        vehicle_hp: parsed.data.vehicle_hp ?? null,
        fuel: parsed.data.fuel ?? null,
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        message: parsed.data.message || null,
      })
      .select('id')
      .single();
    setLoading(false);

    if (error || !row) {
      console.error(error);
      toast.error('Buchung konnte nicht gespeichert werden.');
      return;
    }

    setSuccess({ id: row.id });
    toast.success('Buchungsanfrage gesendet.');
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader variant="solid" />
        <section className="flex-1 flex items-center justify-center py-20 px-6">
          <div className="max-w-xl text-center">
            <CheckCircle2 className="h-16 w-16 text-[hsl(var(--brand-gold))] mx-auto mb-5" />
            <h1 className="font-display text-3xl md:text-4xl mb-3">
              Termin <span className="italic text-[hsl(var(--brand-gold))]">angefragt.</span>
            </h1>
            <p className="text-muted-foreground mb-6">
              Wir prüfen deinen Wunschtermin und bestätigen ihn innerhalb von 24 Stunden per E-Mail.
            </p>
            <div className="bg-card border border-border p-5 mb-6 text-left space-y-2 text-sm">
              <Row label="Service" value={service?.label ?? ''} />
              <Row label="Termin" value={`${date ? format(date, 'EEEE, d. MMMM yyyy', { locale: de }) : ''} · ${slot} Uhr`} />
              <Row label="Referenz" value={success.id.slice(0, 8).toUpperCase()} mono />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {user ? (
                <button
                  type="button"
                  onClick={() => navigate('/portal')}
                  className="inline-flex items-center justify-center gap-2 bg-[hsl(var(--brand-dark))] text-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-dark))]/90"
                >
                  <Sparkles className="h-4 w-4" /> Zum Portal
                </button>
              ) : (
                <Link
                  to="/auth?redirect=/portal"
                  className="inline-flex items-center justify-center gap-2 bg-[hsl(var(--brand-dark))] text-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-dark))]/90"
                >
                  Konto erstellen
                </Link>
              )}
              <Link
                to="/"
                className="inline-flex items-center justify-center border-2 border-[hsl(var(--brand-dark))] text-[hsl(var(--brand-dark))] px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-dark))] hover:text-white"
              >
                Zur Startseite
              </Link>
            </div>
          </div>
        </section>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader variant="solid" />

      {/* Hero */}
      <section className="bg-brand-dark text-white py-16 md:py-20 border-b border-[hsl(var(--brand-gold))]/20">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal direction="left">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-brand-gold mb-3">
              <span className="h-px w-10 bg-[hsl(var(--brand-gold))]" />
              Prüfstand-Buchung
            </span>
          </Reveal>
          <Reveal direction="up" delay={0.05}>
            <h1 className="font-display text-4xl md:text-5xl leading-tight max-w-3xl">
              Sichere dir deinen{' '}
              <span className="italic text-brand-gold">Slot auf der Rolle.</span>
            </h1>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <p className="text-white/70 mt-3 max-w-2xl text-sm md:text-base">
              4WD-Allrad-Prüfstand bis 1.500 PS. Wähle Service, Termin und Fahrzeug — wir bestätigen innerhalb von 24 Stunden.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stepper */}
      <div className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 py-4 overflow-x-auto">
          <ol className="flex items-center gap-4 min-w-max">
            {STEPS.map((label, idx) => {
              const reached = idx <= step;
              const active = idx === step;
              return (
                <li key={label} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => idx < step && setStep(idx)}
                    disabled={idx > step}
                    className={`flex items-center gap-2 text-xs uppercase tracking-[0.15em] transition-colors ${
                      active ? 'text-[hsl(var(--brand-dark))] font-semibold' : reached ? 'text-muted-foreground hover:text-[hsl(var(--brand-gold))]' : 'text-muted-foreground/50 cursor-not-allowed'
                    }`}
                  >
                    <span className={`h-7 w-7 inline-flex items-center justify-center border text-[11px] font-mono ${
                      active ? 'border-[hsl(var(--brand-gold))] bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-dark))]' : reached ? 'border-[hsl(var(--brand-gold))] text-[hsl(var(--brand-dark))]' : 'border-border'
                    }`}>{idx + 1}</span>
                    {label}
                  </button>
                  {idx < STEPS.length - 1 && <span className="h-px w-6 bg-border" />}
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <section className="flex-1 py-10 md:py-16">
        <form onSubmit={onSubmit} className="max-w-3xl mx-auto px-6">
          {step === 0 && (
            <StepShell title="Service auswählen" subtitle="Was möchtest du auf der Rolle machen?">
              <div className="grid sm:grid-cols-2 gap-3">
                {SERVICES.map((s) => {
                  const Icon = s.icon;
                  const active = service?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setService(s)}
                      className={`text-left border p-5 transition-all ${
                        active ? 'border-[hsl(var(--brand-gold))] bg-[hsl(var(--brand-gold))]/10' : 'border-border hover:border-[hsl(var(--brand-gold))]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Icon className="h-6 w-6 text-[hsl(var(--brand-gold))]" />
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{s.duration}</span>
                      </div>
                      <div className="font-display text-lg">{s.label}</div>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">{s.description}</p>
                      <div className="text-xs uppercase tracking-[0.2em] font-semibold text-[hsl(var(--brand-dark))]">{s.price}</div>
                    </button>
                  );
                })}
              </div>
            </StepShell>
          )}

          {step === 1 && (
            <StepShell title="Termin wählen" subtitle="Wir arbeiten Mo–Fr. Termine ≥ 2 Tage Vorlauf.">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Datum</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          'mt-2 w-full justify-start text-left font-normal h-12 rounded-none border-border',
                          !date && 'text-muted-foreground',
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'EEEE, d. MMMM yyyy', { locale: de }) : 'Datum auswählen'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => { setDate(d); setSlot(null); }}
                        disabled={(d) => {
                          const min = new Date();
                          min.setHours(0, 0, 0, 0);
                          min.setDate(min.getDate() + 2);
                          const day = d.getDay();
                          return d < min || day === 0 || day === 6;
                        }}
                        initialFocus
                        locale={de}
                        weekStartsOn={1}
                        className={cn('p-3 pointer-events-auto')}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Zeitfenster</label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        disabled={!date}
                        onClick={() => setSlot(t)}
                        className={`py-3 text-sm border transition-all ${
                          slot === t
                            ? 'border-[hsl(var(--brand-gold))] bg-[hsl(var(--brand-gold))]/10'
                            : 'border-border hover:border-[hsl(var(--brand-gold))]/50 disabled:opacity-40 disabled:cursor-not-allowed'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {!date && <p className="text-[11px] text-muted-foreground mt-2">Erst Datum wählen.</p>}
                </div>
              </div>
            </StepShell>
          )}

          {step === 2 && (
            <StepShell title="Fahrzeug" subtitle="Damit wir den Prüfstand passend vorbereiten.">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Marke *" name="vehicle_brand" required maxLength={60} placeholder="z. B. BMW" />
                <Field label="Modell *" name="vehicle_model" required maxLength={80} placeholder="z. B. M3 Competition" />
                <Field label="Leistung (PS)" name="vehicle_hp" type="number" maxLength={4} placeholder="z. B. 510" />
                <div>
                  <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Kraftstoff</label>
                  <select
                    value={fuel}
                    onChange={(e) => setFuel(e.target.value)}
                    className="mt-1 w-full bg-card border border-border px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-gold))]"
                  >
                    {FUELS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>
            </StepShell>
          )}

          {step === 3 && (
            <StepShell title="Kontakt" subtitle="Wir bestätigen deinen Termin per E-Mail.">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Name *" name="name" required maxLength={120} defaultValue={profileName || user?.user_metadata?.full_name || ''} />
                <Field label="E-Mail *" name="email" type="email" required maxLength={255} defaultValue={user?.email ?? ''} />
                <Field label="Telefon" name="phone" type="tel" maxLength={40} defaultValue={profilePhone} />
              </div>
              <div className="mt-4">
                <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Nachricht</label>
                <textarea
                  name="message"
                  rows={4}
                  maxLength={2000}
                  placeholder="Setup, Software-Stand, besondere Wünsche …"
                  className="mt-1 w-full bg-card border border-border px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-gold))]"
                />
              </div>

              {/* Recap */}
              <div className="mt-6 bg-secondary border border-border p-4 text-sm space-y-2">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Zusammenfassung</div>
                <Row label="Service" value={service?.label ?? '—'} />
                <Row label="Termin" value={date ? `${format(date, 'EEEE, d. MMMM yyyy', { locale: de })} · ${slot} Uhr` : '—'} />
              </div>
            </StepShell>
          )}

          <div className="flex items-center justify-between mt-10">
            <button
              type="button"
              onClick={prev}
              disabled={step === 0}
              className="text-sm uppercase tracking-[0.15em] text-muted-foreground hover:text-[hsl(var(--brand-dark))] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Zurück
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                disabled={!canNext}
                className="inline-flex items-center gap-2 bg-[hsl(var(--brand-dark))] text-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-dark))]/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Weiter <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-dark))] px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-gold))]/90 disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Termin anfragen
              </button>
            )}
          </div>
        </form>
      </section>

      <SiteFooter />
    </div>
  );
}

function StepShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[hsl(var(--brand-gold))] mb-3">
        <span className="h-px w-10 bg-[hsl(var(--brand-gold))]" />
        {title}
      </span>
      {subtitle && <p className="text-muted-foreground text-sm mb-6 max-w-xl">{subtitle}</p>}
      {children}
    </div>
  );
}

function Field({
  label, name, type = 'text', required, defaultValue, maxLength, placeholder,
}: { label: string; name: string; type?: string; required?: boolean; defaultValue?: string; maxLength?: number; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={name} className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        maxLength={maxLength}
        placeholder={placeholder}
        className="mt-1 w-full bg-card border border-border px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-gold))]"
      />
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{label}</span>
      <span className={cn('text-sm', mono && 'font-mono')}>{value}</span>
    </div>
  );
}