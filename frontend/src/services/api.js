import axios from 'axios';

const api = axios.create({
  // In production on Vercel: /api is publicly routed to the backend service on the same domain.
  // In local dev: Vite proxy in vite.config.js forwards /api to localhost:5000.
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('scw_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      if (localStorage.getItem('scw_auth_token')) {
        localStorage.removeItem('scw_auth_token');
        localStorage.removeItem('scw_user_data');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
