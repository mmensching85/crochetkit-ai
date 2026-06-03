export async function onRequest(context) {
  const { request, env } = context;
  const DB = env.CROCHETKIT_CONTACTS;

  await DB.prepare(`CREATE TABLE IF NOT EXISTS shared_projects (
    id TEXT PRIMARY KEY, pattern_id TEXT, pattern_name TEXT, photo_url TEXT, notes TEXT,
    username TEXT, ip TEXT, created_at TEXT
  )`).run();

  if (request.method === 'GET') {
    const { results } = await DB.prepare('SELECT * FROM shared_projects ORDER BY created_at DESC LIMIT 50').all();
    return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
  }

  if (request.method === 'POST') {
    try {
      const { patternId, patternName, photoUrl, notes, username } = await request.json();
      if (!patternId || !patternName) {
        return new Response(JSON.stringify({ error: 'patternId and patternName required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      const id = 'shared-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
      const ip = request.headers.get('cf-connecting-ip') || 'unknown';

      // Rate limit: 10 shares per IP per day
      const ipToday = await DB.prepare("SELECT COUNT(*) as c FROM shared_projects WHERE ip = ? AND DATE(created_at) = DATE('now')").bind(ip).first();
      if (ipToday && ipToday.c >= 10) {
        return new Response(JSON.stringify({ error: 'Maximum 10 shares per day' }), { status: 429, headers: { 'Content-Type': 'application/json' } });
      }

      const now = new Date().toISOString();
      await DB.prepare('INSERT INTO shared_projects (id, pattern_id, pattern_name, photo_url, notes, username, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(id, patternId, patternName, photoUrl || '', notes || '', username || 'Anonymous', now).run();

      return new Response(JSON.stringify({ success: true, id }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
}
