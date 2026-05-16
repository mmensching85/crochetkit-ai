const fs = require('fs');
const patterns = require('../data/patterns.json');

const newPatterns = [
  // --- WEIGHT 2 (Fine/Sport) ---
  {
    "id": "pattern-fine-001",
    "name": "Lace Wrist Warmers",
    "shortDescription": "Delicate fingerless mitts using sport-weight yarn. A quick, elegant project that's perfect for cooler mornings.",
    "category": "Accessories",
    "difficulty": { "level": "intermediate", "score": 3, "reasoning": "Uses double crochet and chain-spacing for a lacy look; requires consistent tension and stitch counting." },
    "estimatedTime": { "minHours": 2, "maxHours": 3, "unit": "hours", "assumedSkill": "Intermediate" },
    "materials": {
      "yarn": { "weightCategory": "2 (Fine/Sport)", "weightNumber": 2, "suggestedYardageMin": 100, "suggestedYardageMax": 150, "fiberType": ["Merino", "Alpaca", "Acrylic blend"], "notes": "A smooth sport-weight yarn gives the best stitch definition." },
      "hook": { "sizeMM": 4, "sizeUS": "G-6", "sizeUK": "8", "notes": "Use the smaller end if using an ergonomic hook." },
      "notions": ["Yarn needle", "Scissors", "Stitch markers"]
    },
    "gauge": { "stitches": 20, "rows": 12, "unit": "4 inches", "stitchPattern": "double crochet", "notes": "Gauge is important for fit." },
    "instructions": [
      "**Foundation Chain:** Chain 28, slip stitch to form a ring, being careful not to twist.",
      "**Round 1:** Chain 3 (counts as dc), double crochet in next chain and each around, slip stitch to top of chain-3. (28 dc)",
      "**Round 2-6:** Chain 3, double crochet in each stitch around, slip stitch to join. (28 dc each round)",
      "**Thumb Opening Round 7:** Chain 3, double crochet in next 5 stitches, chain 4, skip 4 stitches, double crochet in remaining 18 stitches, slip stitch to join.",
      "**Round 8-10:** Chain 3, double crochet in each stitch and in each chain of the thumb opening, slip stitch to join. (28 dc)",
      "**Edging:** Chain 1, single crochet in each stitch around, slip stitch to join. Fasten off. Repeat for second wrist warmer."
    ],
    "beginnerTips": ["Mark the first stitch of each round so you don't lose your place.", "Count your stitches after the thumb opening round."],
    "commonMistakes": ["Twisting the foundation chain when joining.", "Making the thumb opening too tight—chain loosely."],
    "keywords": ["wrist warmers", "fingerless gloves", "lace", "accessories", "intermediate", "sport weight"]
  },
  {
    "id": "pattern-fine-002",
    "name": "Sport-Weight Baby Booties",
    "shortDescription": "Adorable newborn booties using fine sport-weight yarn. Makes a wonderful baby shower gift.",
    "category": "Baby",
    "difficulty": { "level": "intermediate", "score": 3, "reasoning": "Includes increases, decreases, and seaming; requires attention to shaping." },
    "estimatedTime": { "minHours": 1.5, "maxHours": 2.5, "unit": "hours", "assumedSkill": "Intermediate" },
    "materials": {
      "yarn": { "weightCategory": "2 (Fine/Sport)", "weightNumber": 2, "suggestedYardageMin": 80, "suggestedYardageMax": 120, "fiberType": ["Cotton", "Acrylic", "Baby yarn"], "notes": "Soft, washable yarn is best for baby items." },
      "hook": { "sizeMM": 3.5, "sizeUS": "E-4", "sizeUK": "9", "notes": "A smaller hook creates a denser fabric for booties." },
      "notions": ["Yarn needle", "Scissors", "Two small buttons (optional)"]
    },
    "gauge": { "stitches": 22, "rows": 14, "unit": "4 inches", "stitchPattern": "single crochet", "notes": "Match gauge for correct size." },
    "instructions": [
      "**Sole:** Chain 8. Single crochet in 2nd chain from hook and next 5 chains, 3 sc in last chain. Working on opposite side, sc in next 5 chains, 2 sc in last chain. (16 sc)",
      "**Sole Round 2:** Sc in each stitch around, increasing 1 stitch at each end (18 sc).",
      "**Sole Round 3:** Sc in each stitch around, increasing 1 stitch at each end (20 sc). Fasten off.",
      "**Upper:** Join yarn in center back of sole. Sc in each stitch around for 5 rounds working in back loops only.",
      "**Toe Decrease:** Fold bootie flat. Sc decrease across the toe section 3 times, sc to end. (17 sc)",
      "**Cuff:** Chain 6, sc in 2nd chain from hook and next 4 chains. Slip stitch into next stitch of bootie. Turn, sc in back loop of each cuff stitch. Repeat around for 3 rounds. Fasten off, sew button to cuff if desired."
    ],
    "beginnerTips": ["Use a stitch marker to keep track of rounds.", "Weave in ends as you go to save time later."],
    "commonMistakes": ["Using the wrong loop (work in back loops only for the upper).", "Skipping the gauge swatch—booties need to fit."],
    "keywords": ["booties", "baby", "sport weight", "intermediate", "gift", "newborn"]
  },
  // --- WEIGHT 3 (DK/Light) ---
  {
    "id": "pattern-dk-001",
    "name": "DK Triangle Shawl",
    "shortDescription": "A classic top-down triangle shawl using DK weight yarn. Lightweight and perfect for spring evenings.",
    "category": "Shawl",
    "difficulty": { "level": "intermediate", "score": 3, "reasoning": "Uses increases, double crochet, and chain-space patterns; requires counting and pattern repetition." },
    "estimatedTime": { "minHours": 4, "maxHours": 6, "unit": "hours", "assumedSkill": "Intermediate" },
    "materials": {
      "yarn": { "weightCategory": "3 (DK/Light)", "weightNumber": 3, "suggestedYardageMin": 350, "suggestedYardageMax": 500, "fiberType": ["Cotton", "Bamboo", "Acrylic blend"], "notes": "A soft drapey yarn works best for shawls." },
      "hook": { "sizeMM": 4.5, "sizeUS": "7", "sizeUK": "7", "notes": "A slightly larger hook gives better drape." },
      "notions": ["Yarn needle", "Scissors", "Stitch markers"]
    },
    "gauge": { "stitches": 16, "rows": 8, "unit": "4 inches", "stitchPattern": "double crochet", "notes": "Gauge affects final size and drape." },
    "instructions": [
      "**Center Top:** Chain 4, double crochet in 4th chain from hook. (2 dc)",
      "**Row 1:** Chain 4 (counts as dc + ch1), dc in same stitch, chain 1, dc in same stitch. (4 dc, 2 ch-1 spaces)",
      "**Row 2:** Chain 4, (dc, ch1, dc) in first ch-1 space, ch1, (dc, ch1, dc) in next ch-1 space, dc in top of chain-3. (6 dc, 4 ch-1 spaces)",
      "**Row 3:** Chain 4, dc in first space. *(dc, ch1, dc) in next ch-1 space* repeat across, ending with dc in last space and dc in top of chain-3.",
      "**Repeat Row 3:** Continue until shawl reaches desired size (about 24-30 rows).",
      "**Edging:** Single crochet evenly around all edges, working 3 sc in each corner. Fasten off, weave in ends."
    ],
    "beginnerTips": ["Use stitch markers on the first and last stitch of each row.", "Block the finished shawl to open up the lace pattern."],
    "commonMistakes": ["Forgetting the chain-1 between increases.", "Uneven edges—make sure to dc in the top of the turning chain."],
    "keywords": ["shawl", "triangle", "lace", "DK", "spring", "intermediate"]
  },
  {
    "id": "pattern-dk-002",
    "name": "Lightweight Pullover Sweater",
    "shortDescription": "A beginner-friendly crochet sweater made from two simple rectangles seamed together. DK weight keeps it lightweight.",
    "category": "Sweater",
    "difficulty": { "level": "intermediate", "score": 4, "reasoning": "Requires seaming, gauge matching, and understanding of garment construction." },
    "estimatedTime": { "minHours": 6, "maxHours": 10, "unit": "hours", "assumedSkill": "Intermediate" },
    "materials": {
      "yarn": { "weightCategory": "3 (DK/Light)", "weightNumber": 3, "suggestedYardageMin": 600, "suggestedYardageMax": 900, "fiberType": ["Cotton", "Acrylic", "Wool blend"], "notes": "Choose a yarn with good drape for a flattering fit." },
      "hook": { "sizeMM": 5, "sizeUS": "H-8", "sizeUK": "6", "notes": "Using a slightly larger hook than recommended gives better drape." },
      "notions": ["Yarn needle", "Scissors", "Measuring tape", "Stitch markers"]
    },
    "gauge": { "stitches": 18, "rows": 10, "unit": "4 inches", "stitchPattern": "double crochet", "notes": "Gauge is critical for correct sizing." },
    "instructions": [
      "**Back Panel:** Chain 60 (adjust for your size). Double crochet in 3rd chain from hook and each across. (58 dc)",
      "**Work Even:** Chain 3, turn. Double crochet in each stitch across. Repeat for 40 rows or until panel reaches underarm.",
      "**Shoulder Decrease:** Chain 3, dc across first 20 stitches. Fasten off. Skip center 18 stitches, join yarn in next stitch, chain 3, dc across last 20 stitches. Fasten off.",
      "**Front Panel:** Repeat same as back until 30 rows. For neck opening: work 20 dc, chain 18 (skip center 18 stitches for neck), dc across last 20 stitches. Continue for 10 more rows.",
      "**Seaming:** With right sides together, sew shoulder seams and side seams using the mattress stitch or whip stitch.",
      "**Sleeves:** Optional: pick up stitches around armholes and work in rounds of double crochet for desired sleeve length. Fasten off, weave in ends."
    ],
    "beginnerTips": ["Make a gauge swatch and measure it before starting.", "Try on the panels as you go to check sizing."],
    "commonMistakes": ["Wrong gauge leading to incorrect size.", "Sewing seams too tightly, restricting movement."],
    "keywords": ["sweater", "pullover", "garment", "DK", "intermediate", "wearable"]
  },
  {
    "id": "pattern-dk-003",
    "name": "Crochet Market Tote",
    "shortDescription": "A sturdy market bag using DK cotton yarn. The mesh pattern stretches to hold groceries while being compact when folded.",
    "category": "Bag",
    "difficulty": { "level": "intermediate", "score": 3, "reasoning": "Uses mesh stitch pattern and working in the round; requires attention to the repeat." },
    "estimatedTime": { "minHours": 3, "maxHours": 5, "unit": "hours", "assumedSkill": "Intermediate" },
    "materials": {
      "yarn": { "weightCategory": "3 (DK/Light)", "weightNumber": 3, "suggestedYardageMin": 250, "suggestedYardageMax": 350, "fiberType": ["Cotton", "Recycled cotton", "Linen blend"], "notes": "Cotton gives the bag structure and durability." },
      "hook": { "sizeMM": 4.5, "sizeUS": "7", "sizeUK": "7", "notes": "A slightly larger hook creates a more open mesh." },
      "notions": ["Yarn needle", "Scissors", "Stitch marker"]
    },
    "gauge": { "stitches": 14, "rows": 8, "unit": "4 inches", "stitchPattern": "mesh pattern", "notes": "Gauge is not critical for this bag." },
    "instructions": [
      "**Base:** Chain 36, slip stitch to join. Chain 1, sc in each chain around. (36 sc)",
      "**Round 1:** Chain 4 (counts as dc + ch1), skip 1 stitch, dc in next. Repeat around, slip stitch to 3rd chain of ch-4. (18 dc, 18 ch-1 spaces)",
      "**Round 2:** Chain 4, dc in next dc. Repeat around, slip stitch to join. Continue this mesh pattern for 20 rounds.",
      "**Top Band:** Chain 1, sc in each stitch and chain space around for 3 rounds. (36 sc each round)",
      "**Handles:** Chain 50, skip 12 sc, slip stitch in next sc. Sc in each chain and sc around. Chain 50, skip remaining 12 sc, slip stitch to first sc. Sc in each chain and sc around. Fasten off, weave in ends."
    ],
    "beginnerTips": ["Use a stitch marker to track the start of each round.", "Cotton yarn has less stretch—make handles generously long."],
    "commonMistakes": ["Twisting the base chain when joining.", "Making handles too short to go over the shoulder."],
    "keywords": ["market bag", "tote", "mesh", "cotton", "DK", "eco-friendly"]
  },
  {
    "id": "pattern-dk-004",
    "name": "Striped Mug Cozy",
    "shortDescription": "A cheerful striped mug cozy in DK yarn. Quick to make and customizable with your favorite colors.",
    "category": "Mug cozy",
    "difficulty": { "level": "beginner", "score": 1, "reasoning": "Uses only single crochet and simple color changes. No shaping required." },
    "estimatedTime": { "minHours": 0.5, "maxHours": 1, "unit": "hours", "assumedSkill": "Beginner" },
    "materials": {
      "yarn": { "weightCategory": "3 (DK/Light)", "weightNumber": 3, "suggestedYardageMin": 30, "suggestedYardageMax": 50, "fiberType": ["Cotton", "Acrylic"], "notes": "Cotton is best for heat resistance. Use small amounts of 2-3 colors." },
      "hook": { "sizeMM": 4, "sizeUS": "G-6", "sizeUK": "8", "notes": "Use the size recommended on your yarn label." },
      "notions": ["Yarn needle", "Scissors", "Button (1 inch)", "Sewing needle and thread"]
    },
    "gauge": { "stitches": 18, "rows": 16, "unit": "4 inches", "stitchPattern": "single crochet", "notes": "Gauge is not critical." },
    "instructions": [
      "**Band:** Chain 9. Single crochet in 2nd chain from hook and each across. (8 sc)",
      "**Row 2-30:** Chain 1, turn. Sc in back loop only of each stitch across. (8 sc) Change colors every 5 rows for stripes.",
      "**Finishing:** Fold band around mug. Sew button on one end. Chain 6 at the other end for a button loop. Button loop should fit snugly around the button.",
      "Weave in all ends."
    ],
    "beginnerTips": ["Use a button that matches one of your yarn colors.", "Work a gauge swatch if you want a custom fit for a specific mug."],
    "commonMistakes": ["Making the band too tight—it should wrap around with a slight overlap.", "Forgetting to leave a button opening."],
    "keywords": ["mug cozy", "coffee", "tea", "beginner", "striped", "quick", "gift"]
  },
  // --- WEIGHT 4 (Medium) - new categories ---
  {
    "id": "pattern-slippers-001",
    "name": "Cozy House Slippers",
    "shortDescription": "Warm, sturdy house slippers made with worsted weight yarn. The double-thick sole keeps your feet off cold floors.",
    "category": "Slippers",
    "difficulty": { "level": "intermediate", "score": 3, "reasoning": "Requires shaping, increasing, and decreasing for the heel and toe." },
    "estimatedTime": { "minHours": 3, "maxHours": 4, "unit": "hours", "assumedSkill": "Intermediate" },
    "materials": {
      "yarn": { "weightCategory": "4 (Medium)", "weightNumber": 4, "suggestedYardageMin": 200, "suggestedYardageMax": 300, "fiberType": ["Acrylic", "Wool", "Acrylic/Wool blend"], "notes": "A sturdy, washable yarn works best for slippers." },
      "hook": { "sizeMM": 5, "sizeUS": "H-8", "sizeUK": "6", "notes": "Use the recommended hook size for your yarn." },
      "notions": ["Yarn needle", "Scissors", "Stitch markers", "Fabric glue or non-slip fabric paint (optional)"]
    },
    "gauge": { "stitches": 16, "rows": 12, "unit": "4 inches", "stitchPattern": "half double crochet", "notes": "Gauge is important for correct fit." },
    "instructions": [
      "**Sole:** Chain 12. 2 hdc in 3rd chain from hook, hdc in next 9 chains, 5 hdc in last chain. Working on opposite side: hdc in next 9 chains, 3 hdc in last chain. Join with slip stitch. (28 hdc)",
      "**Sole Round 2:** Chain 2, hdc in same stitch, 2 hdc in next stitch, hdc in next 9 stitches, (2 hdc in next)*5 times, hdc in next 9 stitches, (2 hdc in next)*3 times. Join. (38 hdc)",
      "**Sides:** Chain 2, hdc in back loop only of each stitch around. Join. (38 hdc)",
      "**Sides Round 2-5:** Chain 2, hdc in each stitch around. Join. (38 hdc each round)",
      "**Heel:** Chain 2, hdc in next 10 stitches. Turn. Hdc decrease, hdc in next 6, hdc decrease. Turn. Repeat decrease row 3 times. Fasten off.",
      "**Cuff:** Join yarn at heel. Chain 2, hdc around the top opening for 4 rounds. Fasten off. Repeat for second slipper."
    ],
    "beginnerTips": ["Use stitch markers to count increases on the sole.", "Test fit as you go—adjust length by adding or removing chains on the sole."],
    "commonMistakes": ["Making the sole too flat—the increase rounds are important for the foot shape.", "Forgetting to work in back loops only for the side walls."],
    "keywords": ["slippers", "house shoes", "warm", "worsted", "intermediate", "footwear"]
  },
  {
    "id": "pattern-poncho-001",
    "name": "Simple Beginner Poncho",
    "shortDescription": "A cozy poncho made from two large rectangles sewn together. Extremely beginner-friendly and forgiving of gauge.",
    "category": "Poncho",
    "difficulty": { "level": "beginner", "score": 1, "reasoning": "Uses only double crochet and simple seaming. No shaping or increases." },
    "estimatedTime": { "minHours": 3, "maxHours": 5, "unit": "hours", "assumedSkill": "Beginner" },
    "materials": {
      "yarn": { "weightCategory": "4 (Medium)", "weightNumber": 4, "suggestedYardageMin": 400, "suggestedYardageMax": 600, "fiberType": ["Acrylic", "Wool blend", "Chunky blend"], "notes": "A soft, drapey worsted weight yarn works great." },
      "hook": { "sizeMM": 6, "sizeUS": "J-10", "sizeUK": "4", "notes": "A larger hook gives the poncho better drape." },
      "notions": ["Yarn needle", "Scissors", "Measuring tape"]
    },
    "gauge": { "stitches": 12, "rows": 8, "unit": "4 inches", "stitchPattern": "double crochet", "notes": "Gauge is not critical for this garment." },
    "instructions": [
      "**Panel 1 (Front):** Chain 50. Double crochet in 3rd chain from hook and each across. (48 dc)",
      "**Row 2:** Chain 3, turn. Dc in each stitch across. Repeat for 40 rows or until panel measures about 20 inches.",
      "**Panel 2 (Back):** Repeat the same as Panel 1.",
      "**Seaming:** Fold each panel in half. Sew the top edge of each panel together, leaving an 8-inch opening in the center for the neck.",
      "**Neck Edging:** Join yarn at neck edge. Single crochet evenly around the neck opening. Fasten off.",
      "**Fringe (optional):** Cut 10-inch yarn strands. Fold each in half, pull through bottom edge stitches, and pull ends through loop. Space fringe every 2 stitches around the bottom. Weave in all ends."
    ],
    "beginnerTips": ["Block both panels before seaming for a professional look.", "Try the poncho on before adding fringe to check the length."],
    "commonMistakes": ["Making the neck opening too small—measure your head circumference.", "Uneven panels—count rows carefully."],
    "keywords": ["poncho", "beginner", "rectangle", "warm", "gift", "worsted"]
  },
  {
    "id": "pattern-basket-001",
    "name": "Rope Storage Basket",
    "shortDescription": "A sturdy storage basket made by crocheting with t-shirt yarn or triple-strand worsted weight. Perfect for organizing shelves.",
    "category": "Home Decor",
    "difficulty": { "level": "beginner", "score": 2, "reasoning": "Uses single crochet worked in a spiral; requires consistent tension for straight sides." },
    "estimatedTime": { "minHours": 2, "maxHours": 4, "unit": "hours", "assumedSkill": "Beginner" },
    "materials": {
      "yarn": { "weightCategory": "4 (Medium)", "weightNumber": 4, "suggestedYardageMin": 300, "suggestedYardageMax": 500, "fiberType": ["Cotton", "T-shirt yarn", "Recycled cotton"], "notes": "For a sturdier basket, hold 2-3 strands of worsted weight together." },
      "hook": { "sizeMM": 6, "sizeUS": "J-10", "sizeUK": "4", "notes": "Use a larger hook if holding multiple strands." },
      "notions": ["Yarn needle", "Scissors", "Stitch marker"]
    },
    "gauge": { "stitches": 12, "rows": 10, "unit": "4 inches", "stitchPattern": "single crochet", "notes": "Gauge affects stiffness—tighter is better for baskets." },
    "instructions": [
      "**Base:** Make a magic ring. Round 1: 6 sc in ring. (6 sc)",
      "**Round 2:** 2 sc in each stitch around. (12 sc)",
      "**Round 3:** *Sc in next stitch, 2 sc in next* repeat around. (18 sc)",
      "**Round 4:** *Sc in next 2 stitches, 2 sc in next* repeat around. (24 sc)",
      "**Round 5-7:** Continue increasing 6 stitches each round until base is desired diameter (about 6-7 rounds total).",
      "**Sides:** Sc in back loop only of each stitch around for 8 rounds. Switch to both loops for 4 more rounds.",
      "**Edging:** Slip stitch in each stitch around. Fasten off, weave in ends."
    ],
    "beginnerTips": ["Use a stitch marker to track rounds when working in a spiral.", "Hold two strands together for a sturdier basket."],
    "commonMistakes": ["Crocheting too loosely—tight tension gives the basket structure.", "Not increasing enough on the base—it should lie flat."],
    "keywords": ["basket", "storage", "home", "beginner", "organization", "rope"]
  },
  {
    "id": "pattern-potholder-001",
    "name": "Thick Cotton Potholder",
    "shortDescription": "A double-thick potholder using cotton yarn. The thermal stitch creates an insulating layer for kitchen safety.",
    "category": "Dishcloth",
    "difficulty": { "level": "beginner", "score": 1, "reasoning": "Uses only single crochet worked through the back loop. No shaping." },
    "estimatedTime": { "minHours": 1, "maxHours": 1.5, "unit": "hours", "assumedSkill": "Beginner" },
    "materials": {
      "yarn": { "weightCategory": "4 (Medium)", "weightNumber": 4, "suggestedYardageMin": 80, "suggestedYardageMax": 120, "fiberType": ["Cotton"], "notes": "Use 100% cotton—acrylic will melt with heat!" },
      "hook": { "sizeMM": 5, "sizeUS": "H-8", "sizeUK": "6", "notes": "Use the size recommended on the yarn." },
      "notions": ["Yarn needle", "Scissors"]
    },
    "gauge": { "stitches": 16, "rows": 14, "unit": "4 inches", "stitchPattern": "thermal stitch", "notes": "Gauge is not critical." },
    "instructions": [
      "**Foundation:** Chain 26.",
      "**Row 1:** Single crochet in 2nd chain from hook and each across. (25 sc)",
      "**Row 2:** Chain 1, turn. Sc in back loop only of each stitch across. (25 sc)",
      "**Rows 3-24:** Repeat Row 2. The fabric will be double-thick and dense.",
      "**Hanging Loop:** Chain 12, slip stitch to the corner of the potholder. Sc in each chain back. Fasten off.",
      "**Finishing:** Fold a second matching potholder (make two total). Sc around the edges to join them, working 3 sc in corners for a neat finish. Weave in ends."
    ],
    "beginnerTips": ["Cotton is mandatory—never use acrylic for potholders.", "Work tightly for better insulation."],
    "commonMistakes": ["Using acrylic yarn that can melt.", "Crocheting too loosely—the potholder should be dense."],
    "keywords": ["potholder", "kitchen", "cotton", "beginner", "thermal", "functional"]
  },
  {
    "id": "pattern-scrunchie-001",
    "name": "Quick Velvet Scrunchies",
    "shortDescription": "Luxurious velvet scrunchies that work up in minutes. Great for using small amounts of specialty yarn.",
    "category": "Accessories",
    "difficulty": { "level": "beginner", "score": 1, "reasoning": "Uses only single crochet worked around a hair elastic. Straightforward and fast." },
    "estimatedTime": { "minHours": 0.25, "maxHours": 0.5, "unit": "hours", "assumedSkill": "Beginner" },
    "materials": {
      "yarn": { "weightCategory": "4 (Medium)", "weightNumber": 4, "suggestedYardageMin": 10, "suggestedYardageMax": 20, "fiberType": ["Velvet", "Acrylic", "Cotton"], "notes": "Velvet or soft acrylic gives the best look. Use scraps." },
      "hook": { "sizeMM": 4, "sizeUS": "G-6", "sizeUK": "8", "notes": "A smaller hook makes denser scrunchies." },
      "notions": ["Hair elastic (standard size)", "Yarn needle", "Scissors"]
    },
    "gauge": { "stitches": 0, "rows": 0, "unit": "N/A", "stitchPattern": "N/A", "notes": "Gauge is not relevant." },
    "instructions": [
      "**Setup:** Hold hair elastic with your fingers. Insert hook through the elastic, yarn over and pull up a loop.",
      "**Round 1:** Single crochet around the elastic, covering it completely. Work about 30-40 sc depending on your tension.",
      "**Round 2:** Slip stitch to join. Chain 1, 2 sc in each stitch around. (60-80 sc)",
      "**Round 3:** Sc in each stitch around. Fasten off, leaving a long tail.",
      "**Finishing:** Sew the ends together neatly using the yarn tail. Weave in all ends. Fluff the scrunchie."
    ],
    "beginnerTips": ["Use a tapestry needle to sew the ends together invisibly.", "Experiment with different yarn textures for different looks."],
    "commonMistakes": ["Crocheting too tightly around the elastic—it should stretch.", "Not covering the elastic completely in the first round."],
    "keywords": ["scrunchie", "hair", "accessories", "beginner", "quick", "scrap yarn"]
  },
  // --- WEIGHT 5 (Bulky) ---
  {
    "id": "pattern-bulky-002",
    "name": "Bulky Beanies",
    "shortDescription": "A quick-to-make beanie using bulky yarn. Works up in under an hour for instant gratification.",
    "category": "Hat",
    "difficulty": { "level": "beginner", "score": 1, "reasoning": "Uses half double crochet in the round with simple decreases at the crown." },
    "estimatedTime": { "minHours": 0.5, "maxHours": 1, "unit": "hours", "assumedSkill": "Beginner" },
    "materials": {
      "yarn": { "weightCategory": "5 (Bulky)", "weightNumber": 5, "suggestedYardageMin": 80, "suggestedYardageMax": 120, "fiberType": ["Acrylic", "Wool blend", "Bulky acrylic"], "notes": "A single skein of bulky yarn is usually enough." },
      "hook": { "sizeMM": 8, "sizeUS": "L-11", "sizeUK": "0", "notes": "Use a larger hook for a looser fabric." },
      "notions": ["Yarn needle", "Scissors", "Stitch marker"]
    },
    "gauge": { "stitches": 10, "rows": 8, "unit": "4 inches", "stitchPattern": "half double crochet", "notes": "Gauge is important for fit." },
    "instructions": [
      "**Magic Ring:** Make a magic ring, chain 2 (does not count as stitch).",
      "**Round 1:** 8 hdc in ring, pull tight, join with slip stitch. (8 hdc)",
      "**Round 2:** Chain 2, 2 hdc in each stitch around, join. (16 hdc)",
      "**Round 3:** Chain 2, *hdc in next stitch, 2 hdc in next* repeat around, join. (24 hdc)",
      "**Round 4:** Chain 2, *hdc in next 2 stitches, 2 hdc in next* repeat around, join. (32 hdc)",
      "**Round 5-10:** Chain 2, hdc in each stitch around, join. (32 hdc each round)",
      "**Ribbed Brim:** Chain 1, sc in back loop only of each stitch for 3 rounds. Fasten off. Weave in ends. Add pom-pom if desired."
    ],
    "beginnerTips": ["Use a stitch marker to track the first stitch of each round.", "Try the beanie on as you go to check the fit."],
    "commonMistakes": ["Increasing too much—the crown should lie flat, not ruffle.", "Making the hat too tall—bulky yarn stacks up fast."],
    "keywords": ["beanie", "hat", "bulky", "quick", "beginner", "pom-pom"]
  },
  {
    "id": "pattern-bulky-003",
    "name": "Bulky Cowl Neck Warmer",
    "shortDescription": "A stylish infinity cowl worked in bulky yarn. The half double crochet creates a warm, dense fabric perfect for winter.",
    "category": "Scarf",
    "difficulty": { "level": "beginner", "score": 1, "reasoning": "Uses only half double crochet worked in joined rounds. No increases or decreases." },
    "estimatedTime": { "minHours": 0.5, "maxHours": 1.5, "unit": "hours", "assumedSkill": "Beginner" },
    "materials": {
      "yarn": { "weightCategory": "5 (Bulky)", "weightNumber": 5, "suggestedYardageMin": 80, "suggestedYardageMax": 150, "fiberType": ["Acrylic", "Wool blend", "Bulky acrylic"], "notes": "One to two skeins of bulky yarn, depending on desired length." },
      "hook": { "sizeMM": 8, "sizeUS": "L-11", "sizeUK": "0", "notes": "A larger hook keeps the fabric from being too stiff." },
      "notions": ["Yarn needle", "Scissors", "Stitch marker"]
    },
    "gauge": { "stitches": 10, "rows": 8, "unit": "4 inches", "stitchPattern": "half double crochet", "notes": "Gauge is not critical for this project." },
    "instructions": [
      "**Foundation:** Chain 26, slip stitch to join, being careful not to twist.",
      "**Round 1:** Chain 2 (does not count as hdc). Hdc in each chain around, slip stitch to first hdc. (26 hdc)",
      "**Round 2-15:** Chain 2, hdc in each stitch around, slip stitch to join. Repeat until cowl reaches desired width (about 10-12 inches).",
      "**Finishing:** Fasten off and weave in ends. Block gently if desired."
    ],
    "beginnerTips": ["Use a stitch marker to mark the first stitch of each round.", "Block the cowl lightly to even out the stitches."],
    "commonMistakes": ["Twisting the foundation chain when joining—lay it flat first.", "Crocheting too tightly—bulky yarn needs a relaxed tension."],
    "keywords": ["cowl", "infinity", "neck warmer", "bulky", "beginner", "winter"]
  },
  {
    "id": "pattern-bulky-004",
    "name": "Chunky Throw Pillow",
    "shortDescription": "A super-chunky throw pillow cover using bulky yarn. The simple rectangle folds into a pillow cover with an envelope back.",
    "category": "Home Decor",
    "difficulty": { "level": "beginner", "score": 1, "reasoning": "Uses only double crochet worked as a rectangle. No shaping or seaming." },
    "estimatedTime": { "minHours": 2, "maxHours": 3, "unit": "hours", "assumedSkill": "Beginner" },
    "materials": {
      "yarn": { "weightCategory": "5 (Bulky)", "weightNumber": 5, "suggestedYardageMin": 200, "suggestedYardageMax": 300, "fiberType": ["Acrylic", "Polyester", "Wool blend"], "notes": "Bulky chenille or chunky acrylic gives a soft, plush feel." },
      "hook": { "sizeMM": 9, "sizeUS": "M-13", "sizeUK": "00", "notes": "A larger hook creates a softer, drapier fabric." },
      "notions": ["Yarn needle", "Scissors", "16-inch pillow form", "Buttons (3 large, optional)"]
    },
    "gauge": { "stitches": 8, "rows": 6, "unit": "4 inches", "stitchPattern": "double crochet", "notes": "Gauge affects final pillow size." },
    "instructions": [
      "**Main Panel:** Chain 26. Double crochet in 3rd chain from hook and each across. (24 dc)",
      "**Rows 2-20:** Chain 3, turn. Dc in each stitch across. (24 dc each row)",
      "**Fold and Seam:** Fold the rectangle in half. Whip stitch the bottom and one side closed.",
      "**Envelope Back:** For a removable cover: crochet a second rectangle of the same size. Attach along the bottom edge only. Add button loops along the open side.",
      "**Finishing:** Insert pillow form. If using buttons, sew them opposite the button loops. Weave in all ends."
    ],
    "beginnerTips": ["Measure your pillow form and adjust the chain length as needed.", "Block the panel before seaming for a professional finish."],
    "commonMistakes": ["Making the panel too small—measure against the pillow form.", "Using a hook that's too small, making stiff fabric that doesn't drape."],
    "keywords": ["pillow", "throw", "home decor", "bulky", "beginner", "chunky"]
  },
  // --- WEIGHT 6 (Super Bulky) ---
  {
    "id": "pattern-superbulky-001",
    "name": "Super Bulky Arm Knit Blanket",
    "shortDescription": "A luxurious hand-crocheted blanket using super bulky yarn. Works up incredibly fast—perfect for last-minute gifts.",
    "category": "Blanket",
    "difficulty": { "level": "beginner", "score": 1, "reasoning": "Uses only single crochet with giant yarn. The technique is simple but requires arm strength." },
    "estimatedTime": { "minHours": 2, "maxHours": 4, "unit": "hours", "assumedSkill": "Beginner" },
    "materials": {
      "yarn": { "weightCategory": "6 (Super Bulky)", "weightNumber": 6, "suggestedYardageMin": 300, "suggestedYardageMax": 500, "fiberType": ["Acrylic", "Polyester blend", "Merino"], "notes": "Use jumbo or super bulky yarn. You can also hold 3-4 strands of bulky together." },
      "hook": { "sizeMM": 15, "sizeUS": "P/Q", "sizeUK": "N/A", "notes": "Use a giant hook (15mm or larger). Or crochet with your hands!" },
      "notions": ["Yarn needle", "Scissors"]
    },
    "gauge": { "stitches": 5, "rows": 4, "unit": "4 inches", "stitchPattern": "single crochet", "notes": "Gauge is not critical for a blanket." },
    "instructions": [
      "**Foundation:** Chain 40 (or any width desired).",
      "**Row 1:** Single crochet in 2nd chain from hook and each across. (39 sc)",
      "**Row 2:** Chain 1, turn. Sc in each stitch across. (39 sc)",
      "**Rows 3-20:** Repeat Row 2 until the blanket reaches desired length (about 20-25 rows for a throw).",
      "**Border:** Single crochet evenly around all edges, working 3 sc in each corner. Fasten off.",
      "**Finishing:** Weave in ends with a large yarn needle. Block gently if needed."
    ],
    "beginnerTips": ["This project is heavy—support the weight as you work.", "Count stitches every few rows since mistakes are visible in giant yarn."],
    "commonMistakes": ["Using regular-weight yarn instead of super bulky—the look won't be the same.", "Forgetting that this blanket is heavy when finished."],
    "keywords": ["blanket", "super bulky", "quick", "jumbo", "beginner", "throw"]
  },
  {
    "id": "pattern-superbulky-002",
    "name": "Jumbo Pet Bed",
    "shortDescription": "A plush, round pet bed using super bulky yarn. Your cat or small dog will love this cozy nest.",
    "category": "Home Decor",
    "difficulty": { "level": "beginner", "score": 2, "reasoning": "Uses half double crochet in the round with increases for the base. Requires consistent tension." },
    "estimatedTime": { "minHours": 2, "maxHours": 4, "unit": "hours", "assumedSkill": "Beginner" },
    "materials": {
      "yarn": { "weightCategory": "6 (Super Bulky)", "weightNumber": 6, "suggestedYardageMin": 250, "suggestedYardageMax": 400, "fiberType": ["Acrylic", "Polyester blend", "Chenille"], "notes": "Super bulky chenille gives a luxurious, plush feel." },
      "hook": { "sizeMM": 12, "sizeUS": "O", "sizeUK": "N/A", "notes": "Use a 12mm hook or larger." },
      "notions": ["Yarn needle", "Scissors", "Stitch marker", "Pillow stuffing or cushion insert"]
    },
    "gauge": { "stitches": 6, "rows": 4, "unit": "4 inches", "stitchPattern": "half double crochet", "notes": "Gauge is not critical." },
    "instructions": [
      "**Base:** Make a magic ring. Round 1: 8 hdc in ring, join. (8 hdc)",
      "**Round 2:** Chain 2, 2 hdc in each stitch around, join. (16 hdc)",
      "**Round 3:** Chain 2, *hdc in next stitch, 2 hdc in next* around, join. (24 hdc)",
      "**Rounds 4-8:** Continue increasing 8 stitches each round until base is desired diameter (about 16-18 inches for a cat bed).",
      "**Walls (no increase):** Chain 2, hdc in back loop only of each stitch around for 8 rounds. This creates the side walls.",
      "**Edging:** Slip stitch around the top edge. Fasten off. Insert a cushion or stuffing. Weave in ends."
    ],
    "beginnerTips": ["Use a stitch marker to track your rounds.", "Test the bed size by having your pet sit on it midway."],
    "commonMistakes": ["Increasing too fast—the base should lie flat without ruffling.", "Making the walls too tall—pets prefer low walls they can climb over."],
    "keywords": ["pet bed", "cat", "dog", "super bulky", "home", "jumbo"]
  },
  // --- More variety in WEIGHT 4 ---
  {
    "id": "pattern-legwarmers-001",
    "name": "Cozy Leg Warmers",
    "shortDescription": "Leg warmers worked flat and seamed. Customize the length and add a fold-over cuff for extra warmth.",
    "category": "Accessories",
    "difficulty": { "level": "beginner", "score": 2, "reasoning": "Uses double crochet worked flat with simple seaming. Straightforward construction." },
    "estimatedTime": { "minHours": 2, "maxHours": 3, "unit": "hours", "assumedSkill": "Beginner" },
    "materials": {
      "yarn": { "weightCategory": "4 (Medium)", "weightNumber": 4, "suggestedYardageMin": 150, "suggestedYardageMax": 250, "fiberType": ["Acrylic", "Wool", "Acrylic/Wool blend"], "notes": "A wool blend adds warmth and elasticity." },
      "hook": { "sizeMM": 5, "sizeUS": "H-8", "sizeUK": "6", "notes": "Use the recommended size for your yarn." },
      "notions": ["Yarn needle", "Scissors", "Stitch markers"]
    },
    "gauge": { "stitches": 14, "rows": 8, "unit": "4 inches", "stitchPattern": "double crochet", "notes": "Gauge affects fit." },
    "instructions": [
      "**Cuff:** Chain 20. Double crochet in 3rd chain from hook and each across. (18 dc)",
      "**Row 2-6:** Chain 3, turn. Dc in each stitch across. (18 dc each row)",
      "**Fold Cuff:** Fold the cuff in half lengthwise and seam the short edges together to form a ring. Set aside.",
      "**Leg Panel:** Chain 16. Dc in 3rd chain from hook and each across. (14 dc)",
      "**Rows 2-20:** Chain 3, turn. Dc in each stitch across. Continue until panel measures about 14 inches.",
      "**Assembly:** Seam the long edges of the leg panel together. Attach the cuff to the bottom. Repeat for second leg warmer. Weave in ends."
    ],
    "beginnerTips": ["Try on the leg warmer as you work to check the fit.", "Add an edging of single crochet for a cleaner finish."],
    "commonMistakes": ["Making the leg too wide—it should fit snugly without bagging.", "Forgetting to make the second one the same size."],
    "keywords": ["leg warmers", "warm", "accessories", "beginner", "worsted", "cozy"]
  },
  {
    "id": "pattern-ornament-001",
    "name": "Crochet Christmas Ornaments",
    "shortDescription": "Set of mini crochet ornaments: a star, a heart, and a mini stocking. Great for using scrap yarn and making gifts.",
    "category": "Keychain",
    "difficulty": { "level": "intermediate", "score": 3, "reasoning": "Uses small-scale work with increases, decreases, and shaping in the round." },
    "estimatedTime": { "minHours": 0.5, "maxHours": 1, "unit": "hours", "assumedSkill": "Intermediate" },
    "materials": {
      "yarn": { "weightCategory": "4 (Medium)", "weightNumber": 4, "suggestedYardageMin": 10, "suggestedYardageMax": 30, "fiberType": ["Cotton", "Acrylic"], "notes": "Use small amounts of red, green, white, and gold yarn." },
      "hook": { "sizeMM": 3.5, "sizeUS": "E-4", "sizeUK": "9", "notes": "A smaller hook gives tighter stitches for ornaments." },
      "notions": ["Yarn needle", "Scissors", "Polyester stuffing", "Ribbon or ornament hooks"]
    },
    "gauge": { "stitches": 0, "rows": 0, "unit": "N/A", "stitchPattern": "N/A", "notes": "Gauge is not relevant for ornaments." },
    "instructions": [
      "**Star (make 2):** Chain 2. 5 sc in 2nd chain from hook. (5 sc)",
      "**Star Points:** Chain 4, sl st in 2nd chain from hook, sc in next, hdc in last. Sl st to next sc on the base. Repeat 4 more times to make 5 points. Fasten off.",
      "**Heart:** Magic ring, ch 2, 2 dc, ch 2, sl st, ch 2, 2 dc, hdc — all in ring. Pull tight to form heart shape. Fasten off.",
      "**Mini Stocking:** Chain 6. Sc in 2nd chain from hook and next 3, 3 sc in last. Continue on opposite side: sc in 4 chains, 2 sc in last. Join. (14 sc)",
      "Work 3 rounds sc evenly. For the heel: sc decrease, sc in 3, sc decrease. For the cuff: ch 4, sc in 2nd chain and next 2, slip stitch to stocking. Fasten off.",
      "**Assembly:** Attach ribbon or ornament hook to each piece. Block lightly. (Optional: dip in diluted glue to stiffen.)"
    ],
    "beginnerTips": ["Use a smaller hook than recommended for tightly stuffed ornaments.", "Block the star pieces before sewing them together."],
    "commonMistakes": ["Ornaments are too loose—use a smaller hook for tighter stitches.", "Skipping the stiffening step—they'll hold shape better with glue."],
    "keywords": ["ornaments", "Christmas", "holiday", "gift", "intermediate", "mini"]
  },
  {
    "id": "pattern-earrings-001",
    "name": "Crochet Hoop Earrings",
    "shortDescription": "Lightweight, modern hoop earrings made with fine thread and wire hoops. An advanced beginner project that looks impressive.",
    "category": "Accessories",
    "difficulty": { "level": "intermediate", "score": 3, "reasoning": "Uses fine thread and small hoops; requires dexterity and precise tension." },
    "estimatedTime": { "minHours": 0.5, "maxHours": 1, "unit": "hours", "assumedSkill": "Intermediate" },
    "materials": {
      "yarn": { "weightCategory": "1 (Lace/Super Fine)", "weightNumber": 1, "suggestedYardageMin": 5, "suggestedYardageMax": 15, "fiberType": ["Cotton thread", "Mercerized cotton", "Silk"], "notes": "Use size 10 or 20 crochet thread for best results." },
      "hook": { "sizeMM": 1.5, "sizeUS": "7 steel", "sizeUK": "N/A", "notes": "A steel hook in size 7 or 8 works with crochet thread." },
      "notions": ["Yarn needle", "Scissors", "Metal hoop earring findings (1.5 inch)", "Jewelry pliers", "Glue (optional)"]
    },
    "gauge": { "stitches": 0, "rows": 0, "unit": "N/A", "stitchPattern": "N/A", "notes": "Gauge is not relevant." },
    "instructions": [
      "**Setup:** Attach thread to the hoop earring finding with a slip knot around the hoop.",
      "**Round 1:** Single crochet evenly around the hoop, covering the metal completely. Work about 30 sc for a 1.5-inch hoop.",
      "**Round 2:** *Chain 3, skip 1 sc, slip stitch in next sc* repeat around the hoop.",
      "**Round 3:** Slip stitch in each chain-3 space around to create a scalloped edge. Fasten off.",
      "**Finishing:** Use jewelry pliers to close the hoop finding. Weave in the thread tail carefully. Repeat for second earring."
    ],
    "beginnerTips": ["Work in good lighting—fine thread is hard to see.", "Use a thimble if your fingers get sore from the small hook."],
    "commonMistakes": ["Using regular yarn instead of thread—it won't fit through the hoop.", "Crocheting too loosely—the stitches should hug the hoop snugly."],
    "keywords": ["earrings", "jewelry", "lace", "intermediate", "thread", "fashion"]
  },
  // --- More thin categories ---
  {
    "id": "pattern-plant-hanger-003",
    "name": "Boho Plant Hanger with Beads",
    "shortDescription": "A macrame-style crochet plant hanger using worsted cotton. Wooden beads add a boho touch.",
    "category": "Small plant hanger",
    "difficulty": { "level": "intermediate", "score": 3, "reasoning": "Uses chains, slip stitches, and working with multiple strands; requires attention to the pattern repeat." },
    "estimatedTime": { "minHours": 1.5, "maxHours": 2.5, "unit": "hours", "assumedSkill": "Intermediate" },
    "materials": {
      "yarn": { "weightCategory": "4 (Medium)", "weightNumber": 4, "suggestedYardageMin": 80, "suggestedYardageMax": 120, "fiberType": ["Cotton", "Recycled cotton"], "notes": "Cotton is strong and holds the weight of a plant pot." },
      "hook": { "sizeMM": 4.5, "sizeUS": "7", "sizeUK": "7", "notes": "Use a slightly larger hook for a looser drape." },
      "notions": ["Yarn needle", "Scissors", "Large wooden beads (6-8)", "Plant pot (4 inch)"]
    },
    "gauge": { "stitches": 0, "rows": 0, "unit": "N/A", "stitchPattern": "N/A", "notes": "Gauge is not critical." },
    "instructions": [
      "**Top Ring:** Chain 6, slip stitch to form a ring.",
      "**Round 1:** Chain 10, sc into ring. Repeat 5 more times. (6 loops)",
      "**Round 2:** Slip stitch into first loop, chain 12, sc into next loop. Repeat around. (6 longer loops)",
      "**Bead Round:** String a bead onto yarn before making each loop. Chain 10 (with bead in middle), sc into next loop. Repeat around.",
      "**Lower Section:** Chain 15, slip stitch into ring at bottom. Repeat to create 4-5 hanging strands. String beads onto the ends.",
      "**Finishing:** Tie ends together in a knot at the bottom. Insert plant pot. Hang from the top ring."
    ],
    "beginnerTips": ["Thread beads onto the yarn BEFORE starting each section.", "Test the hanger with your pot size before finishing."],
    "commonMistakes": ["Forgetting to add beads before closing loops.", "Making the hanger too short—the pot should sit inside comfortably."],
    "keywords": ["plant hanger", "boho", "macrame", "beads", "intermediate", "home"]
  },
  {
    "id": "pattern-bookmark-003",
    "name": "Lacy Bookmark with Bead",
    "shortDescription": "An elegant lace bookmark using cotton thread. Makes a wonderful, thoughtful gift for book lovers.",
    "category": "Bookmark",
    "difficulty": { "level": "intermediate", "score": 3, "reasoning": "Uses fine thread and lace stitches; requires counting and attention to the pattern." },
    "estimatedTime": { "minHours": 1, "maxHours": 2, "unit": "hours", "assumedSkill": "Intermediate" },
    "materials": {
      "yarn": { "weightCategory": "3 (DK/Light)", "weightNumber": 3, "suggestedYardageMin": 25, "suggestedYardageMax": 50, "fiberType": ["Cotton thread", "Mercerized cotton"], "notes": "A fine cotton thread (sport weight) gives the best lace effect." },
      "hook": { "sizeMM": 3, "sizeUS": "C-2", "sizeUK": "N/A", "notes": "Use a smaller hook for tighter stitches." },
      "notions": ["Yarn needle", "Scissors", "Pony bead or small charm", "Starch or fabric stiffener (optional)"]
    },
    "gauge": { "stitches": 0, "rows": 0, "unit": "N/A", "stitchPattern": "N/A", "notes": "Gauge is not relevant." },
    "instructions": [
      "**Foundation:** Chain 14.",
      "**Row 1:** Double crochet in 6th chain from hook. *Chain 2, skip 2 chains, dc in next chain* repeat across. (4 dc, 3 ch-2 spaces)",
      "**Row 2:** Chain 5 (counts as dc + ch2), dc in next dc. *Chain 2, dc in next dc* repeat across. End with dc in 3rd chain of ch-5.",
      "**Rows 3-20:** Repeat Row 2 until bookmark measures about 8 inches.",
      "**Top Loop:** Chain 12, slip stitch to first dc. Sc in each chain back. Fasten off.",
      "**Bead:** Thread bead onto the top loop. Weave in all ends. Optional: dip in starch and block for a crisp finish."
    ],
    "beginnerTips": ["Use stitch markers to track the pattern repeat.", "Blocking opens up the lace and makes it look professional."],
    "commonMistakes": ["Forgetting the chain-2 between double crochets.", "Skipping the last dc at the end of the row."],
    "keywords": ["bookmark", "lace", "gift", "intermediate", "cotton", "thread"]
  },
  {
    "id": "pattern-phone-case-003",
    "name": "Textured Phone Pouch",
    "shortDescription": "A protective phone pouch with a textured stitch pattern. The flap keeps your phone secure.",
    "category": "Cell phone case",
    "difficulty": { "level": "beginner", "score": 2, "reasoning": "Uses single and double crochet in a simple textured pattern. No shaping." },
    "estimatedTime": { "minHours": 1, "maxHours": 2, "unit": "hours", "assumedSkill": "Beginner" },
    "materials": {
      "yarn": { "weightCategory": "4 (Medium)", "weightNumber": 4, "suggestedYardageMin": 50, "suggestedYardageMax": 100, "fiberType": ["Cotton", "Acrylic"], "notes": "Cotton is durable and won't stretch out of shape." },
      "hook": { "sizeMM": 4.5, "sizeUS": "7", "sizeUK": "7", "notes": "Use the size recommended on your yarn." },
      "notions": ["Yarn needle", "Scissors", "Button (1 inch)", "Sewing needle and thread"]
    },
    "gauge": { "stitches": 14, "rows": 10, "unit": "4 inches", "stitchPattern": "texture stitch", "notes": "Gauge is important for correct phone fit." },
    "instructions": [
      "**Pouch Body:** Chain 18 (adjust for your phone width).",
      "**Row 1:** Sc in 2nd chain from hook and each across. (17 sc)",
      "**Row 2:** Chain 1, turn. Sc in each stitch across.",
      "**Row 3:** Chain 3 (counts as dc), turn. Dc in each stitch across.",
      "**Rows 4-16:** Repeat rows 2-3 for texture pattern. End with a sc row.",
      "**Flap:** Continue on the same piece: chain 1, sc in each stitch for 6 more rows. On the last row, chain 6 for a button loop, slip stitch to the edge.",
      "**Assembly:** Fold the pouch body in half. Whip stitch the sides closed. Sew button onto the front of the pouch aligned with the button loop. Weave in ends."
    ],
    "beginnerTips": ["Measure your phone before starting and adjust foundation chain.", "Use contrasting thread to sew the button for a pop of color."],
    "commonMistakes": ["Making the pouch too narrow—test with your phone.", "Sewing the button in the wrong position."],
    "keywords": ["phone case", "pouch", "textured", "beginner", "cotton", "protective"]
  },
  {
    "id": "pattern-water-bottle-003",
    "name": "Insulated Water Bottle Sling",
    "shortDescription": "A water bottle holder with an adjustable strap and drawstring top. The double-thick base insulates your drink.",
    "category": "Water bottle holder",
    "difficulty": { "level": "intermediate", "score": 3, "reasoning": "Uses working in the round, increases for the base, and a drawstring closure." },
    "estimatedTime": { "minHours": 1.5, "maxHours": 2.5, "unit": "hours", "assumedSkill": "Intermediate" },
    "materials": {
      "yarn": { "weightCategory": "4 (Medium)", "weightNumber": 4, "suggestedYardageMin": 80, "suggestedYardageMax": 150, "fiberType": ["Cotton", "Recycled cotton"], "notes": "Cotton is sturdy and insulates well." },
      "hook": { "sizeMM": 5, "sizeUS": "H-8", "sizeUK": "6", "notes": "Use the recommended size for your yarn." },
      "notions": ["Yarn needle", "Scissors", "Stitch marker", "Cord or ribbon for drawstring (24 inches)", "Plastic canvas circle (optional, for base)"]
    },
    "gauge": { "stitches": 14, "rows": 10, "unit": "4 inches", "stitchPattern": "single crochet", "notes": "Gauge is not critical." },
    "instructions": [
      "**Base:** Chain 4, slip stitch to form ring. Round 1: 6 sc in ring. (6 sc)",
      "**Round 2:** 2 sc in each stitch around. (12 sc)",
      "**Round 3:** *Sc in next stitch, 2 sc in next* around. (18 sc). Continue increasing until base matches your bottle diameter.",
      "**Body:** Sc in back loop only of each stitch around for 12 rounds (or until the holder covers your bottle).",
      "**Drawstring Holes:** Chain 3, skip 2 sc, dc in next stitch. Repeat around. Join with slip stitch.",
      "**Drawstring:** Crochet a chain about 24 inches long. Weave through the holes. Add a strap: chain 60, attach to both sides of the holder. Weave in ends."
    ],
    "beginnerTips": ["Test your bottle size as you increase the base.", "Use a plastic canvas circle inside the base for extra stability."],
    "commonMistakes": ["Making the base too big—the bottle should fit snugly.", "Drawstring holes not aligned—count stitches evenly."],
    "keywords": ["water bottle", "sling", "holder", "insulated", "cotton", "intermediate"]
  },
  {
    "id": "pattern-eyeglass-003",
    "name": "Quilted Eyeglass Case",
    "shortDescription": "A padded eyeglass case with a quilted texture. The flap closure keeps glasses secure.",
    "category": "Eyeglass case",
    "difficulty": { "level": "intermediate", "score": 3, "reasoning": "Uses the thermal stitch for a padded effect; requires even tension for the quilted look." },
    "estimatedTime": { "minHours": 1.5, "maxHours": 2, "unit": "hours", "assumedSkill": "Intermediate" },
    "materials": {
      "yarn": { "weightCategory": "4 (Medium)", "weightNumber": 4, "suggestedYardageMin": 40, "suggestedYardageMax": 80, "fiberType": ["Cotton", "Acrylic blend"], "notes": "Cotton gives the best structure for a case." },
      "hook": { "sizeMM": 4.5, "sizeUS": "7", "sizeUK": "7", "notes": "Use a slightly smaller hook for dense fabric." },
      "notions": ["Yarn needle", "Scissors", "Button", "Sewing needle and thread"]
    },
    "gauge": { "stitches": 16, "rows": 14, "unit": "4 inches", "stitchPattern": "thermal stitch", "notes": "Gauge affects the snugness of the fit." },
    "instructions": [
      "**Case Body:** Chain 20. Sc in 2nd chain from hook and each across. (19 sc)",
      "**Row 2:** Chain 1, turn. Sc in back loop only of each stitch across.",
      "**Rows 3-16:** Repeat Row 2. The thermal stitch creates a thick, padded fabric.",
      "**Flap:** Continue on the same piece: chain 1, sc in each stitch for 5 more rows.",
      "**Button Loop:** Chain 8, slip stitch to the last sc of the flap. Sc in each chain back.",
      "**Finishing:** Fold the body in half. Whip stitch the sides and bottom closed. Sew button to the front at the flap position. Weave in ends."
    ],
    "beginnerTips": ["Use a stitch marker to count rows evenly on both sides.", "Block the piece before seaming for a professional look."],
    "commonMistakes": ["Making the case too flat—glasses need a bit of depth.", "Sewing seams too tight, creating a lumpy edge."],
    "keywords": ["eyeglass case", "glasses", "quilted", "thermal", "intermediate", "padded"]
  },
  {
    "id": "pattern-wristband-003",
    "name": "Infinity Wristband",
    "shortDescription": "A braided-looking wristband made with a clever crochet technique. Adjustable to any wrist size.",
    "category": "Wristband",
    "difficulty": { "level": "beginner", "score": 2, "reasoning": "Uses a simple 3-chain loop pattern that creates a braided effect." },
    "estimatedTime": { "minHours": 0.5, "maxHours": 1, "unit": "hours", "assumedSkill": "Beginner" },
    "materials": {
      "yarn": { "weightCategory": "3 (DK/Light)", "weightNumber": 3, "suggestedYardageMin": 15, "suggestedYardageMax": 30, "fiberType": ["Cotton", "Acrylic"], "notes": "Use two contrasting colors for a braided look." },
      "hook": { "sizeMM": 4, "sizeUS": "G-6", "sizeUK": "8", "notes": "Use the size recommended for your yarn." },
      "notions": ["Yarn needle", "Scissors", "Button or toggle (1/2 inch)"]
    },
    "gauge": { "stitches": 0, "rows": 0, "unit": "N/A", "stitchPattern": "N/A", "notes": "Gauge is not critical." },
    "instructions": [
      "**Foundation:** Chain 8.",
      "**Row 1:** Slip stitch in 2nd chain from hook. *Chain 3, skip 1 chain, slip stitch in next chain* repeat across. (3 loops)",
      "**Row 2:** Chain 1, turn. Slip stitch in first chain-3 loop. *Chain 3, slip stitch in next chain-3 loop* repeat across.",
      "**Rows 3-20:** Repeat Row 2 until the band measures about 7 inches (or your wrist size minus 1 inch for overlap).",
      "**Button Loop End:** On the last row, chain 6 before the final slip stitch to create a button loop.",
      "**Finishing:** Sew button or toggle to the opposite end. Weave in ends. Fasten around wrist."
    ],
    "beginnerTips": ["Use two colors, alternating every 2 rows for a striped braid effect.", "Make the button loop slightly smaller than the button diameter."],
    "commonMistakes": ["Making the band too loose—the braid stretches with wear.", "Skipping the button loop—check before fastening off."],
    "keywords": ["wristband", "bracelet", "braid", "beginner", "accessories", "quick"]
  },
  {
    "id": "pattern-keychain-003",
    "name": "Mini Amigurumi Keychain",
    "shortDescription": "An adorable mini amigurumi animal keychain. Choose a bear, bunny, or cat face design.",
    "category": "Keychain",
    "difficulty": { "level": "intermediate", "score": 3, "reasoning": "Uses amigurumi techniques: magic ring, increases, decreases, and small parts assembly." },
    "estimatedTime": { "minHours": 1, "maxHours": 2, "unit": "hours", "assumedSkill": "Intermediate" },
    "materials": {
      "yarn": { "weightCategory": "4 (Medium)", "weightNumber": 4, "suggestedYardageMin": 10, "suggestedYardageMax": 25, "fiberType": ["Cotton", "Acrylic"], "notes": "Small amounts of main color plus scraps for ears and face." },
      "hook": { "sizeMM": 3.5, "sizeUS": "E-4", "sizeUK": "9", "notes": "Use a smaller hook than usual for tight stitches (prevents stuffing from showing)." },
      "notions": ["Yarn needle", "Scissors", "Polyester stuffing", "Safety eyes (6mm) or embroidery thread for face", "Key ring"]
    },
    "gauge": { "stitches": 0, "rows": 0, "unit": "N/A", "stitchPattern": "N/A", "notes": "Gauge is not relevant." },
    "instructions": [
      "**Head:** Magic ring, 6 sc in ring. (6 sc)",
      "**Round 2:** 2 sc in each stitch around. (12 sc)",
      "**Round 3:** *Sc in next stitch, 2 sc in next* around. (18 sc)",
      "**Rounds 4-6:** Sc in each stitch around. (18 sc each round)",
      "**Round 7:** *Sc in next stitch, sc2tog* around. (12 sc)",
      "**Round 8:** Sc2tog around. (6 sc). Stuff firmly before closing. Fasten off, leave tail for sewing.",
      "**Ears (make 2):** Magic ring, 4 sc. Round 2: 2 sc in each stitch. (8 sc). Fasten off, leave tails.",
      "**Assembly:** Sew ears to top of head. Add safety eyes or embroider face. Attach key ring to top. Weave in all ends."
    ],
    "beginnerTips": ["Use safety eyes with locking washers for children's items.", "Stuff firmly but don't overstuff—the shape should be round, not lumpy."],
    "commonMistakes": ["Crocheting too loosely—use a smaller hook for amigurumi.", "Forgetting to weave in ends securely—keychains get a lot of handling."],
    "keywords": ["keychain", "amigurumi", "mini", "intermediate", "toy", "cute"]
  }
];

// Append patterns
const updated = patterns.concat(newPatterns);
fs.writeFileSync('../data/patterns.json', JSON.stringify(updated, null, 2));
console.log('Added', newPatterns.length, 'patterns. Total:', updated.length);
