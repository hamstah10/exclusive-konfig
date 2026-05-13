import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, Inbox, LogOut, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Reveal } from '@/components/Reveal';
import type { Database } from '@/integrations/supabase/types';

type Lead = Database['public']['Tables']['leads']['Row'];

const STATUS_META: Record<Lead['status'], { label: string; tone: string; description: string }> = {
  neu: {
    label: 'Neu eingegangen',
    tone: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Wir haben deine Anfrage erhalten und melden uns in Kürze.',
  },
  in_bearbeitung: {
    label: 'In Bearbeitung',
    tone: 'bg-amber-100 text-amber-900 border-amber-200',
    description: 'Unser Team prüft dein Wunschfahrzeug und stellt das Angebot zusammen.',
  },
  angebot_versendet: {
    label: 'Angebot versendet',
    tone: 'bg-[hsl(var(--brand-gold))]/20 text-[hsl(var(--brand-dark))] border-[hsl(var(--brand-gold))]',
    description: 'Dein persönliches Angebot wurde verschickt. Bitte prüfe dein E-Mail-Postfach.',
  },
  abgeschlossen: {
    label: 'Abgeschlossen',
    tone: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Vielen Dank für dein Vertrauen!',
  },
  abgelehnt: {
    label: 'Geschlossen',
    tone: 'bg-muted text-muted-foreground border-border',
    description: 'Diese Anfrage ist abgeschlossen. Sprich uns gerne erneut an.',
  },
};

const STAGES: Lead['status'][] = ['neu', 'in_bearbeitung', 'angebot_versendet', 'abgeschlossen'];

function StatusTimeline({ status }: { status: Lead['status'] }) {
  if (status === 'abgelehnt') return null;
  const activeIdx = STAGES.indexOf(status);
  return (
    <div className="flex items-center gap-2 mt-4">
      {STAGES.map((stage, idx) => {
        const reached = idx <= activeIdx;
        return (
          <div key={stage} className="flex items-center flex-1">
            <div
              className={`h-2 flex-1 transition-colors ${
                reached ? 'bg-[hsl(var(--brand-gold))]' : 'bg-border'
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function PortalPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [leads, setLeads] = useState<Lead[] | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          setLeads([]);
          return;
        }
        setLeads(data ?? []);
      });

    // Realtime updates so users see status changes live
    const channel = supabase
      .channel('portal-leads')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads', filter: `user_id=eq.${user.id}` },
        () => {
          supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false })
            .then(({ data }) => setLeads(data ?? []));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--brand-gold))]" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth?redirect=/portal" replace />;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="solid" />

      <section className="bg-brand-dark text-white py-16 md:py-20 border-b border-[hsl(var(--brand-gold))]/20">
        <div className="max-w-5xl mx-auto px-6 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <Reveal direction="left">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-brand-gold mb-3">
                <span className="h-px w-10 bg-[hsl(var(--brand-gold))]" />
                Mein Portal
              </span>
            </Reveal>
            <Reveal direction="up" delay={0.05}>
              <h1 className="font-display text-4xl md:text-5xl leading-tight">
                Hallo <span className="italic text-brand-gold">{user.user_metadata?.full_name?.split(' ')[0] ?? user.email?.split('@')[0]}.</span>
              </h1>
            </Reveal>
            <Reveal direction="up" delay={0.1}>
              <p className="text-white/70 mt-2 text-sm">
                Status deiner Angebotsanfragen auf einen Blick.
              </p>
            </Reveal>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/70 hover:text-brand-gold transition-colors"
          >
            <LogOut className="h-4 w-4" /> Abmelden
          </button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        {leads === null ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--brand-gold))]" />
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border">
            <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-2xl mb-2">Noch keine Anfragen</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Stöbere durch unsere Fahrzeugbörse und sende deine erste Angebotsanfrage.
            </p>
            <Link
              to="/fahrzeuge"
              className="inline-flex items-center gap-2 bg-[hsl(var(--brand-dark))] text-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-[hsl(var(--brand-dark))]/90"
            >
              Zur Fahrzeugbörse <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => {
              const meta = STATUS_META[lead.status];
              return (
                <article key={lead.id} className="bg-card border border-border p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                        Angefragt am {fmtDate(lead.created_at)}
                      </div>
                      <h3 className="font-display text-xl">{lead.vehicle_label}</h3>
                    </div>
                    <span
                      className={`inline-flex items-center text-[10px] uppercase tracking-[0.2em] px-3 py-1 border ${meta.tone}`}
                    >
                      {meta.label}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground">{meta.description}</p>

                  <StatusTimeline status={lead.status} />

                  {lead.admin_note && (
                    <div className="mt-4 bg-secondary border-l-2 border-[hsl(var(--brand-gold))] p-3 text-sm">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                        Notiz vom Team
                      </div>
                      {lead.admin_note}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {lead.financing && <span>Finanzierung gewünscht</span>}
                      {lead.trade_in && <span>· Inzahlungnahme</span>}
                      <span>· Kontakt: {lead.preferred_contact === 'phone' ? 'Telefon' : 'E-Mail'}</span>
                    </div>
                    <Link
                      to={`/fahrzeuge/${lead.vehicle_slug}`}
                      className="text-xs uppercase tracking-[0.15em] font-semibold inline-flex items-center gap-1 hover:text-[hsl(var(--brand-gold))]"
                    >
                      Fahrzeug ansehen <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}