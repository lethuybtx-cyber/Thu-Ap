import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

// Master character class for all vertical bars, box lines, block elements, PUA/MathType cursors
const VBAR_REGEX_STR = '[\\|\\u00A6\\u01C0-\\u01C3\\u2016\\u2223\\u2225\\u23D0\\u23B8\\u23B9\\u2500-\\u257F\\u2580-\\u259F\\u2758-\\u275E\\uFE31-\\uFE34\\uFF5C\\uFFE8\\uFFED\\uFFEE]';

// Shared Sanitization helper for Mathematical and Vietnamese OCR artifacts
function sanitizeMathStr(str: string): string {
  if (!str) return '';
  let s = String(str);

  // 1. Remove zero-width & invisible control characters
  s = s.replace(/[\uFEFF\u200B\u200C\u200D\u200E\u200F\u00AD\u0007\u000B\u000C\u0008\u0002\u0003\u0019\u001F\u001E\u2060\u180E]/g, '');

  // 2. Remove private use area / MathType font artifacts
  s = s.replace(/[\uF000-\uF8FF\uE000-\uF8FF]/g, '');

  // 3. Remove all box-drawing and block vertical bars commonly left over by Word tables, cursors or MathType
  s = s.replace(/[\u2500-\u257F\u2580-\u259F\u2758-\u275E\uFFE8\u00A6\u01C0-\u01C3\u23D0\u23B8\u23B9\uFE31-\uFE34\uFF5C\uFFED\uFFEE]/g, '');

  // 4. Remove HTML entities for vertical bar
  s = s.replace(/&(?:vert|#124|#x7C|#x2502|#9474|vbar|mid|parallel);/gi, ' ');

  // 5. Remove pipes adjacent to math delimiters: "$ |", "| $", "$|", "|$", "$$ |", "| $$"
  s = s.replace(new RegExp(`\\${'{1,2}'}\\s*${VBAR_REGEX_STR}+`, 'g'), (m) => m.replace(new RegExp(VBAR_REGEX_STR, 'g'), '').trim());
  s = s.replace(new RegExp(`${VBAR_REGEX_STR}+\\s*\\${'{1,2}'}`, 'g'), (m) => m.replace(new RegExp(VBAR_REGEX_STR, 'g'), '').trim());

  // 6. Remove pipes after/before differential terms e.g. "dx . |", "dx.|", "dx |", "dt . |", "dy |"
  s = s.replace(new RegExp(`\\b(d[xyztuvw])\\s*(\\.*)\\s*${VBAR_REGEX_STR}+`, 'gi'), '$1$2');

  // 7. Remove orphan pipe '|' after/before punctuation (e.g. ". |", ": |", "? |", "; |", ", |", ") |", ".|", " . | ")
  s = s.replace(new RegExp(`([\\.?!;:,])\\s*${VBAR_REGEX_STR}+`, 'g'), '$1');
  s = s.replace(new RegExp(`${VBAR_REGEX_STR}+\\s*([\\.?!;:,])`, 'g'), '$1');
  s = s.replace(new RegExp(`([\\.?!;:,])\\s*${VBAR_REGEX_STR}+\\s*$`, 'g'), '$1');

  // 8. Remove pipes after closed parentheses, brackets, or braces (e.g. ") |", "] |", "} |", ") . |")
  s = s.replace(new RegExp(`([\\)\\]\\}])\\s*(\\.*)\\s*${VBAR_REGEX_STR}+`, 'g'), '$1$2');

  // 9. Remove any pipe surrounded by spaces or between words (e.g. "hình phẳng | giới hạn", "ba nghiệm | phân biệt", "bằng | ")
  s = s.replace(new RegExp(`([a-zA-Zà-ỹÀ-Ỹ0-9]{2,})\\s+${VBAR_REGEX_STR}+\\s+([a-zA-Zà-ỹÀ-Ỹ0-9]{2,})`, 'g'), '$1 $2');
  s = s.replace(new RegExp(`\\s+${VBAR_REGEX_STR}+\\s+`, 'g'), ' ');

  // 10. Strip trailing and leading pipes
  s = s.replace(new RegExp(`\\s*${VBAR_REGEX_STR}+\\s*$`, 'gm'), '');
  s = s.replace(new RegExp(`^\\s*${VBAR_REGEX_STR}+\\s*`, 'gm'), '');
  s = s.replace(new RegExp(`\\s*${VBAR_REGEX_STR}+\\s*$`, 'g'), '');
  s = s.replace(new RegExp(`^\\s*${VBAR_REGEX_STR}+\\s*`, 'g'), '');

  s = s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\{<\}/g, ' < ')
    .replace(/\{>\}/g, ' > ');

  // Repair Vietnamese missing letters
  s = s.replace(/\b([Cc]ác|[Hh]ai|[Mm]ột|[Nn]hững|[Vv]ới|[Cc]ho|[Cc]ủa|[Bbi]ết|[Bb]ởi|[Vv]à)\s+([ưƯ]ờng)\b/g, '$1 đ$2');
  s = s.replace(/\b([Tt]hu|[Nn]hận|[Tt]ìm|[Đđ]ạt|[Kk]hông)\s+([ưƯ]ợc)\b/g, '$1 đ$2');
  s = s.replace(/\b([Tt]rên)\s+([đĐ]ọan)\b/g, '$1 đoạn');
  s = s.replace(/\b([đĐ]ọan)\b/g, 'đoạn');
  s = s.replace(/\bham\s+s[oö]\b/gi, 'hàm số');
  s = s.replace(/\bcho\s+ham\s+s[oö]\b/gi, 'cho hàm số');

  // Fix MathType OCR corruptions where \left| was stripped to \left f(x) \right] or \left f\left(x\right)\right]
  s = s.replace(
    /\\left\s*f\s*\\left\(\s*x\s*\\right\)\s*\\right(?:\]|\)|\}|\||\.)?/g,
    '\\left| f(x) \\right|'
  );
  s = s.replace(
    /\\left\s*f\s*\(\s*x\s*\)\s*\\right(?:\]|\)|\}|\||\.)?/g,
    '\\left| f(x) \\right|'
  );
  s = s.replace(/\\left\s*([fguhyPQRST]\s*(?:\([^)]+\)|\\left\([^)]+\\right\)))\s*\\right(?:\]|\)|\}|\||\.)?/g, '\\left| $1 \\right|');
  s = s.replace(/\\left\s*f\b/g, '\\left| f');

  // Convert piecewise arrays to cases
  s = s.replace(
    /\\left\\{\s*\\begin\{array\}(?:\{[^{}]*\})?([\s\S]*?)\\end\{array\}\s*\\right\.?/g,
    '\\begin{cases}$1\\end{cases}'
  );
  s = s.replace(/\\begin\{array\}\s*\{\s*\*\s*\{[0-9]+\}\s*\{[a-zA-Z]+\}\s*\}/g, '\\begin{cases}');
  s = s.replace(/\\end\{array\}/g, '\\end{cases}');

  // Fix integral limits
  s = s.replace(/\\int\s*\\limit_\{?([0-9a-zA-Z\-]+)\}?\^\{?([0-9a-zA-Z\-]+)\}?/g, '\\int_{$1}^{$2}');
  s = s.replace(/\\int\s*\\limit\^\{?([0-9a-zA-Z\-]+)\}?_\{?([0-9a-zA-Z\-]+)\}?/g, '\\int_{$2}^{$1}');
  s = s.replace(/\\int\s*\\limits_\{?([0-9a-zA-Z\-]+)\}?\^\{?([0-9a-zA-Z\-]+)\}?/g, '\\int_{$1}^{$2}');
  s = s.replace(/\\limit_\{?([0-9a-zA-Z\-]+)\}?\^\{?([0-9a-zA-Z\-]+)\}?/g, '_{$1}^{$2}');
  s = s.replace(/\\limit_\{?([0-9a-zA-Z\-]+)\}?/g, '_{$1}');
  s = s.replace(/\\limit\^\{?([0-9a-zA-Z\-]+)\}?/g, '^{$1}');
  s = s.replace(/\\limit\b/g, '\\limits');

  // Fix fractional exponent without braces or ^
  s = s.replace(/([a-zA-Z0-9\)])\s*(\^)?\s*\\frac\{([0-9]+)\}\{([0-9]+)\}/g, '$1^{\\frac{$3}{$4}}');

  // Fix and normalize vectors (B'\grave{C} -> \overrightarrow{B'C}, AA\grave{'} -> \overrightarrow{AA'}, etc.)
  s = s.replace(/([A-Z]['A-Z0-9]{1,5})\u20D7/g, '\\overrightarrow{$1}');
  s = s.replace(/([a-z])\u20D7/g, '\\vec{$1}');
  s = s.replace(/[\u20D6\u20D7]/g, '');

  s = s.replace(/([A-Z]['0-9]*)\s*\\(?:grave|acute)\s*\{([A-Z]['0-9]*)\}/g, '\\overrightarrow{$1$2}');
  s = s.replace(/([A-Z]['A-Z0-9]*)\s*\\(?:grave|acute)\s*\{\s*\\?\'\s*\}/g, "\\overrightarrow{$1'}");
  s = s.replace(/([A-Z]['A-Z0-9]*)\s*\\(?:grave|acute)\s*\{\s*\}/g, '\\overrightarrow{$1}');
  s = s.replace(/\\(?:grave|acute)\s*\{([A-Z]['A-Z0-9]{1,5})\}/g, '\\overrightarrow{$1}');
  s = s.replace(/([A-Z]['A-Z0-9]+)\s*\\(?:grave|acute)\b/g, '\\overrightarrow{$1}');

  s = s.replace(/([uvwijkabnx0e])\s*\\(?:grave|acute)\s*\{\s*\}/g, '\\vec{$1}');
  s = s.replace(/\\(?:grave|acute)\s*\{([uvwijkabnx0e])\}/g, '\\vec{$1}');

  s = s.replace(/([A-Z]['A-Z0-9]{1,5})\s*\^\s*(?:\{\\rightarrow\}|\\rightarrow|→|\{→\})/g, '\\overrightarrow{$1}');
  s = s.replace(/([a-z])\s*\^\s*(?:\{\\rightarrow\}|\\rightarrow|→|\{→\})/g, '\\vec{$1}');

  s = s.replace(/\\vec\s*\{([A-Z])\}\s*([A-Z]'?)/g, '\\overrightarrow{$1$2}');
  s = s.replace(/\\vec\s*\{([A-Z]'?)\}\s*([A-Z]'?)/g, '\\overrightarrow{$1$2}');
  s = s.replace(/\\vec\s*\{([A-Z]['A-Z0-9]{1,5})\}/g, '\\overrightarrow{$1}');
  s = s.replace(/\\overrightarrow\s*\{\\overrightarrow\s*\{([^}]+)\}\}/g, '\\overrightarrow{$1}');

  // Strip again any trailing stray pipes or dots
  s = s.replace(/\\(mid|vert|vbar|parallel)\s*$/g, '');
  s = s.replace(/([\.?!;:,])\s*(\\mid|\\vert|\\vbar|\\parallel|\|)+\s*$/g, '$1');
  s = s.replace(new RegExp(`([\\.?!;:,])\\s*${VBAR_REGEX_STR}+`, 'g'), '$1');
  s = s.replace(new RegExp(`${VBAR_REGEX_STR}+\\s*([\\.?!;:,])`, 'g'), '$1');
  s = s.replace(new RegExp(`\\s*${VBAR_REGEX_STR}+\\s*$`, 'g'), '');
  s = s.replace(new RegExp(`^\\s*${VBAR_REGEX_STR}+\\s*`, 'g'), '');
  s = s.replace(new RegExp(`\\b(d[xyztuvw])\\s*(\\.*)\\s*${VBAR_REGEX_STR}+$`, 'gi'), '$1$2');

  return s.trim();
}

function normalizeAndSanitizeQuestions(rawQuestions: any[]): any[] {
  return rawQuestions.map((q: any, idx: number) => {
    const id = idx + 1;
    let section = q.section;
    if (!section) {
      if (id <= 12) section = 'PART_I';
      else if (id <= 16) section = 'PART_II';
      else section = 'PART_III';
    }

    const rawText = sanitizeMathStr(q.text || q.questionText || `Câu hỏi ${id}`);
    const rawExplanation = sanitizeMathStr(q.explanation || 'Hướng dẫn giải chi tiết.');

    // Sanitize diagramType / imageUrl
    let validDiagram: string | undefined = undefined;
    if (q.diagramType && typeof q.diagramType === 'string') {
      const trimmed = q.diagramType.trim();
      if (
        trimmed.startsWith('<svg') ||
        trimmed.startsWith('data:image/') ||
        trimmed.startsWith('http://') ||
        trimmed.startsWith('https://')
      ) {
        validDiagram = trimmed;
      }
    }

    if (section === 'PART_I' || id <= 12) {
      const opts =
        q.options && q.options.length === 4
          ? q.options.map((opt: any) => ({
              key: opt.key,
              text: sanitizeMathStr(opt.text),
            }))
          : [
              { key: 'A', text: 'Phương án A' },
              { key: 'B', text: 'Phương án B' },
              { key: 'C', text: 'Phương án C' },
              { key: 'D', text: 'Phương án D' },
            ];
      return {
        id,
        section: 'PART_I',
        sectionTitle: 'PHẦN I: Trắc nghiệm (1-12)',
        text: rawText,
        diagramType: validDiagram,
        imageUrl: q.imageUrl,
        options: opts,
        correctAnswer: q.correctAnswer || 'A',
        explanation: rawExplanation,
      };
    } else if (section === 'PART_II' || (id >= 13 && id <= 16)) {
      const stmts =
        q.statements && q.statements.length === 4
          ? q.statements.map((stmt: any) => ({
              key: stmt.key,
              text: sanitizeMathStr(stmt.text),
              correct: Boolean(stmt.correct),
            }))
          : [
              { key: 'a', text: 'Mệnh đề a', correct: true },
              { key: 'b', text: 'Mệnh đề b', correct: false },
              { key: 'c', text: 'Mệnh đề c', correct: true },
              { key: 'd', text: 'Mệnh đề d', correct: false },
            ];
      return {
        id,
        section: 'PART_II',
        sectionTitle: 'PHẦN II: Đúng / Sai (13-16)',
        text: rawText,
        diagramType: validDiagram,
        imageUrl: q.imageUrl,
        statements: stmts,
        explanation: rawExplanation,
      };
    } else {
      return {
        id,
        section: 'PART_III',
        sectionTitle: 'PHẦN III: Trả lời ngắn (17-22)',
        text: rawText,
        diagramType: validDiagram,
        imageUrl: q.imageUrl,
        correctAnswer: sanitizeMathStr(String(q.correctAnswer || '0')).trim(),
        explanation: rawExplanation,
      };
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // Lazy / Safe Gemini initialization
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY });
  });

  // API: AI Generate Similar Exam
  app.post('/api/generate-similar-exam', async (req, res) => {
    try {
      const { baseTitle, questions, newExamIndex } = req.body;
      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ error: 'Danh sách câu hỏi đề gốc không hợp lệ.' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error: 'Chưa cấu hình GEMINI_API_KEY trên server.',
          fallbackRequired: true,
        });
      }

      // Compact representation of base questions for prompt
      const condensedQuestions = questions.map((q: any, idx: number) => {
        if (q.section === 'PART_I') {
          return {
            num: idx + 1,
            section: 'PART_I',
            text: q.text,
            options: q.options?.map((o: any) => `${o.key}. ${o.text}`).join(' | '),
            correctAnswer: q.correctAnswer,
          };
        } else if (q.section === 'PART_II') {
          return {
            num: idx + 1,
            section: 'PART_II',
            text: q.text,
            statements: q.statements?.map((s: any) => `${s.key}) ${s.text} [${s.correct ? 'ĐÚNG' : 'SAI'}]`).join(' | '),
          };
        } else {
          return {
            num: idx + 1,
            section: 'PART_III',
            text: q.text,
            correctAnswer: q.correctAnswer,
          };
        }
      });

      const prompt = `Bạn là chuyên gia thẩm định và biên soạn đề thi Tốt nghiệp THPT môn Toán theo chuẩn Chương trình GDPT 2018.
Dưới đây là một đề thi Toán gốc gồm 22 câu hỏi (Đề: "${baseTitle || 'Đề 1'}").

NHIỆM VỤ CỦA BẠN:
Biên soạn một ĐỀ THI MỚI HOÀN TOÀN TƯƠNG ĐƯƠNG VỀ DẠNG TOÁN VÀ MA TRẬN nhưng:
1. KHÁC BIỆT VỀ SỐ LIỆU, THAM SỐ, ĐỒ THỊ/TỌA ĐỘ VÀ BỐI CẢNH THỰC TẾ so với đề gốc.
2. TUYỆT ĐỐI CHÍNH XÁC VỀ MẶT TOÁN HỌC:
   - Các phép tính phải chuẩn xác 100%.
   - Số liệu thực tế có ý nghĩa (xác suất thuộc [0; 1], khoảng cách/độ dài dương, nghiệm phương trình thực tế hợp lý, không để mẫu số bằng 0).
   - Đáp án đúng và các phương án nhiễu phải được tính toán chính xác, hợp lý.
3. ĐÚNG CHUẨN CẤU TRÚC 22 CÂU MÔN TOÁN GDPT 2018:
   - PHẦN I (Câu 1 đến Câu 12): Trắc nghiệm 4 lựa chọn (A, B, C, D) - có đúng 1 đáp án đúng.
   - PHẦN II (Câu 13 đến Câu 16): Trắc nghiệm Đúng/Sai, mỗi câu có đúng 4 ý (a, b, c, d) với giá trị đúng/sai rõ ràng.
   - PHẦN III (Câu 17 đến Câu 22): Trả lời ngắn, kết quả là một số nguyên hoặc số thập phân.
4. Công thức toán học sử dụng cú pháp LaTeX chuẩn được đặt trong dấu $...$ (ví dụ: $f'(x)$, $\\int_0^1 x dx$, $\\vec{u}=(1;2;3)$).
5. Ký hiệu véc-tơ: BẮT BUỘC dùng $\\overrightarrow{AB}$, $\\overrightarrow{AC}$, $\\overrightarrow{AA'}$, $\\overrightarrow{B'C}$ cho véc-tơ tạo bởi 2 điểm, và $\\vec{u}$, $\\vec{v}$, $\\vec{i}$, $\\vec{j}$, $\\vec{k}$ cho véc-tơ 1 chữ cái. TUYỆT ĐỐI KHÔNG dùng dấu \\grave, \\acute, \\bar hay ký tự nối thay thế véc-tơ.

DỮ LIỆU ĐỀ GỐC:
${JSON.stringify(condensedQuestions, null, 2)}

Hãy xuất dữ liệu đề thi mới dưới dạng JSON theo đúng schema quy định.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'Bạn là chuyên gia khảo thí và biên soạn đề thi môn Toán THPT Quốc gia Việt Nam chuẩn GDPT 2018. Luôn xuất JSON hợp lệ, toán học chuẩn xác 100%.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Tiêu đề đề thi mới' },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.INTEGER },
                    section: {
                      type: Type.STRING,
                      enum: ['PART_I', 'PART_II', 'PART_III'],
                    },
                    sectionTitle: { type: Type.STRING },
                    text: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          key: { type: Type.STRING, enum: ['A', 'B', 'C', 'D'] },
                          text: { type: Type.STRING },
                        },
                        required: ['key', 'text'],
                      },
                    },
                    correctAnswer: { type: Type.STRING },
                    statements: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          key: { type: Type.STRING, enum: ['a', 'b', 'c', 'd'] },
                          text: { type: Type.STRING },
                          correct: { type: Type.BOOLEAN },
                        },
                        required: ['key', 'text', 'correct'],
                      },
                    },
                    explanation: { type: Type.STRING },
                  },
                  required: ['id', 'section', 'text', 'explanation'],
                },
              },
            },
            required: ['title', 'questions'],
          },
        },
      });

      const rawJson = response.text?.trim() || '';
      const parsedData = JSON.parse(rawJson);

      const formattedTitle =
        parsedData.title && !parsedData.title.startsWith('Đề')
          ? `Đề ${newExamIndex || 2} - ${parsedData.title}`
          : parsedData.title || `Đề ${newExamIndex || 2} (Phát triển từ ${baseTitle})`;

      // Normalize questions to match our Question types with complete sanitization
      const normalizedQuestions = normalizeAndSanitizeQuestions(parsedData.questions || []);

      return res.json({
        title: formattedTitle,
        questions: normalizedQuestions,
        isAiGenerated: true,
      });
    } catch (err: any) {
      console.error('Error generating similar exam with Gemini:', err);
      return res.status(500).json({
        error: err.message || 'Lỗi xử lý tạo đề tương tự.',
        fallbackRequired: true,
      });
    }
  });

  // API: AI Parse Exam Document (PDF / Word / Text) into Part I (1-12), Part II (1-4), Part III (1-6)
  app.post('/api/parse-exam-document', async (req, res) => {
    try {
      const { rawText, fileBase64, mimeType, fileName } = req.body;
      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error: 'Chưa cấu hình GEMINI_API_KEY trên server.',
          fallbackRequired: true,
        });
      }

      if (!rawText && !fileBase64) {
        return res.status(400).json({ error: 'Vui lòng cung cấp nội dung văn bản hoặc file đề thi.' });
      }

      const contents: any[] = [];
      if (fileBase64 && mimeType) {
        contents.push({
          inlineData: {
            data: fileBase64,
            mimeType: mimeType,
          },
        });
      }

      const promptText = `Bạn là chuyên gia thẩm định và số hóa đề thi Tốt nghiệp THPT môn Toán (chuẩn GDPT 2018).
Dưới đây là một tài liệu đề thi (File hoặc Văn bản).

NHIỆM VỤ CỦA BẠN:
Bóc tách, nhận dạng và cấu trúc hóa toàn bộ đề thi thành 22 câu hỏi theo đúng cấu trúc 3 phần dựa vào chữ "PHẦN I", "PHẦN II", "PHẦN III":
1. PHẦN I (Câu 1 đến Câu 12): Các câu hỏi nằm dưới tiêu đề "PHẦN I" (hoặc "PHẦN 1", "PHẦN THỨ NHẤT", "I. TRẮC NGHIỆM"). Trắc nghiệm 4 lựa chọn (A, B, C, D) - có duy nhất 1 đáp án đúng.
2. PHẦN II (Câu 1 đến Câu 4): Các câu hỏi nằm dưới tiêu đề "PHẦN II" (hoặc "PHẦN 2", "PHẦN THỨ HAI", "II. TRẮC NGHIỆM ĐÚNG SAI"). Trắc nghiệm Đúng/Sai, mỗi câu gồm 4 ý (a, b, c, d) có tính đúng/sai.
3. PHẦN III (Câu 1 đến Câu 6): Các câu hỏi nằm dưới tiêu đề "PHẦN III" (hoặc "PHẦN 3", "PHẦN THỨ BA", "III. TRẮC NGHIỆM TRẢ LỜI NGẮN"). Trắc nghiệm trả lời ngắn (kết quả là số nguyên hoặc số thập phân).

QUY TẮC ĐÁNH SỐ & CẤU TRÚC:
- Dù trong tài liệu gốc mỗi phần đánh số bắt đầu từ Câu 1 (Phần I: Câu 1..12, Phần II: Câu 1..4, Phần III: Câu 1..6) HOẶC đánh số liên tục 1..22 (Câu 1..12, Câu 13..16, Câu 17..22), bạn đều phải xuất ra đúng 22 câu hỏi với ID tuần tự:
  + ID 1 đến 12: tương ứng 12 câu của PHẦN I (section: "PART_I")
  + ID 13 đến 16: tương ứng 4 câu của PHẦN II (section: "PART_II")
  + ID 17 đến 22: tương ứng 6 câu của PHẦN III (section: "PART_III")

QUY TẮC BẮT BUỘC VỀ TOÁN HỌC VÀ LATEX:
- Mọi biến số, biểu thức, phương trình, công thức (như $a$, $x$, $y$, $f(x)$, $F(x)$, $\\int_a^b f(x)dx$, $P = a^{\\frac{1}{3}} \\cdot \\sqrt{a}$) BẮT BUỘC phải kẹp giữa 2 dấu $...$.
- Lũy thừa phân số: BẮT BUỘC có dấu ^ và đóng mở ngoặc nhọn quanh phân số: $a^{\\frac{1}{3}}$, $a^{\\frac{1}{6}}$, $a^{\\frac{4}{3}}$, $a^{\\frac{5}{6}}$, $a^{\\frac{2}{5}}$. TUYỆT ĐỐI KHÔNG viết dạng không có ^ hay thiếu dấu $.
- Tích phân: BẮT BUỘC viết dạng chuẩn $\\int_{a}^{b} f(x)dx$. TUYỆT ĐỐI KHÔNG dùng \\limit, \\limits hay để rời rạc ngoài dấu $.
- Ký hiệu véc-tơ: BẮT BUỘC dùng $\\overrightarrow{AB}$, $\\overrightarrow{AC}$, $\\overrightarrow{AA'}$, $\\overrightarrow{B'C}$ cho véc-tơ 2 điểm và $\\vec{u}$, $\\vec{v}$, $\\vec{i}$, $\\vec{j}$, $\\vec{k}$ cho véc-tơ 1 chữ cái. TUYỆT ĐỐI KHÔNG để lỗi \\grave, \\acute, \\bar hay ký tự nối thay thế véc-tơ.
- Hàm số chia nhánh / hệ: BẮT BUỘC dùng môi trường standard $\\begin{cases} ... \\end{cases}$ (ví dụ: $f(x) = \\begin{cases} -x(x-4) & \\text{khi } 0 \\le x < 4 \\\\ x-4 & \\text{khi } 4 \\le x \\le 8 \\end{cases}$). TUYỆT ĐỐI KHÔNG dùng \\begin{array}{*{35}{l}}.
- Chính tả tiếng Việt: Luôn đảm bảo giữ nguyên và phục hồi đúng toàn bộ dấu tiếng Việt (ví dụ: 'đường', 'thu được', 'đoạn', 'hàm số', 'mặt phẳng', 'xác suất').

QUY TẮC QUAN TRỌNG VỀ HÌNH VẼ / HÌNH ẢNH:
- Nếu câu hỏi trong tài liệu gốc KHÔNG CÓ hình vẽ, bạn TUYỆT ĐỐI KHÔNG ĐƯỢC TỰ Ý THÊM HÌNH VẼ, không gán diagramType hay imageUrl (phải bỏ trống hoặc để null). Giữ nguyên câu hỏi thuần túy như bản gốc.
- Không tự suy diễn thêm hình minh họa chỉ vì câu hỏi có chữ 'hình chóp', 'lăng trụ', 'đồ thị', 'bảng biến thiên' nếu đề gốc không có hình đính kèm.

- Nếu trong đề có đáp án (gạch chân, in đậm, bảng đáp án ở cuối, hoặc lời giải), hãy trích xuất chính xác đáp án. Nếu đề chưa có đáp án, hãy tự giải toán chuẩn xác để điền đáp án đúng và lời giải chi tiết.
- Trích xuất tên đề thi phù hợp từ tiêu đề file/tài liệu (ví dụ: "${fileName ? fileName.replace(/\.[^/.]+$/, '') : 'Đề thi THPT Quốc Gia'}").
${rawText ? `\n\nNỘI DUNG VĂN BẢN TRÍCH XUẤT:\n${rawText}` : ''}`;

      contents.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: contents,
        config: {
          systemInstruction:
            'Bạn là chuyên gia khảo thí và biên soạn đề thi môn Toán THPT Việt Nam chuẩn GDPT 2018. Luôn xuất JSON hợp lệ, toán học chuẩn xác 100%.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Tên đề thi' },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.INTEGER },
                    section: {
                      type: Type.STRING,
                      enum: ['PART_I', 'PART_II', 'PART_III'],
                    },
                    sectionTitle: { type: Type.STRING },
                    text: { type: Type.STRING },
                    diagramType: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          key: { type: Type.STRING, enum: ['A', 'B', 'C', 'D'] },
                          text: { type: Type.STRING },
                        },
                        required: ['key', 'text'],
                      },
                    },
                    correctAnswer: { type: Type.STRING },
                    statements: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          key: { type: Type.STRING, enum: ['a', 'b', 'c', 'd'] },
                          text: { type: Type.STRING },
                          correct: { type: Type.BOOLEAN },
                        },
                        required: ['key', 'text', 'correct'],
                      },
                    },
                    explanation: { type: Type.STRING },
                  },
                  required: ['id', 'section', 'text', 'explanation'],
                },
              },
            },
            required: ['title', 'questions'],
          },
        },
      });

      const rawJson = response.text?.trim() || '';
      const parsedData = JSON.parse(rawJson);

      const formattedTitle =
        parsedData.title ||
        (fileName ? fileName.replace(/\.[^/.]+$/, '') : 'Đề thi số hóa AI');

      // Normalize questions to match our Question types with complete sanitization
      const normalizedQuestions = normalizeAndSanitizeQuestions(parsedData.questions || []);

      return res.json({
        title: formattedTitle,
        questions: normalizedQuestions,
        isAiParsed: true,
      });
    } catch (err: any) {
      console.error('Error parsing exam document with Gemini:', err);
      return res.status(500).json({
        error: err.message || 'Lỗi bóc tách đề thi bằng AI.',
        fallbackRequired: true,
      });
    }
  });

  // API: Proxy submit to Google Sheet (Apps Script Web App)
  app.post('/api/submit-to-google-sheet', async (req, res) => {
    try {
      const { googleSheetUrl, payload } = req.body;
      if (!googleSheetUrl || typeof googleSheetUrl !== 'string') {
        return res.status(400).json({ error: 'Chưa cung cấp Google Sheet Webhook URL' });
      }

      const response = await fetch(googleSheetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload || {}),
      });

      const responseText = await response.text();
      let responseData: any = {};
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = { status: 'success', raw: responseText };
      }

      return res.json({
        success: true,
        message: responseData.message || 'Đã ghi kết quả vào Google Sheet thành công!',
        data: responseData,
      });
    } catch (err: any) {
      console.error('Error forwarding to Google Sheet Apps Script:', err);
      return res.status(500).json({
        error: err.message || 'Lỗi khi gửi dữ liệu tới Google Apps Script.',
      });
    }
  });

  // Vite middleware for development vs static files for production
  let currentFile = '';
  try {
    currentFile = typeof __filename !== 'undefined' ? __filename : fileURLToPath(import.meta.url);
  } catch {
    currentFile = '';
  }

  const isProduction =
    process.env.NODE_ENV === 'production' ||
    currentFile.includes('dist') ||
    currentFile.endsWith('.cjs');

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
