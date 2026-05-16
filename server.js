const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const LRU = require('lru-cache');
const { matchPattern, invalidateCache, reverseMatch } = require('./src/matchPattern');
const { formatProjectOutput } = require('./src/formatProjectOutput');
const patterns = require('./data/patterns.json');
const FEEDBACK_FILE = path.join(__dirname, 'data', 'feedback.json');
const MATCH_COUNT_FILE = path.join(__dirname, 'data', 'match-count.json');
const CONTACT_FILE = path.join(__dirname, 'data', 'contacts.json');
const POPULAR_FILE = path.join(__dirname, 'data', 'popular.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

const JWT_SECRET = process.env.JWT_SECRET || 'crochetkit-secret-key-change-in-production';
const JWT_EXPIRY = '7d';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Simple in-memory rate limiter
const rateLimitStore = new Map();
function rateLimit(maxRequests, windowMs) {
    return (req, res, next) => {
        const key = req.ip || req.connection.remoteAddress || 'unknown';
        const now = Date.now();
        if (!rateLimitStore.has(key)) {
            rateLimitStore.set(key, []);
        }
        const timestamps = rateLimitStore.get(key).filter(t => now - t < windowMs);
        if (timestamps.length >= maxRequests) {
            return res.status(429).json({ error: 'Too many requests. Please slow down.' });
        }
        timestamps.push(now);
        rateLimitStore.set(key, timestamps);
        next();
    };
}

// Apply rate limiting to API routes
app.use('/api/', rateLimit(60, 60000));

function escHtml(s) {
    if (!s) return '';
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getMatchCount() {
    try { return JSON.parse(fs.readFileSync(MATCH_COUNT_FILE, 'utf-8')).count || 0; }
    catch { return 0; }
}

function incrementMatchCount() {
    const count = getMatchCount() + 1;
    fs.writeFileSync(MATCH_COUNT_FILE, JSON.stringify({ count }), 'utf-8');
    return count;
}

function readJSON(file) {
    try { return JSON.parse(fs.readFileSync(file, 'utf-8')); }
    catch { return null; }
}

function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

function getPopular() {
    return readJSON(POPULAR_FILE) || {};
}

// SVG color palettes by category
const CAT_COLORS = {
  'Scarf': { bg: ['#667eea', '#764ba2'], accent: '#fff', text: '#e8d8ff' },
  'Hat': { bg: ['#e74c3c', '#c0392b'], accent: '#fff', text: '#ffd8d0' },
  'Headband': { bg: ['#9b59b6', '#8e44ad'], accent: '#fff', text: '#e8d0ff' },
  'Dishcloth': { bg: ['#3498db', '#2980b9'], accent: '#fff', text: '#d0e8ff' },
  'Coaster': { bg: ['#1abc9c', '#16a085'], accent: '#fff', text: '#d0fff0' },
  'Bag': { bg: ['#f39c12', '#e67e22'], accent: '#fff', text: '#fff0d0' },
  'Blanket': { bg: ['#e91e63', '#c2185b'], accent: '#fff', text: '#ffd0e0' },
  'Baby': { bg: ['#00bcd4', '#0097a7'], accent: '#fff', text: '#d0f8ff' },
  'Toy': { bg: ['#ff5722', '#e64a19'], accent: '#fff', text: '#ffe0d0' },
  'Shawl': { bg: ['#9c27b0', '#7b1fa2'], accent: '#fff', text: '#f0d0ff' },
};
const CAT_DEFAULT = { bg: ['#667eea', '#764ba2'], accent: '#fff', text: '#e8d8ff' };

function generatePatternSVG(pattern) {
    const colors = CAT_COLORS[pattern.category] || CAT_DEFAULT;
    const name = escHtml(pattern.name || 'Crochet Pattern');
    const cat = escHtml(pattern.category || '');
    const diff = pattern.difficulty ? pattern.difficulty.level : '';
    const time = pattern.estimatedTime ? `${pattern.estimatedTime.minHours}-${pattern.estimatedTime.maxHours} ${pattern.estimatedTime.unit}` : '';
    const bg1 = colors.bg[0];
    const bg2 = colors.bg[1];
    return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bg1}"/>
      <stop offset="100%" style="stop-color:${bg2}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#g)" rx="12"/>
  <circle cx="60" cy="70" r="40" fill="rgba(255,255,255,0.08)"/>
  <circle cx="350" cy="250" r="50" fill="rgba(255,255,255,0.06)"/>
  <circle cx="200" cy="50" r="80" fill="rgba(255,255,255,0.04)"/>
  <text x="200" y="100" text-anchor="middle" fill="${colors.accent}" font-family="sans-serif" font-size="22" font-weight="bold">${name.length > 28 ? name.slice(0, 28) + '...' : name}</text>
  <line x1="80" y1="120" x2="320" y2="120" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
  <text x="200" y="155" text-anchor="middle" fill="${colors.text}" font-family="sans-serif" font-size="14">${cat}</text>
  <text x="200" y="185" text-anchor="middle" fill="${colors.text}" font-family="sans-serif" font-size="13">${diff} &middot; ${time}</text>
  <text x="200" y="230" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="sans-serif" font-size="40">&#9829;</text>
  <text x="200" y="280" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-family="sans-serif" font-size="11">CrochetKit AI</text>
</svg>`;
}

function trackPopular(patternId, action) {
    const pop = getPopular();
    if (!pop[patternId]) pop[patternId] = { views: 0, selects: 0, pdfs: 0 };
    if (action === 'view') pop[patternId].views++;
    else if (action === 'select') pop[patternId].selects++;
    else if (action === 'pdf') pop[patternId].pdfs++;
    writeJSON(POPULAR_FILE, pop);
}

function loadUsers() {
    return readJSON(USERS_FILE) || [];
}

function saveUsers(users) {
    writeJSON(USERS_FILE, users);
}

function findUserByEmail(email) {
    const users = loadUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

function findUserById(id) {
    const users = loadUsers();
    return users.find(u => u.id === id);
}

function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
    );
}

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = findUserById(decoded.id);
        if (!req.user) {
            return res.status(401).json({ error: 'User not found' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

// API: get all patterns (for Browse All catalog)
app.get('/api/patterns', (req, res) => {
    try {
        const dummyMatch = (p) => ({
            matchedPattern: p,
            materialGap: { yardage: { status: 'ok' }, hook: { status: 'ok' } }
        });
        const formatted = patterns.map(p => ({
            ...formatProjectOutput(dummyMatch(p), 'US'),
            category: p.category,
            difficulty: p.difficulty.level,
            difficultyScore: p.difficulty.score,
            estimated_min_hours: p.estimatedTime.minHours,
            estimated_max_hours: p.estimatedTime.maxHours,
            printable_summary: p.shortDescription,
        }));
        res.json(formatted);
    } catch (error) {
        console.error('Error fetching patterns:', error.message, error.stack);
        res.status(500).json({ error: error.message });
    }
});

// API: get stats
app.get('/api/stats', (req, res) => {
    const categories = new Set(patterns.map(p => p.category));
    res.json({
        patternCount: patterns.length,
        categoryCount: categories.size,
        matchCount: getMatchCount()
    });
});

function extractStitches(instructions) {
    const stitchNames = new Set();
    const stitchMap = {
        'single crochet': 'Single crochet (sc)',
        'double crochet': 'Double crochet (dc)',
        'half double crochet': 'Half double crochet (hdc)',
        'treble': 'Treble crochet (tr)',
        'slip stitch': 'Slip stitch (sl st)',
        'chain': 'Chain (ch)',
    };
    const joined = instructions.join(' ');
    for (const [key, val] of Object.entries(stitchMap)) {
        if (joined.toLowerCase().includes(key)) stitchNames.add(val);
    }
    if (joined.toLowerCase().includes('fpdc') || joined.toLowerCase().includes('front post')) {
        stitchNames.add('Front post double crochet (FPdc)');
    }
    return Array.from(stitchNames).sort();
}

// API endpoint to find projects (returns array of suggestions)
app.post('/api/find-project', (req, res) => {
    try {
        const userInput = req.body;

        const hasYarns = userInput.yarns && userInput.yarns.length > 0;
        if (!hasYarns && (userInput.yarnWeightNumber === undefined || userInput.yardageHave === undefined)) {
            return res.status(400).json({ error: 'Missing required fields: yarnWeightNumber and yardageHave are required.' });
        }

        const matchResults = matchPattern(userInput, patterns);
        const termSystem = userInput.termSystem || 'US';

        const formattedOutput = matchResults.map(r => formatProjectOutput(r, termSystem));

        incrementMatchCount();

        res.json(formattedOutput);
    } catch (error) {
        console.error('Error processing request:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/reverse-match — Given a pattern, show which saved yarns match
app.post('/api/reverse-match', (req, res) => {
    try {
        const { patternId, yarns } = req.body;
        if (!patternId || !Array.isArray(yarns)) {
            return res.status(400).json({ error: 'patternId and yarns array are required.' });
        }

        const pattern = patterns.find(p => p.id === patternId);
        if (!pattern) {
            return res.status(404).json({ error: 'Pattern not found.' });
        }

        const result = reverseMatch(pattern, yarns);
        res.json(result);
    } catch (error) {
        console.error('Reverse match error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/feedback — Save user feedback
app.post('/api/feedback', (req, res) => {
    try {
        const { projectTitle, rating, comment, userInput } = req.body;

        if (!projectTitle || !rating) {
            return res.status(400).json({ error: 'Missing required fields: projectTitle and rating are required.' });
        }

        const ratingNum = parseInt(rating, 10);
        if (ratingNum < 1 || ratingNum > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
        }

        const entry = {
            projectTitle,
            rating: ratingNum,
            comment: comment || '',
            userInput: userInput || null,
            timestamp: new Date().toISOString()
        };

        let feedback = [];
        try {
            const raw = fs.readFileSync(FEEDBACK_FILE, 'utf-8');
            feedback = JSON.parse(raw);
        } catch {
            feedback = [];
        }

        feedback.push(entry);
        fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedback, null, 2), 'utf-8');

        res.json({ success: true, message: 'Feedback saved. Thank you!' });
    } catch (error) {
        console.error('Error saving feedback:', error.message);
        res.status(500).json({ error: 'Failed to save feedback.' });
    }
});

app.post('/api/cache/invalidate', (req, res) => {
    invalidateCache();
    res.json({ success: true, message: 'Cache cleared.' });
});

// GET /api/feedback — Retrieve all feedback (for admin view)
app.get('/api/feedback', (req, res) => {
    try {
        res.json(readJSON(FEEDBACK_FILE) || []);
    } catch {
        res.json([]);
    }
});

// POST /api/contact — Contact form
app.post('/api/contact', (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!email || !message) {
            return res.status(400).json({ error: 'Email and message are required.' });
        }
        const contacts = readJSON(CONTACT_FILE) || [];
        contacts.push({ name: name || '', email, message, timestamp: new Date().toISOString() });
        writeJSON(CONTACT_FILE, contacts);
        res.json({ success: true, message: 'Message sent. We\'ll get back to you!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save message.' });
    }
});

// GET /api/popular — Get popular patterns
app.get('/api/popular', (req, res) => {
    const pop = getPopular();
    const scored = Object.entries(pop).map(([id, data]) => ({
        id,
        score: data.views + data.selects * 3 + data.pdfs * 5,
        ...data
    })).sort((a, b) => b.score - a.score).slice(0, 6);
    res.json(scored);
});

// POST /api/track-popular — Track interaction with a pattern
app.post('/api/track-popular', (req, res) => {
    try {
        const { patternId, action } = req.body;
        if (!patternId || !['view', 'select', 'pdf'].includes(action)) {
            return res.status(400).json({ error: 'patternId and action (view/select/pdf) required.' });
        }
        trackPopular(patternId, action);
        res.json({ success: true });
    } catch (e) {
        console.error('track-popular error:', e.message);
        res.json({ success: true });
    }
});

// POST /api/auth/signup — User registration
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const existingUser = findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'An account with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const users = loadUsers();

        const newUser = {
            id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            email: email.toLowerCase(),
            name: name || '',
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            favorites: [],
            yarnStash: []
        };

        users.push(newUser);
        saveUsers(users);

        const token = generateToken(newUser);
        res.json({
            success: true,
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                favorites: newUser.favorites,
                yarnStash: newUser.yarnStash
            }
        });
    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(500).json({ error: 'Failed to create account' });
    }
});

// POST /api/auth/login — User login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = generateToken(user);
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                favorites: user.favorites || [],
                yarnStash: user.yarnStash || []
            }
        });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: 'Failed to login' });
    }
});

// GET /api/auth/profile — Get current user profile (auth required)
app.get('/api/auth/profile', authMiddleware, (req, res) => {
    const user = req.user;
    res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        favorites: user.favorites || [],
        yarnStash: user.yarnStash || [],
        createdAt: user.createdAt
    });
});

// PUT /api/auth/profile — Update user profile (auth required)
app.put('/api/auth/profile', authMiddleware, (req, res) => {
    try {
        const { name, favorites, yarnStash } = req.body;
        const users = loadUsers();
        const userIndex = users.findIndex(u => u.id === req.user.id);

        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (name !== undefined) users[userIndex].name = name;
        if (favorites !== undefined) users[userIndex].favorites = favorites;
        if (yarnStash !== undefined) users[userIndex].yarnStash = yarnStash;

        saveUsers(users);

        res.json({
            success: true,
            user: {
                id: users[userIndex].id,
                email: users[userIndex].email,
                name: users[userIndex].name,
                favorites: users[userIndex].favorites,
                yarnStash: users[userIndex].yarnStash
            }
        });
    } catch (error) {
        console.error('Profile update error:', error.message);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// GET /api/auth/favorites — Get user's favorites (auth required)
app.get('/api/auth/favorites', authMiddleware, (req, res) => {
    try {
        const users = loadUsers();
        const user = users.find(u => u.id === req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ favorites: user.favorites || [] });
    } catch (error) {
        console.error('Favorites error:', error.message);
        res.status(500).json({ error: 'Failed to get favorites' });
    }
});

// POST /api/auth/favorites — Add pattern(s) to favorites (auth required)
// Accepts single { patternId: "id" } OR bulk { patternId: ["id1", "id2"] }
app.post('/api/auth/favorites', authMiddleware, (req, res) => {
    try {
        const { patternId } = req.body;
        if (!patternId) {
            return res.status(400).json({ error: 'patternId is required' });
        }

        const users = loadUsers();
        const userIndex = users.findIndex(u => u.id === req.user.id);

        if (!users[userIndex].favorites) {
            users[userIndex].favorites = [];
        }

        const ids = Array.isArray(patternId) ? patternId : [patternId];
        let added = 0;
        for (const id of ids) {
            if (!users[userIndex].favorites.includes(id)) {
                users[userIndex].favorites.push(id);
                added++;
            }
        }
        if (added > 0) {
            saveUsers(users);
        }

        res.json({ success: true, favorites: users[userIndex].favorites });
    } catch (error) {
        console.error('Favorites error:', error.message);
        res.status(500).json({ error: 'Failed to add favorite' });
    }
});

// DELETE /api/auth/favorites/:patternId — Remove pattern from favorites (auth required)
app.delete('/api/auth/favorites/:patternId', authMiddleware, (req, res) => {
    try {
        const { patternId } = req.params;
        const users = loadUsers();
        const userIndex = users.findIndex(u => u.id === req.user.id);

        if (!users[userIndex].favorites) {
            users[userIndex].favorites = [];
        }

        users[userIndex].favorites = users[userIndex].favorites.filter(id => id !== patternId);
        saveUsers(users);

        res.json({ success: true, favorites: users[userIndex].favorites });
    } catch (error) {
        console.error('Favorites error:', error.message);
        res.status(500).json({ error: 'Failed to remove favorite' });
    }
});

// PUT /api/auth/yarn-stash — Update yarn stash (auth required)
app.put('/api/auth/yarn-stash', authMiddleware, (req, res) => {
    try {
        const { yarnStash } = req.body;
        if (!Array.isArray(yarnStash)) {
            return res.status(400).json({ error: 'yarnStash must be an array' });
        }

        const users = loadUsers();
        const userIndex = users.findIndex(u => u.id === req.user.id);
        users[userIndex].yarnStash = yarnStash;
        saveUsers(users);

        res.json({ success: true, yarnStash: users[userIndex].yarnStash });
    } catch (error) {
        console.error('Yarn stash error:', error.message);
        res.status(500).json({ error: 'Failed to update yarn stash' });
    }
});

// GET /api/pattern-image/:id — Generate SVG pattern image
app.get('/api/pattern-image/:id', (req, res) => {
    const pattern = patterns.find(p => p.id === req.params.id);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    if (!pattern) {
        return res.send(generatePatternSVG({ name: req.params.id, category: '', difficulty: { level: '' }, estimatedTime: null }));
    }
    res.send(generatePatternSVG(pattern));
});

// Shareable pattern links with Open Graph tags
app.get('/p/:id', (req, res) => {
    const pattern = patterns.find(p => p.id === req.params.id);
    if (!pattern) return res.sendFile(path.join(__dirname, 'public', 'index.html'));

    const title = escHtml(pattern.name) + ' — Crochet Project Planner';
    const desc = escHtml(pattern.shortDescription);
    const url = `https://${req.get('host')}/p/${pattern.id}`;
    const img = `https://${req.get('host')}/api/pattern-image/${pattern.id}`;

    fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf-8', (err, data) => {
        if (err) return res.sendFile(path.join(__dirname, 'public', 'index.html'));
        const meta = `
<meta property="og:title" content="${escHtml(pattern.name)}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="website">
${img ? `<meta property="og:image" content="${img}">` : ''}
<meta name="description" content="${desc}">
`;
        res.send(data.replace('</title>', '</title>' + meta));
    });
});

// Sitemap
app.get('/sitemap.xml', (req, res) => {
    const host = req.get('host');
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const base = `${protocol}://${host}`;
    const urls = patterns.map(p => `
  <url>
    <loc>${base}/p/${p.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');
    res.setHeader('Content-Type', 'application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>${urls}
</urlset>`);
});

app.get('/robots.txt', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send('User-agent: *\nAllow: /\nSitemap: https://' + req.get('host') + '/sitemap.xml\n');
});

// Admin feedback viewer
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`Crochet Project Planner server running at http://localhost:${PORT}`);
});