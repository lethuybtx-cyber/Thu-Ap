export type SectionType = 'PART_I' | 'PART_II' | 'PART_III';

export interface QuestionPartI {
  id: number;
  section: 'PART_I';
  sectionTitle: string;
  questionText: string;
  diagramType?: string;
  imageUrl?: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface QuestionPartII {
  id: number;
  section: 'PART_II';
  sectionTitle: string;
  questionText: string;
  diagramType?: string;
  imageUrl?: string;
  statements: {
    key: 'a' | 'b' | 'c' | 'd';
    text: string;
    correct: boolean;
  }[];
  explanation: string;
}

export interface QuestionPartIII {
  id: number;
  section: 'PART_III';
  sectionTitle: string;
  questionText: string;
  diagramType?: string;
  imageUrl?: string;
  correctAnswer: string; // numerical value or short string
  explanation: string;
}

export type Question = QuestionPartI | QuestionPartII | QuestionPartIII;

export interface UserAnswers {
  [questionId: number]: {
    partI?: 'A' | 'B' | 'C' | 'D';
    partII?: { [key in 'a' | 'b' | 'c' | 'd']?: boolean };
    partIII?: string;
  };
}

export interface ViolationLog {
  timestamp: number;
  type: 'TAB_SWITCH' | 'WINDOW_BLUR' | 'FULLSCREEN_EXIT';
  description: string;
}

export interface TestResult {
  submitted: boolean;
  score: number; // Max 10
  partIScore: number;
  partIIScore: number;
  partIIIScore: number;
  totalCorrectPartI: number;
  totalCorrectPartII: number;
  totalCorrectPartIII: number;
  timeSpentSeconds: number;
  violationCount: number;
  violationLogs?: ViolationLog[];
}

export interface ExamRecord {
  id: number;
  title: string;
  questions: Question[];
  timestamp: number;
}
export interface LeaderboardEntry {
  playerName: string;
  className?: string;
  score: number;
  timeSpentSeconds: number;
  date: number;
  violationCount?: number;
  examTitle?: string;
}
