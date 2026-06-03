export async function onRequest(context) {
  const { request, env } = context;
  const DB = env.CROCHETKIT_CONTACTS;

  await DB.prepare(`CREATE TABLE IF NOT EXISTS project_comments (
    id TEXT PRIMARY KEY, project_id TEXT NOT NULL, author_name TEXT NOT NULL,
    comment_text TEXT NOT NULL, created_at TEXT
  )`).run();

  const url = new URL(request.url);
  const projectId = url.searchParams.get('projectId');

  if (request.method === 'GET') {
    if (!projectId) return new Response(JSON.stringify({ error: 'projectId required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    const { results } = await DB.prepare('SELECT * FROM project_comments WHERE project_id = ? ORDER BY created_at ASC').bind(projectId).all();
    return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
  }

  if (request.method === 'POST') {
    try {
      const { projectId: pid, authorName, commentText } = await request.json();
      if (!pid || !commentText) return new Response(JSON.stringify({ error: 'projectId and commentText required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      const id = 'cmt-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
      await DB.prepare('INSERT INTO project_comments (id, project_id, author_name, comment_text, created_at) VALUES (?, ?, ?, ?, ?)').bind(id, pid, (authorName || 'Anonymous').slice(0, 50), commentText.slice(0, 500), new Date().toISOString()).run();
      return new Response(JSON.stringify({ success: true, id }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
}
