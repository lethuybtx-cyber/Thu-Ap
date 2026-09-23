import React, { useEffect } from 'react';
import { TestResult } from '../types';
import { fireSubmissionConfetti } from '../utils/confetti';
import { soundFx } from '../utils/sound';
import { Sparkles } from 'lucide-react';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: TestResult;
  onReview: () => void;
  onRestart: () => void;
  onSaveScore: (name: string) => void;
  currentExamTitle?: string;
  hasGoogleSheetSynced?: boolean;
}

export const SubmitModal: React.FC<SubmitModalProps> = ({
  isOpen,
  onClose,
  result,
  onReview,
  onRestart,
  onSaveScore,
  currentExamTitle = 'Đề 1',
  hasGoogleSheetSynced = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      fireSubmissionConfetti(result.score);
    }
  }, [isOpen, result.score]);

  if (!isOpen) return null;

  const minutes = Math.floor(result.timeSpentSeconds / 60);
  const seconds = result.timeSpentSeconds % 60;

  const handleReplayFireworks = () => {
    soundFx.playCelebration();
    fireSubmissionConfetti(result.score);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#0a1228] border-2 border-amber-400/80 rounded-xl p-5 shadow-2xl text-slate-100 flex flex-col gap-4 animate-in fade-in zoom-in duration-200 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center border-b border-slate-700/80 pb-3 relative">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#facc15] font-serif uppercase tracking-wider block">
              KẾT QUẢ BÀI THI
            </span>
            <button
              onClick={handleReplayFireworks}
              title="Bắn pháo hoa ăn mừng"
              className="p-1.5 rounded-full bg-amber-400/20 text-amber-300 hover:bg-amber-400 hover:text-black transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-sm"
            >
              <Sparkles size={18} className="animate-spin-slow" />
            </button>
          </div>
          <div className="mt-1 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#0d1e44] border border-amber-400/60 text-amber-300 text-xs font-bold">
            <span>📖 Đề thi:</span>
            <span className="text-white font-extrabold">{currentExamTitle}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 uppercase font-semibold">
            ÔN THI TỐT NGHIỆP THPT MÔN TOÁN 2027
          </p>
        </div>

        {/* Score Display */}
        <div className="flex flex-col items-center justify-center bg-[#050a18] p-4 rounded-lg border border-amber-400/40 shadow-inner relative group">
          <span className="text-4xl font-extrabold text-[#facc15] tracking-tight drop-shadow-[0_0_12px_rgba(250,204,21,0.4)]">
            {result.score.toFixed(1)} / 10
          </span>
          <p className="text-xs text-emerald-400 font-bold mt-1">
            Thời gian làm bài: {minutes} phút {seconds} giây
          </p>
          <button
            onClick={handleReplayFireworks}
            className="mt-2 text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1 underline underline-offset-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <span>🎉 Bắn lại pháo hoa ăn mừng</span>
          </button>
        </div>

        {/* Section Stats Breakdown */}
        <div className="bg-[#0f1a36] p-3 rounded-lg border border-[#1e345e] space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between items-center text-slate-200">
            <span>Phần I (Trắc nghiệm 12 câu):</span>
            <span className="font-bold text-amber-300">
              {result.totalCorrectPartI} / 12 đúng ({result.partIScore.toFixed(2)} điểm)
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-200">
            <span>Phần II (Đúng/Sai 4 câu):</span>
            <span className="font-bold text-amber-300">
              {result.totalCorrectPartII} / 4 đúng ({result.partIIScore.toFixed(2)} điểm)
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-200">
            <span>Phần III (Trả lời ngắn 6 câu):</span>
            <span className="font-bold text-amber-300">
              {result.totalCorrectPartIII} / 6 đúng ({result.partIIIScore.toFixed(2)} điểm)
            </span>
          </div>

          {/* Anti-cheat Proctoring Status */}
          <div className="pt-2 border-t border-slate-700/60 flex justify-between items-center">
            <span className="text-slate-300 flex items-center gap-1.5">
              <span>🛡️</span>
              <span>Giám sát rời màn hình / chuyển tab:</span>
            </span>
            {result.violationCount === 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/60 text-[11px] font-bold">
                0 lần (Trung thực)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-500/80 text-[11px] font-bold animate-pulse">
                ⚠️ {result.violationCount} lần vi phạm
              </span>
            )}
          </div>

          {/* Google Sheet Sync Status */}
          {hasGoogleSheetSynced && (
            <div className="pt-2 border-t border-slate-700/60 flex justify-between items-center text-xs">
              <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                <span>📊</span>
                <span>Trang tính Google:</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 text-[11px] font-bold flex items-center gap-1">
                <span>✓</span>
                <span>Đã gửi vào Google Sheet</span>
              </span>
            </div>
          )}
        </div>

        {/* Modal Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <button
            onClick={() => {
              onReview();
              onClose();
            }}
            className="py-2.5 px-3 rounded-lg font-bold text-[#0f172a] text-xs uppercase bg-gradient-to-b from-[#fde047] to-[#eab308] hover:brightness-110 active:scale-95 transition-all shadow cursor-pointer"
          >
            XEM CHI TIẾT ĐÁP ÁN
          </button>

          <button
            onClick={() => {
              onRestart();
              onClose();
            }}
            className="py-2.5 px-3 rounded-lg font-bold text-white text-xs uppercase bg-gradient-to-b from-[#f43f5e] to-[#be123c] hover:brightness-110 active:scale-95 transition-all shadow cursor-pointer"
          >
            THI LẠI TỪ ĐẦU
          </button>
        </div>
      </div>
    </div>
  );
};
