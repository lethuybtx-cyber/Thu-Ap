sed -i '337,344c\
      let isCorrect = ansMap[k];\
      if (isCorrect === undefined) {\
        // default based on underline presence if not specified in ansMap\
        isCorrect = /\[U\]/.test(stmtText);\
      }\
      if (/(?:\\[|\\()?(?:Đúng|Đ|True)(?:\\]|\\)?)/i.test(stmtText)) {\
        isCorrect = true;\
        stmtText = stmtText.replace(/(?:\\[|\\()?(?:Đúng|Đ|True)(?:\\]|\\)?)/gi, "").trim();\
      } else if (/(?:\\[|\\()?(?:Sai|S|False)(?:\\]|\\)?)/i.test(stmtText)) {\
        isCorrect = false;\
        stmtText = stmtText.replace(/(?:\\[|\\()?(?:Sai|S|False)(?:\\]|\\)?)/gi, "").trim();\
      }\
' src/lib/wordParser.ts
