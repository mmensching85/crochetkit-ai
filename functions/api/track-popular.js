const MAX_PATTERN_ID = 100;
const VALID_ACTIONS = ['view', 'select', 'pdf'];

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const contentType = request.headers.get('content-type') || '';
  let data;
  if (contentType.includes('application/json')) {
    data = await request.json();
  } else {
    const formData = await request.formData();
    data = {};
    for (const [key, val] of formData.entries()) {
      data[key] = val;
    }
  }

  const { patternId, action } = data;

  if (!patternId || typeof patternId !== 'string' || patternId.length > MAX_PATTERN_ID) {
    return new Response(JSON.stringify({ error: `patternId is required and must be ${MAX_PATTERN_ID} characters or less` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!VALID_ACTIONS.includes(action)) {
    return new Response(JSON.stringify({ error: `action must be one of: ${VALID_ACTIONS.join(', ')}` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!env.CROCHETKIT_FEEDBACK) {
    return new Response(JSON.stringify({ error: 'D1 binding not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  await env.CROCHETKIT_FEEDBACK.prepare(`
    CREATE TABLE IF NOT EXISTS popular_tracking (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pattern_id TEXT NOT NULL,
      action TEXT NOT NULL,
      ip TEXT,
      timestamp TEXT NOT NULL
    )
  `).run();

  await env.CROCHETKIT_FEEDBACK.prepare(`
    INSERT INTO popular_tracking (pattern_id, action, ip, timestamp)
    VALUES (?, ?, ?, ?)
  `).bind(
    patternId,
    action,
    request.headers.get('cf-connecting-ip') || '',
    new Date().toISOString()
  ).run();

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
