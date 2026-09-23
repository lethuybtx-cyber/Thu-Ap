const fs = require('fs');
let content = fs.readFileSync('src/components/LeftPanel.tsx', 'utf8');

const regex = /\{\/\* Question List Title \*\/\}[\s\S]*?<\/div>\s*\{\/\* 4-column Grid for Questions \*\/\}[\s\S]*?<\/div>/;
content = content.replace(regex, '');

fs.writeFileSync('src/components/LeftPanel.tsx', content);
