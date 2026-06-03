import { verifyToken } from './auth/utils.js';

function getUnlockedSteps(cal, now) {
  const start = new Date(cal.start_date);
  const daysSinceStart = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  const totalSteps = cal.total_steps || 1;
  if (daysSinceStart < 0) return 0;
  if (daysSinceStart >= totalSteps) return totalSteps;
  return Math.min(daysSinceStart + 1, totalSteps);
}

function getDailyUnlockDate(cal, stepNum) {
  const start = new Date(cal.start_date);
  const d = new Date(start);
  d.setDate(d.getDate() + (stepNum - 1));
  return d.toISOString().slice(0, 10);
}

export async function onRequest(context) {
  const { request, env } = context;
  const DB = env.CROCHETKIT_CONTACTS;

  await DB.prepare(`CREATE TABLE IF NOT EXISTS cals (
    id TEXT PRIMARY KEY, pattern_id TEXT, title TEXT, description TEXT, start_date TEXT,
    total_steps INTEGER, created_by TEXT, status TEXT DEFAULT 'upcoming', created_at TEXT
  )`).run();
  await DB.prepare(`CREATE TABLE IF NOT EXISTS cal_participants (
    cal_id TEXT, user_id TEXT, current_step INTEGER DEFAULT 0, joined_at TEXT,
    PRIMARY KEY (cal_id, user_id)
  )`).run();

  if (request.method === 'GET') {
    const now = new Date();
    const { results } = await DB.prepare('SELECT * FROM cals ORDER BY start_date ASC').all();
    const enriched = await Promise.all(results.map(async (cal) => {
      const { results: participants } = await DB.prepare('SELECT user_id, current_step FROM cal_participants WHERE cal_id = ?').bind(cal.id).all();
      const stepsUnlocked = getUnlockedSteps(cal, now);
      const started = participants.filter(p => p.current_step > 0).length;
      const totalParticipants = participants.length;
      const stepDistribution = {};
      participants.forEach(p => { stepDistribution[p.current_step] = (stepDistribution[p.current_step] || 0) + 1; });
      return {
        ...cal,
        stepsUnlocked,
        totalParticipants,
        startedCount: started,
        stepDistribution,
        isActive: stepsUnlocked > 0 && stepsUnlocked < cal.total_steps,
        isUpcoming: stepsUnlocked === 0,
        isCompleted: stepsUnlocked >= cal.total_steps
      };
    }));
    return new Response(JSON.stringify(enriched), { headers: { 'Content-Type': 'application/json' } });
  }

  if (request.method === 'POST') {
    const auth = request.headers.get('Authorization') || '';
    const token = auth.replace('Bearer ', '');
    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ error: 'Sign in required to join CALs' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    try {
      const { calId, action, currentStep } = await request.json();
      if (!calId) return new Response(JSON.stringify({ error: 'calId required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

      const cal = await DB.prepare('SELECT * FROM cals WHERE id = ?').bind(calId).first();
      if (!cal) return new Response(JSON.stringify({ error: 'CAL not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });

      if (action === 'join') {
        await DB.prepare('INSERT OR IGNORE INTO cal_participants (cal_id, user_id, current_step, joined_at) VALUES (?, ?, 0, ?)').bind(calId, payload.uid, new Date().toISOString()).run();
        return new Response(JSON.stringify({ success: true, message: 'Joined CAL!' }), { headers: { 'Content-Type': 'application/json' } });
      }

      if (action === 'progress') {
        if (currentStep === undefined) return new Response(JSON.stringify({ error: 'currentStep required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        const stepNum = parseInt(currentStep);
        const unlocked = getUnlockedSteps(cal, new Date());
        if (stepNum > unlocked) {
          return new Response(JSON.stringify({ error: `Step ${stepNum} unlocks on ${getDailyUnlockDate(cal, stepNum)}` }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        await DB.prepare('INSERT OR REPLACE INTO cal_participants (cal_id, user_id, current_step, joined_at) VALUES (?, ?, ?, COALESCE((SELECT joined_at FROM cal_participants WHERE cal_id = ? AND user_id = ?), ?))').bind(calId, payload.uid, stepNum, calId, payload.uid, new Date().toISOString()).run();
        return new Response(JSON.stringify({ success: true, currentStep: stepNum }), { headers: { 'Content-Type': 'application/json' } });
      }

      return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
}
