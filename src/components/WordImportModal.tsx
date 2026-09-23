import React, { useState } from 'react';
import { Question } from '../types';
import {
  extractTextFromDocx,
  extractTextFromPdf,
  parseExamText,
  aiParseExamDocumentAsync,
  SAMPLE_WORD_FORMAT,
  downloadSampleFormatFile,
} from '../lib/wordParser';

interface WordImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportQuestions: (newQuestions: Question[], title?: string) => void;
  defaultExamTitle?: string;
}

export const WordImportModal: React.FC<WordImportModalProps> = ({
  isOpen,
  onClose,
  onImportQuestions,
  defaultExamTitle = 'Đề nạp từ file',
}) => {
  const [activeTab, setActiveTab] = useState<'UPLOAD' | 'AI_SCAN' | 'FORMAT_GUIDE' | 'PASTE'>('UPLOAD');
  const [pastedText, setPastedText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [examTitle, setExamTitle] = useState<string>(defaultExamTitle);
  const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isAiMode, setIsAiMode] = useState(false);

  if (!isOpen) return null;

  // Handle File Change (.docx, .pdf, .txt)
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setFileName(file.name);
    const cleanName = file.name.replace(/\.[^/.]+$/, '');
    setExamTitle(cleanName || defaultExamTitle);
    setIsLoading(true);
    setErrors([]);
    setIsAiMode(false);

    try {
      let rawText = '';
      if (file.name.endsWith('.pdf')) {
        setLoadingStatus('Đang đọc cấu trúc file PDF...');
        try {
          rawText = await extractTextFromPdf(file);
        } catch (pdfErr: any) {
          // If local PDF extraction fails (e.g. scanned PDF), offer AI scan directly
          setLoadingStatus('Chuyển sang Quét đề thông minh bằng AI...');
          const aiResult = await aiParseExamDocumentAsync({ file, fileName: file.name });
          setParsedQuestions(aiResult.questions);
          if (aiResult.title) setExamTitle(aiResult.title);
          setIsAiMode(true);
          setIsLoading(false);
          return;
        }
      } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        setLoadingStatus('Đang trích xuất văn bản và hình ảnh từ file Word (.docx)...');
        rawText = await extractTextFromDocx(file);
      } else {
        setLoadingStatus('Đang đọc nội dung văn bản...');
        rawText = await file.text();
      }

      setPastedText(rawText);
      setLoadingStatus('Đang bóc tách 3 phần: Phần I (1-12), Phần II (1-4), Phần III (1-6)...');
      const result = parseExamText(rawText);
      setParsedQuestions(result.questions);
      setErrors(result.errors);
    } catch (err: any) {
      setErrors([
        `Lỗi khi đọc file: ${err?.message || 'File không hợp lệ hoặc bị khóa.'}. Bạn có thể thử nút "Quét đề bằng AI" bên dưới.`,
      ]);
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  // Handle AI Deep Parsing
  const handleAiDeepParse = async () => {
    if (!selectedFile && !pastedText.trim()) {
      setErrors(['Vui lòng chọn file Word/PDF hoặc dán nội dung văn bản đề thi trước.']);
      return;
    }

    setIsLoading(true);
    setLoadingStatus('Đang phân tích, nhận dạng công thức toán LaTeX & cấu trúc 3 phần bằng AI...');
    setErrors([]);

    try {
      const aiResult = await aiParseExamDocumentAsync({
        file: selectedFile || undefined,
        rawText: pastedText || undefined,
        fileName: fileName || examTitle,
      });

      if (aiResult.questions.length === 0) {
        throw new Error('AI không tìm thấy câu hỏi hợp lệ trong tài liệu.');
      }

      setParsedQuestions(aiResult.questions);
      if (aiResult.title) setExamTitle(aiResult.title);
      setIsAiMode(true);
    } catch (err: any) {
      setErrors([`Lỗi khi quét đề bằng AI: ${err?.message || 'Vui lòng kiểm tra kết nối mạng hoặc định dạng file.'}`]);
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  // Handle parse pasted text
  const handleParsePastedText = (text: string) => {
    setPastedText(text);
    if (!text.trim()) {
      setParsedQuestions([]);
      setErrors([]);
      return;
    }
    const result = parseExamText(text);
    setParsedQuestions(result.questions);
    setErrors(result.errors);
    setIsAiMode(false);
  };

  // Copy sample format
  const handleCopySample = () => {
    navigator.clipboard.writeText(SAMPLE_WORD_FORMAT);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Submit parsed questions to app
  const handleApplyQuestions = () => {
    if (parsedQuestions.length === 0) {
      setErrors(['Vui lòng tải file Word/PDF hoặc dán nội dung đề thi trước khi áp dụng.']);
      return;
    }
    onImportQuestions(parsedQuestions, examTitle.trim() || defaultExamTitle);
    onClose();
  };

  // Part counts
  const p1Questions = parsedQuestions.filter((q) => q.section === 'PART_I');
  const p2Questions = parsedQuestions.filter((q) => q.section === 'PART_II');
  const p3Questions = parsedQuestions.filter((q) => q.section === 'PART_III');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#08122c] border-2 border-amber-400/90 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 bg-[#040a1c] border-b border-[#1e345e] flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="px-2 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase shadow">
              WORD / PDF
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-black text-amber-300 tracking-wide uppercase font-serif">
                NHẬN DẠNG ĐỀ THI TỪ FILE WORD HOẶC PDF (CHUẨN 3 PHẦN)
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                Tự động phân loại: Phần I (Câu 1-12), Phần II (Câu 1-4), Phần III (Câu 1-6)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 text-xl font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1e345e] bg-[#030712] px-2 sm:px-3 gap-1.5 sm:gap-2 overflow-x-auto whitespace-nowrap no-scrollbar">
          <button
            onClick={() => setActiveTab('UPLOAD')}
            className={`py-2.5 px-3 sm:px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'UPLOAD'
                ? 'border-amber-400 text-amber-300 bg-[#08122c]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📁</span>
            <span>TẢI FILE WORD (.DOCX) / PDF (.PDF)</span>
          </button>

          <button
            onClick={() => setActiveTab('FORMAT_GUIDE')}
            className={`py-2.5 px-3 sm:px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'FORMAT_GUIDE'
                ? 'border-amber-400 text-amber-300 bg-[#08122c]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📋</span>
            <span>QUY TẮC 3 PHẦN & MẪU</span>
          </button>

          <button
            onClick={() => setActiveTab('PASTE')}
            className={`py-2.5 px-3 sm:px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'PASTE'
                ? 'border-amber-400 text-amber-300 bg-[#08122c]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>✏️</span>
            <span>DÁN VĂN BẢN ĐỀ THI</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-3.5 sm:p-5 flex-1 overflow-y-auto space-y-4">
          {/* TAB 1: UPLOAD FILE */}
          {activeTab === 'UPLOAD' && (
            <div className="space-y-4">
              {/* Structure Reminder Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#040a1c] p-2.5 sm:p-3 rounded-xl border border-cyan-500/40 text-xs">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-950/40 border border-amber-500/30">
                  <span className="text-amber-400 font-bold text-sm">I</span>
                  <div>
                    <strong className="text-amber-300 block font-bold">PHẦN I (12 câu)</strong>
                    <span className="text-[11px] text-slate-400">Câu 1 đến Câu 12 (4 lựa chọn)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/30">
                  <span className="text-cyan-400 font-bold text-sm">II</span>
                  <div>
                    <strong className="text-cyan-300 block font-bold">PHẦN II (4 câu)</strong>
                    <span className="text-[11px] text-slate-400">Câu 1 đến Câu 4 (Đúng/Sai a-d)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-950/40 border border-rose-500/30">
                  <span className="text-rose-400 font-bold text-sm">III</span>
                  <div>
                    <strong className="text-rose-300 block font-bold">PHẦN III (6 câu)</strong>
                    <span className="text-[11px] text-slate-400">Câu 1 đến Câu 6 (Trả lời ngắn)</span>
                  </div>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-amber-400/60 bg-[#030712] p-5 sm:p-6 rounded-xl text-center space-y-3 hover:border-amber-400 transition-colors shadow-inner">
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-400/10 flex items-center justify-center text-amber-300 text-2xl font-bold">
                  📑
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">
                    Chọn hoặc kéo thả file <strong className="text-amber-300">.DOCX</strong> (Word), <strong className="text-red-400">.PDF</strong>, hoặc <strong className="text-cyan-300">.TXT</strong>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Hỗ trợ cả 2 cách đánh số: <strong className="text-emerald-300">Mỗi phần bắt đầu từ Câu 1</strong> HOẶC <strong className="text-emerald-300">Đánh số liên tục từ 1 đến 22</strong>
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                  <label className="py-2 px-5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg transition-all border border-amber-300">
                    CHỌN FILE ĐỀ THI (WORD / PDF)
                    <input
                      type="file"
                      accept=".docx,.doc,.pdf,.txt"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>

                  {selectedFile && (
                    <button
                      onClick={handleAiDeepParse}
                      disabled={isLoading}
                      className="py-2 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg transition-all border border-cyan-300 flex items-center gap-1.5"
                      title="Sử dụng Gemini AI để quét chính xác công thức toán LaTeX và hình ảnh phức tạp"
                    >
                      <span>⚡ QUÉT & BÓC TÁCH BẰNG AI</span>
                    </button>
                  )}
                </div>

                {fileName && (
                  <div className="pt-2 flex items-center justify-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold">
                      ✓ Đã nạp: {fileName}
                    </span>
                    {isAiMode && (
                      <span className="px-2 py-1 rounded bg-indigo-950 border border-indigo-400 text-indigo-200 text-[10px] font-bold uppercase">
                        AI Bóc tách
                      </span>
                    )}
                  </div>
                )}
              </div>

              {isLoading && (
                <div className="p-3 bg-amber-950/50 border border-amber-500/60 rounded-xl text-center text-amber-300 text-xs font-bold space-y-1 animate-pulse">
                  <div className="text-base">⏳</div>
                  <div>{loadingStatus || 'Đang xử lý đề thi...'}</div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FORMAT GUIDE */}
          {activeTab === 'FORMAT_GUIDE' && (
            <div className="space-y-3.5">
              {/* Highlight rule */}
              <div className="p-3.5 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border border-emerald-500/60 rounded-xl text-xs space-y-2">
                <p className="font-bold text-emerald-300 uppercase flex items-center gap-2 text-sm">
                  <span>✨</span> CẤU TRÚC ĐỀ THI CHUẨN GDPT 2018 (3 PHẦN BẮT ĐẦU TỪ CÂU 1):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-200">
                  <div className="bg-[#030712] p-2.5 rounded-lg border border-amber-500/40 space-y-1">
                    <div className="font-black text-amber-300">PHẦN I (12 câu):</div>
                    <p>• Bắt đầu từ <strong>Câu 1</strong> đến <strong>Câu 12</strong></p>
                    <p>• 4 phương án <code>A.</code>, <code>B.</code>, <code>C.</code>, <code>D.</code></p>
                    <p>• Gạch chân đáp án đúng hoặc thêm dòng <code>Đáp án: A</code></p>
                  </div>

                  <div className="bg-[#030712] p-2.5 rounded-lg border border-cyan-500/40 space-y-1">
                    <div className="font-black text-cyan-300">PHẦN II (4 câu):</div>
                    <p>• Bắt đầu từ <strong>Câu 1</strong> đến <strong>Câu 4</strong></p>
                    <p>• 4 mệnh đề <code>a)</code>, <code>b)</code>, <code>c)</code>, <code>d)</code></p>
                    <p>• Kèm <code>[Đúng]</code> / <code>[Sai]</code> hoặc gạch chân ý đúng</p>
                  </div>

                  <div className="bg-[#030712] p-2.5 rounded-lg border border-rose-500/40 space-y-1">
                    <div className="font-black text-rose-300">PHẦN III (6 câu):</div>
                    <p>• Bắt đầu từ <strong>Câu 1</strong> đến <strong>Câu 6</strong></p>
                    <p>• Trắc nghiệm trả lời ngắn kết quả là số</p>
                    <p>• Thêm dòng <code>Đáp số: [giá trị]</code></p>
                  </div>
                </div>
              </div>

              {/* Math & Diagram Tips */}
              <div className="p-3 bg-cyan-950/40 border border-cyan-500/50 rounded-xl text-xs text-cyan-200 space-y-2">
                <p className="font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                  <span>📐</span> Công thức Toán học & Hình ảnh / Sơ đồ:
                </p>
                <div className="space-y-1 text-[11px] leading-relaxed">
                  <p>
                    • <strong>Công thức Toán LaTeX:</strong> Đặt trong cặp dấu <code>$...$</code> (Ví dụ: <code>$f'(x) = 3x^2 - 3$</code>, <code>$\\int_0^1 x dx$</code>, <code>$\\log_2(x-3)$</code>).
                  </p>
                  <p>
                    • <strong>Hình ảnh minh họa:</strong> Chèn ảnh trực tiếp vào file Word hoặc chèn thẻ URL <code>[Hình ảnh: https://...]</code> hoặc thẻ mô hình có sẵn <code>[Hình: OXYZ]</code>, <code>[Hình: GRAPH]</code>, <code>[Hình: PYRAMID_SABCD]</code>, <code>[Hình: PRISM]</code>.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-slate-300">
                  NỘI DUNG ĐỀ THI MẪU CHUẨN:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySample}
                    className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white transition-all cursor-pointer"
                  >
                    {copySuccess ? '✓ Đã sao chép' : '📋 Sao chép mẫu'}
                  </button>
                  <button
                    onClick={downloadSampleFormatFile}
                    className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-900 transition-all cursor-pointer"
                  >
                    ⬇ Tải file mẫu (.txt)
                  </button>
                </div>
              </div>

              <pre className="p-3 bg-[#030712] border border-slate-700 rounded-xl text-[11px] font-mono text-emerald-300 leading-relaxed max-h-52 overflow-y-auto whitespace-pre-wrap selection:bg-amber-400 selection:text-black">
                {SAMPLE_WORD_FORMAT}
              </pre>

              <div className="text-center pt-1">
                <button
                  onClick={() => {
                    handleParsePastedText(SAMPLE_WORD_FORMAT);
                    setActiveTab('PASTE');
                  }}
                  className="py-1.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase cursor-pointer"
                >
                  SỬ DỤNG MẪU NÀY ĐỂ THỬ NGHIỆM
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: PASTE TEXT */}
          {activeTab === 'PASTE' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-300 block">
                  Dán toàn bộ văn bản đề thi từ File Word hoặc PDF vào khung bên dưới:
                </label>
                {pastedText.trim() && (
                  <button
                    onClick={handleAiDeepParse}
                    disabled={isLoading}
                    className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold cursor-pointer flex items-center gap-1 shadow"
                  >
                    <span>⚡ Nhận dạng bằng AI</span>
                  </button>
                )}
              </div>
              <textarea
                value={pastedText}
                onChange={(e) => handleParsePastedText(e.target.value)}
                placeholder="Dán nội dung đề thi tại đây... (Hệ thống tự động nhận dạng Phần I câu 1-12, Phần II câu 1-4, Phần III câu 1-6)"
                rows={10}
                className="w-full p-3 rounded-xl bg-[#030712] border border-slate-700 text-slate-200 text-xs font-mono focus:border-amber-400 focus:outline-none placeholder:text-slate-600 leading-relaxed"
              />
            </div>
          )}

          {/* PARSED STATUS PREVIEW */}
          {parsedQuestions.length > 0 && (
            <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/60 rounded-xl text-xs space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between font-black text-emerald-300 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">✓</span>
                  <span>ĐÃ NHẬN DIỆN THÀNH CÔNG {parsedQuestions.length} CÂU HỎI</span>
                </div>
                {isAiMode && (
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-900 border border-cyan-400 text-cyan-200 text-[10px] font-bold uppercase tracking-wider">
                    Được chuẩn hóa bởi Gemini AI
                  </span>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-amber-300 block mb-1">
                  Tên đề thi hiển thị và lưu trữ:
                </label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="Ví dụ: Đề thi Khảo sát Toán THPT..."
                  className="w-full bg-[#040a1c] border border-amber-400/70 rounded-lg px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* 3-Part Status Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#040a1c] p-2.5 rounded-lg border border-emerald-900">
                <div className="p-2 rounded bg-black/40 border border-amber-500/40">
                  <div className="text-amber-300 font-bold text-xs flex items-center justify-between">
                    <span>Phần I (Trắc nghiệm):</span>
                    <span className="px-1.5 py-0.5 bg-amber-950 rounded text-[10px] border border-amber-500/50">
                      {p1Questions.length}/12 câu
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 truncate">
                    Câu 1 đến Câu {Math.min(12, p1Questions.length)}
                  </div>
                </div>

                <div className="p-2 rounded bg-black/40 border border-cyan-500/40">
                  <div className="text-cyan-300 font-bold text-xs flex items-center justify-between">
                    <span>Phần II (Đúng / Sai):</span>
                    <span className="px-1.5 py-0.5 bg-cyan-950 rounded text-[10px] border border-cyan-500/50">
                      {p2Questions.length}/4 câu
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 truncate">
                    Câu 1 đến Câu {Math.min(4, p2Questions.length)} (4 ý a-d)
                  </div>
                </div>

                <div className="p-2 rounded bg-black/40 border border-rose-500/40">
                  <div className="text-rose-300 font-bold text-xs flex items-center justify-between">
                    <span>Phần III (Trả lời ngắn):</span>
                    <span className="px-1.5 py-0.5 bg-rose-950 rounded text-[10px] border border-rose-500/50">
                      {p3Questions.length}/6 câu
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 truncate">
                    Câu 1 đến Câu {Math.min(6, p3Questions.length)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {errors.length > 0 && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/60 rounded-xl text-xs space-y-1 text-rose-300">
              <strong className="block text-rose-400 font-bold uppercase flex items-center gap-1.5">
                <span>⚠️</span> Lỗi / Cảnh báo nhận diện:
              </strong>
              {errors.map((err, i) => (
                <p key={i}>• {err}</p>
              ))}
              <div className="pt-2">
                <button
                  onClick={handleAiDeepParse}
                  disabled={isLoading}
                  className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow"
                >
                  ⚡ Nhận dạng lại bằng Trí tuệ nhân tạo AI (Gemini)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-[#040a1c] border-t border-[#1e345e] flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-3.5 sm:px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold uppercase transition-all cursor-pointer"
          >
            HỦY BỎ
          </button>

          <button
            onClick={handleApplyQuestions}
            disabled={parsedQuestions.length === 0}
            className="px-4 sm:px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-600 text-white font-black text-xs tracking-wider uppercase disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95 transition-all shadow-lg border border-emerald-400/50 cursor-pointer"
          >
            ÁP DỤNG ĐỀ THI ({parsedQuestions.length} CÂU)
          </button>
        </div>
      </div>
    </div>
  );
};
