import React, { useState, useEffect } from 'react';
import { Maximize, Minimize, ShieldCheck, Lock, KeyRound, LogOut } from 'lucide-react';
import { UserAnswers, ExamRecord, Question } from '../types';

interface LeftPanelProps {
  currentQuestionId: number;
  onSelectQuestion: (id: number) => void;
  timeRemainingSeconds: number;
  onSubmit: () => void;
  onStart?: () => void;
  isStarted?: boolean;
  onToggleFullscreen: () => void;
  onToggleTeacherMode: () => void;
  isTeacherMode: boolean;
  onToggleSound?: () => void;
  isSoundEnabled?: boolean;
  onOpenWordImport: () => void;
  onOpenExamBank?: () => void;
  currentExamTitle?: string;
  userAnswers: UserAnswers;
  questions: Question[];
  isSubmitted: boolean;
  examHistory?: ExamRecord[];
  onSelectHistoryExam?: (exam: ExamRecord) => void;
  currentExamId?: number;
  onOpenLeaderboard?: () => void;
  isOwnerAuthenticated?: boolean;
  onOpenOwnerAuth?: () => void;
  onLogoutOwner?: () => void;
  violationCount?: number;
  onOpenViolationLogs?: () => void;
  onOpenGoogleSheet?: () => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  currentQuestionId,
  onSelectQuestion,
  timeRemainingSeconds,
  onSubmit,
  onStart,
  isStarted = true,
  onToggleFullscreen,
  onToggleTeacherMode,
  isTeacherMode,
  onToggleSound,
  isSoundEnabled = true,
  onOpenWordImport,
  onOpenExamBank,
  currentExamTitle = 'Đề 1',
  userAnswers,
  questions,
  isSubmitted = false,
  examHistory = [],
  onSelectHistoryExam,
  currentExamId,
  onOpenLeaderboard,
  isOwnerAuthenticated = false,
  onOpenOwnerAuth,
  onLogoutOwner,
  violationCount = 0,
  onOpenViolationLogs,
  onOpenGoogleSheet,
}) => {
  const [showHistory, setShowHistory] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Format seconds to MM:SS
  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#040a1c] p-3.5 rounded-xl border border-[#1e345e] shadow-xl text-slate-100">
      <div className="flex flex-col gap-3">
        {/* Top bar with Fullscreen & Owner Status Badge */}
        <div className="flex items-center justify-between text-slate-300">
          <button 
            onClick={onToggleFullscreen} 
            className="p-1.5 rounded-lg bg-[#0f172a] border border-[#1e345e] hover:bg-[#1e345e] hover:text-amber-400 transition-colors shadow-sm cursor-pointer"
            title={isFullscreen ? "Thu nhỏ màn hình" : "Toàn màn hình"}
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>

          {/* Owner Quick Status Badge (ONLY visible when authenticated as owner) */}
          {isOwnerAuthenticated && (
            <button
              onClick={onOpenOwnerAuth}
              className="px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-400 text-amber-300 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-400/30 transition cursor-pointer shadow-[0_0_8px_rgba(250,204,21,0.3)] animate-pulse"
              title="Quản lý quyền Chủ Tài Khoản"
            >
              <span>👑</span>
              <span>Chủ Tài Khoản</span>
            </button>
          )}
        </div>

        {/* Title & Active Exam Capsule */}
        <div className="text-center">
          <h2 className="text-xs sm:text-sm font-bold text-[#facc15] tracking-wider uppercase font-serif">
            BẢNG ĐIỀU KHIỂN
          </h2>
          {/* Active Exam Pill (Clickable to open Exam Bank) */}
          <button
            onClick={onOpenExamBank}
            className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0d1e44] border border-amber-400/60 text-amber-300 text-[11px] font-bold hover:bg-[#142d66] transition cursor-pointer max-w-full truncate"
            title="Nhấn để đổi đề thi trong Ngân Hàng Đề"
          >
            <span>📖</span>
            <span className="truncate">{currentExamTitle}</span>
          </button>
        </div>

        {/* Countdown Timer Display Box */}
        <div className="w-full bg-[#030712] border-2 border-amber-400/80 rounded-lg py-2 px-3 flex justify-center items-center shadow-inner">
          <span className="text-2xl font-black text-[#facc15] font-mono tracking-widest drop-shadow">
            {formattedTime}
          </span>
        </div>

        {/* Vertical Action Buttons */}
        <div className="flex flex-col gap-2">
          {/* Button: TẠO ĐỀ BẰNG FILE WORD (Hiển thị nổi bật trên Bảng điều khiển) */}
          {onOpenWordImport && (
            <button
              onClick={onOpenWordImport}
              className="w-full py-2.5 px-3 rounded-lg font-bold text-white text-xs tracking-wider uppercase bg-gradient-to-b from-[#0284c7] via-[#0369a1] to-[#075985] hover:from-[#38bdf8] hover:via-[#0284c7] hover:to-[#0369a1] active:scale-95 transition-all shadow-md border border-sky-400/60 cursor-pointer flex items-center justify-center gap-2 group"
              title="Tải lên file Word (.docx), PDF hoặc dán văn bản để tạo đề thi mới"
            >
              <span className="bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded text-[10px] font-black tracking-normal shadow-sm group-hover:scale-105 transition-transform">
                WORD / PDF
              </span>
              <span>TẠO ĐỀ BẰNG FILE WORD</span>
            </button>
          )}

          {/* Button: NGÂN HÀNG ĐỀ (Cho tất cả người chơi tự chọn đề) */}
          {onOpenExamBank && (
            <button
              onClick={onOpenExamBank}
              className="w-full py-2 px-3 rounded-lg font-bold text-white text-xs tracking-wider uppercase bg-gradient-to-b from-[#6366f1] via-[#4f46e5] to-[#3730a3] hover:brightness-110 active:scale-95 transition-all shadow-md border border-indigo-400/50 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="text-[14px]">📚</span>
              <span>NGÂN HÀNG ĐỀ ({examHistory.length})</span>
            </button>
          )}

          {/* Button: LEADERBOARD */}
          {onOpenLeaderboard && (
            <button
              onClick={onOpenLeaderboard}
              className="w-full py-2 px-3 rounded-lg font-bold text-slate-900 text-xs tracking-wider uppercase bg-gradient-to-b from-[#fde047] via-[#facc15] to-[#eab308] text-black hover:brightness-110 active:scale-95 transition-all shadow-md border border-amber-300/60 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="text-[14px]">🏆</span>
              <span>BẢNG XẾP HẠNG</span>
            </button>
          )}

          {/* Button: BẮT ĐẦU / KẾT THÚC BÀI THI */}
          {!isStarted ? (
            <button
              onClick={onStart}
              className="w-full py-2 px-3 rounded-lg font-bold text-white text-xs tracking-wider uppercase bg-gradient-to-b from-[#22c55e] via-[#16a34a] to-[#15803d] hover:brightness-110 active:scale-95 transition-all shadow-md border border-emerald-400/50 cursor-pointer"
            >
              BẮT ĐẦU LÀM BÀI
            </button>
          ) : (
            <button
              onClick={onSubmit}
              className="w-full py-2 px-3 rounded-lg font-bold text-white text-xs tracking-wider uppercase bg-gradient-to-b from-[#f97316] via-[#ea580c] to-[#c2410c] hover:brightness-110 active:scale-95 transition-all shadow-md border border-orange-400/50 cursor-pointer"
            >
              KẾT THÚC BÀI THI
            </button>
          )}

          {/* ÂM THANH BẬT / TẮT */}
          {onToggleSound && (
            <button
              onClick={onToggleSound}
              className={`w-full py-2 px-3 rounded-lg font-bold text-white text-xs tracking-wider uppercase bg-gradient-to-b ${
                isSoundEnabled
                  ? 'from-[#06b6d4] via-[#0891b2] to-[#0e7490] border-cyan-300/60'
                  : 'from-[#475569] via-[#334155] to-[#1e293b] border-slate-600'
              } hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5`}
            >
              <span>{isSoundEnabled ? '🔊 ÂM THANH: BẬT' : '🔇 ÂM THANH: TẮT'}</span>
            </button>
          )}

          {/* GIÁM SÁT THI / ANTI-CHEAT STATUS */}
          {isStarted && !isSubmitted && !isTeacherMode && (
            <div
              className={`w-full py-2 px-2.5 rounded-lg border text-[11px] font-bold flex items-center justify-between transition-all ${
                violationCount === 0
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/70 border-rose-500 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.4)] animate-pulse'
              }`}
            >
              <span className="flex items-center gap-1.5 truncate">
                <span className="text-sm">{violationCount === 0 ? '🛡️' : '🚨'}</span>
                <span className="truncate">
                  {violationCount === 0 ? 'Giám sát: An toàn' : `Vi phạm: ${violationCount} lần`}
                </span>
              </span>
              {violationCount > 0 && onOpenViolationLogs && (
                <button
                  onClick={onOpenViolationLogs}
                  className="text-[10px] bg-rose-800/80 hover:bg-rose-700 px-1.5 py-0.5 rounded text-white border border-rose-400/60 font-semibold cursor-pointer shrink-0 ml-1"
                >
                  Xem
                </button>
              )}
            </div>
          )}

          {/* OWNER EXCLUSIVE SECTION: ONLY VISIBLE & USABLE BY OWNER */}
          {isOwnerAuthenticated && (
            <div className="flex flex-col gap-2 pt-1 border-t border-amber-400/30">
              <div className="bg-amber-500/10 border border-amber-400/30 rounded-lg p-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
                  <span>👑</span>
                  <span>KHU VỰC LÊ THỦY</span>
                </div>
                <button
                  onClick={onOpenOwnerAuth}
                  className="text-[10px] text-slate-300 hover:text-amber-300 underline cursor-pointer"
                  title="Quản lý / Đổi mã PIN"
                >
                  Cài đặt
                </button>
              </div>

              {/* TẠO ĐỀ BẰNG FILE WORD / PDF (ONLY OWNER) */}
              <button
                onClick={onOpenWordImport}
                className="w-full py-2 px-3 rounded-lg font-bold text-xs tracking-wider uppercase bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] text-white hover:brightness-110 active:scale-95 transition-all shadow-md border border-sky-300/60 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="bg-amber-400 text-slate-900 px-1 rounded text-[10px] font-black">WORD/PDF</span>
                <span>NẠP ĐỀ WORD / PDF (3 PHẦN)</span>
              </button>

              {/* CHẾ ĐỘ GIÁO VIÊN (ONLY OWNER) */}
              <button
                onClick={onToggleTeacherMode}
                className={`w-full py-2 px-3 rounded-lg font-bold text-white text-xs tracking-wider uppercase bg-gradient-to-b ${
                  isTeacherMode
                    ? 'from-[#818cf8] via-[#6366f1] to-[#4f46e5] border-indigo-300 ring-2 ring-indigo-400'
                    : 'from-[#64748b] via-[#475569] to-[#334155] border-slate-400/40'
                } hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer`}
              >
                {isTeacherMode ? 'GIÁO VIÊN: BẬT' : 'CHẾ ĐỘ GIÁO VIÊN'}
              </button>

              {/* KẾT NỐI GOOGLE SHEET (ONLY OWNER) */}
              {onOpenGoogleSheet && (
                <button
                  onClick={onOpenGoogleSheet}
                  className="w-full py-2 px-3 rounded-lg font-bold text-white text-xs tracking-wider uppercase bg-gradient-to-b from-[#10b981] via-[#059669] to-[#047857] hover:brightness-110 active:scale-95 transition-all shadow-md border border-emerald-400/60 cursor-pointer flex items-center justify-center gap-1.5"
                  title="Cấu hình gửi điểm thi tự động lên Google Sheet bằng Apps Script"
                >
                  <span className="text-sm">📊</span>
                  <span>KẾT NỐI GOOGLE SHEET</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Quick Exam Switcher in LeftPanel */}
        {examHistory.length > 0 && (
          <div className="mt-1 flex flex-col gap-1.5 border-t border-[#1e345e] pt-2.5">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full py-1.5 px-3 rounded text-xs font-bold bg-[#0a1630] border border-[#1e345e] text-[#facc15] hover:bg-[#12244a] hover:text-white transition flex justify-between items-center cursor-pointer"
            >
              <span>DANH SÁCH ĐỀ ({examHistory.length})</span>
              <span>{showHistory ? '▲' : '▼'}</span>
            </button>
            {showHistory && (
              <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                {examHistory.map((exam) => (
                  <button
                    key={exam.id}
                    onClick={() => onSelectHistoryExam?.(exam)}
                    className={`text-left px-2 py-1.5 rounded text-[11px] transition-colors border cursor-pointer ${
                      currentExamId === exam.id
                        ? 'bg-amber-400/20 text-amber-300 border-amber-500/50 font-bold shadow-[0_0_8px_rgba(250,204,21,0.2)]'
                        : 'bg-[#0a1630] text-slate-400 border-[#1e345e] hover:bg-[#12244a] hover:text-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="truncate">{exam.title}</span>
                      <span className="text-[9px] opacity-70 flex-shrink-0 ml-1">
                        {new Date(exam.timestamp).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="text-[9px] opacity-60">
                      {exam.questions.length} câu hỏi
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
