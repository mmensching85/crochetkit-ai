const express = require('express');
const path = require('path');
const fs = require('fs');
const { matchPattern, invalidateCache } = require('./src/matchPattern');
const { formatProjectOutput } = require('./src/formatProjectOutput');
const patterns = require('./data/patterns.json');
const FEEDBACK_FILE = path.join(__dirname, 'data', 'feedback.json');
const MATCH_COUNT_FILE = path.join(__dirname, 'data', 'match-count.json');
const CONTACT_FILE = path.join(__dirname, 'data', 'contacts.json');
const POPULAR_FILE = path.join(__dirname, 'data', 'popular.json');

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