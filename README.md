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
- **Pattern Database:** 58 patterns across 26 categories with weights 1-6 and 3 difficulty levels
- **Matching Engine:** `src/matchPattern.js` — Rule-based pattern matcher with LRU cache, UK/US term support, reverse stash matching
- **User Interface:** Web UI with form input, project cards, detail view, PDF export, gauge calculator, stash gallery, and full dark mode
- **User Accounts:** JWT-based auth with cloud sync for favorites and yarn stash
- **Visual Assets:** Hero images for all 58 patterns via Pixazo.ai FLUX.1-schnell, 900+ step images
- **Glossary:** 15+ crochet terms hyperlinked throughout with collapsible glossary section
- **Feedback Loop:** Per-project and global feedback forms stored in `data/feedback.json`
- **Yarn Management:** Photo label scanning, quick-add with yardage presets, stash gallery with filtering
- **Accessibility:** ARIA labels, screen-reader descriptions, keyboard-navigable, responsive mobile layout
- **Testing:** 13 test scenarios covering weight matching, difficulty, UK terms, edge cases

## Architecture
```
crochetkit-ai/
├── server.js                    # Express server with API endpoints
├── package.json
├── README.md
├── src/
│   ├── matchPattern.js          # Rule-based pattern matcher
│   ├── formatProjectOutput.js   # Formats matched patterns into project JSON
│   ├── termConverter.js         # Crochet terminology conversion (US/UK)
│   ├── generate_patterns_json.py # Python script to generate pattern data
│   └── test_matcher.js          # 13 test scenarios
├── data/
│   ├── patterns.json            # 58 patterns across 26 categories
│   ├── feedback.json            # User feedback on recommendations
│   ├── users.json               # User accounts (bcrypt hashed)
│   ├── match-count.json         # Usage tracking
│   ├── contacts.json            # Contact form submissions
│   └── popular.json             # Popular patterns cache
├── scripts/
│   └── generate_images.py       # Hero + step image generation (Pixazo.ai FLUX)
└── public/
    ├── index.html               # Web UI
    ├── style.css                # Styling (dark mode, responsive)
    ├── app.js                   # Frontend logic (auth, stash, gallery, gauge calc)
    └── glossary.json            # Crochet term definitions
```

## Running the App
```bash
npm install           # Install dependencies
npm start             # Start the server at http://localhost:3000
npm run generate      # Regenerate patterns.json from Python script
npm run generate-heroes  # Generate hero images for patterns
npm run generate-steps   # Generate step-by-step images
npm test              # Run the test suite (13 scenarios)
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

## Next Steps
1. **Content expansion** — Add more patterns for weight 2-3 (still underrepresented) and advanced difficulty
2. **Personalization** — Track user preferences over time, learn which categories they prefer
3. **Social features** — Share completed projects, pattern ratings from community
4. **Mobile app** — PWA or React Native wrapper for offline stash management
5. **Monetization** — Premium pattern bundles, affiliate yarn shopping links
