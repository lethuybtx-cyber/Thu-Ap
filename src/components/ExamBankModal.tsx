import React, { useState } from 'react';
import { ExamRecord, Question } from '../types';
import { FileText, Sparkles, Trash2, Edit3, CheckCircle, PlusCircle, Award, BookOpen, Clock } from 'lucide-react';

interface ExamBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  exams: ExamRecord[];
  currentExamId: number;
  onSelectExam: (exam: ExamRecord) => void;
  onGenerateSimilar?: (baseExam: ExamRecord) => void;
  onDeleteExam?: (examId: number) => void;
  onRenameExam?: (examId: number, newTitle: string) => void;
  onOpenWordImport?: () => void;
  isOwnerAuthenticated?: boolean;
  onOpenOwnerAuth?: () => void;
  isGenerating?: boolean;
  generatingStatus?: string;
}

export const ExamBankModal: React.FC<ExamBankModalProps> = ({
  isOpen,
  onClose,
  exams,
  currentExamId,
  onSelectExam,
  onGenerateSimilar,
  onDeleteExam,
  onRenameExam,
  onOpenWordImport,
  isOwnerAuthenticated = false,
  onOpenOwnerAuth,
  isGenerating = false,
  generatingStatus = '',
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartRename = (exam: ExamRecord) => {
    setEditingId(exam.id);
    setEditingTitle(exam.title);
    setDeleteConfirmId(null);
  };

  const handleSaveRename = (examId: number) => {
    if (editingTitle.trim() && onRenameExam) {
      onRenameExam(examId, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleTriggerDelete = (exam: ExamRecord) => {
    if (exams.length <= 1) {
      setFeedbackMsg('Ngân hàng đề cần duy trì tối thiểu 1 đề thi.');
      setTimeout(() => setFeedbackMsg(null), 3000);
      return;
    }
    setDeleteConfirmId(deleteConfirmId === exam.id ? null : exam.id);
    setEditingId(null);
  };

  const handleConfirmDelete = (examId: number) => {
    if (onDeleteExam) {
      onDeleteExam(examId);
    }
    setDeleteConfirmId(null);
  };

  const filteredExams = exams.filter((ex) =>
    ex.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#08122c] border-2 border-amber-400/80 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 bg-[#040a1c] border-b border-[#1e345e] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black shadow-[0_0_12px_rgba(250,204,21,0.4)]">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-sm sm:text-lg font-black text-[#facc15] tracking-wide uppercase font-serif">
                NGÂN HÀNG ĐỀ THI TRẮC NGHIỆM
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-300 font-medium">
                Tất cả đề thi lưu sẵn ({exams.length} đề) • Người chơi tự do chọn đề làm bài
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors text-xl font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Action Top Bar */}
        <div className="p-3 bg-[#050e24] border-b border-[#1e345e] flex flex-wrap items-center justify-between gap-2">
          {/* Search bar */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm đề thi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a1630] border border-[#1e345e] rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Quick Create Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Generate Similar from active exam - visible to owner */}
            {isOwnerAuthenticated && onGenerateSimilar && (
              <button
                disabled={isGenerating}
                onClick={() => {
                  const base = exams.find((e) => e.id === currentExamId) || exams[0];
                  if (base) onGenerateSimilar(base);
                }}
                className={`py-1.5 px-3 rounded-lg text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all border ${
                  isGenerating
                    ? 'bg-indigo-900/50 border-indigo-700 text-indigo-300 opacity-60 cursor-not-allowed'
                    : 'bg-gradient-to-b from-indigo-500 to-indigo-700 hover:brightness-110 active:scale-95 border-indigo-400/40 cursor-pointer'
                }`}
                title="Tạo thêm 1 đề tương tự theo đề đang chọn"
              >
                <Sparkles size={14} className={isGenerating ? "animate-spin text-amber-300" : "text-amber-300"} />
                <span>{isGenerating ? 'ĐANG TẠO ĐỀ...' : 'TẠO ĐỀ TƯƠNG TỰ'}</span>
              </button>
            )}

            {/* Import Word */}
            {onOpenWordImport && (
              <button
                onClick={() => {
                  if (onOpenWordImport) {
                    onOpenWordImport();
                  }
                }}
                className="py-1.5 px-3 rounded-lg bg-gradient-to-b from-amber-500 to-yellow-500 hover:brightness-110 active:scale-95 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer border border-amber-300"
                title="Tạo đề mới từ File Word (.docx) hoặc PDF"
              >
                <PlusCircle size={14} />
                <span>NHẬP TỪ WORD</span>
              </button>
            )}
          </div>
        </div>

        {/* Exams List Container */}
        <div className="p-3 sm:p-4 flex-1 overflow-y-auto space-y-3 bg-[#030712]/60">
          {/* AI Generating Indicator */}
          {isGenerating && (
            <div className="p-4 rounded-xl bg-indigo-950/80 border-2 border-indigo-400/80 text-center flex flex-col items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)] animate-pulse">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Sparkles className="animate-spin" size={18} />
                <span>HỆ THỐNG ĐANG BIÊN SOẠN ĐỀ THI TƯƠNG TỰ...</span>
              </div>
              <p className="text-xs text-indigo-200 max-w-md">
                {generatingStatus ||
                  'Đang thay đổi số liệu, đổi ngữ cảnh thực tế, thẩm định logic toán học chuẩn GDPT 2018 và tính toán lại đáp án...'}
              </p>
            </div>
          )}

          {filteredExams.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              Không tìm thấy đề thi nào phù hợp.
            </div>
          ) : (
            filteredExams.map((exam, idx) => {
              const isSelected = exam.id === currentExamId;
              const p1Count = exam.questions.filter((q) => q.section === 'PART_I').length;
              const p2Count = exam.questions.filter((q) => q.section === 'PART_II').length;
              const p3Count = exam.questions.filter((q) => q.section === 'PART_III').length;

              return (
                <div
                  key={exam.id}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-[#0f234a] border-amber-400 shadow-[0_0_15px_rgba(250,204,21,0.25)] ring-1 ring-amber-400/50'
                      : 'bg-[#08122c] border-[#1e345e] hover:border-slate-500'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Exam Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {editingId === exam.id ? (
                          <div className="flex items-center gap-1.5 flex-1 max-w-md">
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              className="bg-[#030712] border border-amber-400 rounded px-2 py-1 text-xs text-white flex-1"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename(exam.id);
                                if (e.key === 'Escape') setEditingId(null);
                              }}
                            />
                            <button
                              onClick={() => handleSaveRename(exam.id)}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold"
                            >
                              Lưu
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs"
                            >
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <>
                            <h3 className="font-extrabold text-sm sm:text-base text-[#facc15] truncate">
                              {exam.title}
                            </h3>
                            {isSelected && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                                <CheckCircle size={10} /> ĐANG LÀM
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      {/* Details Capsule */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
                        <span className="bg-[#0f172a] px-2 py-0.5 rounded border border-[#1e345e] font-semibold text-slate-200">
                          {exam.questions.length} câu hỏi ({p1Count} P.I + {p2Count} P.II + {p3Count} P.III)
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock size={12} />
                          {new Date(exam.timestamp).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap justify-end">
                      {/* Select Exam */}
                      <button
                        onClick={() => {
                          onSelectExam(exam);
                          onClose();
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow active:scale-95 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-gradient-to-b from-[#facc15] to-[#eab308] text-slate-950 hover:brightness-110'
                        }`}
                      >
                        {isSelected ? 'LÀM TIẾP' : 'LÀM BÀI NÀY'}
                      </button>

                      {/* Owner actions: Generate Similar, Rename & Delete */}
                      {isOwnerAuthenticated && (
                        <>
                          {/* Generate similar */}
                          {onGenerateSimilar && (
                            <button
                              disabled={isGenerating}
                              onClick={() => onGenerateSimilar(exam)}
                              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-indigo-900/60 border border-indigo-500/50 hover:bg-indigo-800 text-indigo-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Tạo đề tương tự từ đề này"
                            >
                              <Sparkles size={14} className="text-amber-300" />
                              <span className="hidden sm:inline">Tạo tương tự</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleStartRename(exam)}
                            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
                            title="Đổi tên đề"
                          >
                            <Edit3 size={14} />
                          </button>

                          {onDeleteExam && (
                            <button
                              onClick={() => handleTriggerDelete(exam)}
                              className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
                                deleteConfirmId === exam.id
                                  ? 'bg-rose-600 border-rose-400 text-white ring-2 ring-rose-400'
                                  : 'bg-rose-950/60 border-rose-700 hover:bg-rose-900 text-rose-300'
                              }`}
                              title="Xóa đề"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* INLINE DELETE CONFIRMATION BOX */}
                  {deleteConfirmId === exam.id && (
                    <div className="mt-3 p-3 rounded-xl bg-rose-950/90 border border-rose-500 flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-lg animate-in fade-in duration-150">
                      <div className="text-xs text-rose-100 font-semibold flex items-center gap-2">
                        <span className="text-base">⚠️</span>
                        <span>
                          Bạn có chắc muốn xóa vĩnh viễn <strong>"{exam.title}"</strong>?
                        </span>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => handleConfirmDelete(exam.id)}
                          className="flex-1 sm:flex-none px-3 py-1.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white rounded-lg text-xs font-black shadow cursor-pointer uppercase transition-all"
                        >
                          Xác nhận xóa
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-lg text-xs font-bold cursor-pointer transition-all border border-slate-600"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Feedback Message Toast if any */}
        {feedbackMsg && (
          <div className="px-4 py-2 bg-amber-500/20 border-t border-amber-400/40 text-amber-300 text-xs font-bold text-center">
            {feedbackMsg}
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-3 bg-[#040a1c] border-t border-[#1e345e] flex items-center justify-between text-xs text-slate-400">
          <span>💡 Bạn có thể chọn bất kỳ đề nào để luyện thi không giới hạn.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold text-xs uppercase cursor-pointer"
          >
            ĐÓNG
          </button>
        </div>
      </div>
    </div>
  );
};
