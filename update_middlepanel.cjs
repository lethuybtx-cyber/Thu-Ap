const fs = require('fs');
let content = fs.readFileSync('src/components/MiddlePanel.tsx', 'utf8');

// 1. Add imports
content = content.replace("import React from 'react';", "import React, { useState, useEffect, useRef } from 'react';\nimport { Volume2, Mic, MicOff, SquareSquare } from 'lucide-react';");

// 2. Add state and effect logic inside component
const hookLogic = `
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Cancel speaking when question changes
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    
    // Stop listening when question changes
    if (isListening && recognitionRef.current) {
       recognitionRef.current.stop();
       setIsListening(false);
    }

    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = 'vi-VN';
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript.toLowerCase();
          handleVoiceAnswer(transcript);
          setIsListening(false);
        };
        
        recognitionRef.current.onerror = () => setIsListening(false);
        recognitionRef.current.onend = () => setIsListening(false);
      }
    }
  }, [question.id]);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    
    let textToSpeak = question.questionText.replace(/\\$[^\\$]+\\$/g, ' công thức toán học ');
    
    if (question.section === 'PART_I') {
      textToSpeak += '. Các phương án: ';
      question.options?.forEach(opt => {
         textToSpeak += opt.key + '. ' + opt.text.replace(/\\$[^\\$]+\\$/g, ' công thức toán học ') + '. ';
      });
    } else if (question.section === 'PART_II') {
      textToSpeak += '. Các mệnh đề: ';
      question.statements?.forEach(stmt => {
         textToSpeak += stmt.key + '. ' + stmt.text.replace(/\\$[^\\$]+\\$/g, ' công thức toán học ') + '. ';
      });
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'vi-VN';
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói (Speech Recognition). Vui lòng dùng Chrome hoặc Edge.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleVoiceAnswer = (transcript: string) => {
    if (!transcript) return;
    console.log("Voice Input:", transcript);
    
    if (question.section === 'PART_I') {
      if (transcript.includes('a')) onSelectOptionPartI(question.id, 'A');
      else if (transcript.includes('b')) onSelectOptionPartI(question.id, 'B');
      else if (transcript.includes('c')) onSelectOptionPartI(question.id, 'C');
      else if (transcript.includes('d')) onSelectOptionPartI(question.id, 'D');
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
      const match = transcript.match(/-?\\d+([.,]\\d+)?/);
      if (match) {
        onChangeAnswerPartIII(question.id, match[0].replace(',', '.'));
      } else {
        // sometimes users speak number words
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
`;

content = content.replace("const currentAnswer = userAnswers[question.id] || {};", "const currentAnswer = userAnswers[question.id] || {};" + hookLogic);

// 3. Add buttons to the header UI
const headerReplacement = `
          {/* Question Header Capsule Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {/* Question Number Badge */}
              <div className="px-3 py-1 rounded-full border border-amber-400 text-[#facc15] text-xs font-bold tracking-wide bg-[#0a1738]">
                Câu {question.id} / {totalQuestions}
              </div>

              {/* Section Title Capsule */}
              <div className="px-3.5 py-1 rounded-full border border-cyan-400 text-cyan-300 text-xs font-bold tracking-wide bg-[#071d3d]">
                {question.sectionTitle}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
               <button onClick={handleSpeak} className={\`p-1.5 rounded-full border transition-all \${isSpeaking ? 'bg-cyan-900 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-[#0f172a] border-[#1e345e] text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50'}\`} title="Đọc câu hỏi">
                 <Volume2 size={16} />
               </button>
               {!isSubmitted && (
                 <button onClick={toggleListening} className={\`p-1.5 rounded-full border transition-all \${isListening ? 'bg-rose-900 border-rose-400 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.5)] animate-pulse' : 'bg-[#0f172a] border-[#1e345e] text-slate-400 hover:text-rose-300 hover:border-rose-500/50'}\`} title="Trả lời bằng giọng nói">
                   {isListening ? <Mic size={16} /> : <MicOff size={16} />}
                 </button>
               )}
            </div>
          </div>
`;

content = content.replace(
  /\{\/\* Question Header Capsule Badges \*\/\}[\s\S]*?<\/div>[\s\S]*?<\/div>/,
  headerReplacement
);

fs.writeFileSync('src/components/MiddlePanel.tsx', content);
