const fs = require('fs');
let content = fs.readFileSync('src/components/LeftPanel.tsx', 'utf8');

content = content.replace("currentExamId?: number;\n}", "currentExamId?: number;\n  onOpenLeaderboard?: () => void;\n}");

content = content.replace("currentExamId,\n}) => {", "currentExamId,\n  onOpenLeaderboard,\n}) => {");

fs.writeFileSync('src/components/LeftPanel.tsx', content);
