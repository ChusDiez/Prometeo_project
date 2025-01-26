// src/store/adminSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Leer la URL base de la variable de entorno
const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://prometeoproject-production.up.railway.app';

// 1) Subir CSV
export const uploadCsvThunk = createAsyncThunk(
  'admin/uploadCsv',
  async (file, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('csvFile', file);

      const response = await fetch(`${baseUrl}/api/exams/upload-csv`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al subir CSV');
      }
      const data = await response.json();
      return data; // { message, inserted, examId, etc. }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 2) Editar examen
export const updateExamThunk = createAsyncThunk(
  'admin/updateExam',
  async ({ examId, payload }, thunkAPI) => {
    try {
      const response = await fetch(`${baseUrl}/api/exams/${examId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar examen');
      }
      const data = await response.json();
      return data; // { message: 'OK' }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 3) Obtener user-scores
export const fetchUsersScoresThunk = createAsyncThunk(
  'admin/fetchUsersScores',
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/users-scores`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener users-scores');
      }
      const data = await response.json();
      return data.results; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 4) Obtener exam stats (p80, p70, p60, media)
export const fetchExamsStatsThunk = createAsyncThunk(
  'admin/fetchExamsStats',
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/exams-stats`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Error al obtener stats');
      }
      const data = await response.json();
      return data.stats || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    examsStats: [],
    loadingStats: false,
    statsError: null,

    uploadingCSV: false,
    uploadError: null,
    uploadMessage: null,

    updatingExam: false,
    updateError: null,
    updateMessage: null,

    usersScores: [],
    loadingScores: false,
    scoresError: null,
  },
  reducers: {
    clearAdminMessages(state) {
      state.uploadError = null;
      state.uploadMessage = null;
      state.updateError = null;
      state.updateMessage = null;
    },
  },
  extraReducers: (builder) => {
    // uploadCsvThunk
    builder
      .addCase(uploadCsvThunk.pending, (state) => {
        state.uploadingCSV = true;
        state.uploadError = null;
        state.uploadMessage = null;
      })
      .addCase(uploadCsvThunk.fulfilled, (state, action) => {
        state.uploadingCSV = false;
        state.uploadMessage = action.payload.message;
      })
      .addCase(uploadCsvThunk.rejected, (state, action) => {
        state.uploadingCSV = false;
        state.uploadError = action.payload;
      })

      // updateExamThunk
      .addCase(updateExamThunk.pending, (state) => {
        state.updatingExam = true;
        state.updateError = null;
        state.updateMessage = null;
      })
      .addCase(updateExamThunk.fulfilled, (state, action) => {
        state.updatingExam = false;
        state.updateMessage = action.payload.message || 'Examen actualizado';
      })
      .addCase(updateExamThunk.rejected, (state, action) => {
        state.updatingExam = false;
        state.updateError = action.payload;
      })

      // fetchUsersScoresThunk
      .addCase(fetchUsersScoresThunk.pending, (state) => {
        state.loadingScores = true;
        state.scoresError = null;
      })
      .addCase(fetchUsersScoresThunk.fulfilled, (state, action) => {
        state.loadingScores = false;
        state.usersScores = action.payload || [];
      })
      .addCase(fetchUsersScoresThunk.rejected, (state, action) => {
        state.loadingScores = false;
        state.scoresError = action.payload;
      })

      // fetchExamsStatsThunk
      .addCase(fetchExamsStatsThunk.pending, (state) => {
        state.loadingStats = true;
        state.statsError = null;
      })
      .addCase(fetchExamsStatsThunk.fulfilled, (state, action) => {
        state.loadingStats = false;
        state.examsStats = action.payload;
      })
      .addCase(fetchExamsStatsThunk.rejected, (state, action) => {
        state.loadingStats = false;
        state.statsError = action.payload;
      });
  },
});

export const { clearAdminMessages } = adminSlice.actions;
export default adminSlice.reducer;
