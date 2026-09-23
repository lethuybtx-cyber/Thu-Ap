const fs = require('fs');
let content = fs.readFileSync('src/lib/wordParser.ts', 'utf8');

content = content.replace(/text: aMatch \? aMatch\[1\]\.trim\(\) : 'Đáp án A'/g, "text: stripU(aMatch ? aMatch[1].trim() : 'Đáp án A')");
content = content.replace(/text: bMatch \? bMatch\[1\]\.trim\(\) : 'Đáp án B'/g, "text: stripU(bMatch ? bMatch[1].trim() : 'Đáp án B')");
content = content.replace(/text: cMatch \? cMatch\[1\]\.trim\(\) : 'Đáp án C'/g, "text: stripU(cMatch ? cMatch[1].trim() : 'Đáp án C')");
content = content.replace(/text: dMatch \? dMatch\[1\]\.trim\(\) : 'Đáp án D'/g, "text: stripU(dMatch ? dMatch[1].trim() : 'Đáp án D')");

fs.writeFileSync('src/lib/wordParser.ts', content);
