const fs = require('fs');
let content = fs.readFileSync('src/lib/wordParser.ts', 'utf8');

// Replace the uMatch block
content = content.replace(
  /let uMatch = fullBlockText\.match.*?\}\n      \}/s,
  `let uMatch = fullBlockText.match(/\\[U\\]\\s*([A-D])[\\.\\)]?\\s*.*\\[\\/U\\]/i) || fullBlockText.match(/\\[U\\]\\s*([A-D])[\\.\\)]?\\s*\\[\\/U\\]/i);
      if (!uMatch) {
        const aIdx = textRemainderWithU.search(/A[\\.\\)]/i);
        const bIdx = textRemainderWithU.search(/B[\\.\\)]/i);
        const cIdx = textRemainderWithU.search(/C[\\.\\)]/i);
        const dIdx = textRemainderWithU.search(/D[\\.\\)]/i);
        const uIdx = textRemainderWithU.search(/\\[U\\]/i);
        if (uIdx !== -1) {
          if (dIdx !== -1 && uIdx > dIdx) uMatch = [null, "D"];
          else if (cIdx !== -1 && uIdx > cIdx) uMatch = [null, "C"];
          else if (bIdx !== -1 && uIdx > bIdx) uMatch = [null, "B"];
          else if (aIdx !== -1 && uIdx > aIdx) uMatch = [null, "A"];
        }
      }`
);

fs.writeFileSync('src/lib/wordParser.ts', content);
