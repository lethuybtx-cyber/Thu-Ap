sed -i 's/correctAnswer = ansMatch\[1\].trim();/correctAnswer = stripU(ansMatch[1].trim());/g' src/lib/wordParser.ts
