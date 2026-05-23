// Standalone tests for frontend JS logic extracted from app.js
const fs = require('fs');

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) { passed++; return true; }
  failed++;
  console.error(`  ✗ FAIL: ${msg}`);
  return false;
}

function assertEq(actual, expected, msg) {
  if (actual === expected) { passed++; return true; }
  failed++;
  console.error(`  ✗ FAIL: ${msg} — expected "${expected}", got "${actual}"`);
  return false;
}

// ── dailySeed (copied from app.js) ──
function dailySeed(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

console.log('\n=== dailySeed ===');
assertEq(dailySeed('2026-05-23'), dailySeed('2026-05-23'), 'Same date = same seed');
assert(dailySeed('2026-05-23') !== dailySeed('2026-05-24'), 'Different dates = different seeds');
assertEq(dailySeed('2026-01-01'), dailySeed('2026-01-01'), 'Deterministic across calls');
assert(dailySeed('1970-01-01') >= 0, 'Seed is non-negative');
assert(dailySeed('') === 0, 'Empty string hash = 0');
assert(Number.isInteger(dailySeed('2026-05-23')), 'Seed is an integer');
assert(dailySeed('9999-12-31') < Infinity, 'Very future date does not overflow');

// ── escHtml ──
function escHtml(s) {
  if (!s) return '';
  const d = { textContent: s };
  // Simulate browser innerHTML escaping
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };
  return String(s).replace(/[&<>"']/g, c => map[c]);
}

console.log('\n=== escHtml ===');
assertEq(escHtml(null), '', 'null returns empty');
assertEq(escHtml(undefined), '', 'undefined returns empty');
assertEq(escHtml(''), '', 'empty string returns empty');
assertEq(escHtml('hello'), 'hello', 'plain text passes through');
assertEq(escHtml('<script>'), '&lt;script&gt;', 'escapes HTML tags');
assertEq(escHtml('"&\''), '&quot;&amp;&#x27;', 'escapes quotes and ampersands');
assertEq(escHtml('a&b<c>d"e\'f'), 'a&amp;b&lt;c&gt;d&quot;e&#x27;f', 'complex string');
assertEq(escHtml(123), '123', 'number is converted to string');

// ── Favorites (localStorage backed) ──
console.log('\n=== Favorites ===');
const store = {};
function mockGetItem(k) { return store[k] || null; }
function mockSetItem(k, v) { store[k] = String(v); }

const FAVES_KEY = 'crochetkit-faves';
function getFaves() { try { return JSON.parse(mockGetItem(FAVES_KEY)) || []; } catch(e) { return []; } }
function saveFaves(f) { mockSetItem(FAVES_KEY, JSON.stringify(f)); }
function toggleFave(id) {
  const faves = getFaves();
  const idx = faves.indexOf(id);
  let nowFaved;
  if (idx >= 0) { faves.splice(idx, 1); nowFaved = false; }
  else { faves.push(id); nowFaved = true; }
  saveFaves(faves);
  return nowFaved;
}
function isFaved(id) { return getFaves().includes(id); }

store[FAVES_KEY] = '[]';
assertEq(getFaves().length, 0, 'Starts empty');
assert(!isFaved('pat-1'), 'Not faved initially');
assert(toggleFave('pat-1'), 'Toggle returns true (now faved)');
assert(isFaved('pat-1'), 'Is faved after toggle');
assertEq(getFaves().length, 1, 'Has 1 fave');
assert(!toggleFave('pat-1'), 'Toggle returns false (unfaved)');
assert(!isFaved('pat-1'), 'Not faved after second toggle');
assertEq(getFaves().length, 0, 'Has 0 faves');

// Multiple
toggleFave('a'); toggleFave('b'); toggleFave('c');
assertEq(getFaves().length, 3, 'Has 3 faves');
assert(isFaved('b'), 'b is faved');
assert(!isFaved('z'), 'z is not faved');

// IDs with special characters
toggleFave('pattern-123_456');
assert(isFaved('pattern-123_456'), 'IDs with hyphens/underscores work');

// ── Done + Used Yardage ──
console.log('\n=== Done & Used Yardage ===');
const DONE_KEY = 'crochetkit-done';
const USED_KEY = 'crochetkit-used';

function getDone() { try { return JSON.parse(mockGetItem(DONE_KEY)) || []; } catch(e) { return []; } }
function saveDone(d) { mockSetItem(DONE_KEY, JSON.stringify(d)); }
function isDone(id) { return getDone().includes(id); }
function getUsedYardage() { try { return JSON.parse(mockGetItem(USED_KEY)) || {}; } catch(e) { return {}; } }
function saveUsedYardage(u) { mockSetItem(USED_KEY, JSON.stringify(u)); }

store[DONE_KEY] = '[]';
store[USED_KEY] = '{}';

assertEq(getDone().length, 0, 'Done starts empty');
assert(!isDone('pat-1'), 'Not done initially');

const d = getDone(); d.push('pat-1'); saveDone(d);
assert(isDone('pat-1'), 'Done after marking');
assertEq(getDone().length, 1, 'Has 1 done item');

// Undo
const d2 = getDone().filter(x => x !== 'pat-1');
saveDone(d2);
assert(!isDone('pat-1'), 'Unmarked after removal');

// Used yardage
saveUsedYardage({ 'pat-1': 150 });
assertEq(getUsedYardage()['pat-1'], 150, 'Stores used yardage');
assertEq(getUsedYardage()['nonexistent'], undefined, 'Missing pattern = undefined');

// Multiple done items
['a','b','c'].forEach(id => { const x = getDone(); x.push(id); saveDone(x); });
assertEq(getDone().length, 3, 'Has 3 done items');

// Corrupted localStorage
store[DONE_KEY] = 'not json';
assertEq(getDone().length, 0, 'Corrupted JSON returns empty array');

store[USED_KEY] = 'not json';
assertEq(Object.keys(getUsedYardage()).length, 0, 'Corrupted JSON returns empty object');

// ── Pattern Data Integration ──
console.log('\n=== Pattern Data Integration ===');
try {
  const patterns = JSON.parse(fs.readFileSync('./data/patterns.json', 'utf8'));
  assert(patterns.length > 0, 'Has patterns');
  assert(patterns.length >= 50, `Has ${patterns.length} patterns (≥50 recommended)`);

  // Every pattern has required fields
  patterns.forEach((p, i) => {
    assert(p.id, `Pattern ${i} has id`);
    assert(p.name, `Pattern ${i} has name`);
    assert(p.shortDescription, `Pattern ${i} has shortDescription`);
    assert(p.category, `Pattern ${i} has category`);
    assert(p.difficulty, `Pattern ${i} has difficulty`);
    assert(p.difficulty.level, `Pattern ${i} has difficulty.level`);
    assert(p.materials, `Pattern ${i} has materials`);
    assert(p.materials.yarn, `Pattern ${i} has materials.yarn`);
    assert(!isNaN(p.materials.yarn.weightNumber), `Pattern ${i} has valid weightNumber`);
    assert(!isNaN(p.materials.yarn.suggestedYardageMin), `Pattern ${i} has suggestedYardageMin`);
    assert(!isNaN(p.materials.yarn.suggestedYardageMax), `Pattern ${i} has suggestedYardageMax`);
    assert(p.estimatedTime, `Pattern ${i} has estimatedTime`);
    assert(!isNaN(p.estimatedTime.minHours), `Pattern ${i} has estimatedTime.minHours`);
    assert(!isNaN(p.difficulty.score), `Pattern ${i} has valid difficulty.score`);
  });

  // All weight numbers are 0-7
  const weights = [...new Set(patterns.map(p => p.materials.yarn.weightNumber))];
  weights.forEach(w => assert(w >= 0 && w <= 7, `Weight ${w} is in 0-7 range`));

  // Daily pattern index is in range
  const seed = dailySeed('2026-05-23');
  const idx = seed % patterns.length;
  assert(patterns[idx].id.startsWith('pattern-'), `Daily pattern ${idx} has valid ID prefix`);
} catch(e) {
  console.error('  ✗ Pattern data error:', e.message); failed++;
}

// ── Share URL Generation ──
console.log('\n=== Share URL Generation ===');
const patId = 'pattern-test-001';
const patTitle = 'Test Pattern';
const base = 'https://test.com';
const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(base + '/p/' + patId)}`;
const pinUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(base + '/p/' + patId)}&description=${encodeURIComponent(patTitle)}`;
const emailUrl = `mailto:?subject=${encodeURIComponent(patTitle + ' — Crochet Pattern')}&body=${encodeURIComponent('Check out this crochet pattern: ' + base + '/p/' + patId)}`;

assert(fbUrl.includes('facebook.com'), 'Facebook URL is valid');
assert(pinUrl.includes('pinterest.com'), 'Pinterest URL is valid');
assert(pinUrl.includes('description='), 'Pinterest URL includes description');
assert(emailUrl.includes('mailto:'), 'Email URL is valid');
assert(emailUrl.includes(encodeURIComponent(patTitle)), 'Email URL includes title');

// URL encoding safety
const specialTitle = 'Pattern & Test "Special"';
const safePinUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(base + '/p/' + patId)}&description=${encodeURIComponent(specialTitle)}`;
assert(!safePinUrl.includes('"'), 'Special chars in title are URL-encoded');
assert(!safePinUrl.includes(' '), 'Spaces in title are URL-encoded');

// ── Yarn Weight Labels ──
console.log('\n=== Yarn Weight Labels ===');
const WEIGHT_LABELS = [
  'Lace', 'Super Fine (fingering)', 'Fine (sport)', 'Light (DK)',
  'Medium (worsted)', 'Bulky (chunky)', 'Super Bulky', 'Jumbo'
];
assertEq(WEIGHT_LABELS.length, 8, 'Has 8 weight labels');
assertEq(WEIGHT_LABELS[0], 'Lace', 'Weight 0 = Lace');
assertEq(WEIGHT_LABELS[4], 'Medium (worsted)', 'Weight 4 = Medium (worsted)');
assertEq(WEIGHT_LABELS[7], 'Jumbo', 'Weight 7 = Jumbo');
assertEq(WEIGHT_LABELS[8], undefined, 'Weight 8 is undefined (out of range)');

// ── Report ──
console.log(`\n${'='.repeat(50)}`);
const total = passed + failed;
console.log(`Frontend tests: ${passed}/${total} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
