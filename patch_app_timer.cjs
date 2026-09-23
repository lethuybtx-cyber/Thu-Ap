const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Fix the timer effect
const badEffect = `  // Countdown timer interval
  useEffect(() => {
    if (isSubmitted) return;
    if (!isStarted) setIsStarted(true);

    const timer = setInterval(() => {`;

const goodEffect = `  // Countdown timer interval
  useEffect(() => {
    if (isSubmitted || !isStarted) return;

    const timer = setInterval(() => {`;

content = content.replace(badEffect, goodEffect);

// Reset timer on submit
const badSubmit = `      totalCorrectPartIII: p3Correct,
      timeSpentSeconds: timeSpent,
    };

    setTestResult(result);
    setIsSubmitted(true);
    setIsModalOpen(true);
  };`;

const goodSubmit = `      totalCorrectPartIII: p3Correct,
      timeSpentSeconds: timeSpent,
    };

    setTestResult(result);
    setIsSubmitted(true);
    setIsModalOpen(true);
    setTimeRemaining(90 * 60); // Reset timer to 90:00
  };`;

content = content.replace(badSubmit, goodSubmit);

fs.writeFileSync('src/App.tsx', content);
