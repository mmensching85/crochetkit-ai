import { verifyToken } from './auth/utils.js';

export async function onRequest(context) {
  const { request, env } = context;
  const DB = env.CROCHETKIT_CONTACTS;

  await DB.prepare(`CREATE TABLE IF NOT EXISTS follows (
    follower_id TEXT NOT NULL, following_id TEXT NOT NULL, created_at TEXT,
    PRIMARY KEY (follower_id, following_id)
  )`).run();

  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace('Bearer ', '');
  const payload = verifyToken(token);

  const url = new URL(request.url);
  const targetUser = url.searchParams.get('user');

  if (request.method === 'GET') {
    if (url.searchParams.get('type') === 'followers') {
      const { results } = await DB.prepare('SELECT follower_id, created_at FROM follows WHERE following_id = ? ORDER BY created_at DESC').bind(targetUser).all();
      return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
    }
    if (url.searchParams.get('type') === 'following') {
      const { results } = await DB.prepare('SELECT following_id, created_at FROM follows WHERE follower_id = ? ORDER BY created_at DESC').bind(targetUser).all();
      return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
    }
    if (payload && targetUser) {
      const follow = await DB.prepare('SELECT * FROM follows WHERE follower_id = ? AND following_id = ?').bind(payload.uid, targetUser).first();
      return new Response(JSON.stringify({ isFollowing: !!follow }), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ error: 'user parameter required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  if (request.method === 'POST') {
    if (!payload) return new Response(JSON.stringify({ error: 'Sign in required' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    try {
      const { targetUserId, action } = await request.json();
      if (!targetUserId || !['follow', 'unfollow'].includes(action)) {
        return new Response(JSON.stringify({ error: 'targetUserId and action (follow/unfollow) required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      if (targetUserId === payload.uid) return new Response(JSON.stringify({ error: 'Cannot follow yourself' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

      if (action === 'follow') {
        await DB.prepare('INSERT OR IGNORE INTO follows (follower_id, following_id, created_at) VALUES (?, ?, ?)').bind(payload.uid, targetUserId, new Date().toISOString()).run();
      } else {
        await DB.prepare('DELETE FROM follows WHERE follower_id = ? AND following_id = ?').bind(payload.uid, targetUserId).run();
      }
      return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
}
