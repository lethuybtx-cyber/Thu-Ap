import React from 'react';
import { TestResult, Question, UserAnswers } from '../types';
import { soundFx } from '../utils/sound';

interface RightPanelProps {
  questions?: Question[];
  currentQuestionId?: number;
  onSelectQuestion?: (id: number) => void;
  userAnswers?: UserAnswers;
  testResult: TestResult;
  isTeacherMode: boolean;
  isOwnerAuthenticated?: boolean;
  onOpenOwnerAuth?: () => void;
  currentExamTitle?: string;
  onOpenExamBank?: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  testResult,
  isTeacherMode,
  questions = [],
  currentQuestionId = 1,
  onSelectQuestion = (id: number) => {},
  userAnswers = {},
  isOwnerAuthenticated = false,
  onOpenOwnerAuth,
  currentExamTitle = 'Đề 1',
  onOpenExamBank,
}) => {

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
    soundFx.playClick();
    onSelectQuestion(id);
  };

  const renderGrid = (start: number, end: number, sectionType: 'PART_I' | 'PART_II' | 'PART_III') => {
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

          const relativeNum =
            sectionType === 'PART_I'
              ? qId
              : sectionType === 'PART_II'
              ? qId - 12
              : qId - 16;

          return (
            <button
              key={qId}
              onClick={() => handleQuestionClick(qId)}
              className={`relative h-8 rounded-md border flex items-center justify-center text-xs transition-all cursor-pointer font-bold ${buttonStyle}`}
              title={`Câu ${relativeNum} (${q.sectionTitle})`}
            >
              <span>{relativeNum}</span>
              {!isSelected && answered && (
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#040a1c] p-3.5 rounded-xl border border-[#1e345e] shadow-xl text-slate-100">
      <div className="flex flex-col gap-4">
        {/* Exam Info Title */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs sm:text-sm font-bold text-[#facc15] tracking-wider uppercase font-serif">
              THÔNG TIN BÀI THI
            </h2>
            {onOpenExamBank && (
              <button
                onClick={onOpenExamBank}
                className="text-[10px] bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 border border-indigo-500/50 px-2 py-0.5 rounded font-bold cursor-pointer transition-colors"
                title="Đổi đề thi khác trong ngân hàng"
              >
                Đổi đề ▾
              </button>
            )}
          </div>

          {/* Active Exam Capsule */}
          <div className="mb-2.5 px-2.5 py-1.5 rounded-lg bg-[#0a1630] border border-amber-400/50 flex items-center justify-between text-xs">
            <span className="text-amber-300 font-bold truncate flex items-center gap-1.5">
              <span>📖</span>
              <span className="truncate">{currentExamTitle}</span>
            </span>
            <span className="text-[10px] text-slate-400 shrink-0 ml-1">
              {questions.length} câu
            </span>
          </div>

          <div className="text-xs space-y-3 text-slate-200 font-medium leading-relaxed bg-[#08122c] p-3 rounded-lg border border-[#1e345e]">
            <div>
              <div className="flex items-start justify-between mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="text-[#facc15] font-bold">•</span>
                  <strong className="text-amber-300">Phần I (12 câu):</strong>
                </span>
                <span className="text-[11px] text-slate-400">Câu 1 - 12</span>
              </div>
              {questions.length > 0 && renderGrid(1, 12, 'PART_I')}
            </div>
            
            <div className="pt-2 border-t border-[#1e345e]/50">
              <div className="flex items-start justify-between mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="text-cyan-400 font-bold">•</span>
                  <strong className="text-cyan-300">Phần II (4 câu):</strong>
                </span>
                <span className="text-[11px] text-slate-400">Câu 1 - 4 (Đúng/Sai)</span>
              </div>
              {questions.length > 0 && renderGrid(13, 16, 'PART_II')}
            </div>

            <div className="pt-2 border-t border-[#1e345e]/50">
              <div className="flex items-start justify-between mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="text-rose-400 font-bold">•</span>
                  <strong className="text-rose-300">Phần III (6 câu):</strong>
                </span>
                <span className="text-[11px] text-slate-400">Câu 1 - 6 (Trả lời ngắn)</span>
              </div>
              {questions.length > 0 && renderGrid(17, 22, 'PART_III')}
            </div>
          </div>
        </div>

        {/* Result Section */}
        <div className="text-center pt-2 border-t border-[#1e345e]">
          <h3 className="text-xs sm:text-sm font-bold text-[#facc15] tracking-wider uppercase font-serif mb-2">
            KẾT QUẢ
          </h3>

          {!testResult.submitted ? (
            <p className="text-xs sm:text-sm text-slate-300 font-semibold py-2">
              Chưa nộp bài
            </p>
          ) : (
            <div className="bg-[#08122c] p-3 rounded-lg border border-emerald-500/40 text-left space-y-2">
              <div className="text-center pb-2 border-b border-slate-700/60">
                <span className="text-2xl font-black text-amber-300">
                  {testResult.score.toFixed(1)} / 10
                </span>
                <p className="text-[11px] text-emerald-400 font-bold mt-0.5">
                  Đã hoàn thành bài thi!
                </p>
              </div>
              <div className="text-xs space-y-1 text-slate-300">
                <p>
                  • Phần I: <span className="font-bold text-white">{testResult.totalCorrectPartI}/12</span> câu
                </p>
                <p>
                  • Phần II: <span className="font-bold text-white">{testResult.totalCorrectPartII}/4</span> câu
                </p>
                <p>
                  • Phần III: <span className="font-bold text-white">{testResult.totalCorrectPartIII}/6</span> câu
                </p>
                <p className="pt-1.5 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                  <span>Rời màn hình:</span>
                  {testResult.violationCount === 0 ? (
                    <span className="text-emerald-400 font-bold">0 lần (Chuẩn)</span>
                  ) : (
                    <span className="text-rose-400 font-bold">⚠️ {testResult.violationCount} lần vi phạm</span>
                  )}
                </p>
              </div>
            </div>
          )}

          {isTeacherMode && (
            <div className="mt-3 p-2 bg-indigo-950/70 border border-indigo-500/40 rounded text-left">
              <span className="text-[11px] font-bold text-indigo-300 uppercase block mb-0.5">
                Chế độ Giáo Viên Active:
              </span>
              <p className="text-[11px] text-slate-300 leading-tight">
                Đang hiển thị đáp án chi tiết và hướng dẫn giải cho tất cả câu hỏi.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Developer / Owner Info at Bottom Right (Clickable for owner login) */}
      <div 
        onClick={onOpenOwnerAuth}
        className="pt-4 border-t border-[#1e345e] text-right text-slate-300 text-[11px] font-medium leading-tight space-y-0.5 cursor-pointer select-none hover:text-amber-300 transition-colors"
        title={isOwnerAuthenticated ? "Quản lý quyền Chủ Tài Khoản: Lê Thủy" : "Chủ tài khoản: Lê Thủy - Ôn thi 2027"}
      >
        <p className="font-bold text-slate-200 hover:text-amber-300 flex items-center justify-end gap-1">
          {isOwnerAuthenticated && <span className="text-xs">👑</span>}
          <span>Chủ tài khoản: Lê Thủy</span>
        </p>
        <p className="text-slate-400">Ôn thi THPT 2027</p>
      </div>
    </div>
  );
};
