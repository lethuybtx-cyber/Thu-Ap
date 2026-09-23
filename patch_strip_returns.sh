sed -i 's/questionText: qText.trim()/questionText: stripU(qText.trim())/g' src/lib/wordParser.ts
sed -i 's/questionText: qText/questionText: stripU(qText)/g' src/lib/wordParser.ts
sed -i 's/explanation,/explanation: stripU(explanation),/g' src/lib/wordParser.ts

# Also choices and statements need stripping
# For choices in PART_I:
sed -i 's/text: aMatch ? aMatch\[1\].trim() : "Đáp án A"/text: stripU(aMatch ? aMatch[1].trim() : "Đáp án A")/g' src/lib/wordParser.ts
sed -i 's/text: bMatch ? bMatch\[1\].trim() : "Đáp án B"/text: stripU(bMatch ? bMatch[1].trim() : "Đáp án B")/g' src/lib/wordParser.ts
sed -i 's/text: cMatch ? cMatch\[1\].trim() : "Đáp án C"/text: stripU(cMatch ? cMatch[1].trim() : "Đáp án C")/g' src/lib/wordParser.ts
sed -i 's/text: dMatch ? dMatch\[1\].trim() : "Đáp án D"/text: stripU(dMatch ? dMatch[1].trim() : "Đáp án D")/g' src/lib/wordParser.ts

# For statements in PART_II
sed -i 's/text: stmtText || `Mệnh đề ${k}`/text: stripU(stmtText || `Mệnh đề ${k}`)/g' src/lib/wordParser.ts
