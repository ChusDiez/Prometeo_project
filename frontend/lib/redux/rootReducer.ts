import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import themeReducer from './themeSlice';
// Importa otros reducers

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  // ...otros reducers
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;