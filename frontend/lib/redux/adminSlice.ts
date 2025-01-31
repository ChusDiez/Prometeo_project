// lib/redux/adminSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from './supabaseClient';
import type { RootState } from './store';

// Interfaces
export interface Score {
  user_id: string;
  exam_id: string;
  final_score: number;
  users?: { email: string }[];  // Cambiar a array
  exams?: { title: string }[];
}

export interface ExamStat {
  exam_id: string;
  p80: number;
  p70: number;
  p60: number;
  media: number;
}

interface UpdateExamPayload {
  start_date?: string;
  end_date?: string;
  zoom_url?: string;
}

interface AdminState {
  updatingExam: boolean;
  updateError: string | null;
  updateMessage: string | null;
  usersScores: Score[];
  loadingScores: boolean;
  scoresError: string | null;
  examsStats: ExamStat[];
  loadingStats: boolean;
  statsError: string | null;
}

const initialState: AdminState = {
  updatingExam: false,
  updateError: null,
  updateMessage: null,
  usersScores: [],
  loadingScores: false,
  scoresError: null,
  examsStats: [],
  loadingStats: false,
  statsError: null,
};

// Tipos para los thunks
type ThunkApiConfig = {
  state: RootState;
  rejectValue: string;
};

export const updateExamThunk = createAsyncThunk<
  { message: string },
  { examId: string; payload: UpdateExamPayload },
  ThunkApiConfig
>(
  'admin/updateExam',
  async ({ examId, payload }, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('exams')
        .update(payload)
        .eq('id', examId);

      if (error) throw error;
      return { message: 'Examen actualizado con éxito' };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchUsersScoresThunk = createAsyncThunk<Score[], void, ThunkApiConfig>(
  'admin/fetchUsersScores',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('exam_results')
        .select(`
          user_id,
          exam_id,
          final_score,
          users (email),
          exams (title)
        `);

      if (error) throw error;
      return data as unknown as Score[];;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchExamsStatsThunk = createAsyncThunk<ExamStat[], void, ThunkApiConfig>(
  'admin/fetchExamsStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.rpc('calculate_exam_stats');

      if (error) throw error;
      return data as ExamStat[];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return rejectWithValue(errorMessage);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminMessages(state) {
      state.updateError = null;
      state.updateMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateExamThunk.pending, (state) => {
        state.updatingExam = true;
        state.updateError = null;
        state.updateMessage = null;
      })
      .addCase(updateExamThunk.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
        state.updatingExam = false;
        state.updateMessage = action.payload.message;
      })
      .addCase(updateExamThunk.rejected, (state, action) => {
        state.updatingExam = false;
        state.updateError = action.payload ?? 'Error al actualizar examen';
      })
      .addCase(fetchUsersScoresThunk.pending, (state) => {
        state.loadingScores = true;
        state.scoresError = null;
      })
      .addCase(fetchUsersScoresThunk.fulfilled, (state, action: PayloadAction<Score[]>) => {
        state.loadingScores = false;
        state.usersScores = action.payload;
      })
      .addCase(fetchUsersScoresThunk.rejected, (state, action) => {
        state.loadingScores = false;
        state.scoresError = action.payload ?? 'Error al cargar resultados';
      })
      .addCase(fetchExamsStatsThunk.pending, (state) => {
        state.loadingStats = true;
        state.statsError = null;
      })
      .addCase(fetchExamsStatsThunk.fulfilled, (state, action: PayloadAction<ExamStat[]>) => {
        state.loadingStats = false;
        state.examsStats = action.payload;
      })
      .addCase(fetchExamsStatsThunk.rejected, (state, action) => {
        state.loadingStats = false;
        state.statsError = action.payload ?? 'Error al cargar estadísticas';
      });
  },
});

export const { clearAdminMessages } = adminSlice.actions;
export default adminSlice.reducer;