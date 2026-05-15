// Frontend logic for Crochet Project Planner
let glossaryData = {};
let currentTermSystem = 'US';

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
  let result = text;
  const g = getCurrentGlossary();
  const keys = Object.keys(g).sort((a, b) => b.length - a.length);
  keys.forEach(term => {
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedTerm})`, 'gi');
    result = result.replace(regex, (match) => {
      const definition = g[term.toLowerCase()] || g[term];
      return `<span class="glossary-term" title="${definition}">${match}</span>`;
    });
  });
  return result;
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
  return fullMap[name.toLowerCase()] || name.replace(/\b(sc|hdc|dc|tr)\b/g, m => abbrMap[m] || m);
}

const STASH_KEY = 'crochetkit-stash';

function saveStash() {
  const data = {
    yarnWeightNumber: document.getElementById('yarnWeightNumber').value,
    yardageHave: document.getElementById('yardageHave').value,
    hookSizeMM: document.getElementById('hookSizeMM').value,
    hookSizeUnknown: document.getElementById('hookSizeUnknown').checked,
    minHours: document.getElementById('minHours').value,
    maxHours: document.getElementById('maxHours').value,
    difficulty: document.getElementById('difficulty').value,
    preferredCategory: document.getElementById('preferredCategory').value,
    termSystem: document.getElementById('termSystem').value
  };
  localStorage.setItem(STASH_KEY, JSON.stringify(data));
}

function loadStash() {
  const raw = localStorage.getItem(STASH_KEY);
  if (!raw) return;
  try {
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

function clearStash() {
  localStorage.removeItem(STASH_KEY);
  updateStashStatus();
}

function updateStashStatus() {
  const el = document.getElementById('stashStatus');
  if (!el) return;
  const raw = localStorage.getItem(STASH_KEY);
  if (raw) {
    el.innerHTML = '<span class="stash-saved">&#10003; Stash saved</span><span class="clear-stash" id="clearStashBtn">clear</span>';
    document.getElementById('clearStashBtn').addEventListener('click', clearStash);
  } else {
    el.innerHTML = '';
  }
}

const FAVES_KEY = 'crochetkit-faves';

function getFaves() { try { return JSON.parse(localStorage.getItem(FAVES_KEY)) || []; } catch(e) { return []; } }

function saveFaves(faves) { localStorage.setItem(FAVES_KEY, JSON.stringify(faves)); }

function toggleFave(id) {
  const faves = getFaves();
  const idx = faves.indexOf(id);
  if (idx >= 0) { faves.splice(idx, 1); } else { faves.push(id); }
  saveFaves(faves);
  return idx < 0;
}

function isFaved(id) { return getFaves().includes(id); }

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
  localStorage.setItem(YARNS_KEY, JSON.stringify(yarns));
}

function addYarn(name, weight, yardage, hook, notes) {
  const yarns = getYarns();
  yarns.push({ id: Date.now(), name, weight: parseInt(weight), yardage: parseInt(yardage), hook: parseFloat(hook), notes });
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
  if (yarn.hook) document.getElementById('hookSizeMM').value = yarn.hook;
}

function escHtml(s) {
  if (!s) return '';
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

const SHARE_BASE = window.location.origin;

function shareUrl(id, title) {
  const url = SHARE_BASE + '/p/' + id;
  return {
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url),
    pinterest: 'https://pinterest.com/pin/create/button/?url=' + encodeURIComponent(url) + '&description=' + encodeURIComponent(title),
    email: 'mailto:?subject=' + encodeURIComponent(title + ' — Crochet Pattern') + '&body=' + encodeURIComponent('Check out this crochet pattern: ' + url)
  };
}

function trackPopular(patternId, action) {
  try {
    navigator.sendBeacon('/api/track-popular', JSON.stringify({ patternId, action }));
  } catch(e) {}
}

function renderShareBtns(id, title) {
  const links = shareUrl(id, title);
  return `<div class="share-btns">
    <a href="${links.facebook}" target="_blank" rel="noopener noreferrer" class="share-btn share-fb" title="Share on Facebook">f</a>
    <a href="${links.pinterest}" target="_blank" rel="noopener noreferrer" class="share-btn share-pin" title="Pin on Pinterest">P</a>
    <a href="${links.email}" class="share-btn share-email" title="Share via email">@</a>
  </div>`;
}

function initDarkMode() {
  const saved = localStorage.getItem('crochetkit-dark');
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
    localStorage.setItem('crochetkit-dark', 'false');
  } else {
    html.setAttribute('data-theme', 'dark');
    localStorage.setItem('crochetkit-dark', 'true');
  }
}

function showCatalog() {
  const output = document.getElementById('project-output');
  const outputCard = document.getElementById('output');
  outputCard.style.display = 'block';

  output.innerHTML = '<div class="loading">Loading all patterns...</div>';

  fetch('/api/patterns')
    .then(r => r.json())
    .then(patterns => {
      function render(pats) {
        let html = `<div class="catalog-count">Showing ${pats.length} of ${patterns.length} patterns</div>`;
        html += '<div class="catalog-filters">';
        html += `<select id="catFilterCat"><option value="">All categories</option>${[...new Set(patterns.map(p => p.category))].sort().map(c => `<option value="${c}">${c}</option>`).join('')}</select>`;
        html += `<select id="catFilterDiff"><option value="">All levels</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option></select>`;
        html += `<input type="number" id="catFilterTime" placeholder="Max hours" min="0" step="0.5">`;
        html += `<input type="text" id="catFilterSearch" placeholder="Search by name...">`;
        html += `<button class="btn btn-sm btn-outline" id="catFilterFaves">♥ Favorites</button>`;
        html += `<button class="btn btn-sm btn-outline" id="catFilterTrending" style="display:none;">🔥 Trending</button>`;
        html += `</div>`;
        html += '<div class="project-cards">';

        pats.forEach((p, i) => {
          const title = linkifyGlossaryTerms(p.title);
          const fvd = isFaved(p.id) ? 'faved' : '';
          html += `<div class="project-card" data-catalog-idx="${i}">`;
          html += `<h3>${title}</h3>`;
          html += `<p class="card-desc">${p.description}</p>`;
          html += `<p><strong>Category:</strong> ${p.category} &middot; <strong>Level:</strong> ${p.skill_level}</p>`;
          html += `<p><strong>Time:</strong> ${p.estimated_time}</p>`;
          html += `<p><strong>Stitches:</strong> ${p.stitches_used.join(', ')}</p>`;
          html += `<div class="card-actions">`;
          html += `<button class="btn btn-outline btn-sm catalog-select" data-idx="${i}">Select</button>`;
          html += `<button class="btn btn-success btn-sm catalog-pdf" data-idx="${i}">PDF</button>`;
          html += `<button class="fav-btn ${fvd}" data-id="${p.id}" title="${isFaved(p.id) ? 'Remove from favorites' : 'Add to favorites'}">${isFaved(p.id) ? '♥' : '♡'}</button>`;
          html += `${renderShareBtns(p.id, p.title)}`;
          html += `</div></div>`;
        });

        html += '</div>';
        output.innerHTML = html;

        document.querySelectorAll('.catalog-select').forEach(btn => {
          btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.idx);
            trackPopular(pats[idx].id, 'select');
            showProjectDetail(pats[idx], idx, pats);
          });
        });

        document.querySelectorAll('.catalog-pdf').forEach(btn => {
          btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.idx);
            trackPopular(pats[idx].id, 'pdf');
            printProject(pats[idx]);
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
          });
        });

        document.getElementById('catFilterCat').addEventListener('change', filterCatalog);
        document.getElementById('catFilterDiff').addEventListener('change', filterCatalog);
        document.getElementById('catFilterTime').addEventListener('input', filterCatalog);
        document.getElementById('catFilterSearch').addEventListener('input', filterCatalog);
        document.getElementById('catFilterFaves').addEventListener('click', function() {
          this.classList.toggle('active');
          filterCatalog();
        });
        const trendingBtn = document.getElementById('catFilterTrending');
        if (trendingBtn) {
          trendingBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            filterCatalog();
          });
        }

        function filterCatalog() {
          const cat = document.getElementById('catFilterCat').value;
          const diff = document.getElementById('catFilterDiff').value;
          const maxTime = parseFloat(document.getElementById('catFilterTime').value);
          const search = document.getElementById('catFilterSearch').value.toLowerCase().trim();
          const favesOnly = document.getElementById('catFilterFaves').classList.contains('active');
          const trendingOnly = document.getElementById('catFilterTrending')?.classList.contains('active');
          const faveIds = getFaves();
          const filtered = patterns.filter(p => {
            if (cat && p.category !== cat) return false;
            if (diff && p.skill_level !== diff) return false;
            if (maxTime && p.estimated_min_hours > maxTime) return false;
            if (search && !p.title.toLowerCase().includes(search) && !p.description.toLowerCase().includes(search)) return false;
            if (favesOnly && !faveIds.includes(p.id)) return false;
            return true;
          });
          if (trendingOnly) {
            fetch('/api/popular').then(r => r.json()).then(pop => {
              const trendingIds = new Set(pop.map(p => p.id));
              render(filtered.filter(p => trendingIds.has(p.id)));
            }).catch(() => render(filtered));
          } else {
            render(filtered);
          }
        }
      }
      render(patterns);
      // Load trending button
      fetch('/api/popular').then(r => r.json()).then(pop => {
        if (pop.length > 0) {
          const btn = document.getElementById('catFilterTrending');
          if (btn) { btn.style.display = ''; btn.textContent = '🔥 Trending (' + pop.length + ')'; }
        }
      }).catch(() => {});
    })
    .catch(err => {
      output.innerHTML = `<div class="error">Error loading patterns: ${err.message}</div>`;
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

    const w = window.open('', '_blank', 'width=800,height=600');
    w.document.write(html);
    w.document.close();
}

document.addEventListener('DOMContentLoaded', async function() {
    // Load glossary from JSON
    try {
      const resp = await fetch('/glossary.json');
      glossaryData = await resp.json();
    } catch (e) {
      glossaryData = {};
    }

    // Load stats
    try {
      const statsResp = await fetch('/api/stats');
      const stats = await statsResp.json();
      const bar = document.getElementById('statsBar');
      if (bar) {
        bar.innerHTML = `<span><strong>${stats.patternCount}</strong> patterns</span><span><strong>${stats.categoryCount}</strong> categories</span><span><strong>${stats.matchCount}</strong> projects matched</span>`;
      }
    } catch (e) {}

    // Check for shareable pattern link (/p/:id)
    const pathMatch = window.location.pathname.match(/^\/p\/(.+)$/);
    if (pathMatch) {
      try {
        const patResp = await fetch('/api/patterns');
        const allPats = await patResp.json();
        const target = allPats.find(p => p.id === pathMatch[1]);
        if (target) {
          trackPopular(target.id, 'view');
          showCatalog();
          const idx = allPats.indexOf(target);
          showProjectDetail(target, idx, allPats);
        }
      } catch (e) {}
    }

    initDarkMode();
    loadStash();
    updateWeightLabel();
    document.getElementById('yarnWeightNumber').addEventListener('input', updateWeightLabel);
    updateStashStatus();
    renderYarnList();
    document.getElementById('darkToggle').addEventListener('click', toggleDark);
    document.getElementById('browseAllBtn').addEventListener('click', showCatalog);
    document.getElementById('saveYarnBtn').addEventListener('click', function() {
      const name = document.getElementById('yarnName').value.trim();
      if (!name) { alert('Please enter a yarn name.'); return; }
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
    const outputElement = document.getElementById('project-output');
    let currentUserInput = null;
    let selectedProjectIndex = null;

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

        currentUserInput = {
            yarnWeightNumber: parseInt(document.getElementById('yarnWeightNumber').value),
            yardageHave: parseInt(document.getElementById('yardageHave').value),
            hookSizeMM: document.getElementById('hookSizeMM').value ? parseFloat(document.getElementById('hookSizeMM').value) : null,
            hookSizeUnknown: document.getElementById('hookSizeUnknown').checked,
            timeRange: {
                minHours: parseFloat(document.getElementById('minHours').value),
                maxHours: parseFloat(document.getElementById('maxHours').value)
            },
            difficulty: document.getElementById('difficulty').value,
            preferredCategory: document.getElementById('preferredCategory').value || null,
            termSystem: termSys
        };

        currentTermSystem = termSys;
        selectedProjectIndex = null;
        saveStash();
        updateStashStatus();

        try {
            outputElement.innerHTML = '<div class="loading">Finding your perfect project...</div>';
            document.getElementById('output').style.display = 'block';

            const response = await fetch('/api/find-project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentUserInput)
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);

            const projects = await response.json();
            displayProjectCards(projects);

        } catch (error) {
            console.error('Error:', error);
            outputElement.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        }
    });

    document.getElementById('surpriseBtn').addEventListener('click', async function() {
        const termSys = document.getElementById('termSystem').value;
        currentTermSystem = termSys;
        currentUserInput = {
            yarnWeightNumber: parseInt(document.getElementById('yarnWeightNumber').value),
            yardageHave: parseInt(document.getElementById('yardageHave').value),
            hookSizeMM: document.getElementById('hookSizeMM').value ? parseFloat(document.getElementById('hookSizeMM').value) : null,
            hookSizeUnknown: document.getElementById('hookSizeUnknown').checked,
            timeRange: {
                minHours: parseFloat(document.getElementById('minHours').value),
                maxHours: parseFloat(document.getElementById('maxHours').value)
            },
            difficulty: document.getElementById('difficulty').value,
            preferredCategory: document.getElementById('preferredCategory').value || null,
            termSystem: termSys
        };

        try {
            outputElement.innerHTML = '<div class="loading">Finding a surprise project...</div>';
            document.getElementById('output').style.display = 'block';

            const response = await fetch('/api/find-project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentUserInput)
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            const projects = await response.json();
            const pick = projects[Math.floor(Math.random() * projects.length)];
            const idx = projects.indexOf(pick);
            displayProjectCards(projects);
            showProjectDetail(pick, idx, projects);

        } catch (error) {
            console.error('Error:', error);
            outputElement.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        }
    });

    function displayProjectCards(projects) {
        let html = '<div class="project-cards">';
        projects.forEach((project, index) => {
            const title = linkifyGlossaryTerms(project.title);
            const stitches = project.stitches_used.map(s => convertStitchName(s, currentTermSystem)).join(', ');
            const fvd = isFaved(project.id) ? 'faved' : '';
            html += `<div class="project-card" data-index="${index}">`;
            html += `<h3>${title}</h3>`;
            html += `<p class="card-desc">${project.description}</p>`;
            html += `<p><strong>Time:</strong> ${project.estimated_time}</p>`;
            html += `<p><strong>Stitches:</strong> ${stitches}</p>`;
            html += `<div class="card-actions">`;
            html += `<button class="btn btn-outline btn-sm select-project" data-index="${index}">Select</button>`;
            html += `<button class="btn btn-success btn-sm download-pdf-card" data-index="${index}">PDF</button>`;
            html += `<button class="fav-btn ${fvd}" data-id="${project.id}" title="${isFaved(project.id) ? 'Remove from favorites' : 'Add to favorites'}">${isFaved(project.id) ? '♥' : '♡'}</button>`;
            html += `${renderShareBtns(project.id, project.title)}`;
            html += `</div></div>`;
        });
        html += '</div>';

        outputElement.innerHTML = html;

        document.querySelectorAll('.select-project').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'));
                selectedProjectIndex = idx;
                trackPopular(projects[idx].id, 'select');
                showProjectDetail(projects[idx], idx, projects);
            });
        });

        document.querySelectorAll('.download-pdf-card').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'));
                trackPopular(projects[idx].id, 'pdf');
                printProject(projects[idx]);
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
            });
        });
    }

    function showProjectDetail(project, index, allProjects) {
        const ts = currentTermSystem;
        const convert = (text) => convertStitchName(linkifyGlossaryTerms(text), ts);

        trackPopular(project.id, 'select');

        let html = `<div class="project-detail" data-index="${index}">`;
        html += `<div class="detail-top-bar"><button class="btn btn-secondary back-btn back-to-cards">Back to all projects</button>${renderShareBtns(project.id, project.title)}</div>`;

        if (project.imageUrl) {
            html += `<div class="project-image"><img src="${project.imageUrl}" alt="${project.title}" onerror="this.parentElement.style.display='none'"></div>`;
        }

        const fvd = isFaved(project.id) ? 'faved' : '';
        html += `<div class="detail-header"><h2>${convert(project.title)} (${project.skill_level})</h2>`;
        html += `<button class="fav-btn fav-btn-lg ${fvd}" data-id="${project.id}" title="${isFaved(project.id) ? 'Remove from favorites' : 'Add to favorites'}">${isFaved(project.id) ? '♥' : '♡'}</button></div>`;
        html += `<p>${project.description}</p>`;
        html += `<p><strong>Estimated Time:</strong> ${project.estimated_time}</p>`;
        html += `<p><strong>Difficulty Reason:</strong> ${convert(project.difficulty_reason)}</p>`;

        html += `<h4>Materials:</h4><ul>`;
        project.materials.forEach(mat => {
            html += `<li>${linkifyGlossaryTerms(mat)}</li>`;
        });
        html += `</ul>`;
        html += '<p class="affiliate-links"><small><a href="https://amzn.to/" target="_blank" rel="noopener noreferrer">Shop yarn and hooks on Amazon</a> — we may earn a commission.</small></p>';

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
        project.steps.forEach(step => {
            html += `<li><strong>${convert(step.instruction)}</strong>`;
            if (step.tip) html += ` <span class="tip">(${step.tip})</span>`;
            if (step.visual_description && step.visual_description !== "(No specific visual guidance for this step, focus on the written instruction.)") {
                html += `<p class="visual-desc"><em>Visual:</em> ${step.visual_description}</p>`;
            }
            html += `</li>`;
        });
        html += `</ol>`;

        if (project.beginner_tips && project.beginner_tips.length > 0) {
            const tipsLabel = project.tips_label || (project.skill_level === 'beginner' ? 'Beginner Tips' : 'Tips');
            html += `<h4>${tipsLabel}:</h4><ul>`;
            project.beginner_tips.forEach(tip => html += `<li>${tip}</li>`);
            html += `</ul>`;
        }

        if (project.variations && project.variations.length > 0) {
            html += `<h4>Variations:</h4><ul>`;
            project.variations.forEach(variation => html += `<li>${variation}</li>`);
            html += `</ul>`;
        }

        if (project.safety_notes && project.safety_notes.length > 0) {
            html += `<h4>Safety Notes:</h4><ul>`;
            project.safety_notes.forEach(note => html += `<li>${note}</li>`);
            html += `</ul>`;
        }

        html += `<div class="summary-box"><p>${project.printable_summary}</p></div>`;

        html += `<details class="glossary-section"><summary><h4>Glossary of Crochet Terms</h4></summary><ul>`;
        const g = getCurrentGlossary();
        Object.entries(g).forEach(([term, def]) => {
            html += `<li><strong>${term}</strong> — ${def}</li>`;
        });
        html += `</ul></details>`;

        // Feedback form
        html += `<div class="feedback-section">`;
        html += `<h4>Was this project helpful?</h4>`;
        html += `<form class="feedback-form" data-project="${project.title.replace(/"/g, '&quot;')}">`;
        html += `<div class="feedback-rating">`;
        html += `<label>Rating:</label>`;
        html += `<div class="star-rating">`;
        for (let i = 1; i <= 5; i++) {
            html += `<input type="radio" id="star${i}" name="rating" value="${i}" ${i === 5 ? 'checked' : ''}>`;
            html += `<label for="star${i}" title="${i} star${i > 1 ? 's' : ''}">Star</label>`;
        }
        html += `</div></div>`;
        html += `<div class="feedback-comment">`;
        html += `<label for="feedback-comment">Comment <span class="optional">(optional)</span></label>`;
        html += `<textarea id="feedback-comment" rows="3" placeholder="What did you think?"></textarea>`;
        html += `</div>`;
        html += `<button type="submit" class="btn btn-primary btn-sm feedback-submit">Submit Feedback</button>`;
        html += `<div class="feedback-thanks" style="display:none;">Thank you for your feedback!</div>`;
        html += `</form></div>`;

        html += `</div>`;

        outputElement.innerHTML = html;

        document.querySelector('.back-to-cards').addEventListener('click', function() {
            displayProjectCards(allProjects);
        });

        const detailFavBtn = document.querySelector('.detail-header .fav-btn');
        if (detailFavBtn) {
            detailFavBtn.addEventListener('click', function() {
                const id = this.dataset.id;
                const nowFaved = toggleFave(id);
                this.classList.toggle('faved', nowFaved);
                this.title = nowFaved ? 'Remove from favorites' : 'Add to favorites';
                this.textContent = nowFaved ? '♥' : '♡';
            });
        }

        document.querySelector('.feedback-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            const projectTitle = this.getAttribute('data-project');
            const rating = this.querySelector('input[name="rating"]:checked').value;
            const comment = this.querySelector('#feedback-comment').value;
            const submitBtn = this.querySelector('.feedback-submit');
            const thanksMsg = this.querySelector('.feedback-thanks');

            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';

            try {
                const resp = await fetch('/api/feedback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        projectTitle,
                        rating: parseInt(rating),
                        comment,
                        userInput: currentUserInput
                    })
                });
                const data = await resp.json();
                if (data.success) {
                    this.querySelector('.feedback-rating').style.display = 'none';
                    this.querySelector('.feedback-comment').style.display = 'none';
                    submitBtn.style.display = 'none';
                    thanksMsg.style.display = 'block';
                } else {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit Feedback';
                    alert('Error: ' + (data.error || 'Failed to save feedback.'));
                }
            } catch (err) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Feedback';
                alert('Error saving feedback. Please try again.');
            }
        });
    }
    });

    // Contact form handler
    document.getElementById('contact-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const message = document.getElementById('contactMessage').value.trim();
        const submitBtn = document.getElementById('contactSubmitBtn');
        const thanks = this.querySelector('.contact-thanks');

        if (!email || !message) { alert('Please fill in email and message.'); return; }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            const resp = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });
            const data = await resp.json();
            if (data.success) {
                this.querySelector('.form-row').style.display = 'none';
                this.querySelectorAll('.form-group').forEach(el => { if (!el.querySelector('.contact-thanks')) el.style.display = 'none'; });
                submitBtn.style.display = 'none';
                thanks.style.display = 'block';
            } else {
                alert('Error: ' + (data.error || 'Failed to send.'));
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        } catch (err) {
            alert('Network error. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
});

// Global feedback form handler
document.getElementById('global-feedback-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const rating = this.querySelector('input[name="rating"]:checked').value;
    const comment = document.getElementById('global-comment').value;
    const submitBtn = this.querySelector('button[type="submit"]');
    const thanksMsg = this.querySelector('.feedback-thanks');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    try {
        const resp = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                projectTitle: 'General Site Feedback',
                rating: parseInt(rating),
                comment,
                userInput: null
            })
        });
        const data = await resp.json();
        if (data.success) {
            document.getElementById('global-feedback').querySelector('.feedback-rating').style.display = 'none';
            document.getElementById('global-feedback').querySelector('.feedback-comment').style.display = 'none';
            submitBtn.style.display = 'none';
            thanksMsg.style.display = 'block';
        } else {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Feedback';
            alert('Error: ' + (data.error || 'Failed to save feedback.'));
        }
    } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Feedback';
        alert('Error saving feedback. Please try again.');
    }
});
