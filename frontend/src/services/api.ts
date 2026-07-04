import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
});

// Interceptor para adicionar o Token JWT em cada requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@MeuDojo:token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros de autorização globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirou ou é inválido, limpa sessão e redireciona
      localStorage.removeItem('@MeuDojo:token');
      localStorage.removeItem('@MeuDojo:user');
      // Apenas faz reload se não estiver na página de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
