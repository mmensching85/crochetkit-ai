// US / UK / AU crochet term conversion
// AU and New Zealand follow UK conventions for crochet terms

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

module.exports = { stitchNamesUS, stitchNamesUK, abbrUS, abbrUK, glossaryUK, convertStitches, getGlossary };
