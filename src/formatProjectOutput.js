
const { stitchNamesUS, stitchNamesUK, abbrUS } = require('./termConverter');

function formatProjectOutput(matchResult, termSystem) {
  const isUK = termSystem && (termSystem === 'UK' || termSystem === 'AU');
  const pattern = matchResult.matchedPattern;
  const materialGap = matchResult.materialGap;

  // Map US full stitch names to UK full stitch names
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

  // Helper to extract stitches
  function extractStitches(instructions) {
    // Order matters: check longer abbreviations BEFORE shorter ones
    // e.g. "hdc" before "dc", "sl st" before "sc"
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

  // Helper to generate tips for steps
  function getStepTip(instruction, pattern) {
    const lowerInstruction = instruction.toLowerCase();
    const commonMistakes = pattern.commonMistakes || [];
    const beginnerTips = pattern.beginnerTips || [];

    // Prioritize specific common mistakes related to counting/edges
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

    // Generic tips if no specific one is found
    if (beginnerTips.length > 0) {
      return `Tip: ${beginnerTips[0]}`; // Use the first general tip
    }
    return "";
  }

  // Helper to generate visual descriptions for steps
  function generateVisualDescription(instruction) {
    const lowerInstruction = instruction.toLowerCase();

    if (lowerInstruction.includes("chain")) {
      return "Hold the hook in your dominant hand and the yarn in your other hand. Make a slip knot, then wrap the yarn over the hook from back to front, and pull it through the loop on your hook. This creates one chain stitch. Repeat to make a chain that looks like a braid.";
    } else if (lowerInstruction.includes("single crochet") && lowerInstruction.includes("2nd chain from hook")) {
      return "Skip the first chain from your hook. Insert your hook into the center of the next chain stitch. You should see two strands of yarn on top of your hook. Yarn over, pull a loop through the chain. Now you have two loops on your hook. Yarn over again, and pull through both loops on your hook. This creates a compact 'V' shape.";
    } else if (lowerInstruction.includes("single crochet") && lowerInstruction.includes("each stitch across")) {
      return "Insert your hook under both loops of the next stitch (it looks like a small 'V' on the top edge of your fabric). Yarn over, pull a loop through. You have two loops on your hook. Yarn over, pull through both loops. Your single crochet will form a dense fabric.";
    } else if (lowerInstruction.includes("double crochet") && lowerInstruction.includes("each stitch across")) {
      return "Yarn over your hook once. Insert your hook under both loops of the next stitch. Yarn over, pull a loop through the stitch (three loops on hook). Yarn over, pull through the first two loops (two loops on hook). Yarn over, pull through the last two loops (one loop on hook). This stitch is taller than a single crochet and creates a looser fabric.";
    } else if (lowerInstruction.includes("turn")) {
      return "At the end of the row, turn your work over as if turning a page in a book. The back side of your stitches will now be facing you, and you'll work into them for the next row.";
    } else if (lowerInstruction.includes("fasten off")) {
      return "Cut the yarn, leaving a tail of about 6 inches. Yarn over your hook one last time, pull the tail completely through the remaining loop on your hook, and pull tight to secure. This locks your last stitch.";
    } else if (lowerInstruction.includes("weave in ends")) {
      return "Thread the yarn tail onto a yarn needle. Carefully weave the needle in and out through the stitches on the wrong side of your fabric for several inches, changing direction occasionally, to hide the tail securely.";
    }
    return "(No specific visual guidance for this step, focus on the written instruction.)";
  }

  // Materials formatting
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

  // Missing materials
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

  // Steps
  const formattedSteps = pattern.instructions.map((instruction, index) => ({
    step: index + 1,
    instruction: instruction.replace(/\*\*(.*?)\*\*/g, '**$1**'), // Format bold markdown
    tip: getStepTip(instruction, pattern),
    visual_description: generateVisualDescription(instruction)
  }));

  // Variations (hardcoded for MVP based on project category)
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

  // Safety notes (hardcoded for MVP based on project category)
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


  // Printable Summary
  const estTime = pattern.estimatedTime || {};
  const estStr = estTime.minHours != null && estTime.maxHours ? `${estTime.minHours}-${estTime.maxHours} ${estTime.unit || 'hours'}` : 'Varies';
  const instructions = Array.isArray(pattern.instructions) ? pattern.instructions : [];
  const printableSummary = [
    `${pattern.name || 'Project'} –`,
    `${estStr} –`,
    `Materials: ${materialsList.slice(0, 2).join(', ')}.`,
    `Stitches: ${extractStitches(instructions).map(s => s.split(' ')[0]).join(', ')}.`,
    `Steps: ${instructions.map(inst => inst.split(':')[0].replace(/\*\*/g, '')).join(', ')}.`,
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
    stitches_used: extractStitches(instructions),
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

module.exports = { formatProjectOutput };
