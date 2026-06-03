import { createToken, hashPassword } from './utils.js';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password || password.length < 6) {
      return new Response(JSON.stringify({ error: 'Email and password (min 6 chars) required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const DB = env.CROCHETKIT_CONTACTS;
    await DB.prepare(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE, password TEXT, stash TEXT DEFAULT '[]', faves TEXT DEFAULT '[]', progress TEXT DEFAULT '{}', created_at TEXT)`).run();

    const existing = await DB.prepare('SELECT email FROM users WHERE email = ?').bind(email.toLowerCase()).first();
    if (existing) {
      return new Response(JSON.stringify({ error: 'Email already registered' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const hashed = await hashPassword(password);
    const createdAt = new Date().toISOString();

    await DB.prepare('INSERT INTO users (id, email, password, stash, faves, progress, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(id, email.toLowerCase(), hashed, '[]', '[]', '{}', createdAt).run();

    const token = await createToken(id, email, env.JWT_SECRET);

    return new Response(JSON.stringify({ success: true, token, user: { id, email: email.toLowerCase(), stash: [], faves: [], progress: {} } }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
