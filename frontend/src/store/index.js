// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import lobbyReducer from './lobbySlice';
import examReducer from './examSlice'; // <-- Asegúrate de import examSlice
import adminReducer from './adminSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    lobby: lobbyReducer,
    exam: examReducer, // <-- El exam slice
    admin: adminReducer
  }
});

export default store;
