import { verifyToken } from './auth/utils.js';

export async function onRequest(context) {
  const { request, env } = context;

  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace('Bearer ', '');
  const payload = verifyToken(token);

  if (!payload) {
    return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const DB = env.CROCHETKIT_CONTACTS;

  if (request.method === 'GET') {
    const user = await DB.prepare('SELECT stash, faves, progress FROM users WHERE id = ?').bind(payload.uid).first();
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({
      stash: JSON.parse(user.stash || '[]'),
      faves: JSON.parse(user.faves || '[]'),
      progress: JSON.parse(user.progress || '{}')
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  if (request.method === 'POST') {
    try {
      const { stash, faves, progress } = await request.json();
      const updates = [];
      const params = [];

      if (stash !== undefined) { updates.push('stash = ?'); params.push(JSON.stringify(stash)); }
      if (faves !== undefined) { updates.push('faves = ?'); params.push(JSON.stringify(faves)); }
      if (progress !== undefined) { updates.push('progress = ?'); params.push(JSON.stringify(progress)); }

      if (updates.length === 0) {
        return new Response(JSON.stringify({ error: 'No data to sync' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      params.push(payload.uid);
      await DB.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run();

      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
}
