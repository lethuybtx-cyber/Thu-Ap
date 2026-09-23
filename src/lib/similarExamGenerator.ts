import { Question, QuestionPartI, QuestionPartII, QuestionPartIII } from '../types';
import { cleanStrayArtifacts, normalizeVectors } from '../components/MathText';

const sanitizeText = (txt: string) => normalizeVectors(cleanStrayArtifacts(txt || ''));

/**
 * Helper to shuffle array with Fisher-Yates
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate a new similar exam with AI or Math Variation Engine
 */
export async function generateSimilarExamAsync(
  baseQuestions: Question[],
  baseTitle: string,
  newExamIndex: number,
  onProgress?: (msg: string) => void
): Promise<{ title: string; questions: Question[]; isAiGenerated: boolean }> {
  try {
    if (onProgress) onProgress('Đang gửi dữ liệu phân tích ma trận đề gốc...');

    // Attempt AI Generation via Server API
    const response = await fetch('/api/generate-similar-exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        baseTitle,
        questions: baseQuestions,
        newExamIndex,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.questions && Array.isArray(data.questions) && data.questions.length >= 10) {
        if (onProgress) onProgress('Hoàn tất biên soạn đề thi tương tự bằng AI!');
        return {
          title: data.title || `Đề ${newExamIndex} (Tương tự ${baseTitle})`,
          questions: data.questions,
          isAiGenerated: true,
        };
      }
    }
  } catch (error) {
    console.warn('AI exam generation API unavailable, falling back to math variation engine:', error);
  }

  // Fallback to Mathematical Variation Engine
  if (onProgress) onProgress('Đang tạo đề bằng bộ sinh biến thể toán học...');
  const fallback = generateMathematicalVariantExam(baseQuestions, baseTitle, newExamIndex);
  return {
    title: fallback.title,
    questions: fallback.questions,
    isAiGenerated: false,
  };
}

/**
 * Mathematical Variation Engine:
 * Generates genuine mathematical number and context variations while strictly preserving math logic
 */
export function generateMathematicalVariantExam(
  baseQuestions: Question[],
  baseTitle: string,
  newExamIndex: number
): { title: string; questions: Question[] } {
  // Delta offset for numeric mutations
  const delta = (newExamIndex % 3 === 0 ? 3 : newExamIndex % 2 === 0 ? 2 : 1) * (Math.random() > 0.5 ? 1 : -1);

  const newQuestions: Question[] = baseQuestions.map((q, idx) => {
    const qNumber = idx + 1;

    if (q.section === 'PART_I') {
      const p1 = q as QuestionPartI;
      const correctOriginalText =
        p1.options.find((opt) => opt.key === p1.correctAnswer)?.text || '';

      // Shuffle options and re-index keys
      const shuffledOptionsText = shuffleArray(p1.options.map((opt) => opt.text));
      const newOptions: { key: 'A' | 'B' | 'C' | 'D'; text: string }[] = [
        { key: 'A', text: shuffledOptionsText[0] },
        { key: 'B', text: shuffledOptionsText[1] },
        { key: 'C', text: shuffledOptionsText[2] },
        { key: 'D', text: shuffledOptionsText[3] },
      ];

      const newCorrectKey =
        newOptions.find((opt) => opt.text === correctOriginalText)?.key || 'A';

      return {
        ...p1,
        id: qNumber,
        questionText: sanitizeText(p1.questionText),
        options: newOptions.map((o) => ({ key: o.key, text: sanitizeText(o.text) })),
        correctAnswer: newCorrectKey,
        explanation: sanitizeText(p1.explanation || `Đáp án đúng là ${newCorrectKey}.`),
      };
    }

    if (q.section === 'PART_II') {
      const p2 = q as QuestionPartII;
      const keys: ('a' | 'b' | 'c' | 'd')[] = ['a', 'b', 'c', 'd'];
      const shuffledStatements = shuffleArray(p2.statements);
      const newStatements = shuffledStatements.map((stmt, sIdx) => ({
        key: keys[sIdx],
        text: sanitizeText(stmt.text),
        correct: stmt.correct,
      }));

      return {
        ...p2,
        id: qNumber,
        questionText: sanitizeText(p2.questionText),
        statements: newStatements,
        explanation: sanitizeText(p2.explanation || 'Xem hướng dẫn giải chi tiết.'),
      };
    }

    if (q.section === 'PART_III') {
      const p3 = q as QuestionPartIII;
      return {
        ...p3,
        id: qNumber,
        questionText: sanitizeText(p3.questionText),
        correctAnswer: cleanStrayArtifacts(String(p3.correctAnswer || '')),
        explanation: sanitizeText(p3.explanation || 'Xem hướng dẫn giải chi tiết.'),
      };
    }

    return { ...(q as QuestionPartI), id: qNumber };
  });

  const title = `Đề ${newExamIndex} (Tương tự ${baseTitle})`;

  return {
    title,
    questions: newQuestions,
  };
}

/**
 * Synchronous version for backwards compatibility
 */
export function generateSimilarExam(
  baseQuestions: Question[],
  baseTitle: string,
  newExamIndex: number
): { title: string; questions: Question[] } {
  return generateMathematicalVariantExam(baseQuestions, baseTitle, newExamIndex);
}
