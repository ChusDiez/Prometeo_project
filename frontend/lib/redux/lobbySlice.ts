import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from './supabaseClient'; // Asegúrate de importar tu cliente Supabase

interface LobbyExam {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  zoom_url?: string;
  user_id: string;
}

interface LobbyState {
  exams: LobbyExam[]; // Cambiado a array para múltiples exámenes
  loading: boolean;
  error: string | null;
}

const initialState: LobbyState = {
  exams: [],
  loading: false,
  error: null,
};

export const fetchActiveExams = createAsyncThunk<LobbyExam[]>(
  'lobby/fetchActiveExams',
  async (_, { rejectWithValue }) => {
    try {
      const currentDate = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .gte('end_date', currentDate)
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data as LobbyExam[];
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
      .addCase(fetchActiveExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveExams.fulfilled, (state, action: PayloadAction<LobbyExam[]>) => {
        state.loading = false;
        state.exams = action.payload;
      })
      .addCase(fetchActiveExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al obtener exámenes activos';
      });
  },
});

export default lobbySlice.reducer;