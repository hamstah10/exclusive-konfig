import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, X, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Vehicle } from '@/data/vehicles';

const schema = z.object({
  name: z.string().trim().min(2, 'Name zu kurz').max(120),
  email: z.string().trim().email('Ungültige E-Mail').max(255),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  preferred_contact: z.enum(['email', 'phone']),
  financing: z.boolean(),
  trade_in: z.boolean(),
});

type Props = {
  vehicle: Vehicle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LeadRequestDialog({ vehicle, open, onOpenChange }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');

  useEffect(() => {
    if (!open) {
      setSuccess(false);
      return;
    }
    if (user) {
      supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          setProfileName(data?.full_name ?? '');
          setProfilePhone(data?.phone ?? '');
        });
    }
  }, [open, user]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onOpenChange(false);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onOpenChange]);

  if (!open) return null;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: data.get('name'),
      email: data.get('email'),
      phone: data.get('phone') ?? '',
      message: data.get('message') ?? '',
      preferred_contact: data.get('preferred_contact') ?? 'email',
      financing: data.get('financing') === 'on',
      trade_in: data.get('trade_in') === 'on',
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('leads').insert({
      user_id: user?.id ?? null,
      vehicle_slug: vehicle.slug,
      vehicle_label: `${vehicle.brand} ${vehicle.model}`,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message || null,
      financing: parsed.data.financing,
      trade_in: parsed.data.trade_in,
      preferred_contact: parsed.data.preferred_contact,
    });
    setLoading(false);

    if (error) {
      console.error(error);
      toast.error('Anfrage konnte nicht gesendet werden. Bitte erneut versuchen.');
      return;
    }

    setSuccess(true);
    toast.success('Anfrage gesendet — wir melden uns in Kürze.');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-dialog-title"
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-[hsl(var(--brand-dark))]/70 backdrop-blur-sm p-0 md:p-6"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-background w-full md:max-w-2xl max-h-[95vh] overflow-y-auto border border-border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[hsl(var(--brand-gold))]">Angebot anfragen</span>
            <h2 id="lead-dialog-title" className="font-display text-2xl mt-1">
              {vehicle.brand} <span className="italic">{vehicle.model}</span>
            </h2>
            <div className="text-sm text-muted-foreground mt-1">{vehicle.priceLabel}</div>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Schließen"
            className="text-muted-foreground hover:text-foreground p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="h-14 w-14 text-[hsl(var(--brand-gold))] mx-auto mb-4" />
            <h3 className="font-display text-2xl mb-3">Anfrage erhalten.</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Vielen Dank! Unser Team meldet sich innerhalb von 24 Stunden bei dir.
              {!user && ' Erstelle ein Konto, um den Status deiner Anfrage jederzeit einzusehen.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    navigate('/portal');
                  }}
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
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex items-center justify-center border-2 border-[hsl(var(--brand-dark))] text-[hsl(var(--brand-dark))] px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-dark))] hover:text-white"
              >
                Schließen
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="p-6 space-y-5">
            {!user && (
              <div className="bg-secondary border border-border p-4 text-xs text-muted-foreground">
                Tipp: <Link to="/auth" className="font-semibold text-[hsl(var(--brand-dark))] hover:text-[hsl(var(--brand-gold))] underline">Anmelden</Link>{' '}
                um den Status deiner Anfragen im Kundenportal nachzuverfolgen.
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name" name="name" required defaultValue={profileName || user?.user_metadata?.full_name || ''} maxLength={120} />
              <Field label="E-Mail" name="email" type="email" required defaultValue={user?.email ?? ''} maxLength={255} />
              <Field label="Telefon" name="phone" type="tel" defaultValue={profilePhone} maxLength={40} />
              <div>
                <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Bevorzugter Kontakt</label>
                <select
                  name="preferred_contact"
                  defaultValue="email"
                  className="mt-1 w-full bg-card border border-border px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-gold))]"
                >
                  <option value="email">E-Mail</option>
                  <option value="phone">Telefon</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Nachricht</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                maxLength={2000}
                placeholder="Fragen, Wunschtermin, Zubehör …"
                className="mt-1 w-full bg-card border border-border px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-gold))]"
              />
            </div>

            <div className="flex flex-wrap gap-5">
              <Checkbox name="financing" label="Finanzierung gewünscht" />
              <Checkbox name="trade_in" label="Inzahlungnahme" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-dark))] px-6 py-4 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-gold))]/90 transition-colors disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Angebot anfragen
            </button>
            <p className="text-[11px] text-muted-foreground text-center">
              Mit dem Absenden stimmst du zu, dass wir deine Daten zur Bearbeitung deiner Anfrage verwenden.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label, name, type = 'text', required, defaultValue, maxLength,
}: { label: string; name: string; type?: string; required?: boolean; defaultValue?: string; maxLength?: number }) {
  return (
    <div>
      <label htmlFor={name} className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
        {label}{required && ' *'}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        maxLength={maxLength}
        className="mt-1 w-full bg-card border border-border px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-gold))]"
      />
    </div>
  );
}

function Checkbox({ name, label }: { name: string; label: string }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm cursor-pointer select-none">
      <input
        type="checkbox"
        name={name}
        className="h-4 w-4 accent-[hsl(var(--brand-gold))]"
      />
      {label}
    </label>
  );
}