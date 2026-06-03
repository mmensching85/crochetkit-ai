export async function onRequest(context) {
  const { request, env } = context;

  if (request.headers.get('x-admin-secret') !== (env.ADMIN_SECRET || '')) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { results } = await env.CROCHETKIT_FEEDBACK.prepare(
      'SELECT comment, rating, project_title, timestamp FROM feedback ORDER BY timestamp DESC'
    ).all();
    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
