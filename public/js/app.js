// app.js — Entry point: DOMContentLoaded handler, event bindings, auth, forms
// Depends on: storage.js, glossary.js, render.js, matcher.js (all loaded first as globals)

document.addEventListener('DOMContentLoaded', async function() {
  outputElement = document.getElementById('project-output');
  // Set up favorites and done buttons (always available)
  const favesBtn = document.getElementById('myFavesBtn');
  const doneBtn = document.getElementById('myDoneBtn');
  if (favesBtn) favesBtn.addEventListener('click', showMyFaves);
  if (doneBtn) doneBtn.addEventListener('click', showMyDone);
  const journalBtn = document.getElementById('journalBtn');
  if (journalBtn) journalBtn.addEventListener('click', showJournal);

  // Auth state
  let authUser = null;
  function getAuthToken() { try { return localStorage.getItem('crochetkit-auth-token'); } catch(e) { return null; } }
  function setAuthUser(user, token) { authUser = user; localStorage.setItem('crochetkit-auth-token', token || ''); updateAuthUI(); }
  function clearAuth() { authUser = null; localStorage.removeItem('crochetkit-auth-token'); updateAuthUI(); }
  function updateAuthUI() {
    const btn = document.getElementById('authBtn');
    if (btn) btn.textContent = authUser ? `👤 ${authUser.email.split('@')[0]}` : '👤 Sign In';
  }
  async function syncToServer() {
    if (!authUser) return;
    try {
      await fetchWithTimeout('/api/sync', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getAuthToken() },
        body: JSON.stringify({ stash: getYarns(), faves: getFaves(), progress: getProgress() })
      });
    } catch(e) { /* silent — sync is optional */ }
  }
  async function syncFromServer() {
    if (!authUser) return;
    try {
      const resp = await fetchWithTimeout('/api/sync', { headers: { 'Authorization': 'Bearer ' + getAuthToken() } });
      if (!resp.ok) return;
      const data = await resp.json();
      if (data.stash && data.stash.length) { saveYarns(data.stash); renderYarnList(); }
      if (data.faves && data.faves.length) saveFaves(data.faves);
      if (data.progress && Object.keys(data.progress).length) saveProgress(data.progress);
    } catch(e) { /* silent */ }
  }

  const token = getAuthToken();
  if (token) { fetchWithTimeout('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'verify', password: 'verify' }) }).catch(() => {}); }

  // Share site button
  document.getElementById('shareSiteBtn')?.addEventListener('click', function() {
    const url = window.location.origin;
    const text = '🧶 CrochetKit — free crochet project planner! Find patterns for the yarn you already own. No account needed.';
    if (navigator.share) { navigator.share({ title: 'CrochetKit AI', text, url }).catch(() => {}); return; }
    if (navigator.clipboard) { navigator.clipboard.writeText(url).then(() => showToast('Link copied! Share it with your crochet friends 🧶', 'success')).catch(() => {}); return; }
    const ta = document.createElement('textarea'); ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); showToast('Link copied!', 'success');
  });

  const authBtn = document.getElementById('authBtn');
  if (authBtn) authBtn.addEventListener('click', function() { document.getElementById('authModal').style.display = 'block'; });
  document.getElementById('authModalClose')?.addEventListener('click', function() { document.getElementById('authModal').style.display = 'none'; });
  window.addEventListener('click', function(e) { const m = document.getElementById('authModal'); if (e.target === m) m.style.display = 'none'; });

  let isSignup = false;
  document.getElementById('authToggleLink')?.addEventListener('click', function(e) {
    e.preventDefault(); isSignup = !isSignup;
    document.getElementById('authModalTitle').textContent = isSignup ? 'Sign Up' : 'Sign In';
    document.getElementById('authSubmitBtn').textContent = isSignup ? 'Sign Up' : 'Sign In';
    this.textContent = isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up";
  });

  document.getElementById('authForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const errEl = document.getElementById('authError');
    const submitBtn = document.getElementById('authSubmitBtn');
    submitBtn.disabled = true; submitBtn.textContent = 'Please wait...';
    try {
      const endpoint = isSignup ? '/api/auth/register' : '/api/auth/login';
      const resp = await fetchWithTimeout(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await resp.json();
      if (data.success) {
        setAuthUser(data.user, data.token);
        document.getElementById('authModal').style.display = 'none';
        document.getElementById('authEmail').value = '';
        document.getElementById('authPassword').value = '';
        showToast('Signed in! Syncing your data...', 'success');
        syncFromServer().then(() => syncToServer());
      } else {
        errEl.textContent = data.error || 'Authentication failed';
        errEl.style.display = 'block';
      }
    } catch(err) {
      errEl.textContent = 'Network error. Try again.';
      errEl.style.display = 'block';
    }
    submitBtn.disabled = false; submitBtn.textContent = isSignup ? 'Sign Up' : 'Sign In';
  });

  // Wire sync to stash/faves/progress changes
  const origAddYarn = addYarn; addYarn = function() { origAddYarn.apply(this, arguments); syncToServer(); };
  const origDeleteYarn = deleteYarn; deleteYarn = function() { origDeleteYarn.apply(this, arguments); syncToServer(); };
  const origToggleFave = toggleFave; toggleFave = function(id) { const r = origToggleFave(id); syncToServer(); return r; };
  const origMarkAsDone = markAsDone; markAsDone = function(id) { origMarkAsDone(id); syncToServer(); };
  try {
    document.getElementById('yarnWeightNumber').addEventListener('input', updateWeightLabel);
    loadFilters();
    renderYarnList();
    showStashDashboard();
    initWelcomeBanner();
    loadGlossaryData();
    initMobileNav();
    document.getElementById('darkToggle').addEventListener('click', toggleDark);
    document.getElementById('browseAllBtn').addEventListener('click', showCatalog);
    document.getElementById('fullCatalogBtn').addEventListener('click', showFullCatalog);
    document.getElementById('trustLink')?.addEventListener('click', function(e) {
      e.preventDefault();
      const section = document.getElementById('trust-section');
      if (section) {
        const isVisible = section.style.display !== 'none';
        section.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
          setTimeout(() => section.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
        }
      }
    });
    document.querySelectorAll('.guide-toggle').forEach(btn => {
      btn.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const isOpen = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isOpen);
        if (content) content.style.display = isOpen ? 'none' : 'block';
        const arrow = this.querySelector('.guide-arrow');
        if (arrow) arrow.textContent = isOpen ? '▸' : '▾';
      });
    });
    (async function fillTrustCount() {
      try {
        const pats = await getPatterns();
        const el = document.getElementById('trustPatternCount');
        if (el) el.textContent = pats.length + '+';
      } catch(e) {}
    })();
    renderDailyPattern();

    document.getElementById('emailSignupForm')?.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('signupEmail').value.trim();
      const msg = document.getElementById('signupMessage');
      if (!email || !email.includes('@') || !email.includes('.')) {
        msg.textContent = 'Please enter a valid email address.';
        msg.style.color = '#d32';
        return;
      }
      try {
        const subs = JSON.parse(localStorage.getItem('crochetkit-subscribers') || '[]');
        if (subs.includes(email)) {
          msg.textContent = 'Already subscribed! (saved in your browser)';
          msg.style.color = 'green';
        } else {
          subs.push(email);
          localStorage.setItem('crochetkit-subscribers', JSON.stringify(subs));
          msg.textContent = 'Thanks! Your email is saved locally in your browser.';
          msg.style.color = 'green';
          document.getElementById('signupEmail').value = '';
        }
      } catch(e) {
        msg.textContent = 'Something went wrong. Try again.';
        msg.style.color = '#d32';
      }
    });

    document.getElementById('matchYarnsBtn').addEventListener('click', matchYarns);
    document.getElementById('viewStashBtn').addEventListener('click', showStashGallery);

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
    // Scan label
    document.getElementById('scanLabelBtn').addEventListener('click', function() {
      document.getElementById('labelPhotoInput').click();
    });

    document.getElementById('labelPhotoInput').addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(ev) {
        const dataUrl = ev.target.result;
        document.getElementById('labelPreview').src = dataUrl;
        document.getElementById('quickAddPanel').style.display = 'block';
        document.getElementById('qaScanStatus').textContent = '🔍 Analyzing label...';
        document.getElementById('qaScanStatus').style.display = 'block';
        document.getElementById('qaName').focus();
        fetchWithTimeout('/api/scan-label', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: dataUrl })
        }).then(r => r.json()).then(result => {
          if (result.suggestions && result.suggestions.weight !== null) {
            const s = result.suggestions;
            document.getElementById('qaWeight').value = s.weight;
            document.getElementById('qaHook').value = s.suggestedHook || '';
            const presetBtns = document.querySelectorAll('.qa-preset-btn');
            let matchedPreset = false;
            presetBtns.forEach(btn => {
              if (parseInt(btn.dataset.yds) === s.estimatedYardage) {
                btn.click();
                matchedPreset = true;
              }
            });
            if (!matchedPreset && s.commonYardages) {
              document.getElementById('qaYardage').value = s.estimatedYardage || '';
            }
            document.getElementById('qaScanStatus').innerHTML = `✅ Detected: <strong>Weight ${s.weight} (${s.weightLabel})</strong> — suggested hook ${s.suggestedHook}mm. Confirm below.`;
          } else {
            document.getElementById('qaScanStatus').innerHTML = '📷 Photo taken! Select the details below.';
          }
        }).catch(() => {
          document.getElementById('qaScanStatus').innerHTML = '📷 Photo taken! Select the details below.';
        });
      };
      reader.readAsDataURL(file);
    });

    const WEIGHT_HOOKS = { 0: 2.25, 1: 3.5, 2: 4.0, 3: 4.5, 4: 5.5, 5: 6.5, 6: 9.0, 7: 12.0 };
    document.getElementById('qaWeight').addEventListener('change', function() {
      const hook = WEIGHT_HOOKS[parseInt(this.value)];
      if (hook) document.getElementById('qaHook').value = hook;
    });

    document.querySelectorAll('.qa-preset-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.getElementById('qaYardage').value = this.dataset.yds;
      });
    });

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
      document.getElementById('quickAddPanel').style.display = 'none';
      document.getElementById('labelPhotoInput').value = '';
      document.getElementById('labelPreview').src = '';
      document.getElementById('qaName').value = '';
      document.getElementById('qaWeight').value = '4';
      document.getElementById('qaYardage').value = '';
      document.getElementById('qaHook').value = '';
      document.getElementById('qaNotes').value = '';
    });

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
      const catalogBtn = e.target.closest('.show-catalog-btn');
      const copyBtn = e.target.closest('.share-btn.share-copy');
      if (catalogBtn) {
        showCatalog();
      } else if (copyBtn) {
        copyShareLink(copyBtn.dataset.id);
      } else if (e.target === btn) {
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
      const hdrToggle = document.getElementById('termSystemHeader');
      if (hdrToggle) hdrToggle.value = this.value;
      if (currentUserInput && outputElement.innerHTML) {
        form.dispatchEvent(new Event('submit'));
      }
    });

    const headerToggle = document.getElementById('termSystemHeader');
    if (headerToggle) {
      headerToggle.addEventListener('change', function() {
        const formToggle = document.getElementById('termSystem');
        if (formToggle) {
          formToggle.value = this.value;
          formToggle.dispatchEvent(new Event('change'));
        }
      });
    }
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
            outputElement.innerHTML = `<div class="error">Error: ${escHtml(error.message)}</div>`;
        }
    });
    // Surprise Me button
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
            if (output) output.innerHTML = `<div class="error">Error: ${escHtml(error.message)}</div>`;
        }
    });

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
            const resp = await fetchWithTimeout('/api/contact', {
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
      handlePatternRoute();
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
            const resp = await fetchWithTimeout('/api/feedback', {
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

  } catch (error) {
    console.error('Error:', error);
    outputElement.innerHTML = `<div class="error">Error: ${escHtml(error.message)}</div>`;
  }
});

// Expose to window for inline onclick handlers (Surprise Me button, etc.)
window.showProjectDetail = showProjectDetail;
window.displayProjectCards = displayProjectCards;
