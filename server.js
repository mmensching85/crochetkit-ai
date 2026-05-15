const express = require('express');
const path = require('path');
const fs = require('fs');
const { matchPattern, invalidateCache } = require('./src/matchPattern');
const { formatProjectOutput } = require('./src/formatProjectOutput');
const patterns = require('./data/patterns.json');
const FEEDBACK_FILE = path.join(__dirname, 'data', 'feedback.json');
const MATCH_COUNT_FILE = path.join(__dirname, 'data', 'match-count.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON request bodies
app.use(express.json());

function getMatchCount() {
    try { return JSON.parse(fs.readFileSync(MATCH_COUNT_FILE, 'utf-8')).count || 0; }
    catch { return 0; }
}

function incrementMatchCount() {
    const count = getMatchCount() + 1;
    fs.writeFileSync(MATCH_COUNT_FILE, JSON.stringify({ count }), 'utf-8');
    return count;
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
        const raw = fs.readFileSync(FEEDBACK_FILE, 'utf-8');
        res.json(JSON.parse(raw));
    } catch {
        res.json([]);
    }
});

// Shareable pattern links
app.get('/p/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Admin feedback viewer
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`Crochet Project Planner server running at http://localhost:${PORT}`);
});