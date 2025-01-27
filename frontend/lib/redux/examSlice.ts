import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from './supabaseClient'; // Asegúrate de tener esta configuración

/** INTERFACES */
interface Question {
  id: string;
  exam_id: string;
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  correct_option: 'A' | 'B' | 'C';
  topic: string;
  feedback?: string;
}

interface Exam {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  user_id: string;
  zoom_url?: string;
}

interface Result {
  id: string;
  user_id: string;
  exam_id: string;
  final_score: number;
  created_at: string;
}

interface AnswerPayload {
  question_id: string;
  selected_option: 'A' | 'B' | 'C';
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
export const fetchExamQuestions = createAsyncThunk<Question[], string>(
  'exam/fetchExamQuestions',
  async (examId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('exam_id', examId);

      if (error) throw error;
      return data as Question[];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const submitExamAnswers = createAsyncThunk<void, { examId: string; answers: AnswerPayload[] }>(
  'exam/submitExamAnswers',
  async ({ examId, answers }, { rejectWithValue }) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Usuario no autenticado');

      const formattedAnswers = answers.map(answer => ({
        exam_id: examId,
        user_id: user.data.user.id,
        question_id: answer.question_id,
        selected_option: answer.selected_option
      }));

      const { error } = await supabase
        .from('answers')
        .insert(formattedAnswers);

      if (error) throw error;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchExamResults = createAsyncThunk<Result[], string>(
  'exam/fetchExamResults',
  async (examId, { rejectWithValue }) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('exam_results')
        .select('*')
        .eq('exam_id', examId)
        .eq('user_id', user.data.user.id);

      if (error) throw error;
      return data as Result[];
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
    setCurrentExam(state, action: PayloadAction<Exam>) {
      state.currentExam = action.payload;
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
      .addCase(submitExamAnswers.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitExamAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al enviar respuestas';
      })
      .addCase(fetchExamResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchExamResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al obtener resultados';
      });
  },
});

export const { setCurrentExam, resetExam } = examSlice.actions;
export default examSlice.reducer;