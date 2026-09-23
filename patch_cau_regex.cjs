const fs = require('fs');
let content = fs.readFileSync('src/lib/wordParser.ts', 'utf8');

content = content.replace(
  'const qMatch = line.match(/^Câu\\s+(\\d+)[\\.\\:]?\\s*(.*)/i);',
  'const qMatch = line.match(/^Câu\\s*(\\d+)[\\.\\:]?\\s*(.*)/i);'
);

fs.writeFileSync('src/lib/wordParser.ts', content);
