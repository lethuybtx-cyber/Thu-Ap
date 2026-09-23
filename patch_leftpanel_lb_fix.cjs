const fs = require('fs');
let content = fs.readFileSync('src/components/LeftPanel.tsx', 'utf8');

// Fix interface
content = content.replace(
  "  currentExamId?: number;\\n}",
  "  currentExamId?: number;\\n  onOpenLeaderboard?: () => void;\\n}"
);

// Fix params
content = content.replace(
  "  currentExamId,\\n}) => {",
  "  currentExamId,\\n  onOpenLeaderboard,\\n}) => {"
);

fs.writeFileSync('src/components/LeftPanel.tsx', content);
