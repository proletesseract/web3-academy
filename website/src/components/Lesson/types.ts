import { QuizQuestion } from '../Quiz/Quiz';

export interface LessonStep {
  id: string;
  title: string;
  content: string;
  codeChallenge?: {
    defaultCode: string;
    language?: string;
    solution: string;
    validateFn?: string;
  };
  quiz?: QuizQuestion[];
  checklist?: {
    items: {
      id: string;
      text: string;
      type?: 'checkbox' | 'input';
      placeholder?: string;
      validationPattern?: string;
    }[];
  };
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  steps: LessonStep[];
} 