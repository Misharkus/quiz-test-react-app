import { useState } from "react";
import "./App.css";
import questionsData from "./api/questions.json";
import type { Question } from "./types/Question";
import { generateQuiz } from "./utils/quizUtils";

function App() {
  const [currentQuiz, setCurrentQuiz] = useState<Question[]>([]);
  const [quizLength, setQuizLength] = useState(10); // дефолтна кількість тестів
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  // Функція для старту тесту
  const startNewQuiz = (count: number) => {
    const questionsForSession = generateQuiz(questionsData as Question[], count);
    setCurrentQuiz(questionsForSession);
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  // Обробник вибору відповіді
  const handleAnswerClick = (selectedOption: string) => {
    const currentQuestion = currentQuiz[currentQuestionIndex];

    if (selectedOption === currentQuestion.options[currentQuestion.correctAnswer]) {
      setScore((prev) => prev + 1);
    }

    // Перехід до наступного питання
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  // 1. Екран вибору кількості питань (якщо тест ще не запущено)
  if (currentQuiz.length === 0) {
    return (
      <div className="quiz-setup">
        <h2>Обери кількість питань для тесту:</h2>
        <select value={quizLength} onChange={(e) => setQuizLength(Number(e.target.value))}>
          <option value={10}>10 питань</option>
          <option value={50}>50 питань</option>
          <option value={100}>100 питань</option>
          <option value={150}>150 питань</option>
          <option value={200}>200 питань</option>
        </select>
        <button onClick={() => startNewQuiz(quizLength)}>Почати тест</button>
      </div>
    );
  }

  // 2. Екран результатів (якщо пройшли всі вибрані питання)
  if (currentQuestionIndex >= currentQuiz.length) {
    return (
      <div className="quiz-results">
        <h2>Тест завершено!</h2>
        <p>
          Твій результат: {score} з {currentQuiz.length}
        </p>
        <button onClick={() => setCurrentQuiz([])}>Пройти ще раз</button>
      </div>
    );
  }

  // 3. Екран активного тесту
  const activeQuestion = currentQuiz[currentQuestionIndex];

  return (
    <div className="quiz-box">
      <h3>
        Питання {currentQuestionIndex + 1} з {currentQuiz.length}
      </h3>
      <p className="question-text">{activeQuestion.question}</p>

      <div className="options-list">
        {activeQuestion.options.map((option, index) => (
          <div key={index} className="question-option">
            <button onClick={() => handleAnswerClick(option)}>{option}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
