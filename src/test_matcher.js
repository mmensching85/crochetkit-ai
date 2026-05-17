const { matchPattern } = require('./matchPattern');
const patterns = require('../data/patterns.json');
const { formatProjectOutput } = require('./formatProjectOutput');

function testScenario(label, input) {
  console.log(`\n--- ${label} ---`);
  try {
    const results = matchPattern(input, patterns);
    console.log(`Found ${results.length} matches:`);
    results.forEach((r, i) => {
      const formatted = formatProjectOutput(r);
      console.log(`  ${i+1}. ${formatted.title} (${formatted.skill_level}) - Score: ${r.matchScore}`);
    });
    // Show first result in detail
    if (results.length > 0) {
      const formatted = formatProjectOutput(results[0]);
      console.log("\nTop Result Details:");
      console.log(`  Title: ${formatted.title}`);
      console.log(`  Difficulty: ${formatted.skill_level}`);
      console.log(`  Time: ${formatted.estimated_time}`);
      console.log(`  Materials: ${formatted.materials.slice(0, 2).join(', ')}`);
      console.log(`  Stitches: ${formatted.stitches_used.join(', ')}`);
      console.log(`  Tips Label: ${formatted.tips_label}`);
      if (formatted.missing_materials.length > 0) {
        console.log(`  Missing: ${formatted.missing_materials.join(', ')}`);
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

testScenario("Scenario 1: Beginner, Scarf, plenty of yarn", {
  yarnWeightNumber: 4, yardageHave: 180, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 1, maxHours: 3 },
  difficulty: "beginner", preferredCategory: "Scarf"
});

testScenario("Scenario 2: Beginner, Dishcloth, low yardage", {
  yarnWeightNumber: 4, yardageHave: 60, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 0.5, maxHours: 2 },
  difficulty: "beginner", preferredCategory: "Dishcloth"
});

testScenario("Scenario 3: Beginner, no hook/preference, low yardage", {
  yarnWeightNumber: 4, yardageHave: 30, hookSizeMM: null,
  hookSizeUnknown: true, timeRange: { minHours: 0.5, maxHours: 1.5 },
  difficulty: "beginner", preferredCategory: null
});

testScenario("Scenario 4: Intermediate, Hat", {
  yarnWeightNumber: 4, yardageHave: 200, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 2, maxHours: 4 },
  difficulty: "intermediate", preferredCategory: "Hat"
});

testScenario("Scenario 5: Intermediate, Scarf", {
  yarnWeightNumber: 4, yardageHave: 350, hookSizeMM: 5.5,
  hookSizeUnknown: false, timeRange: { minHours: 3, maxHours: 5 },
  difficulty: "intermediate", preferredCategory: "Scarf"
});

testScenario("Scenario 6: UK Term System, Scarf, beginner", {
  yarnWeightNumber: 4, yardageHave: 180, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 1, maxHours: 3 },
  difficulty: "beginner", preferredCategory: "Scarf", termSystem: "UK"
});

testScenario("Scenario 7: No match — extreme yarn weight (lace, weight 0)", {
  yarnWeightNumber: 0, yardageHave: 50, hookSizeMM: 2.25,
  hookSizeUnknown: false, timeRange: { minHours: 1, maxHours: 3 },
  difficulty: "beginner", preferredCategory: null
});

testScenario("Scenario 8: Insufficient yardage (20yd for worsted)", {
  yarnWeightNumber: 4, yardageHave: 20, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 0.5, maxHours: 1 },
  difficulty: "beginner", preferredCategory: null
});

testScenario("Scenario 9: Advanced difficulty, any category", {
  yarnWeightNumber: 4, yardageHave: 500, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 3, maxHours: 8 },
  difficulty: "advanced", preferredCategory: null
});

testScenario("Scenario 10: Granny square, low yardage, intermediate", {
  yarnWeightNumber: 4, yardageHave: 80, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 0.5, maxHours: 2 },
  difficulty: "intermediate", preferredCategory: "Granny square"
});

testScenario("Scenario 11: Weight 3 (DK), plenty of yardage", {
  yarnWeightNumber: 3, yardageHave: 400, hookSizeMM: 4.5,
  hookSizeUnknown: false, timeRange: { minHours: 1, maxHours: 4 },
  difficulty: "intermediate", preferredCategory: null
});

testScenario("Scenario 12: Bulky weight 5, quick beginner project", {
  yarnWeightNumber: 5, yardageHave: 120, hookSizeMM: 6.5,
  hookSizeUnknown: false, timeRange: { minHours: 0.5, maxHours: 2 },
  difficulty: "beginner", preferredCategory: null
});

testScenario("Scenario 13: Category with no patterns ('Slippers')", {
  yarnWeightNumber: 4, yardageHave: 100, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 0.5, maxHours: 2 },
  difficulty: "beginner", preferredCategory: "Slippers"
});

testScenario("Scenario 14: Hook size mismatch (user has 8mm, pattern expects ~5.5mm)", {
  yarnWeightNumber: 4, yardageHave: 200, hookSizeMM: 8.0,
  hookSizeUnknown: false, timeRange: { minHours: 1, maxHours: 3 },
  difficulty: "beginner", preferredCategory: null
});

testScenario("Scenario 15: Multi-yarn stash — 2x weight-4 yarns combined", {
  yarns: [
    { weightNumber: 4, yardage: 100, hookSizeMM: 5.0, name: "Yarn A" },
    { weightNumber: 4, yardage: 80, hookSizeMM: 5.0, name: "Yarn B" }
  ],
  yardageHave: 180, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 1, maxHours: 3 },
  difficulty: "beginner", preferredCategory: null
});

testScenario("Scenario 16: Weight ±1 close match — weight 3, 100 yds", {
  yarnWeightNumber: 3, yardageHave: 100, hookSizeMM: 4.5,
  hookSizeUnknown: false, timeRange: { minHours: 0.5, maxHours: 2 },
  difficulty: "beginner", preferredCategory: null
});

testScenario("Scenario 17: No time overlap — user has 0-0.5h, patterns take longer", {
  yarnWeightNumber: 4, yardageHave: 100, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 0, maxHours: 0.5 },
  difficulty: "beginner", preferredCategory: null
});

testScenario("Scenario 18: Zero yardage edge case", {
  yarnWeightNumber: 4, yardageHave: 0, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 0.5, maxHours: 1 },
  difficulty: "beginner", preferredCategory: null
});

testScenario("Scenario 19: Super bulky weight 6, beginner", {
  yarnWeightNumber: 6, yardageHave: 80, hookSizeMM: 9.0,
  hookSizeUnknown: false, timeRange: { minHours: 0.5, maxHours: 2 },
  difficulty: "beginner", preferredCategory: null
});

testScenario("Scenario 20: Partial category match (lowercase 'scarf')", {
  yarnWeightNumber: 4, yardageHave: 200, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 1, maxHours: 4 },
  difficulty: "beginner", preferredCategory: "scarf"
});

testScenario("Scenario 21: UK terms, intermediate, ample yardage", {
  yarnWeightNumber: 4, yardageHave: 400, hookSizeMM: 5.5,
  hookSizeUnknown: false, timeRange: { minHours: 2, maxHours: 6 },
  difficulty: "intermediate", preferredCategory: null, termSystem: "UK"
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
});

testScenario("Scenario 23: Advanced difficulty, weight 4, high yardage", {
  yarnWeightNumber: 4, yardageHave: 600, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: { minHours: 4, maxHours: 10 },
  difficulty: "advanced", preferredCategory: null
});

testScenario("Scenario 24: Missing timeRange (null safety edge case)", {
  yarnWeightNumber: 4, yardageHave: 100, hookSizeMM: 5.0,
  hookSizeUnknown: false, timeRange: null,
  difficulty: "beginner", preferredCategory: ""
});
