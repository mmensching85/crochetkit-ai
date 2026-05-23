// Frontend logic for Crochet Project Planner
let glossaryData = {};
let currentTermSystem = 'US';
let outputElement, selectedProjectIndex;

function showToast(message, type) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast-visible'));
  setTimeout(() => {
    toast.classList.remove('toast-visible');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function getCurrentGlossary() {
  const g = {};
  for (const [term, defs] of Object.entries(glossaryData)) {
    if (typeof defs === 'string') {
      g[term] = defs;
    } else if (typeof defs === 'object') {
      g[term] = defs[currentTermSystem === 'UK' ? 'uk' : 'us'] || defs.us || defs;
    }
  }
  return g;
}

function getGlossaryKeys() {
  return Object.keys(getCurrentGlossary()).sort((a, b) => b.length - a.length);
}

function linkifyGlossaryTerms(text) {
  if (!text) return text;
  const g = getCurrentGlossary();
  const keys = Object.keys(g).sort((a, b) => b.length - a.length);
  const tokens = text.split(/(<[^>]+>)/);
  return tokens.map((token, i) => {
    if (i % 2 === 1) return token;
    keys.forEach(term => {
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedTerm})`, 'gi');
      token = token.replace(regex, (match) => {
        const definition = g[term.toLowerCase()] || g[term];
        return `<span class="glossary-term" title="${escHtml(definition)}">${match}</span>`;
      });
    });
    return token;
  }).join('');
}

function convertStitchName(name, system) {
  if (system === 'US' || !name) return name;
  const abbrMap = { 'sc': 'dc', 'hdc': 'htr', 'dc': 'tr', 'tr': 'dtr' };
  const fullMap = {
    'single crochet (sc)': 'double crochet (dc)',
    'half double crochet (hdc)': 'half treble (htr)',
    'double crochet (dc)': 'treble (tr)',
    'treble crochet (tr)': 'double treble (dtr)',
  };
  return fullMap[name.toLowerCase()] || name.replace(/\b(hdc|dc|sc|tr|ch|sl st)\b/g, m => abbrMap[m] || m);
}

const STASH_KEY = 'crochetkit-stash';
const FILTER_KEY = 'crochetkit-filters';

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
    if (data.termSystem) document.getElementById('termSystem').value = data.termSystem;
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

async function renderWhatsNew() {
  const container = document.getElementById('whatsNewPatterns');
  if (!container) return;

  try {
    const allPatterns = await getPatterns();

    // Show the last 3 patterns in the list (most recently added)
    const newPatterns = allPatterns.slice(-3).reverse();

    if (newPatterns.length === 0) {
      document.getElementById('whatsNewSection').style.display = 'none';
      return;
    }

    container.innerHTML = newPatterns.map(p => `
      <div class="pattern-card">
        <div class="pattern-image-container">
          <img src="${p.imageUrl || `/assets/patterns/${p.id}.webp`}" alt="${escHtml(p.name || '')}" loading="lazy" onerror="this.parentElement.style.display='none'">
        </div>
        <div class="pattern-info">
          <h3>${escHtml(p.name || '')}</h3>
          <p class="category">${escHtml(p.category || '')}</p>
          <p class="difficulty">${escHtml((p.difficulty?.level || '').toUpperCase())}</p>
          <button class="btn btn-outline btn-small view-pattern-btn" data-id="${escHtml(p.id)}">View Pattern</button>
        </div>
      </div>
    `).join('');

    // Attach event listeners to buttons
    container.querySelectorAll('.view-pattern-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const raw = allPatterns.find(pat => pat.id === btn.dataset.id);
        if (raw) {
          const formatted = formatProjectOutput({ matchedPattern: raw, materialGap: { yardage: { status: 'enough' }, hook: { status: 'have' } } }, currentTermSystem);
          const allFormatted = allPatterns.map(p => formatProjectOutput({ matchedPattern: p, materialGap: { yardage: { status: 'enough' }, hook: { status: 'have' } } }, currentTermSystem));
          showProjectDetail(formatted, null, allFormatted);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  } catch (err) {
    console.error('Error rendering What\'s New section:', err);
    document.getElementById('whatsNewSection').style.display = 'none';
  }
}

const FAVES_KEY = 'crochetkit-faves';
const DONE_KEY = 'crochetkit-done';

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
  return true;
}

function isDone(id) {
  return getDone().includes(id);
}

const WEIGHT_LABELS = [
  'Lace', 'Super Fine (fingering)', 'Fine (sport)', 'Light (DK)',
  'Medium (worsted)', 'Bulky (chunky)', 'Super Bulky', 'Jumbo'
];

function updateWeightLabel() {
  const input = document.getElementById('yarnWeightNumber');
  const label = document.getElementById('weightLabel');
  if (!input || !label) return;
  const v = parseInt(input.value, 10);
  const name = WEIGHT_LABELS[Math.min(Math.max(isNaN(v) ? 0 : v, 0), 7)] || '';
  label.textContent = name;
}

const YARNS_KEY = 'crochetkit-yarns';

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
}

function deleteYarn(id) {
  saveYarns(getYarns().filter(y => y.id !== id));
  renderYarnList();
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
      output.innerHTML = `<div class="error">Error: ${err.message}</div>`;
    });
}

function escHtml(s) {
  if (!s) return '';
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

let _patternCache = null;

async function getPatterns() {
  if (_patternCache) return _patternCache;
  const resp = await fetch('/data/patterns.json');
  _patternCache = await resp.json();
  return _patternCache;
}

function clearPatternCache() {
  _patternCache = null;
}

async function doMatch(userInput) {
  const allPatterns = await getPatterns();
  const matchResults = matchPattern(userInput, allPatterns);
  return matchResults.map(r => formatProjectOutput(r, userInput.termSystem || 'US'));
}

function renderStashMatch(match) {
  const el = document.getElementById('stashMatchContent');
  if (!el) return;

  if (!match.patternWeight) {
    el.innerHTML = '<p style="color:#888;font-size:13px;">This pattern has no weight data.</p>';
    return;
  }

  const indiv = match.individualMatches || [];
  if (indiv.length === 0) {
    el.innerHTML = '<p style="color:#888;font-size:13px;">No yarns in stash to check.</p>';
    return;
  }

  const cm = match.combinedMatch;
  const weightLabel = ['Lace','Super Fine','Fine','Light','Medium','Bulky','Super Bulky','Jumbo'][match.patternWeight] || '';

  let html = `<p style="font-size:13px;color:#aaa;">Pattern uses <strong>weight ${match.patternWeight} (${weightLabel})</strong>, needs <strong>${match.minYardage}-${match.maxYardage} yds</strong>.</p>`;
  html += `<p style="font-size:13px;${cm.enough ? 'color:#4caf50;' : 'color:#ff9800;'}">${escHtml(cm.reason)}</p>`;

  html += '<div class="stash-match-list">';
  indiv.forEach(m => {
    const status = m.overall ? 'match-yes' : 'match-no';
    const statusIcon = m.overall ? '✓' : '✗';
    const wOk = m.weightMatch;
    const yOk = m.yardageMatch;
    const reason = [];
    if (!wOk) reason.push(`weight ${m.yarn.weight} (needs ±1 of ${match.patternWeight})`);
    if (wOk && !yOk) reason.push(`only ${m.yarn.yardage} yds (needs ${match.minYardage})`);

    html += `<div class="stash-match-item ${status}">
      <span class="stash-match-icon">${statusIcon}</span>
      <span class="stash-match-name">${escHtml(m.yarn.name)}</span>
      <span class="stash-match-detail">CYC ${m.yarn.weight} &middot; ${m.yarn.yardage} yds</span>
      ${reason.length ? `<span class="stash-match-reason">${escHtml(reason.join('; '))}</span>` : ''}
    </div>`;
  });
  html += '</div>';

  el.innerHTML = html;
}

function setOutputHeader(text) {
  const h = document.getElementById('output-header');
  if (h) h.textContent = text;
}

function showStashGallery() {
  const output = document.getElementById('project-output');
  const outputCard = document.getElementById('output');
  outputCard.style.display = 'block';
  setOutputHeader('My Stash Gallery');

  const yarns = getYarns();
  if (!yarns.length) {
    output.innerHTML = '<div class="card"><h2>My Stash Gallery</h2><p style="text-align:center;color:#888;padding:40px;">No yarns in your stash yet.</p><p style="text-align:center;color:#888;">Use the My Yarns section above to add yarns, then view them here.</p></div>';
    return;
  }

  const weightNames = ['Lace','Super Fine','Fine','Light','Medium','Bulky','Super Bulky','Jumbo'];
  const weightColors = ['#c8a8e8','#a8c8e8','#a8e8c8','#e8d8a8','#e8b8a8','#e8a8b8','#b8a8e8','#d0d0d0'];

  function renderGallery(filtered, filterWeight, filterSearch) {
    let html = `<div class="catalog-count">${filtered.length} of ${yarns.length} yarns</div>`;
    html += '<div class="catalog-filters">';
    html += `<select id="galleryFilterWeight"><option value="">Any weight</option>${weightNames.map((n, i) => `<option value="${i}" ${filterWeight === String(i) ? 'selected' : ''}>${i} — ${n}</option>`).join('')}</select>`;
    html += `<input type="text" id="galleryFilterSearch" placeholder="Search name..." value="${escHtml(filterSearch)}">`;
    html += '</div>';
    html += '<div class="stash-gallery">';

    filtered.forEach(y => {
      const wName = weightNames[y.weight] || `Weight ${y.weight}`;
      const color = weightColors[y.weight] || '#ccc';
      html += `<div class="stash-card" data-id="${y.id}">`;
      if (y.image) {
        html += `<div class="stash-card-img"><img src="${y.image}" alt="${escHtml(y.name)}" loading="lazy"></div>`;
      } else {
        html += `<div class="stash-card-placeholder" style="background:${color};"><span class="stash-card-weight-badge">CYC ${y.weight}</span></div>`;
      }
      html += `<div class="stash-card-body">
        <div class="stash-card-name">${escHtml(y.name)}</div>
        <div class="stash-card-detail">${wName} &middot; ${y.yardage} yds${y.hook ? ' &middot; ' + y.hook + ' mm' : ''}</div>
        ${y.notes ? `<div class="stash-card-notes">${escHtml(y.notes)}</div>` : ''}
        <button class="stash-card-delete" data-id="${y.id}" title="Delete yarn">&times;</button>
      </div></div>`;
    });

    html += '</div>';
    output.innerHTML = html;

    document.getElementById('galleryFilterWeight').addEventListener('change', () => {
      galleryFilter();
    });
    document.getElementById('galleryFilterSearch').addEventListener('input', () => {
      galleryFilter();
    });

    output.querySelectorAll('.stash-card-delete').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const id = parseInt(this.dataset.id);
        if (confirm('Delete this yarn from your stash?')) {
          deleteYarn(id);
          showStashGallery();
        }
      });
    });

    function galleryFilter() {
      const w = document.getElementById('galleryFilterWeight').value;
      const s = document.getElementById('galleryFilterSearch').value.toLowerCase().trim();
      const f = yarns.filter(y => {
        if (w && y.weight !== parseInt(w)) return false;
        if (s && !y.name.toLowerCase().includes(s) && !(y.notes || '').toLowerCase().includes(s)) return false;
        return true;
      });
      renderGallery(f, w, s);
    }
  }

  renderGallery(yarns, '', '');
}

const SHARE_BASE = window.location.origin;

function shareUrl(id, title) {
  const url = SHARE_BASE + '/p/' + id;
  return {
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url),
    pinterest: 'https://pinterest.com/pin/create/button/?url=' + encodeURIComponent(url) + '&description=' + encodeURIComponent(title),
    email: 'mailto:?subject=' + encodeURIComponent(title + ' — Crochet Pattern') + '&body=' + encodeURIComponent('Check out this crochet pattern: ' + url),
    url: url,
    title: title
  };
}

function copyShareLink(id) {
  const url = SHARE_BASE + '/p/' + id;
  if (navigator.share) {
    navigator.share({ title: 'Crochet Pattern', url: url }).catch(() => {});
    return;
  }
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => showToast('Link copied!', 'success')).catch(() => {});
  } else {
    const ta = document.createElement('textarea');
    ta.value = url;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Link copied!', 'success');
  }
}

function renderShareBtns(id, title) {
  const links = shareUrl(id, title);
  return `<div class="share-btns">
    <a href="${links.facebook}" target="_blank" rel="noopener noreferrer" class="share-btn share-fb" title="Share on Facebook">f</a>
    <a href="${links.pinterest}" target="_blank" rel="noopener noreferrer" class="share-btn share-pin" title="Pin on Pinterest">P</a>
    <a href="${links.email}" class="share-btn share-email" title="Share via email">@</a>
    <button class="share-btn share-copy" title="Copy link" onclick="copyShareLink('${id}')">🔗</button>
  </div>`;
}

function trackPopular(patternId, action) {
  try {
    navigator.sendBeacon('/api/track-popular', JSON.stringify({ patternId, action }));
  } catch(e) {}
}

function initDarkMode() {
  let saved;
  try { saved = localStorage.getItem('crochetkit-dark'); } catch(e) {}
  if (saved === 'true' || (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    const btn = document.getElementById('darkToggle');
    if (btn) btn.innerHTML = '&#9790;';
  }
}

function toggleDark() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  if (isDark) {
    html.removeAttribute('data-theme');
    try { localStorage.setItem('crochetkit-dark', 'false'); } catch(e) {}
  } else {
    html.setAttribute('data-theme', 'dark');
    try { localStorage.setItem('crochetkit-dark', 'true'); } catch(e) {}
  }
  const btn = document.getElementById('darkToggle');
  if (btn) btn.innerHTML = '&#9790;';
}

function initWelcomeBanner() {
  const banner = document.getElementById('welcomeBanner');
  if (!banner) return;
  try {
    if (localStorage.getItem('crochetkit-welcome-dismissed')) {
      banner.style.display = 'none';
      return;
    }
  } catch(e) {}
  document.getElementById('dismissWelcome').addEventListener('click', dismissWelcome);
  document.getElementById('dismissWelcomeX').addEventListener('click', dismissWelcome);
  function dismissWelcome() {
    banner.style.display = 'none';
    try { localStorage.setItem('crochetkit-welcome-dismissed', 'true'); } catch(e) {}
  }
}

function loadGlossaryData() {
  fetch('/glossary.json')
    .then(r => r.json())
    .then(data => { glossaryData = data; })
    .catch(() => {});
}

function initMobileNav() {
  const toggle = document.getElementById('headerNavToggle');
  const nav = document.getElementById('headerExtraNav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', function(e) {
    e.stopPropagation();
    nav.classList.toggle('mobile-open');
  });
  document.addEventListener('click', function() {
    nav.classList.remove('mobile-open');
  });
  nav.addEventListener('click', function(e) {
    e.stopPropagation();
  });
}

function showCatalog() {
  const output = document.getElementById('project-output');
  const outputCard = document.getElementById('output');
  outputCard.style.display = 'block';
  setOutputHeader('Pattern Catalog');

  output.innerHTML = '<div class="skeleton-grid">' + Array(6).fill('<div class="skeleton-card"><div class="skeleton-img"></div><div class="skeleton-line"></div><div class="skeleton-line"></div><div class="skeleton-line" style="width:60%"></div></div>').join('') + '</div>';

  getPatterns().then(patterns => {
      let catalogPage = 1;

      // Build the filter UI once — reused across re-renders
      function buildFilterHtml() {
        let h = '<div class="catalog-filters">';
        h += `<select id="catFilterCat"><option value="">All categories</option>${[...new Set(patterns.map(p => p.category))].sort().map(c => `<option value="${escHtml(c)}">${escHtml(c)}</option>`).join('')}</select>`;
        h += `<select id="catFilterDiff"><option value="">All levels</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select>`;
        h += `<select id="catFilterWeight"><option value="">Any weight</option>${[...new Set(patterns.map(p => p.materials?.yarn?.weightNumber).filter(w => w != null).sort((a,b) => a-b))].map(w => `<option value="${w}">${w} — ${['Lace','Super Fine','Fine','Light','Medium','Bulky','Super Bulky','Jumbo'][w] || ''}</option>`).join('')}</select>`;
        h += `<input type="number" id="catFilterTime" placeholder="Max hours" min="0" step="0.5">`;
        h += `<input type="text" id="catFilterSearch" placeholder="Search by name...">`;
        h += `<button class="btn btn-sm btn-outline" id="catFilterFaves">♥ Favorites</button>`;
        h += `<button class="btn btn-sm btn-outline" id="catFilterDone">✓ Done</button>`;
        h += `<!-- Trending filter removed: requires backend -->`;
        h += `</div>`;
        return h;
      }

      function render(pats, showDoneWarning = false) {
        const perPage = 12;
        const pageCount = Math.ceil(pats.length / perPage);
        if (catalogPage > pageCount) catalogPage = Math.max(1, pageCount);
        const start = (catalogPage - 1) * perPage;
        // Only process the current page slice — avoids freezing on 207 patterns
        const pagePats = pats.slice(start, start + perPage);

        if (pagePats.length === 0 && !showDoneWarning) {
          output.innerHTML = '<div class="error">🧶 No patterns yet. Start by adding some patterns to the database.</div>';
          return;
        }

        let html = `<div class="catalog-count">Showing ${pagePats.length} of ${pats.length} patterns`;
        if (pageCount > 1) html += ` &middot; Page ${catalogPage} of ${pageCount}`;
        html += `</div>`;
        html += buildFilterHtml();
        html += '<div class="project-cards">';

        if (showDoneWarning && pats.length === 0) {
          html += '<div class="empty-state"><h3>No patterns match your filters</h3><p>Try adjusting the filters above — change category, difficulty, or search term.</p></div>';
        }

        pagePats.forEach((p, i) => {
          const title = escHtml(p.name);
          const fvd = isFaved(p.id) ? 'faved' : '';
          const doneSt = isDone(p.id) ? 'done-st' : '';
          const wNum = p.materials?.yarn?.weightNumber;
          const wLabel = wNum != null ? `${wNum} (${['Lace','Super Fine','Fine','Light','Medium','Bulky','Super Bulky','Jumbo'][wNum] || ''})` : '';
          const estTime = p.estimatedTime ? `${p.estimatedTime.minHours}-${p.estimatedTime.maxHours} ${p.estimatedTime.unit || 'hours'}` : '';
          html += `<div class="project-card ${doneSt}" data-catalog-idx="${i}">`;
          html += `<div class="card-hero"><img src="/assets/patterns/${p.id}.webp" alt="${escHtml(p.name)}" class="card-hero-img" loading="lazy" onerror="this.parentElement.style.display='none'"></div>`;
          html += `<h3>${title}</h3>`;
          if (isDone(p.id)) html += `<span class="done-badge">✓ Done</span>`;
          html += `<p class="card-desc">${escHtml(p.shortDescription)}</p>`;
          html += `<p><strong>Category:</strong> ${escHtml(p.category)} &middot; <strong>Level:</strong> ${escHtml(p.difficulty?.level || '')}</p>`;
          html += `<p><strong>Time:</strong> ${escHtml(estTime)}${wLabel ? ` &middot; <strong>Weight:</strong> ${wLabel}` : ''}</p>`;
          html += `<div class="card-actions">`;
          html += `<button class="btn btn-outline btn-sm catalog-select" data-idx="${i}">Select</button>`;
          html += `<button class="btn btn-success btn-sm catalog-pdf" data-idx="${i}">PDF</button>`;
          html += `<button class="fav-btn ${fvd}" data-id="${p.id}" title="${isFaved(p.id) ? 'Remove from favorites' : 'Add to favorites'}">${isFaved(p.id) ? '♥' : '♡'}</button>`;
          html += `${renderShareBtns(p.id, p.name)}`;
          html += `</div></div>`;
        });

        html += '</div>';

        if (pageCount > 1) {
          html += '<div class="pagination">';
          html += `<button class="btn btn-sm btn-outline pagination-prev" ${catalogPage <= 1 ? 'disabled' : ''}>← Previous</button>`;
          html += `<span class="pagination-info">Page ${catalogPage} of ${pageCount}</span>`;
          html += `<button class="btn btn-sm btn-outline pagination-next" ${catalogPage >= pageCount ? 'disabled' : ''}>Next →</button>`;
          html += '</div>';
        }

        output.innerHTML = html;

        const prevBtn = output.querySelector('.pagination-prev');
        const nextBtn = output.querySelector('.pagination-next');
        if (prevBtn) prevBtn.addEventListener('click', () => { catalogPage--; render(pats, showDoneWarning); });
        if (nextBtn) nextBtn.addEventListener('click', () => { catalogPage++; render(pats, showDoneWarning); });

        document.querySelectorAll('.catalog-select').forEach(btn => {
          btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.idx);
            trackPopular(pats[idx].id, 'select');
            // Format raw pattern into the shape showProjectDetail expects
            const formatted = formatProjectOutput({ matchedPattern: pats[idx], materialGap: { yardage: { status: 'enough' }, hook: { status: 'have' } } }, currentTermSystem);
            showProjectDetail(formatted, idx, pats.map(p => formatProjectOutput({ matchedPattern: p, materialGap: { yardage: { status: 'enough' }, hook: { status: 'have' } } }, currentTermSystem)));
          });
        });

        document.querySelectorAll('.catalog-pdf').forEach(btn => {
          btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.idx);
            trackPopular(pats[idx].id, 'pdf');
            const formatted = formatProjectOutput({ matchedPattern: pats[idx], materialGap: { yardage: { status: 'enough' }, hook: { status: 'have' } } }, currentTermSystem);
            printProject(formatted);
          });
        });

        document.querySelectorAll('.fav-btn').forEach(btn => {
          btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = this.dataset.id;
            const nowFaved = toggleFave(id);
            this.classList.toggle('faved', nowFaved);
            this.title = nowFaved ? 'Remove from favorites' : 'Add to favorites';
            this.textContent = nowFaved ? '♥' : '♡';
            showToast(nowFaved ? 'Added to favorites' : 'Removed from favorites', nowFaved ? 'success' : 'info');
          });
        });

        document.getElementById('catFilterCat').addEventListener('change', filterCatalog);
        document.getElementById('catFilterDiff').addEventListener('change', filterCatalog);
        document.getElementById('catFilterWeight').addEventListener('change', filterCatalog);
        document.getElementById('catFilterTime').addEventListener('input', filterCatalog);
        document.getElementById('catFilterSearch').addEventListener('input', filterCatalog);
        document.getElementById('catFilterFaves').addEventListener('click', function() {
          this.classList.toggle('active');
          filterCatalog();
          saveFilters(); // Save filters after click
        });
        document.getElementById('catFilterDone').addEventListener('click', function() {
          this.classList.toggle('active');
          filterCatalog();
          saveFilters(); // Save filters after click
        });
        const trendingBtn = document.getElementById('catFilterTrending');
        if (trendingBtn) {
          trendingBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            filterCatalog();
            saveFilters(); // Save filters after click
          });
        }

        function filterCatalog() {
          catalogPage = 1;
          saveFilters(); // Save filters whenever they change
          const cat = document.getElementById('catFilterCat').value;
          const diff = document.getElementById('catFilterDiff').value;
          const weight = document.getElementById('catFilterWeight').value;
          const maxTime = parseFloat(document.getElementById('catFilterTime').value);
          const search = document.getElementById('catFilterSearch').value.toLowerCase().trim();
          const favesOnly = document.getElementById('catFilterFaves').classList.contains('active');
          const doneOnly = document.getElementById('catFilterDone').classList.contains('active');
          const trendingOnly = document.getElementById('catFilterTrending')?.classList.contains('active');
          const faveIds = getFaves();
          const doneIds = getDone();
          const filtered = patterns.filter(p => {
            if (cat && p.category !== cat) return false;
            if (diff && p.difficulty?.level !== diff) return false;
            if (weight && p.materials?.yarn?.weightNumber !== parseInt(weight)) return false;
            if (maxTime && p.estimatedTime?.minHours > maxTime) return false;
            if (search && !(p.name || '').toLowerCase().includes(search) && !(p.shortDescription || '').toLowerCase().includes(search)) return false;
            if (favesOnly && !faveIds.includes(p.id)) return false;
            if (doneOnly && !doneIds.includes(p.id)) return false;
            return true;
          });
          render(filtered, true);
        }
      }
      render(patterns);
    })
    .catch(err => {
      console.error('Fetch error:', err);
      output.innerHTML = `<div class="error">Error loading patterns: ${err.message}</div>`;
    });
}

function showFullCatalog() {
  showCatalog();
  const catFilterCat = document.getElementById('catFilterCat');
  const catFilterDiff = document.getElementById('catFilterDiff');
  const catFilterWeight = document.getElementById('catFilterWeight');
  const catFilterTime = document.getElementById('catFilterTime');
  const catFilterSearch = document.getElementById('catFilterSearch');
  const catFilterFaves = document.getElementById('catFilterFaves');
  const catFilterDone = document.getElementById('catFilterDone');
  const catFilterTrending = document.getElementById('catFilterTrending');

  if (catFilterCat) catFilterCat.value = '';
  if (catFilterDiff) catFilterDiff.value = '';
  if (catFilterWeight) catFilterWeight.value = '';
  if (catFilterTime) catFilterTime.value = '';
  if (catFilterSearch) catFilterSearch.value = '';
  if (catFilterFaves) catFilterFaves.classList.remove('active');
  if (catFilterDone) catFilterDone.classList.remove('active');
  if (catFilterTrending) catFilterTrending.classList.remove('active');
  if (catFilterTrending) catFilterTrending.style.display = 'none';

  const catFilterCatSelect = document.getElementById('catFilterCat');
  const catFilterWeightSelect = document.getElementById('catFilterWeight');

  if (catFilterCatSelect) {
    catFilterCatSelect.dispatchEvent(new Event('change'));
  }
}

function showMyFaves() {
  const output = document.getElementById('project-output');
  const outputCard = document.getElementById('output');
  outputCard.style.display = 'block';
  setOutputHeader('My Favorites');

  const faveIds = getFaves();

  if (faveIds.length === 0) {
    output.innerHTML = '<div class="empty-state"><h3>No favorites yet</h3><p>Browse patterns and click the ♡ button to save your favorites here.</p><button class="btn btn-primary" onclick="showCatalog()" style="margin:20px auto;display:block;">Browse Patterns</button></div>';
    return;
  }

  output.innerHTML = '<div class="skeleton-grid">' + Array(3).fill('<div class="skeleton-card"><div class="skeleton-img"></div><div class="skeleton-line"></div><div class="skeleton-line"></div><div class="skeleton-line" style="width:60%"></div></div>').join('') + '</div>';

  getPatterns().then(patterns => {
      const faves = patterns.filter(p => faveIds.includes(p.id));
      let html = `<div class="catalog-count">${faves.length} favorited pattern${faves.length !== 1 ? 's' : ''}</div>`;
      html += '<div class="project-cards">';

      const favesFormatted = faves.map(p => formatProjectOutput({ matchedPattern: p, materialGap: { yardage: { status: 'enough' }, hook: { status: 'have' } } }, currentTermSystem));

      faves.forEach((p, i) => {
        const f = favesFormatted[i];
        const fvd = isFaved(p.id) ? 'faved' : '';
        const doneSt = isDone(p.id) ? 'done-st' : '';
        const estTime = p.estimatedTime ? `${p.estimatedTime.minHours}-${p.estimatedTime.maxHours} ${p.estimatedTime.unit || 'hours'}` : '';
        html += `<div class="project-card ${doneSt}" data-index="${i}">`;
        html += `<div class="card-hero"><img src="/assets/patterns/${p.id}.webp" alt="${escHtml(p.name)}" class="card-hero-img" loading="lazy" onerror="this.parentElement.style.display='none'"></div>`;
        html += `<h3>${escHtml(p.name)}</h3>`;
        if (isDone(p.id)) html += `<span class="done-badge">✓ Done</span>`;
        html += `<p class="card-desc">${escHtml(p.shortDescription)}</p>`;
        html += `<p><strong>Category:</strong> ${escHtml(p.category)} &middot; <strong>Level:</strong> ${escHtml(p.difficulty?.level || '')}</p>`;
        html += `<p><strong>Time:</strong> ${escHtml(estTime)}</p>`;
        html += `<div class="card-actions">`;
        html += `<button class="btn btn-outline btn-sm select-project" data-index="${i}">Select</button>`;
        html += `<button class="btn btn-success btn-sm download-pdf-card" data-index="${i}">PDF</button>`;
        html += `<button class="fav-btn ${fvd}" data-id="${p.id}">♥</button>`;
        html += `${renderShareBtns(p.id, p.name)}`;
        html += `</div></div>`;
      });

      html += '</div>';
      output.innerHTML = html;

      document.querySelectorAll('.select-project').forEach(btn => {
        btn.addEventListener('click', function() {
          const idx = parseInt(this.dataset.index);
          trackPopular(faves[idx].id, 'select');
          showProjectDetail(favesFormatted[idx], idx, favesFormatted);
        });
      });

      document.querySelectorAll('.download-pdf-card').forEach(btn => {
        btn.addEventListener('click', function() {
          const idx = parseInt(this.dataset.index);
          printProject(favesFormatted[idx]);
        });
      });

      document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          const id = this.dataset.id;
          const wasFaved = getFaves().includes(id);
          toggleFave(id);
          showToast(wasFaved ? 'Removed from favorites' : 'Added to favorites', wasFaved ? 'info' : 'success');
          if (!getFaves().includes(id)) {
            showMyFaves();
          }
        });
      });
    })
    .catch(err => {
      console.error('Fetch error:', err);
      output.innerHTML = `<div class="error">Error: ${err.message}</div>`;
    });
}

function showMyDone() {
  const output = document.getElementById('project-output');
  const outputCard = document.getElementById('output');
  outputCard.style.display = 'block';
  setOutputHeader('Completed Projects');

  const doneIds = getDone();

  if (doneIds.length === 0) {
    output.innerHTML = '<div class="empty-state"><h3>No completed projects yet</h3><p>When you finish a project, click "Mark as Done" to track it here.</p><button class="btn btn-primary" onclick="showCatalog()" style="margin:20px auto;display:block;">Browse Patterns</button></div>';
    return;
  }

  output.innerHTML = '<div class="skeleton-grid">' + Array(3).fill('<div class="skeleton-card"><div class="skeleton-img"></div><div class="skeleton-line"></div><div class="skeleton-line"></div><div class="skeleton-line" style="width:60%"></div></div>').join('') + '</div>';

  getPatterns().then(patterns => {
      const done = patterns.filter(p => doneIds.includes(p.id));
      let html = `<div class="catalog-count">${done.length} completed project${done.length !== 1 ? 's' : ''}</div>`;
      html += '<div class="project-cards">';

      const doneFormatted = done.map(p => formatProjectOutput({ matchedPattern: p, materialGap: { yardage: { status: 'enough' }, hook: { status: 'have' } } }, currentTermSystem));

      done.forEach((p, i) => {
        const estTime = p.estimatedTime ? `${p.estimatedTime.minHours}-${p.estimatedTime.maxHours} ${p.estimatedTime.unit || 'hours'}` : '';
        html += `<div class="project-card done-st" data-index="${i}">`;
        html += `<div class="card-hero"><img src="/assets/patterns/${p.id}.webp" alt="${escHtml(p.name)}" class="card-hero-img" loading="lazy" onerror="this.parentElement.style.display='none'"></div>`;
        html += `<h3>${escHtml(p.name)}</h3>`;
        html += `<span class="done-badge">✓ Done</span>`;
        html += `<p class="card-desc">${escHtml(p.shortDescription)}</p>`;
        html += `<p><strong>Category:</strong> ${escHtml(p.category)} &middot; <strong>Level:</strong> ${escHtml(p.difficulty?.level || '')}</p>`;
        html += `<p><strong>Time:</strong> ${escHtml(estTime)}</p>`;
        html += `<div class="card-actions">`;
        html += `<button class="btn btn-outline btn-sm select-project" data-index="${i}">View</button>`;
        html += `<button class="btn btn-secondary btn-sm undo-done-btn" data-id="${p.id}">↩ Undo</button>`;
        html += `${renderShareBtns(p.id, p.name)}`;
        html += `</div></div>`;
      });

      html += '</div>';
      output.innerHTML = html;

      document.querySelectorAll('.select-project').forEach(btn => {
        btn.addEventListener('click', function() {
          const idx = parseInt(this.dataset.index);
          showProjectDetail(doneFormatted[idx], idx, doneFormatted);
        });
      });

      document.querySelectorAll('.undo-done-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          const id = this.dataset.id;
          const done = getDone().filter(d => d !== id);
          saveDone(done);
          showMyDone();
        });
      });
    })
    .catch(err => {
      console.error('Fetch error:', err);
      output.innerHTML = `<div class="error">Error: ${err.message}</div>`;
    });
}

function printProject(project) {
    const system = currentTermSystem;
    const g = getCurrentGlossary();
    const gKeys = Object.keys(g).sort((a, b) => b.length - a.length);

    function linkify(text) {
        if (!text) return text;
        let r = text;
        gKeys.forEach(term => {
            const re = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
            r = r.replace(re, '<span class="glossary-term">$1</span>');
        });
        return r;
    }

    function esc(text) {
        const d = document.createElement('div');
        d.textContent = text;
        return d.innerHTML;
    }

    function stepsHtml(steps) {
        return steps.map((s, i) => {
            let h = `<li><strong>${linkify(esc(s.instruction))}</strong>`;
            if (s.tip) h += ` <em>(${esc(s.tip)})</em>`;
            if (s.visual_description && s.visual_description !== "(No specific visual guidance for this step, focus on the written instruction.)") {
                h += `<p class="visual-desc">${esc(s.visual_description)}</p>`;
            }
            h += `</li>`;
            return h;
        }).join('');
    }

    function glossaryHtml() {
        return Object.entries(g).map(([term, def]) =>
            `<li><strong>${esc(term)}</strong> — ${esc(def)}</li>`
        ).join('');
    }

    const missingLabel = project.missing_materials && project.missing_materials.length > 0
        ? `<h2 style="color:#e74c3c;">Missing Materials</h2><ul>${project.missing_materials.map(m => `<li>${linkify(esc(m))}</li>`).join('')}</ul>`
        : '';

    const tipsLabel = project.tips_label || (project.skill_level === 'beginner' ? 'Beginner Tips' : 'Tips');
    const tipsHtml = project.beginner_tips && project.beginner_tips.length > 0
        ? `<h2>${tipsLabel}</h2><ul>${project.beginner_tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`
        : '';

    const variationsHtml = project.variations && project.variations.length > 0
        ? `<h2>Variations</h2><ul>${project.variations.map(v => `<li>${esc(v)}</li>`).join('')}</ul>`
        : '';

    const safetyHtml = project.safety_notes && project.safety_notes.length > 0
        ? `<h2>Safety Notes</h2><ul>${project.safety_notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul>`
        : '';

    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${esc(project.title)} — Crochet Project</title>
<style>
  body { font-family: Georgia, 'Times New Roman', serif; color: #222; line-height: 1.7; max-width: 700px; margin: 0 auto; padding: 20px; }
  h1 { font-size: 24px; border-bottom: 3px double #8e44ad; padding-bottom: 8px; }
  h2 { font-size: 18px; color: #8e44ad; margin-top: 24px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
  ul, ol { margin: 4px 0 16px 20px; padding: 0; }
  li { margin-bottom: 6px; }
  .meta { background: #f9f0ff; padding: 12px 16px; border-radius: 6px; margin: 12px 0; }
  .meta strong { color: #555; }
  .glossary-term { color: #8e44ad; text-decoration: underline dotted; }
  .visual-desc { font-style: italic; color: #666; margin: 4px 0 0 12px; padding-left: 8px; border-left: 2px solid #8e44ad; }
  .summary { background: #f0f4ff; padding: 12px 16px; border-radius: 6px; border-left: 4px solid #8e44ad; margin: 16px 0; }
  .glossary { margin-top: 32px; padding-top: 16px; border-top: 2px solid #8e44ad; font-size: 14px; }
  .glossary li { margin-bottom: 4px; }
  .footer { text-align: center; color: #999; font-size: 12px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 12px; }
  .stitch-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .stitch-list li { background: #f5f5f5; padding: 2px 8px; border-radius: 4px; list-style: none; }
  @media print { body { padding: 0; } .no-print { display: none; } }
</style></head><body>
  <h1>${linkify(esc(project.title))}</h1>
  <p style="font-size:16px;color:#666;">${linkify(esc(project.description))}</p>
  <div class="meta">
    <strong>Skill Level:</strong> ${esc(project.skill_level)} &middot;
    <strong>Estimated Time:</strong> ${esc(project.estimated_time)} &middot;
    <strong>Difficulty:</strong> ${linkify(esc(project.difficulty_reason))}
  </div>
  <h2>Materials</h2>
  <ul>${project.materials.map(m => `<li>${linkify(esc(m))}</li>`).join('')}</ul>
  ${missingLabel}
  <h2>Stitches Used</h2>
  <ul class="stitch-list">${project.stitches_used.map(s => `<li>${convertStitchName(linkify(esc(s)), system)}</li>`).join('')}</ul>
  <h2>Instructions</h2>
  <ol>${stepsHtml(project.steps)}</ol>
  ${tipsHtml}
  ${variationsHtml}
  ${safetyHtml}
  <div class="summary">${project.printable_summary}</div>
  <div class="glossary"><h2>Glossary of Crochet Terms</h2><ul>${glossaryHtml()}</ul></div>
  <div class="footer no-print">Generated by CrochetKit AI</div>
  <script>window.onload=function(){window.print();window.close();}<\/script>
</body></html>`;

    try {
      const w = window.open('', '_blank', 'width=800,height=600');
      if (!w) { alert('Popup blocked. Please allow popups for this site to use the PDF feature.'); return; }
      w.document.write(html);
      w.document.close();
    } catch (e) {
      alert('Could not open PDF. Please disable popup blocker and try again.');
    }
}

document.addEventListener('DOMContentLoaded', async function() {
  outputElement = document.getElementById('project-output');
  try {

    document.getElementById('yarnWeightNumber').addEventListener('input', updateWeightLabel);
    loadFilters(); // Load filters on initial page load
    renderYarnList();
    initWelcomeBanner();
    loadGlossaryData();
    initMobileNav();
    document.getElementById('darkToggle').addEventListener('click', toggleDark);
    document.getElementById('browseAllBtn').addEventListener('click', showCatalog);
    document.getElementById('fullCatalogBtn').addEventListener('click', showFullCatalog);
    const accountLink = document.getElementById('accountLink');
    if (accountLink) {
      accountLink.addEventListener('click', function(e) {
        e.preventDefault();
      });
    }

    document.getElementById('matchYarnsBtn').addEventListener('click', matchYarns);
    document.getElementById('viewStashBtn').addEventListener('click', showStashGallery);

    // Surprise me button

    document.getElementById('saveYarnBtn').addEventListener('click', function() {
      const name = document.getElementById('yarnName').value.trim();
      const errEl = document.getElementById('yarnFormError');
      if (!name) { if (errEl) errEl.textContent = 'Please enter a yarn name.'; return; }
      if (errEl) errEl.textContent = '';
      addYarn(
        name,
        document.getElementById('yarnWeight').value,
        document.getElementById('yarnYardage').value,
        document.getElementById('yarnHook').value,
        document.getElementById('yarnNotes').value.trim()
      );
      document.getElementById('yarnName').value = '';
      document.getElementById('yarnNotes').value = '';
      document.querySelector('.yarn-add-form').removeAttribute('open');
    });
    // Quick-add from label photo
    document.getElementById('scanLabelBtn').addEventListener('click', function() {
      document.getElementById('labelPhotoInput').click();
    });

    document.getElementById('labelPhotoInput').addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(ev) {
        document.getElementById('labelPreview').src = ev.target.result;
        document.getElementById('quickAddPanel').style.display = 'block';
        document.getElementById('qaName').focus();
      };
      reader.readAsDataURL(file);
    });

    // Weight → hook preset
    const WEIGHT_HOOKS = { 0: 2.25, 1: 3.5, 2: 4.0, 3: 4.5, 4: 5.5, 5: 6.5, 6: 9.0, 7: 12.0 };
    document.getElementById('qaWeight').addEventListener('change', function() {
      const hook = WEIGHT_HOOKS[parseInt(this.value)];
      if (hook) document.getElementById('qaHook').value = hook;
    });

    // Yardage presets
    document.querySelectorAll('.qa-preset-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.getElementById('qaYardage').value = this.dataset.yds;
      });
    });

    // Quick-add save
    document.getElementById('qaSaveBtn').addEventListener('click', function() {
      const name = document.getElementById('qaName').value.trim();
      const weight = document.getElementById('qaWeight').value;
      const yardage = document.getElementById('qaYardage').value;
      const qaErr = document.getElementById('qaFormError');
      if (!name) { if (qaErr) qaErr.textContent = 'Please enter a yarn name.'; return; }
      if (!weight) { if (qaErr) qaErr.textContent = 'Please select a yarn weight.'; return; }
      if (!yardage) { if (qaErr) qaErr.textContent = 'Please enter yardage or use a preset.'; return; }
      if (qaErr) qaErr.textContent = '';
      const imgSrc = document.getElementById('labelPreview').src || null;
      addYarn(name, weight, yardage, document.getElementById('qaHook').value || '', document.getElementById('qaNotes').value.trim(), imgSrc);
      // Reset quick-add
      document.getElementById('quickAddPanel').style.display = 'none';
      document.getElementById('labelPhotoInput').value = '';
      document.getElementById('labelPreview').src = '';
      document.getElementById('qaName').value = '';
      document.getElementById('qaWeight').value = '4';
      document.getElementById('qaYardage').value = '';
      document.getElementById('qaHook').value = '';
      document.getElementById('qaNotes').value = '';
    });

    // Quick-add cancel
      document.getElementById('qaCancelBtn').addEventListener('click', function() {
      document.getElementById('quickAddPanel').style.display = 'none';
      const qaErr = document.getElementById('qaFormError');
      if (qaErr) qaErr.textContent = '';
      document.getElementById('labelPhotoInput').value = '';
      document.getElementById('labelPreview').src = '';
    });

    document.addEventListener('click', function(e) {
      const popup = document.getElementById('weightPopup');
      const btn = document.getElementById('weightHelpBtn');
      if (e.target === btn) {
        popup.classList.toggle('visible');
      } else if (popup && popup.classList.contains('visible')) {
        popup.classList.remove('visible');
      }
    });

    const form = document.getElementById('project-form');
    outputElement = document.getElementById('project-output');
    let currentUserInput = null;
    selectedProjectIndex = null;

    // Term system toggle
    document.getElementById('termSystem').addEventListener('change', function() {
      currentTermSystem = this.value;
      // Re-render if there are projects displayed
      if (currentUserInput && outputElement.innerHTML) {
        form.dispatchEvent(new Event('submit'));
      }
    });

    // Gauge calculator tabs
    document.querySelectorAll('.gauge-tab').forEach(tab => {
      tab.addEventListener('click', function() {
        document.querySelectorAll('.gauge-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.gauge-panel').forEach(p => p.classList.remove('active'));
        document.getElementById('gauge-panel-' + this.dataset.mode).classList.add('active');
        document.getElementById('gauge-result').style.display = 'none';
      });
    });

    // Measure gauge button
    document.getElementById('calc-gauge-btn').addEventListener('click', function() {
      const sts = parseFloat(document.getElementById('gStitches').value);
      const rows = parseFloat(document.getElementById('gRows').value);
      const width = parseFloat(document.getElementById('gWidth').value);
      const height = parseFloat(document.getElementById('gHeight').value);

      if (!sts || !rows || !width || !height) {
        document.getElementById('gauge-result').innerHTML = '<div class="error">Please fill in all fields.</div>';
        document.getElementById('gauge-result').style.display = 'block';
        return;
      }

      const stsPer4 = (sts / width * 4).toFixed(1);
      const rowsPer4 = (rows / height * 4).toFixed(1);

      document.getElementById('gauge-result').innerHTML = `
        <div class="summary-box">
          <p><strong>Your Gauge:</strong> ${stsPer4} stitches and ${rowsPer4} rows per 4 inches</p>
          <p>${parseFloat(stsPer4).toFixed(0)} sts &times; ${parseFloat(rowsPer4).toFixed(0)} rows = 4 in square</p>
        </div>`;
      document.getElementById('gauge-result').style.display = 'block';
    });

    // Calculate stitches button
    document.getElementById('calc-stitches-btn').addEventListener('click', function() {
      const patSts = parseFloat(document.getElementById('gPatternSts').value);
      const patRows = parseFloat(document.getElementById('gPatternRows').value);
      const dWidth = parseFloat(document.getElementById('gDesiredWidth').value);
      const dHeight = parseFloat(document.getElementById('gDesiredHeight').value);

      if (!patSts || !patRows || !dWidth || !dHeight) {
        document.getElementById('gauge-result').innerHTML = '<div class="error">Please fill in all fields.</div>';
        document.getElementById('gauge-result').style.display = 'block';
        return;
      }

      const neededSts = Math.round(patSts / 4 * dWidth);
      const neededRows = Math.round(patRows / 4 * dHeight);

      document.getElementById('gauge-result').innerHTML = `
        <div class="summary-box">
          <p><strong>You Need:</strong> ${neededSts} stitches wide and ${neededRows} rows tall</p>
          <p>For a ${dWidth} in wide by ${dHeight} in tall piece at ${patSts} sts &times; ${patRows} rows per 4 in gauge</p>
        </div>`;
      document.getElementById('gauge-result').style.display = 'block';
    });

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const termSys = document.getElementById('termSystem').value;

        const yarnWeight = parseInt(document.getElementById('yarnWeightNumber').value);
        const yardage = parseInt(document.getElementById('yardageHave').value);
        const minH = parseFloat(document.getElementById('minHours').value);
        const maxH = parseFloat(document.getElementById('maxHours').value);

        if (isNaN(yarnWeight) || yarnWeight < 0 || yarnWeight > 7) {
            outputElement.innerHTML = '<div class="error-message">Please select a valid yarn weight (0–7).</div>';
            document.getElementById('output').style.display = 'block';
            return;
        }
        if (isNaN(yardage) || yardage < 0) {
            outputElement.innerHTML = '<div class="error-message">Please enter a valid yardage amount.</div>';
            document.getElementById('output').style.display = 'block';
            return;
        }
        if (isNaN(minH) || isNaN(maxH) || minH > maxH || minH < 0) {
            outputElement.innerHTML = '<div class="error-message">Please enter valid time range (min ≤ max, and at least 0).</div>';
            document.getElementById('output').style.display = 'block';
            return;
        }

        currentUserInput = {
            yarnWeightNumber: yarnWeight,
            yardageHave: yardage,
            hookSizeMM: document.getElementById('hookSizeMM').value ? parseFloat(document.getElementById('hookSizeMM').value) : null,
            hookSizeUnknown: document.getElementById('hookSizeUnknown').checked,
            timeRange: {
                minHours: minH,
                maxHours: maxH
            },
            difficulty: document.getElementById('difficulty').value,
            preferredCategory: document.getElementById('preferredCategory').value || null,
            termSystem: termSys
        };

        currentTermSystem = termSys;
        selectedProjectIndex = null;
        saveStash();

        try {
            outputElement.innerHTML = '<div class="skeleton-grid">' + Array(4).fill('<div class="skeleton-card"><div class="skeleton-img"></div><div class="skeleton-line"></div><div class="skeleton-line"></div><div class="skeleton-line" style="width:60%"></div></div>').join('') + '</div>';
            const outputCard = document.getElementById('output');
            outputCard.style.display = 'block';
            setTimeout(() => outputCard.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);

            const projects = await doMatch(currentUserInput);
            displayProjectCards(projects);

        } catch (error) {
            console.error('Error:', error);
            outputElement.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        }
    });

    document.getElementById('surpriseBtn').addEventListener('click', async function() {
        const termSys = document.getElementById('termSystem').value;
        const yw = parseInt(document.getElementById('yarnWeightNumber').value);
        const yd = parseInt(document.getElementById('yardageHave').value);
        const minH = parseFloat(document.getElementById('minHours').value);
        const maxH = parseFloat(document.getElementById('maxHours').value);

        if (isNaN(yw) || yw < 0 || yw > 7) {
            outputElement.innerHTML = '<div class="error-message">Please select a valid yarn weight (0–7).</div>';
            document.getElementById('output').style.display = 'block';
            return;
        }
        if (isNaN(yd) || yd < 0) {
            outputElement.innerHTML = '<div class="error-message">Please enter a valid yardage amount.</div>';
            document.getElementById('output').style.display = 'block';
            return;
        }
        if (isNaN(minH) || isNaN(maxH) || minH > maxH || minH < 0) {
            outputElement.innerHTML = '<div class="error-message">Please enter valid time range (min ≤ max).</div>';
            document.getElementById('output').style.display = 'block';
            return;
        }

        currentTermSystem = termSys;
        currentUserInput = {
            yarnWeightNumber: yw,
            yardageHave: yd,
            hookSizeMM: document.getElementById('hookSizeMM').value ? parseFloat(document.getElementById('hookSizeMM').value) : null,
            hookSizeUnknown: document.getElementById('hookSizeUnknown').checked,
            timeRange: { minHours: minH, maxHours: maxH },
            difficulty: document.getElementById('difficulty').value,
            preferredCategory: document.getElementById('preferredCategory').value || null,
            termSystem: termSys
        };

        try {
            outputElement.innerHTML = '<div class="loading">Finding a surprise project...</div>';
            const surpriseOutputCard = document.getElementById('output');
            surpriseOutputCard.style.display = 'block';
            setTimeout(() => surpriseOutputCard.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);

            let projects = await doMatch(currentUserInput);
            // Filter out done patterns
            const doneIds = getDone();
            const undone = projects.filter(p => !doneIds.includes(p.id));
            if (undone.length > 0) {
                projects = undone;
            }
            if (projects.length === 0) {
                outputElement.innerHTML = '<div class="error">No matching projects found. Try different filter criteria.</div>';
                showToast('No matches — try adjusting your filters', 'info');
                return;
            }
            showToast(`Found ${projects.length} matching project${projects.length !== 1 ? 's' : ''}!`, 'success');
            const pick = projects[Math.floor(Math.random() * projects.length)];
            const idx = projects.indexOf(pick);
            displayProjectCards(projects);
            showProjectDetail(pick, idx, projects);

        } catch (error) {
            console.error('Error:', error);
            const output = document.getElementById('project-output');
            if (output) output.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        }
    });

        } catch (error) {
            console.error('Error:', error);
            outputElement.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        }
    });

// displayProjectCards is intentionally in global scope so matchYarns() and other
// top-level callers can reach it. Do NOT move it back inside DOMContentLoaded.
function displayProjectCards(projects) {
    setOutputHeader('Suggested Projects');
    if (!projects || !projects.length) {
      document.getElementById('project-output').innerHTML = '<div class="empty-state"><h3>No matching projects</h3><p>Try different materials or filters.</p></div>';
      document.getElementById('output').style.display = 'block';
      return;
    }
    const doneIds = getDone();
    const hasDone = projects.some(p => doneIds.includes(p.id));

    const existingCheck = document.getElementById('hideDoneResults');
    const hideDone = existingCheck ? existingCheck.checked : true;

    let html = '';
    if (hasDone) {
        html += `<div style="text-align:center;margin-bottom:12px;"><label style="font-size:14px;color:#888;cursor:pointer;"><input type="checkbox" id="hideDoneResults" ${hideDone ? 'checked' : ''}> Hide completed projects</label></div>`;
    }
    const filteredProjects = (hasDone && hideDone) ? projects.filter(p => !doneIds.includes(p.id)) : projects;

    if (filteredProjects.length === 0) {
      if (outputElement) {
        const isHideDone = hasDone && hideDone && projects.filter(p => !doneIds.includes(p.id)).length === 0 && projects.length > 0;
        outputElement.innerHTML = isHideDone ? `<div class="empty-state">
          <h3>All projects completed!</h3>
          <p>You've marked all matching projects as done. Uncheck "Hide completed" above to see them again, or find new projects with different materials.</p>
        </div>` : `<div class="empty-state">
          <h3>No matching projects found</h3>
          <p>Try relaxing your filters — loosen your yardage, expand the time range, or try a different category.</p>
          <button class="btn btn-primary" id="resetFiltersBtn">Reset Filters</button>
        </div>`;
        if (!isHideDone) {
          document.getElementById('resetFiltersBtn')?.addEventListener('click', function() {
            document.getElementById('difficulty').value = '';
            document.getElementById('preferredCategory').value = '';
            document.getElementById('minHours').value = '1';
            document.getElementById('maxHours').value = '3';
            document.getElementById('output').style.display = 'none';
          });
        }
      }
      return;
    }

    html += '<div class="project-cards">';
    filteredProjects.forEach((project, index) => {
        const title = escHtml(project.title);
        const stitches = project.stitches_used.map(s => convertStitchName(s, currentTermSystem)).join(', ');
        const fvd = isFaved(project.id) ? 'faved' : '';
        html += `<div class="project-card" data-index="${index}">`;
        html += `<div class="card-hero"><img src="/assets/patterns/${project.id}.webp" alt="${escHtml(project.title)}" class="card-hero-img" loading="lazy" onerror="this.parentElement.style.display='none'"></div>`;
        html += `<h3>${title}</h3>`;
        html += `<p class="card-desc">${project.description}</p>`;
        html += `<p><strong>Time:</strong> ${project.estimated_time}</p>`;
        if (project.matchedYarns && project.matchedYarns.length > 0) {
          html += `<p><strong>Matched yarns:</strong> ${project.matchedYarns.join(', ')}</p>`;
        }
        html += `<p><strong>Stitches:</strong> ${stitches}</p>`;
        html += `<div class="card-actions">`;
        html += `<button class="btn btn-outline btn-sm select-project" data-index="${index}">Select</button>`;
        html += `<button class="btn btn-success btn-sm download-pdf-card" data-index="${index}">PDF</button>`;
        html += `<button class="fav-btn ${fvd}" data-id="${project.id}" title="${isFaved(project.id) ? 'Remove from favorites' : 'Add to favorites'}">${isFaved(project.id) ? '♥' : '♡'}</button>`;
        html += `${renderShareBtns(project.id, project.title)}`;
        html += `</div></div>`;
    });
    html += '</div>';

    if (outputElement) {
        outputElement.innerHTML = html;
        const outputCard = document.getElementById('output');
        if (outputCard) setTimeout(() => outputCard.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }

    document.querySelectorAll('.select-project').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-index'));
            selectedProjectIndex = idx;
            trackPopular(filteredProjects[idx].id, 'select');
            showProjectDetail(filteredProjects[idx], idx, filteredProjects);
        });
    });

    document.querySelectorAll('.download-pdf-card').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-index'));
            trackPopular(filteredProjects[idx].id, 'pdf');
            printProject(filteredProjects[idx]);
        });
    });

    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = this.dataset.id;
            const nowFaved = toggleFave(id);
            this.classList.toggle('faved', nowFaved);
            this.title = nowFaved ? 'Remove from favorites' : 'Add to favorites';
            this.textContent = nowFaved ? '♥' : '♡';
            showToast(nowFaved ? 'Added to favorites' : 'Removed from favorites', nowFaved ? 'success' : 'info');
        });
    });

    // Hide completed toggle
    const hideCheck = document.getElementById('hideDoneResults');
    if (hideCheck) {
        hideCheck.addEventListener('change', function() {
            displayProjectCards(projects);
        });
    }
}

async function showReverseMatch(patternId) {
  const yarns = getYarns();
  if (!yarns || yarns.length === 0) {
    document.getElementById('stashMatchContent').innerHTML = '<p style="color:#888;font-size:13px;">No yarns in your stash to check.</p>';
    return;
  }

  try {
    const allPatterns = await getPatterns();
    const pattern = allPatterns.find(p => String(p.id) === String(patternId));
    if (!pattern) throw new Error('Pattern not found');
    const data = reverseMatch(pattern, yarns);
    renderStashMatch(data);
  } catch (error) {
    console.error('Error fetching reverse match:', error);
    document.getElementById('stashMatchContent').innerHTML = '<p style="color:#e74c3c;font-size:13px;">Error checking yarn matches.</p>';
  }
}

async function showProgressTracker(patternId) {
  const token = localStorage.getItem('authToken');
  if (!token) {
    // Skip progress tracking for non-authenticated users
    return;
  }

  try {
    const response = await fetch(`/api/progress-tracker/${patternId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch progress');
    }

    const data = await response.json();
    const progress = data.progress;

    // Create progress tracker UI
    const stepsContainer = document.querySelector('.project-detail ol');
    if (!stepsContainer) return;

    // Add progress checkboxes to each step
    const steps = stepsContainer.querySelectorAll('li');
    steps.forEach((step, index) => {
      const stepNum = index + 1;
      const isCompleted = progress.completedSteps.includes(stepNum);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `step-${stepNum}`;
      checkbox.checked = isCompleted;
      checkbox.className = 'step-checkbox';
      checkbox.dataset.step = stepNum;

      const label = document.createElement('label');
      label.htmlFor = `step-${stepNum}`;
      label.textContent = `Step ${stepNum} ${isCompleted ? '✓' : ''}`;

      const wrapper = document.createElement('div');
      wrapper.className = 'step-progress';
      wrapper.appendChild(checkbox);
      wrapper.appendChild(label);

      step.prepend(wrapper);
    });

    // Add event listeners to checkboxes
    document.querySelectorAll('.step-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', async function() {
        const stepNum = parseInt(this.dataset.step);
        const isChecked = this.checked;

        // Update UI immediately for better UX
        const label = this.nextElementSibling;
        label.textContent = `Step ${stepNum} ${isChecked ? '✓' : ''}`;

        // Get current completed steps
        const checkboxes = document.querySelectorAll('.step-checkbox');
        const completedSteps = Array.from(checkboxes)
          .filter(cb => cb.checked)
          .map(cb => parseInt(cb.dataset.step));

        // Save progress to server
        try {
          const saveResponse = await fetch('/api/progress-tracker', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              patternId,
              completedSteps
            })
          });

          if (!saveResponse.ok) {
            throw new Error('Failed to save progress');
          }
        } catch (error) {
          console.error('Error saving progress:', error);
          // Revert UI change if save fails
          this.checked = !isChecked;
          label.textContent = `Step ${stepNum} ${!isChecked ? '✓' : ''}`;
          alert('Failed to save progress. Please try again.');
        }
      });
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    // Silently fail - progress tracking is optional
  }
}

async function showCertificate(patternId) {
  const token = localStorage.getItem('authToken');
  if (!token) {
    showToast('Sign in to get a completion certificate', 'info');
    return;
  }

  try {
    const response = await fetch('/api/generate-certificate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ patternId })
    });

    if (!response.ok) {
      throw new Error('Failed to generate certificate');
    }

    const data = await response.json();
    const certificateHtml = data.certificate;

    // Open certificate in a new window
    const w = window.open('', '_blank', 'width=800,height=600');
    if (!w) {
      alert('Popup blocked. Please allow popups for this site to view your certificate.');
      return;
    }
    w.document.write(certificateHtml);
    w.document.close();
  } catch (error) {
    console.error('Error generating certificate:', error);
    alert('Failed to generate certificate. Please try again.');
  }
}

function renderDetailHTML(project, index) {
  const ts = currentTermSystem;
  const convert = (text) => convertStitchName(linkifyGlossaryTerms(text), ts);

  let html = `<div class="project-detail" data-index="${index}">`;
  html += `<div class="detail-top-bar"><button class="btn btn-secondary back-btn back-to-cards">Back</button><button class="btn btn-success btn-sm detail-pdf-btn">PDF</button>${renderShareBtns(project.id, project.title)}</div>`;

    const fvd = isFaved(project.id) ? 'faved' : '';
  const doneSt = isDone(project.id);
  html += `<div class="detail-header"><h2>${convert(project.title)} (${project.skill_level})</h2>`;
  html += `<div class="detail-actions">`;
  html += `<button class="fav-btn fav-btn-lg ${fvd}" data-id="${project.id}" title="${isFaved(project.id) ? 'Remove from favorites' : 'Add to favorites'}">${isFaved(project.id) ? '♥' : '♡'}</button>`;
  html += `<button class="btn btn-secondary btn-sm mark-done-btn" data-id="${project.id}" style="display:${doneSt ? 'none' : 'inline-block'}">✓ Mark as Done</button>`;
  html += `<span class="done-badge done-badge-lg done-badge-toggle" data-id="${project.id}" style="cursor:pointer;display:${doneSt ? 'inline' : 'none'}" title="Click to undo">✓ Done</span>`;
  html += `</div></div>`;
  html += `<div class="detail-hero"><img src="/assets/patterns/${project.id}.webp" alt="${escHtml(project.title)}" class="detail-hero-img" loading="lazy" onerror="this.parentElement.style.display='none'"></div>`;
  html += `<p>${escHtml(project.description)}</p>`;
  html += `<p><strong>Estimated Time:</strong> ${escHtml(project.estimated_time)}</p>`;
  html += `<p><strong>Difficulty Reason:</strong> ${convert(project.difficulty_reason)}</p>`;

  html += `<h4>Materials:</h4><ul>`;
  project.materials.forEach(mat => {
    html += `<li>${linkifyGlossaryTerms(mat)}</li>`;
  });
  html += `</ul>`;
  html += '<p class="affiliate-links"><small><a href="https://www.amazon.com/s?k=crochet+yarn+hooks" target="_blank" rel="noopener noreferrer">Shop yarn and hooks on Amazon</a></small></p>';

  if (project.missing_materials && project.missing_materials.length > 0) {
    html += `<h4>Missing Materials:</h4><ul class="missing-materials">`;
    project.missing_materials.forEach(mat => {
      html += `<li>${linkifyGlossaryTerms(mat)}</li>`;
    });
    html += `</ul>`;
  }

  html += `<h4>Stitches Used:</h4><ul>`;
  project.stitches_used.forEach(stitch => {
    html += `<li>${convert(stitch)}</li>`;
  });
  html += `</ul>`;

  html += `<h4>Steps:</h4><ol>`;
  project.steps.forEach((step, stepIdx) => {
    const stepNum = stepIdx + 1;
    html += `<li><strong>${convert(step.instruction)}</strong>`;
    if (step.tip) html += ` <span class="tip">(${escHtml(step.tip)})</span>`;
    if (step.visual_description && step.visual_description !== "(No specific visual guidance for this step, focus on the written instruction.)") {
      html += `<p class="visual-desc"><em>Visual:</em> ${escHtml(step.visual_description)}</p>`;
    }
    html += `<div class="step-image"><img src="/assets/patterns/${project.id}/step-${stepNum}.webp" alt="Step ${stepNum} illustration" loading="lazy" onerror="this.parentElement.style.display='none'"></div>`;
    html += `</li>`;
  });
  html += `</ol>`;

  if (project.beginner_tips && project.beginner_tips.length > 0) {
    const tipsLabel = escHtml(project.tips_label || (project.skill_level === 'beginner' ? 'Beginner Tips' : 'Tips'));
    html += `<h4>${tipsLabel}:</h4><ul>`;
    project.beginner_tips.forEach(tip => html += `<li>${escHtml(tip)}</li>`);
    html += `</ul>`;
  }

  if (project.variations && project.variations.length > 0) {
    html += `<h4>Variations:</h4><ul>`;
    project.variations.forEach(variation => html += `<li>${escHtml(variation)}</li>`);
    html += `</ul>`;
  }

  if (project.safety_notes && project.safety_notes.length > 0) {
    html += `<h4>Safety Notes:</h4><ul>`;
    project.safety_notes.forEach(note => html += `<li>${escHtml(note)}</li>`);
    html += `</ul>`;
  }

  html += `<div class="summary-box"><p>${escHtml(project.printable_summary)}</p></div>`;

  html += `<details class="glossary-section"><summary><h4>Glossary of Crochet Terms</h4></summary><ul>`;
  const g = getCurrentGlossary();
  Object.entries(g).forEach(([term, def]) => {
    html += `<li><strong>${term}</strong> — ${def}</li>`;
  });
  html += `</ul></details>`;

  html += `<div id="stashMatchSection" class="stash-match-section"><h4>My Stash Match</h4><div id="stashMatchContent"><span class="loading" style="font-size:13px;">Checking your yarns...</span></div></div>`;

  html += `<div class="feedback-section">`;
  html += `<h4>Was this project helpful?</h4>`;
  html += `<form class="feedback-form" data-project="${project.title.replace(/\"/g, '&quot;')}">`;
  html += `<div class="feedback-rating">`;
  html += `<label>Rating:</label>`;
  html += `<div class="star-rating">`;
  for (let i = 1; i <= 5; i++) {
    html += `<input type="radio" id="star${i}" name="rating" value="${i}" ${i === 5 ? 'checked' : ''}>`;
    html += `<label for="star${i}" title="${i} stars">★</label>`;
  }
  html += `</div></div>`;
  html += `<div class="feedback-comment">`;
  html += `<label>Comment <span class="optional">(optional)</span></label>`;
  html += `<textarea class="feedback-comment-input" rows="3" placeholder="Your feedback..."></textarea>`;
  html += `</div>`;
  html += `<button type="submit" class="btn btn-primary btn-sm">Submit Feedback</button>`;
  html += `<div class="feedback-thanks" style="display:none;">Thank you for your feedback!</div>`;
  html += `<div class="feedback-error" style="display:none;color:#d32;font-size:13px;"></div>`;
  html += `</form></div>`;

  html += `<div class="certificate-section">`;
  html += `<button class="btn btn-primary btn-sm certificate-btn" data-id="${project.id}">Get Completion Certificate</button>`;
  html += `</div>`;

  html += `</div>`;
  return html;
}

function setupDetailListeners(project, allProjects) {
  const container = document.querySelector('.project-detail');
  if (!container) return;

  container.querySelector('.back-to-cards')?.addEventListener('click', () => displayProjectCards(allProjects));
  container.querySelector('.detail-pdf-btn')?.addEventListener('click', () => printProject(project));

  container.addEventListener('click', function(e) {
    const target = e.target.closest('[data-id]');
    if (!target) return;
    const id = target.dataset.id;

    const actionsDiv = target.closest('.detail-actions');
    if (target.classList.contains('done-badge-toggle')) {
      const done = getDone().filter(d => d !== id);
      saveDone(done);
      if (actionsDiv) {
        actionsDiv.querySelector('.mark-done-btn').style.display = 'inline-block';
        target.style.display = 'none';
      }
      showToast('Unmarked as completed', 'info');
    } else if (target.classList.contains('mark-done-btn')) {
      markAsDone(id);
      if (actionsDiv) {
        target.style.display = 'none';
        actionsDiv.querySelector('.done-badge-toggle').style.display = 'inline';
      }
      showToast('Marked as completed!', 'success');
    } else if (target.classList.contains('fav-btn')) {
      e.stopPropagation();
      const nowFaved = toggleFave(id);
      target.classList.toggle('faved', nowFaved);
      target.title = nowFaved ? 'Remove from favorites' : 'Add to favorites';
      target.textContent = nowFaved ? '♥' : '♡';
      showToast(nowFaved ? 'Added to favorites' : 'Removed from favorites', nowFaved ? 'success' : 'info');
    }
  });

  container.querySelector('.feedback-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const rating = form.querySelector('input[name="rating"]:checked').value;
    const comment = form.querySelector('.feedback-comment-input').value;

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle: form.dataset.project || '',
          rating,
          comment,
          page: 'project-detail'
        })
      });

      const feedbackErr = form.querySelector('.feedback-error');
      if (response.ok || response.redirected) {
        form.querySelector('.feedback-thanks').style.display = 'block';
        form.querySelector('.feedback-rating').style.display = 'none';
        form.querySelector('.feedback-comment').style.display = 'none';
        form.querySelector('button[type="submit"]').style.display = 'none';
        feedbackErr && (feedbackErr.style.display = 'none');
        showToast('Feedback submitted — thank you!', 'success');
      } else {
        feedbackErr && (feedbackErr.textContent = 'Failed to submit feedback. Please try again.', feedbackErr.style.display = 'block');
        showToast('Failed to submit feedback', 'error');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      const feedbackErr = form.querySelector('.feedback-error');
      feedbackErr && (feedbackErr.textContent = 'Network error. Please try again.', feedbackErr.style.display = 'block');
      showToast('Network error submitting feedback', 'error');
    }
  });

  container.querySelector('.certificate-btn')?.addEventListener('click', function() {
    showCertificate(this.dataset.id);
  });
}

function showProjectDetail(project, index, allProjects) {
  const outputCard = document.getElementById('output');
  if (outputCard) outputCard.style.display = 'block';
  setOutputHeader(project.title || 'Project Detail');
  window._currentDetailProjects = allProjects;
  trackPopular(project.id, 'select');

  outputElement.innerHTML = renderDetailHTML(project, index);

  showReverseMatch(project.id);
  showProgressTracker(project.id);
  setupDetailListeners(project, allProjects);
}

window.showProjectDetail = showProjectDetail;
window.displayProjectCards = displayProjectCards;

document.addEventListener('DOMContentLoaded', function() {
  try {
  // Contact form handler
  const contactForm = document.getElementById('contact-form');
    if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const message = document.getElementById('contactMessage').value.trim();
        const submitBtn = document.getElementById('contactSubmitBtn');
        const thanks = this.querySelector('.contact-thanks');

        if (!email || !message) {
            const cerr = this.querySelector('.contact-error');
            if (cerr) { cerr.textContent = 'Please fill in email and message.'; cerr.style.display = 'block'; }
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            const resp = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: document.getElementById('contactName').value.trim(),
                    email: document.getElementById('contactEmail').value.trim(),
                    message: document.getElementById('contactMessage').value.trim()
                })
            });
            const cerr = contactForm.querySelector('.contact-error');
            if (resp.ok || resp.redirected) {
                if (cerr) cerr.style.display = 'none';
                contactForm.querySelectorAll('.form-row, .form-group, .btn').forEach(el => { if (!el.closest('.contact-thanks') && el !== submitBtn) el.style.display = 'none'; });
                submitBtn.style.display = 'none';
                submitBtn.textContent = 'Send Message';
                thanks.style.display = 'block';
            } else {
                if (cerr) { cerr.textContent = 'Failed to send. Please try again.'; cerr.style.display = 'block'; }
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        } catch (err) {
            const cerr = contactForm.querySelector('.contact-error');
            if (cerr) { cerr.textContent = 'Network error. Please try again.'; cerr.style.display = 'block'; }
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
    }

    // Global feedback form handler
    const globalForm = document.getElementById('global-feedback-form');
    if (globalForm) {
        globalForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            const thanksMsg = this.querySelector('.feedback-thanks');

            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';

            try {
                const rating = globalForm.querySelector('input[name="rating"]:checked');
                const resp = await fetch('/api/feedback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        rating: rating ? parseInt(rating.value) : 0,
                        comment: document.getElementById('global-comment').value.trim(),
                        page: 'global-feedback',
                        projectTitle: 'Site Feedback'
                    })
                });
                const gfErr = globalForm.querySelector('.gf-error');
                if (resp.ok || resp.redirected) {
                    globalForm.querySelector('.feedback-rating').style.display = 'none';
                    globalForm.querySelector('.feedback-comment').style.display = 'none';
                    submitBtn.style.display = 'none';
                    thanksMsg.style.display = 'block';
                    if (gfErr) gfErr.style.display = 'none';
                } else {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit Feedback';
                    if (gfErr) { gfErr.textContent = 'Failed to save feedback.'; gfErr.style.display = 'block'; }
                }
            } catch (err) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Feedback';
                const gfErr = globalForm.querySelector('.gf-error');
                if (gfErr) { gfErr.textContent = 'Network error. Please try again.'; gfErr.style.display = 'block'; }
            }
        });
    }
  } catch(e) { console.error(e); }
});

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('myFavesBtn').addEventListener('click', showMyFaves);
  document.getElementById('myDoneBtn').addEventListener('click', showMyDone);
});
