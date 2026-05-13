import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadRow {
  id: string;
  mileage: number;
  condition: string;
  accident_free: string;
  has_tuev: string;
  customer_notes: string | null;
  photo_urls: string[];
  estimated_value_typical: number | null;
  preferred_date: string | null;
  created_at: string;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const score = (l: LeadRow): number => {
  let s = 0;
  const v = l.estimated_value_typical ?? 0;
  if (v >= 30000) s += 30;
  else if (v >= 20000) s += 25;
  else if (v >= 12000) s += 20;
  else if (v >= 6000) s += 12;
  else if (v >= 2000) s += 6;
  else if (v > 0) s += 2;

  const photos = l.photo_urls?.length ?? 0;
  if (photos >= 6) s += 15;
  else if (photos >= 3) s += 10;
  else if (photos >= 1) s += 5;

  const c = (l.condition || "").toLowerCase();
  if (c.includes("sehr") || c.includes("neuwertig")) s += 15;
  else if (c.includes("gut")) s += 10;
  else if (c.includes("akzept") || c.includes("befried")) s += 5;
  if (l.accident_free?.toLowerCase().includes("ja")) s += 3;
  if (l.has_tuev?.toLowerCase().includes("ja")) s += 2;

  if (l.customer_notes && l.customer_notes.length > 30) s += 4;
  if (l.preferred_date) s += 3;
  if (l.mileage > 250000) s -= 5;

  const ageHours = (Date.now() - new Date(l.created_at).getTime()) / 36e5;
  if (ageHours < 24) s += 5;

  return clamp(Math.round(s), 0, 100);
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { leadId } = await req.json().catch(() => ({}));
    if (!leadId) {
      return new Response(JSON.stringify({ error: "leadId required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    const { data: lead, error } = await supabase
      .from("valuation_leads")
      .select("id, mileage, condition, accident_free, has_tuev, customer_notes, photo_urls, estimated_value_typical, preferred_date, created_at")
      .eq("id", leadId).maybeSingle();
    if (error || !lead) throw error ?? new Error("Lead not found");
    const value = score(lead as LeadRow);
    await supabase.from("valuation_leads").update({ lead_score: value }).eq("id", leadId);
    return new Response(JSON.stringify({ ok: true, score: value }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("compute-lead-score error", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});