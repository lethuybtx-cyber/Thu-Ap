const fs = require('fs');
let content = fs.readFileSync('src/lib/wordParser.ts', 'utf8');

content = content.replace(
  /if \(dIdx !== -1 \&\& uIdx > dIdx\) uMatch = \[null, "D"\];/g,
  "if (dIdx !== -1 && uIdx > dIdx) uMatch = [null, 'D'];"
);

const target = `        if (uIdx !== -1) {
          if (dIdx !== -1 && uIdx > dIdx) uMatch = [null, "D"];
          else if (cIdx !== -1 && uIdx > cIdx) uMatch = [null, "C"];
          else if (bIdx !== -1 && uIdx > bIdx) uMatch = [null, "B"];
          else if (aIdx !== -1 && uIdx > aIdx) uMatch = [null, "A"];
        }`;

const replacement = `        if (uIdx !== -1) {
          if (dIdx !== -1 && uIdx > dIdx) uMatch = [null, "D"];
          else if (cIdx !== -1 && uIdx > cIdx) uMatch = [null, "C"];
          else if (bIdx !== -1 && uIdx > bIdx) uMatch = [null, "B"];
          else if (aIdx !== -1 && uIdx > aIdx) uMatch = [null, "A"];
        }`;

// Wait, the logic is already:
// if (dIdx !== -1 && uIdx > dIdx)
// The && operator short-circuits. If dIdx is -1, it evaluates to false, so it moves to else if!
// So it is ALREADY CORRECT!
