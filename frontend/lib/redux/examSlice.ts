import { createSlice } from '@reduxjs/toolkit';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface Exam {
  id: string;
  title: string;
  duration: number;
}

interface Result {
  score: number;
  totalQuestions: number;
  timestamp: string;
}

interface ExamState {
  currentExam: Exam | null;
  questions: Question[];
  results: Result[];
  loading: boolean;
  error: string | null;
}

const initialState: ExamState = {
  currentExam: null,
  questions: [],
  results: [],
  loading: false,
  error: null
};

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    startExam(state, action: { type: string; payload: Exam }) {
      state.currentExam = action.payload;
    },
    submitAnswer(state, action: { type: string; payload: Question }) {
      state.questions.push(action.payload);
    },
    setResults(state, action: { type: string; payload: Result[] }) {
      state.results = action.payload;
    },
    resetExam(state: ExamState) {
      state.currentExam = null;
      state.questions = [];
    }
  }
});

export const { startExam, submitAnswer, setResults, resetExam } = examSlice.actions;
export default examSlice.reducer;
