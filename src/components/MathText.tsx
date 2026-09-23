import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathTextProps {
  text: string;
  className?: string;
}

/**
 * Unescape HTML entities that frequently appear in Word / XML / HTML imports
 */
function unescapeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&(?:vert|#124|#x7C|#x2502|#9474|vbar|mid|parallel);/gi, ' ')
    .replace(/&le;/g, '≤')
    .replace(/&ge;/g, '≥')
    .replace(/&ne;/g, '≠')
    .replace(/&plusmn;/g, '±')
    .replace(/&times;/g, '×')
    .replace(/&divide;/g, '÷')
    .replace(/&alpha;/g, 'α')
    .replace(/&beta;/g, 'β')
    .replace(/&gamma;/g, 'γ')
    .replace(/&Delta;/g, 'Δ')
    .replace(/&theta;/g, 'θ')
    .replace(/&pi;/g, 'π')
    .replace(/&infin;/g, '∞')
    .replace(/&middot;/g, '·')
    .replace(/&bull;/g, '•');
}

// Master character class for all vertical bars, box lines, block elements, PUA/MathType cursors
const VBAR_REGEX_STR = '[\\|\\u00A6\\u01C0-\\u01C3\\u2016\\u2223\\u2225\\u23D0\\u23B8\\u23B9\\u2500-\\u257F\\u2580-\\u259F\\u2758-\\u275E\\uFE31-\\uFE34\\uFF5C\\uFFE8\\uFFED\\uFFEE]';

/**
 * Clean stray pipes, Word table cell delimiters, MathType cursor markers and OCR artifacts
 */
export function cleanStrayArtifacts(str: string): string {
  if (!str) return '';
  let res = String(str);

  // 1. Remove zero-width & invisible control characters
  res = res.replace(/[\uFEFF\u200B\u200C\u200D\u200E\u200F\u00AD\u0007\u000B\u000C\u0008\u0002\u0003\u0019\u001F\u001E\u2060\u180E]/g, '');

  // 2. Remove private use area / MathType font artifacts
  res = res.replace(/[\uF000-\uF8FF\uE000-\uF8FF]/g, '');

  // 3. Remove HTML entities for vertical bar
  res = res.replace(/&(?:vert|#124|#x7C|#x2502|#9474|vbar|mid|parallel);/gi, ' ');

  // 4. Remove all box-drawing and block elements completely (never needed in text)
  res = res.replace(/[\u2500-\u257F\u2580-\u259F\u2758-\u275E\uFFE8\u00A6\u01C0-\u01C3\u23D0\u23B8\u23B9\uFE31-\uFE34\uFF5C\uFFED\uFFEE]/g, '');

  // 5. Remove pipes/bars adjacent to math delimiters: "$ |", "| $", "$|", "|$", "$$ |", "| $$"
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

  // 9. Remove pipes before open parentheses, brackets, or braces (e.g. "| (", "| [")
  res = res.replace(new RegExp(`${VBAR_REGEX_STR}+\\s*([\\(\\[\\{])`, 'g'), '$1');

  // 10. Remove pipes between words separated by spaces (e.g. "hình phẳng | giới hạn", "ba nghiệm | phân biệt", "bằng | ")
  res = res.replace(new RegExp(`([a-zA-Zà-ỹÀ-Ỹ0-9]{2,})\\s+${VBAR_REGEX_STR}+\\s+([a-zA-Zà-ỹÀ-Ỹ0-9]{2,})`, 'g'), '$1 $2');
  res = res.replace(new RegExp(`\\s+${VBAR_REGEX_STR}+\\s+`, 'g'), ' ');

  // 11. Strip trailing and leading pipes on every line and at string boundaries
  res = res.replace(new RegExp(`\\s*${VBAR_REGEX_STR}+\\s*$`, 'gm'), '');
  res = res.replace(new RegExp(`^\\s*${VBAR_REGEX_STR}+\\s*`, 'gm'), '');
  res = res.replace(new RegExp(`\\s*${VBAR_REGEX_STR}+\\s*$`, 'g'), '');
  res = res.replace(new RegExp(`^\\s*${VBAR_REGEX_STR}+\\s*`, 'g'), '');

  // 12. Final cleanup pass for trailing periods/pipes
  res = res.replace(new RegExp(`\\.\\s*${VBAR_REGEX_STR}+\\s*$`, 'g'), '.');
  res = res.replace(new RegExp(`\\s*${VBAR_REGEX_STR}+\\s*$`, 'g'), '');

  return res.trim();
}

/**
 * Clean & normalize vector representations (repair MathType, Word, OCR corruptions like B'\grave{C}, AA\grave{'}, AB\grave{}, etc.)
 */
export function normalizeVectors(latex: string): string {
  if (!latex) return '';
  let s = latex;

  // 1. Unicode combining vector arrows: e.g. AB\u20D7 -> \overrightarrow{AB}, u\u20D7 -> \vec{u}
  s = s.replace(/([A-Z]['A-Z0-9]{1,5})\u20D7/g, '\\overrightarrow{$1}');
  s = s.replace(/([a-z])\u20D7/g, '\\vec{$1}');
  s = s.replace(/[\u20D6\u20D7]/g, '');

  // 2. Corrupted MathType / OCR grave / acute representations on uppercase point vectors:
  // e.g. B'\grave{C} -> \overrightarrow{B'C}, A'\grave{B'} -> \overrightarrow{A'B'}, A\grave{B} -> \overrightarrow{AB}
  s = s.replace(/([A-Z]['0-9]*)\s*\\(?:grave|acute)\s*\{([A-Z]['0-9]*)\}/g, '\\overrightarrow{$1$2}');
  
  // e.g. AA\grave{'} or AA\grave{\'} or AA'\grave{'} or A'B\grave{'} -> \overrightarrow{AA'} / \overrightarrow{A'B'}
  s = s.replace(/([A-Z]['A-Z0-9]*)\s*\\(?:grave|acute)\s*\{\s*\\?\'\s*\}/g, "\\overrightarrow{$1'}");
  
  // e.g. AB\grave{} or AA'\grave{} or BC\acute{} -> \overrightarrow{AB}, \overrightarrow{AA'}
  s = s.replace(/([A-Z]['A-Z0-9]*)\s*\\(?:grave|acute)\s*\{\s*\}/g, '\\overrightarrow{$1}');

  // e.g. \grave{AB} or \acute{AB} or \grave{A'B'} -> \overrightarrow{AB}
  s = s.replace(/\\(?:grave|acute)\s*\{([A-Z]['A-Z0-9]{1,5})\}/g, '\\overrightarrow{$1}');

  // e.g. AB\grave or AA'\acute without braces
  s = s.replace(/([A-Z]['A-Z0-9]+)\s*\\(?:grave|acute)\b/g, '\\overrightarrow{$1}');

  // 3. Single-letter lowercase vectors corrupted with grave/acute:
  // e.g. u\grave{} -> \vec{u}, \grave{u} -> \vec{u}, \acute{v} -> \vec{v}
  s = s.replace(/([uvwijkabnx0e])\s*\\(?:grave|acute)\s*\{\s*\}/g, '\\vec{$1}');
  s = s.replace(/\\(?:grave|acute)\s*\{([uvwijkabnx0e])\}/g, '\\vec{$1}');

  // 4. Superscript arrow used as vector: AB^{\rightarrow}, AB^\rightarrow, AB^→, u^\rightarrow
  s = s.replace(/([A-Z]['A-Z0-9]{1,5})\s*\^\s*(?:\{\\rightarrow\}|\\rightarrow|→|\{→\})/g, '\\overrightarrow{$1}');
  s = s.replace(/([a-z])\s*\^\s*(?:\{\\rightarrow\}|\\rightarrow|→|\{→\})/g, '\\vec{$1}');

  // 5. Corrupted \vec capturing only first char: e.g. \vec{A}B -> \overrightarrow{AB}, \vec{B}'C -> \overrightarrow{B'C}, \vec{A}A' -> \overrightarrow{AA'}
  s = s.replace(/\\vec\s*\{([A-Z])\}\s*([A-Z]'?)/g, '\\overrightarrow{$1$2}');
  s = s.replace(/\\vec\s*\{([A-Z]'?)\}\s*([A-Z]'?)/g, '\\overrightarrow{$1$2}');

  // 6. Multiple-point vectors formatted as \vec{AB} or \vec{A'B'} or \vec{AA'} -> standard \overrightarrow{AB} for full-width arrow in KaTeX
  s = s.replace(/\\vec\s*\{([A-Z]['A-Z0-9]{1,5})\}/g, '\\overrightarrow{$1}');

  // 7. Cleanup duplicate nested vectors if any
  s = s.replace(/\\overrightarrow\s*\{\\overrightarrow\s*\{([^}]+)\}\}/g, '\\overrightarrow{$1}');
  s = s.replace(/\\vec\s*\{\\vec\s*\{([^}]+)\}\}/g, '\\vec{$1}');

  // 8. Vector dot products: \overrightarrow{AB}.\overrightarrow{AC} -> \overrightarrow{AB} \cdot \overrightarrow{AC}
  s = s.replace(
    /(\\overrightarrow\{[^}]+\}|\\vec\{[^}]+\})\s*\.\s*(\\overrightarrow\{[^}]+\}|\\vec\{[^}]+\})/g,
    '$1 \\cdot $2'
  );
  s = s.replace(/\s*\.\s*(?=\\overrightarrow|\\vec)/g, ' \\cdot ');

  return s;
}

/**
 * Repair common Vietnamese words that lost 'đ' or were mis-encoded during Word/OCR export
 */
export function repairVietnameseText(str: string): string {
  if (!str) return '';
  let res = cleanStrayArtifacts(str);
  res = normalizeVectors(res);

  // Fix dropped 'đ'
  res = res.replace(/\b([Cc]ác|[Hh]ai|[Mm]ột|[Nn]hững|[Vv]ới|[Cc]ho|[Cc]ủa|[Bbi]ết|[Bb]ởi|[Vv]à)\s+([ưƯ]ờng)\b/g, '$1 đ$2');
  res = res.replace(/\b([Tt]hu|[Nn]hận|[Tt]ìm|[Đđ]ạt|[Kk]hông)\s+([ưƯ]ợc)\b/g, '$1 đ$2');
  res = res.replace(/\b([Tt]rên)\s+([đĐ]ọan)\b/g, '$1 đoạn');
  res = res.replace(/\b([đĐ]ọan)\b/g, 'đoạn');
  res = res.replace(/\bham\s+s[oö]\b/gi, 'hàm số');
  res = res.replace(/\bcho\s+ham\s+s[oö]\b/gi, 'cho hàm số');
  res = res.replace(/\bhe\s+so\b/gi, 'hệ số');
  res = res.replace(/\bnguyen\s+ham\b/gi, 'nguyên hàm');
  res = res.replace(/\btich\s+phan\b/gi, 'tích phân');
  res = res.replace(/\btoa\s+do\b/gi, 'tọa độ');
  res = res.replace(/\bxac\s+suat\b/gi, 'xác suất');
  res = res.replace(/\bmat\s+phang\b/gi, 'mặt phẳng');

  return cleanStrayArtifacts(res);
}

/**
 * Clean & normalize LaTeX string for KaTeX rendering
 */
function cleanLatex(latex: string): string {
  if (!latex) return '';
  let cleaned = unescapeHtmlEntities(latex.trim());
  cleaned = cleanStrayArtifacts(cleaned);
  cleaned = normalizeVectors(cleaned);

  // Strip trailing LaTeX pipe or delimiter artifacts:
  // e.g. "f(x)dx . |", "f(x)dx . \mid", "f(x)dx . \vert", "\log_3(26a) . |", "(2;-1;1). |"
  cleaned = cleaned.replace(/\\(mid|vert|vbar|parallel|arrowvert|Arrowvert|bracevert|big\||Big\||bigg\||Bigg\|)\s*$/g, '');
  cleaned = cleaned.replace(/([\.?!;:,])\s*(\\mid|\\vert|\\vbar|\\parallel|\|)+\s*$/g, '$1');
  cleaned = cleaned.replace(/([\.?!;:,])\s*\|+/g, '$1');
  cleaned = cleaned.replace(/\|+\s*([\.?!;:,])/g, '$1');
  cleaned = cleaned.replace(/\s*\|+\s*$/g, '');
  cleaned = cleaned.replace(/^\s*\|+\s*/g, '');
  cleaned = cleaned.replace(/([0-9a-zA-Z\)\}])\s*\.\s*\|+$/g, '$1.');
  cleaned = cleaned.replace(/([0-9a-zA-Z\)\}])\s*\.\s*\\(mid|vert|vbar)\s*$/g, '$1.');
  cleaned = cleaned.replace(/\b(d[xyztuvw])\s*(\.?)\s*\|+/gi, '$1$2');

  // Fix MathType OCR corruptions where \left| was stripped to \left f(x) \right] or \left f\left(x\right)\right]
  cleaned = cleaned.replace(
    /\\left\s*f\s*\\left\(\s*x\s*\\right\)\s*\\right(?:\]|\)|\}|\||\.)?/g,
    '\\left| f(x) \\right|'
  );
  cleaned = cleaned.replace(
    /\\left\s*f\s*\(\s*x\s*\)\s*\\right(?:\]|\)|\}|\||\.)?/g,
    '\\left| f(x) \\right|'
  );
  cleaned = cleaned.replace(
    /\\left\s*f\s*\\left\(\s*x\s*\\right\)/g,
    '\\left| f(x) \\right|'
  );
  cleaned = cleaned.replace(/\\left\s*([fguhyPQRST]\s*(?:\([^)]+\)|\\left\([^)]+\\right\)))\s*\\right(?:\]|\)|\}|\||\.)?/g, '\\left| $1 \\right|');
  cleaned = cleaned.replace(/\\left\s*f\b/g, '\\left| f');

  // Fix mismatched or corrupted delimiters:
  // e.g. \left| ... \right] -> \left| ... \right|
  cleaned = cleaned.replace(/\\left\|\s*([^|\\]+?)\s*\\right\]/g, '\\left| $1 \\right|');
  cleaned = cleaned.replace(/\\left\|\s*([^|\\]+?)\s*\\right\)/g, '\\left| $1 \\right|');
  cleaned = cleaned.replace(/\\left\|\s*([^|\\]+?)\s*\\right\}/g, '\\left| $1 \\right|');

  // Fix \left{ and \right} (missing backslash before brace)
  cleaned = cleaned.replace(/\\left\{/g, '\\left\\{');
  cleaned = cleaned.replace(/\\left\{(?=[^\\{])/g, '\\left\\{');
  cleaned = cleaned.replace(/\\right\}(?=[^\\}])/g, '\\right\\}');

  // 1. Convert MathType array piecewise functions: \left\{ \begin{array}{*{35}{l}} ... \end{array} \right. -> \begin{cases} ... \end{cases}
  cleaned = cleaned.replace(
    /\\left\\{\s*\\begin\{array\}(?:\{[^{}]*\})?([\s\S]*?)\\end\{array\}\s*\\right\.?/g,
    '\\begin{cases}$1\\end{cases}'
  );
  // Also clean any leftover array {*{35}{l}} or {*{20}{c}}
  cleaned = cleaned.replace(/\\begin\{array\}\s*\{\s*\*\s*\{[0-9]+\}\s*\{[a-zA-Z]+\}\s*\}/g, '\\begin{array}{ll}');

  // 2. Fix integral limits: \int\limit_a^b or \int \limit_a^b -> \int_{a}^{b}
  cleaned = cleaned.replace(/\\int\s*\\limit_\{?([0-9a-zA-Z\-]+)\}?\^\{?([0-9a-zA-Z\-]+)\}?/g, '\\int_{$1}^{$2}');
  cleaned = cleaned.replace(/\\int\s*\\limit\^\{?([0-9a-zA-Z\-]+)\}?_\{?([0-9a-zA-Z\-]+)\}?/g, '\\int_{$2}^{$1}');
  cleaned = cleaned.replace(/\\int\s*\\limits_\{?([0-9a-zA-Z\-]+)\}?\^\{?([0-9a-zA-Z\-]+)\}?/g, '\\int_{$1}^{$2}');
  cleaned = cleaned.replace(/\\limit_\{?([0-9a-zA-Z\-]+)\}?\^\{?([0-9a-zA-Z\-]+)\}?/g, '_{$1}^{$2}');
  cleaned = cleaned.replace(/\\limit_\{?([0-9a-zA-Z\-]+)\}?/g, '_{$1}');
  cleaned = cleaned.replace(/\\limit\^\{?([0-9a-zA-Z\-]+)\}?/g, '^{$1}');
  cleaned = cleaned.replace(/\\limit\b/g, '\\limits');

  // 3. Fix fractional exponents: a\frac{1}{3} -> a^{\frac{1}{3}}, a^\frac{1}{3} -> a^{\frac{1}{3}}
  cleaned = cleaned.replace(/([a-zA-Z0-9\)])\^\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1^{\\frac{$2}{$3}}');
  cleaned = cleaned.replace(/([a-zA-Z0-9\)])\s*(\^)?\s*\\frac\{([0-9]+)\}\{([0-9]+)\}/g, '$1^{\\frac{$3}{$4}}');

  // 4. Fix {<}, {>}, {<=}, {>=}, {=} brackets from Word / MathType equations
  cleaned = cleaned.replace(/\{<\}/g, ' < ');
  cleaned = cleaned.replace(/\{>\}/g, ' > ');
  cleaned = cleaned.replace(/\{<=\}/g, ' \\le ');
  cleaned = cleaned.replace(/\{>=\}/g, ' \\ge ');
  cleaned = cleaned.replace(/\{=\}/g, ' = ');

  // 5. Fix vector dot products: \overrightarrow{AB}.\overrightarrow{AC} -> \overrightarrow{AB} \cdot \overrightarrow{AC}
  cleaned = cleaned.replace(
    /(\\overrightarrow\{[^}]+\}|\\vec\{[^}]+\})\s*\.\s*(\\overrightarrow\{[^}]+\}|\\vec\{[^}]+\})/g,
    '$1 \\cdot $2'
  );
  cleaned = cleaned.replace(/\s*\.\s*(?=\\overrightarrow|\\vec)/g, ' \\cdot ');

  // 6. Replace unicode math variants with KaTeX equivalents
  cleaned = cleaned.replace(/−/g, '-');
  cleaned = cleaned.replace(/–/g, '-');
  cleaned = cleaned.replace(/×/g, '\\times ');
  cleaned = cleaned.replace(/÷/g, '\\div ');
  cleaned = cleaned.replace(/≤/g, '\\le ');
  cleaned = cleaned.replace(/≥/g, '\\ge ');
  cleaned = cleaned.replace(/≠/g, '\\ne ');
  cleaned = cleaned.replace(/∈/g, '\\in ');
  cleaned = cleaned.replace(/∉/g, '\\notin ');
  cleaned = cleaned.replace(/⊂/g, '\\subset ');
  cleaned = cleaned.replace(/∪/g, '\\cup ');
  cleaned = cleaned.replace(/∩/g, '\\cap ');
  cleaned = cleaned.replace(/∅/g, '\\emptyset ');
  cleaned = cleaned.replace(/∞/g, '\\infty ');
  cleaned = cleaned.replace(/π/g, '\\pi ');
  cleaned = cleaned.replace(/α/g, '\\alpha ');
  cleaned = cleaned.replace(/β/g, '\\beta ');
  cleaned = cleaned.replace(/γ/g, '\\gamma ');
  cleaned = cleaned.replace(/Δ/g, '\\Delta ');
  cleaned = cleaned.replace(/θ/g, '\\theta ');
  cleaned = cleaned.replace(/⊥/g, '\\perp ');
  cleaned = cleaned.replace(/∥/g, '\\parallel ');
  cleaned = cleaned.replace(/√/g, '\\sqrt');
  cleaned = cleaned.replace(/°/g, '^\\circ');

  // Strip any trailing pipe or delimiter after replacements
  cleaned = cleaned.replace(/\\(mid|vert|vbar|parallel)\s*$/g, '');
  cleaned = cleaned.replace(/\s*\|+\s*$/g, '');
  cleaned = cleaned.replace(/([\.?!;:,])\s*\|+$/g, '$1');
  cleaned = cleaned.replace(/\b(d[xyztuvw])\s*(\.?)\s*\|+$/gi, '$1$2');

  return cleaned.trim();
}

/**
 * Pre-process full text: decode entities, repair Vietnamese text, and auto-wrap raw un-enclosed LaTeX formulas into $...$
 */
function preprocessMathText(raw: string): string {
  if (!raw) return '';
  let str = repairVietnameseText(unescapeHtmlEntities(raw));

  // 1. Convert any raw \left\{ \begin{array}... piecewise in whole text to standard \begin{cases}
  str = str.replace(
    /\\left\\{\s*\\begin\{array\}(?:\{[^{}]*\})?([\s\S]*?)\\end\{array\}\s*\\right\.?/g,
    '\\begin{cases}$1\\end{cases}'
  );

  // 2. Protect existing properly enclosed math blocks
  const protectedMath: string[] = [];
  const placeholderPrefix = '___MATH_ENCLOSED_';

  // Matches $$...$$, \[...\], $...$, \(...\), \begin{env}...\end{env}
  const existingRegex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$(?:[^\$\\]|\\.)+\$|\\\([\s\S]*?\\\)|\s*\\begin\{(?:aligned|cases|matrix|pmatrix|bmatrix|vmatrix|array|gather|equation)\}[\s\S]*?\\end\{(?:aligned|cases|matrix|pmatrix|bmatrix|vmatrix|array|gather|equation)\}\s*)/g;

  str = str.replace(existingRegex, (match) => {
    const idx = protectedMath.length;
    // Pre-clean inner math if needed
    protectedMath.push(match);
    return `${placeholderPrefix}${idx}___`;
  });

  // 3. Catch piecewise functions like "f(x) = \begin{cases} ... \end{cases}" that are outside of $...$
  str = str.replace(
    /([a-zA-Z0-9_\(\)\'\s]*=\s*\\begin\{cases\}[\s\S]*?\\end\{cases\})/g,
    (match) => {
      if (match.startsWith(placeholderPrefix)) return match;
      return `$${match.trim()}$`;
    }
  );

  // 4. Catch integral sums like "\int ... dx - \int ... dx" that are outside $...$
  str = str.replace(
    /(\\int[\s\S]*?dx(?:\s*[\+\-\*\/]\s*\\int[\s\S]*?dx)*)/g,
    (match) => {
      if (match.startsWith(placeholderPrefix)) return match;
      return `$${match.trim()}$`;
    }
  );

  // 5. Identify naked LaTeX formulas outside of $...$
  const latexCommands =
    'overrightarrow|overleftarrow|vec|widecheck|widehat|widetilde|overline|underline|frac|dfrac|cfrac|tfrac|binom|dbinom|sqrt|int|iint|iiint|oint|sum|prod|lim|limsup|liminf|inf|sup|sin|cos|tan|cot|arcsin|arccos|arctan|log|ln|lg|exp|mathbb|mathbf|mathrm|mathcal|mathscr|mathit|text|textbf|textit|left|right|alpha|beta|gamma|delta|Delta|theta|pi|infty|le|ge|ne|approx|times|cdot|pm|mp|cup|cap|subset|in|notin|emptyset|perp|parallel|angle|sphericalangle|triangle|limits|limit';

  // Match raw formula starting with \command or math assignments
  const rawFormulaRegex = new RegExp(
    `(\\\\(${latexCommands})\\b(?:\\{[^{}]*(?:\\{[^{}]*\\}[^{}]*)*\\}|[a-zA-Z0-9_\\^\\-\\+\\*\\/\\=\\<\\>\\.,;:\\s\\\\()|{}\\[\\]])*(?:\\{[^{}]*\\}|[a-zA-Z0-9_\\-\\+\\*\\^]))`,
    'g'
  );

  str = str.replace(rawFormulaRegex, (match) => {
    let trimmed = match.trim();
    if (!trimmed || trimmed.startsWith(placeholderPrefix)) return match;

    trimmed = cleanStrayArtifacts(trimmed);

    // Check if formula ends with punctuation followed by plain text
    let trailingPunct = '';
    if (/[,\.;:\?!]$/.test(trimmed)) {
      trailingPunct = trimmed.slice(-1);
      trimmed = trimmed.slice(0, -1).trim();
    }
    trimmed = cleanStrayArtifacts(trimmed);

    if (!trimmed) return match;
    return `$${trimmed}$${trailingPunct}`;
  });

  // 6. Restore protected math blocks
  str = str.replace(/___MATH_ENCLOSED_(\d+)___/g, (_, idx) => {
    return protectedMath[Number(idx)] || '';
  });

  return cleanStrayArtifacts(str);
}

export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  if (!text) return null;

  const normalizedText = preprocessMathText(text);

  // Split by:
  // 1. $$ ... $$ (display math)
  // 2. \[ ... \] (display math)
  // 3. $ ... $ (inline math)
  // 4. \( ... \) (inline math)
  // 5. \begin{...} ... \end{...} (display math environments)
  const regex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$(?:[^\$\\]|\\.)+\$|\\\([\s\S]*?\\\)|\s*\\begin\{(?:aligned|cases|matrix|pmatrix|bmatrix|vmatrix|array|gather|equation)\}[\s\S]*?\\end\{(?:aligned|cases|matrix|pmatrix|bmatrix|vmatrix|array|gather|equation)\}\s*)/g;

  const parts = normalizedText.split(regex);

  return (
    <span className={`inline-wrap max-w-full leading-relaxed break-words ${className}`}>
      {parts.map((part, index) => {
        if (!part) return null;

        // Display math: $$ ... $$ or \[ ... \]
        if (
          (part.startsWith('$$') && part.endsWith('$$') && part.length >= 4) ||
          (part.startsWith('\\[') && part.endsWith('\\]') && part.length >= 4)
        ) {
          const math = part.startsWith('$$') ? part.slice(2, -2) : part.slice(2, -2);
          try {
            const html = katex.renderToString(cleanLatex(math), {
              displayMode: true,
              throwOnError: false,
              output: 'htmlAndMathml',
              strict: false,
              trust: true,
            });
            return (
              <span
                key={index}
                className="katex-display my-1.5 block max-w-full overflow-x-auto text-center"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            const fallback = cleanStrayArtifacts(part);
            if (!fallback || fallback === '|' || fallback === '$.$' || fallback === '$|$') return null;
            return <span key={index}>{fallback}</span>;
          }
        }

        // Display math environment: \begin{...} ... \end{...}
        if (
          part.trim().startsWith('\\begin{') &&
          part.trim().includes('\\end{')
        ) {
          try {
            const html = katex.renderToString(cleanLatex(part.trim()), {
              displayMode: true,
              throwOnError: false,
              output: 'htmlAndMathml',
              strict: false,
              trust: true,
            });
            return (
              <span
                key={index}
                className="katex-display my-1.5 block max-w-full overflow-x-auto text-center"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            const fallback = cleanStrayArtifacts(part);
            if (!fallback || fallback === '|' || fallback === '$.$' || fallback === '$|$') return null;
            return <span key={index}>{fallback}</span>;
          }
        }

        // Inline math: $ ... $ or \( ... \)
        if (
          (part.startsWith('$') && part.endsWith('$') && part.length >= 2) ||
          (part.startsWith('\\(') && part.endsWith('\\)') && part.length >= 4)
        ) {
          const math = part.startsWith('$') ? part.slice(1, -1) : part.slice(2, -2);
          try {
            const html = katex.renderToString(cleanLatex(math), {
              displayMode: false,
              throwOnError: false,
              output: 'htmlAndMathml',
              strict: false,
              trust: true,
            });
            return (
              <span
                key={index}
                className="inline-math px-0.5 max-w-full inline align-baseline"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            const fallback = cleanStrayArtifacts(part);
            if (!fallback || fallback === '|' || fallback === '$.$' || fallback === '$|$') return null;
            return <span key={index}>{fallback}</span>;
          }
        }

        const cleanedPlain = cleanStrayArtifacts(part);
        if (!cleanedPlain || cleanedPlain === '|' || cleanedPlain === '$.$' || cleanedPlain === '$|$') {
          return null;
        }

        return <React.Fragment key={index}>{cleanedPlain}</React.Fragment>;
      })}
    </span>
  );
};




