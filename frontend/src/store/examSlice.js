// src/store/examSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk: obtener preguntas
export const fetchExamQuestions = createAsyncThunk(
  'exam/fetchQuestions',
  async (examId, thunkAPI) => {
    try {
      const response = await fetch(`/api/exams/${examId}/questions`);
      if (!response.ok) throw new Error('Error al obtener preguntas');
      const data = await response.json();
      return data.questions; // array de preguntas
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk: enviar respuestas
export const submitExamAnswers = createAsyncThunk(
  'exam/submitAnswers',
  async ({ examId, payload }, thunkAPI) => {
    try {
      const response = await fetch(`/api/exams/${examId}/submitExam`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), 
      });
      if (!response.ok) throw new Error('Error al enviar examen');
      const data = await response.json();
      return data; // { finalScore, ... }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const examSlice = createSlice({
  name: 'exam',
  initialState: {
    questions: [],
    loading: false,
    error: null,
    submitLoading: false,
    submitError: null,
    finalScore: null,
  },
  reducers: {
    clearExamData(state) {
      state.questions = [];
      state.finalScore = null;
      state.error = null;
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchExamQuestions
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
        state.error = action.payload;
      })

      // submitExamAnswers
      .addCase(submitExamAnswers.pending, (state) => {
        state.submitLoading = true;
        state.submitError = null;
      })
      .addCase(submitExamAnswers.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.finalScore = action.payload.finalScore || null;
      })
      .addCase(submitExamAnswers.rejected, (state, action) => {
        state.submitLoading = false;
        state.submitError = action.payload;
      });
  },
});

export const { clearExamData } = examSlice.actions;
export default examSlice.reducer;
