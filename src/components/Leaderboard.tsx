import React from 'react';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  isOpen: boolean;
  onClose: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#0a1228] border-2 border-amber-400/80 rounded-xl p-5 shadow-2xl text-slate-100 flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center border-b border-slate-700/80 pb-3">
          <h2 className="text-xl font-black text-[#facc15] font-serif uppercase tracking-wider">
            BẢNG XẾP HẠNG (TOP 10)
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
          {entries.length === 0 ? (
            <div className="text-center text-slate-400 py-4 italic text-sm">Chưa có dữ liệu xếp hạng.</div>
          ) : (
            entries.map((entry, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  idx === 0 
                    ? 'bg-amber-900/40 border-amber-500/50' 
                    : idx === 1 
                      ? 'bg-slate-800/80 border-slate-400/40' 
                      : idx === 2 
                        ? 'bg-orange-950/40 border-orange-700/50' 
                        : 'bg-[#0f1a36] border-[#1e345e]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                    idx === 0 ? 'bg-amber-400 text-black' :
                    idx === 1 ? 'bg-slate-300 text-black' :
                    idx === 2 ? 'bg-orange-500 text-white' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex flex-col">
                    <div className="font-bold text-sm sm:text-base flex items-center gap-1.5 flex-wrap">
                      <span>{entry.playerName}</span>
                      {idx === 0 && <span className="text-amber-400">⭐</span>}
                      {entry.violationCount !== undefined && entry.violationCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 border border-rose-600/80 font-normal">
                          ⚠️ {entry.violationCount} vi phạm
                        </span>
                      )}
                    </div>
                    {entry.className && (
                      <div className="text-[10px] text-slate-400">
                        Lớp: {entry.className}
                      </div>
                    )}
                    {entry.examTitle && (
                      <div className="text-[10px] text-amber-300/80 font-medium">
                        📖 {entry.examTitle}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-amber-400 font-bold text-sm sm:text-base">{entry.score.toFixed(1)} đ</div>
                  <div className="text-[10px] text-slate-400">
                    {Math.floor(entry.timeSpentSeconds / 60)}p {entry.timeSpentSeconds % 60}s
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-2 py-2 rounded-lg font-bold text-white text-xs uppercase bg-slate-700 hover:bg-slate-600 transition-all cursor-pointer"
        >
          ĐÓNG
        </button>
      </div>
    </div>
  );
};
