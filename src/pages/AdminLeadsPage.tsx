import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

type Status = 'neu' | 'in_bearbeitung' | 'angebot_versendet' | 'abgeschlossen' | 'abgelehnt';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  vehicle_label: string;
  vehicle_slug: string;
  financing: boolean;
  trade_in: boolean;
  preferred_contact: string;
  status: Status;
  admin_note: string | null;
  created_at: string;
}

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: 'neu', label: 'Neu' },
  { value: 'in_bearbeitung', label: 'In Bearbeitung' },
  { value: 'angebot_versendet', label: 'Angebot versendet' },
  { value: 'abgeschlossen', label: 'Abgeschlossen' },
  { value: 'abgelehnt', label: 'Abgelehnt' },
];

const STATUS_VARIANT: Record<Status, string> = {
  neu: 'bg-amber-100 text-amber-900 border-amber-300',
  in_bearbeitung: 'bg-sky-100 text-sky-900 border-sky-300',
  angebot_versendet: 'bg-violet-100 text-violet-900 border-violet-300',
  abgeschlossen: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  abgelehnt: 'bg-rose-100 text-rose-900 border-rose-300',
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Record<string, { status: Status; admin_note: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Status | 'all'>('all');

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        toast.error('Anfragen konnten nicht geladen werden');
      } else {
        setLeads((data ?? []) as Lead[]);
        const d: Record<string, { status: Status; admin_note: string }> = {};
        for (const l of data ?? []) d[l.id] = { status: l.status as Status, admin_note: l.admin_note ?? '' };
        setDrafts(d);
      }
      setLoading(false);
    })();
  }, []);

  const save = async (id: string) => {
    const draft = drafts[id];
    if (!draft) return;
    setSavingId(id);
    const { error } = await supabase
      .from('leads')
      .update({ status: draft.status, admin_note: draft.admin_note || null })
      .eq('id', id);
    setSavingId(null);
    if (error) {
      toast.error('Speichern fehlgeschlagen');
      return;
    }
    toast.success('Anfrage aktualisiert');
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: draft.status, admin_note: draft.admin_note || null } : l)));
  };

  const visible = filter === 'all' ? leads : leads.filter((l) => l.status === filter);

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <span className="text-xs uppercase tracking-[0.3em] text-brand-gold">Anfragen</span>
        <h1 className="font-display text-4xl md:text-5xl mt-2">Kunden-<em className="text-brand-gold not-italic md:italic">anfragen</em></h1>
        <p className="text-muted-foreground mt-2">{leads.length} {leads.length === 1 ? 'Anfrage' : 'Anfragen'} insgesamt.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <FilterPill active={filter === 'all'} onClick={() => setFilter('all')}>Alle ({leads.length})</FilterPill>
        {STATUS_OPTIONS.map((o) => {
          const c = leads.filter((l) => l.status === o.value).length;
          return (
            <FilterPill key={o.value} active={filter === o.value} onClick={() => setFilter(o.value)}>
              {o.label} ({c})
            </FilterPill>
          );
        })}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-brand-gold" /></div>
      ) : visible.length === 0 ? (
        <p className="text-muted-foreground">Keine Anfragen in dieser Ansicht.</p>
      ) : (
        <div className="space-y-4">
          {visible.map((l) => {
            const draft = drafts[l.id] ?? { status: l.status, admin_note: l.admin_note ?? '' };
            const dirty = draft.status !== l.status || (draft.admin_note ?? '') !== (l.admin_note ?? '');
            return (
              <article key={l.id} className="border border-border rounded-lg bg-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="font-display text-lg">{l.vehicle_label}</h2>
                      <Badge className={`${STATUS_VARIANT[l.status]} border`}>{STATUS_OPTIONS.find((s) => s.value === l.status)?.label}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(l.created_at).toLocaleString('de-DE')}
                      {l.financing ? ' · Finanzierung' : ''}
                      {l.trade_in ? ' · Inzahlungnahme' : ''}
                      {' · Bevorzugt: '}{l.preferred_contact}
                    </p>
                  </div>
                  <div className="text-sm text-right">
                    <div className="font-medium">{l.name}</div>
                    <a href={`mailto:${l.email}`} className="text-brand-gold hover:underline">{l.email}</a>
                    {l.phone && <div className="text-muted-foreground">{l.phone}</div>}
                  </div>
                </div>

                {l.message && (
                  <div className="mb-4 text-sm bg-muted/50 rounded p-3">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Nachricht</div>
                    {l.message}
                  </div>
                )}

                <div className="grid md:grid-cols-[200px_1fr_auto] gap-4 items-start">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Status</label>
                    <Select
                      value={draft.status}
                      onValueChange={(v) => setDrafts((p) => ({ ...p, [l.id]: { ...draft, status: v as Status } }))}
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
                      onChange={(e) => setDrafts((p) => ({ ...p, [l.id]: { ...draft, admin_note: e.target.value } }))}
                      rows={2}
                      placeholder="Interne Notiz…"
                    />
                  </div>
                  <div className="md:pt-6">
                    <Button onClick={() => save(l.id)} disabled={!dirty || savingId === l.id} className="bg-brand-gold text-brand-dark hover:bg-brand-gold/90">
                      {savingId === l.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Speichern'}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs uppercase tracking-[0.15em] px-3 py-1.5 border transition-colors ${
        active
          ? 'bg-[hsl(var(--brand-dark))] text-white border-[hsl(var(--brand-dark))]'
          : 'border-border text-muted-foreground hover:border-[hsl(var(--brand-gold))]'
      }`}
    >
      {children}
    </button>
  );
}