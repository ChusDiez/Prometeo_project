// src/services/authService.js
import api from './api';

export async function registerUser({ email, password, name }) {
  const response = await api.post('/api/auth/register', { email, password, name });
  return response.data;
}

export async function loginUser({ email, password }) {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
}
