const MAX_STASH_ITEMS = 200;
const MAX_STRING_LENGTH = 500;

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

  if (data.yarnStash.length > MAX_STASH_ITEMS) {
    return new Response(JSON.stringify({
      success: false,
      error: `yarnStash must have ${MAX_STASH_ITEMS} items or fewer`
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  for (const item of data.yarnStash) {
    for (const val of Object.values(item)) {
      if (typeof val === 'string' && val.length > MAX_STRING_LENGTH) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Stash item values must be 500 characters or fewer'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  }

  let encoded;
  try {
    encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data.yarnStash))));
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Failed to encode stash data.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  const url = `${request.url.split('/api')[0]}/stash.html?stash=${encodeURIComponent(encoded)}`;

  return new Response(JSON.stringify({ success: true, url }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
