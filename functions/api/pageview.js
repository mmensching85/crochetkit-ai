export async function onRequest(context) {
  const { request, env } = context;

  const DB = env.CROCHETKIT_CONTACTS;

  if (request.method === 'POST') {
    try {
      const ip = request.headers.get('cf-connecting-ip') || 'unknown';
      const { path } = await request.json();
      const now = new Date().toISOString();

      await DB.prepare(`CREATE TABLE IF NOT EXISTS pageviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT, ip TEXT NOT NULL, path TEXT NOT NULL, timestamp TEXT NOT NULL
      )`).run();

      await DB.prepare('INSERT INTO pageviews (ip, path, timestamp) VALUES (?, ?, ?)').bind(ip, path || '/', now).run();

      const today = now.slice(0, 10);
      const todayCount = await DB.prepare('SELECT COUNT(*) as c FROM pageviews WHERE timestamp LIKE ?').bind(today + '%').first();
      const totalCount = await DB.prepare('SELECT COUNT(*) as c FROM pageviews').first();

      return new Response(JSON.stringify({ today: todayCount?.c || 0, total: totalCount?.c || 0 }), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  if (request.method === 'GET') {
    if (request.headers.get('x-admin-secret') !== (env.ADMIN_SECRET || '')) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }
    try {
      const { results } = await DB.prepare('SELECT DATE(timestamp) as date, COUNT(*) as views FROM pageviews GROUP BY DATE(timestamp) ORDER BY date DESC LIMIT 30').all();
      const total = await DB.prepare('SELECT COUNT(*) as c FROM pageviews').first();
      return new Response(JSON.stringify({ total: total?.c || 0, daily: results }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
}
