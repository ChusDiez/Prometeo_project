// lib/redux/adminSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

/** Interfaces de ejemplo, ajusta a tu API real */
interface ScoreUser {
  id: number;
  email?: string;
}

interface ScoreExam {
  id: number;
  title?: string;
}

export interface Score {
  user_id: number;
  exam_id: number;
  final_score: number;
  users?: ScoreUser;
  exams?: ScoreExam;
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

interface UpdateExamResponse {
  message: string;
}

/** Estado inicial de Admin */
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

/** Estado inicial */
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

/** Thunk para actualizar examen */
export const updateExamThunk = createAsyncThunk<
  UpdateExamResponse,
  { examId: string; payload: UpdateExamPayload }
>(
  'admin/updateExam',
  async ({ examId: _examId, payload: _payload }) => { 
    // Aquí iría la lógica de fetch a tu API real,
    // usando examId y payload. Devuelves un objeto con 'message'.
    return { message: 'Examen actualizado con éxito' };
  }
);

/** Thunk para obtener los "scores" de usuarios */
export const fetchUsersScoresThunk = createAsyncThunk<Score[]>(
  'admin/fetchUsersScores',
  async () => {
    // Ejemplo: fetch a tu API
    // Devuelve la lista de scores
    return [
      {
        user_id: 1,
        exam_id: 123,
        final_score: 8.5,
        users: { id: 1, email: 'test@example.com' },
        exams: { id: 123, title: 'Examen A' },
      },
      // ... más objetos
    ];
  }
);

/** Thunk para obtener estadísticas de exámenes */
export const fetchExamsStatsThunk = createAsyncThunk<ExamStat[]>(
  'admin/fetchExamsStats',
  async () => {
    // fetch a tu API
    // Devuelve datos estadísticos en forma de array
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
    builder
      .addCase(updateExamThunk.pending, (state) => {
        state.updatingExam = true;
        state.updateError = null;
        state.updateMessage = null;
      })
      .addCase(
        updateExamThunk.fulfilled,
        (state, action: PayloadAction<UpdateExamResponse>) => {
          state.updatingExam = false;
          state.updateMessage = action.payload.message;
        }
      )
      .addCase(updateExamThunk.rejected, (state, action) => {
        state.updatingExam = false;
        state.updateError = action.error.message || 'Error al actualizar examen';
      });

    /** fetchUsersScoresThunk */
    builder
      .addCase(fetchUsersScoresThunk.pending, (state) => {
        state.loadingScores = true;
        state.scoresError = null;
      })
      .addCase(
        fetchUsersScoresThunk.fulfilled,
        (state, action: PayloadAction<Score[]>) => {
          state.loadingScores = false;
          state.usersScores = action.payload;
        }
      )
      .addCase(fetchUsersScoresThunk.rejected, (state, action) => {
        state.loadingScores = false;
        state.scoresError =
          action.error.message || 'Error al cargar userScores';
      });

    /** fetchExamsStatsThunk */
    builder
      .addCase(fetchExamsStatsThunk.pending, (state) => {
        state.loadingStats = true;
        state.statsError = null;
      })
      .addCase(
        fetchExamsStatsThunk.fulfilled,
        (state, action: PayloadAction<ExamStat[]>) => {
          state.loadingStats = false;
          state.examsStats = action.payload;
        }
      )
      .addCase(fetchExamsStatsThunk.rejected, (state, action) => {
        state.loadingStats = false;
        state.statsError =
          action.error.message || 'Error al obtener estadísticas';
      });
  },
});

export const { clearAdminMessages } = adminSlice.actions;
export default adminSlice.reducer;