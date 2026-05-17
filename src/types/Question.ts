export type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string | number; // Need to delete number after updating questions.json
};
