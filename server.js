const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const LRU = require('lru-cache');
const { matchPattern, invalidateCache } = require('./src/matchPattern');
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
        const formatted = patterns.map(p => ({
            id: p.id,
            title: p.name,
            description: p.shortDescription,
            category: p.category,
            difficulty: p.difficulty.level,
            difficultyScore: p.difficulty.score,
            difficulty_reason: p.difficulty.reasoning,
            estimated_time: `${p.estimatedTime.minHours}-${p.estimatedTime.maxHours} ${p.estimatedTime.unit}`,
            estimated_min_hours: p.estimatedTime.minHours,
            estimated_max_hours: p.estimatedTime.maxHours,
            skill_level: p.difficulty.level,
            materials: [
                `${p.materials.yarn.suggestedYardageMin}-${p.materials.yarn.suggestedYardageMax} yards of ${p.materials.yarn.weightCategory} yarn`,
                `Hook: ${p.materials.hook.sizeUS} (${p.materials.hook.sizeMM} mm)`
            ],
            stitches_used: extractStitches(p.instructions),
            printable_summary: p.shortDescription,
            imageUrl: p.imageUrl
        }));
        res.json(formatted);
    } catch (error) {
        console.error('Error fetching patterns:', error.message);
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

        if (userInput.yarnWeightNumber === undefined || userInput.yardageHave === undefined) {
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
    const { patternId, action } = req.body;
    if (!patternId || !['view', 'select', 'pdf'].includes(action)) {
        return res.status(400).json({ error: 'patternId and action (view/select/pdf) required.' });
    }
    trackPopular(patternId, action);
    res.json({ success: true });
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

// POST /api/auth/favorites — Add pattern to favorites (auth required)
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

        if (!users[userIndex].favorites.includes(patternId)) {
            users[userIndex].favorites.push(patternId);
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

// Shareable pattern links with Open Graph tags
app.get('/p/:id', (req, res) => {
    const pattern = patterns.find(p => p.id === req.params.id);
    if (!pattern) return res.sendFile(path.join(__dirname, 'public', 'index.html'));

    const title = escHtml(pattern.name) + ' — Crochet Project Planner';
    const desc = escHtml(pattern.shortDescription);
    const url = `https://${req.get('host')}/p/${pattern.id}`;
    const img = pattern.imageUrl ? `https://${req.get('host')}${pattern.imageUrl}` : '';

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

// Admin feedback viewer
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`Crochet Project Planner server running at http://localhost:${PORT}`);
});