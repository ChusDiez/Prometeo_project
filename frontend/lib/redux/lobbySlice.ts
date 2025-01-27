// lobbySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface LobbyState {
  exam: any;
  loading: boolean;
  error: string | null;
}

const initialState: LobbyState = {
  exam: null,
  loading: false,
  error: null,
};

/** Thunk para obtener el examen actual */
export const fetchCurrentExam = createAsyncThunk(
  'lobby/fetchCurrentExam',
  async () => {
    // fetch tu API
    // Devuelve el examen actual {id, title, start_date, ...}
    return { id: 123, title: 'Examen final', start_date: '2025-01-30T10:00:00Z' };
  }
);

const lobbySlice = createSlice({
  name: 'lobby',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentExam.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCurrentExam.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.exam = action.payload;
    });
    builder.addCase(fetchCurrentExam.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Error al obtener el examen actual';
    });
  },
});

export default lobbySlice.reducer;
