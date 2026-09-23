import React from 'react';
import { AlertTriangle, ShieldAlert, Clock, ArrowRight } from 'lucide-react';
import { ViolationLog } from '../types';

interface ViolationWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  violationCount: number;
  latestViolationReason: string;
  violationLogs: ViolationLog[];
}

export const ViolationWarningModal: React.FC<ViolationWarningModalProps> = ({
  isOpen,
  onClose,
  violationCount,
  latestViolationReason,
  violationLogs,
}) => {
  if (!isOpen) return null;

  const getSeverityInfo = (count: number) => {
    if (count === 1) {
      return {
        level: 'Nhắc nhở lần 1',
        textColor: 'text-amber-400',
        borderColor: 'border-amber-500',
        bgColor: 'bg-amber-950/50',
        message:
          'Vui lòng tập trung làm bài, không chuyển sang tab khác hoặc mở phần mềm khác để tra cứu tài liệu.',
      };
    }
    if (count === 2) {
      return {
        level: 'Cảnh báo nghiêm trọng lần 2',
        textColor: 'text-orange-400',
        borderColor: 'border-orange-500',
        bgColor: 'bg-orange-950/50',
        message:
          'Hệ thống đã ghi lại thời điểm và số lần rời màn hình. Mọi hành vi vi phạm sẽ được hiển thị trên bảng kết quả và báo cáo cho Giáo viên!',
      };
    }
    return {
      level: `Vi phạm mức độ cao (Lần ${count})`,
      textColor: 'text-rose-400',
      borderColor: 'border-rose-500',
      bgColor: 'bg-rose-950/60',
      message:
        'Bạn đã nhiều lần vi phạm quy chế thi trực tuyến! Kết quả bài làm sẽ bị đánh dấu vi phạm trên Bảng xếp hạng.',
    };
  };

  const severity = getSeverityInfo(violationCount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0c0d1e] border-2 border-rose-500/90 rounded-2xl p-5 sm:p-6 shadow-[0_0_50px_rgba(244,63,94,0.4)] text-slate-100 flex flex-col gap-4 relative overflow-hidden">
        {/* Glow Header Accent */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-rose-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Warning Icon & Title Header */}
        <div className="flex flex-col items-center text-center gap-2 border-b border-slate-800 pb-3">
          <div className="w-14 h-14 rounded-full bg-rose-950/80 border-2 border-rose-500 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.5)] animate-bounce">
            <ShieldAlert size={32} />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-rose-400 tracking-wide font-serif uppercase drop-shadow">
            CẢNH BÁO VI PHẠM QUY CHẾ THI!
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Hệ thống phát hiện bạn vừa rời khỏi màn hình bài làm (chuyển tab trình duyệt hoặc mở cửa sổ ứng dụng khác).
          </p>
        </div>

        {/* Violation Count Badge & Severity Box */}
        <div className={`p-4 rounded-xl border ${severity.borderColor} ${severity.bgColor} flex flex-col gap-2.5`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <AlertTriangle size={16} className="text-amber-400" />
              Tình trạng giám sát
            </span>
            <span className="px-3 py-1 rounded-full bg-rose-600 border border-rose-300 text-white text-xs font-black shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse">
              ĐÃ VI PHẠM {violationCount} LẦN
            </span>
          </div>

          <div className="text-sm font-black text-rose-300 uppercase tracking-wide">
            {severity.level}
          </div>

          <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${severity.textColor}`}>
            {severity.message}
          </p>

          {latestViolationReason && (
            <p className="text-[11px] text-slate-300/80 italic bg-black/40 p-2 rounded border border-slate-800">
              📌 Lần vi phạm gần nhất: {latestViolationReason}
            </p>
          )}
        </div>

        {/* Violation Logs List */}
        {violationLogs.length > 0 && (
          <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto bg-[#070914] p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-400">
            <div className="font-bold text-slate-300 flex items-center gap-1 text-[11px]">
              <Clock size={12} className="text-slate-400" />
              <span>Biên bản ghi nhận vi phạm:</span>
            </div>
            {violationLogs.map((log, idx) => (
              <div key={idx} className="flex justify-between items-center py-0.5 border-b border-slate-800/60 last:border-0">
                <span className="text-rose-300 font-medium truncate max-w-[70%]">
                  • Lần {idx + 1}: {log.description}
                </span>
                <span className="text-slate-400 font-mono text-[10px]">
                  {new Date(log.timestamp).toLocaleTimeString('vi-VN')}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Return Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl font-black text-slate-950 text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(250,204,21,0.3)] border border-amber-300 flex items-center justify-center gap-2 cursor-pointer mt-1"
        >
          <span>TÔI ĐÃ HIỂU VÀ QUAY LẠI LÀM BÀI</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
