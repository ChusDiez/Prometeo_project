// src/store/lobbySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://prometeoproject-production.up.railway.app';

export const fetchCurrentExam = createAsyncThunk(
  'lobby/fetchCurrentExam',
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${baseUrl}/api/exams/current`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener el examen actual');
      }
      const data = await response.json();
      return data.exam || null;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const lobbySlice = createSlice({
  name: 'lobby',
  initialState: {
    exam: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearExam(state) {
      state.exam = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentExam.fulfilled, (state, action) => {
        state.loading = false;
        state.exam = action.payload;
      })
      .addCase(fetchCurrentExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al obtener el examen';
      });
  },
});

export const { clearExam } = lobbySlice.actions;
export default lobbySlice.reducer;
