# CrochetKit AI Project Planner

## Project Goal
To provide beginner crocheters with personalized project recommendations based on their **available materials** — not just what they want to make. We invert the traditional approach: instead of "pick a project and buy the yarn," we ask "what do you already have?"

## Positioning & Differentiation

### The Core Insight
60-70% of yarn purchases never become finished projects. Beginners buy yarn they love, then feel paralyzed by choice when they get home. The traditional approach ("what do you want to make?") assumes beginners already know what's possible with their materials. They don't.

### Our Approach: Material-First Matching
| Traditional Apps | CrochetKit AI |
|---|---|
| "What do you want to make?" | "What do you have?" |
| Browse 10,000+ patterns | See 2-4 curated picks |
| Pattern assumes you know terms | Glossary hyperlinked in text |
| Buy new yarn for each project | Use what you already have |
| Sign up required | No account needed |

### Real Pain Points We Address
1. **Stash without a plan** — Users have yarn but no project. We match projects to their exact materials.
2. **Decision paralysis** — Too many choices = no choice. We show 2-4 realistic options.
3. **Unknown yardage requirements** — We tell you if you have enough yarn, or exactly what's missing.
4. **Patterns assume prior knowledge** — Every term is hyperlinked to a glossary definition. Visual descriptions walk through each step.
5. **Project abandonment** — By matching time commitment, skill level, and materials realistically, beginners finish what they start.

### Target Audience
- **New crocheters** who just bought their first hook and skein
- **Returnees** who learned once but haven't picked up a hook in years
- **Craft-store shoppers** who bought yarn without a plan
- **Stash-builders** who have accumulated yarn but never finish projects
- **Etsy/craft community sellers** looking for quick, reliable pattern sources

### Expansion Paths (Future)
- Knitting
- Embroidery
- Paper crafts
- Journaling
- DIY decor

## Current Status

### Completed
- **Phase 1 & 2 (Niche & Rules Defined):** Complete. Focus on beginner crochet, max 1-2 days, printable guides, excluding complex projects.
- **MVP Core Logic:** 
  - `src/matchPattern.js` — Rule-based pattern matcher that returns multiple top-scoring projects
  - `data/patterns.json` — 38 patterns across 16 categories
  - `src/formatProjectOutput.js` — Transforms matched data into the specified JSON schema
  - `src/test_matcher.js` — Test suite for pattern matching pipeline
- **User Interface:** 
  - Web UI with input form, multi-project card display, and detail view
  - "Select" to view full project details with steps, tips, visual descriptions, and glossary
  - "PDF" button to download each project as a printable document
- **Visual Guidance:** Enhanced textual descriptions for each step, explaining what each stitch should look like
- **Glossary:** 12 crochet terms hyperlinked throughout the text, with collapsible glossary section
- **PDF Export:** Generates print-ready PDFs with full project details, glossary, and styled layout
- **Pattern Catalog:** 38 beginner patterns across 16 categories with varying yarn weights and time commitments

## Architecture
```
crochetkit-ai/
├── server.js                    # Express server with API endpoints
├── package.json
├── README.md
├── src/
│   ├── matchPattern.js          # Rule-based pattern matcher
│   ├── formatProjectOutput.js   # Formats matched patterns into project JSON
│   ├── generate_patterns_json.py # Python script to generate pattern data
│   └── test_matcher.js          # Test scenarios
├── data/
│   └── patterns.json            # 38 beginner crochet patterns
└── public/
    ├── index.html               # Web UI
    ├── style.css                # Styling
    ├── app.js                   # Frontend logic
    └── glossary.json            # Crochet term definitions
```

## Running the App
```bash
npm install        # Install dependencies
npm start          # Start the server at http://localhost:3000
npm run generate   # Regenerate patterns.json from Python script
```

## Docker Deployment
```bash
# Build the Docker image
docker build -t crochetkit-ai .

# Run the container
docker run -d -p 3000:3000 --name crochetkit-ai crochetkit-ai

# View logs
docker logs crochetkit-ai

# Stop the container
docker stop crochetkit-ai
```

## Deployment to Cloud
### Fly.io
1. Install the [Fly CLI](https://fly.io/docs/hands-on/install-flyctl/)
2. Run `fly launch` in the project directory
3. Run `fly deploy`

### Railway
1. Push the repo to GitHub
2. Connect your repo on [Railway](https://railway.app/)
3. Set start command: `node server.js`
4. Deploy

### Render
1. Push the repo to GitHub
2. Create a new Web Service on [Render](https://render.com/)
3. Set start command: `node server.js`
4. Deploy

## CI/CD
A basic GitHub Actions workflow is included in `.github/workflows/ci.yml`. It runs tests on each push and pull request.

## Next Steps for LLMs / Collaborators
1. **Better Styling & Accessibility** — Refine CSS, make responsive, add ARIA labels, implement print view
2. **User Feedback Loop** — Add a rating/comment form and store feedback in `data/feedback.json`
3. **Monetize** — Free basic generation, paid advanced patterns, affiliate checkout, retailer integrations
4. **Documentation & Deployment** — Add Dockerfile, deployment steps, CI/CD
