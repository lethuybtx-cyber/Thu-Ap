import React from 'react';
import { BookOpen } from 'lucide-react';

interface HeaderProps {
  currentExamTitle?: string;
  totalQuestions?: number;
  onOpenExamBank?: () => void;
  examCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentExamTitle = 'Đề 1',
  totalQuestions = 22,
  onOpenExamBank,
  examCount = 1,
}) => {
  return (
    <div className="relative w-full py-2.5 sm:py-3 px-3 sm:px-4 flex flex-col items-center justify-center border-b border-[#1e2d4a]/80 bg-[#070e22]">
      {/* Top Left Logo */}
      <div className="absolute left-3 sm:left-4 top-3 sm:top-3.5 flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 drop-shadow">
          <path
            fill="currentColor"
            d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
            className="fill-amber-400"
          />
          <path
            fill="currentColor"
            d="M12 4L13.5 10.5L20 12L13.5 13.5L12 20L10.5 13.5L4 12L10.5 10.5L12 4Z"
            className="fill-cyan-300"
          />
        </svg>
        <span className="text-[11px] sm:text-xs font-semibold text-slate-300 hidden md:inline tracking-wider">
          Gemini
        </span>
      </div>

      {/* Top Right Quick Exam Bank Button */}
      {onOpenExamBank && (
        <div className="absolute right-3 sm:right-4 top-2.5 sm:top-3">
          <button
            onClick={onOpenExamBank}
            className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-gradient-to-b from-[#6366f1] to-[#4338ca] text-white text-[11px] sm:text-xs font-bold flex items-center gap-1.5 border border-indigo-400/60 hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
            title="Mở Ngân hàng đề để chọn hoặc đổi đề thi"
          >
            <BookOpen size={13} className="text-amber-300" />
            <span className="hidden sm:inline">NGÂN HÀNG ĐỀ</span>
            <span className="bg-amber-400 text-slate-950 px-1 py-0.2 rounded text-[10px] font-black">
              {examCount}
            </span>
          </button>
        </div>
      )}

      {/* Main Center Titles */}
      <div className="text-center flex flex-col items-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wider text-[#facc15] font-serif uppercase drop-shadow-[0_2px_8px_rgba(250,204,21,0.3)]">
          AI LÀ TRIỆU PHÚ TOÁN HỌC
        </h1>
        <p className="text-[11px] sm:text-xs md:text-sm font-semibold tracking-wide text-slate-300 mt-0.5 uppercase">
          ÔN THI TỐT NGHIỆP THPT MÔN TOÁN 2025
        </p>

        {/* Current Active Exam Pill */}
        {onOpenExamBank ? (
          <button
            onClick={onOpenExamBank}
            className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full bg-[#0d1e44] border border-amber-400/70 text-amber-300 text-[11px] sm:text-xs font-bold hover:bg-[#142d66] hover:border-amber-300 transition-all cursor-pointer shadow-[0_0_10px_rgba(250,204,21,0.2)] max-w-[90vw] truncate"
            title="Nhấn để xem danh sách & chọn đề thi khác"
          >
            <span>📖 Đang chọn:</span>
            <span className="text-white font-extrabold underline decoration-amber-400/60 truncate">
              {currentExamTitle}
            </span>
            <span className="text-[10px] text-slate-400">({totalQuestions} câu)</span>
            <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-black">
              ĐỔI ĐỀ
            </span>
          </button>
        ) : (
          <div className="mt-1 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#0d1e44] border border-amber-400/50 text-amber-300 text-xs font-bold">
            <span>📖 {currentExamTitle}</span>
            <span className="text-[10px] text-slate-400">({totalQuestions} câu)</span>
          </div>
        )}
      </div>
    </div>
  );
};

