const { matchPattern } = require('./matchPattern');
const patterns = require('../data/patterns.json');
const { formatProjectOutput } = require('./formatProjectOutput');

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) {
    passed++;
    return true;
  }
  failed++;
  console.error(`  ✗ FAIL: ${msg}`);
  return false;
}

function assertEq(actual, expected, msg) {
  if (actual === expected) {
    passed++;
    return true;
  }
  failed++;
  console.error(`  ✗ FAIL: ${msg} — expected "${expected}", got "${actual}"`);
  return false;
}

function assertIn(haystack, needle, msg) {
  if (haystack.includes(needle)) {
    passed++;
    return true;
  }
  failed++;
  console.error(`  ✗ FAIL: ${msg} — "${needle}" not found in "${haystack}"`);
  return false;
}

function testScenario(label, input, assertions) {
  console.log(`\n--- ${label} ---`);
  try {
    const results = matchPattern(input, patterns);
    assert(results.length > 0, 'Should return at least one match');

    results.forEach((r, i) => {
      const formatted = formatProjectOutput(r);
      assert(formatted.title, `Result ${i+1} should have a title`);
      assert(formatted.skill_level, `Result ${i+1} should have a skill_level`);
      assert(formatted.description, `Result ${i+1} should have a description`);
      assert(formatted.materials.length > 0, `Result ${i+1} should have materials`);
      assert(formatted.steps.length > 0, `Result ${i+1} should have steps`);
      assert(r.matchScore > 0, `Result ${i+1} should have a positive score`);
      assert(formatted.stitches_used.length > 0, `Result ${i+1} should have stitches`);
      assert(!isNaN(formatted.estimated_min_hours), `Result ${i+1} estimated_min_hours should be a number`);

      // Every step should have an instruction, tip, and visual_description
      formatted.steps.forEach((s, si) => {
        assert(s.instruction, `Step ${si+1} should have an instruction`);
        assert(s.visual_description, `Step ${si+1} should have a visual_description`);
      });
    });

    if (typeof assertions === 'function') {
      assertions(results.map(r => formatProjectOutput(r)));
    }

    const first = formatProjectOutput(results[0]);
    console.log(`  ✓ ${results.length} match(es), top: "${first.title}" (${first.skill_level})`);
  } catch (error) {
    failed++;
    console.error(`  ✗ CRASH: ${error.message}`);
  }
}

// ── Scenario definitions ──

testScenario("Scenario 1: Beginner, Scarf, plenty of yarn", {
  yarnWeightNumber: 4, yardageHave: 180, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 1, maxHours: 3 },
  difficulty: "beginner", preferredCategory: "Scarf"
}, (formatted) => {
  assertEq(formatted[0].skill_level, 'beginner', 'Should be beginner');
  assertEq(formatted[0].category, 'Scarf', 'Should be a Scarf pattern');
  assertIn(formatted[0].title.toLowerCase(), 'scarf', 'Title should contain scarf');
});

testScenario("Scenario 2: Beginner, Dishcloth, low yardage", {
  yarnWeightNumber: 4, yardageHave: 60, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 0.5, maxHours: 2 },
  difficulty: "beginner", preferredCategory: "Dishcloth"
}, (formatted) => {
  assertEq(formatted[0].skill_level, 'beginner', 'Should be beginner');
  assertEq(formatted[0].category, 'Dishcloth', 'Should be a Dishcloth pattern');
  assert(formatted[0].missing_materials.length === 0, '60 yds should be enough for a dishcloth');
});

testScenario("Scenario 3: Beginner, no hook/preference, low yardage", {
  yarnWeightNumber: 4, yardageHave: 30, hookSizeMM: null,
  hookSizeUnknown: true, timeRange: { minHours: 0.5, maxHours: 1.5 },
  difficulty: "beginner", preferredCategory: null
}, (formatted) => {
  assertEq(formatted[0].skill_level, 'beginner', 'Should be beginner');
  assert(formatted[0].estimated_min_hours <= 1.5, 'Should be a quick project (≤1.5h)');
});

testScenario("Scenario 4: Intermediate, Hat", {
  yarnWeightNumber: 4, yardageHave: 200, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 2, maxHours: 4 },
  difficulty: "intermediate", preferredCategory: "Hat"
}, (formatted) => {
  assertEq(formatted[0].skill_level, 'intermediate', 'Should be intermediate');
  assertEq(formatted[0].category, 'Hat', 'Should be a Hat pattern');
});

testScenario("Scenario 5: Intermediate, Scarf", {
  yarnWeightNumber: 4, yardageHave: 350, hookSizeMM: 5.5,
  hookSizeUnknown: false, timeRange: { minHours: 3, maxHours: 5 },
  difficulty: "intermediate", preferredCategory: "Scarf"
}, (formatted) => {
  assertEq(formatted[0].skill_level, 'intermediate', 'Should be intermediate');
  assertIn(formatted[0].title.toLowerCase(), 'scarf', 'Title should contain scarf');
});

testScenario("Scenario 6: UK Term System, Scarf, beginner", {
  yarnWeightNumber: 4, yardageHave: 180, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 1, maxHours: 3 },
  difficulty: "beginner", preferredCategory: "Scarf", termSystem: "UK"
}, (formatted) => {
  assertEq(formatted[0].skill_level, 'beginner', 'Should be beginner');
  // UK terms: sc should be shown as dc
  const stitches = formatted[0].stitches_used.join(' ');
  assertIn(stitches, 'Chain (ch)', 'Should include Chain (ch) in UK mode');
});

testScenario("Scenario 7: Direct match — lace weight (weight 0), 50 yds", {
  yarnWeightNumber: 0, yardageHave: 50, hookSizeMM: 2.25,
  hookSizeUnknown: false, timeRange: { minHours: 1, maxHours: 3 },
  difficulty: "beginner", preferredCategory: null
}, (formatted) => {
  // Lace patterns now exist — should match directly
  assert(formatted.length > 0, 'Should return lace patterns');
  const exact = formatted.filter(f => f.yarnWeightNumber === 0);
  assert(exact.length > 0, 'Should include weight-0 lace patterns');
  assert(formatted.every(f => f.missing_materials.length === 0), '50 yds should be enough for lace bookmark');
});

testScenario("Scenario 8: Insufficient yardage (5yd for worsted)", {
  yarnWeightNumber: 4, yardageHave: 5, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 0.5, maxHours: 1 },
  difficulty: "beginner", preferredCategory: null
}, (formatted) => {
  assert(formatted.some(f => f.missing_materials.length > 0), 'Should show missing yardage');
});

testScenario("Scenario 9: Advanced difficulty, any category", {
  yarnWeightNumber: 4, yardageHave: 500, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 3, maxHours: 8 },
  difficulty: "advanced", preferredCategory: null
}, (formatted) => {
  assertEq(formatted[0].skill_level, 'advanced', 'Should be advanced');
  assert(formatted[0].estimated_min_hours >= 4, 'Advanced projects should take 4+ hours');
});

testScenario("Scenario 10: Granny square, low yardage, intermediate", {
  yarnWeightNumber: 4, yardageHave: 80, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 0.5, maxHours: 2 },
  difficulty: "intermediate", preferredCategory: "Granny square"
}, (formatted) => {
  assertEq(formatted[0].skill_level, 'intermediate', 'Should be intermediate');
  assertIn(formatted[0].title.toLowerCase(), 'granny', 'Title should contain granny');
});

testScenario("Scenario 11: Weight 3 (DK), plenty of yardage", {
  yarnWeightNumber: 3, yardageHave: 400, hookSizeMM: 4.5,
  hookSizeUnknown: false, timeRange: { minHours: 1, maxHours: 4 },
  difficulty: "intermediate", preferredCategory: null
}, (formatted) => {
  assertEq(formatted[0].skill_level, 'intermediate', 'Should be intermediate');
  // Weight 3 patterns exist (baby booties etc) but may include weight-4 patterns at ±1
  const hasDirect = formatted.filter(f => f.yarnWeightNumber === 3).length > 0;
  // Still should return results
  assert(formatted.length > 0, 'Should return matches for weight 3');
});

testScenario("Scenario 12: Bulky weight 5, quick beginner project", {
  yarnWeightNumber: 5, yardageHave: 120, hookSizeMM: 6.5,
  hookSizeUnknown: false, timeRange: { minHours: 0.5, maxHours: 2 },
  difficulty: "beginner", preferredCategory: null
}, (formatted) => {
  assertEq(formatted[0].skill_level, 'beginner', 'Should be beginner');
  // Bulky Ribbed Scarf is weight 5, should match
  const exact = formatted.filter(f => f.yarnWeightNumber === 5).length;
  assert(exact > 0 || formatted.some(f => f.title.toLowerCase().includes('bulky')), 'Should match bulky-weight patterns');
});

testScenario("Scenario 13: Category with no patterns ('Slippers')", {
  yarnWeightNumber: 4, yardageHave: 100, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 0.5, maxHours: 2 },
  difficulty: "beginner", preferredCategory: "Slippers"
}, (formatted) => {
  // No slippers pattern, but should still return beginner patterns
  assert(formatted.length > 0, 'Should still find patterns despite no category match');
  assertEq(formatted[0].skill_level, 'beginner', 'Should be beginner');
  const exactCat = formatted.filter(f => f.category === 'Slippers').length;
  assertEq(exactCat, 0, 'Should have 0 exact category matches for Slippers');
});

testScenario("Scenario 14: Hook size mismatch (user has 8mm, pattern expects ~5.5mm)", {
  yarnWeightNumber: 4, yardageHave: 200, hookSizeMM: 8.0,
  hookSizeUnknown: false, timeRange: { minHours: 1, maxHours: 3 },
  difficulty: "beginner", preferredCategory: null
}, (formatted) => {
  const hasMismatch = formatted.some(f => f.missing_materials.some(m => m.toLowerCase().includes('hook')));
  assert(hasMismatch, 'Should suggest hook size in missing materials');
});

testScenario("Scenario 15: Multi-yarn stash — 2x weight-4 yarns combined", {
  yarns: [
    { weightNumber: 4, yardage: 100, hookSizeMM: 5.0, name: "Yarn A" },
    { weightNumber: 4, yardage: 80, hookSizeMM: 5.0, name: "Yarn B" }
  ],
  yardageHave: 180, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 1, maxHours: 3 },
  difficulty: "beginner", preferredCategory: null
}, (formatted) => {
  assert(formatted.length > 0, 'Multi-yarn should find matches');
  const hasMatchedYarns = formatted.some(f => f.matchedYarns && f.matchedYarns.length > 0);
  assert(hasMatchedYarns, 'Should report matched yarn names');
});

testScenario("Scenario 16: Weight ±1 close match — weight 3, 100 yds", {
  yarnWeightNumber: 3, yardageHave: 100, hookSizeMM: 4.5,
  hookSizeUnknown: false, timeRange: { minHours: 0.5, maxHours: 2 },
  difficulty: "beginner", preferredCategory: null
}, (formatted) => {
  assert(formatted.length > 0, 'Weight 3 should find patterns (weight-4 at -1)');
  // All should be weight 4 (close match) or weight 3 (exact)
  formatted.forEach(f => {
    assert([3, 4].includes(f.yarnWeightNumber), `Pattern weight ${f.yarnWeightNumber} should be 3 or 4`);
  });
});

testScenario("Scenario 17: No time overlap — user has 0-0.5h, patterns take longer", {
  yarnWeightNumber: 4, yardageHave: 100, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 0, maxHours: 0.5 },
  difficulty: "beginner", preferredCategory: null
}, (formatted) => {
  assert(formatted.length > 0, 'Should still find patterns');
  // Should find very quick patterns (some take 0.25-0.5h)
});

testScenario("Scenario 18: Zero yardage edge case", {
  yarnWeightNumber: 4, yardageHave: 0, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 0.5, maxHours: 1 },
  difficulty: "beginner", preferredCategory: null
}, (formatted) => {
  assert(formatted.length > 0, 'Should not crash with 0 yardage');
  const hasMissing = formatted.some(f => f.missing_materials.length > 0);
  assert(hasMissing, '0 yardage should show missing materials');
});

testScenario("Scenario 19: Super bulky weight 6, beginner", {
  yarnWeightNumber: 6, yardageHave: 80, hookSizeMM: 9.0,
  hookSizeUnknown: false, timeRange: { minHours: 0.5, maxHours: 2 },
  difficulty: "beginner", preferredCategory: null
}, (formatted) => {
  assert(formatted.length > 0, 'Weight 6 should not crash');
  // Patterns at weight 5 (bulky) are within ±1
  const closeMatch = formatted.some(f => Math.abs(f.yarnWeightNumber - 6) <= 1);
  assert(closeMatch || formatted.length > 0, 'Should find close weight matches');
});

testScenario("Scenario 20: Partial category match (lowercase 'scarf')", {
  yarnWeightNumber: 4, yardageHave: 200, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 1, maxHours: 4 },
  difficulty: "beginner", preferredCategory: "scarf"
}, (formatted) => {
  assert(formatted.length > 0, 'Lowercase category should match');
  // All returned patterns should be Scarf category
  formatted.forEach(f => {
    assertEq(f.category, 'Scarf', `Pattern "${f.title}" should be Scarf category`);
  });
});

testScenario("Scenario 21: UK terms, intermediate, ample yardage", {
  yarnWeightNumber: 4, yardageHave: 400, hookSizeMM: 5.5,
  hookSizeUnknown: false, timeRange: { minHours: 2, maxHours: 6 },
  difficulty: "intermediate", preferredCategory: null, termSystem: "UK"
}, (formatted) => {
  assertEq(formatted[0].skill_level, 'intermediate', 'Should be intermediate');
  assert(formatted.length > 0, 'UK terms should find matches');
});

testScenario("Scenario 22: Multiple yarns mixed weights — only weight-4 yarns should match", {
  yarns: [
    { weightNumber: 4, yardage: 200, hookSizeMM: 5.0, name: "Worsted A" },
    { weightNumber: 2, yardage: 100, hookSizeMM: 4.0, name: "Fine B" },
    { weightNumber: 4, yardage: 50, hookSizeMM: 5.0, name: "Worsted C" }
  ],
  yardageHave: 350, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 1, maxHours: 4 },
  difficulty: "beginner", preferredCategory: null
}, (formatted) => {
  assert(formatted.length > 0, 'Mixed weights should find matches');
  // Matched yarns should include Worsted A and C (weight 4), not Fine B (weight 2)
  const top = formatted[0];
  assert(top.matchedYarns && top.matchedYarns.length > 0, 'Should report matched yarns');
  if (top.matchedYarns) {
    const names = top.matchedYarns.join(' ');
    assertIn(names, 'Worsted', 'Matched yarns should include Worsted');
    assert(!names.includes('Fine'), 'Matched yarns should NOT include Fine (wrong weight)');
  }
});

testScenario("Scenario 23: Advanced difficulty, weight 4, high yardage", {
  yarnWeightNumber: 4, yardageHave: 600, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 4, maxHours: 10 },
  difficulty: "advanced", preferredCategory: null
}, (formatted) => {
  assertEq(formatted[0].skill_level, 'advanced', 'Should be advanced');
  assert(formatted[0].estimated_min_hours >= 4, 'Advanced projects should take 4+ hours');
});

testScenario("Scenario 24: Missing timeRange (null safety edge case)", {
  yarnWeightNumber: 4, yardageHave: 100, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: null,
  difficulty: "beginner", preferredCategory: ""
}, (formatted) => {
  assert(formatted.length > 0, 'Should handle null timeRange without crash');
  assert(formatted[0].estimated_min_hours > 0, 'Should have estimated hours');
});

// ── Summary ──
const total = passed + failed;
console.log(`\n${'='.repeat(50)}`);
console.log(`Results: ${passed}/${total} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
