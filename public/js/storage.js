// storage.js — All localStorage helpers and data persistence
// No rendering code. Pure data: save, load, get, set.

const STASH_KEY = 'crochetkit-stash';
const FILTER_KEY = 'crochetkit-filters';
const FAVES_KEY = 'crochetkit-faves';
const DONE_KEY = 'crochetkit-done';
const USED_KEY = 'crochetkit-used';
const PROGRESS_KEY = 'crochetkit-progress';
const JOURNAL_KEY = 'crochetkit-journal';
const YARNS_KEY = 'crochetkit-yarns';

const WEIGHT_LABELS = [
  'Lace', 'Super Fine (fingering)', 'Fine (sport)', 'Light (DK)',
  'Medium (worsted)', 'Bulky (chunky)', 'Super Bulky', 'Jumbo'
];

function saveFilters() {
  const data = {
    cat: document.getElementById('catFilterCat')?.value || '',
    diff: document.getElementById('catFilterDiff')?.value || '',
    weight: document.getElementById('catFilterWeight')?.value || '',
    maxTime: document.getElementById('catFilterTime')?.value || '',
    search: document.getElementById('catFilterSearch')?.value || '',
    favesOnly: document.getElementById('catFilterFaves')?.classList.contains('active') || false,
    doneOnly: document.getElementById('catFilterDone')?.classList.contains('active') || false,
    trendingOnly: document.getElementById('catFilterTrending')?.classList.contains('active') || false,
  };
  try { localStorage.setItem(FILTER_KEY, JSON.stringify(data)); } catch(e) {}
}

function saveStash() {
  const data = {
    yarnWeightNumber: document.getElementById('yarnWeightNumber')?.value || '',
    yardageHave: document.getElementById('yardageHave')?.value || '',
    hookSizeMM: document.getElementById('hookSizeMM')?.value || '',
    hookSizeUnknown: document.getElementById('hookSizeUnknown')?.checked || false,
    minHours: document.getElementById('minHours')?.value || '',
    maxHours: document.getElementById('maxHours')?.value || '',
    difficulty: document.getElementById('difficulty')?.value || '',
    preferredCategory: document.getElementById('preferredCategory')?.value || '',
    termSystem: document.getElementById('termSystem')?.value || 'US'
  };
  try { localStorage.setItem(STASH_KEY, JSON.stringify(data)); } catch(e) {}
}

function loadStash() {
  try {
    const raw = localStorage.getItem(STASH_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.yarnWeightNumber) document.getElementById('yarnWeightNumber').value = data.yarnWeightNumber;
    if (data.yardageHave) document.getElementById('yardageHave').value = data.yardageHave;
    if (data.hookSizeMM) document.getElementById('hookSizeMM').value = data.hookSizeMM;
    document.getElementById('hookSizeUnknown').checked = data.hookSizeUnknown || false;
    if (data.minHours) document.getElementById('minHours').value = data.minHours;
    if (data.maxHours) document.getElementById('maxHours').value = data.maxHours;
    if (data.difficulty) document.getElementById('difficulty').value = data.difficulty;
    if (data.preferredCategory !== undefined) document.getElementById('preferredCategory').value = data.preferredCategory;
    if (data.termSystem) {
      document.getElementById('termSystem').value = data.termSystem;
      const hdrToggle = document.getElementById('termSystemHeader');
      if (hdrToggle) hdrToggle.value = data.termSystem;
    }
  } catch(e) {}
}

function loadFilters() {
  try {
    const raw = localStorage.getItem(FILTER_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.cat) document.getElementById('catFilterCat').value = data.cat;
    if (data.diff) document.getElementById('catFilterDiff').value = data.diff;
    if (data.weight) document.getElementById('catFilterWeight').value = data.weight;
    if (data.maxTime) document.getElementById('catFilterTime').value = data.maxTime;
    if (data.search) document.getElementById('catFilterSearch').value = data.search;
    if (data.favesOnly) document.getElementById('catFilterFaves').classList.add('active');
    if (data.doneOnly) document.getElementById('catFilterDone').classList.add('active');
    if (data.trendingOnly) document.getElementById('catFilterTrending')?.classList.add('active');
  } catch(e) {}
}

function getUsedYardage() {
  try { return JSON.parse(localStorage.getItem(USED_KEY)) || {}; } catch(e) { return {}; }
}

function saveUsedYardage(used) {
  try { localStorage.setItem(USED_KEY, JSON.stringify(used)); } catch(e) {}
}

function getFaves() {
  try { return JSON.parse(localStorage.getItem(FAVES_KEY)) || []; } catch(e) { return []; }
}

function saveFaves(faves) {
  try { localStorage.setItem(FAVES_KEY, JSON.stringify(faves)); } catch(e) {}
}

function toggleFave(id) {
  const faves = getFaves();
  const idx = faves.indexOf(id);
  let nowFaved;
  if (idx >= 0) {
    faves.splice(idx, 1);
    nowFaved = false;
  } else {
    faves.push(id);
    nowFaved = true;
  }
  saveFaves(faves);
  return nowFaved;
}

function isFaved(id) {
  return getFaves().includes(id);
}

function getDone() {
  try { return JSON.parse(localStorage.getItem(DONE_KEY)) || []; } catch(e) { return []; }
}

function saveDone(done) {
  try { localStorage.setItem(DONE_KEY, JSON.stringify(done)); } catch(e) {}
}

function markAsDone(id) {
  const done = getDone();
  if (!done.includes(id)) {
    done.push(id);
    saveDone(done);
  }
  const used = getUsedYardage();
  if (!used[id]) {
    const yds = prompt('How many yards did this project use? (optional)', '');
    if (yds !== null && yds !== '' && !isNaN(parseInt(yds))) {
      used[id] = parseInt(yds);
      saveUsedYardage(used);
    }
  }
  return true;
}

function isDone(id) {
  return getDone().includes(id);
}

function getProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; } catch(e) { return {}; }
}

function saveProgress(prog) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(prog)); } catch(e) {}
}

function getJournal() {
  try { return JSON.parse(localStorage.getItem(JOURNAL_KEY)) || []; } catch(e) { return []; }
}

function saveJournal(entries) {
  try { localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries)); } catch(e) {}
}

function addJournalEntry(project, notes, photo) {
  const entries = getJournal();
  entries.unshift({ id: project.id, title: project.title, notes: notes || '', photo: photo || '', date: new Date().toISOString().slice(0, 10) });
  saveJournal(entries);
}

function updateWeightLabel() {
  const input = document.getElementById('yarnWeightNumber');
  const label = document.getElementById('weightLabel');
  if (!input || !label) return;
  const v = parseInt(input.value, 10);
  const name = WEIGHT_LABELS[Math.min(Math.max(isNaN(v) ? 0 : v, 0), 7)] || '';
  label.textContent = name;
}

function getYarns() {
  try { return JSON.parse(localStorage.getItem(YARNS_KEY)) || []; }
  catch(e) { return []; }
}

function saveYarns(yarns) {
  try { localStorage.setItem(YARNS_KEY, JSON.stringify(yarns)); } catch(e) {}
}

function addYarn(name, weight, yardage, hook, notes, image) {
  const yarns = getYarns();
  yarns.push({ id: Date.now(), name, weight: parseInt(weight), yardage: parseInt(yardage), hook: parseFloat(hook) || null, notes, image: image || null });
  saveYarns(yarns);
  renderYarnList();
  showStashDashboard();
}

function deleteYarn(id) {
  saveYarns(getYarns().filter(y => y.id !== id));
  renderYarnList();
  showStashDashboard();
}

function renderYarnList() {
  const el = document.getElementById('yarnList');
  if (!el) return;
  const yarns = getYarns();
  if (!yarns.length) {
    el.innerHTML = '<p style="color:#888;font-size:13px;">No yarns saved yet.</p>';
    return;
  }
  el.innerHTML = yarns.map(y =>
    `<div class="yarn-item" data-id="${y.id}">
      <div class="yarn-item-info">
        <div class="yarn-item-name">${escHtml(y.name)}</div>
        <div class="yarn-item-detail">CYC ${y.weight} &middot; ${y.yardage} yds &middot; ${y.hook} mm${y.notes ? ' &middot; ' + escHtml(y.notes) : ''}</div>
      </div>
      <button class="yarn-item-delete" data-id="${y.id}" aria-label="Delete yarn">&times;</button>
    </div>`
  ).join('');

  el.querySelectorAll('.yarn-item').forEach(item => {
    item.addEventListener('click', function(e) {
      if (e.target.closest('.yarn-item-delete')) return;
      const id = parseInt(this.dataset.id);
      const yarn = getYarns().find(y => y.id === id);
      if (yarn) selectYarn(yarn);
    });
  });

  el.querySelectorAll('.yarn-item-delete').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      deleteYarn(parseInt(this.dataset.id));
    });
  });
}

function selectYarn(yarn) {
  document.getElementById('yarnWeightNumber').value = yarn.weight;
  document.getElementById('yardageHave').value = yarn.yardage;
  document.getElementById('hookSizeMM').value = (yarn.hook != null && yarn.hook !== '') ? yarn.hook : '';
  updateWeightLabel();
}

function matchYarns() {
  const yarns = getYarns();
  if (!yarns.length) {
    const err = document.getElementById('matchError');
    if (err) { err.textContent = 'Add some yarns to your stash first.'; err.style.display = 'inline'; }
    return;
  }

  const termSys = document.getElementById('termSystem').value;
  const minH = parseFloat(document.getElementById('minHours').value);
  const maxH = parseFloat(document.getElementById('maxHours').value);

  const hookCounts = {};
  yarns.forEach(y => {
    const h = y.hook;
    if (h != null && h !== '') hookCounts[h] = (hookCounts[h] || 0) + 1;
  });
  const mostCommonHook = Object.keys(hookCounts).reduce((a, b) => hookCounts[a] > hookCounts[b] ? a : b, null);

  const userInput = {
    yarns: yarns.map(y => ({ weightNumber: y.weight, yardage: y.yardage, hookSizeMM: y.hook, name: y.name })),
    yardageHave: yarns.reduce((s, y) => s + y.yardage, 0),
    hookSizeMM: mostCommonHook,
    hookSizeUnknown: false,
    timeRange: {
      minHours: isNaN(minH) ? null : minH,
      maxHours: isNaN(maxH) ? null : maxH
    },
    difficulty: document.getElementById('difficulty').value,
    preferredCategory: document.getElementById('preferredCategory').value || null,
    termSystem: termSys
  };

  currentTermSystem = termSys;
  selectedProjectIndex = null;
  saveStash();

  const err = document.getElementById('matchError');
  if (err) { err.textContent = ''; err.style.display = 'none'; }

  const output = document.getElementById('project-output');
  output.innerHTML = '<div class="skeleton-grid">' + Array(4).fill('<div class="skeleton-card"><div class="skeleton-img"></div><div class="skeleton-line"></div><div class="skeleton-line"></div><div class="skeleton-line" style="width:60%"></div></div>').join('') + '</div>';
  document.getElementById('output').style.display = 'block';

  doMatch(userInput).then(projects => {
      displayProjectCards(projects);
    }).catch(err => {
      console.error('Match error:', err);
      output.innerHTML = `<div class="error">Error: ${escHtml(err.message)}</div>`;
    });
}

function escHtml(s) {
  if (!s) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

function esc(s) { return escHtml(s); }

async function fetchWithTimeout(url, options, timeoutMs) {
  if (timeoutMs === undefined) timeoutMs = 10000;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, { ...options, signal: controller.signal });
    return resp;
  } finally {
    clearTimeout(id);
  }
}

let _patternCache = null;

async function getPatterns() {
  if (_patternCache) return _patternCache;
  const resp = await fetchWithTimeout('/data/patterns.json');
  _patternCache = await resp.json();
  return _patternCache;
}

function clearPatternCache() {
  _patternCache = null;
}

function computePreferences() {
  const faveIds = getFaves();
  const doneIds = getDone();
  const interacted = [...new Set([...faveIds, ...doneIds])];
  if (interacted.length < 3) return null;
  return { interactedIds: interacted };
}

async function doMatch(userInput) {
  const allPatterns = await getPatterns();
  const prefs = computePreferences();
  const matchResults = matchPattern(userInput, allPatterns, prefs);
  return matchResults.map(r => formatProjectOutput(r, userInput.termSystem || 'US'));
}

function dailySeed(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function setOutputHeader(text) {
  const h = document.getElementById('output-header');
  if (h) h.textContent = text;
}
