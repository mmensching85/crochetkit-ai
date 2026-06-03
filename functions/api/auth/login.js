import { createToken, verifyPassword } from './utils.js';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const DB = env.CROCHETKIT_CONTACTS;
    const user = await DB.prepare('SELECT * FROM users WHERE email = ?').bind(email.toLowerCase()).first();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const token = await createToken(user.id, user.email, env.JWT_SECRET);

    return new Response(JSON.stringify({
      success: true, token,
      user: { id: user.id, email: user.email, stash: JSON.parse(user.stash || '[]'), faves: JSON.parse(user.faves || '[]'), progress: JSON.parse(user.progress || '{}') }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
