// src/services/api.js
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'https://prometeoproject-production.up.railway.app';
const api = axios.create({ baseURL });

export default api;
