export type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string; // Need to delete number after updating questions.json
  difficulty: number; // 1 - easy, 2 - medium, 3 - hard
};
