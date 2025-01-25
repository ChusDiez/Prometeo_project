// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, loginUser } from '../services/authService';

// Thunk: registro
export const registerThunk = createAsyncThunk(
  'auth/register',
  async ({ email, password, name }, thunkAPI) => {
    try {
      const data = await registerUser({ email, password, name });
      return data; // { message, user, ... }
    } catch (error) {
      // Ajustamos por si no hay error.response
      return thunkAPI.rejectWithValue(error.message || 'Error en register');
    }
  }
);

// Thunk: login
export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const data = await loginUser({ email, password });
      return data; // { user, session, ... }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Error en login');
    }
  }
);

// Thunk opcional para logout en el back
export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Error al hacer logout en el server');
      }
      return; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,      // Para peticiones
    error: null,         // Para error genérico
    token: null,
    isLoggedIn: false,
    user: null,          // user info
    logoutError: null
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.isLoggedIn = true;
      state.user = action.payload.user || null;
    },
    logoutSuccess: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      state.user = null;
      state.logoutError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        // asume que action.payload.user existe
        state.user = action.payload.user || null;
        state.isLoggedIn = !!action.payload.user; 
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al registrar';
      })

      // LOGIN
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        // asume action.payload = { user, session? ... }
        state.user = action.payload.user || null;
        state.isLoggedIn = !!action.payload.user;
        // si hay token => guardarlo
        if (action.payload.session?.access_token) {
          state.token = action.payload.session.access_token;
        }
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al iniciar sesión';
      })

      // LOGOUT
      .addCase(logoutThunk.fulfilled, (state) => {
        state.token = null;
        state.isLoggedIn = false;
        state.user = null;
        state.logoutError = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.logoutError = action.payload;
      });
  }
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
