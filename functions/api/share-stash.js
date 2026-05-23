export async function onRequest(context) {
  const { request } = context;

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

  if (!Array.isArray(data.yarnStash)) {
    return new Response(JSON.stringify({ success: false, error: 'yarnStash array is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const encoded = btoa(JSON.stringify(data.yarnStash));
  const url = `${request.url.split('/api')[0]}/stash.html?stash=${encodeURIComponent(encoded)}`;

  return new Response(JSON.stringify({ success: true, url }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
