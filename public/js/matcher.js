// === CrochetKit Matcher — client-side bundle ===
// Combined from: termConverter.js, formatProjectOutput.js, matchPattern.js

// ── termConverter.js ──────────────────────────────────────────────
const stitchNamesUS = {
  'chain': 'chain (ch)',
  'single crochet': 'single crochet (sc)',
  'half double crochet': 'half double crochet (hdc)',
  'double crochet': 'double crochet (dc)',
  'treble crochet': 'treble crochet (tr)',
  'slip stitch': 'slip stitch (sl st)'
};

const stitchNamesUK = {
  'chain': 'chain (ch)',
  'single crochet': 'double crochet (dc)',
  'half double crochet': 'half treble (htr)',
  'double crochet': 'treble (tr)',
  'treble crochet': 'double treble (dtr)',
  'slip stitch': 'slip stitch (sl st)'
};

const abbrUS = { 'sc': 'dc', 'hdc': 'htr', 'dc': 'tr', 'tr': 'dtr' };
const abbrUK = { 'dc': 'sc', 'htr': 'hdc', 'tr': 'dc', 'dtr': 'tr' };

const glossaryUK = {
  'chain (ch)': 'A series of loops made by pulling the yarn through a slip knot; forms the foundation of most projects. (Same in UK/AU terms.)',
  'single crochet (sc)': 'In UK/AU terms this is "double crochet (dc)". Insert hook, yarn over, pull up a loop, yarn over, pull through both loops.',
  'double crochet (dc)': 'In UK/AU terms this is "treble (tr)". Yarn over, insert hook, yarn over, pull up a loop, yarn over, pull through two loops, yarn over, pull through last two loops.',
  'half double crochet (hdc)': 'In UK/AU terms this is "half treble (htr)". Yarn over, insert hook, yarn over, pull up a loop, yarn over, pull through all three loops.',
  'treble crochet (tr)': 'In UK/AU terms this is "double treble (dtr)". Yarn over twice, insert hook, yarn over, pull up a loop, yarn over, pull through two loops three times.',
  'slip stitch (sl st)': 'A simple stitch used to join pieces or start a round. (Same in UK/AU terms.)',
  'yarn over': 'Wrap the yarn over the hook to create a new loop; essential for most stitches. (Same in UK/AU terms.)',
  'turn': 'Rotate your work at the end of a row to begin the next row. (Same in UK/AU terms.)',
  'gauge': 'In UK/AU terms this is "tension". The number of stitches and rows per unit; determines the size of the finished piece.',
  'working yarn': 'The yarn attached to the hook that you are actively using to make stitches.',
  'tail': 'The leftover piece of yarn after finishing; should be woven in to hide.',
  'hook size': 'The diameter of the crochet hook, given in mm and UK/US sizes.'
};

function convertStitches(stitches, toSystem) {
  if (toSystem === 'US') return stitches;
  return stitches.map(s => {
    const m = s.match(/\((\w+)\)/);
    if (m && abbrUS[m[1]]) return s.replace(`(${m[1]})`, `(${abbrUS[m[1]]})`);
    return s;
  });
}

function getGlossary(system) {
  return system === 'UK' || system === 'AU' ? glossaryUK : null;
}

// ── formatProjectOutput.js ────────────────────────────────────────
function formatProjectOutput(matchResult, termSystem) {
  const isUK = termSystem && (termSystem === 'UK' || termSystem === 'AU');
  const pattern = matchResult.matchedPattern;
  const materialGap = matchResult.materialGap;

  const stitchFullNameMap = {
    'Chain (ch)': 'Chain (ch)',
    'Single crochet (sc)': 'Double crochet (dc)',
    'Half Double Crochet (hdc)': 'Half Treble (htr)',
    'Double crochet (dc)': 'Treble (tr)',
    'Treble Crochet (tr)': 'Double Treble (dtr)',
    'Slip stitch (sl st)': 'Slip stitch (sl st)'
  };

  function convertStitchName(name) {
    if (!isUK) return name;
    return stitchFullNameMap[name] || name;
  }

  function extractStitches(instructions) {
    const stitchPatterns = [
      { abbr: "sl st", name: "Slip stitch (sl st)" },
      { abbr: "hdc",   name: "Half Double Crochet (hdc)" },
      { abbr: "sc",    name: "Single crochet (sc)" },
      { abbr: "dc",    name: "Double crochet (dc)" },
      { abbr: "tr",    name: "Treble Crochet (tr)" },
      { abbr: "ch",    name: "Chain (ch)" }
    ];
    const stitchesFound = new Set();
    instructions.forEach(instruction => {
      const lower = instruction.toLowerCase();
      stitchPatterns.forEach(({ abbr, name }) => {
        if (lower.includes(abbr)) {
          stitchesFound.add(name);
        }
      });
    });
    return Array.from(stitchesFound).map(s => convertStitchName(s));
  }

  function getStepTip(instruction, pattern) {
    const lowerInstruction = instruction.toLowerCase();
    const commonMistakes = pattern.commonMistakes || [];
    const beginnerTips = pattern.beginnerTips || [];

    if (lowerInstruction.includes("chain") && lowerInstruction.includes("count")) {
      return "Count your chain carefully to ensure a straight foundation.";
    }
    if (lowerInstruction.includes("single crochet") && (lowerInstruction.includes("across") || lowerInstruction.includes("each stitch"))) {
      const mistake = commonMistakes.find(m => m.toLowerCase().includes("skipping the first or last stitch"));
      if (mistake) return `Tip: ${mistake.replace("Accidentally ", "")}`;
      const tip = beginnerTips.find(t => t.toLowerCase().includes("count your stitches"));
      if (tip) return `Tip: ${tip}`;
    }
    if (lowerInstruction.includes("turn")) {
        const mistake = commonMistakes.find(m => m.toLowerCase().includes("forgetting to turn"));
        if (mistake) return `Tip: ${mistake.replace("Forgetting to ", "")}`;
    }
    if (lowerInstruction.includes("weave in ends")) {
      return "Weave in ends securely to prevent unraveling and create a neat finish.";
    }
    if (beginnerTips.length > 0) {
      return `Tip: ${beginnerTips[0]}`;
    }
    return "";
  }

  function generateVisualDescription(instruction) {
    const lowerInstruction = instruction.toLowerCase();

    if (lowerInstruction.includes("fasten off")) {
      return "Cut the yarn, leaving a tail of about 6 inches. Yarn over your hook one last time, pull the tail completely through the remaining loop on your hook, and pull tight to secure. This locks your last stitch.";
    }
    if (lowerInstruction.includes("weave in ends")) {
      return "Thread the yarn tail onto a yarn needle. Carefully weave the needle in and out through the stitches on the wrong side of your fabric for several inches, changing direction occasionally, to hide the tail securely.";
    }
    if (lowerInstruction.includes("foundation chain")) {
      return "Hold the hook in your dominant hand and the yarn in your other hand. Make a slip knot, then wrap the yarn over the hook from back to front, and pull it through the loop on your hook. This creates one chain stitch. Repeat to make a chain that looks like a braid.";
    }
    if (lowerInstruction.includes("single crochet") && lowerInstruction.includes("2nd chain from hook")) {
      return "Skip the first chain from your hook. Insert your hook into the center of the next chain stitch. You should see two strands of yarn on top of your hook. Yarn over, pull a loop through the chain. Now you have two loops on your hook. Yarn over again, and pull through both loops on your hook. This creates a compact 'V' shape.";
    }
    if (lowerInstruction.includes("single crochet") && (lowerInstruction.includes("each stitch") || lowerInstruction.includes("each chain") || lowerInstruction.includes("across"))) {
      return "Insert your hook under both loops of the next stitch (it looks like a small 'V' on the top edge of your fabric). Yarn over, pull a loop through. You have two loops on your hook. Yarn over, pull through both loops. Your single crochet will form a dense fabric.";
    }
    if (lowerInstruction.includes("double crochet") && (lowerInstruction.includes("each stitch") || lowerInstruction.includes("across"))) {
      return "Yarn over your hook once. Insert your hook under both loops of the next stitch. Yarn over, pull a loop through the stitch (three loops on hook). Yarn over, pull through the first two loops (two loops on hook). Yarn over, pull through the last two loops (one loop on hook). This stitch is taller than a single crochet and creates a looser fabric.";
    }
    if (lowerInstruction.includes("turn")) {
      return "At the end of the row, turn your work over as if turning a page in a book. The back side of your stitches will now be facing you, and you'll work into them for the next row.";
    }
    if (lowerInstruction.includes("fold") && lowerInstruction.includes("slip stitch")) {
      return "Fold the fabric so the right sides face each other. Insert your hook through both layers, yarn over, and pull through both layers and the loop on your hook. This creates a seamless seam.";
    }
    return "(No specific visual guidance for this step, focus on the written instruction.)";
  }

  const materialsList = [];
  const yarn = pattern.materials?.yarn;
  if (yarn) {
    const fiberType = Array.isArray(yarn.fiberType) ? yarn.fiberType.join('/') : 'yarn';
    const weightCat = yarn.weightCategory ? yarn.weightCategory.replace(/\(.*?\)/g, '').trim() : 'weight';
    const yardMin = yarn.suggestedYardageMin ?? '?';
    const yardMax = yarn.suggestedYardageMax ?? '?';
    materialsList.push(
      `1 skein of ${weightCat} ${fiberType} yarn (approx. ${yardMin}-${yardMax} yards)`
    );
  }
  if (pattern.materials?.hook) {
    const h = pattern.materials.hook;
    materialsList.push(
      `Size ${h.sizeUS || '?'} (${h.sizeMM || '?'} mm) crochet hook`
    );
  }
  if (pattern.materials?.notions?.length > 0) {
    pattern.materials.notions.forEach(notion => materialsList.push(notion));
  }

  const missingMaterialsList = [];
  if (materialGap?.yardage?.status === 'need-more') {
    missingMaterialsList.push(`Additional ${Math.ceil(materialGap.yardage.gap)} yards of yarn.`);
  }
  if (materialGap?.hook?.status === 'need') {
    missingMaterialsList.push(`Crochet hook (recommended size: ${materialGap.hook.need} mm).`);
  } else if (materialGap?.hook?.status === 'mismatch') {
     const hook = pattern.materials?.hook;
     missingMaterialsList.push(`Consider a Size ${hook?.sizeUS || '?'} (${hook?.sizeMM || '?'} mm) crochet hook as it's recommended.`);
  }

  const formattedSteps = pattern.instructions.map((instruction, index) => ({
    step: index + 1,
    instruction: instruction.replace(/\*\*(.*?)\*\*/g, '**$1**'),
    tip: getStepTip(instruction, pattern),
    visual_description: generateVisualDescription(instruction)
  }));

  let variations = [];
  if (pattern.category === "Scarf") {
    variations = [
      "Use variegated yarn for a self-striping effect.",
      "Add fringe to the ends for a decorative touch.",
      "Experiment with different stitch patterns once comfortable with the basic stitch."
    ];
  } else if (pattern.category === "Dishcloth") {
    const scName = isUK ? 'double crochet (dc)' : 'single crochet';
    const dcName = isUK ? 'treble (tr)' : 'double crochet';
    variations = [
      "Use multiple colors for striped or variegated dishcloths.",
      "Add a border of " + scName + " in a contrasting color.",
      "Replace " + dcName + " rows with half treble (htr) for a slightly tighter fabric."
    ];
  }

  let safetyNotes = [];
  if (pattern.category === "Scarf") {
    safetyNotes = [
      "Ensure ends are securely woven in to prevent unraveling.",
      "Be mindful of long scarves around machinery or small children if making for them."
    ];
  } else if (pattern.category === "Dishcloth") {
    safetyNotes = [
      "Cotton yarn is recommended for coasters as it is absorbent and heat-resistant.",
      "Ensure all yarn ends are woven in securely to prevent snagging."
    ];
  }

  const estTime = pattern.estimatedTime || {};
  const estStr = estTime.minHours != null && estTime.maxHours ? `${estTime.minHours}-${estTime.maxHours} ${estTime.unit || 'hours'}` : 'Varies';
  const instructions2 = Array.isArray(pattern.instructions) ? pattern.instructions : [];
  const printableSummary = [
    `${pattern.name || 'Project'} –`,
    `${estStr} –`,
    `Materials: ${materialsList.slice(0, 2).join(', ')}.`,
    `Stitches: ${extractStitches(instructions2).map(s => s.split(' ')[0]).join(', ')}.`,
    `Steps: ${instructions2.map(inst => inst.split(':')[0].replace(/\*\*/g, '')).join(', ')}.`,
    "Tips: count stitches, consistent tension."
  ].join(' ');

  const diffLevel = pattern.difficulty?.level || 'beginner';
  const tipsLabel = diffLevel === 'beginner' ? 'Beginner Tips' : 'Tips';

  return {
    id: pattern.id,
    title: pattern.name,
    description: pattern.shortDescription,
    category: pattern.category,
    skill_level: diffLevel,
    estimated_time: estStr,
    difficulty_reason: pattern.difficulty?.reasoning || '',
    materials: materialsList,
    missing_materials: missingMaterialsList,
    stitches_used: extractStitches(instructions2),
    steps: formattedSteps,
    beginner_tips: pattern.beginnerTips || [],
    tips_label: tipsLabel,
    variations: variations,
    safety_notes: safetyNotes,
    printable_summary: printableSummary,
    matchedYarns: matchResult.matchDetails?.matchedYarns || [],
    yarnWeightNumber: pattern.materials?.yarn?.weightNumber ?? null,
    estimated_min_hours: estTime.minHours ?? null
  };
}

// ── matchPattern.js ───────────────────────────────────────────────
const CACHE_MAX_SIZE = 100;
const CACHE_TTL_MS = 60 * 60 * 1000;
const NEW_PATTERN_ID_THRESHOLD = 58;
const NEW_PATTERN_BONUS = 1.0;

const _cache = new Map();

function stableStringify(obj) {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    const items = obj.map(item => stableStringify(item));
    return `[${items.join(',')}]`;
  }
  const keys = Object.keys(obj).sort();
  const parts = keys.map(k => `${JSON.stringify(k)}:${stableStringify(obj[k])}`);
  return `{${parts.join(',')}}`;
}

function getFromCache(key) {
  const entry = _cache.get(key);
  if (!entry) return undefined;
  const now = Date.now();
  if (now - entry.timestamp > CACHE_TTL_MS) {
    _cache.delete(key);
    return undefined;
  }
  _cache.delete(key);
  _cache.set(key, entry);
  return entry.result;
}

function setCache(key, result) {
  const now = Date.now();
  if (_cache.has(key)) _cache.delete(key);
  _cache.set(key, { result, timestamp: now });
  if (_cache.size > CACHE_MAX_SIZE) {
    const firstKey = _cache.keys().next().value;
    _cache.delete(firstKey);
  }
}

function invalidateCache() {
  _cache.clear();
}

function matchPattern(userInput, patterns) {
  const cacheKey = stableStringify(userInput);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const userDifficulty = userInput.difficulty || 'beginner';
  const isMultiYarn = userInput.yarns && userInput.yarns.length > 1;

  const filteredPatterns = patterns.filter(p => p.difficulty.level === userDifficulty);
  if (filteredPatterns.length === 0) {
    throw new Error(`No ${userDifficulty} patterns found matching your materials. Try adjusting your inputs or selecting a different difficulty.`);
  }

  const scoredPatterns = [];

  for (const pattern of filteredPatterns) {
    let score = 0;
    const details = { patternId: pattern.id, criteria: [] };

    const patternWeight = pattern.materials?.yarn?.weightNumber;
    const minYardage = pattern.materials?.yarn?.suggestedYardageMin;
    const maxYardage = pattern.materials?.yarn?.suggestedYardageMax;
    const idealYardage = (minYardage + maxYardage) / 2;

    let effWeight, effYardage, effHook;

    if (isMultiYarn) {
      const matchingYarns = userInput.yarns.filter(y => {
        const wDiff = Math.abs(patternWeight - y.weightNumber);
        return wDiff <= 1;
      });

      if (matchingYarns.length === 0) {
        continue;
      }

      const bestYarn = matchingYarns.reduce((a, b) =>
        Math.abs(patternWeight - a.weightNumber) <= Math.abs(patternWeight - b.weightNumber) ? a : b
      );
      effWeight = bestYarn.weightNumber;
      effYardage = matchingYarns.reduce((sum, y) => sum + y.yardage, 0);
      effHook = bestYarn.hookSizeMM || userInput.yarns[0].hookSizeMM || null;

      const wDiff = Math.abs(patternWeight - effWeight);
      if (wDiff === 0) {
        score += 3;
        details.criteria.push({ name: "yarnWeight", met: true, points: 3, info: `Matched ${matchingYarns.length} yarn(s) to this weight` });
      } else {
        score += 1.0;
        details.criteria.push({ name: "yarnWeight", met: true, points: 1.0, info: `Close weight match via ${matchingYarns.length} yarn(s)` });
      }

      details.matchedYarns = matchingYarns.map(y => y.name || `Weight ${y.weightNumber}`);
    } else {
      effWeight = userInput.yarnWeightNumber;
      effYardage = userInput.yardageHave;
      effHook = userInput.hookSizeMM;

      const wDiff = Math.abs(patternWeight - effWeight);
      if (wDiff === 0) {
        score += 3;
        details.criteria.push({ name: "yarnWeight", met: true, points: 3 });
      } else if (wDiff === 1) {
        score += 1.0;
        details.criteria.push({ name: "yarnWeight", met: true, points: 1.0,
          info: `Close match: pattern uses weight ${patternWeight}, you have ${effWeight}` });
      } else {
        details.criteria.push({ name: "yarnWeight", met: false, points: 0,
          info: `Pattern needs weight ${patternWeight}, you have ${effWeight}` });
      }
    }

    if (effYardage >= minYardage) {
      const excess = effYardage - idealYardage;
      let yardagePoints = 2;
      let yardageInfo = `Yardage sufficient (${effYardage} yds)`;

      if (effYardage >= idealYardage * 1.5) {
        yardagePoints = 2.5;
        yardageInfo = `Ample yardage (${effYardage} yds) for this pattern!`;
      } else if (excess >= 0 && excess <= 50) {
        yardagePoints = 2;
        yardageInfo = `Perfect yardage match!`;
      }
      score += yardagePoints;
      details.criteria.push({
        name: "yardage", met: true, points: yardagePoints,
        info: yardageInfo
      });
    } else {
      details.criteria.push({
        name: "yardage", met: false, points: 0,
        info: `You have ${effYardage} yds, pattern needs at least ${minYardage} yds`
      });
    }

    if (!userInput.hookSizeUnknown && pattern.materials?.hook && effHook !== null && effHook !== undefined) {
      const hookDiff = Math.abs(effHook - pattern.materials.hook.sizeMM);
      if (hookDiff <= 0.5) { score += 1.5; details.criteria.push({ name: "hookSize", met: true, points: 1.5 }); }
      else if (hookDiff <= 1.0) { score += 0.5; details.criteria.push({ name: "hookSize", met: true, points: 0.5, info: `Close hook match: ${effHook}mm vs ${pattern.materials.hook.sizeMM}mm` }); }
      else { details.criteria.push({ name: "hookSize", met: false, points: 0, info: `You have ${effHook}mm, pattern suggests ${pattern.materials.hook.sizeMM}mm` }); }
    } else if (userInput.hookSizeUnknown) {
      details.criteria.push({ name: "hookSize", met: null, points: 0, info: "Hook size unknown; skipping hook match." });
    }

    const pEst = pattern.estimatedTime;
    const uRange = userInput.timeRange;
    if (pEst && pEst.minHours != null && pEst.maxHours != null && uRange && uRange.minHours != null && uRange.maxHours != null) {
      const pMid = (pEst.minHours + pEst.maxHours) / 2;
      const uMid = (uRange.minHours + uRange.maxHours) / 2;
      const overlaps = !(pEst.maxHours < uRange.minHours || pEst.minHours > uRange.maxHours);
      if (overlaps) {
        score += Math.abs(pMid - uMid) <= 0.5 ? 1.5 : 1;
        details.criteria.push({ name: "time", met: true, points: Math.abs(pMid - uMid) <= 0.5 ? 1.5 : 1 });
      } else {
        details.criteria.push({ name: "time", met: false, points: 0, info: `Pattern takes ${pEst.minHours}-${pEst.maxHours}h, you have ${uRange.minHours}-${uRange.maxHours}h` });
      }
    }

    if (userInput.preferredCategory && pattern.category) {
      const cU = userInput.preferredCategory.toLowerCase().trim();
      const cP = pattern.category.toLowerCase().trim();
      if (cP === cU || cP.includes(cU) || cU.includes(cP)) {
        const exact = cP === cU;
        score += exact ? 1.5 : 1;
        details.criteria.push({ name: "category", met: true, points: exact ? 1.5 : 1 });
      } else {
        details.criteria.push({ name: "category", met: false, points: 0, info: `You preferred ${userInput.preferredCategory}, pattern is ${pattern.category}` });
      }
    } else if (!userInput.preferredCategory) {
      details.criteria.push({ name: "category", met: null, points: 0 });
    }

    if (pattern.difficulty?.score !== undefined) {
      const uDiff = userDifficulty === 'beginner' ? 2 : 5;
      score += Math.abs(pattern.difficulty.score - uDiff) <= 1 ? 1 : 0.5;
      details.criteria.push({ name: "difficultyFit", met: true, points: Math.abs(pattern.difficulty.score - uDiff) <= 1 ? 1 : 0.5 });
    }

    if (parseInt(pattern.id) > NEW_PATTERN_ID_THRESHOLD) {
      score += NEW_PATTERN_BONUS;
      details.criteria.push({ name: "newPatternBonus", met: true, points: NEW_PATTERN_BONUS, info: "Bonus for new pattern!" });
    }

    scoredPatterns.push({ pattern, score, details, effYardage, effHook });
  }

  if (scoredPatterns.length === 0) {
    throw new Error(`No patterns found matching your materials. Try different yarn weights or more yardage.`);
  }

  scoredPatterns.sort((a, b) => b.score - a.score);
  const bestScore = scoredPatterns[0].score;
  const topPatterns = scoredPatterns.filter(p => p.score >= bestScore - 2).slice(0, 4);

  const results = topPatterns.map(({ pattern, score, details, effYardage, effHook }) => {
    const minY = pattern.materials?.yarn?.suggestedYardageMin ?? 0;
    const maxY = pattern.materials?.yarn?.suggestedYardageMax ?? minY;
    const gapYardage = { have: effYardage, need: (minY + maxY) / 2, gap: effYardage >= minY ? 0 : minY - effYardage, status: effYardage >= minY ? 'enough' : 'need-more' };
    const gapHook = { have: effHook, need: pattern.materials?.hook?.sizeMM || null, gap: 0, status: 'have' };
    if (effHook !== null && effHook !== undefined && pattern.materials?.hook) {
      gapHook.gap = Math.abs(effHook - pattern.materials.hook.sizeMM) <= 0.5 ? 0 : 1;
      gapHook.status = gapHook.gap === 0 ? 'have' : 'mismatch';
    }

    return {
      matchedPattern: pattern,
      matchScore: score,
      matchDetails: details,
      materialGap: { yardage: gapYardage, hook: gapHook },
      summary: {
        projectName: pattern.name,
        difficulty: pattern.difficulty.level,
        estimatedTime: `${pattern.estimatedTime.minHours}-${pattern.estimatedTime.maxHours} ${pattern.estimatedTime.unit}`,
        yardageStatus: gapYardage.status,
        hookStatus: gapHook.status
      }
    };
  });

  setCache(cacheKey, results);
  return results;
}

function reverseMatch(pattern, yarns) {
  const patternWeight = pattern.materials?.yarn?.weightNumber;
  const minYardage = pattern.materials?.yarn?.suggestedYardageMin;
  const maxYardage = pattern.materials?.yarn?.suggestedYardageMax;

  if (!patternWeight) {
    return {
      patternWeight: null,
      minYardage, maxYardage,
      individualMatches: [],
      combinedMatch: { matchingWeightYarns: 0, totalYardage: 0, enough: false, reason: 'Pattern has no weight data' }
    };
  }

    const patternHookSizeMM = pattern.materials?.hook?.sizeMM;

    const individualMatches = (yarns || []).map(yarn => {
      const wDiff = Math.abs(patternWeight - yarn.weight);
      const weightMatch = wDiff <= 1;
      const yardageMatch = yarn.yardage >= minYardage;

      let hookMatch = false;
      let hookDiff = null;
      if (patternHookSizeMM && yarn.hook) {
        hookDiff = Math.abs(patternHookSizeMM - yarn.hook);
        hookMatch = hookDiff <= 1.0;
      }

      return {
        yarn: { id: yarn.id, name: yarn.name || `Weight ${yarn.weight}`, weight: yarn.weight, yardage: yarn.yardage, hook: yarn.hook, notes: yarn.notes },
        weightMatch,
        yardageMatch,
        hookMatch,
        wDiff,
        hookDiff,
        overall: weightMatch && yardageMatch && (!patternHookSizeMM || hookMatch)
      };
  });

  const matchingWeight = individualMatches.filter(m => m.weightMatch);
  const totalYardage = matchingWeight.reduce((sum, m) => sum + m.yarn.yardage, 0);
  const enough = totalYardage >= minYardage;
  const hasMatchingHook = matchingWeight.some(m => m.hookMatch);

  return {
    patternWeight,
    minYardage,
    maxYardage,
    patternHookSizeMM,
    individualMatches,
    combinedMatch: {
      matchingWeightYarns: matchingWeight.length,
      totalYardage,
      enough,
      hasMatchingHook,
        reason: enough
          ? `You have ${totalYardage} yds across ${matchingWeight.length} yarn(s)${hasMatchingHook ? ' with a compatible hook' : ''} — enough!`
          : `You have ${totalYardage} yds across ${matchingWeight.length} yarn(s), need ${minYardage} yds total.${!hasMatchingHook && patternHookSizeMM ? ' (Also consider a ' + patternHookSizeMM + 'mm hook)' : ''}`
    }
  };
}
