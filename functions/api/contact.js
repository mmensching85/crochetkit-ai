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

  if (!data.email || !data.message) {
    return new Response(JSON.stringify({ error: 'Email and message are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const record = {
    name: data.name || '',
    email: data.email,
    message: data.message,
    timestamp: new Date().toISOString(),
    ip: request.headers.get('cf-connecting-ip') || ''
  };

  const key = `contact:${Date.now()}:${crypto.randomUUID().slice(0, 8)}`;
  await env.CROCHETKIT_CONTACTS.put(key, JSON.stringify(record));

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
