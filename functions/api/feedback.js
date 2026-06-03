const MAX_COMMENT = 2000;
const MAX_PAGE = 100;
const MAX_PROJECT_TITLE = 200;

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

  if (!data.rating || typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5) {
    return new Response(JSON.stringify({ error: 'Rating is required and must be between 1 and 5' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (data.comment && data.comment.length > MAX_COMMENT) {
    return new Response(JSON.stringify({ error: `Comment must be ${MAX_COMMENT} characters or less` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (data.page && data.page.length > MAX_PAGE) {
    return new Response(JSON.stringify({ error: `Page field must be ${MAX_PAGE} characters or less` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (data.projectTitle && data.projectTitle.length > MAX_PROJECT_TITLE) {
    return new Response(JSON.stringify({ error: `Project title must be ${MAX_PROJECT_TITLE} characters or less` }), {
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
    data.rating,
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
