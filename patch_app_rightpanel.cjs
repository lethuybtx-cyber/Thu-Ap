const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// We need to pass currentQuestionId, onSelectQuestion, userAnswers, questions to RightPanel.
content = content.replace(
  '<RightPanel testResult={testResult} isTeacherMode={isTeacherMode} />',
  '<RightPanel testResult={testResult} isTeacherMode={isTeacherMode} questions={questions} currentQuestionId={currentQuestion ? currentQuestion.id : 1} onSelectQuestion={handleSelectQuestion} userAnswers={userAnswers} />'
);

fs.writeFileSync('src/App.tsx', content);
