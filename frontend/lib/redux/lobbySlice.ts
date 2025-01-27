import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface LobbyExam {
  id: string;
  title: string;
  start_date: string;
  end_date?: string;
  status: 'pending' | 'active' | 'completed';
}

interface LobbyState {
  exam: LobbyExam | null;
  loading: boolean;
  error: string | null;
}

const initialState: LobbyState = {
  exam: null,
  loading: false,
  error: null,
};

export const fetchCurrentExam = createAsyncThunk<LobbyExam>(
  'lobby/fetchCurrentExam',
  async () => {
    const mockExam: LobbyExam = {
      id: '123',
      title: 'Examen final',
      start_date: '2025-01-30T10:00:00Z',
      status: 'pending'
    };
    return mockExam;
  }
);

const lobbySlice = createSlice({
  name: 'lobby',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentExam.fulfilled, (state, action: PayloadAction<LobbyExam>) => {
        state.loading = false;
        state.exam = action.payload;
      })
      .addCase(fetchCurrentExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al obtener el examen actual';
      });
  },
});

export default lobbySlice.reducer;