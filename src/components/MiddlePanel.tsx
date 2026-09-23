import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Mic, MicOff, SquareSquare } from 'lucide-react';
import { Question, UserAnswers } from '../types';
import { MathText } from './MathText';
import { QuestionDiagram } from './QuestionDiagram';

interface MiddlePanelProps {
  question: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  currentExamTitle?: string;
  userAnswers: UserAnswers;
  onSelectOptionPartI: (questionId: number, optionKey: 'A' | 'B' | 'C' | 'D') => void;
  onSelectOptionPartII: (questionId: number, statementKey: 'a' | 'b' | 'c' | 'd', value: boolean) => void;
  onChangeAnswerPartIII: (questionId: number, value: string) => void;
  onPrev: () => void;
  onNext: () => void;
  isTeacherMode: boolean;
  isSubmitted: boolean;
  onOpenOwnerAuth?: () => void;
  isStarted?: boolean;
  violationCount?: number;
  onOpenViolationLogs?: () => void;
}

export const MiddlePanel: React.FC<MiddlePanelProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  currentExamTitle = 'Đề 1',
  userAnswers,
  onSelectOptionPartI,
  onSelectOptionPartII,
  onChangeAnswerPartIII,
  onPrev,
  onNext,
  isTeacherMode,
  isSubmitted,
  onOpenOwnerAuth,
  isStarted = false,
  violationCount = 0,
  onOpenViolationLogs,
}) => {
  const currentAnswer = userAnswers[question.id] || {};
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Cancel speaking when question changes
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
      setIsSpeaking(false);
    }
    
    // Stop listening when question changes
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }

    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.lang = 'vi-VN';
          recognitionRef.current.continuous = false;
          recognitionRef.current.interimResults = false;

          recognitionRef.current.onresult = (event: any) => {
            if (event.results?.[0]?.[0]?.transcript) {
              const transcript = event.results[0][0].transcript.toLowerCase();
              handleVoiceAnswer(transcript);
            }
            setIsListening(false);
          };
          
          recognitionRef.current.onerror = () => setIsListening(false);
          recognitionRef.current.onend = () => setIsListening(false);
        } catch {
          recognitionRef.current = null;
        }
      }
    }
  }, [question.id]);

  const showNotification = (msg: string) => {
    setVoiceNotice(msg);
    setTimeout(() => {
      setVoiceNotice(null);
    }, 2800);
  };

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showNotification('Thiết bị không hỗ trợ phát âm thanh đọc đề.');
      return;
    }
    try {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      
      let textToSpeak = question.questionText.replace(/\$[^\$]+\$/g, ' công thức toán học ');
      
      if (question.section === 'PART_I') {
        textToSpeak += '. Các phương án: ';
        question.options?.forEach(opt => {
           textToSpeak += opt.key + '. ' + opt.text.replace(/\$[^\$]+\$/g, ' công thức toán học ') + '. ';
        });
      } else if (question.section === 'PART_II') {
        textToSpeak += '. Các mệnh đề: ';
        question.statements?.forEach(stmt => {
           textToSpeak += stmt.key + '. ' + stmt.text.replace(/\$[^\$]+\$/g, ' công thức toán học ') + '. ';
        });
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      showNotification('Trình duyệt chưa hỗ trợ giọng nói. Vui lòng thử trên Chrome/Edge.');
      return;
    }
    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        showNotification('Đang lắng nghe... Hãy nói đáp án của bạn (Ví dụ: "A", "B", "Đúng", "Sai"...)');
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleVoiceAnswer = (transcript: string) => {
    if (!transcript) return;
    showNotification(`Đã nhận diện: "${transcript}"`);
    
    if (question.section === 'PART_I') {
      if (transcript.includes('a') || transcript.includes('đáp án a')) onSelectOptionPartI(question.id, 'A');
      else if (transcript.includes('b') || transcript.includes('đáp án b')) onSelectOptionPartI(question.id, 'B');
      else if (transcript.includes('c') || transcript.includes('đáp án c')) onSelectOptionPartI(question.id, 'C');
      else if (transcript.includes('d') || transcript.includes('đáp án d')) onSelectOptionPartI(question.id, 'D');
    }
    else if (question.section === 'PART_II') {
      const isTrue = transcript.includes('đúng');
      const isFalse = transcript.includes('sai');
      if (isTrue || isFalse) {
         if (transcript.includes('a')) onSelectOptionPartII(question.id, 'a', isTrue);
         if (transcript.includes('b')) onSelectOptionPartII(question.id, 'b', isTrue);
         if (transcript.includes('c')) onSelectOptionPartII(question.id, 'c', isTrue);
         if (transcript.includes('d')) onSelectOptionPartII(question.id, 'd', isTrue);
      }
    }
    else if (question.section === 'PART_III') {
      const match = transcript.match(/-?\d+([.,]\d+)?/);
      if (match) {
        onChangeAnswerPartIII(question.id, match[0].replace(',', '.'));
      } else {
        const numMap: Record<string, string> = { "một": "1", "hai": "2", "ba": "3", "bốn": "4", "năm": "5", "sáu": "6", "bảy": "7", "tám": "8", "chín": "9", "mười": "10", "không": "0" };
        for (const [word, digit] of Object.entries(numMap)) {
           if (transcript.includes(word)) {
              onChangeAnswerPartIII(question.id, digit);
              break;
           }
        }
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#040a1c] p-2.5 sm:p-4 rounded-xl border border-[#1e345e] shadow-xl text-slate-100 min-h-0 sm:min-h-[600px] relative">
      {/* Non-intrusive voice feedback toast */}
      {voiceNotice && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 bg-[#0f244a] border border-cyan-400 text-cyan-200 text-xs px-3 py-1.5 rounded-full shadow-lg font-medium animate-in fade-in flex items-center gap-1.5 max-w-[90%] text-center">
          <span>🎙️</span>
          <span className="truncate">{voiceNotice}</span>
        </div>
      )}
      <div className="flex flex-col gap-2.5 sm:gap-3.5">
        {/* Main Title Banner Header */}
        <div 
          className="text-center py-0.5 sm:py-1 cursor-default select-none"
          onDoubleClick={onOpenOwnerAuth}
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wider text-[#facc15] font-serif uppercase drop-shadow-[0_2px_8px_rgba(250,204,21,0.3)]">
            AI LÀ TRIỆU PHÚ TOÁN HỌC
          </h1>
          <p className="text-[10px] sm:text-xs font-semibold tracking-wide text-slate-300 mt-0.5 uppercase">
            ÔN THI TỐT NGHIỆP THPT MÔN TOÁN 2027
          </p>
        </div>

        {/* ON-SCREEN ANTI-CHEAT PROCTORING STATUS & VIOLATION WARNING BANNER */}
        {isStarted && !isSubmitted && !isTeacherMode && (
          <div>
            {violationCount === 0 ? (
              <div className="w-full py-1.5 px-3 rounded-lg bg-emerald-950/40 border border-emerald-500/50 flex items-center justify-between text-xs text-emerald-300 shadow-sm">
                <div className="flex items-center gap-1.5 font-medium truncate">
                  <span className="text-sm">🛡️</span>
                  <span className="truncate">
                    Giám sát phòng thi: <strong className="text-emerald-200">0 vi phạm</strong> (Hợp lệ, không chuyển tab)
                  </span>
                </div>
                <span className="hidden sm:inline-block text-[11px] text-emerald-400 bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-500/30">
                  Tự động ghi nhận vi phạm
                </span>
              </div>
            ) : (
              <div className="w-full py-2 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-rose-950/95 via-red-900/90 to-rose-950/95 border-2 border-rose-500/90 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-rose-100 shadow-[0_0_25px_rgba(244,63,94,0.45)]">
                <div className="flex items-center gap-2.5 text-center sm:text-left">
                  <span className="text-xl shrink-0 animate-bounce">🚨</span>
                  <div>
                    <div className="text-rose-200 text-xs sm:text-sm font-black tracking-wide uppercase flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                      <span>CẢNH BÁO: BẠN ĐÃ RỜI MÀN HÌNH</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-600 border border-rose-300 text-white font-black text-xs shadow">
                        {violationCount} LẦN
                      </span>
                    </div>
                    <div className="text-[11px] text-rose-300 font-medium">
                      Hệ thống đã lưu lại nhật ký vi phạm rời màn hình/chuyển tab vào kết quả thi!
                    </div>
                  </div>
                </div>
                {onOpenViolationLogs && (
                  <button
                    onClick={onOpenViolationLogs}
                    className="shrink-0 px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-[11px] uppercase tracking-wider transition-all shadow-[0_0_10px_rgba(250,204,21,0.4)] border border-amber-300 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Xem biên bản vi phạm</span>
                    <span>⚠️</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Question Inner Container (Card 1) */}
        <div className="w-full bg-[#08122c] p-2.5 sm:p-3.5 rounded-xl border border-[#1e345e] flex flex-col gap-2.5 sm:gap-3 shadow-inner max-w-full overflow-hidden">
          
          {/* Question Header Capsule Badges */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {/* Exam Title Badge */}
              <div className="px-2 sm:px-2.5 py-1 rounded-full border border-indigo-400/80 text-indigo-200 text-[10px] sm:text-xs font-bold tracking-wide bg-[#0c1638] flex items-center gap-1">
                <span>📖</span>
                <span className="truncate max-w-[130px] sm:max-w-[200px]">{currentExamTitle}</span>
              </div>

              {/* Question Number Badge */}
              <div className="px-2.5 sm:px-3 py-1 rounded-full border border-amber-400 text-[#facc15] text-[11px] sm:text-xs font-bold tracking-wide bg-[#0a1738] flex items-center gap-1">
                <span>
                  {question.section === 'PART_I'
                    ? `Phần I - Câu ${question.id}`
                    : question.section === 'PART_II'
                    ? `Phần II - Câu ${question.id - 12}`
                    : `Phần III - Câu ${question.id - 16}`}
                </span>
                <span className="text-slate-400 text-[10px] font-normal">/ {totalQuestions}</span>
              </div>

              {/* Section Title Capsule */}
              <div className="px-2.5 sm:px-3.5 py-1 rounded-full border border-cyan-400 text-cyan-300 text-[11px] sm:text-xs font-bold tracking-wide bg-[#071d3d] truncate max-w-[180px] sm:max-w-none">
                {question.sectionTitle}
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 sm:gap-2">
               <button onClick={handleSpeak} className={`p-1.5 rounded-full border transition-all ${isSpeaking ? 'bg-cyan-900 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-[#0f172a] border-[#1e345e] text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50'}`} title="Đọc câu hỏi">
                 <Volume2 size={16} />
               </button>
               {!isSubmitted && (
                 <button onClick={toggleListening} className={`p-1.5 rounded-full border transition-all ${isListening ? 'bg-rose-900 border-rose-400 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.5)] animate-pulse' : 'bg-[#0f172a] border-[#1e345e] text-slate-400 hover:text-rose-300 hover:border-rose-500/50'}`} title="Trả lời bằng giọng nói">
                   {isListening ? <Mic size={16} /> : <MicOff size={16} />}
                 </button>
               )}
            </div>
          </div>

          {/* Question Text */}
          <div className="text-xs sm:text-base font-medium text-slate-100 leading-relaxed px-0.5 max-w-full overflow-x-auto">
            <MathText text={question.questionText} />
          </div>

          {/* Diagram / Image Area */}
          {(question.diagramType || question.imageUrl) && (
            <QuestionDiagram type={question.diagramType} imageUrl={question.imageUrl} />
          )}
        </div>

        {/* Answer Options Container (Card 2) */}
        <div className="w-full bg-[#08122c] p-2.5 sm:p-3.5 rounded-xl border border-[#1e345e] flex flex-col gap-2.5 sm:gap-3 shadow-inner max-w-full overflow-hidden">
          {/* PART I: 2x2 Grid of 4 Multiple Choice Options (A, B, C, D) */}
          {question.section === 'PART_I' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {question.options.map((opt) => {
                const isSelected = currentAnswer.partI === opt.key;
                const isCorrectKey = question.correctAnswer === opt.key;
                const showResult = isSubmitted || isTeacherMode;

                let btnClass =
                  'bg-[#0b1b3b] border-[#1e3a6e] text-slate-100 hover:bg-[#122854] hover:border-amber-400/80';

                if (showResult) {
                  if (isCorrectKey) {
                    btnClass =
                      'bg-emerald-950/90 border-emerald-400 text-emerald-200 font-bold ring-2 ring-emerald-400';
                  } else if (isSelected && !isCorrectKey) {
                    btnClass =
                      'bg-rose-950/90 border-rose-500 text-rose-200 font-bold';
                  }
                } else if (isSelected) {
                  btnClass =
                    'bg-[#142d5c] border-[#facc15] text-amber-300 font-bold ring-2 ring-amber-400/80 shadow-[0_0_12px_rgba(250,204,21,0.3)] animate-pulse';
                }

                return (
                  <button
                    key={opt.key}
                    onClick={() => onSelectOptionPartI(question.id, opt.key)}
                    className={`flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 min-h-[46px] rounded-xl border transition-all text-left cursor-pointer active:scale-[0.98] ${btnClass}`}
                  >
                    {/* Yellow Circle Badge with Black Letter */}
                    <span className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full bg-[#facc15] text-[#0f172a] font-extrabold text-xs shadow-sm">
                      {opt.key}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold tracking-wide overflow-x-auto max-w-full">
                      <MathText text={opt.text} />
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* PART II: True / False Statements (a, b, c, d) */}
          {question.section === 'PART_II' && (
            <div className="flex flex-col gap-2">
              {question.statements.map((stmt) => {
                const currentVal = currentAnswer.partII?.[stmt.key];
                const showResult = isSubmitted || isTeacherMode;

                return (
                  <div
                    key={stmt.key}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-2.5 bg-[#0b1b3b] rounded-lg border border-[#1e3a6e] gap-2"
                  >
                    <div className="flex items-start gap-1.5 text-xs sm:text-sm text-slate-100 pr-1 overflow-x-auto max-w-full">
                      <span className="font-bold text-[#facc15] uppercase shrink-0">
                        {stmt.key})
                      </span>
                      <span>
                        <MathText text={stmt.text} />
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0 mt-1 sm:mt-0">
                      <button
                        onClick={() =>
                          onSelectOptionPartII(question.id, stmt.key, true)
                        }
                        className={`px-3 py-1.5 sm:py-1 rounded text-xs font-bold transition-all border cursor-pointer min-h-[36px] min-w-[56px] ${
                          currentVal === true
                            ? 'bg-emerald-600 border-emerald-400 text-white animate-pulse'
                            : 'bg-[#0f244a] border-slate-700 text-slate-300 hover:bg-[#183466]'
                        }`}
                      >
                        Đúng
                      </button>
                      <button
                        onClick={() =>
                          onSelectOptionPartII(question.id, stmt.key, false)
                        }
                        className={`px-3 py-1.5 sm:py-1 rounded text-xs font-bold transition-all border cursor-pointer min-h-[36px] min-w-[56px] ${
                          currentVal === false
                            ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
                            : 'bg-[#0f244a] border-slate-700 text-slate-300 hover:bg-[#183466]'
                        }`}
                      >
                        Sai
                      </button>

                      {showResult && (
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                            stmt.correct
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-600'
                              : 'bg-rose-950 text-rose-400 border border-rose-600'
                          }`}
                        >
                          Đáp án: {stmt.correct ? 'Đúng' : 'Sai'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PART III: Short Answer Input Box */}
          {question.section === 'PART_III' && (
            <div className="flex flex-col items-center justify-center p-3 sm:p-3.5 bg-[#0b1b3b] rounded-lg border border-[#1e3a6e] gap-2.5">
              <label className="text-xs sm:text-sm font-semibold text-amber-300">
                Nhập đáp số:
              </label>
              <div className="w-full max-w-sm">
                <input
                  type="text"
                  inputMode="decimal"
                  value={currentAnswer.partIII || ''}
                  onChange={(e) =>
                    onChangeAnswerPartIII(question.id, e.target.value)
                  }
                  placeholder="Nhập đáp số..."
                  className="w-full py-2.5 px-4 rounded-lg bg-[#040a1c] border-2 border-cyan-500/80 text-amber-300 text-center font-bold text-base focus:outline-none focus:border-amber-400 transition-all placeholder:text-slate-500 shadow-inner"
                />
              </div>

              {(isSubmitted || isTeacherMode) && (
                <div className="text-center text-xs text-emerald-400 font-bold bg-emerald-950/60 py-1 px-4 rounded border border-emerald-500/40">
                  Đáp án chuẩn: <MathText text={question.correctAnswer} />
                </div>
              )}
            </div>
          )}

          {/* Teacher Mode Step-by-Step Explanation Drawer */}
          {(isTeacherMode || isSubmitted) && (
            <div className="p-2.5 sm:p-3 bg-indigo-950/70 rounded-lg border border-indigo-500/50 text-xs sm:text-sm space-y-1 text-slate-200 mt-1">
              <span className="font-bold text-[#facc15] uppercase tracking-wider block">
                💡 {isTeacherMode ? 'Hướng dẫn giải chi tiết (Chế độ Giáo Viên):' : 'Hướng dẫn giải chi tiết:'}
              </span>
              <div className="leading-relaxed whitespace-pre-line text-slate-200 overflow-x-auto">
                <MathText text={question.explanation} />
              </div>
            </div>
          )}

          {/* Navigation Buttons (Bottom inside MiddlePanel) */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mt-1">
            <button
              onClick={onPrev}
              disabled={currentQuestionIndex === 0}
              className="w-full py-2.5 sm:py-3 px-3 rounded-lg font-bold text-white text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-b from-[#64748b] via-[#475569] to-[#334155] hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md border border-slate-400/30 cursor-pointer min-h-[44px]"
            >
              CÂU TRƯỚC
            </button>

            <button
              onClick={onNext}
              disabled={currentQuestionIndex === totalQuestions - 1}
              className="w-full py-2.5 sm:py-3 px-3 rounded-lg font-bold text-[#0f172a] text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-b from-[#fde047] via-[#facc15] to-[#eab308] hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md border border-amber-300/80 cursor-pointer min-h-[44px]"
            >
              CÂU TIẾP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
