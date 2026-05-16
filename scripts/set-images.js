const fs = require('fs');
const path = require('path');

const patterns = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'patterns.json'), 'utf-8'));

// Curated Pexels photo IDs for each category
const CATEGORY_IMAGES = {
  'Scarf': { id: 215966, desc: 'woman wearing brown and white scarf' },
  'Hat': { id: 6712145, desc: 'woman in white coat with white knitted cap' },
  'Beanie': { id: 4723538, desc: 'woman wearing blue knit cap' },
  'Headband': { id: 4723538, desc: 'woman wearing blue knit cap' },
  'Blanket': { id: 30066882, desc: 'colorful crochet blanket on cozy indoor chair' },
  'Baby': { id: 30435352, desc: 'adorable baby lying on white blanket' },
  'Toy': { id: 4102835, desc: 'crocheted toys' },
  'Amigurumi': { id: 4102835, desc: 'crocheted toys' },
  'Bag': { id: 9695851, desc: 'close up shot of woven baskets' },
  'Tote': { id: 9695851, desc: 'close up shot of woven baskets' },
  'Dishcloth': { id: 7585855, desc: 'woman with white crochet napkin' },
  'Coaster': { id: 34151721, desc: 'colorful handmade crochet items' },
  'Shawl': { id: 1436134, desc: 'crochet scarf with fringe' },
  'Bookmark': { id: 34151721, desc: 'colorful handmade crochet items' },
  'Keychain': { id: 4102835, desc: 'crocheted toys' },
  'Wristband': { id: 34151721, desc: 'colorful handmade crochet items' },
  'Home Decor': { id: 30066882, desc: 'colorful crochet blanket' },
  'Mug cozy': { id: 34151721, desc: 'colorful handmade crochet items' },
  'Small plant hanger': { id: 9695851, desc: 'woven baskets' },
  'Water bottle holder': { id: 9695851, desc: 'woven baskets' },
  'Eyeglass case': { id: 34151721, desc: 'colorful handmade crochet items' },
  'Cell phone case': { id: 34151721, desc: 'colorful handmade crochet items' },
  'Simple pouch': { id: 34151721, desc: 'colorful handmade crochet items' },
  'Granny square': { id: 34151721, desc: 'colorful handmade crochet items' },
  'Garment': { id: 215966, desc: 'scarf' },
  'Accessories': { id: 34151721, desc: 'colorful handmade crochet items' },
};

function pexelsUrl(photoId) {
  return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=600`;
}

function findImage(pattern) {
  // Try exact category match first
  const cat = pattern.category;
  if (CATEGORY_IMAGES[cat]) return pexelsUrl(CATEGORY_IMAGES[cat].id);

  // Try partial match
  for (const [key, val] of Object.entries(CATEGORY_IMAGES)) {
    if (cat.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(cat.toLowerCase())) {
      return pexelsUrl(val.id);
    }
  }

  // Fallback: general crochet image
  return pexelsUrl(34151721);
}

let updated = 0;
for (const p of patterns) {
  const url = findImage(p);
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

console.log(`Updated ${updated} of ${patterns.length} patterns with curated Pexels image URLs.`);
console.log('Categories mapped:', Object.keys(CATEGORY_IMAGES).length);
