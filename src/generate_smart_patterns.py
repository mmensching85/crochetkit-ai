#!/usr/bin/env python3
"""
Generate realistic crochet patterns for all missing pattern IDs.
Cross-references existing data/images and produces complete pattern dicts.
Run after generate_patterns_json.py to append new patterns.
"""
import json, os, re

# ── Category definitions with realistic parameters ──

PATTERN_TEMPLATES = {
    # (category, weight_num, weight_label, hook_mm, hook_us, hook_uk, difficulty, min_h, max_h, skill)
}

# Each weight's hook specs
HOOKS = {
    1: {"mm": 3.0, "us": "C/D-2", "uk": "11", "label": "1 (Super Fine/Fingering)"},
    2: {"mm": 3.5, "us": "E-4",   "uk": "9",  "label": "2 (Fine/Sport)"},
    3: {"mm": 4.5, "us": "7",     "uk": "7",  "label": "3 (DK/Light)"},
    4: {"mm": 5.0, "us": "H-8",   "uk": "6",  "label": "4 (Medium)"},
    5: {"mm": 6.5, "us": "K-10.5","uk": "4",  "label": "5 (Bulky)"},
    6: {"mm": 10.0,"us": "N/P-15","uk": "000","label": "6 (Super Bulky)"},
}

# ── NEW PATTERN DEFINITIONS ──
# Each entry: (id, name, short_desc, category, weight, difficulty, min_h, max_h, skill, yard_min, yard_max, fiber, stitch_type, num_steps)

NEW_PATTERNS = [
    # ===== ACCESSORIES =====
    ("pattern-accessories-003", "Braided Headband", "A stylish braided headband made from three crocheted chains braided together with a button closure.", "Accessories", 4, "beginner", 0.5, 1, "Beginner", 20, 30, ["Acrylic", "Cotton"], "chain", 4),
    ("pattern-accessories-004", "Fashion Belt", "A crocheted belt using half-double crochet with a D-ring closure. Adjustable length.", "Accessories", 4, "beginner", 1, 2, "Beginner", 80, 120, ["Cotton"], "hdc", 4),

    # ===== AMIGURUMI =====
    ("pattern-amigurumi-002", "Amigurumi Teddy Bear", "A cute teddy bear amigurumi with movable limbs, worked in spiral rounds with safety eyes.", "Toy", 4, "intermediate", 2, 4, "Intermediate", 100, 150, ["Acrylic"], "sc", 8),

    # ===== BABY =====
    ("pattern-baby-002", "Baby Booties with Cuff", "Adorable rolled-cuff booties for babies with a simple sole and side construction.", "Baby", 3, "intermediate", 1.5, 2.5, "Intermediate", 80, 120, ["Cotton", "Acrylic"], "sc", 7),
    ("pattern-baby-003", "Baby Hat with Earflaps", "A warm baby hat with braided earflaps and a pom-pom on top.", "Baby", 3, "beginner", 1, 2, "Beginner", 60, 100, ["Acrylic"], "sc", 6),
    ("pattern-baby-004", "Baby Receiving Blanket", "A soft, lightweight receiving blanket using shell stitch border on a single crochet body.", "Baby blanket square", 3, "beginner", 3, 5, "Beginner", 300, 400, ["Cotton"], "sc-dc", 5),

    # ===== BAG =====
    ("pattern-bag-002", "Granny Square Bag", "A bohemian bag made from joined granny squares with fabric lining and leather handles.", "Bag", 4, "intermediate", 3, 5, "Intermediate", 200, 300, ["Cotton"], "dc", 6),
    ("pattern-bag-003", "Tote with Pockets", "A practical tote with outer slip pockets and sturdy double-stranded handles.", "Beginner tote", 4, "intermediate", 3, 5, "Intermediate", 300, 400, ["Cotton"], "sc", 6),
    ("pattern-bag-004", "Backpack", "A small drawstring backpack with padded straps. Great for day hikes or school.", "Bag", 4, "advanced", 4, 6, "Advanced", 350, 450, ["Cotton"], "sc", 7),

    # ===== BASKET =====
    ("pattern-basket-001", "Small Storage Basket", "A sturdy storage basket worked in the round with a flat base and tall sides.", "Home Decor", 5, "beginner", 2, 3, "Beginner", 150, 200, ["Cotton"], "sc", 8),

    # ===== BLANKET =====
    ("pattern-blanket-002", "Ripple Afghan", "A classic ripple stitch afghan with peaks and valleys. Uses double crochet increases and decreases.", "Blanket", 4, "intermediate", 5, 8, "Intermediate", 500, 700, ["Acrylic"], "dc", 5),
    ("pattern-blanket-003", "Basketweave Blanket", "A textured blanket using front-post and back-post double crochet in a basketweave pattern.", "Blanket", 4, "advanced", 6, 10, "Advanced", 600, 800, ["Acrylic"], "fpdc-bpdc", 5),
    ("pattern-blanket-004", "Corner-to-Corner Throw", "A diagonal throw using the corner-to-corner technique with multiple color blocks.", "Blanket", 4, "intermediate", 5, 8, "Intermediate", 500, 700, ["Acrylic"], "c2c", 6),

    # ===== BOOKMARK =====
    ("pattern-bookmark-003", "Lacy Bookmark", "An elegant bookmark with a simple lace repeat using chains and double crochet.", "Bookmark", 3, "beginner", 0.5, 1, "Beginner", 15, 25, ["Cotton"], "dc", 4),

    # ===== BOTTLE =====
    ("pattern-bottle-002", "Insulated Bottle Cozy", "A snug cozy for a water bottle with an integrated strap. Keeps drinks cool.", "Water bottle holder", 4, "beginner", 1, 1.5, "Beginner", 60, 80, ["Cotton"], "sc", 5),

    # ===== BULKY =====
    ("pattern-bulky-002", "Chunky Cowl", "A quick, cozy cowl worked in the round with half-double crochet. Uses one skein of bulky yarn.", "Accessories", 5, "beginner", 1, 2, "Beginner", 100, 150, ["Acrylic", "Wool"], "hdc", 4),
    ("pattern-bulky-003", "Bulky Beanie", "A fast beanie using bulky yarn with a folded brim. Great for gifts.", "Hat", 5, "beginner", 1, 1.5, "Beginner", 80, 120, ["Acrylic", "Wool"], "hdc", 5),
    ("pattern-bulky-004", "Bulky Wrap", "A cozy rectangular wrap using half-double crochet and bulky yarn. Works up in an evening.", "Shawl", 5, "beginner", 2, 4, "Beginner", 200, 300, ["Acrylic"], "hdc", 4),
    ("pattern-bulky-mitts-001", "Bulky Fingerless Mitts", "Quick fingerless mitts using bulky yarn and half-double crochet with a thumb opening.", "Accessories", 5, "beginner", 1, 1.5, "Beginner", 80, 120, ["Acrylic", "Wool"], "hdc", 5),
    ("pattern-bulky-pillow-001", "Bulky Throw Pillow", "A chunky throw pillow cover worked in two flat panels and seamed. Uses super-fast bulky yarn.", "Home Decor", 5, "beginner", 2, 3, "Beginner", 200, 300, ["Acrylic"], "sc", 5),
    ("pattern-bulky-scarf-002", "Chunky Ribbed Scarf", "A thick, warm scarf using half-double crochet in the back loop only for a ribbed texture.", "Scarf", 5, "beginner", 1, 2, "Beginner", 120, 180, ["Acrylic", "Wool"], "hdc-blo", 4),
    ("pattern-bulky-slouchy-hat-001", "Slouchy Chunky Hat", "A relaxed, slouchy hat in bulky yarn with a ribbed brim and simple crown shaping.", "Hat", 5, "beginner", 1.5, 2.5, "Beginner", 100, 150, ["Acrylic"], "hdc", 6),

    # ===== COASTER =====
    ("pattern-coaster-004", "Woven Coaster", "A unique woven-look coaster using a simple over-under technique with single crochet strips.", "Coaster", 4, "beginner", 0.5, 1, "Beginner", 30, 40, ["Cotton"], "sc", 5),
    ("pattern-coaster-005", "Hexagon Coaster", "A 6-sided coaster worked in the round. Great for practicing hexagon motifs.", "Coaster", 4, "beginner", 0.5, 1, "Beginner", 20, 30, ["Cotton"], "dc", 5),

    # ===== DISHCLOTH =====
    ("pattern-dishcloth-004", "Basketweave Dishcloth", "A textured dishcloth with a basketweave pattern using front-post and back-post stitches.", "Dishcloth", 4, "intermediate", 1, 2, "Intermediate", 60, 80, ["Cotton"], "fpdc-bpdc", 5),

    # ===== DK =====
    ("pattern-dk-001", "DK Baby Hat", "A lightweight baby hat in DK yarn with a pom-pom. Quick and soft for sensitive skin.", "Baby", 3, "beginner", 0.5, 1, "Beginner", 50, 80, ["Cotton", "Acrylic"], "sc", 5),
    ("pattern-dk-002", "DK Fingerless Gloves", "Lightweight fingerless gloves in DK weight yarn with a ribbed cuff and thumb hole.", "Accessories", 3, "intermediate", 1.5, 2.5, "Intermediate", 100, 150, ["Acrylic", "Wool"], "sc", 6),
    ("pattern-dk-003", "DK Triangle Shawl", "A delicate triangular shawl in DK yarn with a shell stitch border.", "Shawl", 3, "intermediate", 3, 5, "Intermediate", 300, 400, ["Cotton", "Bamboo"], "dc", 6),
    ("pattern-dk-004", "DK Coaster Set", "A set of 4 matching coasters in DK weight yarn with a scalloped edge.", "Coaster", 3, "beginner", 0.5, 1, "Beginner", 40, 60, ["Cotton"], "sc", 5),

    # ===== EARRINGS =====
    ("pattern-earrings-001", "Crochet Earrings", "Lightweight crochet earrings made with fine thread and earring hooks. Quick and customizable.", "Accessories", 2, "beginner", 0.25, 0.5, "Beginner", 5, 10, ["Cotton"], "sc", 4),

    # ===== EYEGLASS =====
    ("pattern-eyeglass-003", "Zippered Eyeglass Case", "A padded eyeglass case with a zipper closure. Uses a soft lining for lens protection.", "Eyeglass case", 4, "intermediate", 1.5, 2.5, "Intermediate", 60, 80, ["Cotton"], "sc", 6),

    # ===== FINE =====
    ("pattern-fine-001", "Fine-Weight Scarf", "A delicate scarf in fine/sport weight yarn with a simple lace pattern. Lightweight and drapey.", "Scarf", 2, "beginner", 2, 3, "Beginner", 200, 300, ["Cotton", "Bamboo"], "dc", 4),
    ("pattern-fine-002", "Fine Baby Blanket", "A lightweight baby blanket in sport weight yarn with a picot edge border.", "Baby blanket square", 2, "beginner", 3, 5, "Beginner", 300, 400, ["Cotton"], "sc", 5),

    # ===== FINGERING =====
    ("pattern-fingering-baby-hat-001", "Fingering Baby Hat", "A tiny newborn hat in fingering weight yarn. Perfect for a delicate handmade gift.", "Baby", 1, "intermediate", 1, 2, "Intermediate", 50, 80, ["Cotton", "Merino"], "sc", 6),
    ("pattern-fingering-beanie-001", "Fingering Beanie", "A lightweight adult beanie in fingering weight with a ribbed brim and crown decreases.", "Hat", 1, "intermediate", 3, 5, "Intermediate", 200, 300, ["Merino", "Alpaca"], "sc", 7),
    ("pattern-fingering-cowl-001", "Fingering Cowl", "A delicate cowl worked in the round with fingering weight yarn and a lace stitch pattern.", "Accessories", 1, "intermediate", 3, 5, "Intermediate", 250, 350, ["Merino", "Silk"], "dc-lace", 5),
    ("pattern-fingering-shawl-002", "Fingering Lace Shawl", "An elegant triangular lace shawl in fingering weight. Features a picot edge and openwork pattern.", "Shawl", 1, "advanced", 6, 10, "Advanced", 400, 600, ["Merino", "Silk"], "lace", 7),
    ("pattern-fingering-socks-001", "Toe-Up Socks", "A pair of fingering weight socks worked toe-up with a short-row heel and ribbed cuff.", "Accessories", 1, "advanced", 5, 8, "Advanced", 300, 400, ["Merino", "Nylon"], "sc-hdc", 8),
    ("pattern-fingering-washcloth-001", "Fingering Washcloth", "A fine-gauge washcloth in fingering weight cotton. Luxuriously soft for facial cleansing.", "Dishcloth", 1, "beginner", 1, 1.5, "Beginner", 30, 50, ["Cotton"], "sc", 4),
    ("pattern-fingering-wrist-warmers-001", "Fingering Wrist Warmers", "Elegant wrist warmers in fingering weight with a lace pattern on the back of the hand.", "Accessories", 1, "advanced", 2, 4, "Advanced", 100, 150, ["Merino"], "dc-lace", 6),

    # ===== GLASSES =====
    ("pattern-glasses-002", "Reading Glasses Pouch", "A slim pouch for reading glasses with a button flap closure and soft lining.", "Eyeglass case", 4, "beginner", 1, 1.5, "Beginner", 40, 60, ["Cotton"], "sc", 5),

    # ===== GRANNY =====
    ("pattern-granny-006", "Sunburst Granny Square", "A colorful sunburst granny square with a floral center. Great for blankets or pillows.", "Granny square", 4, "intermediate", 0.5, 1, "Intermediate", 30, 50, ["Acrylic", "Cotton"], "dc", 5),
    ("pattern-granny-007", "Daisy Granny Square", "A 3D daisy granny square with raised petals. Perfect for a summer blanket.", "Granny square", 4, "intermediate", 0.5, 1, "Intermediate", 30, 50, ["Cotton"], "dc", 6),

    # ===== HAT =====
    ("pattern-hat-003", "Newsboy Cap", "A vintage-style newsboy cap with a stiff brim and button top. Uses single crochet.", "Hat", 4, "intermediate", 2, 3, "Intermediate", 150, 200, ["Cotton", "Acrylic"], "sc", 7),
    ("pattern-hat-004", "Beret", "A classic French beret worked in the round from the center out. Uses increase rounds for the flat top.", "Hat", 4, "intermediate", 1.5, 2.5, "Intermediate", 120, 180, ["Acrylic", "Wool"], "sc", 6),

    # ===== HEADBAND =====
    ("pattern-headband-002", "Wide Knit-Look Headband", "A wide headband using single crochet in back loop only for a knit-like ribbed texture.", "Headband", 4, "beginner", 1, 1.5, "Beginner", 60, 80, ["Acrylic"], "sc-blo", 5),

    # ===== HOME =====
    ("pattern-home-002", "Rug", "A sturdy oval rug using single crochet with two strands of yarn held together. Machine washable.", "Home Decor", 5, "beginner", 3, 5, "Beginner", 400, 600, ["Cotton"], "sc", 6),
    ("pattern-home-003", "Table Runner", "An elegant table runner with a central lace panel and solid borders.", "Home Decor", 4, "intermediate", 3, 5, "Intermediate", 200, 300, ["Cotton"], "dc-lace", 6),
    ("pattern-home-004", "Cushion Cover", "A zippered cushion cover with a textured stitch pattern. Fits a 16-inch square cushion.", "Home Decor", 4, "intermediate", 2, 4, "Intermediate", 200, 300, ["Cotton"], "sc-dc", 6),

    # ===== JUMBO =====
    ("pattern-jumbo-basket-001", "Jumbo Storage Basket", "A large, sturdy basket using super bulky yarn. Perfect for storing toys, blankets, or yarn.", "Home Decor", 6, "beginner", 3, 5, "Beginner", 300, 500, ["Cotton", "Acrylic"], "sc", 8),
    ("pattern-jumbo-blanket-001", "Jumbo Quick Blanket", "An ultra-fast blanket using jumbo-weight yarn and a large hook. Complete in one evening.", "Blanket", 6, "beginner", 3, 5, "Beginner", 300, 500, ["Acrylic"], "sc", 4),
    ("pattern-jumbo-cowl-001", "Jumbo Infinity Cowl", "A super-chunky infinity cowl worked in the round. Uses jumbo yarn and a large hook.", "Accessories", 6, "beginner", 1, 2, "Beginner", 80, 120, ["Acrylic"], "sc", 4),

    # ===== KEYCHAIN =====
    ("pattern-keychain-003", "Smiley Face Keychain", "A cheerful smiley face keychain worked in the round with embroidered features.", "Keychain", 4, "beginner", 0.25, 0.5, "Beginner", 5, 10, ["Cotton", "Acrylic"], "sc", 4),

    # ===== LACE =====
    ("pattern-lace-bookmark-001", "Victorian Lace Bookmark", "An elegant bookmark with a Victorian-inspired lace pattern using chains and picots.", "Bookmark", 2, "intermediate", 0.5, 1.5, "Intermediate", 15, 25, ["Cotton"], "lace", 5),
    ("pattern-lace-dolly-001", "Lace Doily", "A classic round doily with a lacy pattern of chains and treble crochet clusters. Perfect for tabletops.", "Home Decor", 2, "intermediate", 2, 4, "Intermediate", 80, 120, ["Cotton"], "lace", 7),
    ("pattern-lace-shawl-001", "Crescent Lace Shawl", "A crescent-shaped lace shawl worked from the top down with increasing rows and a scalloped edge.", "Shawl", 2, "advanced", 4, 8, "Advanced", 350, 500, ["Cotton", "Bamboo"], "lace", 7),

    # ===== LEGWARMERS =====
    ("pattern-legwarmers-001", "Cozy Leg Warmers", "Warm leg warmers in medium weight yarn with a ribbed texture. Worked in the round.", "Accessories", 4, "beginner", 2, 3, "Beginner", 200, 300, ["Acrylic", "Wool"], "hdc-blo", 4),

    # ===== ORNAMENT =====
    ("pattern-ornament-001", "Crochet Ornament", "A small ornament ball worked in spiral rounds with a hanging loop. Quick holiday project.", "Home Decor", 4, "beginner", 0.25, 0.5, "Beginner", 10, 20, ["Acrylic", "Cotton"], "sc", 5),

    # ===== PHONE =====
    ("pattern-phone-002", "Phone Sling", "A cross-body phone sling with a small pouch and adjustable strap. Hands-free carrying.", "Cell phone case", 4, "intermediate", 2, 3, "Intermediate", 100, 150, ["Cotton"], "sc", 6),
    ("pattern-phone-case-003", "Tablet Sleeve", "A padded sleeve for a tablet or e-reader with a flap and button closure.", "Cell phone case", 4, "intermediate", 2, 3, "Intermediate", 120, 180, ["Cotton"], "sc", 6),

    # ===== PLANT HANGER =====
    ("pattern-plant-hanger-003", "Tiered Plant Hanger", "A double-tiered plant hanger holding two small pots. Uses chain and single crochet.", "Small plant hanger", 4, "beginner", 1.5, 2, "Beginner", 80, 120, ["Cotton"], "ch-sc", 6),

    # ===== PONCHO =====
    ("pattern-poncho-001", "Simple Shell Poncho", "A beginner-friendly poncho worked as two rectangles sewn together. Uses shell stitch pattern.", "Poncho", 4, "beginner", 3, 5, "Beginner", 300, 400, ["Acrylic"], "dc-shell", 5),

    # ===== POTHOLDER =====
    ("pattern-potholder-001", "Double-Thick Potholder", "A thick potholder made from two crocheted layers joined together. Cotton only for heat safety.", "Dishcloth", 4, "beginner", 1, 1.5, "Beginner", 80, 100, ["Cotton"], "sc", 5),

    # ===== SCARF =====
    ("pattern-scarf-006", "Infinity Scarf", "A seamless infinity scarf worked in the round. Uses alternating single and double crochet rows.", "Scarf", 4, "beginner", 2, 3, "Beginner", 200, 250, ["Acrylic"], "sc-dc", 4),
    ("pattern-scarf-007", "Mobius Scarf", "A twisted mobius scarf with a unique one-twist construction. Worked in continuous rounds.", "Scarf", 4, "intermediate", 2, 4, "Intermediate", 250, 300, ["Acrylic", "Wool"], "dc", 5),
    ("pattern-scarf-008", "Ombre Scarf", "A gradient ombre scarf using single crochet with self-striping or hand-painted yarn.", "Scarf", 4, "beginner", 2, 3, "Beginner", 200, 300, ["Acrylic"], "sc", 4),

    # ===== SCRUNCHIE =====
    ("pattern-scrunchie-001", "Crochet Scrunchie", "A fabric-covered hair scrunchie made by crocheting around a plain elastic hair tie.", "Accessories", 4, "beginner", 0.25, 0.5, "Beginner", 15, 25, ["Acrylic", "Cotton"], "sc", 4),

    # ===== SHAWL =====
    ("pattern-shawl-002", "Rectangular Wrap", "A simple rectangular wrap worked lengthwise. Use self-striping yarn for a colorful effect.", "Shawl", 4, "beginner", 3, 5, "Beginner", 300, 400, ["Acrylic"], "dc", 4),
    ("pattern-shawl-003", "Granny Stripe Shawl", "A colorful shawl using the granny stripe pattern (dc clusters) with color changes every 2 rows.", "Shawl", 4, "intermediate", 4, 6, "Intermediate", 350, 500, ["Acrylic", "Cotton"], "dc", 6),
    ("pattern-shawl-004", "Asymmetric Shawl", "A modern asymmetric shawl worked from one point, increasing along one edge only.", "Shawl", 4, "advanced", 4, 6, "Advanced", 300, 400, ["Cotton", "Bamboo"], "sc-dc", 6),

    # ===== SLIPPERS =====
    ("pattern-slippers-001", "Quick Slippers", "Simple house slippers worked flat with shaping for heel and toe. Uses double strand for warmth.", "Slippers", 5, "beginner", 2, 3, "Beginner", 150, 200, ["Wool", "Acrylic"], "sc", 6),

    # ===== SPORT =====
    ("pattern-sport-baby-blanket-001", "Sport Baby Blanket", "A lightweight baby blanket in sport weight yarn with a shell stitch border.", "Baby blanket square", 2, "beginner", 4, 6, "Beginner", 300, 400, ["Cotton"], "sc-dc", 5),
    ("pattern-sport-cardigan-001", "Sport Baby Cardigan", "A delicate baby cardigan in sport weight yarn with ribbon ties instead of buttons.", "Baby", 2, "intermediate", 3, 5, "Intermediate", 200, 300, ["Cotton"], "dc", 7),
    ("pattern-sport-earflap-hat-001", "Sport Earflap Hat", "A warm hat with earflaps in sport weight yarn. Features braided ties.", "Baby", 2, "beginner", 1.5, 2.5, "Beginner", 100, 150, ["Acrylic"], "sc", 6),
    ("pattern-sport-tank-001", "Sport Baby Tank Top", "A sleeveless baby top in sport weight yarn with shoulder buttons. Perfect for summer.", "Baby", 2, "intermediate", 2, 3, "Intermediate", 100, 150, ["Cotton"], "dc", 6),

    # ===== SUPER BULKY =====
    ("pattern-superbulky-001", "Super Bulky Hat", "An ultra-fast hat using super bulky yarn. Complete in under an hour.", "Hat", 6, "beginner", 0.5, 1, "Beginner", 60, 80, ["Acrylic"], "sc", 5),
    ("pattern-superbulky-002", "Super Bulky Scarf", "A quick scarf using super bulky yarn. Single crochet works up into a thick, warm fabric.", "Scarf", 6, "beginner", 1, 2, "Beginner", 100, 150, ["Acrylic"], "sc", 4),
    ("pattern-superbulky-basket-001", "Super Bulky Basket", "A giant floor basket using super bulky yarn. Perfect for storing blankets or toys.", "Home Decor", 6, "beginner", 3, 5, "Beginner", 300, 400, ["Cotton"], "sc", 8),
    ("pattern-superbulky-bathmat-001", "Bath Mat", "A thick, absorbent bath mat using super bulky cotton yarn. Machine washable.", "Home Decor", 6, "beginner", 3, 5, "Beginner", 400, 600, ["Cotton"], "sc", 5),
    ("pattern-superbulky-hat-001", "Super Bulky Slouchy Beanie", "A relaxed slouchy beanie in super bulky yarn with a folded brim.", "Hat", 6, "beginner", 0.5, 1.5, "Beginner", 60, 100, ["Acrylic"], "hdc", 6),
    ("pattern-superbulky-pet-bed-001", "Pet Bed", "A cozy round pet bed for small dogs or cats. Uses super bulky yarn for quick construction.", "Home Decor", 6, "beginner", 4, 6, "Beginner", 400, 600, ["Acrylic"], "sc", 7),
    ("pattern-superbulky-scarf-002", "Super Bulky Infinity Scarf", "A thick infinity scarf in super bulky yarn. One skein project.", "Scarf", 6, "beginner", 1, 1.5, "Beginner", 80, 120, ["Acrylic"], "sc", 4),
    ("pattern-superbulky-throw-001", "Super Bulky Throw", "A quick throw blanket using super bulky yarn. Works up in a weekend.", "Blanket", 6, "beginner", 4, 6, "Beginner", 400, 600, ["Acrylic"], "sc", 4),

    # ===== TOTE =====
    ("pattern-tote-004", "Foldable Tote", "A foldable shopping tote that stuffs into its own pocket. Made with single crochet.", "Beginner tote", 4, "beginner", 2, 3, "Beginner", 150, 200, ["Cotton"], "sc", 6),

    # ===== TOY =====
    ("pattern-toy-002", "Amigurumi Bunny", "A cute amigurumi bunny with long ears, worked in spiral rounds with safety eyes.", "Toy", 4, "intermediate", 2, 3, "Intermediate", 80, 120, ["Acrylic"], "sc", 8),
    ("pattern-toy-003", "Amigurumi Cat", "A sleepy cat amigurumi with a curled body and tail. Perfect for nursery decor.", "Toy", 4, "intermediate", 2, 3, "Intermediate", 60, 100, ["Acrylic"], "sc", 8),

    # ===== WATER BOTTLE =====
    ("pattern-water-bottle-003", "Water Bottle Sling", "A simple water bottle sling with an adjustable strap. Great for hiking or commuting.", "Water bottle holder", 4, "beginner", 1, 1.5, "Beginner", 60, 80, ["Cotton"], "sc", 5),

    # ===== WRISTBAND =====
    ("pattern-wristband-003", "Embroidered Wristband", "A single crochet wristband with simple embroidery stitches on top for decoration.", "Wristband", 4, "beginner", 0.5, 1, "Beginner", 15, 25, ["Cotton"], "sc", 5),
]

# ── INSTRUCTION TEMPLATES ──

def make_stitch_instructions(steps, stitch_type, category, weight_num):
    """Generate realistic instructions based on stitch type and category."""
    cmds = []
    
    if stitch_type == "chain":
        cmds = [
            ("**Foundation Chain:** Chain 60 (or desired length)."),
            ("**Row 1:** Single crochet (sc) in 2nd chain from hook and each chain across. Turn."),
            ("**Rows 2-4:** Chain 1, turn. Single crochet in each stitch across."),
            ("**Finishing:** Fasten off, weave in ends. Block lightly to flatten.")
        ]
    elif stitch_type == "hdc":
        cmds = [
            ("**Foundation Chain:** Chain length needed for project width."),
            ("**Row 1:** Half double crochet (hdc) in 3rd chain from hook and each across. Turn."),
            ("**Row 2:** Chain 2 (counts as first hdc), hdc in each stitch across. Turn."),
            ("**Repeat Row 2:** Continue until piece reaches desired length."),
            ("**Finishing:** Fasten off, weave in ends.")
        ]
    elif stitch_type == "sc":
        if "basket" in category.lower() or "plant" in category.lower() or "bag" in category.lower() or "tote" in category.lower() or "hat" in category.lower():
            cmds = [
                "**Foundation:** Make a magic ring.",
                "**Round 1:** Chain 1, work 6 single crochet (sc) into ring. Join. (6 sc)",
                "**Round 2:** Chain 1, *2 sc in each stitch.* Repeat around. Join. (12 sc)",
                "**Round 3:** Chain 1, *sc in next, 2 sc in next.* Repeat around. Join.",
                "**Continue increasing** until piece is desired width, then work even in sc rounds.",
                "**Finishing:** Fasten off, weave in ends. Block to shape."
            ]
        else:
            cmds = [
                "**Foundation Chain:** Chain to desired width.",
                "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
                "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
                "**Repeat Row 2:** Continue until piece reaches desired length.",
                "**Finishing:** Fasten off, weave in ends. Block lightly."
            ]
    elif stitch_type == "dc":
        cmds = [
            "**Foundation Chain:** Chain to desired width.",
            "**Row 1:** Double crochet (dc) in 4th chain from hook and each across. Turn.",
            "**Row 2:** Chain 3 (counts as dc), dc in each stitch across. Turn.",
            "**Repeat Row 2:** Continue until piece reaches desired length.",
            "**Finishing:** Fasten off, weave in ends. Block to open the stitch pattern."
        ]
    elif stitch_type == "sc-dc":
        cmds = [
            "**Foundation Chain:** Chain to desired width.",
            "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
            "**Row 2:** Chain 1, turn. Double crochet (dc) in each stitch across. Turn.",
            "**Row 3:** Chain 1, turn. Single crochet in each stitch across. Turn.",
            "**Repeat Rows 2-3:** Alternate until piece reaches desired length.",
            "**Finishing:** Fasten off, weave in ends."
        ]
    elif stitch_type == "hdc-blo":
        cmds = [
            "**Foundation Chain:** Chain to desired width.",
            "**Row 1:** Half double crochet (hdc) in 3rd chain from hook and each across. Turn.",
            "**Row 2:** Chain 2, turn. Hdc in back loop only of each stitch across. Turn.",
            "**Repeat Row 2:** Continue until piece reaches desired length. The back-loop-only creates a ribbed texture.",
            "**Finishing:** Fasten off, weave in ends."
        ]
    elif stitch_type == "sc-blo":
        cmds = [
            "**Foundation Chain:** Chain to desired width.",
            "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
            "**Row 2:** Chain 1, turn. Sc in back loop only of each stitch across. Turn.",
            "**Repeat Row 2:** Continue until piece reaches desired length.",
            "**Finishing:** Fasten off, weave in ends."
        ]
    elif stitch_type == "fpdc-bpdc":
        cmds = [
            "**Foundation Chain:** Chain to desired width.",
            "**Row 1:** Double crochet (dc) in 4th chain from hook and each across. Turn.",
            "**Row 2:** Chain 3, *fpdc around next, bpdc around next.* Repeat across. Turn.",
            "**Row 3:** Chain 3, *bpdc around next, fpdc around next.* Repeat across. Turn.",
            "**Repeat Rows 2-3:** Continue for desired length, alternating to create basketweave texture.",
            "**Finishing:** Fasten off, weave in ends. Block to even the texture."
        ]
    elif stitch_type == "c2c":
        cmds = [
            "**Block 1:** Chain 6. Dc in 4th, 5th, and 6th chains from hook. (1 block)",
            "**Increase Row:** Chain 6, dc in 4th-6th chains. Slip stitch to ch-3 space of previous block. Chain 3, 3 dc in same space.",
            "**Continue Increasing:** Add one block each row until piece reaches desired width.",
            "**Decrease Row:** Slip stitch across first block, chain 3, 3 dc in next ch-3 space. Continue across.",
            "**Continue Decreasing:** Decrease each row until 1 block remains. Fasten off.",
            "**Border:** Single crochet evenly around all 4 edges, 3 sc in each corner."
        ]
    elif stitch_type == "dc-lace":
        cmds = [
            "**Foundation Chain:** Chain to desired width.",
            "**Row 1:** Dc in 4th chain from hook, *chain 1, skip 1, dc in next.* Repeat across. Turn.",
            "**Row 2:** Chain 3, dc in first dc. *Chain 1, dc in next dc.* Repeat across. Turn.",
            "**Repeat Row 2:** Continue until piece reaches desired length.",
            "**Border:** Work single crochet evenly around edges, with a picot edge (sc, ch 3, sc) in each corner.",
            "**Finishing:** Fasten off, weave in ends. Wet block to open the lace pattern."
        ]
    elif stitch_type == "dc-shell":
        cmds = [
            "**Foundation Chain:** Chain multiple of 6 + 1.",
            "**Row 1:** Sc in 2nd chain from hook. *Skip 2, 5 dc in next (shell), skip 2, sc in next.* Repeat across. Turn.",
            "**Row 2:** Chain 3, 2 dc in first sc. *Skip 2, sc in center dc of shell, skip 2, 5 dc in next sc.* Repeat. Turn.",
            "**Repeat Row 2:** Continue for desired length. Shells will alternate like a staggered pattern.",
            "**Border:** Sc evenly around, 3 sc in each corner.",
            "**Finishing:** Fasten off, weave in ends."
        ]
    elif stitch_type == "lace":
        cmds = [
            "**Foundation Ring:** Chain 6, join with slip stitch to form a ring.",
            "**Round 1:** Chain 3 (counts as dc), 11 dc into ring. Join. (12 dc)",
            "**Round 2:** *Chain 5, skip 1, sc in next.* Repeat around. Join.",
            "**Round 3:** *In each ch-5 space: sc, hdc, 3 dc, hdc, sc.* Repeat around. Join.",
            "**Round 4:** *Chain 7, sc between petals.* Repeat around.",
            "**Round 5:** *In each ch-7 space: sc, hdc, 5 dc, hdc, sc.* Repeat around.",
            "**Finishing:** Fasten off, weave in ends. Wet block and pin to shape, allowing to dry completely."
        ]
    else:
        cmds = [
            "**Foundation Chain:** Chain to desired width.",
            "**Row 1:** Single crochet (sc) in 2nd chain from hook and each across. Turn.",
            "**Row 2:** Chain 1, turn. Single crochet in each stitch across.",
            "**Repeat Row 2:** Continue until piece reaches desired length.",
            "**Finishing:** Fasten off, weave in ends."
        ]
    
    # Pad or trim to requested num_steps
    while len(cmds) < steps:
        cmds.append(("**Continue:** Repeat established pattern until piece reaches desired size."))
    return cmds[:steps]


BEGINNER_TIPS = {
    "sc": ["Count your stitches at the end of every row to keep edges straight.", "Keep your tension relaxed; tight stitches make the fabric stiff.", "Use a stitch marker to mark the right side of your work."],
    "dc": ["Count stitches each row—it's easy to accidentally add or drop stitches with taller stitches.", "The turning chain (ch 3) counts as the first double crochet.", "Keep consistent tension for even stitch height."],
    "hdc": ["The chain 2 at the start of each row counts as the first half-double crochet.", "Half-double crochet creates a nice middle ground between sc and dc.", "Count your stitches each row to keep edges straight."],
    "sc-dc": ["Alternating sc and dc rows creates a nice textured fabric.", "Count your stitches every row—the switch between stitch types makes it easy to drop a stitch.", "Mark your starting chain with a stitch marker so you don't lose count."],
    "sc-blo": ["Working in the back loop only creates a stretchy, ribbed fabric.", "The front loop will be left unworked, creating a horizontal ridge.", "Keep your tension moderate—too tight and the fabric won't stretch."],
    "hdc-blo": ["Back-loop-only hdc creates a ribbed texture similar to knitting.", "The chain 2 at the start counts as a stitch.", "This stitch pattern is very forgiving for beginners learning texture work."],
    "sc-hdc": ["Mixing sc and hdc in the same project is a great way to learn stitch height control.", "Mark the start of each round with a stitch marker.", "Fingering weight takes patience—the fabric grows slowly but the result is worth it."],
    "dc-lace": ["The chain-1 spaces create the lace effect—keep them even in size.", "Blocking is essential for lace patterns; it opens up the design.", "Use stitch markers every 10-20 pattern repeats to stay on track."],
    "fpdc-bpdc": ["fpdc: yarn over, insert hook from front to back around the post of the stitch.", "bpdc: yarn over, insert hook from back to front around the post of the stitch.", "Practice post stitches on a swatch first to get the motion down."],
    "c2c": ["Each C2C block = chain 3 + 3 double crochet into the chain-3 space of the previous block.", "Use a row counter to track where you are in the increase/decrease sequence.", "The fabric is worked diagonally—don't worry if it looks odd at first."],
    "lace": ["Lace patterns require blocking to look their best—don't skip this step.", "Use rust-proof pins for blocking to avoid stains.", "Count your stitches between each pattern repeat to catch mistakes early."],
    "shell": ["Shell = 5 double crochet worked into the same stitch or space.", "Blocking helps the shells lie flat and evenly spaced.", "Use a larger hook if your shells feel crowded or are curling."],
    "dc": ["Shell = 5 double crochet worked into the same stitch or space.", "Blocking helps the shells lie flat and evenly spaced.", "Use a larger hook if your shells feel crowded or are curling."],
}

def get_tips(stitch_type, difficulty):
    """Return tips appropriate for stitch type and difficulty."""
    tips = BEGINNER_TIPS.get(stitch_type, BEGINNER_TIPS["sc"])
    if difficulty == "beginner":
        return tips[:3]
    elif difficulty == "intermediate":
        return tips + ["Always make a gauge swatch before starting.", "Read through the entire pattern before beginning."]
    else:  # advanced
        return tips + ["Always make a gauge swatch and block it before measuring.", "Read through the entire pattern before beginning.", "Use lifelines in lace patterns to avoid re-doing rows after mistakes."]

COMMON_MISTAKES = {
    "sc": ["Accidentally skipping the first or last stitch of a row.", "Using the wrong hook size, resulting in stiff or loose fabric."],
    "dc": ["Skipping the turning chain count, causing edges to narrow.", "Forgetting to chain 3 at the start of each row."],
    "hdc": ["Forgetting the chain-2 turning chain counts as a stitch.", "Working through the wrong loop when the pattern specifies."],
    "sc-dc": ["Losing stitch count when switching between sc and dc.", "Forgetting which row pattern you're on without a row counter."],
    "sc-blo": ["Forgetting to work in the back loop only.", "Pulling the back loop too tight, causing the fabric to curl."],
    "hdc-blo": ["Working through both loops instead of back loop only.", "Losing the ribbed effect when tension varies."],
    "sc-hdc": ["Losing stitch count when switching between sc and hdc.", "Uneven tension between stitch types, causing wavy edges."],
    "dc-lace": ["Losing track of the chain-1 spaces in the lace repeat.", "Not blocking the finished piece to open up the lace pattern."],
    "fpdc-bpdc": ["Confusing front-post and back-post stitch placement.", "Skipping the turning chain because post stitches are distracting."],
    "c2c": ["Counting blocks incorrectly—use a row counter.", "Pulling the slip stitch join too tight, puckering the fabric."],
    "lace": ["Not blocking the finished piece—lace looks lumpy and uneven without blocking.", "Losing count of chains in long chain-7 or chain-5 loops."],
    "shell": ["Not spacing shells evenly, causing the fabric to ruffle.", "Using the wrong hook size for the yarn weight."],
}

def get_mistakes(stitch_type):
    return COMMON_MISTAKES.get(stitch_type, COMMON_MISTAKES["sc"])


def make_img_url(pid):
    return f"/assets/patterns/{pid}.webp"


def generate_all():
    """Generate all missing patterns."""
    existing = set()
    with open('src/generate_patterns_json.py', 'r') as f:
        existing = set(re.findall(r'"id":\s*"([^"]+)"', f.read()))
    
    # Also read from additional_patterns.py if it exists
    try:
        with open('src/additional_patterns.py', 'r') as f:
            existing |= set(re.findall(r'"id":\s*"([^"]+)"', f.read()))
    except:
        pass
    
    new_patterns = []
    added = 0
    for pid, name, desc, cat, weight, diff, min_h, max_h, skill, y_min, y_max, fiber, stitch, steps in NEW_PATTERNS:
        if pid in existing:
            continue
        hook = HOOKS[weight]
        tips = get_tips(stitch, diff)
        mistakes = get_mistakes(stitch)
        instructions = make_stitch_instructions(steps, stitch, cat, weight)
        
        p = {
            "id": pid,
            "name": name,
            "shortDescription": desc,
            "imageUrl": make_img_url(pid),
            "category": cat,
            "difficulty": {
                "level": diff,
                "score": 1 if diff == "beginner" else (2 if diff == "intermediate" else 3),
                "reasoning": f"Uses {stitch.replace('-', ' and ')} stitches; {cat.lower()} construction."
            },
            "estimatedTime": {"minHours": min_h, "maxHours": max_h, "unit": "hours", "assumedSkill": skill},
            "materials": {
                "yarn": {"weightCategory": hook["label"], "weightNumber": weight,
                         "suggestedYardageMin": y_min, "suggestedYardageMax": y_max,
                         "fiberType": fiber, "notes": f"{' '.join(fiber)} yarn works best for this project."},
                "hook": {"sizeMM": hook["mm"], "sizeUS": hook["us"], "sizeUK": hook["uk"],
                         "notes": f"Standard hook for {hook['label']} yarn."},
                "notions": ["Yarn needle", "Scissors"]
            },
            "gauge": {"stitches": 14, "rows": 14, "unit": "4 inches", "stitchPattern": stitch, "notes": "Gauge is not critical for this project."},
            "instructions": instructions,
            "beginnerTips": tips,
            "commonMistakes": mistakes,
            "keywords": [cat.lower(), name.lower().replace(' ', '-'), diff, stitch, "crochet"]
        }
        new_patterns.append(p)
        added += 1
    
    print(f"Found {len(existing)} existing pattern IDs")
    print(f"Generated {added} new patterns")
    return new_patterns


if __name__ == '__main__':
    import re
    patterns = generate_all()
    
    # Write to additional_patterns.py
    with open('src/additional_patterns.py', 'r') as f:
        existing_content = f.read()
    
    # Find where to insert (before the closing ])
    insert_pos = existing_content.rfind('];')
    if insert_pos == -1:
        print("ERROR: Could not find ] in additional_patterns.py")
        exit(1)
    
    # Generate Python dicts for new patterns
    new_dicts = []
    for p in patterns:
        new_dicts.append(json.dumps(p, indent=2))
    
    new_content = existing_content[:insert_pos] + ',\n'.join(new_dicts) + '\n' + existing_content[insert_pos:]
    
    with open('src/additional_patterns.py', 'w') as f:
        f.write(new_content)
    
    print(f"Appended {len(patterns)} patterns to additional_patterns.py")
    
    # Also output as JSON for verification
    with open('data/additional_patterns.json', 'w') as f:
        json.dump(patterns, f, indent=2)
    print("Also wrote data/additional_patterns.json for verification")
