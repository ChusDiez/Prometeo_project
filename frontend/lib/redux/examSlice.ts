// examSlice.ts
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
// Ejemplo: obtener preguntas del examen desde tu API
export const fetchExamQuestions = createAsyncThunk<Question[], void>(
  'exam/fetchExamQuestions',
  async (_, { rejectWithValue }) => {
    try {
      // Reemplaza con la URL real de tu backend
      const response = await fetch('https://tu-api.com/exam/questions');
      if (!response.ok) {
        throw new Error('Error al cargar preguntas');
      }
      const data: Question[] = await response.json();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Ejemplo: enviar respuestas al backend
// Ajusta "payload" al formato que tu API espere
interface SubmitAnswersPayload {
  examId: string;
  answers: Record<string, string>;
}
export const submitExamAnswers = createAsyncThunk<any, SubmitAnswersPayload>(
  'exam/submitExamAnswers',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch('https://tu-api.com/exam/submit-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Error al enviar respuestas');
      }
      const data = await response.json();
      return data; // Podrías devolver, por ejemplo, la nota final
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
      // Ejemplo: agregamos la pregunta respondida a un array
      // (Podrías guardar también la respuesta del usuario)
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
  /** extraReducers para manejar los thunks */
  extraReducers: (builder) => {
    // fetchExamQuestions
    builder.addCase(fetchExamQuestions.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchExamQuestions.fulfilled, (state, action) => {
      state.loading = false;
      state.questions = action.payload; // Guardamos las preguntas en el estado
    });
    builder.addCase(fetchExamQuestions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Error al cargar preguntas';
    });

    // submitExamAnswers
    builder.addCase(submitExamAnswers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(submitExamAnswers.fulfilled, (state, action) => {
      state.loading = false;
      // Por ejemplo, podrías guardar la nota o resultados devueltos por el backend
      // state.results = action.payload.results; // Depende de tu respuesta
    });
    builder.addCase(submitExamAnswers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Error al enviar respuestas';
    });
  },
});

/** Exportar acciones sincronas y el reducer */
export const { startExam, submitAnswer, setResults, resetExam } = examSlice.actions;
export default examSlice.reducer;
