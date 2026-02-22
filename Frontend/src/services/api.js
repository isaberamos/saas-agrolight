// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export function parseApiError(err) {
  if (err.response) {
    const msg =
      typeof err.response.data === 'string'
        ? err.response.data
        : JSON.stringify(err.response.data);
    return `HTTP ${err.response.status} – ${msg}`;
  }
  if (err.request) {
    return 'Sem resposta do servidor (verifique se o backend está rodando).';
  }
  return err.message || 'Erro desconhecido';
}

export default api;
