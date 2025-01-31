import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from './supabaseClient';
import type { RootState } from './store';

interface Exam {
  id: string;
  title: string;
  start_date: string;
  end_date?: string;
  zoom_url?: string;
}

interface LobbyState {
  currentExam: Exam | null;
  loading: boolean;
  error: string | null;
}

const initialState: LobbyState = {
  currentExam: null,
  loading: false,
  error: null,
};

export const fetchCurrentExam = createAsyncThunk<Exam>(
  'lobby/fetchCurrentExam',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .order('start_date', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data as Exam;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
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
      .addCase(fetchCurrentExam.fulfilled, (state, action: PayloadAction<Exam>) => {
        state.loading = false;
        state.currentExam = action.payload;
      })
      .addCase(fetchCurrentExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al obtener el examen actual';
      });
  },
});

export default lobbySlice.reducer;