const fs = require('fs');
let content = fs.readFileSync('src/lib/wordParser.ts', 'utf8');

content = content.replace(
  /isCorrect = matchWithU \? \/\\\[U\\\]\/\.test\(matchWithU\[1\]\) : false;/g,
  "isCorrect = matchWithU ? /\\[U\\]/.test(matchWithU[0]) : false;"
);

fs.writeFileSync('src/lib/wordParser.ts', content);
