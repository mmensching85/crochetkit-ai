export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'crochetkit-salt');
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password, hash) {
  const hashed = await hashPassword(password);
  return hashed === hash;
}

export async function createToken(userId, email, secret) {
  const key = secret || 'dev-jwt-secret';
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = { uid: userId, email, exp: Math.floor(Date.now() / 1000) + 604800 };
  const enc = (obj) => btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const h = enc(header);
  const p = enc(payload);
  const sig = enc(key + '.' + h + '.' + p);
  return `${h}.${p}.${sig}`;
}

export function verifyToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp < Date.now() / 1000) return null;
    return payload;
  } catch { return null; }
}
