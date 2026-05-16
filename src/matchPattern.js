// Simple LRU cache implementation for matchPattern results
// Max 100 entries, each entry expires after 1 hour (TTL)
const CACHE_MAX_SIZE = 100;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Map preserves insertion order; we will treat the first entry as LRU
const _cache = new Map();

/**
 * Recursively sort object keys to produce a deterministic JSON string.
 * Handles nested objects and arrays.
 */
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

/**
 * Retrieve a cached result if present and not expired.
 * Moves the entry to the most-recent position.
 */
function getFromCache(key) {
  const entry = _cache.get(key);
  if (!entry) return undefined;
  const now = Date.now();
  if (now - entry.timestamp > CACHE_TTL_MS) {
    // Expired
    _cache.delete(key);
    return undefined;
  }
  // Refresh LRU order: delete and re-insert
  _cache.delete(key);
  _cache.set(key, entry);
  return entry.result;
}

/**
 * Store a result in the cache, evicting LRU entry if over capacity.
 */
function setCache(key, result) {
  const now = Date.now();
  // If key already exists, delete to refresh order
  if (_cache.has(key)) _cache.delete(key);
  _cache.set(key, { result, timestamp: now });
  // Evict LRU if size exceeds max
  if (_cache.size > CACHE_MAX_SIZE) {
    const firstKey = _cache.keys().next().value;
    _cache.delete(firstKey);
  }
}

/**
 * Invalidate (clear) the entire cache.
 */
function invalidateCache() {
  _cache.clear();
}

function matchPattern(userInput, patterns) {
  // Create deterministic cache key
  const cacheKey = stableStringify(userInput);
  const cached = getFromCache(cacheKey);
  if (cached) {
    return cached;
  }

  const userDifficulty = userInput.difficulty || 'beginner';

  const filteredPatterns = patterns.filter(p => p.difficulty.level === userDifficulty);

  if (filteredPatterns.length === 0) {
    throw new Error(`No ${userDifficulty} patterns found matching your materials. Try adjusting your inputs or selecting a different difficulty.`);
  }

  const scoredPatterns = [];

  for (const pattern of filteredPatterns) {
    let score = 0;
    const details = { patternId: pattern.id, criteria: [] };

    if (pattern.materials && pattern.materials.yarn) {
      const patternWeight = pattern.materials.yarn.weightNumber;
      const weightDiff = Math.abs(patternWeight - userInput.yarnWeightNumber);
      if (weightDiff === 0) {
        score += 3;
        details.criteria.push({ name: "yarnWeight", met: true, points: 3 });
      } else if (weightDiff === 1) {
        score += 1.5;
        details.criteria.push({ name: "yarnWeight", met: true, points: 1.5,
          info: `Close match: pattern uses weight ${patternWeight}, you have ${userInput.yarnWeightNumber}` });
      } else {
        details.criteria.push({ name: "yarnWeight", met: false, points: 0,
          info: `Pattern needs weight ${patternWeight}, you have ${userInput.yarnWeightNumber}` });
      }
    }

    if (pattern.materials && pattern.materials.yarn) {
      const minYardage = pattern.materials.yarn.suggestedYardageMin;
      const maxYardage = pattern.materials.yarn.suggestedYardageMax;
      const idealYardage = (minYardage + maxYardage) / 2;
      if (userInput.yardageHave >= minYardage) {
        const excess = userInput.yardageHave - idealYardage;
        if (excess >= 0 && excess <= 50) {
          score += 2;
          details.criteria.push({ name: "yardage", met: true, points: 2,
            info: `Perfect yardage match!` });
        } else {
          score += 1;
          details.criteria.push({ name: "yardage", met: true, points: 1 });
        }
      } else {
        details.criteria.push({ name: "yardage", met: false, points: 0,
          info: `You have ${userInput.yardageHave} yds, pattern needs at least ${minYardage} yds` });
      }
    }

    if (!userInput.hookSizeUnknown && pattern.materials && pattern.materials.hook) {
      const patternHookMM = pattern.materials.hook.sizeMM;
      const userHookMM = userInput.hookSizeMM;
      if (userHookMM !== null) {
        const hookDiff = Math.abs(userHookMM - patternHookMM);
        if (hookDiff <= 0.5) {
          score += 1.5;
          details.criteria.push({ name: "hookSize", met: true, points: 1.5 });
        } else if (hookDiff <= 1.0) {
          score += 0.5;
          details.criteria.push({ name: "hookSize", met: true, points: 0.5,
            info: `Close hook match: you have ${userHookMM}mm, pattern suggests ${patternHookMM}mm` });
        } else {
          details.criteria.push({ name: "hookSize", met: false, points: 0,
            info: `You have ${userHookMM}mm, pattern suggests ${patternHookMM}mm` });
        }
      } else {
        details.criteria.push({ name: "hookSize", met: null, points: 0,
          info: "Hook size unknown; will recommend based on pattern." });
      }
    } else if (userInput.hookSizeUnknown) {
      details.criteria.push({ name: "hookSize", met: null, points: 0,
        info: "Hook size unknown; skipping hook match." });
    }

    if (pattern.estimatedTime && userInput.timeRange) {
      const patternMin = pattern.estimatedTime.minHours;
      const patternMax = pattern.estimatedTime.maxHours;
      const userMin = userInput.timeRange.minHours;
      const userMax = userInput.timeRange.maxHours;
      const patternMid = (patternMin + patternMax) / 2;
      const userMid = (userMin + userMax) / 2;
      const overlaps = !(patternMax < userMin || patternMin > userMax);
      if (overlaps) {
        const timeDiff = Math.abs(patternMid - userMid);
        if (timeDiff <= 0.5) {
          score += 1.5;
          details.criteria.push({ name: "time", met: true, points: 1.5,
            info: `Perfect time match!` });
        } else {
          score += 1;
          details.criteria.push({ name: "time", met: true, points: 1 });
        }
      } else {
        details.criteria.push({ name: "time", met: false, points: 0,
          info: `Pattern takes ${patternMin}-${patternMax}h, you have ${userMin}-${userMax}h` });
      }
    }

    if (userInput.preferredCategory && pattern.category) {
      const catUser = userInput.preferredCategory.toLowerCase().trim();
      const catPat = pattern.category.toLowerCase().trim();
      if (catPat === catUser || catPat.includes(catUser) || catUser.includes(catPat)) {
        const exact = catPat === catUser;
        score += exact ? 1.5 : 1;
        details.criteria.push({ name: "category", met: true, points: exact ? 1.5 : 1 });
      } else {
        details.criteria.push({ name: "category", met: false, points: 0,
          info: `You preferred ${userInput.preferredCategory}, pattern is ${pattern.category}` });
      }
    } else if (!userInput.preferredCategory) {
      details.criteria.push({ name: "category", met: null, points: 0 });
    }

    // Bonus: difficulty score proximity
    if (pattern.difficulty && pattern.difficulty.score !== undefined) {
      const userDiffScore = userDifficulty === 'beginner' ? 2 : 5;
      const diff = Math.abs(pattern.difficulty.score - userDiffScore);
      if (diff <= 1) {
        score += 1;
        details.criteria.push({ name: "difficultyFit", met: true, points: 1 });
      } else {
        details.criteria.push({ name: "difficultyFit", met: true, points: 0.5 });
      }
    }

    scoredPatterns.push({ pattern, score, details });
  }

  scoredPatterns.sort((a, b) => b.score - a.score);

  const bestScore = scoredPatterns.length > 0 ? scoredPatterns[0].score : 0;

  const threshold = 1;
  const topPatterns = scoredPatterns.filter(p => p.score >= bestScore - threshold);

  const suggestions = topPatterns.slice(0, 4);

  const results = suggestions.map(({ pattern, score, details }) => {
    const gapAnalysis = {
      yardage: { have: userInput.yardageHave, need: null, gap: null, status: '' },
      hook: { have: userInput.hookSizeMM, need: null, gap: null, status: '' }
    };

    if (pattern.materials && pattern.materials.yarn) {
      const minY = pattern.materials.yarn.suggestedYardageMin;
      const maxY = pattern.materials.yarn.suggestedYardageMax;
      gapAnalysis.yardage.need = (minY + maxY) / 2;
      if (userInput.yardageHave >= minY) {
        gapAnalysis.yardage.status = 'enough';
        gapAnalysis.yardage.gap = 0;
      } else {
        gapAnalysis.yardage.status = 'need-more';
        gapAnalysis.yardage.gap = minY - userInput.yardageHave;
      }
    }

    if (pattern.materials && pattern.materials.hook) {
      const patternHook = pattern.materials.hook.sizeMM;
      gapAnalysis.hook.need = patternHook;
      if (userInput.hookSizeMM === null) {
        gapAnalysis.hook.status = 'need';
        gapAnalysis.hook.gap = 1;
      } else if (Math.abs(userInput.hookSizeMM - patternHook) <= 0.5) {
        gapAnalysis.hook.status = 'have';
        gapAnalysis.hook.gap = 0;
      } else {
        gapAnalysis.hook.status = 'mismatch';
        gapAnalysis.hook.gap = 1;
      }
    }

    return {
      matchedPattern: pattern,
      matchScore: score,
      matchDetails: details,
      materialGap: gapAnalysis,
      summary: {
        projectName: pattern.name,
        difficulty: pattern.difficulty.level,
        estimatedTime: `${pattern.estimatedTime.minHours}-${pattern.estimatedTime.maxHours} ${pattern.estimatedTime.unit}`,
        yardageStatus: gapAnalysis.yardage.status,
        hookStatus: gapAnalysis.hook.status
      }
    };
  });

  // Store result in cache before returning
  setCache(cacheKey, results);

  return results;
}

module.exports = { matchPattern, invalidateCache };