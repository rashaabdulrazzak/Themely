// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api/v1', // consider making this an absolute URL in dev if needed
  headers: { 'Content-Type': 'application/json' ,
    // Authorization header will be set in the interceptor below
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ1MjQ3OTQwLTQ5NDMtNDJkZi04OGRjLWRkYWVhNDMzMzJhYiIsInVzZXJuYW1lIjoic2F3eSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc1NzcxODE3NSwiZXhwIjoxNzY1NDk0MTc1fQ.r4im-Stuiv3IKhgtPhOQuQdpO95fxZbJJG1lQ1cbwmI`,

  },

  
});

// Attach token on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auto-handle 401s (invalid/expired token)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      // (optional) redirect to login page here
      // window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
