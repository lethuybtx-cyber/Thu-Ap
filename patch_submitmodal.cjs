const fs = require('fs');
let content = fs.readFileSync('src/components/SubmitModal.tsx', 'utf8');

// Add user name input for leaderboard
const interfaceChange = `interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: TestResult;
  onReview: () => void;
  onRestart: () => void;
  onSaveScore: (name: string) => void;
}`;

content = content.replace(
  "interface SubmitModalProps {\n  isOpen: boolean;\n  onClose: () => void;\n  result: TestResult;\n  onReview: () => void;\n  onRestart: () => void;\n}",
  interfaceChange
);

const componentChange = `export const SubmitModal: React.FC<SubmitModalProps> = ({
  isOpen,
  onClose,
  result,
  onReview,
  onRestart,
  onSaveScore,
}) => {
  const [playerName, setPlayerName] = React.useState('');
  const [saved, setSaved] = React.useState(false);

  if (!isOpen) return null;`;

content = content.replace(
  `export const SubmitModal: React.FC<SubmitModalProps> = ({
  isOpen,
  onClose,
  result,
  onReview,
  onRestart,
}) => {
  if (!isOpen) return null;`,
  componentChange
);

const buttonsChange = `        {/* Leaderboard Save */}
        {!saved ? (
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Nhập tên của bạn..." 
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="flex-1 bg-[#0a1228] border border-[#1e345e] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              maxLength={20}
            />
            <button 
              onClick={() => {
                if (playerName.trim()) {
                  onSaveScore(playerName.trim());
                  setSaved(true);
                }
              }}
              disabled={!playerName.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold px-4 rounded text-xs transition"
            >
              LƯU ĐIỂM
            </button>
          </div>
        ) : (
          <div className="text-center text-emerald-400 font-bold text-sm bg-emerald-950/30 py-2 border border-emerald-500/30 rounded">
            Đã lưu điểm thành công!
          </div>
        )}

        {/* Modal Buttons */}`;

content = content.replace("{/* Modal Buttons */}", buttonsChange);

fs.writeFileSync('src/components/SubmitModal.tsx', content);
