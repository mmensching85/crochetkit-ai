// render.js — ALL rendering functions (cards, detail, catalog, dashboard, print, focus mode)
// Depends on: storage.js, glossary.js (via window globals), and /js/matcher.js (formatProjectOutput, matchPattern, reverseMatch, convertStitchName)

// --- Stash rendering ---

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

function showStashDashboard() {
    const yarns = getYarns();
    const container = document.getElementById('stashDashboard');
    if (!container) return;

    if (!yarns || yarns.length === 0) {
      container.style.display = 'none';
      return;
    }

    const totalYardage = yarns.reduce((sum, y) => sum + (y.yardage || 0), 0);

    getPatterns().then(patterns => {
        let matchCount = 0;
        let almostThere = [];

        patterns.forEach(p => {
            if (!p.materials?.yarn?.weightNumber) return;
            const pWeight = p.materials.yarn.weightNumber;
            const minYardage = p.materials.yarn.suggestedYardageMin || 0;
            const hasMatchingWeight = yarns.some(y => Math.abs((y.weight || 0) - pWeight) <= 1);
            if (!hasMatchingWeight) return;

            if (totalYardage >= minYardage) {
                matchCount++;
            } else if (totalYardage >= minYardage * 0.7) {
                almostThere.push({ pattern: p, need: minYardage - totalYardage });
            }
        });

        almostThere.sort((a, b) => a.need - b.need);
        const topAlmost = almostThere.slice(0, 3);

        let html = `<div class="stash-dashboard">`;
        html += `<h3>🧶 Your Stash Health</h3>`;
        html += `<div class="dashboard-stats">`;
        html += `<div class="stat-card"><span class="stat-number">${yarns.length}</span><span class="stat-label">Yarns</span></div>`;
        html += `<div class="stat-card"><span class="stat-number">${totalYardage}</span><span class="stat-label">Total Yards</span></div>`;
        html += `<div class="stat-card"><span class="stat-number">${matchCount}</span><span class="stat-label">Patterns You Can Make</span></div>`;
        html += `</div>`;

        if (topAlmost.length > 0) {
            html += `<div class="almost-there">`;
            html += `<h4>🎯 Almost There!</h4>`;
            html += `<p class="almost-subtitle">Just need a little more yarn for these:</p>`;
            html += `<ul>`;
            topAlmost.forEach(a => {
                html += `<li><strong>${escHtml(a.pattern.name)}</strong> — need ${a.need} more yards</li>`;
            });
            html += `</ul></div>`;
        }

        html += `<div class="dashboard-tip">💡 <strong>Tip:</strong> ${matchCount > 0 ? 'You have enough yarn for ' + matchCount + ' patterns. Try the form below to find your perfect match!' : 'Try adding more yarns to your stash to find matching patterns.'}</div>`;
        html += `</div>`;

        container.innerHTML = html;
        container.style.display = 'block';
    }).catch(() => {
        container.style.display = 'none';
    });
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

// --- Affiliate / Share utilities ---

const AFFILIATE = {
  amazon: { tag: 'crochetkit-20', enabled: false },
  crochetcom: { id: '', enabled: false },
  lovecrafts: { id: '', enabled: false },
};

function affiliateLink(query, label) {
  if (AFFILIATE.amazon.enabled && AFFILIATE.amazon.tag) {
    return `<a href="https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${AFFILIATE.amazon.tag}" target="_blank" rel="noopener noreferrer sponsored">${label}</a>`;
  }
  return `<a href="https://www.amazon.com/s?k=${encodeURIComponent(query)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

function materialAffiliateLinks(materials) {
  const links = [];
  if (materials?.hook?.sizeMM) {
    links.push(affiliateLink(`${materials.hook.sizeMM}mm crochet hook`, `${materials.hook.sizeMM}mm hook`));
  }
  if (materials?.yarn?.weightCategory) {
    const wt = materials.yarn.weightCategory;
    links.push(affiliateLink(`${wt} yarn`, `${wt} yarn`));
  }
  return links.length ? links.join(' · ') : affiliateLink('crochet yarn hooks', 'crochet supplies');
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
    <button class="share-btn share-copy" title="Copy link" data-id="${escHtml(id)}">🔗</button>
  </div>`;
}

function trackPopular(patternId, action) {
  try {
    navigator.sendBeacon('/api/track-popular', JSON.stringify({ patternId, action }));
  } catch(e) {}
}

// --- Theme / UI setup ---

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
  // Auto-close dropdown when any nav button or link is tapped
  nav.querySelectorAll('.btn, a.btn').forEach(function(el) {
    el.addEventListener('click', function() {
      nav.classList.remove('mobile-open');
    });
  });
}

// --- Route handling ---

async function handlePatternRoute() {
  const match = window.location.pathname.match(/^\/p\/([\w-]+)$/);
  if (!match) return;
  const patternId = match[1];
  try {
    const patterns = await getPatterns();
    const raw = patterns.find(p => p.id === patternId);
    if (!raw) {
      document.getElementById('project-output').innerHTML = '<div class="error">Pattern not found.</div>';
      document.getElementById('output').style.display = 'block';
      return;
    }
    const formatted = formatProjectOutput({ matchedPattern: raw, materialGap: neutralMaterialGap(raw) }, currentTermSystem);
    const allFormatted = patterns.map(p => formatProjectOutput({ matchedPattern: p, materialGap: neutralMaterialGap(p) }, currentTermSystem));
    showProjectDetail(formatted, null, allFormatted);
  } catch (err) {
    console.error('Pattern route error:', err);
  }
}

window.addEventListener('popstate', function() {
  handlePatternRoute();
});

// --- Catalog ---

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
          html += `<div class="card-hero"><img src="/assets/patterns/${p.id}.webp" alt="${escHtml(p.name)}" class="card-hero-img" loading="lazy" onerror="this.onerror=null;this.style.display='none';this.parentElement.classList.add('img-fallback')"></div>`;
          html += `<h3>${title}</h3><span class="verified-badge" title="Human-verified pattern">✓ Verified</span>`;
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
            const formatted = formatProjectOutput({ matchedPattern: pats[idx], materialGap: neutralMaterialGap(pats[idx]) }, currentTermSystem);
            showProjectDetail(formatted, idx, pats.map(p => formatProjectOutput({ matchedPattern: p, materialGap: neutralMaterialGap(p) }, currentTermSystem)));
          });
        });

        document.querySelectorAll('.catalog-pdf').forEach(btn => {
          btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.idx);
            trackPopular(pats[idx].id, 'pdf');
            const formatted = formatProjectOutput({ matchedPattern: pats[idx], materialGap: neutralMaterialGap(pats[idx]) }, currentTermSystem);
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
      output.innerHTML = `<div class="error">Error loading patterns: ${escHtml(err.message)}</div>`;
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

// --- Favorites ---

function showMyFaves() {
  const output = document.getElementById('project-output');
  const outputCard = document.getElementById('output');
  outputCard.style.display = 'block';
  setOutputHeader('My Favorites');

  const faveIds = getFaves();

  if (faveIds.length === 0) {
    output.innerHTML = '<div class="empty-state"><h3>No favorites yet</h3><p>Browse patterns and click the ♡ button to save your favorites here.</p><button class="btn btn-primary show-catalog-btn" style="margin:20px auto;display:block;">Browse Patterns</button></div>';
    return;
  }

  output.innerHTML = '<div class="skeleton-grid">' + Array(3).fill('<div class="skeleton-card"><div class="skeleton-img"></div><div class="skeleton-line"></div><div class="skeleton-line"></div><div class="skeleton-line" style="width:60%"></div></div>').join('') + '</div>';

  getPatterns().then(patterns => {
      const faves = patterns.filter(p => faveIds.includes(p.id));
      let html = `<div class="catalog-count">${faves.length} favorited pattern${faves.length !== 1 ? 's' : ''}</div>`;
      html += '<div class="project-cards">';

      const favesFormatted = faves.map(p => formatProjectOutput({ matchedPattern: p, materialGap: neutralMaterialGap(p) }, currentTermSystem));

      faves.forEach((p, i) => {
        const f = favesFormatted[i];
        const fvd = isFaved(p.id) ? 'faved' : '';
        const doneSt = isDone(p.id) ? 'done-st' : '';
        const estTime = p.estimatedTime ? `${p.estimatedTime.minHours}-${p.estimatedTime.maxHours} ${p.estimatedTime.unit || 'hours'}` : '';
        html += `<div class="project-card ${doneSt}" data-index="${i}">`;
        html += `<div class="card-hero"><img src="/assets/patterns/${p.id}.webp" alt="${escHtml(p.name)}" class="card-hero-img" loading="lazy" onerror="this.onerror=null;this.style.display='none';this.parentElement.classList.add('img-fallback')"></div>`;
        html += `<h3>${escHtml(p.name)}</h3><span class="verified-badge" title="Human-verified pattern">✓ Verified</span>`;
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
      output.innerHTML = `<div class="error">Error: ${escHtml(err.message)}</div>`;
    });
}

// --- Journal ---

function showJournal() {
  const output = document.getElementById('project-output');
  const outputCard = document.getElementById('output');
  outputCard.style.display = 'block';
  setOutputHeader('My Project Journal');

  const entries = getJournal();
  if (entries.length === 0) {
    output.innerHTML = '<div class="empty-state"><h3>No journal entries yet</h3><p>When you complete a project, add a journal entry with photos and notes to remember your journey.</p></div>';
    return;
  }

  let html = `<div class="journal-timeline">`;
  entries.forEach(entry => {
    html += `<div class="journal-entry">`;
    html += `<div class="journal-date">${escHtml(entry.date)}</div>`;
    html += `<div class="journal-body">`;
    html += `<h3>${escHtml(entry.title)}</h3>`;
    if (entry.photo) html += `<img src="${escHtml(entry.photo)}" alt="${escHtml(entry.title)}" class="journal-photo" loading="lazy">`;
    if (entry.notes) html += `<p class="journal-notes">${escHtml(entry.notes)}</p>`;
    html += `</div></div>`;
  });
  html += `</div>`;
  output.innerHTML = html;
}

// --- Completed Projects ---

function showMyDone() {
  const output = document.getElementById('project-output');
  const outputCard = document.getElementById('output');
  outputCard.style.display = 'block';
  setOutputHeader('Completed Projects');

  const doneIds = getDone();

  if (doneIds.length === 0) {
    output.innerHTML = '<div class="empty-state"><h3>No completed projects yet</h3><p>When you finish a project, click "Mark as Done" to track it here.</p><button class="btn btn-primary show-catalog-btn" style="margin:20px auto;display:block;">Browse Patterns</button></div>';
    return;
  }

  output.innerHTML = '<div class="skeleton-grid">' + Array(3).fill('<div class="skeleton-card"><div class="skeleton-img"></div><div class="skeleton-line"></div><div class="skeleton-line"></div><div class="skeleton-line" style="width:60%"></div></div>').join('') + '</div>';

  getPatterns().then(patterns => {
      const done = patterns.filter(p => doneIds.includes(p.id));
      let html = `<div class="catalog-count">${done.length} completed project${done.length !== 1 ? 's' : ''}</div>`;
      html += '<div class="project-cards">';

      const doneFormatted = done.map(p => formatProjectOutput({ matchedPattern: p, materialGap: neutralMaterialGap(p) }, currentTermSystem));

      done.forEach((p, i) => {
        const estTime = p.estimatedTime ? `${p.estimatedTime.minHours}-${p.estimatedTime.maxHours} ${p.estimatedTime.unit || 'hours'}` : '';
        html += `<div class="project-card done-st" data-index="${i}">`;
        html += `<div class="card-hero"><img src="/assets/patterns/${p.id}.webp" alt="${escHtml(p.name)}" class="card-hero-img" loading="lazy" onerror="this.onerror=null;this.style.display='none';this.parentElement.classList.add('img-fallback')"></div>`;
        html += `<h3>${escHtml(p.name)}</h3><span class="verified-badge" title="Human-verified pattern">✓ Verified</span>`;
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
      output.innerHTML = `<div class="error">Error: ${escHtml(err.message)}</div>`;
    });
}

// --- Print / PDF ---

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

// --- Display project cards (match results) ---

function displayProjectCards(projects) {
    setOutputHeader('Suggested Projects');
    var shareMsg = document.getElementById('shareMatchResults');
    if (!shareMsg) {
      var shareDiv = document.createElement('div');
      shareDiv.id = 'shareMatchResults';
      shareDiv.className = 'share-match-results';
      shareDiv.innerHTML = '<span style="font-size:13px;color:#888;">🧶 Found ' + projects.length + ' pattern' + (projects.length !== 1 ? 's' : '') + ' — <a href="#" id="shareMatchLink" style="color:#667eea;">share your results</a></span>';
      var output = document.getElementById('project-output');
      if (output) output.parentNode.insertBefore(shareDiv, output);
      document.getElementById('shareMatchLink')?.addEventListener('click', function(e) {
        e.preventDefault();
        var msg = '🧶 I found ' + projects.length + ' pattern' + (projects.length !== 1 ? 's' : '') + ' I can make with my yarn stash! Try CrochetKit — it\'s free: ' + window.location.origin;
        if (navigator.share) { navigator.share({ text: msg }).catch(function(){}); }
        else if (navigator.clipboard) { navigator.clipboard.writeText(msg).then(function(){ showToast('Copied! Share it with your crochet friends 🧶', 'success'); }).catch(function(){}); }
      });
    } else { shareMsg.querySelector('span').textContent = '🧶 Found ' + projects.length + ' pattern' + (projects.length !== 1 ? 's' : '') + ' — share your results'; }
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
        html += `<div class="card-hero"><img src="/assets/patterns/${project.id}.webp" alt="${escHtml(project.title)}" class="card-hero-img" loading="lazy" onerror="this.onerror=null;this.style.display='none';this.parentElement.classList.add('img-fallback')"></div>`;
        html += `<h3>${title}</h3><span class="verified-badge" title="Human-verified pattern">✓ Verified</span>`;
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

    const hideCheck = document.getElementById('hideDoneResults');
    if (hideCheck) {
        hideCheck.addEventListener('change', function() {
            displayProjectCards(projects);
        });
    }
}

// --- Reverse stash match ---

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

// --- Progress tracker ---

async function showProgressTracker(patternId) {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return;
  }

  try {
    const response = await fetchWithTimeout(`/api/progress-tracker/${patternId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch progress');
    }

    const data = await response.json();
    const progress = data.progress;

    const stepsContainer = document.querySelector('.project-detail ol');
    if (!stepsContainer) return;

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

    document.querySelectorAll('.step-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', async function() {
        const stepNum = parseInt(this.dataset.step);
        const isChecked = this.checked;

        const label = this.nextElementSibling;
        label.textContent = `Step ${stepNum} ${isChecked ? '✓' : ''}`;

        const checkboxes = document.querySelectorAll('.step-checkbox');
        const completedSteps = Array.from(checkboxes)
          .filter(cb => cb.checked)
          .map(cb => parseInt(cb.dataset.step));

        try {
          const saveResponse = await fetchWithTimeout('/api/progress-tracker', {
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
          this.checked = !isChecked;
          label.textContent = `Step ${stepNum} ${!isChecked ? '✓' : ''}`;
          alert('Failed to save progress. Please try again.');
        }
      });
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
  }
}

// --- Certificate ---

async function showCertificate(patternId) {
  const token = localStorage.getItem('authToken');
  if (!token) {
    showToast('Sign in to get a completion certificate', 'info');
    return;
  }

  try {
      const response = await fetchWithTimeout('/api/generate-certificate', {
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

// --- Detail view HTML ---

function renderDetailHTML(project, index) {
  const ts = currentTermSystem;
  const convert = (text) => convertStitchName(linkifyGlossaryTerms(text), ts);

  let html = `<div class="project-detail" data-index="${index}">`;
  html += `<div class="detail-top-bar"><button class="btn btn-secondary back-btn back-to-cards">Back</button><button class="btn btn-success btn-sm detail-pdf-btn">PDF</button><a href="/p/${project.id}" target="_blank" class="btn btn-sm btn-outline" title="Open in new tab" style="text-decoration:none;">↗</a>${renderShareBtns(project.id, project.title)}</div>`;

    const fvd = isFaved(project.id) ? 'faved' : '';
  const doneSt = isDone(project.id);
  html += `<div class="detail-header"><h2>${convert(project.title)} (${project.skill_level})<span class="verified-badge" title="This pattern is human-designed, tested, and curated by our team — not AI-generated.">✓ Human-Verified Pattern</span></h2>`;
  html += `<div class="detail-actions">`;
  html += `<button class="fav-btn fav-btn-lg ${fvd}" data-id="${project.id}" title="${isFaved(project.id) ? 'Remove from favorites' : 'Add to favorites'}">${isFaved(project.id) ? '♥' : '♡'}</button>`;
  html += `<button class="btn btn-secondary btn-sm mark-done-btn" data-id="${project.id}" style="display:${doneSt ? 'none' : 'inline-block'}">✓ Mark as Done</button>`;
  html += `<span class="done-badge done-badge-lg done-badge-toggle" data-id="${project.id}" style="cursor:pointer;display:${doneSt ? 'inline' : 'none'}" title="Click to undo">✓ Done</span>`;
  html += `<button class="btn btn-sm btn-outline share-gallery-btn" data-id="${project.id}" data-title="${escHtml(project.title)}" style="margin-left:8px;">📸 Share</button>`;
  html += `</div></div>`;
  html += `<div class="detail-hero"><img src="/assets/patterns/${project.id}.webp" alt="${escHtml(project.title)}" class="detail-hero-img" loading="lazy" onerror="this.onerror=null;this.style.display='none';this.parentElement.classList.add('img-fallback')"></div>`;

  const prog = getProgress();
  const pid = project.id;
  const completedSteps = (prog[pid] && prog[pid].completedSteps) || [];
  const totalSteps = project.steps ? project.steps.length : 0;
  const compCount = completedSteps.length;
  const pct = totalSteps > 0 ? Math.round(compCount / totalSteps * 100) : 0;
  html += `<div class="progress-bar-container">
    <div class="progress-bar-fill" style="width:${pct}%"></div>
    <span class="progress-text">${compCount}/${totalSteps} steps</span>
  </div>`;
  html += `<div style="text-align:center;margin-bottom:16px;"><button class="btn btn-primary btn-sm focus-mode-btn" data-pid="${escHtml(project.id)}" data-idx="${index}">🔍 Focus Mode — One Step at a Time</button></div>`;

  html += `<p>${escHtml(project.description)}</p>`;
  html += `<p><strong>Estimated Time:</strong> ${escHtml(project.estimated_time)}</p>`;
  html += `<p><strong>Difficulty Reason:</strong> ${convert(project.difficulty_reason)}</p>`;

  html += `<details class="detail-collapsible" open><summary><h4>Materials</h4></summary><ul>`;
  project.materials.forEach(mat => {
    html += `<li>${linkifyGlossaryTerms(mat)}</li>`;
  });
  html += `</ul>`;
  const matLinks = materialAffiliateLinks(project.materials);
  html += `<p class="affiliate-links"><small>🛒 ${matLinks}</small></p>`;
  html += AFFILIATE.amazon.enabled ? '' : '<p class="affiliate-links" style="margin-top:4px;"><small style="color:#999;">Affiliate program pending — links are non-affiliate for now.</small></p>';

  if (project.missing_materials && project.missing_materials.length > 0) {
    html += `<h4>Missing Materials:</h4><ul class="missing-materials">`;
    project.missing_materials.forEach(mat => {
      html += `<li>${linkifyGlossaryTerms(mat)}</li>`;
    });
    html += `</ul>`;
  }

  html += `</details>`;

  html += `<details class="detail-collapsible" open><summary><h4>Stitches Used</h4></summary><ul>`;
  project.stitches_used.forEach(stitch => {
    html += `<li>${convert(stitch)}</li>`;
  });
  html += `</ul></details>`;

  html += `<h4>Steps:</h4><ol>`;
  project.steps.forEach((step, stepIdx) => {
    const stepNum = stepIdx + 1;
    const stepChecked = completedSteps.includes(stepNum);
    html += `<li><strong>${convert(step.instruction)}</strong>`;
    if (step.tip) html += ` <span class="tip">(${escHtml(step.tip)})</span>`;
    if (step.visual_description && step.visual_description !== "(No specific visual guidance for this step, focus on the written instruction.)") {
      html += `<p class="visual-desc"><em>Visual:</em> ${escHtml(step.visual_description)}</p>`;
    }
    html += `<div class="step-image"><img src="/assets/patterns/${project.id}/step-${stepNum}.webp" alt="Step ${stepNum} illustration" loading="lazy" onerror="this.onerror=null;this.style.display='none';this.parentElement.classList.add('img-fallback')"></div>`;
    html += `<label class="step-checkbox-label">
      <input type="checkbox" class="step-checkbox" data-step="${stepNum}" ${stepChecked ? 'checked' : ''}>
      <span class="checkmark"></span>
      Done
    </label>`;
    html += `</li>`;
  });
  html += `</ol>`;

  if (project.beginner_tips && project.beginner_tips.length > 0) {
    const tipsLabel = escHtml(project.tips_label || (project.skill_level === 'beginner' ? 'Beginner Tips' : 'Tips'));
    html += `<details class="detail-collapsible"><summary><h4>${tipsLabel}</h4></summary><ul>`;
    project.beginner_tips.forEach(tip => html += `<li>${escHtml(tip)}</li>`);
    html += `</ul></details>`;
  }

  if (project.variations && project.variations.length > 0) {
    html += `<details class="detail-collapsible"><summary><h4>Variations</h4></summary><ul>`;
    project.variations.forEach(variation => html += `<li>${escHtml(variation)}</li>`);
    html += `</ul></details>`;
  }

  if (project.safety_notes && project.safety_notes.length > 0) {
    html += `<details class="detail-collapsible"><summary><h4>Safety Notes</h4></summary><ul>`;
    project.safety_notes.forEach(note => html += `<li>${escHtml(note)}</li>`);
    html += `</ul></details>`;
  }

  html += `<div class="summary-box"><p>${escHtml(project.printable_summary)}</p></div>`;

  html += `<details class="glossary-section"><summary><h4>Glossary of Crochet Terms</h4></summary><ul>`;
  const g = getCurrentGlossary();
  Object.entries(g).forEach(([term, def]) => {
    html += `<li><strong>${term}</strong> — ${def}</li>`;
  });
  html += `</ul></details>`;

  html += `<details class="detail-collapsible"><summary><h4>My Stash Match</h4></summary><div id="stashMatchSection" class="stash-match-section"><div id="stashMatchContent"><span class="loading" style="font-size:13px;">Checking your yarns...</span></div></div></details>`;

  html += `<details class="detail-collapsible feedback-collapsible"><summary><h4>Was this project helpful?</h4></summary><div class="feedback-section">
  <form class="feedback-form" data-project="${project.title.replace(/\"/g, '&quot;')}">`;
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
  html += `</form></div></details>`;

  html += `<div class="certificate-section">`;
  html += `<button class="btn btn-primary btn-sm certificate-btn" data-id="${project.id}">Get Completion Certificate</button>`;
  html += `</div>`;

  // JSON-LD structured data for Google rich results
  const stepsLd = project.steps.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: s.instruction.replace(/\*\*/g, '').slice(0, 60),
    text: s.instruction.replace(/\*\*/g, ''),
    ...(s.visual_description && s.visual_description !== "(No specific visual guidance for this step, focus on the written instruction.)" ? { url: `${window.location.origin}/assets/patterns/${project.id}/step-${i + 1}.webp` } : {})
  }));
  const tools = [];
  if (project.materials?.hook?.sizeMM) tools.push({ '@type': 'HowToTool', name: `${project.materials.hook.sizeMM}mm crochet hook` });
  const supplies = [];
  if (project.materials?.yarn?.weightCategory) supplies.push({ '@type': 'HowToSupply', name: project.materials.yarn.weightCategory + ' yarn' });
  const totalTime = project.estimatedTime ? `PT${project.estimatedTime.minHours}H` : '';
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: project.title,
    description: project.description || '',
    ...(project.imageUrl ? { image: project.imageUrl } : {}),
    ...(totalTime ? { totalTime } : {}),
    tool: tools,
    supply: supplies,
    step: stepsLd
  };
  html += `<script type="application/ld+json">${JSON.stringify(ld)}<\/script>`;

  html += `</div>`;
  return html;
}

// --- Detail view listeners ---

function setupDetailListeners(project, allProjects) {
  const container = document.querySelector('.project-detail');
  if (!container) return;

  container.querySelector('.back-to-cards')?.addEventListener('click', () => {
    history.pushState(null, '', '/');
    displayProjectCards(allProjects);
  });
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
      const response = await fetchWithTimeout('/api/feedback', {
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

// --- Show project detail ---

function showProjectDetail(project, index, allProjects) {
  const outputCard = document.getElementById('output');
  if (outputCard) outputCard.style.display = 'block';
  setOutputHeader(project.title || 'Project Detail');
  window._currentDetailProjects = allProjects;
  trackPopular(project.id, 'select');

  history.pushState(null, '', '/p/' + project.id);

  outputElement.innerHTML = renderDetailHTML(project, index);

  showReverseMatch(project.id);
  setupDetailListeners(project, allProjects);

  const detailEl = document.querySelector('.project-detail');
  const focusBtn = detailEl ? detailEl.querySelector('.focus-mode-btn') : null;
  if (focusBtn) {
    focusBtn.addEventListener('click', function() {
      showFocusMode(project, index, allProjects);
    });
  }

  detailEl?.querySelectorAll('.share-gallery-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var title = this.dataset.title;
      var pid = this.dataset.id;
      var notes = prompt('Add a note about your project (optional):', '');
      if (notes === null) return;
      var photo = prompt('Photo URL (optional — paste an image link):', '') || '';
      var username = prompt('Your name (optional):', '') || 'Anonymous';
      fetchWithTimeout('/api/share-project', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ patternId: pid, patternName: title, notes: notes || '', photoUrl: photo, username: username }) })
        .then(function(r) { return r.json(); })
        .then(function(d) {
          if (d.success) { showToast('Shared to gallery! 🎉', 'success'); }
          else { showToast(d.error || 'Failed to share', 'error'); }
        }).catch(function() { showToast('Network error', 'error'); });
    });
  });

  const container = detailEl;
  if (container) {
    container.querySelectorAll('.step-checkbox').forEach(cb => {
      cb.addEventListener('change', function() {
        const prog = getProgress();
        const pid = project.id;
        if (!prog[pid]) prog[pid] = { completedSteps: [] };
        const stepNum = parseInt(this.dataset.step);
        if (this.checked) {
          if (!prog[pid].completedSteps.includes(stepNum)) {
            prog[pid].completedSteps.push(stepNum);
          }
        } else {
          prog[pid].completedSteps = prog[pid].completedSteps.filter(s => s !== stepNum);
        }
        saveProgress(prog);

        const fill = container.querySelector('.progress-bar-fill');
        const text = container.querySelector('.progress-text');
        const allCbs = container.querySelectorAll('.step-checkbox');
        const total = allCbs.length;
        const completed = container.querySelectorAll('.step-checkbox:checked').length;
        const pct = total > 0 ? Math.round(completed / total * 100) : 0;
        if (fill) fill.style.width = pct + '%';
        if (text) text.textContent = `${completed}/${total} steps`;

        if (completed === total && !isDone(pid)) {
          markAsDone(pid);
          const actionsDiv = container.querySelector('.detail-actions');
          if (actionsDiv) {
            const doneBtn = actionsDiv.querySelector('.mark-done-btn');
            const badge = actionsDiv.querySelector('.done-badge-toggle');
            if (doneBtn) doneBtn.style.display = 'none';
            if (badge) badge.style.display = 'inline';
          }
          showToast('All steps completed! Pattern marked as done.', 'success');
        }
      });
    });
  }
}

// --- Focus mode ---

function showFocusMode(project, index, allProjects) {
  const total = project.steps ? project.steps.length : 0;
  if (total === 0) return;
  const prog = getProgress();
  const pid = project.id;
  let completedSteps = (prog[pid] && prog[pid].completedSteps) || [];
  let currentStep = 1;

  function updateStepDisplay() {
    const step = project.steps[currentStep - 1];
    if (!step) return;
    const stepChecked = completedSteps.includes(currentStep);
    const pct = total > 0 ? Math.round(completedSteps.length / total * 100) : 0;

    let html = `<div class="focus-mode">`;
    html += `<div class="focus-top-bar"><button class="btn btn-secondary btn-sm focus-back">← Back to Detail</button></div>`;
    html += `<div class="focus-progress-bar"><div class="focus-progress-fill" style="width:${pct}%"></div><span class="focus-progress-text">Step ${currentStep} of ${total}</span></div>`;
    html += `<div class="focus-step-content">`;
    html += `<div class="focus-step-number">Step ${currentStep}</div>`;
    html += `<div class="focus-instruction">${convertStitchName(linkifyGlossaryTerms(step.instruction), currentTermSystem)}</div>`;
    if (step.tip) html += `<div class="focus-tip">💡 ${escHtml(step.tip)}</div>`;
    if (step.visual_description && step.visual_description !== "(No specific visual guidance for this step, focus on the written instruction.)") {
      html += `<div class="focus-visual">${escHtml(step.visual_description)}</div>`;
    }
    html += `<div class="focus-image"><img src="/assets/patterns/${project.id}/step-${currentStep}.webp" alt="Step ${currentStep}" loading="lazy" onerror="this.onerror=null;this.style.display='none';this.parentElement.classList.add('img-fallback')"></div>`;
    html += `</div>`;

    html += `<div class="focus-nav">`;
    html += `<button class="btn btn-outline focus-prev" ${currentStep <= 1 ? 'disabled' : ''}>← Previous</button>`;
    html += `<button class="btn btn-primary focus-done" data-step="${currentStep}">${stepChecked ? '✓ Done' : 'Mark Done'}</button>`;
    html += `<button class="btn btn-outline focus-next" ${currentStep >= total ? 'disabled' : ''}>Next →</button>`;
    html += `</div></div>`;

    const output = document.getElementById('project-output');
    if (output) output.innerHTML = html;

    output.querySelector('.focus-back')?.addEventListener('click', () => showProjectDetail(project, index, allProjects));
    output.querySelector('.focus-prev')?.addEventListener('click', () => { if (currentStep > 1) { currentStep--; updateStepDisplay(); } });
    output.querySelector('.focus-next')?.addEventListener('click', () => { if (currentStep < total) { currentStep++; updateStepDisplay(); } });
    output.querySelector('.focus-done')?.addEventListener('click', function() {
      const stepNum = parseInt(this.dataset.step);
      const wasChecked = completedSteps.includes(stepNum);
      if (wasChecked) {
        completedSteps = completedSteps.filter(s => s !== stepNum);
      } else {
        if (!completedSteps.includes(stepNum)) completedSteps.push(stepNum);
      }
      const prog2 = getProgress();
      if (!prog2[pid]) prog2[pid] = { completedSteps: [] };
      prog2[pid].completedSteps = completedSteps;
      saveProgress(prog2);
      if (completedSteps.length >= total && !isDone(pid)) {
        markAsDone(pid);
        showToast('Pattern completed! 🎉', 'success');
      }
      if (currentStep < total) {
        currentStep++;
      }
      updateStepDisplay();
    });
  }
  updateStepDisplay();
}
