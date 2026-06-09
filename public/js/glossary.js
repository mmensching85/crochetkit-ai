// glossary.js — Glossary data, linking functions, term system, and page-level rendering helpers
// Depends on: storage.js (for getPatterns, escHtml, dailySeed, formatProjectOutput, etc.)

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

function loadGlossaryData() {
  fetchWithTimeout('/glossary.json')
    .then(r => r.json())
    .then(data => { glossaryData = data; })
    .catch(() => {});
}

async function renderDailyPattern() {
  const container = document.getElementById('daily-pattern');
  const content = document.getElementById('daily-pattern-content');
  const dateEl = document.getElementById('daily-date');
  if (!container || !content) return;
  try {
    const patterns = await getPatterns();
    if (!patterns.length) return;
    const today = new Date().toISOString().slice(0, 10);
    const idx = dailySeed(today) % patterns.length;
    const pat = patterns[idx];
    if (dateEl) dateEl.textContent = today;
    const wNum = pat.materials?.yarn?.weightNumber;
    const wLabel = wNum != null ? ['Lace','Super Fine','Fine','Light','Medium','Bulky','Super Bulky','Jumbo'][wNum] || '' : '';
    const estTime = pat.estimatedTime ? `${pat.estimatedTime.minHours}-${pat.estimatedTime.maxHours} ${pat.estimatedTime.unit || 'hours'}` : '';
    const shareLinks = renderShareBtns(pat.id, pat.name);
    content.innerHTML = `
      <div class="daily-pattern-body">
        <div class="daily-pattern-img">
          <img src="/assets/patterns/${pat.id}.webp" alt="${escHtml(pat.name)}" loading="lazy" onerror="this.onerror=null;this.style.display='none';this.parentElement.classList.add('img-fallback')">
        </div>
        <div class="daily-pattern-info">
          <h3>${escHtml(pat.name)}</h3>
          <p>${escHtml(pat.shortDescription || '')}</p>
          <p class="daily-meta">${escHtml(pat.category || '')} · ${escHtml(pat.difficulty?.level || '')} · ${estTime}${wLabel ? ` · ${wLabel}` : ''}</p>
          <div class="btn-group" style="margin-top:8px;">
            <button class="btn btn-outline btn-sm" id="dailyViewBtn">View Pattern</button>
            <button class="btn btn-outline btn-sm" id="dailyMatchBtn">Find Similar</button>
          </div>
          <div class="share-btns" style="margin-top:8px;">${shareLinks}</div>
        </div>
      </div>
    `;
    container.style.display = 'block';
    document.getElementById('dailyViewBtn')?.addEventListener('click', () => {
      const formatted = formatProjectOutput({ matchedPattern: pat, materialGap: neutralMaterialGap(pat) }, currentTermSystem);
      const allFormatted = patterns.map(p => formatProjectOutput({ matchedPattern: p, materialGap: neutralMaterialGap(p) }, currentTermSystem));
      showProjectDetail(formatted, null, allFormatted);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.getElementById('dailyMatchBtn')?.addEventListener('click', () => {
      document.getElementById('yarnWeightNumber').value = pat.materials?.yarn?.weightNumber ?? 4;
      updateWeightLabel();
      document.getElementById('findProjectsBtn').click();
    });
  } catch (err) {
    console.error('Daily pattern error:', err);
  }
}

function neutralMaterialGap(pattern) {
  const minY = pattern.materials?.yarn?.suggestedYardageMin ?? 0;
  const maxY = pattern.materials?.yarn?.suggestedYardageMax ?? minY;
  return {
    yardage: { have: 0, need: (minY + maxY) / 2, gap: 0, status: 'unknown' },
    hook: { have: null, need: pattern.materials?.hook?.sizeMM || null, gap: 0, status: 'unknown' }
  };
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
          <img src="${p.imageUrl || `/assets/patterns/${p.id}.webp`}" alt="${escHtml(p.name || '')}" loading="lazy" onerror="this.onerror=null;this.style.display='none';this.parentElement.classList.add('img-fallback')">
        </div>
        <div class="pattern-info">
          <h3>${escHtml(p.name || '')}</h3>
          <span class="verified-badge" title="Human-verified pattern">✓ Verified</span>
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
const formatted = formatProjectOutput({ matchedPattern: raw, materialGap: neutralMaterialGap(raw) }, currentTermSystem);
      const allFormatted = allPatterns.map(p => formatProjectOutput({ matchedPattern: p, materialGap: neutralMaterialGap(p) }, currentTermSystem));
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
