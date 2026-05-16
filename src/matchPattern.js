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

    // Determine effective weight, yardage, hook for this pattern
    let effWeight, effYardage, effHook;

    if (isMultiYarn) {
      // Find all user yarns that match this pattern's weight (within ±1)
      const matchingYarns = userInput.yarns.filter(y => {
        const wDiff = Math.abs(patternWeight - y.weightNumber);
        return wDiff <= 1;
      });

      if (matchingYarns.length === 0) {
        // No yarn matches this pattern's weight — skip
        continue;
      }

      // Use the best weight match for scoring, combine yardage
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
        score += 1.5;
        details.criteria.push({ name: "yarnWeight", met: true, points: 1.5, info: `Close weight match via ${matchingYarns.length} yarn(s)` });
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
        score += 1.5;
        details.criteria.push({ name: "yarnWeight", met: true, points: 1.5,
          info: `Close match: pattern uses weight ${patternWeight}, you have ${effWeight}` });
      } else {
        details.criteria.push({ name: "yarnWeight", met: false, points: 0,
          info: `Pattern needs weight ${patternWeight}, you have ${effWeight}` });
      }
    }

    // Yardage scoring (uses combined yardage for multi-yarn)
    if (effYardage >= minYardage) {
      const excess = effYardage - idealYardage;
      score += (excess >= 0 && excess <= 50) ? 2 : 1;
      details.criteria.push({
        name: "yardage", met: true, points: (excess >= 0 && excess <= 50) ? 2 : 1,
        info: (excess >= 0 && excess <= 50) ? `Perfect yardage match!` : `Yardage sufficient (${effYardage} yds)`
      });
    } else {
      details.criteria.push({
        name: "yardage", met: false, points: 0,
        info: `You have ${effYardage} yds, pattern needs at least ${minYardage} yds`
      });
    }

    // Hook scoring
    if (!userInput.hookSizeUnknown && pattern.materials?.hook && effHook !== null && effHook !== undefined) {
      const hookDiff = Math.abs(effHook - pattern.materials.hook.sizeMM);
      if (hookDiff <= 0.5) { score += 1.5; details.criteria.push({ name: "hookSize", met: true, points: 1.5 }); }
      else if (hookDiff <= 1.0) { score += 0.5; details.criteria.push({ name: "hookSize", met: true, points: 0.5, info: `Close hook match: ${effHook}mm vs ${pattern.materials.hook.sizeMM}mm` }); }
      else { details.criteria.push({ name: "hookSize", met: false, points: 0, info: `You have ${effHook}mm, pattern suggests ${pattern.materials.hook.sizeMM}mm` }); }
    } else if (userInput.hookSizeUnknown) {
      details.criteria.push({ name: "hookSize", met: null, points: 0, info: "Hook size unknown; skipping hook match." });
    }

    // Time scoring
    if (pattern.estimatedTime && userInput.timeRange) {
      const pMid = (pattern.estimatedTime.minHours + pattern.estimatedTime.maxHours) / 2;
      const uMid = (userInput.timeRange.minHours + userInput.timeRange.maxHours) / 2;
      const overlaps = !(pattern.estimatedTime.maxHours < userInput.timeRange.minHours || pattern.estimatedTime.minHours > userInput.timeRange.maxHours);
      if (overlaps) {
        score += Math.abs(pMid - uMid) <= 0.5 ? 1.5 : 1;
        details.criteria.push({ name: "time", met: true, points: Math.abs(pMid - uMid) <= 0.5 ? 1.5 : 1 });
      } else {
        details.criteria.push({ name: "time", met: false, points: 0, info: `Pattern takes ${pattern.estimatedTime.minHours}-${pattern.estimatedTime.maxHours}h, you have ${userInput.timeRange.minHours}-${userInput.timeRange.maxHours}h` });
      }
    }

    // Category scoring
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

    // Difficulty fit bonus
    if (pattern.difficulty?.score !== undefined) {
      const uDiff = userDifficulty === 'beginner' ? 2 : 5;
      score += Math.abs(pattern.difficulty.score - uDiff) <= 1 ? 1 : 0.5;
      details.criteria.push({ name: "difficultyFit", met: true, points: Math.abs(pattern.difficulty.score - uDiff) <= 1 ? 1 : 0.5 });
    }

    scoredPatterns.push({ pattern, score, details, effYardage, effHook });
  }

  if (scoredPatterns.length === 0) {
    throw new Error(`No patterns found matching your materials. Try different yarn weights or more yardage.`);
  }

  scoredPatterns.sort((a, b) => b.score - a.score);
  const bestScore = scoredPatterns[0].score;
  const topPatterns = scoredPatterns.filter(p => p.score >= bestScore - 1).slice(0, 4);

  const results = topPatterns.map(({ pattern, score, details, effYardage, effHook }) => {
    const minY = pattern.materials?.yarn?.suggestedYardageMin;
    const maxY = pattern.materials?.yarn?.suggestedYardageMax;
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

/**
 * Reverse match: given a pattern and user's yarn stash,
 * determine which individual yarns match (weight ±1, enough yardage)
 * and whether the combined stash of matching-weight yarns is sufficient.
 *
 * Returns:
 * {
 *   patternWeight, minYardage, maxYardage,
 *   individualMatches: [{ yarn, weightMatch, yardageMatch, overall }],
 *   combinedMatch: { matchingWeightYarns, totalYardage, enough }
 * }
 */
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

  // Evaluate each yarn individually
  const individualMatches = (yarns || []).map(yarn => {
    const wDiff = Math.abs(patternWeight - yarn.weight);
    const weightMatch = wDiff <= 1;
    const yardageMatch = yarn.yardage >= minYardage;
    return {
      yarn: { id: yarn.id, name: yarn.name || `Weight ${yarn.weight}`, weight: yarn.weight, yardage: yarn.yardage, hook: yarn.hook, notes: yarn.notes },
      weightMatch,
      yardageMatch,
      wDiff,
      overall: weightMatch && yardageMatch
    };
  });

  // Combined: sum yardage of all matching-weight yarns
  const matchingWeight = individualMatches.filter(m => m.weightMatch);
  const totalYardage = matchingWeight.reduce((sum, m) => sum + m.yarn.yardage, 0);
  const enough = totalYardage >= minYardage;

  return {
    patternWeight,
    minYardage,
    maxYardage,
    individualMatches,
    combinedMatch: {
      matchingWeightYarns: matchingWeight.length,
      totalYardage,
      enough,
      reason: enough
        ? `You have ${totalYardage} yds across ${matchingWeight.length} yarn(s) — enough!`
        : `You have ${totalYardage} yds across ${matchingWeight.length} yarn(s), need ${minYardage} yds total.`
    }
  };
}

module.exports = { matchPattern, invalidateCache, reverseMatch };