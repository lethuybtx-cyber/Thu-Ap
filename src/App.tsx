import React, { useState, useEffect, useRef } from 'react';
import { QUESTIONS as DEFAULT_QUESTIONS } from './data/questions';
import { UserAnswers, TestResult, Question, ExamRecord, ViolationLog } from './types';
import { Header } from './components/Header';
import { LeftPanel } from './components/LeftPanel';
import { MiddlePanel } from './components/MiddlePanel';
import { RightPanel } from './components/RightPanel';
import { SubmitModal } from './components/SubmitModal';
import { Leaderboard } from './components/Leaderboard';
import { LeaderboardEntry } from './types';
import { WordImportModal } from './components/WordImportModal';
import { StartModal } from './components/StartModal';
import { OwnerAuthModal } from './components/OwnerAuthModal';
import { ExamBankModal } from './components/ExamBankModal';
import { ViolationWarningModal } from './components/ViolationWarningModal';
import { GoogleSheetModal } from './components/GoogleSheetModal';
import { generateSimilarExamAsync } from './lib/similarExamGenerator';
import { soundFx } from './utils/sound';
import { fireSubmissionConfetti } from './utils/confetti';
import { cleanStrayArtifacts, normalizeVectors } from './components/MathText';

export function sanitizeQuestion(q: Question): Question {
  const sanitizeText = (txt: string) => normalizeVectors(cleanStrayArtifacts(txt || ''));

  const common = {
    id: q.id,
    sectionTitle: q.sectionTitle,
    questionText: sanitizeText(q.questionText || (q as any).text || ''),
    diagramType: q.diagramType,
    imageUrl: q.imageUrl,
    explanation: sanitizeText(q.explanation || ''),
  };

  if (q.section === 'PART_I') {
    return {
      ...common,
      section: 'PART_I',
      options: (q.options || []).map((opt) => ({
        key: opt.key,
        text: sanitizeText(opt.text),
      })),
      correctAnswer: (cleanStrayArtifacts(String(q.correctAnswer || 'A')).toUpperCase() as 'A' | 'B' | 'C' | 'D') || 'A',
    };
  } else if (q.section === 'PART_II') {
    return {
      ...common,
      section: 'PART_II',
      statements: (q.statements || []).map((stmt) => ({
        key: stmt.key,
        text: sanitizeText(stmt.text),
        correct: Boolean(stmt.correct),
      })),
    };
  } else {
    return {
      ...common,
      section: 'PART_III',
      correctAnswer: cleanStrayArtifacts(String(q.correctAnswer || '')),
    };
  }
}

export function sanitizeExamRecord(exam: ExamRecord): ExamRecord {
  return {
    ...exam,
    questions: (exam.questions || []).map(sanitizeQuestion),
  };
}

export default function App() {
  const [examHistory, setExamHistory] = useState<ExamRecord[]>(() => {
    try {
      const saved = localStorage.getItem('quiz_exam_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize default exam title to "Đề 1" and sanitize all questions
          return parsed.map((item) => {
            const sanitized = sanitizeExamRecord(item);
            if (
              sanitized.id === 1 &&
              (sanitized.title.includes('Mặc định') ||
                sanitized.title === 'Đề thi số 1' ||
                sanitized.title === 'Đề thi số 1 (Mặc định)')
            ) {
              return { ...sanitized, title: 'Đề 1' };
            }
            return sanitized;
          });
        }
      }
    } catch (e) {}
    return [
      {
        id: 1,
        title: 'Đề 1',
        questions: DEFAULT_QUESTIONS.map(sanitizeQuestion),
        timestamp: Date.now(),
      },
    ];
  });

  const [currentExamId, setCurrentExamId] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quiz_current_exam_id');
      if (saved) return Number(saved);
    } catch (e) {}
    return 1;
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const savedId = localStorage.getItem('quiz_current_exam_id');
      const savedHistory = localStorage.getItem('quiz_exam_history');
      if (savedHistory && savedId) {
        const history: ExamRecord[] = JSON.parse(savedHistory);
        const match = history.find((e) => e.id === Number(savedId));
        if (match && Array.isArray(match.questions) && match.questions.length > 0) {
          return match.questions.map(sanitizeQuestion);
        }
      }
      const saved = localStorage.getItem('quiz_questions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.map(sanitizeQuestion);
      }
    } catch (e) {}
    return DEFAULT_QUESTIONS.map(sanitizeQuestion);
  });
  const [isExamBankOpen, setIsExamBankOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>(() => {
    try {
      const saved = localStorage.getItem('quiz_user_answers');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  const [timeRemaining, setTimeRemaining] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quiz_time_remaining');
      if (saved) return Number(saved);
    } catch (e) {}
    return 90 * 60; // 90 minutes
  });

  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quiz_is_owner_authenticated') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [isOwnerAuthModalOpen, setIsOwnerAuthModalOpen] = useState(false);
  const [isStarted, setIsStarted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('quiz_is_started');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return false;
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'question' | 'controls' | 'grid'>('question');

  const [playerInfo, setPlayerInfo] = useState<{name: string, className: string}>(() => {
    try {
      const saved = localStorage.getItem('quiz_player_info');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { name: '', className: '' };
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem('quiz_leaderboard');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [isGeneratingExam, setIsGeneratingExam] = useState(false);
  const [generatingStatus, setGeneratingStatus] = useState('');
  
  // Anti-cheat Proctoring State
  const [violationCount, setViolationCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quiz_violation_count');
      if (saved) return Number(saved);
    } catch (e) {}
    return 0;
  });
  const [violationLogs, setViolationLogs] = useState<ViolationLog[]>(() => {
    try {
      const saved = localStorage.getItem('quiz_violation_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  const [isViolationModalOpen, setIsViolationModalOpen] = useState(false);
  const [latestViolationReason, setLatestViolationReason] = useState('');
  const lastViolationTimeRef = useRef<number>(0);

  // Google Sheet Webhook Sync Integration
  const [isGoogleSheetModalOpen, setIsGoogleSheetModalOpen] = useState(false);
  const [googleSheetUrl, setGoogleSheetUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('quiz_google_sheet_url') || '';
    } catch (e) {
      return '';
    }
  });

  const handleSaveGoogleSheetUrl = (url: string) => {
    setGoogleSheetUrl(url);
    try {
      localStorage.setItem('quiz_google_sheet_url', url);
    } catch (e) {}
  };

  const syncSubmissionToGoogleSheet = async (data: {
    playerName: string;
    className: string;
    examTitle: string;
    score: number;
    partIScore: number;
    partIIScore: number;
    partIIIScore: number;
    totalCorrectPartI: number;
    totalCorrectPartII: number;
    totalCorrectPartIII: number;
    timeSpentSeconds: number;
    violationCount: number;
  }) => {
    const targetUrl = (googleSheetUrl || '').trim();
    if (!targetUrl) return;

    try {
      const payload = {
        timestamp: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
        ...data,
      };

      await fetch('/api/submit-to-google-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleSheetUrl: targetUrl,
          payload,
        }),
      }).catch(async () => {
        await fetch(targetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(payload),
        });
      });
    } catch (err) {
      console.warn('Could not sync to Google Sheet:', err);
    }
  };

  const [testResult, setTestResult] = useState<TestResult>({
    submitted: false,
    score: 0,
    partIScore: 0,
    partIIScore: 0,
    partIIIScore: 0,
    totalCorrectPartI: 0,
    totalCorrectPartII: 0,
    totalCorrectPartIII: 0,
    timeSpentSeconds: 0,
    violationCount: 0,
    violationLogs: [],
  });

  const appContainerRef = useRef<HTMLDivElement>(null);
  const currentQuestion = questions[currentQuestionIndex] || questions[0];

  const currentExam = examHistory.find((e) => e.id === currentExamId) || examHistory[0] || {
    id: 1,
    title: 'Đề 1',
    questions: DEFAULT_QUESTIONS,
    timestamp: Date.now(),
  };
  const currentExamTitle = currentExam.title;

  useEffect(() => {
    try {
      localStorage.setItem('quiz_current_exam_id', String(currentExamId));
    } catch (e) {}
  }, [currentExamId]);

  // Sync anti-cheat violations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quiz_violation_count', String(violationCount));
      localStorage.setItem('quiz_violation_logs', JSON.stringify(violationLogs));
    } catch (e) {}
  }, [violationCount, violationLogs]);

  // Sync state to localStorage for offline preservation
  useEffect(() => {
    try {
      localStorage.setItem('quiz_user_answers', JSON.stringify(userAnswers));
    } catch (e) {}
  }, [userAnswers]);

  useEffect(() => {
    try {
      localStorage.setItem('quiz_questions', JSON.stringify(questions));
    } catch (e) {}
  }, [questions]);

  useEffect(() => {
    try {
      localStorage.setItem('quiz_exam_history', JSON.stringify(examHistory));
    } catch (e) {}
  }, [examHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('quiz_time_remaining', String(timeRemaining));
    } catch (e) {}
  }, [timeRemaining]);

  useEffect(() => {
    try {
      localStorage.setItem('quiz_is_started', JSON.stringify(isStarted));
    } catch (e) {}
  }, [isStarted]);

  useEffect(() => {
    try {
      localStorage.setItem('quiz_player_info', JSON.stringify(playerInfo));
    } catch (e) {}
  }, [playerInfo]);

  // Auto unlock Web Audio on first mobile touch/click
  useEffect(() => {
    const unlockAudio = () => {
      soundFx.unlock();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });
    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  // Global shortcut for teacher / owner authentication (Ctrl+Shift+O or Alt+G)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && (e.key === 'O' || e.key === 'o')) || (e.altKey && (e.key === 'g' || e.key === 'G'))) {
        e.preventDefault();
        setIsOwnerAuthModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Anti-Cheat & Exam Proctoring: Detect Tab-Switching, Browser Blur, or Leaving the Test Screen
  useEffect(() => {
    // Proctoring is active only when student is actively taking the test
    if (!isStarted || isSubmitted || isTeacherMode) return;

    const triggerViolation = (type: 'TAB_SWITCH' | 'WINDOW_BLUR', reason: string) => {
      const now = Date.now();
      // Cooldown of 1500ms to prevent duplicate triggers between blur and visibilitychange
      if (now - lastViolationTimeRef.current < 1500) return;
      lastViolationTimeRef.current = now;

      const newLog: ViolationLog = {
        timestamp: now,
        type,
        description: reason,
      };

      setViolationCount((prev) => prev + 1);
      setViolationLogs((prev) => [newLog, ...prev]);
      setLatestViolationReason(reason);
      setIsViolationModalOpen(true);
      soundFx.playWarningAlert();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation(
          'TAB_SWITCH',
          'Rời khỏi màn hình bài thi (chuyển sang tab khác hoặc thu nhỏ trình duyệt)'
        );
      }
    };

    const handleWindowBlur = () => {
      triggerViolation(
        'WINDOW_BLUR',
        'Mất tiêu điểm cửa sổ làm bài (mở ứng dụng khác hoặc nhấp ra ngoài trình duyệt)'
      );
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isStarted, isSubmitted, isTeacherMode]);

  // Countdown timer interval
  useEffect(() => {
    if (isSubmitted || !isStarted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          calculateAndSubmitScore();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, isStarted]);

  // Handle option selection for Part I
  const handleSelectOptionPartI = (
    questionId: number,
    optionKey: 'A' | 'B' | 'C' | 'D'
  ) => {
    if (isSubmitted) return;
    if (!isStarted) {
      setIsStartModalOpen(true);
      return;
    }
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        partI: optionKey,
      },
    }));

    // Play audio feedback for correct/incorrect answer
    const q = questions.find((item) => item.id === questionId);
    if (q && q.section === 'PART_I') {
      if (optionKey === q.correctAnswer) {
        soundFx.playCorrect();
      } else {
        soundFx.playIncorrect();
      }
    }
  };

  // Handle statement toggle for Part II
  const handleSelectOptionPartII = (
    questionId: number,
    statementKey: 'a' | 'b' | 'c' | 'd',
    value: boolean
  ) => {
    if (isSubmitted) return;
    if (!isStarted) {
      setIsStartModalOpen(true);
      return;
    }
    setUserAnswers((prev) => {
      const prevPartII = prev[questionId]?.partII || {};
      return {
        ...prev,
        [questionId]: {
          ...prev[questionId],
          partII: {
            ...prevPartII,
            [statementKey]: value,
          },
        },
      };
    });

    // Play audio feedback for correct/incorrect statement selection
    const q = questions.find((item) => item.id === questionId);
    if (q && q.section === 'PART_II') {
      const stmt = q.statements.find((s) => s.key === statementKey);
      if (stmt) {
        if (value === stmt.correct) {
          soundFx.playCorrect();
        } else {
          soundFx.playIncorrect();
        }
      }
    }
  };

  // Handle input change for Part III
  const handleChangeAnswerPartIII = (questionId: number, value: string) => {
    if (isSubmitted) return; 
    if (!isStarted) {
      setIsStartModalOpen(true);
      return;
    }
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        partIII: value,
      },
    }));

    // Play audio feedback if user types correct answer
    const q = questions.find((item) => item.id === questionId);
    if (q && q.section === 'PART_III' && value.trim() !== '') {
      if (value.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        soundFx.playCorrect();
      }
    }
  };

  // Toggle audio sound
  const handleToggleSound = () => {
    setIsSoundEnabled((prev) => {
      const next = !prev;
      soundFx.enabled = next;
      return next;
    });
  };

  // Select question by ID
  const handleSelectQuestion = (id: number) => {
    const index = questions.findIndex((q) => q.id === id);
    if (index !== -1) {
      setCurrentQuestionIndex(index);
      setMobileTab('question');
    }
  };

  // Toggle Fullscreen
  const handleToggleFullscreen = () => {
    try {
      const elem = appContainerRef.current as any;
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        if (elem?.requestFullscreen) {
          elem.requestFullscreen().catch(() => {});
        } else if (elem?.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        }
      }
    } catch (e) {
      console.warn('Fullscreen API not supported');
    }
  };

  // Owner Authentication handlers
  const handleAuthenticateOwner = (pin: string): boolean => {
    const storedPin = localStorage.getItem('quiz_owner_pin') || '2027';
    if (pin === storedPin) {
      setIsOwnerAuthenticated(true);
      try {
        localStorage.setItem('quiz_is_owner_authenticated', 'true');
      } catch (e) {}
      return true;
    }
    return false;
  };

  const handleChangeOwnerPin = (oldPin: string, newPin: string): boolean => {
    const storedPin = localStorage.getItem('quiz_owner_pin') || '2027';
    if (oldPin === storedPin) {
      try {
        localStorage.setItem('quiz_owner_pin', newPin);
      } catch (e) {}
      return true;
    }
    return false;
  };

  const handleLogoutOwner = () => {
    setIsOwnerAuthenticated(false);
    setIsTeacherMode(false);
    try {
      localStorage.setItem('quiz_is_owner_authenticated', 'false');
    } catch (e) {}
  };

  // Toggle Teacher Mode (strictly for owner)
  const handleToggleTeacherMode = () => {
    if (!isOwnerAuthenticated) {
      setIsOwnerAuthModalOpen(true);
      return;
    }
    setIsTeacherMode((prev) => !prev);
  };

  // Open Word Import
  const handleOpenWordImport = () => {
    setIsWordModalOpen(true);
  };

  // Import questions from Word / text file
  const handleImportQuestions = (newQuestions: Question[], title?: string) => {
    const cleanQuestions = newQuestions.map(sanitizeQuestion);
    const newId = Date.now();
    const examTitle = title || `Đề ${examHistory.length + 1} (Tải lên)`;
    const newExam: ExamRecord = {
      id: newId,
      title: examTitle,
      questions: cleanQuestions,
      timestamp: Date.now(),
    };

    setExamHistory((prev) => [...prev, newExam]);
    setQuestions(cleanQuestions);
    setCurrentExamId(newId);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setTimeRemaining(90 * 60);
    setIsStarted(false);
    setIsSubmitted(false);
    setIsTeacherMode(false);
    setViolationCount(0);
    setViolationLogs([]);
    setTestResult({
      submitted: false,
      score: 0,
      partIScore: 0,
      partIIScore: 0,
      partIIIScore: 0,
      totalCorrectPartI: 0,
      totalCorrectPartII: 0,
      totalCorrectPartIII: 0,
      timeSpentSeconds: 0,
      violationCount: 0,
      violationLogs: [],
    });
    setIsWordModalOpen(false);
    soundFx.playCorrect();
  };

  // Generate similar exam variant from an existing exam
  const handleGenerateSimilarExam = async (baseExam: ExamRecord) => {
    if (!isOwnerAuthenticated) {
      setIsOwnerAuthModalOpen(true);
      return;
    }
    if (isGeneratingExam) return;
    setIsGeneratingExam(true);
    setGeneratingStatus('Đang phân tích ma trận kiến thức GDPT 2018 và tạo câu hỏi tương đương...');

    try {
      const nextIndex = examHistory.length + 1;
      const result = await generateSimilarExamAsync(
        baseExam.questions,
        baseExam.title,
        nextIndex,
        (msg) => setGeneratingStatus(msg)
      );

      const newId = Date.now();
      const cleanQuestions = result.questions.map(sanitizeQuestion);
      const newExam: ExamRecord = {
        id: newId,
        title: result.title,
        questions: cleanQuestions,
        timestamp: Date.now(),
      };

      const updatedHistory = [...examHistory, newExam];
      setExamHistory(updatedHistory);
      localStorage.setItem('quiz_exam_history', JSON.stringify(updatedHistory));

      setQuestions(cleanQuestions);
      localStorage.setItem('quiz_questions', JSON.stringify(cleanQuestions));

      setCurrentExamId(newId);
      localStorage.setItem('quiz_current_exam_id', String(newId));

      setUserAnswers({});
      localStorage.removeItem('quiz_user_answers');

      setCurrentQuestionIndex(0);
      setTimeRemaining(90 * 60);
      setIsStarted(false);
      setIsSubmitted(false);
      setIsTeacherMode(false);
      setTestResult({
        submitted: false,
        score: 0,
        partIScore: 0,
        partIIScore: 0,
        partIIIScore: 0,
        totalCorrectPartI: 0,
        totalCorrectPartII: 0,
        totalCorrectPartIII: 0,
        timeSpentSeconds: 0,
        violationCount: 0,
      });

      setIsExamBankOpen(false);
      soundFx.playCorrect();
    } catch (err) {
      console.error('Lỗi khi tạo đề tương tự:', err);
    } finally {
      setIsGeneratingExam(false);
      setGeneratingStatus('');
    }
  };

  // Delete an exam from bank
  const handleDeleteExam = (examId: number) => {
    if (!isOwnerAuthenticated) {
      setIsOwnerAuthModalOpen(true);
      return;
    }
    if (examHistory.length <= 1) return;
    const remaining = examHistory.filter((e) => e.id !== examId);
    setExamHistory(remaining);
    try {
      localStorage.setItem('quiz_exam_history', JSON.stringify(remaining));
    } catch (e) {}

    if (currentExamId === examId) {
      const nextExam = remaining[0];
      setQuestions(nextExam.questions.map(sanitizeQuestion));
      setCurrentExamId(nextExam.id);
      setUserAnswers({});
      setCurrentQuestionIndex(0);
      setTimeRemaining(90 * 60);
      setIsStarted(false);
      setIsSubmitted(false);
      setIsTeacherMode(false);
      setViolationCount(0);
      setViolationLogs([]);
      setTestResult({
        submitted: false,
        score: 0,
        partIScore: 0,
        partIIScore: 0,
        partIIIScore: 0,
        totalCorrectPartI: 0,
        totalCorrectPartII: 0,
        totalCorrectPartIII: 0,
        timeSpentSeconds: 0,
        violationCount: 0,
        violationLogs: [],
      });
    }
    soundFx.playClick();
  };

  // Rename an exam in bank
  const handleRenameExam = (examId: number, newTitle: string) => {
    if (!isOwnerAuthenticated) {
      setIsOwnerAuthModalOpen(true);
      return;
    }
    setExamHistory((prev) =>
      prev.map((e) => (e.id === examId ? { ...e, title: newTitle } : e))
    );
  };

  // Select a past exam from bank
  const handleSelectHistoryExam = (exam: ExamRecord) => {
    if (exam.id === currentExamId) {
      setIsExamBankOpen(false);
      return;
    }
    setQuestions(exam.questions.map(sanitizeQuestion));
    setCurrentExamId(exam.id);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setTimeRemaining(90 * 60);
    setIsStarted(false);
    setIsSubmitted(false);
    setIsTeacherMode(false);
    setViolationCount(0);
    setViolationLogs([]);
    setTestResult({
      submitted: false,
      score: 0,
      partIScore: 0,
      partIIScore: 0,
      partIIIScore: 0,
      totalCorrectPartI: 0,
      totalCorrectPartII: 0,
      totalCorrectPartIII: 0,
      timeSpentSeconds: 0,
      violationCount: 0,
      violationLogs: [],
    });
    setIsExamBankOpen(false);
    soundFx.playClick();
  };

  const handleSaveScore = (scoreData: { playerName: string, className?: string, score: number, timeSpentSeconds: number, violationCount?: number, examTitle?: string }) => {
    const entry: LeaderboardEntry = {
      playerName: scoreData.playerName,
      className: scoreData.className,
      score: scoreData.score,
      timeSpentSeconds: scoreData.timeSpentSeconds,
      date: Date.now(),
      violationCount: scoreData.violationCount || 0,
      examTitle: scoreData.examTitle || currentExamTitle,
    };
    
    setLeaderboard(prev => {
      const newList = [...prev, entry].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.timeSpentSeconds - b.timeSpentSeconds; // lower time is better
      }).slice(0, 10);
      
      try {
        localStorage.setItem('quiz_leaderboard', JSON.stringify(newList));
      } catch(e) {}
      
      return newList;
    });
  };

  // Reset Test for SubmitModal
  const handleReset = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setTimeRemaining(90 * 60);
    setIsStarted(false);
    setIsSubmitted(false);
    setViolationCount(0);
    setViolationLogs([]);
    setTestResult({
      submitted: false,
      score: 0,
      partIScore: 0,
      partIIScore: 0,
      partIIIScore: 0,
      totalCorrectPartI: 0,
      totalCorrectPartII: 0,
      totalCorrectPartIII: 0,
      timeSpentSeconds: 0,
      violationCount: 0,
      violationLogs: [],
    });
  };

  // Calculate score and submit
  const calculateAndSubmitScore = () => {
    let p1Correct = 0;
    let p1Score = 0;

    let p2CorrectFull = 0;
    let p2Score = 0;

    let p3Correct = 0;
    let p3Score = 0;

    questions.forEach((q) => {
      const ans = userAnswers[q.id];

      if (q.section === 'PART_I') {
        if (ans?.partI === q.correctAnswer) {
          p1Correct += 1;
          p1Score += 0.25;
        }
      } else if (q.section === 'PART_II') {
        if (ans?.partII) {
          let correctStmts = 0;
          q.statements.forEach((stmt) => {
            if (ans.partII?.[stmt.key] === stmt.correct) {
              correctStmts += 1;
            }
          });

          if (correctStmts === 1) p2Score += 0.1;
          else if (correctStmts === 2) p2Score += 0.25;
          else if (correctStmts === 3) p2Score += 0.5;
          else if (correctStmts === 4) {
            p2Score += 1.0;
            p2CorrectFull += 1;
          }
        }
      } else if (q.section === 'PART_III') {
        if (
          ans?.partIII &&
          ans.partIII.trim().toLowerCase() ===
            q.correctAnswer.trim().toLowerCase()
        ) {
          p3Correct += 1;
          p3Score += 0.5;
        }
      }
    });

    const totalScore = Math.min(10, p1Score + p2Score + p3Score);
    const timeSpent = 90 * 60 - timeRemaining;

    const result: TestResult = {
      submitted: true,
      score: totalScore,
      partIScore: p1Score,
      partIIScore: p2Score,
      partIIIScore: p3Score,
      totalCorrectPartI: p1Correct,
      totalCorrectPartII: p2CorrectFull,
      totalCorrectPartIII: p3Correct,
      timeSpentSeconds: timeSpent,
      violationCount: violationCount,
      violationLogs: violationLogs,
    };

    setTestResult(result);
    setIsSubmitted(true);
    setIsModalOpen(true);
    setTimeRemaining(90 * 60); // Reset timer to 90:00

    // Play victory celebration fanfare and launch fireworks
    soundFx.playCelebration();
    fireSubmissionConfetti(totalScore);

    // Auto-save score if we have player info
    if (playerInfo.name) {
      handleSaveScore({
        playerName: playerInfo.name,
        className: playerInfo.className,
        score: totalScore,
        timeSpentSeconds: timeSpent,
        violationCount: violationCount,
        examTitle: currentExamTitle,
      });
    }

    // Auto-sync results to Google Sheet if Webhook URL is configured
    syncSubmissionToGoogleSheet({
      playerName: playerInfo.name || 'Thí sinh',
      className: playerInfo.className || '',
      examTitle: currentExamTitle,
      score: totalScore,
      partIScore: p1Score,
      partIIScore: p2Score,
      partIIIScore: p3Score,
      totalCorrectPartI: p1Correct,
      totalCorrectPartII: p2CorrectFull,
      totalCorrectPartIII: p3Correct,
      timeSpentSeconds: timeSpent,
      violationCount: violationCount,
    });
  };

  // Format timer for mobile top bar
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Helper to check if question is answered for quick selector
  const isQuestionAnswered = (id: number) => {
    const ans = userAnswers[id];
    if (!ans) return false;
    if (ans.partI !== undefined) return true;
    if (ans.partII && Object.keys(ans.partII).length > 0) return true;
    if (ans.partIII !== undefined && ans.partIII.trim() !== '') return true;
    return false;
  };

  return (
    <div
      ref={appContainerRef}
      className="min-h-screen w-full bg-[#020617] text-slate-100 flex flex-col items-center justify-start lg:justify-center p-2 sm:p-3 selection:bg-amber-400 selection:text-black font-sans pb-safe pt-safe"
    >
      {/* DESKTOP TOP HEADER */}
      <div className="w-full max-w-7xl hidden lg:block mb-3 rounded-2xl overflow-hidden shadow-xl border border-[#1e345e]/80">
        <Header
          currentExamTitle={currentExamTitle}
          totalQuestions={questions.length}
          onOpenExamBank={() => setIsExamBankOpen(true)}
          examCount={examHistory.length}
        />
      </div>

      {/* MOBILE STICKY TOP BAR & VIEW SWITCHER (ONLY ON MOBILE < LG) */}
      <div className="w-full max-w-7xl lg:hidden flex flex-col gap-2 mb-2 sticky top-0 z-30 bg-[#020617]/95 backdrop-blur pt-1 pb-1 border-b border-[#1e345e]/80">
        {/* Top Info Strip */}
        <div className="flex items-center justify-between bg-[#040a1c] p-2 rounded-xl border border-[#1e345e]">
          {/* App Badge & Owner Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-extrabold text-sm sm:text-base">🏆</span>
            <button
              onClick={() => setIsOwnerAuthModalOpen(true)}
              className="text-xs font-bold text-[#facc15] font-serif uppercase tracking-wider truncate max-w-[150px] sm:max-w-none text-left cursor-pointer hover:underline"
              title="AI Là Triệu Phú Toán Học"
            >
              TRIỆU PHÚ TOÁN
            </button>
            {isOwnerAuthenticated && (
              <button
                onClick={() => setIsOwnerAuthModalOpen(true)}
                className="p-1 rounded-md text-[10px] font-bold border transition cursor-pointer flex items-center gap-0.5 bg-amber-400/20 text-amber-300 border-amber-400/60 shadow-sm animate-pulse"
                title="Chủ tài khoản (Đã đăng nhập)"
              >
                <span>👑</span>
              </button>
            )}
          </div>

          {/* Quick Question Selector Dropdown & Exam Bank Pill */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleOpenWordImport}
              className="bg-[#08122c] border border-cyan-400/80 text-cyan-300 font-bold text-xs rounded-lg px-2 py-1 flex items-center gap-1 hover:bg-[#12244a] cursor-pointer"
              title="Tạo đề bằng file Word"
            >
              <span className="text-[10px] bg-amber-400 text-slate-950 px-1 rounded font-black">WORD</span>
            </button>

            <button
              onClick={() => setIsExamBankOpen(true)}
              className="bg-[#08122c] border border-amber-400 text-[#facc15] font-bold text-xs rounded-lg px-2 py-1 flex items-center gap-1 hover:bg-[#12244a] cursor-pointer"
              title="Mở Ngân Hàng Đề Thi"
            >
              <span>📚</span>
              <span className="truncate max-w-[80px] sm:max-w-[120px]">
                {currentExamTitle}
              </span>
            </button>

            <select
              value={currentQuestion ? currentQuestion.id : 1}
              onChange={(e) => handleSelectQuestion(Number(e.target.value))}
              className="bg-[#08122c] border border-amber-400/80 text-amber-300 font-bold text-xs rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
            >
              {questions.map((q) => {
                const answered = isQuestionAnswered(q.id);
                return (
                  <option key={q.id} value={q.id} className="bg-[#0f172a] text-slate-100">
                    Câu {q.id} {answered ? '✓' : ''}
                  </option>
                );
              })}
            </select>

            {/* Timer Badge */}
            <div className="px-2.5 py-1 rounded-lg bg-[#030712] border border-amber-400/80 text-amber-300 font-mono font-bold text-xs tracking-wider">
              ⏱️ {formattedTime}
            </div>

            {/* Mobile Anti-Cheat Alert Pill */}
            {isStarted && !isSubmitted && !isTeacherMode && (
              <button
                onClick={() => setIsViolationModalOpen(true)}
                className={`px-2 py-1 rounded-lg border text-[11px] font-black flex items-center gap-1 cursor-pointer transition-all ${
                  violationCount === 0
                    ? 'bg-emerald-950/80 border-emerald-500/70 text-emerald-300'
                    : 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                }`}
                title={violationCount === 0 ? 'Hệ thống giám sát đang bật' : `Cảnh báo: Đã vi phạm ${violationCount} lần!`}
              >
                <span>{violationCount === 0 ? '🛡️' : '🚨'}</span>
                <span>{violationCount === 0 ? '0 VP' : `${violationCount} VP`}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 bg-[#040a1c] p-1 rounded-xl border border-[#1e345e]">
          <button
            onClick={() => setMobileTab('question')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1 ${
              mobileTab === 'question'
                ? 'bg-[#facc15] text-[#0f172a] shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>📝</span>
            <span>CÂU HỎI</span>
          </button>

          <button
            onClick={() => setMobileTab('controls')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1 ${
              mobileTab === 'controls'
                ? 'bg-[#facc15] text-[#0f172a] shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>⚙️</span>
            <span>ĐIỀU KHIỂN</span>
          </button>

          <button
            onClick={() => setMobileTab('grid')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1 ${
              mobileTab === 'grid'
                ? 'bg-[#facc15] text-[#0f172a] shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>📊</span>
            <span>DANH SÁCH</span>
          </button>
        </div>
      </div>

      {/* 3-Column Container Layout */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* Column 1 (Left Panel - Control Panel) */}
        <div
          className={`lg:col-span-3 w-full flex order-2 lg:order-1 ${
            mobileTab === 'controls' ? 'block' : 'hidden lg:flex'
          }`}
        >
          <LeftPanel
            currentQuestionId={currentQuestion ? currentQuestion.id : 1}
            onSelectQuestion={handleSelectQuestion}
            timeRemainingSeconds={timeRemaining}
            onSubmit={calculateAndSubmitScore}
            onStart={() => setIsStartModalOpen(true)}
            isStarted={isStarted}
            onToggleFullscreen={handleToggleFullscreen}
            onToggleTeacherMode={handleToggleTeacherMode}
            isTeacherMode={isOwnerAuthenticated && isTeacherMode}
            onToggleSound={handleToggleSound}
            isSoundEnabled={isSoundEnabled}
            onOpenWordImport={handleOpenWordImport}
            onOpenExamBank={() => setIsExamBankOpen(true)}
            currentExamTitle={currentExamTitle}
            userAnswers={userAnswers}
            questions={questions}
            isSubmitted={isSubmitted}
            examHistory={examHistory}
            onSelectHistoryExam={handleSelectHistoryExam}
            currentExamId={currentExamId}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            isOwnerAuthenticated={isOwnerAuthenticated}
            onOpenOwnerAuth={() => setIsOwnerAuthModalOpen(true)}
            onLogoutOwner={handleLogoutOwner}
            violationCount={violationCount}
            onOpenViolationLogs={() => setIsViolationModalOpen(true)}
            onOpenGoogleSheet={() => setIsGoogleSheetModalOpen(true)}
          />
        </div>

        {/* Column 2 (Middle Panel - Header Title, Question Content, Diagram, Options) */}
        <div
          className={`lg:col-span-6 w-full flex order-1 lg:order-2 ${
            mobileTab === 'question' ? 'block' : 'hidden lg:flex'
          }`}
        >
          {currentQuestion && (
            <MiddlePanel
              question={currentQuestion}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              currentExamTitle={currentExamTitle}
              userAnswers={userAnswers}
              onSelectOptionPartI={handleSelectOptionPartI}
              onSelectOptionPartII={handleSelectOptionPartII}
              onChangeAnswerPartIII={handleChangeAnswerPartIII}
              onPrev={() =>
                setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
              }
              onNext={() =>
                setCurrentQuestionIndex((prev) =>
                  Math.min(questions.length - 1, prev + 1)
                )
              }
              isTeacherMode={isOwnerAuthenticated && isTeacherMode}
              isSubmitted={isSubmitted}
              onOpenOwnerAuth={() => setIsOwnerAuthModalOpen(true)}
              isStarted={isStarted}
              violationCount={violationCount}
              onOpenViolationLogs={() => setIsViolationModalOpen(true)}
            />
          )}
        </div>

        {/* Column 3 (Right Panel - Exam Info & Question Grid) */}
        <div
          className={`lg:col-span-3 w-full flex order-3 lg:order-3 ${
            mobileTab === 'grid' ? 'block' : 'hidden lg:flex'
          }`}
        >
          <RightPanel
            testResult={testResult}
            isTeacherMode={isOwnerAuthenticated && isTeacherMode}
            questions={questions}
            currentQuestionId={currentQuestion ? currentQuestion.id : 1}
            onSelectQuestion={handleSelectQuestion}
            userAnswers={userAnswers}
            isOwnerAuthenticated={isOwnerAuthenticated}
            onOpenOwnerAuth={() => setIsOwnerAuthModalOpen(true)}
            currentExamTitle={currentExamTitle}
            onOpenExamBank={() => setIsExamBankOpen(true)}
          />
        </div>
      </div>

      {/* Submission Result Modal */}
      <SubmitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        result={testResult}
        onReview={() => setIsTeacherMode(true)}
        onRestart={handleReset}
        onSaveScore={() => {}} // Saved automatically
        currentExamTitle={currentExamTitle}
        hasGoogleSheetSynced={Boolean(googleSheetUrl)}
      />

      <Leaderboard 
        isOpen={isLeaderboardOpen} 
        onClose={() => setIsLeaderboardOpen(false)} 
        entries={leaderboard} 
      />

      {/* Word File Import Modal */}
      <WordImportModal
        isOpen={isWordModalOpen}
        onClose={() => setIsWordModalOpen(false)}
        onImportQuestions={handleImportQuestions}
        defaultExamTitle={`Đề ${examHistory.length + 1}`}
      />

      {/* Exam Bank Modal (Available for all players & teacher) */}
      <ExamBankModal
        isOpen={isExamBankOpen}
        onClose={() => setIsExamBankOpen(false)}
        exams={examHistory}
        currentExamId={currentExamId}
        onSelectExam={handleSelectHistoryExam}
        onGenerateSimilar={handleGenerateSimilarExam}
        onDeleteExam={handleDeleteExam}
        onRenameExam={handleRenameExam}
        onOpenWordImport={handleOpenWordImport}
        isOwnerAuthenticated={isOwnerAuthenticated}
        onOpenOwnerAuth={() => setIsOwnerAuthModalOpen(true)}
        isGenerating={isGeneratingExam}
        generatingStatus={generatingStatus}
      />

      {/* Owner Authentication Modal */}
      <OwnerAuthModal
        isOpen={isOwnerAuthModalOpen}
        onClose={() => setIsOwnerAuthModalOpen(false)}
        isOwnerAuthenticated={isOwnerAuthenticated}
        onAuthenticate={handleAuthenticateOwner}
        onChangePin={handleChangeOwnerPin}
        onLogout={handleLogoutOwner}
        onOpenGoogleSheet={() => setIsGoogleSheetModalOpen(true)}
      />

      {/* Google Sheet Sync Modal */}
      <GoogleSheetModal
        isOpen={isGoogleSheetModalOpen}
        onClose={() => setIsGoogleSheetModalOpen(false)}
        sheetUrl={googleSheetUrl}
        onSaveSheetUrl={handleSaveGoogleSheetUrl}
      />

      <StartModal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        currentExamTitle={currentExamTitle}
        totalQuestions={questions.length}
        onOpenExamBank={() => setIsExamBankOpen(true)}
        onStart={(name, className) => {
          setPlayerInfo({ name, className });
          setIsStartModalOpen(false);
          setIsStarted(true);
        }}
      />

      {/* Anti-Cheat Violation Warning Modal */}
      <ViolationWarningModal
        isOpen={isViolationModalOpen}
        onClose={() => setIsViolationModalOpen(false)}
        violationCount={violationCount}
        latestViolationReason={latestViolationReason}
        violationLogs={violationLogs}
      />
    </div>
  );
}
