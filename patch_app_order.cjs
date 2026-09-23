const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Change grid layout to use order classes
content = content.replace(
  '<div className="lg:col-span-3 w-full flex">\\n          <LeftPanel',
  '<div className="lg:col-span-3 w-full flex order-2 lg:order-1">\\n          <LeftPanel'
);

content = content.replace(
  '<div className="lg:col-span-6 w-full flex">\\n          {currentQuestion && (\\n            <MiddlePanel',
  '<div className="lg:col-span-6 w-full flex order-1 lg:order-2">\\n          {currentQuestion && (\\n            <MiddlePanel'
);

content = content.replace(
  '<div className="lg:col-span-3 w-full flex">\\n          <RightPanel',
  '<div className="lg:col-span-3 w-full flex order-3 lg:order-3">\\n          <RightPanel'
);

fs.writeFileSync('src/App.tsx', content);
