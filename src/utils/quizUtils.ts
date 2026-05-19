import type { Question } from "../types/Question";

export function generateQuiz(allQuestions: Question[], count: number): Question[] {
  if (count > allQuestions.length) {
    return allQuestions;
  }

  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
