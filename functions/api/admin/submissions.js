export async function onRequest(context) {
  const { request, env } = context;

  if (request.headers.get('x-admin-secret') !== (env.ADMIN_SECRET || '')) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  }

  const DB = env.CROCHETKIT_CONTACTS;
  await DB.prepare(`CREATE TABLE IF NOT EXISTS pattern_submissions (
    id TEXT PRIMARY KEY, data TEXT, designer_email TEXT, status TEXT DEFAULT 'pending',
    ip TEXT, created_at TEXT, reviewed_at TEXT
  )`).run();

  if (request.method === 'GET') {
    const { results } = await DB.prepare('SELECT * FROM pattern_submissions ORDER BY created_at DESC').all();
    return new Response(JSON.stringify(results.map(r => ({ ...r, data: JSON.parse(r.data) }))), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (request.method === 'POST') {
    try {
      const { submissionId, action } = await request.json();
      if (!submissionId || !['approve', 'reject'].includes(action)) {
        return new Response(JSON.stringify({ error: 'submissionId and action (approve/reject) required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      const now = new Date().toISOString();

      if (action === 'reject') {
        await DB.prepare('UPDATE pattern_submissions SET status = ?, reviewed_at = ? WHERE id = ?').bind('rejected', now, submissionId).run();
        return new Response(JSON.stringify({ success: true, message: 'Submission rejected' }), { headers: { 'Content-Type': 'application/json' } });
      }

      const submission = await DB.prepare('SELECT * FROM pattern_submissions WHERE id = ?').bind(submissionId).first();
      if (!submission) {
        return new Response(JSON.stringify({ error: 'Submission not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      }

      const pattern = JSON.parse(submission.data);
      const id = 'pattern-' + (pattern.name || 'submission').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + String(Date.now()).slice(-3);

      pattern.id = id;
      pattern.imageUrl = pattern.imageUrl || `/assets/patterns/${id}.webp`;

      await DB.prepare('UPDATE pattern_submissions SET status = ?, reviewed_at = ? WHERE id = ?').bind('approved', now, submissionId).run();

      await DB.prepare(`CREATE TABLE IF NOT EXISTS community_patterns (
        id TEXT PRIMARY KEY, data TEXT, designer_email TEXT, approved_at TEXT
      )`).run();

      await DB.prepare('INSERT INTO community_patterns (id, data, designer_email, approved_at) VALUES (?, ?, ?, ?)').bind(id, JSON.stringify(pattern), submission.designer_email, now).run();

      return new Response(JSON.stringify({ success: true, pattern: pattern, message: 'Pattern approved and published!' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
}
