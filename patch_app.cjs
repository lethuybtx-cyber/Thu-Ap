const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Fix isStarted blocking answers
content = content.replace("if (isSubmitted || !isStarted) return;", "if (isSubmitted) return;\n    if (!isStarted) setIsStarted(true);");
content = content.replace("if (isSubmitted || !isStarted) return;", "if (isSubmitted) return;\n    if (!isStarted) setIsStarted(true);"); // Part II
content = content.replace("if (isSubmitted || !isStarted) return;", "if (isSubmitted) return;\n    if (!isStarted) setIsStarted(true);"); // Part III

fs.writeFileSync('src/App.tsx', content);
