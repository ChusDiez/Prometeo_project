// adminSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

/** Estado inicial */
interface AdminState {
  updatingExam: boolean;
  updateError: string | null;
  updateMessage: string | null;
  usersScores: any[];
  loadingScores: boolean;
  scoresError: string | null;
  examsStats: any[];
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

/** Thunk para actualizar examen (ejemplo) */
export const updateExamThunk = createAsyncThunk(
  'admin/updateExam',
  async ({ examId, payload }: { examId: string; payload: any }) => {
    // Lógica de fetch con tu API
    // Devuelve algún resultado
    return { message: 'Examen actualizado con éxito' };
  }
);

/** Thunk para obtener scores (ejemplo) */
export const fetchUsersScoresThunk = createAsyncThunk(
  'admin/fetchUsersScores',
  async () => {
    // fetch a tu API
    // Devuelve la lista de scores
    return [
      { user_id: 1, exam_id: 123, final_score: 8.5, users: {}, exams: {} },
      // ...
    ];
  }
);

/** Thunk para obtener estadísticas de exámenes */
export const fetchExamsStatsThunk = createAsyncThunk(
  'admin/fetchExamsStats',
  async () => {
    // fetch a tu API
    // Devuelve datos estadísticos
    return [
      { exam_id: 'ABC', p80: 9, p70: 8, p60: 7, media: 7.5 },
      // ...
    ];
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
    /** updateExamThunk */
    builder.addCase(updateExamThunk.pending, (state) => {
      state.updatingExam = true;
      state.updateError = null;
      state.updateMessage = null;
    });
    builder.addCase(updateExamThunk.fulfilled, (state, action) => {
      state.updatingExam = false;
      state.updateMessage = action.payload.message;
    });
    builder.addCase(updateExamThunk.rejected, (state, action) => {
      state.updatingExam = false;
      state.updateError = action.error.message || 'Error al actualizar examen';
    });

    /** fetchUsersScoresThunk */
    builder.addCase(fetchUsersScoresThunk.pending, (state) => {
      state.loadingScores = true;
      state.scoresError = null;
    });
    builder.addCase(fetchUsersScoresThunk.fulfilled, (state, action: PayloadAction<any[]>) => {
      state.loadingScores = false;
      state.usersScores = action.payload;
    });
    builder.addCase(fetchUsersScoresThunk.rejected, (state, action) => {
      state.loadingScores = false;
      state.scoresError = action.error.message || 'Error al cargar userScores';
    });

    /** fetchExamsStatsThunk */
    builder.addCase(fetchExamsStatsThunk.pending, (state) => {
      state.loadingStats = true;
      state.statsError = null;
    });
    builder.addCase(fetchExamsStatsThunk.fulfilled, (state, action: PayloadAction<any[]>) => {
      state.loadingStats = false;
      state.examsStats = action.payload;
    });
    builder.addCase(fetchExamsStatsThunk.rejected, (state, action) => {
      state.loadingStats = false;
      state.statsError = action.error.message || 'Error al obtener stats';
    });
  },
});

export const { clearAdminMessages } = adminSlice.actions;
export default adminSlice.reducer;
