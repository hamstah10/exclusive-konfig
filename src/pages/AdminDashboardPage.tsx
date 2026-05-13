import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Inbox, Wrench, CalendarClock, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

interface Stats {
  leadsTotal: number;
  leadsNew: number;
  bookingsTotal: number;
  bookingsOpen: number;
}

interface RecentLead {
  id: string;
  name: string;
  vehicle_label: string;
  status: string;
  created_at: string;
}

interface RecentBooking {
  id: string;
  name: string;
  vehicle_brand: string;
  vehicle_model: string;
  preferred_date: string;
  status: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);

  useEffect(() => {
    (async () => {
      const [leadsRes, bookingsRes, recentLeadsRes, recentBookingsRes] = await Promise.all([
        supabase.from('leads').select('id,status'),
        supabase.from('dyno_bookings').select('id,status'),
        supabase.from('leads').select('id,name,vehicle_label,status,created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('dyno_bookings').select('id,name,vehicle_brand,vehicle_model,preferred_date,status').order('created_at', { ascending: false }).limit(5),
      ]);
      const leads = leadsRes.data ?? [];
      const bookings = bookingsRes.data ?? [];
      setStats({
        leadsTotal: leads.length,
        leadsNew: leads.filter((l) => l.status === 'neu').length,
        bookingsTotal: bookings.length,
        bookingsOpen: bookings.filter((b) => b.status === 'angefragt' || b.status === 'bestaetigt').length,
      });
      setRecentLeads((recentLeadsRes.data ?? []) as RecentLead[]);
      setRecentBookings((recentBookingsRes.data ?? []) as RecentBooking[]);
    })();
  }, []);

  if (!stats) {
    return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-brand-gold" /></div>;
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <span className="text-xs uppercase tracking-[0.3em] text-brand-gold">Übersicht</span>
        <h1 className="font-display text-4xl md:text-5xl mt-2">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Aktueller Stand aller Anfragen und Buchungen.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <KpiCard icon={Inbox} label="Anfragen gesamt" value={stats.leadsTotal} />
        <KpiCard icon={CheckCircle2} label="Neue Anfragen" value={stats.leadsNew} accent />
        <KpiCard icon={Wrench} label="Prüfstand-Buchungen" value={stats.bookingsTotal} />
        <KpiCard icon={CalendarClock} label="Offene Buchungen" value={stats.bookingsOpen} accent />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Panel title="Neueste Anfragen" linkTo="/admin/anfragen" linkLabel="Alle Anfragen">
          {recentLeads.length === 0 ? (
            <p className="text-sm text-muted-foreground">Noch keine Anfragen.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentLeads.map((l) => (
                <li key={l.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{l.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{l.vehicle_label}</div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-muted">{l.status.replace(/_/g, ' ')}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Neueste Prüfstand-Buchungen" linkTo="/admin/pruefstand" linkLabel="Alle Buchungen">
          {recentBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">Noch keine Buchungen.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentBookings.map((b) => (
                <li key={b.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{b.vehicle_brand} {b.vehicle_model}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {b.name} · {new Date(b.preferred_date).toLocaleDateString('de-DE')}
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-muted">{b.status}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Inbox;
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className={`bg-card border border-border rounded-lg p-5 ${accent ? 'border-l-4 border-l-[hsl(var(--brand-gold))]' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-brand-gold" />
      </div>
      <div className="font-display text-3xl">{value}</div>
    </div>
  );
}

function Panel({ title, linkTo, linkLabel, children }: { title: string; linkTo: string; linkLabel: string; children: React.ReactNode }) {
  return (
    <section className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl">{title}</h2>
        <Link to={linkTo} className="text-xs uppercase tracking-[0.15em] text-brand-gold hover:underline inline-flex items-center gap-1">
          {linkLabel} <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      {children}
    </section>
  );
}