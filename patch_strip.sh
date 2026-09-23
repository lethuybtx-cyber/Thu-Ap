sed -i '369 a\
\
function stripU(text: string): string {\
  if (!text) return text;\
  return text.replace(/\\[\\/?U\\]/gi, "");\
}\
' src/lib/wordParser.ts
