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

  if (!env.CROCHETKIT_FEEDBACK) {
    return new Response(JSON.stringify({ error: 'D1 binding not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  await env.CROCHETKIT_FEEDBACK.prepare(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      comment TEXT,
      rating INTEGER,
      page TEXT,
      project_title TEXT,
      ip TEXT,
      timestamp TEXT NOT NULL
    )
  `).run();

  await env.CROCHETKIT_FEEDBACK.prepare(`
    INSERT INTO feedback (comment, rating, page, project_title, ip, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    data.comment || '',
    data.rating || 0,
    data.page || '',
    data.projectTitle || '',
    request.headers.get('cf-connecting-ip') || '',
    new Date().toISOString()
  ).run();

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
