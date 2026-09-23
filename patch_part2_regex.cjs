const fs = require('fs');
let content = fs.readFileSync('src/lib/wordParser.ts', 'utf8');

content = content.replace(
  "new RegExp(`${k}[\\\\.\\\\)]\\\\s*(.*?)(?=\\\\s*${nextKey}[\\\\.\\\\)]|$)`, 'i')",
  "new RegExp(`(?:^|\\\\s)${k}[\\\\.\\\\)]\\\\s*(.*?)(?=\\\\s*(?:^|\\\\s)${nextKey}[\\\\.\\\\)]|$)`, 'i')"
);

content = content.replace(
  "new RegExp(`${k}[\\\\.\\\\)]\\\\s*(.*?)(?=\\\\s*(?:Đáp án|Lời giải|$))`, 'i')",
  "new RegExp(`(?:^|\\\\s)${k}[\\\\.\\\\)]\\\\s*(.*?)(?=\\\\s*(?:Đáp án|Lời giải|$))`, 'i')"
);

content = content.replace(
  "const beforeA = textRemainder.search(/a[\\.\\)]/i);",
  "const beforeA = textRemainder.search(/(?:^|\\s)a[\\.\\)]/i);"
);

fs.writeFileSync('src/lib/wordParser.ts', content);
