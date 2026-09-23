const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Imports
content = content.replace(
  "import { SubmitModal } from './components/SubmitModal';",
  "import { SubmitModal } from './components/SubmitModal';\nimport { Leaderboard } from './components/Leaderboard';\nimport { LeaderboardEntry } from './types';"
);

// State hooks
content = content.replace(
  "const [isModalOpen, setIsModalOpen] = useState(false);",
  "const [isModalOpen, setIsModalOpen] = useState(false);\n  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);\n  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {\n    try {\n      const saved = localStorage.getItem('quiz_leaderboard');\n      if (saved) return JSON.parse(saved);\n    } catch (e) {}\n    return [];\n  });"
);

// handleSaveScore function
const helperFunctions = `  const handleSaveScore = (playerName: string) => {
    const entry: LeaderboardEntry = {
      playerName,
      score: testResult.score,
      timeSpentSeconds: testResult.timeSpentSeconds,
      date: Date.now()
    };
    
    setLeaderboard(prev => {
      const newList = [...prev, entry].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.timeSpentSeconds - b.timeSpentSeconds; // lower time is better
      }).slice(0, 10);
      
      try {
        localStorage.setItem('quiz_leaderboard', JSON.stringify(newList));
      } catch(e) {}
      
      return newList;
    });
  };

  // Reset Test for SubmitModal`;

content = content.replace("  // Reset Test for SubmitModal", helperFunctions);

// Add Leaderboard modal rendering
content = content.replace(
  "      {/* Word File Import Modal */}",
  `      <Leaderboard 
        isOpen={isLeaderboardOpen} 
        onClose={() => setIsLeaderboardOpen(false)} 
        entries={leaderboard} 
      />\n\n      {/* Word File Import Modal */}`
);

// Update LeftPanel usage
content = content.replace(
  "            currentExamId={currentExamId}",
  "            currentExamId={currentExamId}\n            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}"
);

// Update SubmitModal usage
content = content.replace(
  "        onRestart={handleReset}",
  "        onRestart={handleReset}\n        onSaveScore={handleSaveScore}"
);

fs.writeFileSync('src/App.tsx', content);
