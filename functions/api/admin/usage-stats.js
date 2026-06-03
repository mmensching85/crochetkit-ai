export async function onRequest(context) {
  const { request, env } = context;

  if (request.headers.get('x-admin-secret') !== (env.ADMIN_SECRET || '')) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const result = await env.CROCHETKIT_FEEDBACK.prepare(
      'SELECT COUNT(*) as count FROM popular_tracking'
    ).first();
    return new Response(JSON.stringify({ count: result?.count || 0 }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    return new Response(JSON.stringify({ count: 0 }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
