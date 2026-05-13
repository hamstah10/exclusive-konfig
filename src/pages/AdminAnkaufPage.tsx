import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Mail, Phone, Calendar, Gauge, Car, Star } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Lead = Database["public"]["Tables"]["valuation_leads"]["Row"];
type Status = Lead["status"];

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "neu", label: "Neu" },
  { value: "in_bearbeitung", label: "In Bearbeitung" },
  { value: "termin_vereinbart", label: "Termin vereinbart" },
  { value: "angekauft", label: "Angekauft" },
  { value: "verkauft", label: "Verkauft" },
  { value: "abgelehnt", label: "Abgelehnt" },
];

const STATUS_TONE: Record<string, string> = {
  neu: "bg-amber-100 text-amber-900 border-amber-300",
  in_bearbeitung: "bg-sky-100 text-sky-900 border-sky-300",
  termin_vereinbart: "bg-violet-100 text-violet-900 border-violet-300",
  angekauft: "bg-emerald-100 text-emerald-900 border-emerald-300",
  verkauft: "bg-emerald-200 text-emerald-900 border-emerald-400",
  abgelehnt: "bg-rose-100 text-rose-900 border-rose-300",
};

const fmtEuro = (n: number | null) =>
  typeof n === "number" ? new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n) : "—";
const fmtKm = (n: number | null) =>
  typeof n === "number" ? `${new Intl.NumberFormat("de-DE").format(n)} km` : "—";

export default function AdminAnkaufPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [drafts, setDrafts] = useState<Record<string, { status: Status; admin_note: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, []);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("valuation_leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Konnte Ankauf-Leads nicht laden");
    } else {
      setLeads((data ?? []) as Lead[]);
      const next: Record<string, { status: Status; admin_note: string }> = {};
      (data ?? []).forEach((l) => {
        next[l.id] = { status: l.status, admin_note: l.admin_note ?? "" };
      });
      setDrafts(next);
    }
    setLoading(false);
  };

  const filtered = useMemo(
    () => (filter === "all" ? leads : leads.filter((l) => l.status === filter)),
    [leads, filter],
  );

  const save = async (id: string) => {
    const draft = drafts[id];
    if (!draft) return;
    setSavingId(id);
    const { error } = await supabase
      .from("valuation_leads")
      .update({ status: draft.status, admin_note: draft.admin_note || null })
      .eq("id", id);
    setSavingId(null);
    if (error) toast.error("Speichern fehlgeschlagen");
    else {
      toast.success("Gespeichert");
      void load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl">Ankauf-Leads</h1>
          <p className="text-sm text-muted-foreground">Eingehende Fahrzeug-Bewertungen verwalten.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={(v) => setFilter(v as Status | "all")}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              {STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-brand-gold" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card/50 px-6 py-16 text-center text-muted-foreground">
          Noch keine Ankauf-Anfragen.
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((l) => {
            const d = drafts[l.id] ?? { status: l.status, admin_note: l.admin_note ?? "" };
            const dirty = d.status !== l.status || (d.admin_note ?? "") !== (l.admin_note ?? "");
            return (
              <div key={l.id} className="rounded-lg border border-border bg-card shadow-sm p-5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-brand-gold" />
                      <h2 className="font-display text-lg">{l.brand} {l.model} <span className="text-muted-foreground">({l.year})</span></h2>
                      {typeof l.lead_score === "number" && (
                        <Badge variant="outline" className="ml-2"><Star className="h-3 w-3 mr-1" />{l.lead_score}</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Gauge className="h-3 w-3" />{fmtKm(l.mileage)}</span>
                      <span>{l.fuel} · {l.gearbox} · {l.condition}</span>
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />Wunsch: {l.preferred_date} ({l.preferred_time})</span>
                    </div>
                  </div>
                  <Badge className={`border ${STATUS_TONE[l.status] ?? ""}`}>{STATUS_OPTIONS.find((o) => o.value === l.status)?.label ?? l.status}</Badge>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Kunde</div>
                    <div className="font-medium">{l.first_name} {l.last_name}</div>
                    <div className="text-muted-foreground inline-flex items-center gap-1"><Mail className="h-3 w-3" /><a className="hover:underline" href={`mailto:${l.email}`}>{l.email}</a></div>
                    <div className="text-muted-foreground inline-flex items-center gap-1"><Phone className="h-3 w-3" /><a className="hover:underline" href={`tel:${l.phone}`}>{l.phone}</a></div>
                    <div className="text-xs text-muted-foreground">Bevorzugt: {l.contact_channel}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">KI-Bewertung</div>
                    <div className="font-display text-xl text-brand-gold">{fmtEuro(l.estimated_value_typical)}</div>
                    <div className="text-xs text-muted-foreground">Spanne: {fmtEuro(l.estimated_value_min)} – {fmtEuro(l.estimated_value_max)}</div>
                    {l.estimated_value_rationale && (
                      <p className="text-xs text-muted-foreground line-clamp-3 mt-1">{l.estimated_value_rationale}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Hinweise</div>
                    <p className="text-sm whitespace-pre-line text-muted-foreground line-clamp-5">{l.customer_notes ?? "—"}</p>
                    {l.photo_urls && l.photo_urls.length > 0 && (
                      <div className="flex gap-1 pt-2">
                        {l.photo_urls.slice(0, 4).map((url) => (
                          <a key={url} href={url} target="_blank" rel="noreferrer" className="block h-12 w-12 overflow-hidden rounded border border-border">
                            <img src={url} alt="Foto" className="h-full w-full object-cover" loading="lazy" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-[200px_1fr_auto] gap-3 items-start border-t border-border pt-4">
                  <Select
                    value={d.status}
                    onValueChange={(v) => setDrafts((s) => ({ ...s, [l.id]: { ...d, status: v as Status } }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Interne Notiz …"
                    value={d.admin_note}
                    onChange={(e) => setDrafts((s) => ({ ...s, [l.id]: { ...d, admin_note: e.target.value } }))}
                    rows={2}
                  />
                  <Button onClick={() => save(l.id)} disabled={!dirty || savingId === l.id}>
                    {savingId === l.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Speichern"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}