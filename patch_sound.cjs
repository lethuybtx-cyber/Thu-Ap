const fs = require('fs');
let content = fs.readFileSync('src/utils/sound.ts', 'utf8');

// Correct sound
content = content.replace(
  "gain.gain.linearRampToValueAtTime(0.25, now + index * 0.08 + 0.02);",
  "gain.gain.linearRampToValueAtTime(1.0, now + index * 0.08 + 0.02);"
);
// Incorrect sound
content = content.replace(
  "gain.gain.linearRampToValueAtTime(0.2, now + index * 0.12 + 0.02);",
  "gain.gain.linearRampToValueAtTime(1.0, now + index * 0.12 + 0.02);"
);

fs.writeFileSync('src/utils/sound.ts', content);
