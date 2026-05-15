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
