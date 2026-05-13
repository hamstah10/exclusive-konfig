import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const UPSTREAM_BASE = 'https://verwaltung.tuningfux.de/api/fahrzeugdatenbank';

// Allowed sub-paths (relative to fahrzeugdatenbank). Empty string = root.
const ALLOWED = [
  /^$/,
  /^\/types$/,
  /^\/brands\/\d+$/,
  /^\/series\/\d+$/,
  /^\/models\/\d+$/,
  /^\/engines\/\d+$/,
  /^\/engine-details\/\d+$/,
  /^\/track$/,
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const token = Deno.env.get('FAHRZEUGDB_API_TOKEN');
  const tokenId = Deno.env.get('FAHRZEUGDB_TOKEN_ID');
  if (!token || !tokenId) {
    return new Response(
      JSON.stringify({ error: 'FAHRZEUGDB_API_TOKEN or FAHRZEUGDB_TOKEN_ID not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  try {
    const url = new URL(req.url);
    // Strip "/fahrzeugdatenbank" prefix from the function path
    const fnPath = url.pathname.replace(/^\/fahrzeugdatenbank/, '');
    const subPath = fnPath; // already starts with "" or "/..."

    if (!ALLOWED.some((re) => re.test(subPath))) {
      return new Response(JSON.stringify({ error: `Path not allowed: ${subPath}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method !== 'GET' && req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const upstreamUrl = `${UPSTREAM_BASE}${subPath}${url.search}`;
    const init: RequestInit = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Token-Id': tokenId,
      },
    };
    if (req.method === 'POST') {
      const body = await req.text();
      init.body = body;
    }

    const upstream = await fetch(upstreamUrl, init);
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: {
        ...corsHeaders,
        'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('fahrzeugdatenbank proxy error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});