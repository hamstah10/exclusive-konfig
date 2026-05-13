import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

type Status = 'angefragt' | 'bestaetigt' | 'durchgefuehrt' | 'storniert';

interface Booking {
  id: string;
  service: string;
  preferred_date: string;
  time_slot: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_hp: number | null;
  fuel: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: Status;
  admin_note: string | null;
  created_at: string;
}

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: 'angefragt', label: 'Angefragt' },
  { value: 'bestaetigt', label: 'Bestätigt' },
  { value: 'durchgefuehrt', label: 'Durchgeführt' },
  { value: 'storniert', label: 'Storniert' },
];

const STATUS_VARIANT: Record<Status, string> = {
  angefragt: 'bg-amber-100 text-amber-900 border-amber-300',
  bestaetigt: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  durchgefuehrt: 'bg-sky-100 text-sky-900 border-sky-300',
  storniert: 'bg-rose-100 text-rose-900 border-rose-300',
};

export default function AdminBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Record<string, { status: Status; admin_note: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const { data, error } = await supabase
        .from('dyno_bookings')
        .select('*')
        .order('preferred_date', { ascending: false });
      if (error) {
        toast.error('Buchungen konnten nicht geladen werden');
      } else {
        setBookings((data ?? []) as Booking[]);
        const d: Record<string, { status: Status; admin_note: string }> = {};
        for (const b of data ?? []) d[b.id] = { status: b.status as Status, admin_note: b.admin_note ?? '' };
        setDrafts(d);
      }
      setLoading(false);
    })();
  }, [isAdmin]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/auth?redirect=/admin/pruefstand" replace />;
  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader variant="solid" />
        <main className="flex-1 max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="font-display text-3xl mb-4">Kein Zugriff</h1>
          <p className="text-muted-foreground mb-6">Dieser Bereich ist nur für Administratoren verfügbar.</p>
          <Link to="/" className="text-brand-gold underline">Zurück zur Startseite</Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const save = async (id: string) => {
    const draft = drafts[id];
    if (!draft) return;
    setSavingId(id);
    const { error } = await supabase
      .from('dyno_bookings')
      .update({ status: draft.status, admin_note: draft.admin_note || null })
      .eq('id', id);
    setSavingId(null);
    if (error) {
      toast.error('Speichern fehlgeschlagen');
      return;
    }
    toast.success('Buchung aktualisiert');
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: draft.status, admin_note: draft.admin_note || null } : b)));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader variant="solid" />
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full">
        <div className="mb-10">
          <span className="text-xs uppercase tracking-[0.3em] text-brand-gold">Admin</span>
          <h1 className="font-display text-4xl md:text-5xl mt-2">Prüfstand-<em className="text-brand-gold not-italic md:italic">Buchungen</em></h1>
          <p className="text-muted-foreground mt-2">{bookings.length} {bookings.length === 1 ? 'Buchung' : 'Buchungen'} insgesamt.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-brand-gold" /></div>
        ) : bookings.length === 0 ? (
          <p className="text-muted-foreground">Noch keine Buchungen vorhanden.</p>
        ) : (
          <div className="space-y-6">
            {bookings.map((b) => {
              const draft = drafts[b.id] ?? { status: b.status, admin_note: b.admin_note ?? '' };
              const dirty = draft.status !== b.status || (draft.admin_note ?? '') !== (b.admin_note ?? '');
              return (
                <article key={b.id} className="border border-border rounded-lg bg-card p-6 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="font-display text-xl">{b.vehicle_brand} {b.vehicle_model}</h2>
                        <Badge className={`${STATUS_VARIANT[b.status]} border`}>{STATUS_OPTIONS.find((s) => s.value === b.status)?.label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(b.preferred_date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        {' · '}{b.time_slot}
                        {' · '}Service: {b.service}
                        {b.vehicle_hp ? ` · ${b.vehicle_hp} PS` : ''}
                        {b.fuel ? ` · ${b.fuel}` : ''}
                      </p>
                    </div>
                    <div className="text-sm text-right">
                      <div className="font-medium">{b.name}</div>
                      <a href={`mailto:${b.email}`} className="text-brand-gold hover:underline">{b.email}</a>
                      {b.phone && <div className="text-muted-foreground">{b.phone}</div>}
                    </div>
                  </div>

                  {b.message && (
                    <div className="mb-4 text-sm bg-muted/50 rounded p-3">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Kundennachricht</div>
                      {b.message}
                    </div>
                  )}

                  <div className="grid md:grid-cols-[200px_1fr_auto] gap-4 items-start">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Status</label>
                      <Select
                        value={draft.status}
                        onValueChange={(v) => setDrafts((p) => ({ ...p, [b.id]: { ...draft, status: v as Status } }))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Admin-Notiz</label>
                      <Textarea
                        value={draft.admin_note}
                        onChange={(e) => setDrafts((p) => ({ ...p, [b.id]: { ...draft, admin_note: e.target.value } }))}
                        rows={2}
                        placeholder="Interne Notiz…"
                      />
                    </div>
                    <div className="md:pt-6">
                      <Button onClick={() => save(b.id)} disabled={!dirty || savingId === b.id} className="bg-brand-gold text-brand-dark hover:bg-brand-gold/90">
                        {savingId === b.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Speichern'}
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}