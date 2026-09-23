const fs = require('fs');
let content = fs.readFileSync('src/components/MiddlePanel.tsx', 'utf8');

content = content.replace(
  "'bg-emerald-600 border-emerald-400 text-white'",
  "'bg-emerald-600 border-emerald-400 text-white animate-pulse'"
);
content = content.replace(
  "'bg-rose-600 border-rose-400 text-white'",
  "'bg-rose-600 border-rose-400 text-white animate-pulse'"
);

fs.writeFileSync('src/components/MiddlePanel.tsx', content);
