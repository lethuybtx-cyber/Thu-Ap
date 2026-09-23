const fs = require('fs');
let content = fs.readFileSync('src/components/LeftPanel.tsx', 'utf8');

// Ensure we don't have multiple leaderboard buttons
content = content.replace(
  "{/* Button 0: TẠO ĐỀ BẰNG FILE WORD */}", 
  ""
);

fs.writeFileSync('src/components/LeftPanel.tsx', content);
