// Lovable AI gateway — vehicle price estimation via tool calling
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VehicleInput {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuel: string;
  gearbox: string;
  condition: string;
  has_tuev: string;
  accident_free: string;
  customer_notes?: string | null;
}

const validateInput = (raw: unknown): VehicleInput | null => {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : Number(v));
  const brand = str(r.brand);
  const model = str(r.model);
  const year = num(r.year);
  const mileage = num(r.mileage);
  const fuel = str(r.fuel);
  const gearbox = str(r.gearbox);
  const condition = str(r.condition);
  const has_tuev = str(r.has_tuev);
  const accident_free = str(r.accident_free);
  if (!brand || !model || !fuel || !gearbox || !condition || !has_tuev || !accident_free) return null;
  if (!Number.isFinite(year) || year < 1950 || year > 2100) return null;
  if (!Number.isFinite(mileage) || mileage < 0 || mileage > 2_000_000) return null;
  return {
    brand, model, year, mileage, fuel, gearbox, condition, has_tuev, accident_free,
    customer_notes: typeof r.customer_notes === "string" ? r.customer_notes.slice(0, 500) : null,
  };
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => null);
    const input = validateInput(body);
    if (!input) {
      return new Response(JSON.stringify({ error: "Ungültige Fahrzeugdaten" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt =
      "Du bist ein erfahrener Fahrzeugbewerter für den deutschen Gebrauchtwagenmarkt. " +
      "Schätze realistische Ankaufspreise (das, was ein Händler einem Privatverkäufer in bar zahlen würde — " +
      "nicht den Endkunden-Verkaufspreis). Berücksichtige Marke, Modell, Baujahr, Laufleistung, Kraftstoff, " +
      "Getriebe, Zustand, TÜV-Status und Unfallfreiheit. Gib alle Beträge als ganze Euro-Zahlen aus.";

    const userPrompt =
      `Bitte bewerte folgendes Fahrzeug:\n` +
      `- Marke: ${input.brand}\n- Modell: ${input.model}\n- Baujahr: ${input.year}\n` +
      `- Kilometerstand: ${input.mileage.toLocaleString("de-DE")} km\n- Kraftstoff: ${input.fuel}\n` +
      `- Getriebe: ${input.gearbox}\n- Zustand: ${input.condition}\n- TÜV: ${input.has_tuev}\n` +
      `- Unfallfrei: ${input.accident_free}\n` +
      (input.customer_notes ? `- Kundenhinweise: ${input.customer_notes}\n` : "") +
      `\nGib die geschätzte Ankaufspreis-Spanne und eine kurze Begründung (max. 2 Sätze) zurück.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "submit_valuation",
            description: "Liefert die geschätzte Ankaufspreis-Spanne in Euro für das Fahrzeug.",
            parameters: {
              type: "object",
              properties: {
                min_eur: { type: "integer", description: "Untere Spanne in Euro." },
                typical_eur: { type: "integer", description: "Typischer Ankaufspreis in Euro." },
                max_eur: { type: "integer", description: "Obere Spanne in Euro." },
                rationale: { type: "string", description: "Kurze Begründung 1–2 Sätze." },
              },
              required: ["min_eur", "typical_eur", "max_eur", "rationale"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "submit_valuation" } },
      }),
    });

    if (aiResponse.status === 429) {
      return new Response(JSON.stringify({ error: "Bewertungs-Service ist gerade ausgelastet." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiResponse.status === 402) {
      return new Response(JSON.stringify({ error: "Bewertungs-Service: Guthaben aufgebraucht." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiResponse.ok) {
      console.error("AI gateway error", aiResponse.status, await aiResponse.text());
      return new Response(JSON.stringify({ error: "Bewertung fehlgeschlagen" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const argsRaw = aiData?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!argsRaw) {
      return new Response(JSON.stringify({ error: "Bewertung konnte nicht verarbeitet werden" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const parsed = typeof argsRaw === "string" ? JSON.parse(argsRaw) : argsRaw;
    const clampInt = (n: number) => {
      const v = Math.round(Number(n));
      if (!Number.isFinite(v) || v < 0) return 0;
      if (v > 1_000_000) return 1_000_000;
      return v;
    };
    let min = clampInt(parsed.min_eur);
    let typical = clampInt(parsed.typical_eur);
    let max = clampInt(parsed.max_eur);
    if (typical < min) typical = min;
    if (max < typical) max = typical;

    return new Response(JSON.stringify({
      min_eur: min, typical_eur: typical, max_eur: max,
      rationale: (parsed.rationale ?? "").toString().slice(0, 500),
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("valuate-vehicle error", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});