const fs = require('fs');
let content = fs.readFileSync('src/components/MiddlePanel.tsx', 'utf8');
content = content.replace(
  "'bg-[#142d5c] border-[#facc15] text-amber-300 font-bold ring-2 ring-amber-400/80 shadow-[0_0_12px_rgba(250,204,21,0.3)]';",
  "'bg-[#142d5c] border-[#facc15] text-amber-300 font-bold ring-2 ring-amber-400/80 shadow-[0_0_12px_rgba(250,204,21,0.3)] animate-pulse';"
);
fs.writeFileSync('src/components/MiddlePanel.tsx', content);
