import type { Question } from "../types/Question";

export function generateQuiz(
  allQuestions: Question[],
  count: number,
  isRandom: boolean
): Question[] {
  if (count > allQuestions.length || !isRandom) {
    return allQuestions.slice(0, count);
  }

  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
