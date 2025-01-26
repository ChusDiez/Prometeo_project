// src/App.jsx
import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthGuard from './components/AuthGuard';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* ... otras rutas públicas, p.ej. /register, /landing, etc. */}

        {/* Rutas privadas bajo AuthGuard */}
        <Route element={<AuthGuard />}>
          <Route path="/exam" element={<ExamPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* ... cualquier ruta que quieras proteger */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;