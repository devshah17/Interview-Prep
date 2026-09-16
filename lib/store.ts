import { create } from 'zustand';

interface QuizState {
  questions: any[];
  config: any;
  setQuiz: (questions: any[], config: any) => void;
  clearQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  questions: [],
  config: null,
  setQuiz: (questions, config) => set({ questions, config }),
  clearQuiz: () => set({ questions: [], config: null }),
}));
