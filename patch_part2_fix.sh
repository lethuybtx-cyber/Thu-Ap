sed -i 's|isCorrect = /\[U\]/.test(stmtText);|isCorrect = matchWithU ? /\\[U\\]/.test(matchWithU[1]) : false;|g' src/lib/wordParser.ts
