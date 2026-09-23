const fs = require('fs');
let content = fs.readFileSync('src/lib/wordParser.ts', 'utf8');

content = content.replace(
  'const aMatch = textRemainder.match(/A[\\.\\)]\\s*(.*?)(?=\\s*B[\\.\\)]|$)/i);',
  'const aMatch = textRemainder.match(/(?:^|\\s)A[\\.\\)]\\s*(.*?)(?=\\s*(?:^|\\s)B[\\.\\)]|$)/);'
);
content = content.replace(
  'const bMatch = textRemainder.match(/B[\\.\\)]\\s*(.*?)(?=\\s*C[\\.\\)]|$)/i);',
  'const bMatch = textRemainder.match(/(?:^|\\s)B[\\.\\)]\\s*(.*?)(?=\\s*(?:^|\\s)C[\\.\\)]|$)/);'
);
content = content.replace(
  'const cMatch = textRemainder.match(/C[\\.\\)]\\s*(.*?)(?=\\s*D[\\.\\)]|$)/i);',
  'const cMatch = textRemainder.match(/(?:^|\\s)C[\\.\\)]\\s*(.*?)(?=\\s*(?:^|\\s)D[\\.\\)]|$)/);'
);
content = content.replace(
  'const dMatch = textRemainder.match(/D[\\.\\)]\\s*(.*?)(?=\\s*(?:Đáp án|Lời giải|$))/i);',
  'const dMatch = textRemainder.match(/(?:^|\\s)D[\\.\\)]\\s*(.*?)(?=\\s*(?:Đáp án|Lời giải|$))/i);'
);
content = content.replace(
  'const beforeAIndex = textRemainder.search(/A[\\.\\)]/i);',
  'const beforeAIndex = textRemainder.search(/(?:^|\\s)A[\\.\\)]/);'
);

content = content.replace('const aIdx = textRemainderWithU.search(/A[\\.\\)]/i);', 'const aIdx = textRemainderWithU.search(/(?:^|\\s)A[\\.\\)]/);');
content = content.replace('const bIdx = textRemainderWithU.search(/B[\\.\\)]/i);', 'const bIdx = textRemainderWithU.search(/(?:^|\\s)B[\\.\\)]/);');
content = content.replace('const cIdx = textRemainderWithU.search(/C[\\.\\)]/i);', 'const cIdx = textRemainderWithU.search(/(?:^|\\s)C[\\.\\)]/);');
content = content.replace('const dIdx = textRemainderWithU.search(/D[\\.\\)]/i);', 'const dIdx = textRemainderWithU.search(/(?:^|\\s)D[\\.\\)]/);');


fs.writeFileSync('src/lib/wordParser.ts', content);
