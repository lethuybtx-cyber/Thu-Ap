import mammoth from 'mammoth/mammoth.browser.js';
import * as pdfjsLib from 'pdfjs-dist';
import { Question } from '../types';
import { normalizeVectors } from '../components/MathText';

// Set up pdf.js worker for browser execution
if (typeof window !== 'undefined' && (pdfjsLib as any).GlobalWorkerOptions) {
  (pdfjsLib as any).GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;
}

export const SAMPLE_WORD_FORMAT = `==== ĐỀ THI TRẮC NGHIỆM MẪU (CHUẨN GDPT 2018) ====

PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn (Thí sinh trả lời từ câu 1 đến câu 12)

Câu 1. Cho hàm số $y = f(x)$ có bảng biến thiên trên đoạn $[-2; 3]$. Tìm giá trị lớn nhất $M$ của $f(x)$ trên $[-2; 3]$.
[Hình vẽ: GRAPH]
A. $M = 5$.
B. $M = 3$.
C. $M = -2$.
D. $M = 0$.
Đáp án: A
Lời giải: Dựa vào đồ thị/bảng biến thiên, giá trị cao nhất của hàm số trên đoạn $[-2; 3]$ là $y = 5$ tại $x = 1$.

Câu 2. Tập xác định $D$ của hàm số $y = \\log_2(x - 3)$ là:
A. $D = (3; +\\infty)$.
B. $D = [3; +\\infty)$.
C. $D = (-\\infty; 3)$.
D. $D = \\mathbb{R} \\setminus \\{3\\}$.
Đáp án: A
Lời giải: Hàm số logarit xác định khi $x - 3 > 0 \\Leftrightarrow x > 3$.

Câu 3. Trong không gian $Oxyz$, cho điểm $M(2; 3; 4)$. Tìm tọa độ hình chiếu vuông góc $H$ của $M$ trên mặt phẳng $(Oxy)$.
[Hình vẽ: OXYZ]
A. $H(2; 3; 0)$.
B. $H(0; 0; 4)$.
C. $H(2; 0; 0)$.
D. $H(0; 3; 0)$.
Đáp án: A
Lời giải: Hình chiếu của $M(x, y, z)$ lên mặt phẳng $(Oxy)$ giữ nguyên $x, y$ và cho $z = 0$.

... (Từ Câu 4 đến Câu 12 tương tự)

PHẦN II. Câu trắc nghiệm Đúng/Sai (Thí sinh trả lời từ câu 1 đến câu 4)

Câu 1. Cho hàm số $f(x) = x^3 - 3x + 2$. Xét tính đúng sai của các mệnh đề sau:
a) Hàm số $f(x)$ có hai điểm cực trị. [Đúng]
b) Giá trị cực đại của hàm số bằng $4$. [Đúng]
c) Hàm số nghịch biến trên khoảng $(-1; 1)$. [Đúng]
d) Đồ thị hàm số cắt trục tung tại điểm $(0; 1)$. [Sai]
Lời giải: $f'(x) = 3x^2 - 3 = 0 \\Leftrightarrow x = \\pm 1$. $f(1) = 0$, $f(-1) = 4$. Đồ thị cắt $Oy$ tại $(0; 2)$.

Câu 2. Cho hình hộp chữ nhật $ABCD.A'B'C'D'$ có $AB = 3, AD = 4, AA' = 5$. Xét tính đúng/sai:
a) Thể tích khối hộp bằng $60$. [Đúng]
b) Đường chéo $AC' = 5\\sqrt{2}$. [Đúng]
c) Khoảng cách giữa $AB$ và $C'D'$ bằng $5$. [Đúng]
d) Diện tích toàn phần bằng $94$. [Đúng]
Lời giải: $V = 3 \\cdot 4 \\cdot 5 = 60$, $AC' = \\sqrt{3^2+4^2+5^2} = 5\\sqrt{2}$.

... (Câu 3 và Câu 4 của Phần II tương tự)

PHẦN III. Câu trắc nghiệm trả lời ngắn (Thí sinh trả lời từ câu 1 đến câu 6)

Câu 1. Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình vuông cạnh $a$, $SA \\perp (ABCD)$ và $SA = a\\sqrt{3}$. Tính số đo góc giữa đường thẳng $SD$ và mặt phẳng $(ABCD)$ theo độ.
[Hình vẽ: PYRAMID_SABCD]
Đáp số: 60
Lời giải: $SA \\perp (ABCD)$ nên góc giữa $SD$ và $(ABCD)$ là góc $\\widehat{SDA}$. $\\tan \\widehat{SDA} = \\frac{SA}{AD} = \\sqrt{3} \\Rightarrow \\widehat{SDA} = 60^\\circ$.

Câu 2. Một đội văn nghệ có 5 học sinh nam và 7 học sinh nữ. Có bao nhiêu cách chọn ra một ban đại diện gồm 3 học sinh sao cho có cả nam và nữ?
Đáp số: 175
Lời giải: Số cách chọn bất kì $C_{12}^3 = 220$. Trừ 3 nam ($C_5^3=10$) và 3 nữ ($C_7^3=35$), còn $220 - 10 - 35 = 175$.

... (Từ Câu 3 đến Câu 6 của Phần III tương tự)`;

/**
 * Extract raw text from a .docx / .txt File using Mammoth
 */
export async function extractTextFromDocx(file: File): Promise<string> {
  if (file.name.endsWith('.txt')) {
    return await file.text();
  }

  const arrayBuffer = await file.arrayBuffer();
  try {
    const result = await mammoth.convertToHtml(
      { arrayBuffer },
      {
        styleMap: ["u => u", "strike => s"],
        convertImage: (mammoth.images as any).inline((element: any) => {
          return element.read('base64').then((imageBuffer: string) => {
            return {
              src: `data:${element.contentType};base64,${imageBuffer}`,
            };
          });
        }),
      }
    );

    let html = result.value || '';
    // Replace <img> tags with [Hình ảnh: data:...]
    html = html.replace(/<img\s+[^>]*?src=["']?([^"'\s>]+)["']?[^>]*?>/gi, '\n[Hình ảnh: $1]\n');
    html = html.replace(/<u>(.*?)<\/u>/gi, "[U]$1[/U]");
    // Clean html tags to plain text lines
    html = html
      .replace(/<\/p>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
    return html;
  } catch (err) {
    // Fallback to raw text extraction
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }
}

/**
 * Extract raw text from a .pdf File using pdfjs-dist
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  try {
    const loadingTask = (pdfjsLib as any).getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });
    const pdf = await loadingTask.promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => (typeof item.str === 'string' ? item.str : ''))
        .join(' ');
      fullText += `\n--- TRANG ${i} ---\n` + pageText + '\n';
    }
    return fullText;
  } catch (err: any) {
    console.warn('Local PDF parse fallback error:', err);
    throw new Error('Không thể đọc trực tiếp văn bản từ file PDF (có thể là file scan hoặc bị mã hóa). Vui lòng dùng tính năng "Quét đề AI" bên dưới để đọc tài liệu tự động.');
  }
}

/**
 * Convert a File into a base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1] || result;
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * AI Smart Exam Parser using Server Gemini endpoint /api/parse-exam-document
 */
export async function aiParseExamDocumentAsync(params: {
  file?: File;
  rawText?: string;
  fileName?: string;
}): Promise<{ questions: Question[]; title?: string; isAiParsed?: boolean }> {
  let fileBase64: string | undefined = undefined;
  let mimeType: string | undefined = undefined;

  if (params.file) {
    fileBase64 = await fileToBase64(params.file);
    mimeType = params.file.type;
    if (!mimeType) {
      if (params.file.name.endsWith('.pdf')) mimeType = 'application/pdf';
      else if (params.file.name.endsWith('.docx'))
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      else if (params.file.name.endsWith('.txt')) mimeType = 'text/plain';
    }
  }

  const response = await fetch('/api/parse-exam-document', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      rawText: params.rawText,
      fileBase64,
      mimeType,
      fileName: params.fileName || params.file?.name,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Lỗi từ máy chủ khi bóc tách đề (${response.status})`);
  }

  const data = await response.json();
  return {
    questions: data.questions || [],
    title: data.title,
    isAiParsed: true,
  };
}

/**
 * Helper to download sample format file (.txt)
 */
export function downloadSampleFormatFile() {
  const blob = new Blob([SAMPLE_WORD_FORMAT], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'De_Thi_Mau_THPT_Chuan_3_Phan.txt';
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Detect explicit section header keyword from a line
 */
export function detectSectionHeader(line: string): 'PART_I' | 'PART_II' | 'PART_III' | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // 1. Check PART III first (III, 3, Thứ ba, Trả lời ngắn)
  if (
    /(?:^|[^\w\d])(?:PHẦN|Phần|PART)\s*(?:III|3|THỨ\s*(?:BA|3|III)|BA)\b/i.test(trimmed) ||
    /^(?:III|3)\s*[\.\:\-]\s*(?:PHẦN|CÂU\s*HỎI|TRẢ\s*LỜI\s*NGẮN|TRẮC\s*NGHIỆM\s*TRẢ\s*LỜI\s*NGẮN)/i.test(trimmed) ||
    /^(?:PHẦN\s*THỨ\s*BA|TRẮC\s*NGHIỆM\s*TRẢ\s*LỜI\s*NGẮN\s*\(PHẦN\s*III\)|PHẦN\s*3\b)/i.test(trimmed)
  ) {
    return 'PART_III';
  }

  // 2. Check PART II second (II, 2, Thứ hai, Đúng Sai)
  if (
    /(?:^|[^\w\d])(?:PHẦN|Phần|PART)\s*(?:II|2|THỨ\s*(?:HAI|2|II)|HAI)\b/i.test(trimmed) ||
    /^(?:II|2)\s*[\.\:\-]\s*(?:PHẦN|CÂU\s*HỎI|TRẮC\s*NGHIỆM\s*ĐÚNG\s*SAI|ĐÚNG\s*SAI)/i.test(trimmed) ||
    /^(?:PHẦN\s*THỨ\s*HAI|TRẮC\s*NGHIỆM\s*ĐÚNG\s*SAI\s*\(PHẦN\s*II\)|PHẦN\s*2\b)/i.test(trimmed)
  ) {
    return 'PART_II';
  }

  // 3. Check PART I third (I, 1, Thứ nhất, Nhiều lựa chọn)
  if (
    /(?:^|[^\w\d])(?:PHẦN|Phần|PART)\s*(?:I|1|THỨ\s*(?:NHẤT|1|I)|MỘT)\b/i.test(trimmed) ||
    /^(?:I|1)\s*[\.\:\-]\s*(?:PHẦN|CÂU\s*HỎI|TRẮC\s*NGHIỆM\s*NHIỀU\s*LỰA\s*CHỌN|TRẮC\s*NGHIỆM)/i.test(trimmed) ||
    /^(?:PHẦN\s*THỨ\s*NHẤT|TRẮC\s*NGHIỆM\s*NHIỀU\s*LỰA\s*CHỌN\s*\(PHẦN\s*I\)|PHẦN\s*1\b)/i.test(trimmed)
  ) {
    return 'PART_I';
  }

  return null;
}

/**
 * Parse raw text into array of Question items supporting:
 * - PHẦN I: Câu 1 -> 12 (hoặc 1..12)
 * - PHẦN II: Câu 1 -> 4 (hoặc 13..16) -> maps to IDs 13..16
 * - PHẦN III: Câu 1 -> 6 (hoặc 17..22) -> maps to IDs 17..22
 */
export function parseExamText(rawText: string): { questions: Question[]; errors: string[] } {
  const errors: string[] = [];
  const questions: Question[] = [];

  if (!rawText || rawText.trim().length === 0) {
    return { questions: [], errors: ['Nội dung file rỗng hoặc không có văn bản.'] };
  }

  // Normalize lines
  const rawLines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  let currentSection: 'PART_I' | 'PART_II' | 'PART_III' = 'PART_I';
  const sectionCounts = { PART_I: 0, PART_II: 0, PART_III: 0 };

  interface RawQuestionBlock {
    globalId: number; // 1 to 22
    localNum: number;
    section: 'PART_I' | 'PART_II' | 'PART_III';
    lines: string[];
  }

  const questionBlocks: RawQuestionBlock[] = [];
  let currentBlockLines: string[] = [];
  let currentLocalNum = 0;
  let currentGlobalId = 0;
  let currentBlockSection: 'PART_I' | 'PART_II' | 'PART_III' = 'PART_I';

  for (let i = 0; i < rawLines.length; i++) {
    let line = rawLines[i];

    // Detect explicit section header (PHẦN I, PHẦN II, PHẦN III)
    const detectedSec = detectSectionHeader(line);
    if (detectedSec) {
      currentSection = detectedSec;
      // If the line only contains the header, skip it
      if (!/(?:Câu|Bài|Câu\s*hỏi)\s*\d+/i.test(line)) {
        continue;
      }
      // If the line contains both header and "Câu X", strip the header part
      line = line
        .replace(/(?:PHẦN|Phần|PART)\s*(?:[I123]|II|III|THỨ\s*(?:NHẤT|HAI|BA|1|2|3))[^\.\:\n]*[\.\:\-]?\s*/gi, '')
        .trim();
    }

    // Match "Câu 1.", "Câu 1:", "Câu 1 ", "Bài 1.", "Câu hỏi 1."
    const qMatch = line.match(/^(?:Câu|Bài|Câu\s*hỏi)\s*(\d+)[\.\:]?\s*(.*)/i);
    if (qMatch) {
      if (currentBlockLines.length > 0 && currentGlobalId > 0) {
        questionBlocks.push({
          globalId: currentGlobalId,
          localNum: currentLocalNum,
          section: currentBlockSection,
          lines: [...currentBlockLines],
        });
      }

      const num = parseInt(qMatch[1], 10);
      currentLocalNum = num;

      // Smart Section Auto-Transition if no explicit section header was provided:
      if (currentSection === 'PART_I') {
        if (num >= 13 && num <= 16) {
          currentSection = 'PART_II';
        } else if (num >= 17) {
          currentSection = 'PART_III';
        } else if (num === 1 && sectionCounts.PART_I >= 10) {
          // A second "Câu 1" after ~10-12 questions of Part I -> automatically Part II
          currentSection = 'PART_II';
        }
      } else if (currentSection === 'PART_II') {
        if (num >= 17) {
          currentSection = 'PART_III';
        } else if (num === 1 && sectionCounts.PART_II >= 3) {
          // A "Câu 1" after Part II -> automatically Part III
          currentSection = 'PART_III';
        }
      }

      currentBlockSection = currentSection;

      // Calculate global ID (1 to 22)
      if (currentSection === 'PART_I') {
        currentGlobalId = num >= 1 && num <= 12 ? num : sectionCounts.PART_I + 1;
        sectionCounts.PART_I++;
      } else if (currentSection === 'PART_II') {
        if (num >= 1 && num <= 4) {
          currentGlobalId = 12 + num; // 13..16
        } else if (num >= 13 && num <= 16) {
          currentGlobalId = num; // 13..16
        } else {
          currentGlobalId = 12 + (sectionCounts.PART_II + 1);
        }
        sectionCounts.PART_II++;
      } else {
        // PART_III
        if (num >= 1 && num <= 6) {
          currentGlobalId = 16 + num; // 17..22
        } else if (num >= 17 && num <= 22) {
          currentGlobalId = num; // 17..22
        } else {
          currentGlobalId = 16 + (sectionCounts.PART_III + 1);
        }
        sectionCounts.PART_III++;
      }

      currentBlockLines = [line];
    } else {
      if (currentGlobalId > 0) {
        currentBlockLines.push(line);
      }
    }
  }

  // Push last block
  if (currentBlockLines.length > 0 && currentGlobalId > 0) {
    questionBlocks.push({
      globalId: currentGlobalId,
      localNum: currentLocalNum,
      section: currentBlockSection,
      lines: [...currentBlockLines],
    });
  }

  if (questionBlocks.length === 0) {
    errors.push('Không tìm thấy các câu hỏi theo định dạng "Câu 1.", "Câu 2.", ... trong tài liệu.');
    return { questions: [], errors };
  }

  // Parse each question block
  questionBlocks.forEach((block) => {
    try {
      const q = parseSingleQuestionBlock(block.globalId, block.section, block.lines);
      if (q) {
        questions.push(q);
      }
    } catch (e: any) {
      errors.push(`Lỗi khi xử lý Câu ${block.localNum} (${block.section}): ${e?.message || 'Không rõ'}`);
    }
  });

  return { questions, errors };
}

function parseSingleQuestionBlock(
  id: number,
  section: 'PART_I' | 'PART_II' | 'PART_III',
  lines: string[]
): Question {
  const fullBlockText = lines.join('\n');

  // Extract real embedded Image from Word file or explicit image tag [Hình ảnh: ...] / ![...](...)
  let imageUrl: string | undefined = undefined;
  const imgMatch = fullBlockText.match(
    /(?:\[(?:Hình\s*ảnh|Ảnh|Hình|Image)\s*:\s*([^\]]+)\]|!\[[^\]]*\]\(([^\)]+)\))/i
  );
  if (imgMatch) {
    const rawUrl = (imgMatch[1] || imgMatch[2]).trim();
    if (
      rawUrl.startsWith('data:image/') ||
      rawUrl.startsWith('http://') ||
      rawUrl.startsWith('https://') ||
      rawUrl.startsWith('blob:')
    ) {
      imageUrl = rawUrl;
    }
  }

  // Explicit Diagram Type ONLY if explicitly specified by tag [Hình vẽ: NAME] and it's a known preset or SVG
  let detectedDiagram: string | undefined = undefined;
  const diagMatch = fullBlockText.match(
    /\[(?:Hình\s*vẽ|Sơ\s*đồ|Diagram|Mô\s*hình)\s*:\s*([A-Za-z0-9_<>\/\s]+)\]/i
  );
  if (diagMatch) {
    const diagVal = diagMatch[1].trim();
    if (diagVal.startsWith('<svg')) {
      detectedDiagram = diagVal;
    } else if (/^[A-Za-z0-9_]+$/.test(diagVal)) {
      detectedDiagram = diagVal.toUpperCase();
    }
  }

  // Clean tag lines from main text lines so they don't appear in the question body
  const cleanedLines = lines
    .map((l) =>
      l
        .replace(/(?:\[(?:Hình\s*ảnh|Ảnh|Hình|Image)\s*:\s*[^\]]+\]|!\[[^\]]*\]\([^\)]+\))/gi, '')
        .replace(/\[(?:Hình\s*vẽ|Sơ\s*đồ|Diagram|Mô\s*hình)\s*:\s*[A-Za-z0-9_]+\]/gi, '')
        .trim()
    )
    .filter((l) => l.length > 0);

  // Extract Explanation / Lời giải if present
  let explanation = 'Hướng dẫn giải chi tiết đang được cập nhật.';
  const explMatch = fullBlockText.match(/(?:Lời giải|Hướng dẫn giải|Giải|HDG)[\:\s]+([\s\S]*)$/i);
  let mainTextLines = cleanedLines.length > 0 ? [...cleanedLines] : [...lines];

  if (explMatch) {
    explanation = explMatch[1].trim();
    const explIndex = mainTextLines.findIndex((l) =>
      /^(?:Lời giải|Hướng dẫn giải|Giải|HDG)[\:\s]+/i.test(l)
    );
    if (explIndex !== -1) {
      mainTextLines = mainTextLines.slice(0, explIndex);
    }
  }

  // Section title badge string
  let sectionTitle = 'PHẦN I: Trắc nghiệm (1-12)';
  if (section === 'PART_II') sectionTitle = 'PHẦN II: Đúng / Sai (13-16)';
  if (section === 'PART_III') sectionTitle = 'PHẦN III: Trả lời ngắn (17-22)';

  // Question Text (First line(s) before choices or answers)
  let qText = mainTextLines[0]
    ? mainTextLines[0].replace(/^(?:Câu|Bài|Câu\s*hỏi)\s+\d+[\.\:]?\s*/i, '')
    : `Câu ${id}`;

  if (section === 'PART_I') {
    // Parse A, B, C, D choices
    const choices: { key: 'A' | 'B' | 'C' | 'D'; text: string }[] = [];
    let correctAnswer: 'A' | 'B' | 'C' | 'D' = 'A';

    const remainingLines = mainTextLines.slice(1);
    const textRemainderWithU = remainingLines.join(' ');
    const textRemainder = stripU(textRemainderWithU);

    const aMatch = textRemainder.match(/(?:^|\s)A[\.\)]\s*(.*?)(?=\s*(?:^|\s)B[\.\)]|$)/);
    const bMatch = textRemainder.match(/(?:^|\s)B[\.\)]\s*(.*?)(?=\s*(?:^|\s)C[\.\)]|$)/);
    const cMatch = textRemainder.match(/(?:^|\s)C[\.\)]\s*(.*?)(?=\s*(?:^|\s)D[\.\)]|$)/);
    const dMatch = textRemainder.match(/(?:^|\s)D[\.\)]\s*(.*?)(?=\s*(?:Đáp án|Lời giải|$))/i);

    choices.push({ key: 'A', text: stripU(aMatch ? aMatch[1].trim() : 'Đáp án A') });
    choices.push({ key: 'B', text: stripU(bMatch ? bMatch[1].trim() : 'Đáp án B') });
    choices.push({ key: 'C', text: stripU(cMatch ? cMatch[1].trim() : 'Đáp án C') });
    choices.push({ key: 'D', text: stripU(dMatch ? dMatch[1].trim() : 'Đáp án D') });

    const beforeAIndex = textRemainder.search(/(?:^|\s)A[\.\)]/);
    if (beforeAIndex > 0) {
      qText += ' ' + textRemainder.substring(0, beforeAIndex).trim();
    }

    const ansMatch = fullBlockText.match(/(?:Đáp án|Đáp án đúng|Chọn)[\:\s]+([A-D])/i);
    if (ansMatch) {
      correctAnswer = ansMatch[1].toUpperCase() as 'A' | 'B' | 'C' | 'D';
    } else {
      let uMatch =
        fullBlockText.match(/\[U\]\s*([A-D])[\.\)]?\s*.*\[\/U\]/i) ||
        fullBlockText.match(/\[U\]\s*([A-D])[\.\)]?\s*\[\/U\]/i);
      if (!uMatch) {
        const aIdx = textRemainderWithU.search(/(?:^|\s)A[\.\)]/);
        const bIdx = textRemainderWithU.search(/(?:^|\s)B[\.\)]/);
        const cIdx = textRemainderWithU.search(/(?:^|\s)C[\.\)]/);
        const dIdx = textRemainderWithU.search(/(?:^|\s)D[\.\)]/);
        const uIdx = textRemainderWithU.search(/\[U\]/i);
        if (uIdx !== -1) {
          if (dIdx !== -1 && uIdx > dIdx) uMatch = [null as any, 'D'];
          else if (cIdx !== -1 && uIdx > cIdx) uMatch = [null as any, 'C'];
          else if (bIdx !== -1 && uIdx > bIdx) uMatch = [null as any, 'B'];
          else if (aIdx !== -1 && uIdx > aIdx) uMatch = [null as any, 'A'];
        }
      }
      if (uMatch) {
        correctAnswer = uMatch[1].toUpperCase() as 'A' | 'B' | 'C' | 'D';
      }
    }

    return {
      id,
      section: 'PART_I',
      sectionTitle,
      questionText: stripU(qText.trim()),
      diagramType: detectedDiagram,
      imageUrl,
      options: choices,
      correctAnswer,
      explanation: stripU(explanation),
    };
  } else if (section === 'PART_II') {
    // Parse statements a), b), c), d)
    const statements: { key: 'a' | 'b' | 'c' | 'd'; text: string; correct: boolean }[] = [];
    const textRemainderWithU = mainTextLines.slice(1).join(' ');
    const textRemainder = stripU(textRemainderWithU);

    const beforeA = textRemainder.search(/(?:^|\s)a[\.\)]/i);
    if (beforeA > 0) {
      qText += ' ' + textRemainder.substring(0, beforeA).trim();
    }

    const ansMap: Record<string, boolean> = {};
    const globalAnsMatch = fullBlockText.match(/(?:Đáp án|ĐA)[\:\s]+(.*)/i);
    if (globalAnsMatch) {
      const ansStr = globalAnsMatch[1];
      const items = ansStr.split(/[,;\s]+/);
      items.forEach((item) => {
        const m = item.match(/([abcd])\s*[\:\-\=]?\s*(Đ|S|Đúng|Sai|true|false)/i);
        if (m) {
          const key = m[1].toLowerCase();
          const isTrue = /^(Đ|Đúng|true)$/i.test(m[2]);
          ansMap[key] = isTrue;
        }
      });
    }

    const keys: ('a' | 'b' | 'c' | 'd')[] = ['a', 'b', 'c', 'd'];
    keys.forEach((k) => {
      const nextKey = k === 'a' ? 'b' : k === 'b' ? 'c' : k === 'c' ? 'd' : null;
      const regex = nextKey
        ? new RegExp(`(?:^|\\s)${k}[\\.\\)]\\s*(.*?)(?=\\s*(?:^|\\s)${nextKey}[\\.\\)]|$)`, 'i')
        : new RegExp(`(?:^|\\s)${k}[\\.\\)]\\s*(.*?)(?=\\s*(?:Đáp án|Lời giải|$))`, 'i');

      const match = textRemainder.match(regex);
      const matchWithU = textRemainderWithU.match(regex);
      let stmtText = match ? match[1].trim() : `Mệnh đề ${k}`;

      let isCorrect = ansMap[k];
      if (isCorrect === undefined) {
        isCorrect = matchWithU ? /\[U\]/.test(matchWithU[0]) : false;
      }
      if (/(?:\[|\()?(?:Đúng|Đ|True)(?:\]|\)?)/i.test(stmtText)) {
        isCorrect = true;
        stmtText = stmtText.replace(/(?:\[|\()?(?:Đúng|Đ|True)(?:\]|\)?)/gi, '').trim();
      } else if (/(?:\[|\()?(?:Sai|S|False)(?:\]|\)?)/i.test(stmtText)) {
        isCorrect = false;
        stmtText = stmtText.replace(/(?:\[|\()?(?:Sai|S|False)(?:\]|\)?)/gi, '').trim();
      }

      statements.push({
        key: k,
        text: stripU(stmtText || `Mệnh đề ${k}`),
        correct: isCorrect,
      });
    });

    return {
      id,
      section: 'PART_II',
      sectionTitle,
      questionText: stripU(qText.trim()),
      diagramType: detectedDiagram,
      imageUrl,
      statements,
      explanation: stripU(explanation),
    };
  } else {
    // PART_III: Short answer
    let correctAnswer = '0';
    const textRemainderWithU = mainTextLines.slice(1).join(' ');
    const textRemainder = stripU(textRemainderWithU);
    qText = (qText + ' ' + textRemainder).trim();

    const ansMatch = fullBlockText.match(/(?:Đáp số|Đáp án|KQ|Kết quả)[\:\s]+([^\n\r]+)/i);
    if (ansMatch) {
      correctAnswer = stripU(ansMatch[1].trim());
      qText = qText.replace(/(?:Đáp số|Đáp án|KQ|Kết quả)[\:\s]+[^\n\r]+/gi, '').trim();
    }

    return {
      id,
      section: 'PART_III',
      sectionTitle,
      questionText: stripU(qText),
      diagramType: detectedDiagram,
      imageUrl,
      correctAnswer,
      explanation: stripU(explanation),
    };
  }
}

const VBAR_REGEX_STR = '[\\|\\u00A6\\u01C0-\\u01C3\\u2016\\u2223\\u2225\\u23D0\\u23B8\\u23B9\\u2500-\\u257F\\u2580-\\u259F\\u2758-\\u275E\\uFE31-\\uFE34\\uFF5C\\uFFE8\\uFFED\\uFFEE]';

function stripU(text: string): string {
  if (!text) return text;
  let res = text.replace(/\[\/?U\]/gi, '');

  // 1. Remove zero-width & invisible control characters
  res = res.replace(/[\uFEFF\u200B\u200C\u200D\u200E\u200F\u00AD\u0007\u000B\u000C\u0008\u0002\u0003\u0019\u001F\u001E\u2060\u180E]/g, '');

  // 2. Remove private use area / MathType font artifacts
  res = res.replace(/[\uF000-\uF8FF\uE000-\uF8FF]/g, '');

  // 3. Remove all box-drawing and block vertical bars commonly left over by Word tables, cursors or MathType
  res = res.replace(/[\u2500-\u257F\u2580-\u259F\u2758-\u275E\uFFE8\u00A6\u01C0-\u01C3\u23D0\u23B8\u23B9\uFE31-\uFE34\uFF5C\uFFED\uFFEE]/g, '');

  // 4. Remove HTML entities for vertical bar
  res = res.replace(/&(?:vert|#124|#x7C|#x2502|#9474|vbar|mid|parallel);/gi, ' ');

  // 5. Remove pipes adjacent to math delimiters: "$ |", "| $", "$|", "|$", "$$ |", "| $$"
  res = res.replace(new RegExp(`\\${'{1,2}'}\\s*${VBAR_REGEX_STR}+`, 'g'), (m) => m.replace(new RegExp(VBAR_REGEX_STR, 'g'), '').trim());
  res = res.replace(new RegExp(`${VBAR_REGEX_STR}+\\s*\\${'{1,2}'}`, 'g'), (m) => m.replace(new RegExp(VBAR_REGEX_STR, 'g'), '').trim());

  // 6. Remove pipes after/before differential terms e.g. "dx . |", "dx.|", "dx |", "dt . |", "dy |"
  res = res.replace(new RegExp(`\\b(d[xyztuvw])\\s*(\\.*)\\s*${VBAR_REGEX_STR}+`, 'gi'), '$1$2');

  // 7. Remove pipes after/before punctuation (e.g. ". |", ": |", "? |", "; |", ", |", ") |", ".|", " . | ", " .| ")
  res = res.replace(new RegExp(`([\\.?!;:,])\\s*${VBAR_REGEX_STR}+`, 'g'), '$1');
  res = res.replace(new RegExp(`${VBAR_REGEX_STR}+\\s*([\\.?!;:,])`, 'g'), '$1');
  res = res.replace(new RegExp(`([\\.?!;:,])\\s*${VBAR_REGEX_STR}+\\s*$`, 'g'), '$1');

  // 8. Remove pipes after closed parentheses, brackets, or braces (e.g. ") |", "] |", "} |", ") . |")
  res = res.replace(new RegExp(`([\\)\\]\\}])\\s*(\\.*)\\s*${VBAR_REGEX_STR}+`, 'g'), '$1$2');

  // 9. Remove pipes between Vietnamese words separated by spaces (e.g. "hình phẳng | giới hạn", "ba nghiệm | phân biệt", "bằng | ")
  res = res.replace(new RegExp(`([a-zA-Zà-ỹÀ-Ỹ0-9]{2,})\\s+${VBAR_REGEX_STR}+\\s+([a-zA-Zà-ỹÀ-Ỹ0-9]{2,})`, 'g'), '$1 $2');
  res = res.replace(new RegExp(`\\s+${VBAR_REGEX_STR}+\\s+`, 'g'), ' ');

  // 10. Strip trailing and leading pipes
  res = res.replace(new RegExp(`\\s*${VBAR_REGEX_STR}+\\s*$`, 'gm'), '');
  res = res.replace(new RegExp(`^\\s*${VBAR_REGEX_STR}+\\s*`, 'gm'), '');
  res = res.replace(new RegExp(`\\s*${VBAR_REGEX_STR}+\\s*$`, 'g'), '');
  res = res.replace(new RegExp(`^\\s*${VBAR_REGEX_STR}+\\s*`, 'g'), '');

  res = res
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\{<\}/g, ' < ')
    .replace(/\{>\}/g, ' > ');

  // Fix dropped 'đ'
  res = res.replace(/\b([Cc]ác|[Hh]ai|[Mm]ột|[Nn]hững|[Vv]ới|[Cc]ho|[Cc]ủa|[Bbi]ết|[Bb]ởi|[Vv]à)\s+([ưƯ]ờng)\b/g, '$1 đ$2');
  res = res.replace(/\b([Tt]hu|[Nn]hận|[Tt]ìm|[Đđ]ạt|[Kk]hông)\s+([ưƯ]ợc)\b/g, '$1 đ$2');
  res = res.replace(/\b([Tt]rên)\s+([đĐ]ọan)\b/g, '$1 đoạn');
  res = res.replace(/\b([đĐ]ọan)\b/g, 'đoạn');
  res = res.replace(/\bham\s+s[oö]\b/gi, 'hàm số');
  res = res.replace(/\bcho\s+ham\s+s[oö]\b/gi, 'cho hàm số');

  // Fix and normalize vectors
  res = normalizeVectors(res);

  // Fix MathType OCR corruptions where \left| was stripped to \left f(x) \right] or \left f\left(x\right)\right]
  res = res.replace(
    /\\left\s*f\s*\\left\(\s*x\s*\\right\)\s*\\right(?:\]|\)|\}|\||\.)?/g,
    '\\left| f(x) \\right|'
  );
  res = cleanedFix(res);

  // Convert array piecewise to cases
  res = res.replace(
    /\\left\\{\s*\\begin\{array\}(?:\{[^{}]*\})?([\s\S]*?)\\end\{array\}\s*\\right\.?/g,
    '\\begin{cases}$1\\end{cases}'
  );

  // Fix integral limits
  res = res.replace(/\\int\s*\\limit_\{?([0-9a-zA-Z\-]+)\}?\^\{?([0-9a-zA-Z\-]+)\}?/g, '\\int_{$1}^{$2}');
  res = res.replace(/\\int\s*\\limit\^\{?([0-9a-zA-Z\-]+)\}?_\{?([0-9a-zA-Z\-]+)\}?/g, '\\int_{$2}^{$1}');
  res = res.replace(/\\int\s*\\limits_\{?([0-9a-zA-Z\-]+)\}?\^\{?([0-9a-zA-Z\-]+)\}?/g, '\\int_{$1}^{$2}');
  res = res.replace(/\\limit_\{?([0-9a-zA-Z\-]+)\}?\^\{?([0-9a-zA-Z\-]+)\}?/g, '_{$1}^{$2}');
  res = res.replace(/\\limit_\{?([0-9a-zA-Z\-]+)\}?/g, '_{$1}');
  res = res.replace(/\\limit\^\{?([0-9a-zA-Z\-]+)\}?/g, '^{$1}');
  res = res.replace(/\\limit\b/g, '\\limits');

  // Strip again any trailing stray pipes or dots
  res = res.replace(/\\(mid|vert|vbar|parallel)\s*$/g, '');
  res = res.replace(/([\.?!;:,])\s*(\\mid|\\vert|\\vbar|\\parallel|\|)+\s*$/g, '$1');
  res = res.replace(new RegExp(`([\\.?!;:,])\\s*${VBAR_REGEX_STR}+`, 'g'), '$1');
  res = res.replace(new RegExp(`${VBAR_REGEX_STR}+\\s*([\\.?!;:,])`, 'g'), '$1');
  res = res.replace(new RegExp(`\\s*${VBAR_REGEX_STR}+\\s*$`, 'g'), '');
  res = res.replace(new RegExp(`^\\s*${VBAR_REGEX_STR}+\\s*`, 'g'), '');
  res = res.replace(new RegExp(`\\b(d[xyztuvw])\\s*(\\.*)\\s*${VBAR_REGEX_STR}+$`, 'gi'), '$1$2');

  return res.trim();
}

function cleanedFix(str: string): string {
  return str
    .replace(/\\left\s*f\s*\(\s*x\s*\)\s*\\right(?:\]|\)|\}|\||\.)?/g, '\\left| f(x) \\right|')
    .replace(/\\left\s*([fguhyPQRST]\s*(?:\([^)]+\)|\\left\([^)]+\\right\)))\s*\\right(?:\]|\)|\}|\||\.)?/g, '\\left| $1 \\right|')
    .replace(/\\left\s*f\b/g, '\\left| f');
}
