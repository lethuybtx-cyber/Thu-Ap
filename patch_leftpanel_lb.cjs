const fs = require('fs');
let content = fs.readFileSync('src/components/LeftPanel.tsx', 'utf8');

const oldProps = `  examHistory: ExamRecord[];
  onSelectHistoryExam: (id: number) => void;
  currentExamId: number;
}`;

const newProps = `  examHistory: ExamRecord[];
  onSelectHistoryExam: (id: number) => void;
  currentExamId: number;
  onOpenLeaderboard?: () => void;
}`;
content = content.replace(oldProps, newProps);

const oldParams = `  isSubmitted,
  examHistory,
  onSelectHistoryExam,
  currentExamId,
}) => {`;

const newParams = `  isSubmitted,
  examHistory,
  onSelectHistoryExam,
  currentExamId,
  onOpenLeaderboard,
}) => {`;
content = content.replace(oldParams, newParams);

const wordBtn = `{/* Button 0: TẠO ĐỀ BẰNG FILE WORD */}`;

const lbBtn = `{/* Button -1: LEADERBOARD */}
          {onOpenLeaderboard && (
            <button
              onClick={onOpenLeaderboard}
              className="w-full py-2 px-3 rounded-lg font-bold text-slate-900 text-xs tracking-wider uppercase bg-gradient-to-b from-[#fde047] via-[#facc15] to-[#eab308] text-black hover:brightness-110 active:scale-95 transition-all shadow-md border border-amber-300/60 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="text-[14px]">🏆</span>
              <span>BẢNG XẾP HẠNG</span>
            </button>
          )}
          
          {/* Button 0: TẠO ĐỀ BẰNG FILE WORD */}`;

content = content.replace(wordBtn, lbBtn);
fs.writeFileSync('src/components/LeftPanel.tsx', content);
