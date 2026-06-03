import { verifyToken } from './auth/utils.js';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace('Bearer ', '');
  const payload = verifyToken(token);

  if (!payload) {
    return new Response(JSON.stringify({ error: 'Sign in required' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const DB = env.CROCHETKIT_CONTACTS;

  // Get users I follow
  const following = await DB.prepare('SELECT following_id FROM follows WHERE follower_id = ?').bind(payload.uid).all();
  const userIds = following.results.map(f => f.following_id);
  if (userIds.length === 0) {
    return new Response(JSON.stringify({ feed: [], message: 'Follow some makers to see their projects here.' }), { headers: { 'Content-Type': 'application/json' } });
  }

  // Get shared projects from followed users (using username as identifier since user IDs are internal)
  // Since shared_projects uses username, query by username
  // We need to get the usernames for followed users from the users table
  const users = await DB.prepare('SELECT id, email FROM users').all();
  const userIdToName = {};
  users.results.forEach(u => { userIdToName[u.id] = u.email.split('@')[0]; });

  const followedNames = userIds.map(id => userIdToName[id]).filter(Boolean);
  if (followedNames.length === 0) {
    return new Response(JSON.stringify({ feed: [], message: 'Follow some makers to see their projects here.' }), { headers: { 'Content-Type': 'application/json' } });
  }

  // Get recent shared projects from followed users
  const placeholders = followedNames.map(() => '?').join(',');
  const { results } = await DB.prepare(`SELECT * FROM shared_projects WHERE username IN (${placeholders}) ORDER BY created_at DESC LIMIT 30`).bind(...followedNames).all();

  return new Response(JSON.stringify({ feed: results }), { headers: { 'Content-Type': 'application/json' } });
}
