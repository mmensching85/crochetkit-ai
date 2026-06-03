const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;

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

  if (!data.name || !data.email || !data.message) {
    return new Response(JSON.stringify({ error: 'Name, email, and message are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!EMAIL_RE.test(data.email)) {
    return new Response(JSON.stringify({ error: 'Invalid email format' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (data.name.length > MAX_NAME || data.email.length > MAX_EMAIL || data.message.length > MAX_MESSAGE) {
    return new Response(JSON.stringify({ error: 'Fields exceed maximum length' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!env.CROCHETKIT_CONTACTS) {
    return new Response(JSON.stringify({ error: 'D1 binding not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  await env.CROCHETKIT_CONTACTS.prepare(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      ip TEXT,
      timestamp TEXT NOT NULL
    )
  `).run();

  await env.CROCHETKIT_CONTACTS.prepare(`
    INSERT INTO contacts (name, email, message, ip, timestamp)
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    data.name,
    data.email,
    data.message,
    request.headers.get('cf-connecting-ip') || '',
    new Date().toISOString()
  ).run();

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
