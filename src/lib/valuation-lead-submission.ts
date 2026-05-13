import { supabase } from "@/integrations/supabase/client";
import type { ValuationData } from "@/lib/valuation-schema";
import type { ValuationResult } from "@/components/ankauf/ValuationPreview";

const featureLabels: Record<string, string> = {
  klima: "Klimaanlage", navi: "Navigation", sitzheizung: "Sitzheizung",
  leder: "Leder", ahk: "Anhängerkupplung", schiebedach: "Schiebedach",
  pdc: "Parksensoren", tempomat: "Tempomat", led_xenon: "LED/Xenon",
  head_up: "Head-Up-Display", alufelgen: "Alufelgen", standheizung: "Standheizung",
  kamera_360: "360°-Kamera", spurhalte: "Spurhalteassistent", acc: "Adaptiver Tempomat",
};

const buildEnrichedNotes = (final: ValuationData): string | null => {
  const lines: string[] = [];
  if (final.color) lines.push(`Farbe: ${final.color}`);
  if (final.doors) lines.push(`Türen: ${final.doors}`);
  if (final.seats) lines.push(`Sitze: ${final.seats}`);
  if (final.features && final.features.length > 0) {
    const names = final.features.map((f) => featureLabels[f] ?? f).join(", ");
    lines.push(`Ausstattung: ${names}`);
  }
  const userNote = final.notes?.trim();
  if (userNote) lines.push(`Anmerkungen: ${userNote}`);
  return lines.length > 0 ? lines.join("\n") : null;
};

export const submitValuationLead = async (
  final: ValuationData,
  valuation: ValuationResult | null,
) => {
  const leadId = crypto.randomUUID();
  const insertPayload: Record<string, unknown> = {
    id: leadId,
    brand: final.brand!,
    model: final.model!,
    year: final.year!,
    mileage: final.mileage!,
    fuel: final.fuel!,
    gearbox: final.gearbox!,
    condition: final.condition!,
    has_tuev: final.hasTuev!,
    accident_free: final.accidentFree!,
    customer_notes: buildEnrichedNotes(final),
    first_name: final.firstName!,
    last_name: final.lastName!,
    email: final.email!,
    phone: final.phone!,
    preferred_date: final.preferredDate!,
    preferred_time: final.preferredTime!,
    contact_channel: final.contactChannel!,
    estimated_value_min: valuation?.min_eur ?? null,
    estimated_value_typical: valuation?.typical_eur ?? null,
    estimated_value_max: valuation?.max_eur ?? null,
    estimated_value_rationale: valuation?.rationale ?? null,
    photo_urls: final.photoUrls ?? [],
  };

  const { error } = await supabase
    .from("valuation_leads")
    .insert(insertPayload as never);
  if (error) throw error;

  // Async best-effort jobs
  void supabase.functions.invoke("compute-lead-score", { body: { leadId } }).catch(() => {});
  void supabase.functions.invoke("scrape-market-data", { body: { leadId } }).catch(() => {});
  void supabase.functions.invoke("notify-lead-telegram", { body: { leadId } }).catch(() => {});
  if (final.photoUrls && final.photoUrls.length > 0) {
    void supabase.functions.invoke("analyze-lead-photos", { body: { leadId } }).catch(() => {});
  }

  return { leadId };
};