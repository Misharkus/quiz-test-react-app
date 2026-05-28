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
  const [uncorrectQuestions, setUncorrectQuestions] = useState<Question[]>([]);
  const [isRandom, setIsRandom] = useState(true);
  const [filter, setFilter] = useState('all');

  const handleReset = () => {
    setCurrentQuiz([]);
    setCurrentQuestionIndex(0);
    setUncorrectQuestions([]);
    setScore(0);
  }

  const getFilteredQuestions = (questionsData: Question[]) => {
    let filteredQuestions = [...questionsData];

    filteredQuestions = filteredQuestions.filter(question => {
      switch(filter) {
        case 'easy': 
          return question.difficulty === 1;
        case 'medium': 
          return question.difficulty === 2;
        case 'hard': 
          return question.difficulty === 3;
        default: 
          return true;
      }
    })

    return filteredQuestions;
  }

  const preperedQuestions = getFilteredQuestions(questionsData as Question[]);

  // Функція для старту тесту
  const startNewQuiz = (count: number) => {
    const questionsForSession = generateQuiz(preperedQuestions, count, isRandom);
    setCurrentQuiz(questionsForSession);
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  // Обробник вибору відповіді
  const handleAnswerClick = (selectedOption: string) => {
    const currentQuestion = currentQuiz[currentQuestionIndex];

    if (selectedOption !== currentQuestion.correctAnswer) {
      setUncorrectQuestions((prev) => [...prev, currentQuestion]);
    }

    if (selectedOption === currentQuestion.correctAnswer) {
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
          <option value={600}>600 питань</option>
        </select>
        <h2>Обери рівень складності питань:</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value={'all'}>Всі питання</option>
          <option value={'easy'}>1 рівень</option>
          <option value={'medium'}>2 рівень</option>
          <option value={'hard'}>3 рівень</option>
        </select>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '25px', marginBottom: '25px' }}>
          <h2 style={{ margin: '0', marginRight: '10px' }}>Рандом {isRandom ? "On" : "Off"}</h2>
          <button className="random-button" onClick={() => setIsRandom(prev => !prev)}>
            {isRandom ? "Вимкнути" : "Увімкнути"}
          </button>
        </div>
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
        {uncorrectQuestions.length > 0 && (
          <div className="uncorrect-questions">
            <h3>Невірні питання:</h3>
            <ul>
              {uncorrectQuestions.map((question) => (
                <li key={question.id}>
                  <strong>{question.question}</strong>
                  <p>Правильна відповідь: {question.correctAnswer}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
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
      <button className="reset-button" onClick={handleReset}>Повернутися у меню вибору тесту</button>
    </div>
  );
}

export default App;
