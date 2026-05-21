export async function onRequest(context) {
  const { env } = context;
  const keys = Object.keys(env);
  return new Response(JSON.stringify({ envKeys: keys }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
