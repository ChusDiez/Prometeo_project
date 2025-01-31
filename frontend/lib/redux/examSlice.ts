// lib/redux/examSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from './supabaseClient';
import type { Question, Exam, Result, AnswerPayload } from '../../types/exam';

interface ExamState {
  questions: Question[];
  loading: boolean;
  error: string | null;
  submitLoading: boolean;
  submitError: string | null;
  finalScore: number | null;
  results: Result[];
  currentExam: Exam | null;  // <- Añadir
  answers: Record<string, string>;
  confidence: Record<string, string>;
}

const initialState: ExamState = {
  questions: [],
  results: [],
  loading: false,
  error: null,
  submitLoading: false,
  submitError: null,
  finalScore: null,
  currentExam: null,
  answers: {},
  confidence: {},
};

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
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message);
    }
  }
);

export const submitExamAnswers = createAsyncThunk<void, { 
  examId: string; 
  answers: AnswerPayload[] 
}>(
  'exam/submitExamAnswers',
  async ({ examId, answers }, { rejectWithValue }) => {
    try {
      const { data: user, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user?.user) {
        throw new Error('Usuario no autenticado');
      }

      const formattedAnswers = answers.map(answer => ({
        exam_id: examId,
        user_id: user.user.id,
        question_id: answer.question_id,
        selected_option: answer.selected_option
      }));

      const { error } = await supabase
        .from('answers')
        .insert(formattedAnswers);

      if (error) throw error;
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message);
    }
  }
);

export const fetchExamResults = createAsyncThunk<Result[], string>(
  'exam/fetchExamResults',
  async (examId, { rejectWithValue }) => {
    try {
      const { data: user, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user?.user) {
        throw new Error('Usuario no autenticado');
      }

      const { data, error } = await supabase
        .from('exam_results')
        .select('*')
        .eq('exam_id', examId)
        .eq('user_id', user.user.id);

      if (error) throw error;
      return data as Result[];
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message);
    }
  }
);

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    setCurrentExam: (state, action: PayloadAction<Exam>) => {
      state.currentExam = action.payload;
    },
    resetExam: (state) => {
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