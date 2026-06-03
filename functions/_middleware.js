const WINDOW_MS = 60_000;
const MAX_REQUESTS = 100;
const ipMap = new Map();

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const allowed = origin.endsWith('.pages.dev') || origin.startsWith('http://localhost') || origin === 'https://crochetkit-ai.pages.dev';
  return {
    'Access-Control-Allow-Origin': allowed ? origin : 'https://crochetkit-ai.pages.dev',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  };
}

export async function onRequest(context) {
  const { request, next } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  }

  // Rate limiting
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const now = Date.now();
  const entry = ipMap.get(ip);
  if (!entry || now - entry.start > WINDOW_MS) {
    ipMap.set(ip, { start: now, count: 1 });
  } else {
    entry.count++;
    if (entry.count > MAX_REQUESTS) {
      return new Response(JSON.stringify({ error: 'Too many requests. Please slow down.' }), {
        status: 429,
        headers: { ...corsHeaders(request), 'Content-Type': 'application/json', 'Retry-After': '60' }
      });
    }
  }

  const response = await next();
  const cors = corsHeaders(request);
  for (const [key, val] of Object.entries(cors)) {
    response.headers.set(key, val);
  }
  return response;
}
