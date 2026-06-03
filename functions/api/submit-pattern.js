const REQUIRED_FIELDS = ['name', 'shortDescription', 'category', 'difficulty.level', 'difficulty.score', 'estimatedTime.minHours', 'estimatedTime.maxHours', 'materials.yarn.weightCategory', 'materials.yarn.weightNumber', 'materials.yarn.suggestedYardageMin', 'materials.yarn.suggestedYardageMax', 'instructions'];
const MAX_PER_DAY = 3;

function checkField(obj, path) {
  const parts = path.split('.');
  let val = obj;
  for (const p of parts) {
    if (!val || typeof val !== 'object') return false;
    val = val[p];
  }
  return val !== undefined && val !== null && val !== '';
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const data = await request.json();

    for (const field of REQUIRED_FIELDS) {
      if (!checkField(data, field)) {
        return new Response(JSON.stringify({ error: `Missing required field: ${field}` }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
    }

    const weightNum = parseInt(data.materials.yarn.weightNumber);
    if (isNaN(weightNum) || weightNum < 0 || weightNum > 7) {
      return new Response(JSON.stringify({ error: 'Yarn weight must be 0-7' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const diffScore = parseInt(data.difficulty.score);
    if (isNaN(diffScore) || diffScore < 1 || diffScore > 10) {
      return new Response(JSON.stringify({ error: 'Difficulty score must be 1-10' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (!Array.isArray(data.instructions) || data.instructions.length < 3) {
      return new Response(JSON.stringify({ error: 'At least 3 instruction steps required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const ip = request.headers.get('cf-connecting-ip') || 'unknown';
    const DB = env.CROCHETKIT_CONTACTS;

    await DB.prepare(`CREATE TABLE IF NOT EXISTS pattern_submissions (
      id TEXT PRIMARY KEY, data TEXT, designer_email TEXT, status TEXT DEFAULT 'pending',
      ip TEXT, created_at TEXT, reviewed_at TEXT
    )`).run();

    const today = new Date().toISOString().slice(0, 10);
    const count = await DB.prepare('SELECT COUNT(*) as c FROM pattern_submissions WHERE ip = ? AND created_at LIKE ?').bind(ip, today + '%').first();
    if (count && count.c >= MAX_PER_DAY) {
      return new Response(JSON.stringify({ error: 'Maximum 3 submissions per day' }), { status: 429, headers: { 'Content-Type': 'application/json' } });
    }

    const id = 'submission-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
    const now = new Date().toISOString();

    await DB.prepare('INSERT INTO pattern_submissions (id, data, designer_email, ip, created_at) VALUES (?, ?, ?, ?, ?)').bind(id, JSON.stringify(data), data.designerEmail || '', ip, now).run();

    return new Response(JSON.stringify({ success: true, id, message: 'Pattern submitted for review. You\'ll be notified when it\'s approved.' }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
