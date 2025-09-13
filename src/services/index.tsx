/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';
import { handleError, handleResponse } from './handleResponse';

// Don't bake the token at creation time; it'll get stale.
const api = axios.create({
  baseURL: 'https://server.thimly.com/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// 1) Always attach the latest token at request time
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: clear token on 401s
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      delete api.defaults.headers.common.Authorization;
    }
    return Promise.reject(err);
  }
);

// ---------- Auth ----------
export const authRegister = (registerData: any) =>
  api.post('/auth/register', registerData);

export const authLogin = async (loginData: any) => {
  try {
    // 2) Fix the path: needs a leading slash
    const response = await api.post('/auth/login', loginData);

    // Your handleResponse persists token when present and returns a merged object
    const data = handleResponse(response, undefined, 'Post');

    // 3) Immediately update axios default header (helps the very next call)
    const token = data?.token ?? response?.data?.token ?? response?.data?.accessToken;
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    return data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const authLogout = async () => {
  try {
    const response = await api.post('/auth/logout');
    const data = handleResponse(response, undefined, 'Post');
    localStorage.removeItem('token');
    delete api.defaults.headers.common.Authorization;
    return data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// ---------- Data ----------
export const getUsers = async () => {
  try {
    // If your backend uses /users (plural), change this accordingly.
    console.log("Fetching users...");
    const response = await api.get('/user');

    return handleResponse(response);
  } catch (error) {
    handleError(error);
    throw error;
  }
};
export const getTemplates = async () => {
  try {
    console.log("Fetching users...");
    const response = await api.get('/template/all');

    return handleResponse(response);
  } catch (error) {
    handleError(error);
    throw error;
  }
};
export const getDownloads = async () => {
  try {
    console.log("Fetching users...");
    const response = await api.get('/download');

    return handleResponse(response);
  } catch (error) {
    handleError(error);
    throw error;
  }
};


export const getCanvases = () => api.get('/canvases');
//export const getDownloads = () => api.get('/download');

export default api;

