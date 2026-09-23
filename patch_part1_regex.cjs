const fs = require('fs');
let content = fs.readFileSync('src/lib/wordParser.ts', 'utf8');

content = content.replace(/A\[\\\\\\.\\\\\)\]/g, 'A[\\\\.\\\\)]');
content = content.replace(/B\[\\\\\\.\\\\\)\]/g, 'B[\\\\.\\\\)]');
content = content.replace(/C\[\\\\\\.\\\\\)\]/g, 'C[\\\\.\\\\)]');
content = content.replace(/D\[\\\\\\.\\\\\)\]/g, 'D[\\\\.\\\\)]');

content = content.replace(/A\[\\\.\\\)\]/g, 'A[\\.\\)]');
content = content.replace(/B\[\\\.\\\)\]/g, 'B[\\.\\)]');
content = content.replace(/C\[\\\.\\\)\]/g, 'C[\\.\\)]');
content = content.replace(/D\[\\\.\\\)\]/g, 'D[\\.\\)]');

// For A, B, C, D choices:
content = content.replace(/const aMatch = textRemainder.match\(\/A\[\\\\.\\\\\)\]\\\\s\*\(\.\*\?\)\(\?\=\\\\s\*B\[\\\\.\\\\\)\]\|\\\$\)\/i\);/g, 
  "const aMatch = textRemainder.match(/(?:^|\\s)A[\\.\\)]\\s*(.*?)(?=\\s*B[\\.\\)]|$)/);");

content = content.replace(/const bMatch = textRemainder.match\(\/B\[\\\\.\\\\\)\]\\\\s\*\(\.\*\?\)\(\?\=\\\\s\*C\[\\\\.\\\\\)\]\|\\\$\)\/i\);/g, 
  "const bMatch = textRemainder.match(/(?:^|\\s)B[\\.\\)]\\s*(.*?)(?=\\s*C[\\.\\)]|$)/);");

content = content.replace(/const cMatch = textRemainder.match\(\/C\[\\\\.\\\\\)\]\\\\s\*\(\.\*\?\)\(\?\=\\\\s\*D\[\\\\.\\\\\)\]\|\\\$\)\/i\);/g, 
  "const cMatch = textRemainder.match(/(?:^|\\s)C[\\.\\)]\\s*(.*?)(?=\\s*D[\\.\\)]|$)/);");

content = content.replace(/const dMatch = textRemainder.match\(\/D\[\\\\.\\\\\)\]\\\\s\*\(\.\*\?\)\(\?\=\\\\s\*\(\?\:Đáp án\|Lời giải\|\\\$\)\)\/i\);/g, 
  "const dMatch = textRemainder.match(/(?:^|\\s)D[\\.\\)]\\s*(.*?)(?=\\s*(?:Đáp án|Lời giải|$))/i);");

// Fix search
content = content.replace(/const aIdx = textRemainderWithU.search\(\/A\[\\\\.\\\\\)\]\/i\);/g, 
  "const aIdx = textRemainderWithU.search(/(?:^|\\s)A[\\.\\)]/);");
content = content.replace(/const bIdx = textRemainderWithU.search\(\/B\[\\\\.\\\\\)\]\/i\);/g, 
  "const bIdx = textRemainderWithU.search(/(?:^|\\s)B[\\.\\)]/);");
content = content.replace(/const cIdx = textRemainderWithU.search\(\/C\[\\\\.\\\\\)\]\/i\);/g, 
  "const cIdx = textRemainderWithU.search(/(?:^|\\s)C[\\.\\)]/);");
content = content.replace(/const dIdx = textRemainderWithU.search\(\/D\[\\\\.\\\\\)\]\/i\);/g, 
  "const dIdx = textRemainderWithU.search(/(?:^|\\s)D[\\.\\)]/);");

content = content.replace(/const beforeAIndex = textRemainder.search\(\/A\[\\\\.\\\\\)\]\/i\);/g, 
  "const beforeAIndex = textRemainder.search(/(?:^|\\s)A[\\.\\)]/);");

fs.writeFileSync('src/lib/wordParser.ts', content);
