# Additional crochet patterns to extend the database.
# Each pattern matches the schema from generate_patterns_json.py.
# Append this list to patterns_data in generate_patterns_json.py.

additional_patterns = [
  # ===== EARRINGS (1 pattern) =====
  {
    "id": "pattern-earrings-001",
    "name": "Crochet Earrings",
    "shortDescription": "Lightweight crochet earrings made with fine thread or yarn and earring hooks. Quick to make and customizable.",
    "imageUrl": "/assets/patterns/pattern-earrings-001.webp",
    "category": "Accessories",
    "difficulty": {"level": "beginner", "score": 1, "reasoning": "Uses only chain and single crochet in a small motif; no shaping required."},
    "estimatedTime": {"minHours": 0.25, "maxHours": 0.5, "unit": "hours", "assumedSkill": "Beginner"},
    "materials": {
      "yarn": {"weightCategory": "2 (Fine/Sport)", "weightNumber": 2, "suggestedYardageMin": 5, "suggestedYardageMax": 10, "fiberType": ["Cotton"], "notes": "Use cotton thread or fine sport-weight yarn for best definition."},
      "hook": {"sizeMM": 3.5, "sizeUS": "E-4", "sizeUK": "9", "notes": "A smaller hook creates a denser fabric."},
      "notions": ["Yarn needle", "Scissors", "Earring hooks (2 pairs)", "Jump rings (4)", "Jewelry pliers"]
    },
    "gauge": {"stitches": 20, "rows": 20, "unit": "4 inches", "stitchPattern": "single crochet", "notes": "Gauge is not critical for earrings."},
    "instructions": [
      "**Motif (make 2):** Chain 6, join with a slip stitch to form a ring.",
      "**Round 1:** Chain 1, work 12 single crochet (sc) into the ring. Join with a slip stitch. (12 sc)",
      "**Round 2:** Chain 4 (counts as tr), tr in same stitch, *chain 3, skip 1, 2 tr in next.* Repeat around, ending with chain 3, join to top of ch-4. (6 petal bases)",
      "**Round 3:** *In each chain-3 space: sc, hdc, 3 dc, hdc, sc.* Repeat around. Join.",
      "**Finishing:** Fasten off, leaving a 6-inch tail. Use jump ring pliers to attach a jump ring to the top of the motif, then attach to earring hook. Repeat for second earring."
    ],
    "beginnerTips": ["Make both earrings identical by counting stitches carefully on the first one.", "Use stiffer cotton for earrings that hold their shape.", "Blocking helps the petals lie flat and even."],
    "commonMistakes": ["Skipping the slip stitch join at the end of each round.", "Using yarn that is too heavy, making earrings that pull on the earlobe."],
    "keywords": ["earrings", "accessories", "jewelry", "beginner", "cotton", "gift", "quick"]
  },

  # ===== SCRUNCHIE (1 pattern) =====
  {
    "id": "pattern-scrunchie-001",
    "name": "Crochet Scrunchie",
    "shortDescription": "A fabric-covered hair scrunchie made by crocheting around a plain elastic hair tie.",
    "imageUrl": "/assets/patterns/pattern-scrunchie-001.webp",
    "category": "Accessories",
    "difficulty": {"level": "beginner", "score": 1, "reasoning": "Uses only chain and single crochet worked in a ring; no shaping or stitch counting beyond the first round."},
    "estimatedTime": {"minHours": 0.25, "maxHours": 0.5, "unit": "hours", "assumedSkill": "Beginner"},
    "materials": {
      "yarn": {"weightCategory": "4 (Medium)", "weightNumber": 4, "suggestedYardageMin": 15, "suggestedYardageMax": 25, "fiberType": ["Acrylic", "Cotton"], "notes": "A smooth yarn works best; use scrap yarn."},
      "hook": {"sizeMM": 5.0, "sizeUS": "H-8", "sizeUK": "6", "notes": "Standard size."},
      "notions": ["Yarn needle", "Scissors", "Standard hair elastic"]
    },
    "gauge": {"stitches": 16, "rows": 16, "unit": "4 inches", "stitchPattern": "single crochet", "notes": "Gauge is not critical for a scrunchie."},
    "instructions": [
      "**Setup:** Hold the hair elastic in your non-dominant hand.",
      "**Round 1:** Insert hook through the elastic, yarn over, pull up a loop. Chain 1. Work 30 single crochet (sc) evenly around the elastic. Join with a slip stitch to first sc. (30 sc)",
      "**Round 2:** Chain 1, *sc in next stitch, 2 sc in next.* Repeat around. Join. (45 sc)",
      "**Round 3:** Chain 1, sc in each stitch around. Join. (45 sc)",
      "**Finishing:** Fasten off, leaving a tail. Weave the tail through the last round and pull tight to gather slightly. Weave in ends."
    ],
    "beginnerTips": ["Keep stitches snug against the elastic so no elastic shows.", "Use a contrasting color for a pop of color in your hair.", "Make a set to match different outfits."],
    "commonMistakes": ["Working too loosely, leaving gaps where the elastic shows through.", "Twisting the elastic while crocheting around it."],
    "keywords": ["scrunchie", "hair", "accessory", "beginner", "single crochet", "quick", "gift"]
  },

  # ===== POTHOLDER (1 pattern) =====
  {
    "id": "pattern-potholder-001",
    "name": "Double-Thick Potholder",
    "shortDescription": "A thick, heat-resistant potholder made by crocheting two layers together. Uses only single crochet.",
    "imageUrl": "/assets/patterns/pattern-potholder-001.webp",
    "category": "Dishcloth",
    "difficulty": {"level": "beginner", "score": 1, "reasoning": "Uses only chain and single crochet; two identical squares are worked and then joined."},
    "estimatedTime": {"minHours": 1, "maxHours": 1.5, "unit": "hours", "assumedSkill": "Beginner"},
    "materials": {
      "yarn": {"weightCategory": "4 (Medium)", "weightNumber": 4, "suggestedYardageMin": 80, "suggestedYardageMax": 100, "fiberType": ["Cotton"], "notes": "100% cotton is essential for heat resistance; acrylic will melt."},
      "hook": {"sizeMM": 4.5, "sizeUS": "7", "sizeUK": "7", "notes": "A slightly smaller hook makes a denser fabric."},
      "notions": ["Yarn needle", "Scissors"]
    },
    "gauge": {"stitches": 16, "rows": 16, "unit": "4 inches", "stitchPattern": "single crochet", "notes": "Gauge is not critical for a potholder."},
    "instructions": [
      "**Panel 1:** Chain 21.",
      "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. (20 sc), turn.",
      "**Rows 2-20:** Chain 1, turn. Single crochet across. (20 sc each row). Fasten off.",
      "**Panel 2:** Repeat Rows 1-20 for the second panel. Do NOT fasten off.",
      "**Joining:** Place Panel 1 behind Panel 2. Chain 1, insert hook through both panels, sc evenly around all 4 edges, working 3 sc in each corner and a loop of 10 chains at one corner for hanging.",
      "**Finishing:** Join with slip stitch, fasten off, weave in ends."
    ],
    "beginnerTips": ["Cotton yarn is essential for heat safety—never use acrylic for potholders.", "The double layer provides better insulation than a single layer.", "Add a hanging loop at one corner for convenient storage."],
    "commonMistakes": ["Using acrylic yarn, which can melt under heat.", "Skipping stitches when joining the two panels, causing a wavy edge."],
    "keywords": ["potholder", "cotton", "kitchen", "beginner", "single crochet", "heat resistant", "practical"]
  },

  # ===== BASKET (1 pattern) =====
  {
    "id": "pattern-basket-001",
    "name": "Small Storage Basket",
    "shortDescription": "A sturdy storage basket worked in the round with a flat base and tall sides. Great for organizing desk or shelf items.",
    "imageUrl": "/assets/patterns/pattern-basket-001.webp",
    "category": "Home Decor",
    "difficulty": {"level": "beginner", "score": 1, "reasoning": "Uses only single crochet in the round with even increases for the base and straight sides."},
    "estimatedTime": {"minHours": 2, "maxHours": 3, "unit": "hours", "assumedSkill": "Beginner"},
    "materials": {
      "yarn": {"weightCategory": "5 (Bulky)", "weightNumber": 5, "suggestedYardageMin": 150, "suggestedYardageMax": 200, "fiberType": ["Cotton"], "notes": "Sturdy cotton or cotton- blend holds shape best for baskets."},
      "hook": {"sizeMM": 6.5, "sizeUS": "K-10.5", "sizeUK": "4", "notes": "A larger hook creates a flexible fabric."},
      "notions": ["Yarn needle", "Scissors", "Stitch marker"]
    },
    "gauge": {"stitches": 12, "rows": 12, "unit": "4 inches", "stitchPattern": "single crochet", "notes": "Gauge affects the final basket size."},
    "instructions": [
      "**Base:** Make a magic ring.",
      "**Round 1:** Chain 1, work 8 single crochet (sc) into ring. Join with a slip stitch. (8 sc)",
      "**Round 2:** Chain 1, *2 sc in each stitch.* Repeat around. Join. (16 sc)",
      "**Round 3:** Chain 1, *sc in next, 2 sc in next.* Repeat around. Join. (24 sc)",
      "**Round 4:** Chain 1, *sc in next 2, 2 sc in next.* Repeat around. Join. (32 sc)",
      "**Round 5:** Chain 1, *sc in next 3, 2 sc in next.* Repeat around. Join. (40 sc)",
      "**Sides:** Chain 1, sc in back loop only of each stitch around. Join. (40 sc)",
      "**Rounds 7-16:** Chain 1, sc in each stitch around. Join. (40 sc each)",
      "**Finishing:** Fasten off, weave in ends. Block to shape."
    ],
    "beginnerTips": ["The base should lie flat—if it ruffles, you have too many increases; if it curls, too few.", "Working the first side round in back loop only creates a clean corner between base and sides.", "Spray block with water to help the basket hold its shape."],
    "commonMistakes": ["Pulling the magic ring too tight, causing a pointed base center.", "Not marking the first stitch of each round in spiral work."],
    "keywords": ["basket", "storage", "home decor", "beginner", "single crochet", "bulky", "organizer"]
  },

  # ===== LEG WARMERS (1 pattern) =====
  {
    "id": "pattern-legwarmers-001",
    "name": "Cozy Leg Warmers",
    "shortDescription": "Warm leg warmers worked in the round from the ankle up. Uses half-double crochet in back loop only for a ribbed effect.",
    "imageUrl": "/assets/patterns/pattern-legwarmers-001.webp",
    "category": "Accessories",
    "difficulty": {"level": "beginner", "score": 1, "reasoning": "Uses chain and half-double crochet in the round; no increasing or decreasing required."},
    "estimatedTime": {"minHours": 2, "maxHours": 3, "unit": "hours", "assumedSkill": "Beginner"},
    "materials": {
      "yarn": {"weightCategory": "4 (Medium)", "weightNumber": 4, "suggestedYardageMin": 200, "suggestedYardageMax": 300, "fiberType": ["Acrylic", "Wool"], "notes": "Warm, soft yarn is best for leg warmers."},
      "hook": {"sizeMM": 5.0, "sizeUS": "H-8", "sizeUK": "6", "notes": "Standard size."},
      "notions": ["Yarn needle", "Scissors", "Stitch marker"]
    },
    "gauge": {"stitches": 14, "rows": 12, "unit": "4 inches", "stitchPattern": "half double crochet in back loop", "notes": "Gauge determines snugness."},
    "instructions": [
      "**Foundation Chain:** Chain 28 (adjust for calf circumference). Join with a slip stitch to form a ring, being careful not to twist.",
      "**Round 1:** Chain 2 (counts as first hdc), half double crochet (hdc) in each chain around. Join with slip stitch to top of ch-2. (28 hdc)",
      "**Round 2:** Chain 2, hdc in back loop only of each stitch around. Join. (28 hdc)",
      "**Repeat Round 2:** Continue until leg warmers measure about 12 inches (or desired length).",
      "**Finishing:** Fasten off, weave in ends. Repeat for second leg warmer."
    ],
    "beginnerTips": ["Try on the leg warmer as you go to ensure a good fit.", "Working in back loop only creates a stretchy ribbed fabric that hugs the leg.", "Make them longer for a slouchy look or shorter for ankle warmers."],
    "commonMistakes": ["Twisting the chain when joining the ring.", "Making the foundation chain too tight—it should stretch comfortably over the calf."],
    "keywords": ["leg warmers", "accessories", "beginner", "half double crochet", "ribbed", "warm"]
  },

  # ===== LACE DOILY (1 pattern) =====
  {
    "id": "pattern-lace-dolly-001",
    "name": "Lace Doily",
    "shortDescription": "A classic round doily with a lacy pattern of chains and treble crochet clusters. Perfect for tabletops or wall decor.",
    "imageUrl": "/assets/patterns/pattern-lace-dolly-001.webp",
    "category": "Home Decor",
    "difficulty": {"level": "intermediate", "score": 2, "reasoning": "Requires following a stitch pattern, working treble crochet and picots, and counting chain spaces in each round."},
    "estimatedTime": {"minHours": 2, "maxHours": 4, "unit": "hours", "assumedSkill": "Intermediate"},
    "materials": {
      "yarn": {"weightCategory": "2 (Fine/Sport)", "weightNumber": 2, "suggestedYardageMin": 80, "suggestedYardageMax": 120, "fiberType": ["Cotton"], "notes": "Fine cotton thread gives the best lace definition."},
      "hook": {"sizeMM": 3.5, "sizeUS": "E-4", "sizeUK": "9", "notes": "A smaller hook is needed for fine yarn."},
      "notions": ["Yarn needle", "Scissors", "Stitch markers", "Blocking pins"]
    },
    "gauge": {"stitches": 20, "rows": 12, "unit": "4 inches", "stitchPattern": "lace pattern", "notes": "Gauge is forgiving for a doily."},
    "instructions": [
      "**Center:** Chain 8, join with a slip stitch to form a ring.",
      "**Round 1:** Chain 1, work 16 single crochet (sc) into ring. Join. (16 sc)",
      "**Round 2:** Chain 5 (counts as dc + ch 2), *skip 1, dc in next, chain 2.* Repeat around. Join to 3rd chain of ch-5. (8 dc, 8 ch-2 spaces)",
      "**Round 3:** Slip stitch into ch-2 space. (Chain 3, 2 dc, chain 2, 3 dc) in same space. *Chain 1, (3 dc, ch 2, 3 dc) in next.* Repeat around, chain 1, join.",
      "**Round 4:** Slip stitch to ch-2 corner. (Chain 3, 2 dc, ch 2, 3 dc) in corner. *Chain 1, 3 dc in ch-1 space, chain 1, (3 dc, ch 2, 3 dc) in next corner.* Repeat around. Join.",
      "**Round 5:** Continue same pattern with an additional 3-dc group on each side between corners.",
      "**Round 6 (Edging):** Slip stitch to corner. *In corner: (sc, ch 3, picot, sc). In side ch-1 spaces: sc. Between groups: chain 5, skip 3 dc.* Repeat around.",
      "**Finishing:** Fasten off, weave in ends. Wet block and pin to shape, allowing to dry completely."
    ],
    "beginnerTips": ["Blocking is essential for doilies—it opens the lace pattern and makes it lie flat.", "Use a rust-proof pin for blocking to avoid stains on the yarn.", "Count your chain spaces each round to keep the pattern on track."],
    "commonMistakes": ["Not blocking the finished doily—it will look lumpy and uneven.", "Losing count of chain spaces, causing the pattern to drift."],
    "keywords": ["doily", "lace", "home decor", "intermediate", "treble crochet", "blocking", "cotton", "tabletop"]
  },
{
  "id": "pattern-accessories-003",
  "name": "Braided Headband",
  "shortDescription": "A stylish braided headband made from three crocheted chains braided together with a button closure.",
  "imageUrl": "/assets/patterns/pattern-accessories-003.webp",
  "category": "Accessories",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses chain stitches; accessories construction."
  },
  "estimatedTime": {
    "minHours": 0.5,
    "maxHours": 1,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 20,
      "suggestedYardageMax": 30,
      "fiberType": [
        "Acrylic",
        "Cotton"
      ],
      "notes": "Acrylic Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "chain",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain 60 (or desired length).",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each chain across. Turn.",
    "**Rows 2-4:** Chain 1, turn. Single crochet in each stitch across.",
    "**Finishing:** Fasten off, weave in ends. Block lightly to flatten."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "accessories",
    "braided-headband",
    "beginner",
    "chain",
    "crochet"
  ]
},
{
  "id": "pattern-accessories-004",
  "name": "Fashion Belt",
  "shortDescription": "A crocheted belt using half-double crochet with a D-ring closure. Adjustable length.",
  "imageUrl": "/assets/patterns/pattern-accessories-004.webp",
  "category": "Accessories",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses hdc stitches; accessories construction."
  },
  "estimatedTime": {
    "minHours": 1,
    "maxHours": 2,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 80,
      "suggestedYardageMax": 120,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "hdc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain length needed for project width.",
    "**Row 1:** Half double crochet (hdc) in 3rd chain from hook and each across. Turn.",
    "**Row 2:** Chain 2 (counts as first hdc), hdc in each stitch across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length."
  ],
  "beginnerTips": [
    "The chain 2 at the start of each row counts as the first half-double crochet.",
    "Half-double crochet creates a nice middle ground between sc and dc.",
    "Count your stitches each row to keep edges straight."
  ],
  "commonMistakes": [
    "Forgetting the chain-2 turning chain counts as a stitch.",
    "Working through the wrong loop when the pattern specifies."
  ],
  "keywords": [
    "accessories",
    "fashion-belt",
    "beginner",
    "hdc",
    "crochet"
  ]
},
{
  "id": "pattern-amigurumi-002",
  "name": "Amigurumi Teddy Bear",
  "shortDescription": "A cute teddy bear amigurumi with movable limbs, worked in spiral rounds with safety eyes.",
  "imageUrl": "/assets/patterns/pattern-amigurumi-002.webp",
  "category": "Toy",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses sc stitches; toy construction."
  },
  "estimatedTime": {
    "minHours": 2,
    "maxHours": 4,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 100,
      "suggestedYardageMax": 150,
      "fiberType": [
        "Acrylic"
      ],
      "notes": "Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly.",
    "**Continue:** Repeat established pattern until piece reaches desired size.",
    "**Continue:** Repeat established pattern until piece reaches desired size.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "toy",
    "amigurumi-teddy-bear",
    "intermediate",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-baby-002",
  "name": "Baby Booties with Cuff",
  "shortDescription": "Adorable rolled-cuff booties for babies with a simple sole and side construction.",
  "imageUrl": "/assets/patterns/pattern-baby-002.webp",
  "category": "Baby",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses sc stitches; baby construction."
  },
  "estimatedTime": {
    "minHours": 1.5,
    "maxHours": 2.5,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "3 (DK/Light)",
      "weightNumber": 3,
      "suggestedYardageMin": 80,
      "suggestedYardageMax": 120,
      "fiberType": [
        "Cotton",
        "Acrylic"
      ],
      "notes": "Cotton Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 4.5,
      "sizeUS": "7",
      "sizeUK": "7",
      "notes": "Standard hook for 3 (DK/Light) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly.",
    "**Continue:** Repeat established pattern until piece reaches desired size.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "baby",
    "baby-booties-with-cuff",
    "intermediate",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-baby-003",
  "name": "Baby Hat with Earflaps",
  "shortDescription": "A warm baby hat with braided earflaps and a pom-pom on top.",
  "imageUrl": "/assets/patterns/pattern-baby-003.webp",
  "category": "Baby",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; baby construction."
  },
  "estimatedTime": {
    "minHours": 1,
    "maxHours": 2,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "3 (DK/Light)",
      "weightNumber": 3,
      "suggestedYardageMin": 60,
      "suggestedYardageMax": 100,
      "fiberType": [
        "Acrylic"
      ],
      "notes": "Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 4.5,
      "sizeUS": "7",
      "sizeUK": "7",
      "notes": "Standard hook for 3 (DK/Light) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "baby",
    "baby-hat-with-earflaps",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-baby-004",
  "name": "Baby Receiving Blanket",
  "shortDescription": "A soft, lightweight receiving blanket using shell stitch border on a single crochet body.",
  "imageUrl": "/assets/patterns/pattern-baby-004.webp",
  "category": "Baby blanket square",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc and dc stitches; baby blanket square construction."
  },
  "estimatedTime": {
    "minHours": 3,
    "maxHours": 5,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "3 (DK/Light)",
      "weightNumber": 3,
      "suggestedYardageMin": 300,
      "suggestedYardageMax": 400,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 4.5,
      "sizeUS": "7",
      "sizeUK": "7",
      "notes": "Standard hook for 3 (DK/Light) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc-dc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Double crochet (dc) in each stitch across. Turn.",
    "**Row 3:** Chain 1, turn. Single crochet in each stitch across. Turn.",
    "**Repeat Rows 2-3:** Alternate until piece reaches desired length."
  ],
  "beginnerTips": [
    "Alternating sc and dc rows creates a nice textured fabric.",
    "Count your stitches every row\u2014the switch between stitch types makes it easy to drop a stitch.",
    "Mark your starting chain with a stitch marker so you don't lose count."
  ],
  "commonMistakes": [
    "Losing stitch count when switching between sc and dc.",
    "Forgetting which row pattern you're on without a row counter."
  ],
  "keywords": [
    "baby blanket square",
    "baby-receiving-blanket",
    "beginner",
    "sc-dc",
    "crochet"
  ]
},
{
  "id": "pattern-bag-002",
  "name": "Granny Square Bag",
  "shortDescription": "A bohemian bag made from joined granny squares with fabric lining and leather handles.",
  "imageUrl": "/assets/patterns/pattern-bag-002.webp",
  "category": "Bag",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses dc stitches; bag construction."
  },
  "estimatedTime": {
    "minHours": 3,
    "maxHours": 5,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 200,
      "suggestedYardageMax": 300,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "dc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Double crochet (dc) in 4th chain from hook and each across. Turn.",
    "**Row 2:** Chain 3 (counts as dc), dc in each stitch across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block to open the stitch pattern.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Shell = 5 double crochet worked into the same stitch or space.",
    "Blocking helps the shells lie flat and evenly spaced.",
    "Use a larger hook if your shells feel crowded or are curling.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Skipping the turning chain count, causing edges to narrow.",
    "Forgetting to chain 3 at the start of each row."
  ],
  "keywords": [
    "bag",
    "granny-square-bag",
    "intermediate",
    "dc",
    "crochet"
  ]
},
{
  "id": "pattern-bag-003",
  "name": "Tote with Pockets",
  "shortDescription": "A practical tote with outer slip pockets and sturdy double-stranded handles.",
  "imageUrl": "/assets/patterns/pattern-bag-003.webp",
  "category": "Beginner tote",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses sc stitches; beginner tote construction."
  },
  "estimatedTime": {
    "minHours": 3,
    "maxHours": 5,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 300,
      "suggestedYardageMax": 400,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation:** Make a magic ring.",
    "**Round 1:** Chain 1, work 6 single crochet (sc) into ring. Join. (6 sc)",
    "**Round 2:** Chain 1, *2 sc in each stitch.* Repeat around. Join. (12 sc)",
    "**Round 3:** Chain 1, *sc in next, 2 sc in next.* Repeat around. Join.",
    "**Continue increasing** until piece is desired width, then work even in sc rounds.",
    "**Finishing:** Fasten off, weave in ends. Block to shape."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "beginner tote",
    "tote-with-pockets",
    "intermediate",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-bag-004",
  "name": "Backpack",
  "shortDescription": "A small drawstring backpack with padded straps. Great for day hikes or school.",
  "imageUrl": "/assets/patterns/pattern-bag-004.webp",
  "category": "Bag",
  "difficulty": {
    "level": "advanced",
    "score": 3,
    "reasoning": "Uses sc stitches; bag construction."
  },
  "estimatedTime": {
    "minHours": 4,
    "maxHours": 6,
    "unit": "hours",
    "assumedSkill": "Advanced"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 350,
      "suggestedYardageMax": 450,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation:** Make a magic ring.",
    "**Round 1:** Chain 1, work 6 single crochet (sc) into ring. Join. (6 sc)",
    "**Round 2:** Chain 1, *2 sc in each stitch.* Repeat around. Join. (12 sc)",
    "**Round 3:** Chain 1, *sc in next, 2 sc in next.* Repeat around. Join.",
    "**Continue increasing** until piece is desired width, then work even in sc rounds.",
    "**Finishing:** Fasten off, weave in ends. Block to shape.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work.",
    "Always make a gauge swatch and block it before measuring.",
    "Read through the entire pattern before beginning.",
    "Use lifelines in lace patterns to avoid re-doing rows after mistakes."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "bag",
    "backpack",
    "advanced",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-blanket-002",
  "name": "Ripple Afghan",
  "shortDescription": "A classic ripple stitch afghan with peaks and valleys. Uses double crochet increases and decreases.",
  "imageUrl": "/assets/patterns/pattern-blanket-002.webp",
  "category": "Blanket",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses dc stitches; blanket construction."
  },
  "estimatedTime": {
    "minHours": 5,
    "maxHours": 8,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 500,
      "suggestedYardageMax": 700,
      "fiberType": [
        "Acrylic"
      ],
      "notes": "Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "dc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Double crochet (dc) in 4th chain from hook and each across. Turn.",
    "**Row 2:** Chain 3 (counts as dc), dc in each stitch across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block to open the stitch pattern."
  ],
  "beginnerTips": [
    "Shell = 5 double crochet worked into the same stitch or space.",
    "Blocking helps the shells lie flat and evenly spaced.",
    "Use a larger hook if your shells feel crowded or are curling.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Skipping the turning chain count, causing edges to narrow.",
    "Forgetting to chain 3 at the start of each row."
  ],
  "keywords": [
    "blanket",
    "ripple-afghan",
    "intermediate",
    "dc",
    "crochet"
  ]
},
{
  "id": "pattern-blanket-003",
  "name": "Basketweave Blanket",
  "shortDescription": "A textured blanket using front-post and back-post double crochet in a basketweave pattern.",
  "imageUrl": "/assets/patterns/pattern-blanket-003.webp",
  "category": "Blanket",
  "difficulty": {
    "level": "advanced",
    "score": 3,
    "reasoning": "Uses fpdc and bpdc stitches; blanket construction."
  },
  "estimatedTime": {
    "minHours": 6,
    "maxHours": 10,
    "unit": "hours",
    "assumedSkill": "Advanced"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 600,
      "suggestedYardageMax": 800,
      "fiberType": [
        "Acrylic"
      ],
      "notes": "Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "fpdc-bpdc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Double crochet (dc) in 4th chain from hook and each across. Turn.",
    "**Row 2:** Chain 3, *fpdc around next, bpdc around next.* Repeat across. Turn.",
    "**Row 3:** Chain 3, *bpdc around next, fpdc around next.* Repeat across. Turn.",
    "**Repeat Rows 2-3:** Continue for desired length, alternating to create basketweave texture."
  ],
  "beginnerTips": [
    "fpdc: yarn over, insert hook from front to back around the post of the stitch.",
    "bpdc: yarn over, insert hook from back to front around the post of the stitch.",
    "Practice post stitches on a swatch first to get the motion down.",
    "Always make a gauge swatch and block it before measuring.",
    "Read through the entire pattern before beginning.",
    "Use lifelines in lace patterns to avoid re-doing rows after mistakes."
  ],
  "commonMistakes": [
    "Confusing front-post and back-post stitch placement.",
    "Skipping the turning chain because post stitches are distracting."
  ],
  "keywords": [
    "blanket",
    "basketweave-blanket",
    "advanced",
    "fpdc-bpdc",
    "crochet"
  ]
},
{
  "id": "pattern-blanket-004",
  "name": "Corner-to-Corner Throw",
  "shortDescription": "A diagonal throw using the corner-to-corner technique with multiple color blocks.",
  "imageUrl": "/assets/patterns/pattern-blanket-004.webp",
  "category": "Blanket",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses c2c stitches; blanket construction."
  },
  "estimatedTime": {
    "minHours": 5,
    "maxHours": 8,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 500,
      "suggestedYardageMax": 700,
      "fiberType": [
        "Acrylic"
      ],
      "notes": "Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "c2c",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Block 1:** Chain 6. Dc in 4th, 5th, and 6th chains from hook. (1 block)",
    "**Increase Row:** Chain 6, dc in 4th-6th chains. Slip stitch to ch-3 space of previous block. Chain 3, 3 dc in same space.",
    "**Continue Increasing:** Add one block each row until piece reaches desired width.",
    "**Decrease Row:** Slip stitch across first block, chain 3, 3 dc in next ch-3 space. Continue across.",
    "**Continue Decreasing:** Decrease each row until 1 block remains. Fasten off.",
    "**Border:** Single crochet evenly around all 4 edges, 3 sc in each corner."
  ],
  "beginnerTips": [
    "Each C2C block = chain 3 + 3 double crochet into the chain-3 space of the previous block.",
    "Use a row counter to track where you are in the increase/decrease sequence.",
    "The fabric is worked diagonally\u2014don't worry if it looks odd at first.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Counting blocks incorrectly\u2014use a row counter.",
    "Pulling the slip stitch join too tight, puckering the fabric."
  ],
  "keywords": [
    "blanket",
    "corner-to-corner-throw",
    "intermediate",
    "c2c",
    "crochet"
  ]
},
{
  "id": "pattern-bookmark-003",
  "name": "Lacy Bookmark",
  "shortDescription": "An elegant bookmark with a simple lace repeat using chains and double crochet.",
  "imageUrl": "/assets/patterns/pattern-bookmark-003.webp",
  "category": "Bookmark",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses dc stitches; bookmark construction."
  },
  "estimatedTime": {
    "minHours": 0.5,
    "maxHours": 1,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "3 (DK/Light)",
      "weightNumber": 3,
      "suggestedYardageMin": 15,
      "suggestedYardageMax": 25,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 4.5,
      "sizeUS": "7",
      "sizeUK": "7",
      "notes": "Standard hook for 3 (DK/Light) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "dc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Double crochet (dc) in 4th chain from hook and each across. Turn.",
    "**Row 2:** Chain 3 (counts as dc), dc in each stitch across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length."
  ],
  "beginnerTips": [
    "Shell = 5 double crochet worked into the same stitch or space.",
    "Blocking helps the shells lie flat and evenly spaced.",
    "Use a larger hook if your shells feel crowded or are curling."
  ],
  "commonMistakes": [
    "Skipping the turning chain count, causing edges to narrow.",
    "Forgetting to chain 3 at the start of each row."
  ],
  "keywords": [
    "bookmark",
    "lacy-bookmark",
    "beginner",
    "dc",
    "crochet"
  ]
},
{
  "id": "pattern-bottle-002",
  "name": "Insulated Bottle Cozy",
  "shortDescription": "A snug cozy for a water bottle with an integrated strap. Keeps drinks cool.",
  "imageUrl": "/assets/patterns/pattern-bottle-002.webp",
  "category": "Water bottle holder",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; water bottle holder construction."
  },
  "estimatedTime": {
    "minHours": 1,
    "maxHours": 1.5,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 60,
      "suggestedYardageMax": 80,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "water bottle holder",
    "insulated-bottle-cozy",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-bulky-002",
  "name": "Chunky Cowl",
  "shortDescription": "A quick, cozy cowl worked in the round with half-double crochet. Uses one skein of bulky yarn.",
  "imageUrl": "/assets/patterns/pattern-bulky-002.webp",
  "category": "Accessories",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses hdc stitches; accessories construction."
  },
  "estimatedTime": {
    "minHours": 1,
    "maxHours": 2,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "5 (Bulky)",
      "weightNumber": 5,
      "suggestedYardageMin": 100,
      "suggestedYardageMax": 150,
      "fiberType": [
        "Acrylic",
        "Wool"
      ],
      "notes": "Acrylic Wool yarn works best for this project."
    },
    "hook": {
      "sizeMM": 6.5,
      "sizeUS": "K-10.5",
      "sizeUK": "4",
      "notes": "Standard hook for 5 (Bulky) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "hdc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain length needed for project width.",
    "**Row 1:** Half double crochet (hdc) in 3rd chain from hook and each across. Turn.",
    "**Row 2:** Chain 2 (counts as first hdc), hdc in each stitch across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length."
  ],
  "beginnerTips": [
    "The chain 2 at the start of each row counts as the first half-double crochet.",
    "Half-double crochet creates a nice middle ground between sc and dc.",
    "Count your stitches each row to keep edges straight."
  ],
  "commonMistakes": [
    "Forgetting the chain-2 turning chain counts as a stitch.",
    "Working through the wrong loop when the pattern specifies."
  ],
  "keywords": [
    "accessories",
    "chunky-cowl",
    "beginner",
    "hdc",
    "crochet"
  ]
},
{
  "id": "pattern-bulky-003",
  "name": "Bulky Beanie",
  "shortDescription": "A fast beanie using bulky yarn with a folded brim. Great for gifts.",
  "imageUrl": "/assets/patterns/pattern-bulky-003.webp",
  "category": "Hat",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses hdc stitches; hat construction."
  },
  "estimatedTime": {
    "minHours": 1,
    "maxHours": 1.5,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "5 (Bulky)",
      "weightNumber": 5,
      "suggestedYardageMin": 80,
      "suggestedYardageMax": 120,
      "fiberType": [
        "Acrylic",
        "Wool"
      ],
      "notes": "Acrylic Wool yarn works best for this project."
    },
    "hook": {
      "sizeMM": 6.5,
      "sizeUS": "K-10.5",
      "sizeUK": "4",
      "notes": "Standard hook for 5 (Bulky) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "hdc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain length needed for project width.",
    "**Row 1:** Half double crochet (hdc) in 3rd chain from hook and each across. Turn.",
    "**Row 2:** Chain 2 (counts as first hdc), hdc in each stitch across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends."
  ],
  "beginnerTips": [
    "The chain 2 at the start of each row counts as the first half-double crochet.",
    "Half-double crochet creates a nice middle ground between sc and dc.",
    "Count your stitches each row to keep edges straight."
  ],
  "commonMistakes": [
    "Forgetting the chain-2 turning chain counts as a stitch.",
    "Working through the wrong loop when the pattern specifies."
  ],
  "keywords": [
    "hat",
    "bulky-beanie",
    "beginner",
    "hdc",
    "crochet"
  ]
},
{
  "id": "pattern-bulky-004",
  "name": "Bulky Wrap",
  "shortDescription": "A cozy rectangular wrap using half-double crochet and bulky yarn. Works up in an evening.",
  "imageUrl": "/assets/patterns/pattern-bulky-004.webp",
  "category": "Shawl",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses hdc stitches; shawl construction."
  },
  "estimatedTime": {
    "minHours": 2,
    "maxHours": 4,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "5 (Bulky)",
      "weightNumber": 5,
      "suggestedYardageMin": 200,
      "suggestedYardageMax": 300,
      "fiberType": [
        "Acrylic"
      ],
      "notes": "Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 6.5,
      "sizeUS": "K-10.5",
      "sizeUK": "4",
      "notes": "Standard hook for 5 (Bulky) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "hdc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain length needed for project width.",
    "**Row 1:** Half double crochet (hdc) in 3rd chain from hook and each across. Turn.",
    "**Row 2:** Chain 2 (counts as first hdc), hdc in each stitch across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length."
  ],
  "beginnerTips": [
    "The chain 2 at the start of each row counts as the first half-double crochet.",
    "Half-double crochet creates a nice middle ground between sc and dc.",
    "Count your stitches each row to keep edges straight."
  ],
  "commonMistakes": [
    "Forgetting the chain-2 turning chain counts as a stitch.",
    "Working through the wrong loop when the pattern specifies."
  ],
  "keywords": [
    "shawl",
    "bulky-wrap",
    "beginner",
    "hdc",
    "crochet"
  ]
},
{
  "id": "pattern-bulky-mitts-001",
  "name": "Bulky Fingerless Mitts",
  "shortDescription": "Quick fingerless mitts using bulky yarn and half-double crochet with a thumb opening.",
  "imageUrl": "/assets/patterns/pattern-bulky-mitts-001.webp",
  "category": "Accessories",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses hdc stitches; accessories construction."
  },
  "estimatedTime": {
    "minHours": 1,
    "maxHours": 1.5,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "5 (Bulky)",
      "weightNumber": 5,
      "suggestedYardageMin": 80,
      "suggestedYardageMax": 120,
      "fiberType": [
        "Acrylic",
        "Wool"
      ],
      "notes": "Acrylic Wool yarn works best for this project."
    },
    "hook": {
      "sizeMM": 6.5,
      "sizeUS": "K-10.5",
      "sizeUK": "4",
      "notes": "Standard hook for 5 (Bulky) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "hdc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain length needed for project width.",
    "**Row 1:** Half double crochet (hdc) in 3rd chain from hook and each across. Turn.",
    "**Row 2:** Chain 2 (counts as first hdc), hdc in each stitch across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends."
  ],
  "beginnerTips": [
    "The chain 2 at the start of each row counts as the first half-double crochet.",
    "Half-double crochet creates a nice middle ground between sc and dc.",
    "Count your stitches each row to keep edges straight."
  ],
  "commonMistakes": [
    "Forgetting the chain-2 turning chain counts as a stitch.",
    "Working through the wrong loop when the pattern specifies."
  ],
  "keywords": [
    "accessories",
    "bulky-fingerless-mitts",
    "beginner",
    "hdc",
    "crochet"
  ]
},
{
  "id": "pattern-bulky-pillow-001",
  "name": "Bulky Throw Pillow",
  "shortDescription": "A chunky throw pillow cover worked in two flat panels and seamed. Uses super-fast bulky yarn.",
  "imageUrl": "/assets/patterns/pattern-bulky-pillow-001.webp",
  "category": "Home Decor",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; home decor construction."
  },
  "estimatedTime": {
    "minHours": 2,
    "maxHours": 3,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "5 (Bulky)",
      "weightNumber": 5,
      "suggestedYardageMin": 200,
      "suggestedYardageMax": 300,
      "fiberType": [
        "Acrylic"
      ],
      "notes": "Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 6.5,
      "sizeUS": "K-10.5",
      "sizeUK": "4",
      "notes": "Standard hook for 5 (Bulky) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "home decor",
    "bulky-throw-pillow",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-bulky-scarf-002",
  "name": "Chunky Ribbed Scarf",
  "shortDescription": "A thick, warm scarf using half-double crochet in the back loop only for a ribbed texture.",
  "imageUrl": "/assets/patterns/pattern-bulky-scarf-002.webp",
  "category": "Scarf",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses hdc and blo stitches; scarf construction."
  },
  "estimatedTime": {
    "minHours": 1,
    "maxHours": 2,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "5 (Bulky)",
      "weightNumber": 5,
      "suggestedYardageMin": 120,
      "suggestedYardageMax": 180,
      "fiberType": [
        "Acrylic",
        "Wool"
      ],
      "notes": "Acrylic Wool yarn works best for this project."
    },
    "hook": {
      "sizeMM": 6.5,
      "sizeUS": "K-10.5",
      "sizeUK": "4",
      "notes": "Standard hook for 5 (Bulky) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "hdc-blo",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Half double crochet (hdc) in 3rd chain from hook and each across. Turn.",
    "**Row 2:** Chain 2, turn. Hdc in back loop only of each stitch across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length. The back-loop-only creates a ribbed texture."
  ],
  "beginnerTips": [
    "Back-loop-only hdc creates a ribbed texture similar to knitting.",
    "The chain 2 at the start counts as a stitch.",
    "This stitch pattern is very forgiving for beginners learning texture work."
  ],
  "commonMistakes": [
    "Working through both loops instead of back loop only.",
    "Losing the ribbed effect when tension varies."
  ],
  "keywords": [
    "scarf",
    "chunky-ribbed-scarf",
    "beginner",
    "hdc-blo",
    "crochet"
  ]
},
{
  "id": "pattern-bulky-slouchy-hat-001",
  "name": "Slouchy Chunky Hat",
  "shortDescription": "A relaxed, slouchy hat in bulky yarn with a ribbed brim and simple crown shaping.",
  "imageUrl": "/assets/patterns/pattern-bulky-slouchy-hat-001.webp",
  "category": "Hat",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses hdc stitches; hat construction."
  },
  "estimatedTime": {
    "minHours": 1.5,
    "maxHours": 2.5,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "5 (Bulky)",
      "weightNumber": 5,
      "suggestedYardageMin": 100,
      "suggestedYardageMax": 150,
      "fiberType": [
        "Acrylic"
      ],
      "notes": "Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 6.5,
      "sizeUS": "K-10.5",
      "sizeUK": "4",
      "notes": "Standard hook for 5 (Bulky) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "hdc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain length needed for project width.",
    "**Row 1:** Half double crochet (hdc) in 3rd chain from hook and each across. Turn.",
    "**Row 2:** Chain 2 (counts as first hdc), hdc in each stitch across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "The chain 2 at the start of each row counts as the first half-double crochet.",
    "Half-double crochet creates a nice middle ground between sc and dc.",
    "Count your stitches each row to keep edges straight."
  ],
  "commonMistakes": [
    "Forgetting the chain-2 turning chain counts as a stitch.",
    "Working through the wrong loop when the pattern specifies."
  ],
  "keywords": [
    "hat",
    "slouchy-chunky-hat",
    "beginner",
    "hdc",
    "crochet"
  ]
},
{
  "id": "pattern-coaster-004",
  "name": "Woven Coaster",
  "shortDescription": "A unique woven-look coaster using a simple over-under technique with single crochet strips.",
  "imageUrl": "/assets/patterns/pattern-coaster-004.webp",
  "category": "Coaster",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; coaster construction."
  },
  "estimatedTime": {
    "minHours": 0.5,
    "maxHours": 1,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 30,
      "suggestedYardageMax": 40,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "coaster",
    "woven-coaster",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-coaster-005",
  "name": "Hexagon Coaster",
  "shortDescription": "A 6-sided coaster worked in the round. Great for practicing hexagon motifs.",
  "imageUrl": "/assets/patterns/pattern-coaster-005.webp",
  "category": "Coaster",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses dc stitches; coaster construction."
  },
  "estimatedTime": {
    "minHours": 0.5,
    "maxHours": 1,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 20,
      "suggestedYardageMax": 30,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "dc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Double crochet (dc) in 4th chain from hook and each across. Turn.",
    "**Row 2:** Chain 3 (counts as dc), dc in each stitch across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block to open the stitch pattern."
  ],
  "beginnerTips": [
    "Shell = 5 double crochet worked into the same stitch or space.",
    "Blocking helps the shells lie flat and evenly spaced.",
    "Use a larger hook if your shells feel crowded or are curling."
  ],
  "commonMistakes": [
    "Skipping the turning chain count, causing edges to narrow.",
    "Forgetting to chain 3 at the start of each row."
  ],
  "keywords": [
    "coaster",
    "hexagon-coaster",
    "beginner",
    "dc",
    "crochet"
  ]
},
{
  "id": "pattern-dishcloth-004",
  "name": "Basketweave Dishcloth",
  "shortDescription": "A textured dishcloth with a basketweave pattern using front-post and back-post stitches.",
  "imageUrl": "/assets/patterns/pattern-dishcloth-004.webp",
  "category": "Dishcloth",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses fpdc and bpdc stitches; dishcloth construction."
  },
  "estimatedTime": {
    "minHours": 1,
    "maxHours": 2,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 60,
      "suggestedYardageMax": 80,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "fpdc-bpdc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Double crochet (dc) in 4th chain from hook and each across. Turn.",
    "**Row 2:** Chain 3, *fpdc around next, bpdc around next.* Repeat across. Turn.",
    "**Row 3:** Chain 3, *bpdc around next, fpdc around next.* Repeat across. Turn.",
    "**Repeat Rows 2-3:** Continue for desired length, alternating to create basketweave texture."
  ],
  "beginnerTips": [
    "fpdc: yarn over, insert hook from front to back around the post of the stitch.",
    "bpdc: yarn over, insert hook from back to front around the post of the stitch.",
    "Practice post stitches on a swatch first to get the motion down.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Confusing front-post and back-post stitch placement.",
    "Skipping the turning chain because post stitches are distracting."
  ],
  "keywords": [
    "dishcloth",
    "basketweave-dishcloth",
    "intermediate",
    "fpdc-bpdc",
    "crochet"
  ]
},
{
  "id": "pattern-dk-001",
  "name": "DK Baby Hat",
  "shortDescription": "A lightweight baby hat in DK yarn with a pom-pom. Quick and soft for sensitive skin.",
  "imageUrl": "/assets/patterns/pattern-dk-001.webp",
  "category": "Baby",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; baby construction."
  },
  "estimatedTime": {
    "minHours": 0.5,
    "maxHours": 1,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "3 (DK/Light)",
      "weightNumber": 3,
      "suggestedYardageMin": 50,
      "suggestedYardageMax": 80,
      "fiberType": [
        "Cotton",
        "Acrylic"
      ],
      "notes": "Cotton Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 4.5,
      "sizeUS": "7",
      "sizeUK": "7",
      "notes": "Standard hook for 3 (DK/Light) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "baby",
    "dk-baby-hat",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-dk-002",
  "name": "DK Fingerless Gloves",
  "shortDescription": "Lightweight fingerless gloves in DK weight yarn with a ribbed cuff and thumb hole.",
  "imageUrl": "/assets/patterns/pattern-dk-002.webp",
  "category": "Accessories",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses sc stitches; accessories construction."
  },
  "estimatedTime": {
    "minHours": 1.5,
    "maxHours": 2.5,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "3 (DK/Light)",
      "weightNumber": 3,
      "suggestedYardageMin": 100,
      "suggestedYardageMax": 150,
      "fiberType": [
        "Acrylic",
        "Wool"
      ],
      "notes": "Acrylic Wool yarn works best for this project."
    },
    "hook": {
      "sizeMM": 4.5,
      "sizeUS": "7",
      "sizeUK": "7",
      "notes": "Standard hook for 3 (DK/Light) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "accessories",
    "dk-fingerless-gloves",
    "intermediate",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-dk-003",
  "name": "DK Triangle Shawl",
  "shortDescription": "A delicate triangular shawl in DK yarn with a shell stitch border.",
  "imageUrl": "/assets/patterns/pattern-dk-003.webp",
  "category": "Shawl",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses dc stitches; shawl construction."
  },
  "estimatedTime": {
    "minHours": 3,
    "maxHours": 5,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "3 (DK/Light)",
      "weightNumber": 3,
      "suggestedYardageMin": 300,
      "suggestedYardageMax": 400,
      "fiberType": [
        "Cotton",
        "Bamboo"
      ],
      "notes": "Cotton Bamboo yarn works best for this project."
    },
    "hook": {
      "sizeMM": 4.5,
      "sizeUS": "7",
      "sizeUK": "7",
      "notes": "Standard hook for 3 (DK/Light) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "dc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Double crochet (dc) in 4th chain from hook and each across. Turn.",
    "**Row 2:** Chain 3 (counts as dc), dc in each stitch across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block to open the stitch pattern.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Shell = 5 double crochet worked into the same stitch or space.",
    "Blocking helps the shells lie flat and evenly spaced.",
    "Use a larger hook if your shells feel crowded or are curling.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Skipping the turning chain count, causing edges to narrow.",
    "Forgetting to chain 3 at the start of each row."
  ],
  "keywords": [
    "shawl",
    "dk-triangle-shawl",
    "intermediate",
    "dc",
    "crochet"
  ]
},
{
  "id": "pattern-dk-004",
  "name": "DK Coaster Set",
  "shortDescription": "A set of 4 matching coasters in DK weight yarn with a scalloped edge.",
  "imageUrl": "/assets/patterns/pattern-dk-004.webp",
  "category": "Coaster",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; coaster construction."
  },
  "estimatedTime": {
    "minHours": 0.5,
    "maxHours": 1,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "3 (DK/Light)",
      "weightNumber": 3,
      "suggestedYardageMin": 40,
      "suggestedYardageMax": 60,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 4.5,
      "sizeUS": "7",
      "sizeUK": "7",
      "notes": "Standard hook for 3 (DK/Light) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "coaster",
    "dk-coaster-set",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-eyeglass-003",
  "name": "Zippered Eyeglass Case",
  "shortDescription": "A padded eyeglass case with a zipper closure. Uses a soft lining for lens protection.",
  "imageUrl": "/assets/patterns/pattern-eyeglass-003.webp",
  "category": "Eyeglass case",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses sc stitches; eyeglass case construction."
  },
  "estimatedTime": {
    "minHours": 1.5,
    "maxHours": 2.5,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 60,
      "suggestedYardageMax": 80,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "eyeglass case",
    "zippered-eyeglass-case",
    "intermediate",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-fine-001",
  "name": "Fine-Weight Scarf",
  "shortDescription": "A delicate scarf in fine/sport weight yarn with a simple lace pattern. Lightweight and drapey.",
  "imageUrl": "/assets/patterns/pattern-fine-001.webp",
  "category": "Scarf",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses dc stitches; scarf construction."
  },
  "estimatedTime": {
    "minHours": 2,
    "maxHours": 3,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "2 (Fine/Sport)",
      "weightNumber": 2,
      "suggestedYardageMin": 200,
      "suggestedYardageMax": 300,
      "fiberType": [
        "Cotton",
        "Bamboo"
      ],
      "notes": "Cotton Bamboo yarn works best for this project."
    },
    "hook": {
      "sizeMM": 3.5,
      "sizeUS": "E-4",
      "sizeUK": "9",
      "notes": "Standard hook for 2 (Fine/Sport) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "dc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Double crochet (dc) in 4th chain from hook and each across. Turn.",
    "**Row 2:** Chain 3 (counts as dc), dc in each stitch across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length."
  ],
  "beginnerTips": [
    "Shell = 5 double crochet worked into the same stitch or space.",
    "Blocking helps the shells lie flat and evenly spaced.",
    "Use a larger hook if your shells feel crowded or are curling."
  ],
  "commonMistakes": [
    "Skipping the turning chain count, causing edges to narrow.",
    "Forgetting to chain 3 at the start of each row."
  ],
  "keywords": [
    "scarf",
    "fine-weight-scarf",
    "beginner",
    "dc",
    "crochet"
  ]
},
{
  "id": "pattern-fine-002",
  "name": "Fine Baby Blanket",
  "shortDescription": "A lightweight baby blanket in sport weight yarn with a picot edge border.",
  "imageUrl": "/assets/patterns/pattern-fine-002.webp",
  "category": "Baby blanket square",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; baby blanket square construction."
  },
  "estimatedTime": {
    "minHours": 3,
    "maxHours": 5,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "2 (Fine/Sport)",
      "weightNumber": 2,
      "suggestedYardageMin": 300,
      "suggestedYardageMax": 400,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 3.5,
      "sizeUS": "E-4",
      "sizeUK": "9",
      "notes": "Standard hook for 2 (Fine/Sport) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "baby blanket square",
    "fine-baby-blanket",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-fingering-baby-hat-001",
  "name": "Fingering Baby Hat",
  "shortDescription": "A tiny newborn hat in fingering weight yarn. Perfect for a delicate handmade gift.",
  "imageUrl": "/assets/patterns/pattern-fingering-baby-hat-001.webp",
  "category": "Baby",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses sc stitches; baby construction."
  },
  "estimatedTime": {
    "minHours": 1,
    "maxHours": 2,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "1 (Super Fine/Fingering)",
      "weightNumber": 1,
      "suggestedYardageMin": 50,
      "suggestedYardageMax": 80,
      "fiberType": [
        "Cotton",
        "Merino"
      ],
      "notes": "Cotton Merino yarn works best for this project."
    },
    "hook": {
      "sizeMM": 3.0,
      "sizeUS": "C/D-2",
      "sizeUK": "11",
      "notes": "Standard hook for 1 (Super Fine/Fingering) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "baby",
    "fingering-baby-hat",
    "intermediate",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-fingering-beanie-001",
  "name": "Fingering Beanie",
  "shortDescription": "A lightweight adult beanie in fingering weight with a ribbed brim and crown decreases.",
  "imageUrl": "/assets/patterns/pattern-fingering-beanie-001.webp",
  "category": "Hat",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses sc stitches; hat construction."
  },
  "estimatedTime": {
    "minHours": 3,
    "maxHours": 5,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "1 (Super Fine/Fingering)",
      "weightNumber": 1,
      "suggestedYardageMin": 200,
      "suggestedYardageMax": 300,
      "fiberType": [
        "Merino",
        "Alpaca"
      ],
      "notes": "Merino Alpaca yarn works best for this project."
    },
    "hook": {
      "sizeMM": 3.0,
      "sizeUS": "C/D-2",
      "sizeUK": "11",
      "notes": "Standard hook for 1 (Super Fine/Fingering) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation:** Make a magic ring.",
    "**Round 1:** Chain 1, work 6 single crochet (sc) into ring. Join. (6 sc)",
    "**Round 2:** Chain 1, *2 sc in each stitch.* Repeat around. Join. (12 sc)",
    "**Round 3:** Chain 1, *sc in next, 2 sc in next.* Repeat around. Join.",
    "**Continue increasing** until piece is desired width, then work even in sc rounds.",
    "**Finishing:** Fasten off, weave in ends. Block to shape.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "hat",
    "fingering-beanie",
    "intermediate",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-fingering-cowl-001",
  "name": "Fingering Cowl",
  "shortDescription": "A delicate cowl worked in the round with fingering weight yarn and a lace stitch pattern.",
  "imageUrl": "/assets/patterns/pattern-fingering-cowl-001.webp",
  "category": "Accessories",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses dc and lace stitches; accessories construction."
  },
  "estimatedTime": {
    "minHours": 3,
    "maxHours": 5,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "1 (Super Fine/Fingering)",
      "weightNumber": 1,
      "suggestedYardageMin": 250,
      "suggestedYardageMax": 350,
      "fiberType": [
        "Merino",
        "Silk"
      ],
      "notes": "Merino Silk yarn works best for this project."
    },
    "hook": {
      "sizeMM": 3.0,
      "sizeUS": "C/D-2",
      "sizeUK": "11",
      "notes": "Standard hook for 1 (Super Fine/Fingering) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "dc-lace",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Dc in 4th chain from hook, *chain 1, skip 1, dc in next.* Repeat across. Turn.",
    "**Row 2:** Chain 3, dc in first dc. *Chain 1, dc in next dc.* Repeat across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Border:** Work single crochet evenly around edges, with a picot edge (sc, ch 3, sc) in each corner."
  ],
  "beginnerTips": [
    "The chain-1 spaces create the lace effect\u2014keep them even in size.",
    "Blocking is essential for lace patterns; it opens up the design.",
    "Use stitch markers every 10-20 pattern repeats to stay on track.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Losing track of the chain-1 spaces in the lace repeat.",
    "Not blocking the finished piece to open up the lace pattern."
  ],
  "keywords": [
    "accessories",
    "fingering-cowl",
    "intermediate",
    "dc-lace",
    "crochet"
  ]
},
{
  "id": "pattern-fingering-shawl-002",
  "name": "Fingering Lace Shawl",
  "shortDescription": "An elegant triangular lace shawl in fingering weight. Features a picot edge and openwork pattern.",
  "imageUrl": "/assets/patterns/pattern-fingering-shawl-002.webp",
  "category": "Shawl",
  "difficulty": {
    "level": "advanced",
    "score": 3,
    "reasoning": "Uses lace stitches; shawl construction."
  },
  "estimatedTime": {
    "minHours": 6,
    "maxHours": 10,
    "unit": "hours",
    "assumedSkill": "Advanced"
  },
  "materials": {
    "yarn": {
      "weightCategory": "1 (Super Fine/Fingering)",
      "weightNumber": 1,
      "suggestedYardageMin": 400,
      "suggestedYardageMax": 600,
      "fiberType": [
        "Merino",
        "Silk"
      ],
      "notes": "Merino Silk yarn works best for this project."
    },
    "hook": {
      "sizeMM": 3.0,
      "sizeUS": "C/D-2",
      "sizeUK": "11",
      "notes": "Standard hook for 1 (Super Fine/Fingering) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "lace",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Ring:** Chain 6, join with slip stitch to form a ring.",
    "**Round 1:** Chain 3 (counts as dc), 11 dc into ring. Join. (12 dc)",
    "**Round 2:** *Chain 5, skip 1, sc in next.* Repeat around. Join.",
    "**Round 3:** *In each ch-5 space: sc, hdc, 3 dc, hdc, sc.* Repeat around. Join.",
    "**Round 4:** *Chain 7, sc between petals.* Repeat around.",
    "**Round 5:** *In each ch-7 space: sc, hdc, 5 dc, hdc, sc.* Repeat around.",
    "**Finishing:** Fasten off, weave in ends. Wet block and pin to shape, allowing to dry completely."
  ],
  "beginnerTips": [
    "Lace patterns require blocking to look their best\u2014don't skip this step.",
    "Use rust-proof pins for blocking to avoid stains.",
    "Count your stitches between each pattern repeat to catch mistakes early.",
    "Always make a gauge swatch and block it before measuring.",
    "Read through the entire pattern before beginning.",
    "Use lifelines in lace patterns to avoid re-doing rows after mistakes."
  ],
  "commonMistakes": [
    "Not blocking the finished piece\u2014lace looks lumpy and uneven without blocking.",
    "Losing count of chains in long chain-7 or chain-5 loops."
  ],
  "keywords": [
    "shawl",
    "fingering-lace-shawl",
    "advanced",
    "lace",
    "crochet"
  ]
},
{
  "id": "pattern-fingering-socks-001",
  "name": "Toe-Up Socks",
  "shortDescription": "A pair of fingering weight socks worked toe-up with a short-row heel and ribbed cuff.",
  "imageUrl": "/assets/patterns/pattern-fingering-socks-001.webp",
  "category": "Accessories",
  "difficulty": {
    "level": "advanced",
    "score": 3,
    "reasoning": "Uses sc and hdc stitches; accessories construction."
  },
  "estimatedTime": {
    "minHours": 5,
    "maxHours": 8,
    "unit": "hours",
    "assumedSkill": "Advanced"
  },
  "materials": {
    "yarn": {
      "weightCategory": "1 (Super Fine/Fingering)",
      "weightNumber": 1,
      "suggestedYardageMin": 300,
      "suggestedYardageMax": 400,
      "fiberType": [
        "Merino",
        "Nylon"
      ],
      "notes": "Merino Nylon yarn works best for this project."
    },
    "hook": {
      "sizeMM": 3.0,
      "sizeUS": "C/D-2",
      "sizeUK": "11",
      "notes": "Standard hook for 1 (Super Fine/Fingering) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc-hdc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends.",
    "**Continue:** Repeat established pattern until piece reaches desired size.",
    "**Continue:** Repeat established pattern until piece reaches desired size.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Mixing sc and hdc in the same project is a great way to learn stitch height control.",
    "Mark the start of each round with a stitch marker.",
    "Fingering weight takes patience\u2014the fabric grows slowly but the result is worth it.",
    "Always make a gauge swatch and block it before measuring.",
    "Read through the entire pattern before beginning.",
    "Use lifelines in lace patterns to avoid re-doing rows after mistakes."
  ],
  "commonMistakes": [
    "Losing stitch count when switching between sc and hdc.",
    "Uneven tension between stitch types, causing wavy edges."
  ],
  "keywords": [
    "accessories",
    "toe-up-socks",
    "advanced",
    "sc-hdc",
    "crochet"
  ]
},
{
  "id": "pattern-fingering-washcloth-001",
  "name": "Fingering Washcloth",
  "shortDescription": "A fine-gauge washcloth in fingering weight cotton. Luxuriously soft for facial cleansing.",
  "imageUrl": "/assets/patterns/pattern-fingering-washcloth-001.webp",
  "category": "Dishcloth",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; dishcloth construction."
  },
  "estimatedTime": {
    "minHours": 1,
    "maxHours": 1.5,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "1 (Super Fine/Fingering)",
      "weightNumber": 1,
      "suggestedYardageMin": 30,
      "suggestedYardageMax": 50,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 3.0,
      "sizeUS": "C/D-2",
      "sizeUK": "11",
      "notes": "Standard hook for 1 (Super Fine/Fingering) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "dishcloth",
    "fingering-washcloth",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-fingering-wrist-warmers-001",
  "name": "Fingering Wrist Warmers",
  "shortDescription": "Elegant wrist warmers in fingering weight with a lace pattern on the back of the hand.",
  "imageUrl": "/assets/patterns/pattern-fingering-wrist-warmers-001.webp",
  "category": "Accessories",
  "difficulty": {
    "level": "advanced",
    "score": 3,
    "reasoning": "Uses dc and lace stitches; accessories construction."
  },
  "estimatedTime": {
    "minHours": 2,
    "maxHours": 4,
    "unit": "hours",
    "assumedSkill": "Advanced"
  },
  "materials": {
    "yarn": {
      "weightCategory": "1 (Super Fine/Fingering)",
      "weightNumber": 1,
      "suggestedYardageMin": 100,
      "suggestedYardageMax": 150,
      "fiberType": [
        "Merino"
      ],
      "notes": "Merino yarn works best for this project."
    },
    "hook": {
      "sizeMM": 3.0,
      "sizeUS": "C/D-2",
      "sizeUK": "11",
      "notes": "Standard hook for 1 (Super Fine/Fingering) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "dc-lace",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Dc in 4th chain from hook, *chain 1, skip 1, dc in next.* Repeat across. Turn.",
    "**Row 2:** Chain 3, dc in first dc. *Chain 1, dc in next dc.* Repeat across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Border:** Work single crochet evenly around edges, with a picot edge (sc, ch 3, sc) in each corner.",
    "**Finishing:** Fasten off, weave in ends. Wet block to open the lace pattern."
  ],
  "beginnerTips": [
    "The chain-1 spaces create the lace effect\u2014keep them even in size.",
    "Blocking is essential for lace patterns; it opens up the design.",
    "Use stitch markers every 10-20 pattern repeats to stay on track.",
    "Always make a gauge swatch and block it before measuring.",
    "Read through the entire pattern before beginning.",
    "Use lifelines in lace patterns to avoid re-doing rows after mistakes."
  ],
  "commonMistakes": [
    "Losing track of the chain-1 spaces in the lace repeat.",
    "Not blocking the finished piece to open up the lace pattern."
  ],
  "keywords": [
    "accessories",
    "fingering-wrist-warmers",
    "advanced",
    "dc-lace",
    "crochet"
  ]
},
{
  "id": "pattern-glasses-002",
  "name": "Reading Glasses Pouch",
  "shortDescription": "A slim pouch for reading glasses with a button flap closure and soft lining.",
  "imageUrl": "/assets/patterns/pattern-glasses-002.webp",
  "category": "Eyeglass case",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; eyeglass case construction."
  },
  "estimatedTime": {
    "minHours": 1,
    "maxHours": 1.5,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 40,
      "suggestedYardageMax": 60,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "eyeglass case",
    "reading-glasses-pouch",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-granny-006",
  "name": "Sunburst Granny Square",
  "shortDescription": "A colorful sunburst granny square with a floral center. Great for blankets or pillows.",
  "imageUrl": "/assets/patterns/pattern-granny-006.webp",
  "category": "Granny square",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses dc stitches; granny square construction."
  },
  "estimatedTime": {
    "minHours": 0.5,
    "maxHours": 1,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 30,
      "suggestedYardageMax": 50,
      "fiberType": [
        "Acrylic",
        "Cotton"
      ],
      "notes": "Acrylic Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "dc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Double crochet (dc) in 4th chain from hook and each across. Turn.",
    "**Row 2:** Chain 3 (counts as dc), dc in each stitch across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block to open the stitch pattern."
  ],
  "beginnerTips": [
    "Shell = 5 double crochet worked into the same stitch or space.",
    "Blocking helps the shells lie flat and evenly spaced.",
    "Use a larger hook if your shells feel crowded or are curling.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Skipping the turning chain count, causing edges to narrow.",
    "Forgetting to chain 3 at the start of each row."
  ],
  "keywords": [
    "granny square",
    "sunburst-granny-square",
    "intermediate",
    "dc",
    "crochet"
  ]
},
{
  "id": "pattern-granny-007",
  "name": "Daisy Granny Square",
  "shortDescription": "A 3D daisy granny square with raised petals. Perfect for a summer blanket.",
  "imageUrl": "/assets/patterns/pattern-granny-007.webp",
  "category": "Granny square",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses dc stitches; granny square construction."
  },
  "estimatedTime": {
    "minHours": 0.5,
    "maxHours": 1,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 30,
      "suggestedYardageMax": 50,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "dc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Double crochet (dc) in 4th chain from hook and each across. Turn.",
    "**Row 2:** Chain 3 (counts as dc), dc in each stitch across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block to open the stitch pattern.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Shell = 5 double crochet worked into the same stitch or space.",
    "Blocking helps the shells lie flat and evenly spaced.",
    "Use a larger hook if your shells feel crowded or are curling.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Skipping the turning chain count, causing edges to narrow.",
    "Forgetting to chain 3 at the start of each row."
  ],
  "keywords": [
    "granny square",
    "daisy-granny-square",
    "intermediate",
    "dc",
    "crochet"
  ]
},
{
  "id": "pattern-hat-003",
  "name": "Newsboy Cap",
  "shortDescription": "A vintage-style newsboy cap with a stiff brim and button top. Uses single crochet.",
  "imageUrl": "/assets/patterns/pattern-hat-003.webp",
  "category": "Hat",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses sc stitches; hat construction."
  },
  "estimatedTime": {
    "minHours": 2,
    "maxHours": 3,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 150,
      "suggestedYardageMax": 200,
      "fiberType": [
        "Cotton",
        "Acrylic"
      ],
      "notes": "Cotton Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation:** Make a magic ring.",
    "**Round 1:** Chain 1, work 6 single crochet (sc) into ring. Join. (6 sc)",
    "**Round 2:** Chain 1, *2 sc in each stitch.* Repeat around. Join. (12 sc)",
    "**Round 3:** Chain 1, *sc in next, 2 sc in next.* Repeat around. Join.",
    "**Continue increasing** until piece is desired width, then work even in sc rounds.",
    "**Finishing:** Fasten off, weave in ends. Block to shape.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "hat",
    "newsboy-cap",
    "intermediate",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-hat-004",
  "name": "Beret",
  "shortDescription": "A classic French beret worked in the round from the center out. Uses increase rounds for the flat top.",
  "imageUrl": "/assets/patterns/pattern-hat-004.webp",
  "category": "Hat",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses sc stitches; hat construction."
  },
  "estimatedTime": {
    "minHours": 1.5,
    "maxHours": 2.5,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 120,
      "suggestedYardageMax": 180,
      "fiberType": [
        "Acrylic",
        "Wool"
      ],
      "notes": "Acrylic Wool yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation:** Make a magic ring.",
    "**Round 1:** Chain 1, work 6 single crochet (sc) into ring. Join. (6 sc)",
    "**Round 2:** Chain 1, *2 sc in each stitch.* Repeat around. Join. (12 sc)",
    "**Round 3:** Chain 1, *sc in next, 2 sc in next.* Repeat around. Join.",
    "**Continue increasing** until piece is desired width, then work even in sc rounds.",
    "**Finishing:** Fasten off, weave in ends. Block to shape."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "hat",
    "beret",
    "intermediate",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-headband-002",
  "name": "Wide Knit-Look Headband",
  "shortDescription": "A wide headband using single crochet in back loop only for a knit-like ribbed texture.",
  "imageUrl": "/assets/patterns/pattern-headband-002.webp",
  "category": "Headband",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc and blo stitches; headband construction."
  },
  "estimatedTime": {
    "minHours": 1,
    "maxHours": 1.5,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 60,
      "suggestedYardageMax": 80,
      "fiberType": [
        "Acrylic"
      ],
      "notes": "Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc-blo",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Sc in back loop only of each stitch across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends."
  ],
  "beginnerTips": [
    "Working in the back loop only creates a stretchy, ribbed fabric.",
    "The front loop will be left unworked, creating a horizontal ridge.",
    "Keep your tension moderate\u2014too tight and the fabric won't stretch."
  ],
  "commonMistakes": [
    "Forgetting to work in the back loop only.",
    "Pulling the back loop too tight, causing the fabric to curl."
  ],
  "keywords": [
    "headband",
    "wide-knit-look-headband",
    "beginner",
    "sc-blo",
    "crochet"
  ]
},
{
  "id": "pattern-home-002",
  "name": "Rug",
  "shortDescription": "A sturdy oval rug using single crochet with two strands of yarn held together. Machine washable.",
  "imageUrl": "/assets/patterns/pattern-home-002.webp",
  "category": "Home Decor",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; home decor construction."
  },
  "estimatedTime": {
    "minHours": 3,
    "maxHours": 5,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "5 (Bulky)",
      "weightNumber": 5,
      "suggestedYardageMin": 400,
      "suggestedYardageMax": 600,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 6.5,
      "sizeUS": "K-10.5",
      "sizeUK": "4",
      "notes": "Standard hook for 5 (Bulky) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "home decor",
    "rug",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-home-003",
  "name": "Table Runner",
  "shortDescription": "An elegant table runner with a central lace panel and solid borders.",
  "imageUrl": "/assets/patterns/pattern-home-003.webp",
  "category": "Home Decor",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses dc and lace stitches; home decor construction."
  },
  "estimatedTime": {
    "minHours": 3,
    "maxHours": 5,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 200,
      "suggestedYardageMax": 300,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "dc-lace",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Dc in 4th chain from hook, *chain 1, skip 1, dc in next.* Repeat across. Turn.",
    "**Row 2:** Chain 3, dc in first dc. *Chain 1, dc in next dc.* Repeat across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Border:** Work single crochet evenly around edges, with a picot edge (sc, ch 3, sc) in each corner.",
    "**Finishing:** Fasten off, weave in ends. Wet block to open the lace pattern."
  ],
  "beginnerTips": [
    "The chain-1 spaces create the lace effect\u2014keep them even in size.",
    "Blocking is essential for lace patterns; it opens up the design.",
    "Use stitch markers every 10-20 pattern repeats to stay on track.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Losing track of the chain-1 spaces in the lace repeat.",
    "Not blocking the finished piece to open up the lace pattern."
  ],
  "keywords": [
    "home decor",
    "table-runner",
    "intermediate",
    "dc-lace",
    "crochet"
  ]
},
{
  "id": "pattern-home-004",
  "name": "Cushion Cover",
  "shortDescription": "A zippered cushion cover with a textured stitch pattern. Fits a 16-inch square cushion.",
  "imageUrl": "/assets/patterns/pattern-home-004.webp",
  "category": "Home Decor",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses sc and dc stitches; home decor construction."
  },
  "estimatedTime": {
    "minHours": 2,
    "maxHours": 4,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 200,
      "suggestedYardageMax": 300,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc-dc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Double crochet (dc) in each stitch across. Turn.",
    "**Row 3:** Chain 1, turn. Single crochet in each stitch across. Turn.",
    "**Repeat Rows 2-3:** Alternate until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends."
  ],
  "beginnerTips": [
    "Alternating sc and dc rows creates a nice textured fabric.",
    "Count your stitches every row\u2014the switch between stitch types makes it easy to drop a stitch.",
    "Mark your starting chain with a stitch marker so you don't lose count.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Losing stitch count when switching between sc and dc.",
    "Forgetting which row pattern you're on without a row counter."
  ],
  "keywords": [
    "home decor",
    "cushion-cover",
    "intermediate",
    "sc-dc",
    "crochet"
  ]
},
{
  "id": "pattern-jumbo-basket-001",
  "name": "Jumbo Storage Basket",
  "shortDescription": "A large, sturdy basket using super bulky yarn. Perfect for storing toys, blankets, or yarn.",
  "imageUrl": "/assets/patterns/pattern-jumbo-basket-001.webp",
  "category": "Home Decor",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; home decor construction."
  },
  "estimatedTime": {
    "minHours": 3,
    "maxHours": 5,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "6 (Super Bulky)",
      "weightNumber": 6,
      "suggestedYardageMin": 300,
      "suggestedYardageMax": 500,
      "fiberType": [
        "Cotton",
        "Acrylic"
      ],
      "notes": "Cotton Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 10.0,
      "sizeUS": "N/P-15",
      "sizeUK": "000",
      "notes": "Standard hook for 6 (Super Bulky) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly.",
    "**Continue:** Repeat established pattern until piece reaches desired size.",
    "**Continue:** Repeat established pattern until piece reaches desired size.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "home decor",
    "jumbo-storage-basket",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-jumbo-blanket-001",
  "name": "Jumbo Quick Blanket",
  "shortDescription": "An ultra-fast blanket using jumbo-weight yarn and a large hook. Complete in one evening.",
  "imageUrl": "/assets/patterns/pattern-jumbo-blanket-001.webp",
  "category": "Blanket",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; blanket construction."
  },
  "estimatedTime": {
    "minHours": 3,
    "maxHours": 5,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "6 (Super Bulky)",
      "weightNumber": 6,
      "suggestedYardageMin": 300,
      "suggestedYardageMax": 500,
      "fiberType": [
        "Acrylic"
      ],
      "notes": "Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 10.0,
      "sizeUS": "N/P-15",
      "sizeUK": "000",
      "notes": "Standard hook for 6 (Super Bulky) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "blanket",
    "jumbo-quick-blanket",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-jumbo-cowl-001",
  "name": "Jumbo Infinity Cowl",
  "shortDescription": "A super-chunky infinity cowl worked in the round. Uses jumbo yarn and a large hook.",
  "imageUrl": "/assets/patterns/pattern-jumbo-cowl-001.webp",
  "category": "Accessories",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; accessories construction."
  },
  "estimatedTime": {
    "minHours": 1,
    "maxHours": 2,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "6 (Super Bulky)",
      "weightNumber": 6,
      "suggestedYardageMin": 80,
      "suggestedYardageMax": 120,
      "fiberType": [
        "Acrylic"
      ],
      "notes": "Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 10.0,
      "sizeUS": "N/P-15",
      "sizeUK": "000",
      "notes": "Standard hook for 6 (Super Bulky) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "accessories",
    "jumbo-infinity-cowl",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-keychain-003",
  "name": "Smiley Face Keychain",
  "shortDescription": "A cheerful smiley face keychain worked in the round with embroidered features.",
  "imageUrl": "/assets/patterns/pattern-keychain-003.webp",
  "category": "Keychain",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; keychain construction."
  },
  "estimatedTime": {
    "minHours": 0.25,
    "maxHours": 0.5,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 5,
      "suggestedYardageMax": 10,
      "fiberType": [
        "Cotton",
        "Acrylic"
      ],
      "notes": "Cotton Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "keychain",
    "smiley-face-keychain",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-lace-bookmark-001",
  "name": "Victorian Lace Bookmark",
  "shortDescription": "An elegant bookmark with a Victorian-inspired lace pattern using chains and picots.",
  "imageUrl": "/assets/patterns/pattern-lace-bookmark-001.webp",
  "category": "Bookmark",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses lace stitches; bookmark construction."
  },
  "estimatedTime": {
    "minHours": 0.5,
    "maxHours": 1.5,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "2 (Fine/Sport)",
      "weightNumber": 2,
      "suggestedYardageMin": 15,
      "suggestedYardageMax": 25,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 3.5,
      "sizeUS": "E-4",
      "sizeUK": "9",
      "notes": "Standard hook for 2 (Fine/Sport) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "lace",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Ring:** Chain 6, join with slip stitch to form a ring.",
    "**Round 1:** Chain 3 (counts as dc), 11 dc into ring. Join. (12 dc)",
    "**Round 2:** *Chain 5, skip 1, sc in next.* Repeat around. Join.",
    "**Round 3:** *In each ch-5 space: sc, hdc, 3 dc, hdc, sc.* Repeat around. Join.",
    "**Round 4:** *Chain 7, sc between petals.* Repeat around."
  ],
  "beginnerTips": [
    "Lace patterns require blocking to look their best\u2014don't skip this step.",
    "Use rust-proof pins for blocking to avoid stains.",
    "Count your stitches between each pattern repeat to catch mistakes early.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Not blocking the finished piece\u2014lace looks lumpy and uneven without blocking.",
    "Losing count of chains in long chain-7 or chain-5 loops."
  ],
  "keywords": [
    "bookmark",
    "victorian-lace-bookmark",
    "intermediate",
    "lace",
    "crochet"
  ]
},
{
  "id": "pattern-lace-shawl-001",
  "name": "Crescent Lace Shawl",
  "shortDescription": "A crescent-shaped lace shawl worked from the top down with increasing rows and a scalloped edge.",
  "imageUrl": "/assets/patterns/pattern-lace-shawl-001.webp",
  "category": "Shawl",
  "difficulty": {
    "level": "advanced",
    "score": 3,
    "reasoning": "Uses lace stitches; shawl construction."
  },
  "estimatedTime": {
    "minHours": 4,
    "maxHours": 8,
    "unit": "hours",
    "assumedSkill": "Advanced"
  },
  "materials": {
    "yarn": {
      "weightCategory": "2 (Fine/Sport)",
      "weightNumber": 2,
      "suggestedYardageMin": 350,
      "suggestedYardageMax": 500,
      "fiberType": [
        "Cotton",
        "Bamboo"
      ],
      "notes": "Cotton Bamboo yarn works best for this project."
    },
    "hook": {
      "sizeMM": 3.5,
      "sizeUS": "E-4",
      "sizeUK": "9",
      "notes": "Standard hook for 2 (Fine/Sport) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "lace",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Ring:** Chain 6, join with slip stitch to form a ring.",
    "**Round 1:** Chain 3 (counts as dc), 11 dc into ring. Join. (12 dc)",
    "**Round 2:** *Chain 5, skip 1, sc in next.* Repeat around. Join.",
    "**Round 3:** *In each ch-5 space: sc, hdc, 3 dc, hdc, sc.* Repeat around. Join.",
    "**Round 4:** *Chain 7, sc between petals.* Repeat around.",
    "**Round 5:** *In each ch-7 space: sc, hdc, 5 dc, hdc, sc.* Repeat around.",
    "**Finishing:** Fasten off, weave in ends. Wet block and pin to shape, allowing to dry completely."
  ],
  "beginnerTips": [
    "Lace patterns require blocking to look their best\u2014don't skip this step.",
    "Use rust-proof pins for blocking to avoid stains.",
    "Count your stitches between each pattern repeat to catch mistakes early.",
    "Always make a gauge swatch and block it before measuring.",
    "Read through the entire pattern before beginning.",
    "Use lifelines in lace patterns to avoid re-doing rows after mistakes."
  ],
  "commonMistakes": [
    "Not blocking the finished piece\u2014lace looks lumpy and uneven without blocking.",
    "Losing count of chains in long chain-7 or chain-5 loops."
  ],
  "keywords": [
    "shawl",
    "crescent-lace-shawl",
    "advanced",
    "lace",
    "crochet"
  ]
},
{
  "id": "pattern-ornament-001",
  "name": "Crochet Ornament",
  "shortDescription": "A small ornament ball worked in spiral rounds with a hanging loop. Quick holiday project.",
  "imageUrl": "/assets/patterns/pattern-ornament-001.webp",
  "category": "Home Decor",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; home decor construction."
  },
  "estimatedTime": {
    "minHours": 0.25,
    "maxHours": 0.5,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 10,
      "suggestedYardageMax": 20,
      "fiberType": [
        "Acrylic",
        "Cotton"
      ],
      "notes": "Acrylic Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "home decor",
    "crochet-ornament",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-phone-002",
  "name": "Phone Sling",
  "shortDescription": "A cross-body phone sling with a small pouch and adjustable strap. Hands-free carrying.",
  "imageUrl": "/assets/patterns/pattern-phone-002.webp",
  "category": "Cell phone case",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses sc stitches; cell phone case construction."
  },
  "estimatedTime": {
    "minHours": 2,
    "maxHours": 3,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 100,
      "suggestedYardageMax": 150,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "cell phone case",
    "phone-sling",
    "intermediate",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-phone-case-003",
  "name": "Tablet Sleeve",
  "shortDescription": "A padded sleeve for a tablet or e-reader with a flap and button closure.",
  "imageUrl": "/assets/patterns/pattern-phone-case-003.webp",
  "category": "Cell phone case",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses sc stitches; cell phone case construction."
  },
  "estimatedTime": {
    "minHours": 2,
    "maxHours": 3,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 120,
      "suggestedYardageMax": 180,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "cell phone case",
    "tablet-sleeve",
    "intermediate",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-plant-hanger-003",
  "name": "Tiered Plant Hanger",
  "shortDescription": "A double-tiered plant hanger holding two small pots. Uses chain and single crochet.",
  "imageUrl": "/assets/patterns/pattern-plant-hanger-003.webp",
  "category": "Small plant hanger",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses ch and sc stitches; small plant hanger construction."
  },
  "estimatedTime": {
    "minHours": 1.5,
    "maxHours": 2,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 80,
      "suggestedYardageMax": 120,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "ch-sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "small plant hanger",
    "tiered-plant-hanger",
    "beginner",
    "ch-sc",
    "crochet"
  ]
},
{
  "id": "pattern-poncho-001",
  "name": "Simple Shell Poncho",
  "shortDescription": "A beginner-friendly poncho worked as two rectangles sewn together. Uses shell stitch pattern.",
  "imageUrl": "/assets/patterns/pattern-poncho-001.webp",
  "category": "Poncho",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses dc and shell stitches; poncho construction."
  },
  "estimatedTime": {
    "minHours": 3,
    "maxHours": 5,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 300,
      "suggestedYardageMax": 400,
      "fiberType": [
        "Acrylic"
      ],
      "notes": "Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "dc-shell",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain multiple of 6 + 1.",
    "**Row 1:** Sc in 2nd chain from hook. *Skip 2, 5 dc in next (shell), skip 2, sc in next.* Repeat across. Turn.",
    "**Row 2:** Chain 3, 2 dc in first sc. *Skip 2, sc in center dc of shell, skip 2, 5 dc in next sc.* Repeat. Turn.",
    "**Repeat Row 2:** Continue for desired length. Shells will alternate like a staggered pattern.",
    "**Border:** Sc evenly around, 3 sc in each corner."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "poncho",
    "simple-shell-poncho",
    "beginner",
    "dc-shell",
    "crochet"
  ]
},
{
  "id": "pattern-scarf-006",
  "name": "Infinity Scarf",
  "shortDescription": "A seamless infinity scarf worked in the round. Uses alternating single and double crochet rows.",
  "imageUrl": "/assets/patterns/pattern-scarf-006.webp",
  "category": "Scarf",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc and dc stitches; scarf construction."
  },
  "estimatedTime": {
    "minHours": 2,
    "maxHours": 3,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 200,
      "suggestedYardageMax": 250,
      "fiberType": [
        "Acrylic"
      ],
      "notes": "Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc-dc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Double crochet (dc) in each stitch across. Turn.",
    "**Row 3:** Chain 1, turn. Single crochet in each stitch across. Turn."
  ],
  "beginnerTips": [
    "Alternating sc and dc rows creates a nice textured fabric.",
    "Count your stitches every row\u2014the switch between stitch types makes it easy to drop a stitch.",
    "Mark your starting chain with a stitch marker so you don't lose count."
  ],
  "commonMistakes": [
    "Losing stitch count when switching between sc and dc.",
    "Forgetting which row pattern you're on without a row counter."
  ],
  "keywords": [
    "scarf",
    "infinity-scarf",
    "beginner",
    "sc-dc",
    "crochet"
  ]
},
{
  "id": "pattern-scarf-007",
  "name": "Mobius Scarf",
  "shortDescription": "A twisted mobius scarf with a unique one-twist construction. Worked in continuous rounds.",
  "imageUrl": "/assets/patterns/pattern-scarf-007.webp",
  "category": "Scarf",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses dc stitches; scarf construction."
  },
  "estimatedTime": {
    "minHours": 2,
    "maxHours": 4,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 250,
      "suggestedYardageMax": 300,
      "fiberType": [
        "Acrylic",
        "Wool"
      ],
      "notes": "Acrylic Wool yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "dc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Double crochet (dc) in 4th chain from hook and each across. Turn.",
    "**Row 2:** Chain 3 (counts as dc), dc in each stitch across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block to open the stitch pattern."
  ],
  "beginnerTips": [
    "Shell = 5 double crochet worked into the same stitch or space.",
    "Blocking helps the shells lie flat and evenly spaced.",
    "Use a larger hook if your shells feel crowded or are curling.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Skipping the turning chain count, causing edges to narrow.",
    "Forgetting to chain 3 at the start of each row."
  ],
  "keywords": [
    "scarf",
    "mobius-scarf",
    "intermediate",
    "dc",
    "crochet"
  ]
},
{
  "id": "pattern-scarf-008",
  "name": "Ombre Scarf",
  "shortDescription": "A gradient ombre scarf using single crochet with self-striping or hand-painted yarn.",
  "imageUrl": "/assets/patterns/pattern-scarf-008.webp",
  "category": "Scarf",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; scarf construction."
  },
  "estimatedTime": {
    "minHours": 2,
    "maxHours": 3,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 200,
      "suggestedYardageMax": 300,
      "fiberType": [
        "Acrylic"
      ],
      "notes": "Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "scarf",
    "ombre-scarf",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-shawl-002",
  "name": "Rectangular Wrap",
  "shortDescription": "A simple rectangular wrap worked lengthwise. Use self-striping yarn for a colorful effect.",
  "imageUrl": "/assets/patterns/pattern-shawl-002.webp",
  "category": "Shawl",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses dc stitches; shawl construction."
  },
  "estimatedTime": {
    "minHours": 3,
    "maxHours": 5,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 300,
      "suggestedYardageMax": 400,
      "fiberType": [
        "Acrylic"
      ],
      "notes": "Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "dc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Double crochet (dc) in 4th chain from hook and each across. Turn.",
    "**Row 2:** Chain 3 (counts as dc), dc in each stitch across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length."
  ],
  "beginnerTips": [
    "Shell = 5 double crochet worked into the same stitch or space.",
    "Blocking helps the shells lie flat and evenly spaced.",
    "Use a larger hook if your shells feel crowded or are curling."
  ],
  "commonMistakes": [
    "Skipping the turning chain count, causing edges to narrow.",
    "Forgetting to chain 3 at the start of each row."
  ],
  "keywords": [
    "shawl",
    "rectangular-wrap",
    "beginner",
    "dc",
    "crochet"
  ]
},
{
  "id": "pattern-shawl-003",
  "name": "Granny Stripe Shawl",
  "shortDescription": "A colorful shawl using the granny stripe pattern (dc clusters) with color changes every 2 rows.",
  "imageUrl": "/assets/patterns/pattern-shawl-003.webp",
  "category": "Shawl",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses dc stitches; shawl construction."
  },
  "estimatedTime": {
    "minHours": 4,
    "maxHours": 6,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 350,
      "suggestedYardageMax": 500,
      "fiberType": [
        "Acrylic",
        "Cotton"
      ],
      "notes": "Acrylic Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "dc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Double crochet (dc) in 4th chain from hook and each across. Turn.",
    "**Row 2:** Chain 3 (counts as dc), dc in each stitch across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block to open the stitch pattern.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Shell = 5 double crochet worked into the same stitch or space.",
    "Blocking helps the shells lie flat and evenly spaced.",
    "Use a larger hook if your shells feel crowded or are curling.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Skipping the turning chain count, causing edges to narrow.",
    "Forgetting to chain 3 at the start of each row."
  ],
  "keywords": [
    "shawl",
    "granny-stripe-shawl",
    "intermediate",
    "dc",
    "crochet"
  ]
},
{
  "id": "pattern-shawl-004",
  "name": "Asymmetric Shawl",
  "shortDescription": "A modern asymmetric shawl worked from one point, increasing along one edge only.",
  "imageUrl": "/assets/patterns/pattern-shawl-004.webp",
  "category": "Shawl",
  "difficulty": {
    "level": "advanced",
    "score": 3,
    "reasoning": "Uses sc and dc stitches; shawl construction."
  },
  "estimatedTime": {
    "minHours": 4,
    "maxHours": 6,
    "unit": "hours",
    "assumedSkill": "Advanced"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 300,
      "suggestedYardageMax": 400,
      "fiberType": [
        "Cotton",
        "Bamboo"
      ],
      "notes": "Cotton Bamboo yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc-dc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Double crochet (dc) in each stitch across. Turn.",
    "**Row 3:** Chain 1, turn. Single crochet in each stitch across. Turn.",
    "**Repeat Rows 2-3:** Alternate until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends."
  ],
  "beginnerTips": [
    "Alternating sc and dc rows creates a nice textured fabric.",
    "Count your stitches every row\u2014the switch between stitch types makes it easy to drop a stitch.",
    "Mark your starting chain with a stitch marker so you don't lose count.",
    "Always make a gauge swatch and block it before measuring.",
    "Read through the entire pattern before beginning.",
    "Use lifelines in lace patterns to avoid re-doing rows after mistakes."
  ],
  "commonMistakes": [
    "Losing stitch count when switching between sc and dc.",
    "Forgetting which row pattern you're on without a row counter."
  ],
  "keywords": [
    "shawl",
    "asymmetric-shawl",
    "advanced",
    "sc-dc",
    "crochet"
  ]
},
{
  "id": "pattern-slippers-001",
  "name": "Quick Slippers",
  "shortDescription": "Simple house slippers worked flat with shaping for heel and toe. Uses double strand for warmth.",
  "imageUrl": "/assets/patterns/pattern-slippers-001.webp",
  "category": "Slippers",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; slippers construction."
  },
  "estimatedTime": {
    "minHours": 2,
    "maxHours": 3,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "5 (Bulky)",
      "weightNumber": 5,
      "suggestedYardageMin": 150,
      "suggestedYardageMax": 200,
      "fiberType": [
        "Wool",
        "Acrylic"
      ],
      "notes": "Wool Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 6.5,
      "sizeUS": "K-10.5",
      "sizeUK": "4",
      "notes": "Standard hook for 5 (Bulky) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "slippers",
    "quick-slippers",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-sport-baby-blanket-001",
  "name": "Sport Baby Blanket",
  "shortDescription": "A lightweight baby blanket in sport weight yarn with a shell stitch border.",
  "imageUrl": "/assets/patterns/pattern-sport-baby-blanket-001.webp",
  "category": "Baby blanket square",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc and dc stitches; baby blanket square construction."
  },
  "estimatedTime": {
    "minHours": 4,
    "maxHours": 6,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "2 (Fine/Sport)",
      "weightNumber": 2,
      "suggestedYardageMin": 300,
      "suggestedYardageMax": 400,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 3.5,
      "sizeUS": "E-4",
      "sizeUK": "9",
      "notes": "Standard hook for 2 (Fine/Sport) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc-dc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Double crochet (dc) in each stitch across. Turn.",
    "**Row 3:** Chain 1, turn. Single crochet in each stitch across. Turn.",
    "**Repeat Rows 2-3:** Alternate until piece reaches desired length."
  ],
  "beginnerTips": [
    "Alternating sc and dc rows creates a nice textured fabric.",
    "Count your stitches every row\u2014the switch between stitch types makes it easy to drop a stitch.",
    "Mark your starting chain with a stitch marker so you don't lose count."
  ],
  "commonMistakes": [
    "Losing stitch count when switching between sc and dc.",
    "Forgetting which row pattern you're on without a row counter."
  ],
  "keywords": [
    "baby blanket square",
    "sport-baby-blanket",
    "beginner",
    "sc-dc",
    "crochet"
  ]
},
{
  "id": "pattern-sport-cardigan-001",
  "name": "Sport Baby Cardigan",
  "shortDescription": "A delicate baby cardigan in sport weight yarn with ribbon ties instead of buttons.",
  "imageUrl": "/assets/patterns/pattern-sport-cardigan-001.webp",
  "category": "Baby",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses dc stitches; baby construction."
  },
  "estimatedTime": {
    "minHours": 3,
    "maxHours": 5,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "2 (Fine/Sport)",
      "weightNumber": 2,
      "suggestedYardageMin": 200,
      "suggestedYardageMax": 300,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 3.5,
      "sizeUS": "E-4",
      "sizeUK": "9",
      "notes": "Standard hook for 2 (Fine/Sport) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "dc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Double crochet (dc) in 4th chain from hook and each across. Turn.",
    "**Row 2:** Chain 3 (counts as dc), dc in each stitch across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block to open the stitch pattern.",
    "**Continue:** Repeat established pattern until piece reaches desired size.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Shell = 5 double crochet worked into the same stitch or space.",
    "Blocking helps the shells lie flat and evenly spaced.",
    "Use a larger hook if your shells feel crowded or are curling.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Skipping the turning chain count, causing edges to narrow.",
    "Forgetting to chain 3 at the start of each row."
  ],
  "keywords": [
    "baby",
    "sport-baby-cardigan",
    "intermediate",
    "dc",
    "crochet"
  ]
},
{
  "id": "pattern-sport-earflap-hat-001",
  "name": "Sport Earflap Hat",
  "shortDescription": "A warm hat with earflaps in sport weight yarn. Features braided ties.",
  "imageUrl": "/assets/patterns/pattern-sport-earflap-hat-001.webp",
  "category": "Baby",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; baby construction."
  },
  "estimatedTime": {
    "minHours": 1.5,
    "maxHours": 2.5,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "2 (Fine/Sport)",
      "weightNumber": 2,
      "suggestedYardageMin": 100,
      "suggestedYardageMax": 150,
      "fiberType": [
        "Acrylic"
      ],
      "notes": "Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 3.5,
      "sizeUS": "E-4",
      "sizeUK": "9",
      "notes": "Standard hook for 2 (Fine/Sport) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "baby",
    "sport-earflap-hat",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-sport-tank-001",
  "name": "Sport Baby Tank Top",
  "shortDescription": "A sleeveless baby top in sport weight yarn with shoulder buttons. Perfect for summer.",
  "imageUrl": "/assets/patterns/pattern-sport-tank-001.webp",
  "category": "Baby",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses dc stitches; baby construction."
  },
  "estimatedTime": {
    "minHours": 2,
    "maxHours": 3,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "2 (Fine/Sport)",
      "weightNumber": 2,
      "suggestedYardageMin": 100,
      "suggestedYardageMax": 150,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 3.5,
      "sizeUS": "E-4",
      "sizeUK": "9",
      "notes": "Standard hook for 2 (Fine/Sport) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "dc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Double crochet (dc) in 4th chain from hook and each across. Turn.",
    "**Row 2:** Chain 3 (counts as dc), dc in each stitch across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block to open the stitch pattern.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Shell = 5 double crochet worked into the same stitch or space.",
    "Blocking helps the shells lie flat and evenly spaced.",
    "Use a larger hook if your shells feel crowded or are curling.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Skipping the turning chain count, causing edges to narrow.",
    "Forgetting to chain 3 at the start of each row."
  ],
  "keywords": [
    "baby",
    "sport-baby-tank-top",
    "intermediate",
    "dc",
    "crochet"
  ]
},
{
  "id": "pattern-superbulky-001",
  "name": "Super Bulky Hat",
  "shortDescription": "An ultra-fast hat using super bulky yarn. Complete in under an hour.",
  "imageUrl": "/assets/patterns/pattern-superbulky-001.webp",
  "category": "Hat",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; hat construction."
  },
  "estimatedTime": {
    "minHours": 0.5,
    "maxHours": 1,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "6 (Super Bulky)",
      "weightNumber": 6,
      "suggestedYardageMin": 60,
      "suggestedYardageMax": 80,
      "fiberType": [
        "Acrylic"
      ],
      "notes": "Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 10.0,
      "sizeUS": "N/P-15",
      "sizeUK": "000",
      "notes": "Standard hook for 6 (Super Bulky) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation:** Make a magic ring.",
    "**Round 1:** Chain 1, work 6 single crochet (sc) into ring. Join. (6 sc)",
    "**Round 2:** Chain 1, *2 sc in each stitch.* Repeat around. Join. (12 sc)",
    "**Round 3:** Chain 1, *sc in next, 2 sc in next.* Repeat around. Join.",
    "**Continue increasing** until piece is desired width, then work even in sc rounds."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "hat",
    "super-bulky-hat",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-superbulky-002",
  "name": "Super Bulky Scarf",
  "shortDescription": "A quick scarf using super bulky yarn. Single crochet works up into a thick, warm fabric.",
  "imageUrl": "/assets/patterns/pattern-superbulky-002.webp",
  "category": "Scarf",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; scarf construction."
  },
  "estimatedTime": {
    "minHours": 1,
    "maxHours": 2,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "6 (Super Bulky)",
      "weightNumber": 6,
      "suggestedYardageMin": 100,
      "suggestedYardageMax": 150,
      "fiberType": [
        "Acrylic"
      ],
      "notes": "Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 10.0,
      "sizeUS": "N/P-15",
      "sizeUK": "000",
      "notes": "Standard hook for 6 (Super Bulky) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "scarf",
    "super-bulky-scarf",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-superbulky-basket-001",
  "name": "Super Bulky Basket",
  "shortDescription": "A giant floor basket using super bulky yarn. Perfect for storing blankets or toys.",
  "imageUrl": "/assets/patterns/pattern-superbulky-basket-001.webp",
  "category": "Home Decor",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; home decor construction."
  },
  "estimatedTime": {
    "minHours": 3,
    "maxHours": 5,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "6 (Super Bulky)",
      "weightNumber": 6,
      "suggestedYardageMin": 300,
      "suggestedYardageMax": 400,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 10.0,
      "sizeUS": "N/P-15",
      "sizeUK": "000",
      "notes": "Standard hook for 6 (Super Bulky) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly.",
    "**Continue:** Repeat established pattern until piece reaches desired size.",
    "**Continue:** Repeat established pattern until piece reaches desired size.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "home decor",
    "super-bulky-basket",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-superbulky-bathmat-001",
  "name": "Bath Mat",
  "shortDescription": "A thick, absorbent bath mat using super bulky cotton yarn. Machine washable.",
  "imageUrl": "/assets/patterns/pattern-superbulky-bathmat-001.webp",
  "category": "Home Decor",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; home decor construction."
  },
  "estimatedTime": {
    "minHours": 3,
    "maxHours": 5,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "6 (Super Bulky)",
      "weightNumber": 6,
      "suggestedYardageMin": 400,
      "suggestedYardageMax": 600,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 10.0,
      "sizeUS": "N/P-15",
      "sizeUK": "000",
      "notes": "Standard hook for 6 (Super Bulky) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "home decor",
    "bath-mat",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-superbulky-hat-001",
  "name": "Super Bulky Slouchy Beanie",
  "shortDescription": "A relaxed slouchy beanie in super bulky yarn with a folded brim.",
  "imageUrl": "/assets/patterns/pattern-superbulky-hat-001.webp",
  "category": "Hat",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses hdc stitches; hat construction."
  },
  "estimatedTime": {
    "minHours": 0.5,
    "maxHours": 1.5,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "6 (Super Bulky)",
      "weightNumber": 6,
      "suggestedYardageMin": 60,
      "suggestedYardageMax": 100,
      "fiberType": [
        "Acrylic"
      ],
      "notes": "Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 10.0,
      "sizeUS": "N/P-15",
      "sizeUK": "000",
      "notes": "Standard hook for 6 (Super Bulky) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "hdc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain length needed for project width.",
    "**Row 1:** Half double crochet (hdc) in 3rd chain from hook and each across. Turn.",
    "**Row 2:** Chain 2 (counts as first hdc), hdc in each stitch across. Turn.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "The chain 2 at the start of each row counts as the first half-double crochet.",
    "Half-double crochet creates a nice middle ground between sc and dc.",
    "Count your stitches each row to keep edges straight."
  ],
  "commonMistakes": [
    "Forgetting the chain-2 turning chain counts as a stitch.",
    "Working through the wrong loop when the pattern specifies."
  ],
  "keywords": [
    "hat",
    "super-bulky-slouchy-beanie",
    "beginner",
    "hdc",
    "crochet"
  ]
},
{
  "id": "pattern-superbulky-pet-bed-001",
  "name": "Pet Bed",
  "shortDescription": "A cozy round pet bed for small dogs or cats. Uses super bulky yarn for quick construction.",
  "imageUrl": "/assets/patterns/pattern-superbulky-pet-bed-001.webp",
  "category": "Home Decor",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; home decor construction."
  },
  "estimatedTime": {
    "minHours": 4,
    "maxHours": 6,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "6 (Super Bulky)",
      "weightNumber": 6,
      "suggestedYardageMin": 400,
      "suggestedYardageMax": 600,
      "fiberType": [
        "Acrylic"
      ],
      "notes": "Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 10.0,
      "sizeUS": "N/P-15",
      "sizeUK": "000",
      "notes": "Standard hook for 6 (Super Bulky) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly.",
    "**Continue:** Repeat established pattern until piece reaches desired size.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "home decor",
    "pet-bed",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-superbulky-scarf-002",
  "name": "Super Bulky Infinity Scarf",
  "shortDescription": "A thick infinity scarf in super bulky yarn. One skein project.",
  "imageUrl": "/assets/patterns/pattern-superbulky-scarf-002.webp",
  "category": "Scarf",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; scarf construction."
  },
  "estimatedTime": {
    "minHours": 1,
    "maxHours": 1.5,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "6 (Super Bulky)",
      "weightNumber": 6,
      "suggestedYardageMin": 80,
      "suggestedYardageMax": 120,
      "fiberType": [
        "Acrylic"
      ],
      "notes": "Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 10.0,
      "sizeUS": "N/P-15",
      "sizeUK": "000",
      "notes": "Standard hook for 6 (Super Bulky) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "scarf",
    "super-bulky-infinity-scarf",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-superbulky-throw-001",
  "name": "Super Bulky Throw",
  "shortDescription": "A quick throw blanket using super bulky yarn. Works up in a weekend.",
  "imageUrl": "/assets/patterns/pattern-superbulky-throw-001.webp",
  "category": "Blanket",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; blanket construction."
  },
  "estimatedTime": {
    "minHours": 4,
    "maxHours": 6,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "6 (Super Bulky)",
      "weightNumber": 6,
      "suggestedYardageMin": 400,
      "suggestedYardageMax": 600,
      "fiberType": [
        "Acrylic"
      ],
      "notes": "Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 10.0,
      "sizeUS": "N/P-15",
      "sizeUK": "000",
      "notes": "Standard hook for 6 (Super Bulky) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "blanket",
    "super-bulky-throw",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-tote-004",
  "name": "Foldable Tote",
  "shortDescription": "A foldable shopping tote that stuffs into its own pocket. Made with single crochet.",
  "imageUrl": "/assets/patterns/pattern-tote-004.webp",
  "category": "Beginner tote",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; beginner tote construction."
  },
  "estimatedTime": {
    "minHours": 2,
    "maxHours": 3,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 150,
      "suggestedYardageMax": 200,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation:** Make a magic ring.",
    "**Round 1:** Chain 1, work 6 single crochet (sc) into ring. Join. (6 sc)",
    "**Round 2:** Chain 1, *2 sc in each stitch.* Repeat around. Join. (12 sc)",
    "**Round 3:** Chain 1, *sc in next, 2 sc in next.* Repeat around. Join.",
    "**Continue increasing** until piece is desired width, then work even in sc rounds.",
    "**Finishing:** Fasten off, weave in ends. Block to shape."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "beginner tote",
    "foldable-tote",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-toy-002",
  "name": "Amigurumi Bunny",
  "shortDescription": "A cute amigurumi bunny with long ears, worked in spiral rounds with safety eyes.",
  "imageUrl": "/assets/patterns/pattern-toy-002.webp",
  "category": "Toy",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses sc stitches; toy construction."
  },
  "estimatedTime": {
    "minHours": 2,
    "maxHours": 3,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 80,
      "suggestedYardageMax": 120,
      "fiberType": [
        "Acrylic"
      ],
      "notes": "Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly.",
    "**Continue:** Repeat established pattern until piece reaches desired size.",
    "**Continue:** Repeat established pattern until piece reaches desired size.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "toy",
    "amigurumi-bunny",
    "intermediate",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-toy-003",
  "name": "Amigurumi Cat",
  "shortDescription": "A sleepy cat amigurumi with a curled body and tail. Perfect for nursery decor.",
  "imageUrl": "/assets/patterns/pattern-toy-003.webp",
  "category": "Toy",
  "difficulty": {
    "level": "intermediate",
    "score": 2,
    "reasoning": "Uses sc stitches; toy construction."
  },
  "estimatedTime": {
    "minHours": 2,
    "maxHours": 3,
    "unit": "hours",
    "assumedSkill": "Intermediate"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 60,
      "suggestedYardageMax": 100,
      "fiberType": [
        "Acrylic"
      ],
      "notes": "Acrylic yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly.",
    "**Continue:** Repeat established pattern until piece reaches desired size.",
    "**Continue:** Repeat established pattern until piece reaches desired size.",
    "**Continue:** Repeat established pattern until piece reaches desired size."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work.",
    "Always make a gauge swatch before starting.",
    "Read through the entire pattern before beginning."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "toy",
    "amigurumi-cat",
    "intermediate",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-water-bottle-003",
  "name": "Water Bottle Sling",
  "shortDescription": "A simple water bottle sling with an adjustable strap. Great for hiking or commuting.",
  "imageUrl": "/assets/patterns/pattern-water-bottle-003.webp",
  "category": "Water bottle holder",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; water bottle holder construction."
  },
  "estimatedTime": {
    "minHours": 1,
    "maxHours": 1.5,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 60,
      "suggestedYardageMax": 80,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "water bottle holder",
    "water-bottle-sling",
    "beginner",
    "sc",
    "crochet"
  ]
},
{
  "id": "pattern-wristband-003",
  "name": "Embroidered Wristband",
  "shortDescription": "A single crochet wristband with simple embroidery stitches on top for decoration.",
  "imageUrl": "/assets/patterns/pattern-wristband-003.webp",
  "category": "Wristband",
  "difficulty": {
    "level": "beginner",
    "score": 1,
    "reasoning": "Uses sc stitches; wristband construction."
  },
  "estimatedTime": {
    "minHours": 0.5,
    "maxHours": 1,
    "unit": "hours",
    "assumedSkill": "Beginner"
  },
  "materials": {
    "yarn": {
      "weightCategory": "4 (Medium)",
      "weightNumber": 4,
      "suggestedYardageMin": 15,
      "suggestedYardageMax": 25,
      "fiberType": [
        "Cotton"
      ],
      "notes": "Cotton yarn works best for this project."
    },
    "hook": {
      "sizeMM": 5.0,
      "sizeUS": "H-8",
      "sizeUK": "6",
      "notes": "Standard hook for 4 (Medium) yarn."
    },
    "notions": [
      "Yarn needle",
      "Scissors"
    ]
  },
  "gauge": {
    "stitches": 14,
    "rows": 14,
    "unit": "4 inches",
    "stitchPattern": "sc",
    "notes": "Gauge is not critical for this project."
  },
  "instructions": [
    "**Foundation Chain:** Chain to desired width.",
    "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
    "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
    "**Repeat Row 2:** Continue until piece reaches desired length.",
    "**Finishing:** Fasten off, weave in ends. Block lightly."
  ],
  "beginnerTips": [
    "Count your stitches at the end of every row to keep edges straight.",
    "Keep your tension relaxed; tight stitches make the fabric stiff.",
    "Use a stitch marker to mark the right side of your work."
  ],
  "commonMistakes": [
    "Accidentally skipping the first or last stitch of a row.",
    "Using the wrong hook size, resulting in stiff or loose fabric."
  ],
  "keywords": [
    "wristband",
    "embroidered-wristband",
    "beginner",
    "sc",
    "crochet"
  ]
}
];
