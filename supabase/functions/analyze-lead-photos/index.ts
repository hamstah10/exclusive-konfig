import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    const { data: lead, error } = await supabase
      .from("valuation_leads")
      .select("id, brand, model, year, photo_urls")
      .eq("id", leadId).maybeSingle();
    if (error || !lead) throw error ?? new Error("Lead not found");
    const photos: string[] = lead.photo_urls ?? [];
    if (photos.length === 0 || !LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content:
              "Du bist ein KFZ-Sachverständiger. Analysiere Fahrzeugfotos und bewerte den sichtbaren Zustand neutral.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: `Fahrzeug: ${lead.brand} ${lead.model} (${lead.year}). Bewerte den Zustand nach den sichtbaren Bildern.` },
              ...photos.slice(0, 8).map((url: string) => ({ type: "image_url", image_url: { url } })),
            ],
          },
        ],
        tools: [{
          type: "function",
          function: {
            name: "submit_photo_analysis",
            description: "Liefert eine strukturierte Foto-Analyse.",
            parameters: {
              type: "object",
              properties: {
                overall_condition_score: { type: "integer", description: "Sichtbarer Gesamtzustand 1–10." },
                summary: { type: "string", description: "Kurze deutsche Zusammenfassung (max. 280 Zeichen)." },
                visible_damages: { type: "array", items: { type: "string" } },
                positive_aspects: { type: "array", items: { type: "string" } },
              },
              required: ["overall_condition_score", "summary"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "submit_photo_analysis" } },
      }),
    });

    if (!aiResp.ok) {
      console.error("photo analysis AI error", aiResp.status, await aiResp.text());
      return new Response(JSON.stringify({ ok: false }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const aiData = await aiResp.json();
    const argsRaw = aiData?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const analysis = argsRaw ? (typeof argsRaw === "string" ? JSON.parse(argsRaw) : argsRaw) : null;
    if (analysis) {
      await supabase.from("valuation_photo_analysis").insert({ lead_id: leadId, analysis });
    }
    return new Response(JSON.stringify({ ok: true, analysis }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("analyze-lead-photos error", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});