// lib/redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import themeReducer from './themeSlice';
import lobbyReducer from './lobbySlice';
import examReducer from './examSlice';
import authReducer from './authSlice';
import adminReducer from './adminSlice';

// Configuración de persistencia
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'theme'], // Reducers a persistir
  blacklist: ['admin', 'lobby', 'exam'] // Reducers no persistidos
};

// Combinar todos los reducers
const rootReducer = combineReducers({
  theme: themeReducer,
  lobby: lobbyReducer,
  exam: examReducer,
  auth: authReducer,
  admin: adminReducer
});

// Reducer persistido
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REGISTER'],
        ignoredPaths: ['_persist']
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

export const persistor = persistStore(store);

// Tipos globales
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;