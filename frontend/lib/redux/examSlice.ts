import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

/** INTERFACES */
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

interface SubmitAnswersPayload {
  examId: string;
  answers: Record<string, string>;
}

interface SubmitResponse {
  success: boolean;
  score: number;
  message?: string;
}

interface ExamState {
  currentExam: Exam | null;
  questions: Question[];
  results: Result[];
  loading: boolean;
  error: string | null;
}

/** ESTADO INICIAL */
const initialState: ExamState = {
  currentExam: null,
  questions: [],
  results: [],
  loading: false,
  error: null,
};

/** THUNKS */
export const fetchExamQuestions = createAsyncThunk<Question[], void>(
  'exam/fetchExamQuestions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://prometeoproject-production.up.railway.app/api/exam/questions');
      if (!response.ok) throw new Error('Error al cargar preguntas');
      return await response.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const submitExamAnswers = createAsyncThunk<SubmitResponse, SubmitAnswersPayload>(
  'exam/submitExamAnswers',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch('https://prometeoproject-production.up.railway.app/api/exam/submit-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Error al enviar respuestas');
      return await response.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

/** SLICE */
const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    startExam(state, action: PayloadAction<Exam>) {
      state.currentExam = action.payload;
    },
    submitAnswer(state, action: PayloadAction<Question>) {
      state.questions.push(action.payload);
    },
    setResults(state, action: PayloadAction<Result[]>) {
      state.results = action.payload;
    },
    resetExam(state) {
      state.currentExam = null;
      state.questions = [];
      state.results = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExamQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchExamQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al cargar preguntas';
      })
      .addCase(submitExamAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitExamAnswers.fulfilled, (state, action: PayloadAction<SubmitResponse>) => {
        state.loading = false;
        state.results.push({
          score: action.payload.score,
          totalQuestions: state.questions.length,
          timestamp: new Date().toISOString()
        });
      })
      .addCase(submitExamAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al enviar respuestas';
      });
  },
});

export const { startExam, submitAnswer, setResults, resetExam } = examSlice.actions;
export default examSlice.reducer;