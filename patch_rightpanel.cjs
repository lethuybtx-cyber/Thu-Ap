const fs = require('fs');
let content = fs.readFileSync('src/components/RightPanel.tsx', 'utf8');

// Update imports and interface
content = content.replace("import { TestResult } from '../types';", "import { TestResult, Question, UserAnswers } from '../types';\nimport { soundFx } from '../utils/sound';");
content = content.replace(
  "interface RightPanelProps {",
  `interface RightPanelProps {
  questions?: Question[];
  currentQuestionId?: number;
  onSelectQuestion?: (id: number) => void;
  userAnswers?: UserAnswers;`
);

content = content.replace(
  "export const RightPanel: React.FC<RightPanelProps> = ({ testResult, isTeacherMode }) => {",
  "export const RightPanel: React.FC<RightPanelProps> = ({ testResult, isTeacherMode, questions = [], currentQuestionId = 1, onSelectQuestion = () => {}, userAnswers = {} }) => {"
);

// Add helper function
const helper = `
  // Check if question is answered
  const isQuestionAnswered = (id: number) => {
    const ans = userAnswers[id];
    if (!ans) return false;
    if (ans.partI !== undefined) return true;
    if (ans.partII && Object.keys(ans.partII).length > 0) return true;
    if (ans.partIII !== undefined && ans.partIII.trim() !== '') return true;
    return false;
  };

  const handleQuestionClick = (id: number) => {
    soundFx.playCorrect(); // Or just a generic click sound if we had one. Let's just call onSelectQuestion and maybe play a click sound. Actually, playCorrect is too celebratory. We can just play a short beep if needed, but let's just trigger onSelectQuestion.
    onSelectQuestion(id);
  };

  const renderGrid = (start: number, end: number) => {
    const gridQs = questions.filter(q => q.id >= start && q.id <= end);
    return (
      <div className="grid grid-cols-4 gap-1.5 mt-2">
        {gridQs.map((q) => {
          const qId = q.id;
          const isSelected = qId === currentQuestionId;
          const answered = isQuestionAnswered(qId);
          let buttonStyle = 'bg-[#0a1630] text-slate-200 border-[#1e345e] hover:bg-[#12244a]';

          if (isSelected) {
            buttonStyle = 'bg-[#facc15] text-[#0f172a] font-extrabold ring-2 ring-amber-300 border-amber-400 shadow-[0_0_10px_rgba(250,204,21,0.5)] animate-pulse';
          } else if (answered) {
            buttonStyle = 'bg-[#10284e] text-emerald-300 border-emerald-500/60 font-bold';
          }

          return (
            <button
              key={qId}
              onClick={() => handleQuestionClick(qId)}
              className={\`relative h-8 rounded-md border flex items-center justify-center text-xs transition-all cursor-pointer font-bold \${buttonStyle}\`}
            >
              <span>{qId}</span>
              {!isSelected && answered && (
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          );
        })}
      </div>
    );
  };
`;

content = content.replace("  return (", helper + "\n  return (");

const replacement = `
          <div className="text-xs space-y-3 text-slate-200 font-medium leading-relaxed bg-[#08122c] p-3 rounded-lg border border-[#1e345e]">
            <div>
              <div className="flex items-start gap-1.5 mb-1">
                <span className="text-[#facc15] font-bold">•</span>
                <span><strong className="text-white">Phần I:</strong> 12 câu trắc nghiệm</span>
              </div>
              {questions.length > 0 && renderGrid(1, 12)}
            </div>
            
            <div className="pt-2 border-t border-[#1e345e]/50">
              <div className="flex items-start gap-1.5 mb-1">
                <span className="text-[#facc15] font-bold">•</span>
                <span><strong className="text-white">Phần II:</strong> 4 câu Đúng / Sai</span>
              </div>
              {questions.length > 0 && renderGrid(13, 16)}
            </div>

            <div className="pt-2 border-t border-[#1e345e]/50">
              <div className="flex items-start gap-1.5 mb-1">
                <span className="text-[#facc15] font-bold">•</span>
                <span><strong className="text-white">Phần III:</strong> 6 câu trả lời ngắn</span>
              </div>
              {questions.length > 0 && renderGrid(17, 22)}
            </div>
          </div>
`;

content = content.replace(
  /<ul className="text-xs space-y-2 text-slate-200 font-medium leading-relaxed bg-\[#08122c\] p-3 rounded-lg border border-\[#1e345e\]">[\s\S]*?<\/ul>/,
  replacement.trim()
);

fs.writeFileSync('src/components/RightPanel.tsx', content);
