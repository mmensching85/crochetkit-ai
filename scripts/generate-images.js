const fs = require('fs');
const path = require('path');

const patterns = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'patterns.json'), 'utf-8'));

function cleanPrompt(text) {
  return encodeURIComponent(text.replace(/[<>:"/\\|?*]/g, '').trim());
}

function pollinationsUrl(prompt) {
  return `https://image.pollinations.ai/prompt/${cleanPrompt(prompt)}`;
}

const YARN_DESCRIPTORS = {
  0: 'lace weight yarn',
  1: 'fingering weight yarn',
  2: 'sport weight yarn',
  3: 'DK weight yarn',
  4: 'worsted weight yarn',
  5: 'bulky yarn',
  6: 'super bulky yarn',
  7: 'jumbo yarn',
};

function generatePrompt(pattern) {
  const name = pattern.name;
  const cat = pattern.category;
  const yarn = pattern.materials?.yarn;
  const weightDesc = yarn ? (YARN_DESCRIPTORS[yarn.weightNumber] || yarn.weightCategory) : 'yarn';
  const fiber = yarn?.fiberType?.[0] || 'acrylic';

  let prompt;
  const isBeginner = pattern.difficulty?.level === 'beginner';
  const isBaby = cat.includes('Baby');
  const isHome = cat.includes('Coaster') || cat.includes('Dishcloth') || cat.includes('Home');

  if (isBaby) {
    prompt = `crochet ${name} ${cat} soft pastel ${fiber} ${weightDesc} baby item cute photography`;
  } else if (isHome) {
    prompt = `crochet ${name} ${cat} ${fiber} ${weightDesc} home decor flat lay photography`;
  } else if (cat === 'Toy' || cat === 'Amigurumi') {
    prompt = `crochet ${name} ${cat} stuffed animal ${fiber} ${weightDesc} cute toy photography`;
  } else if (cat === 'Scarf' || cat === 'Hat' || cat === 'Headband') {
    prompt = `crochet ${name} ${cat} ${fiber} ${weightDesc} wearable fashion item photography studio lighting`;
  } else if (cat === 'Bag' || cat === 'Tote') {
    prompt = `crochet ${name} ${cat} ${fiber} ${weightDesc} handcrafted bag flat lay photography`;
  } else {
    prompt = `crochet ${name} ${cat} ${fiber} ${weightDesc} finished project photography clean background`;
  }

  return pollinationsUrl(prompt);
}

let updated = 0;
for (const p of patterns) {
  const url = generatePrompt(p);
  if (p.imageUrl !== url) {
    p.imageUrl = url;
    updated++;
  }
}

fs.writeFileSync(
  path.join(__dirname, '..', 'data', 'patterns.json'),
  JSON.stringify(patterns, null, 2),
  'utf-8'
);

console.log(`Updated ${updated} of ${patterns.length} patterns with Pollinations image URLs.`);
