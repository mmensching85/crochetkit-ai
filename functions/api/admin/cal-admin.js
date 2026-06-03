export async function onRequest(context) {
  const { request, env } = context;

  if (request.headers.get('x-admin-secret') !== (env.ADMIN_SECRET || '')) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  }

  const DB = env.CROCHETKIT_CONTACTS;
  await DB.prepare(`CREATE TABLE IF NOT EXISTS cals (
    id TEXT PRIMARY KEY, pattern_id TEXT, title TEXT, description TEXT, start_date TEXT,
    total_steps INTEGER, created_by TEXT, status TEXT DEFAULT 'upcoming', created_at TEXT
  )`).run();

  if (request.method === 'POST') {
    try {
      const { patternId, title, description, startDate, totalSteps } = await request.json();

      if (!patternId || !title || !startDate || !totalSteps) {
        return new Response(JSON.stringify({ error: 'patternId, title, startDate, totalSteps required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      const id = 'cal-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
      const now = new Date().toISOString();

      await DB.prepare('INSERT INTO cals (id, pattern_id, title, description, start_date, total_steps, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(id, patternId, title, description || '', startDate, parseInt(totalSteps), now).run();

      return new Response(JSON.stringify({ success: true, calId: id }), { headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
}
