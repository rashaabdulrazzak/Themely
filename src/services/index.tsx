/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';
import { handleError, handleResponse } from './handleResponse';
import type { Canvas, Template } from '../modules';

// Don't bake the token at creation time; it'll get stale.
const api = axios.create({
  baseURL: 'http://localhost:5001/api/v1',
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
export const getTemplatesbyId = async (id:string) => {
  try {
    console.log("Fetching users...");
    const response = await api.get(`/template/${id}`);

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
export const deleteTemplate = async (id:string) => {
  try {
    console.log("post template...",id);
    const response = await api.delete(`/template/${id}`);
    console.log("post template...",response);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
    throw error;
  }
};


// This function now accepts an optional imageFile
export const editTemplate = async (templateData: Template, imageFile: File | null) => {
  console.log('🌐 editTemplate API called');
  console.log('templateData:', templateData);
  console.log('imageFile received:', imageFile);
  console.log('imageFile details:', imageFile ? {
    name: imageFile.name,
    size: imageFile.size,
    type: imageFile.type
  } : 'No file provided');

  try {
    const formData = new FormData();

    formData.append('name', templateData.name || '');
    formData.append('price', String(templateData.price || 0));
    formData.append('category', templateData.category || '');
    formData.append('userId', templateData.userId || '');

    if (imageFile) {
      console.log('✅ Appending image file to FormData');
      formData.append('image', imageFile);
    } else {
      console.log('❌ No image file to append');
    }

    // Debug FormData content
    console.log('📦 FormData contents:');
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`${pair[0]}:`, `File: ${pair[1].name} (${pair[1].size} bytes, ${pair[1].type})`);
      } else {
        console.log(`${pair[0]}:`, pair[1]);
      }
    }

    const response = await api.patch(`/template/${templateData.id}`, formData);
    return handleResponse(response);
  } catch (error) {
    console.error('💥 API Error:', error);
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


// canvases
export const getCanvases = () => api.get('/canvases');
export const deleteCanvas = async (id:string) => {
  try {
    console.log("delete canvas...",id);
    const response = await api.delete(`/canvases/${id}`);
    console.log("canvas template...",response);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
    throw error;
  }
};
 export const editCanvas = async (data:Canvas) => {
  try {
    console.log("post canvas...",data);
    const response = await api.patch(`/canvases/${data.id}`,data);
    console.log("post canvas...",response);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
    throw error;
  }
}; 
//export const getDownloads = () => api.get('/download');
export const editTemplateWithFile = async (templateData: Template, imageFile: File | null) => {
  try {
    const formData = new FormData();

    formData.append('name', templateData.name || '');
    formData.append('price', String(templateData.price || 0));
    formData.append('category', templateData.category || '');
    formData.append('userId', templateData.userId || '');

    if (imageFile) {
      formData.append('image', imageFile);
    }

    // Use raw fetch instead of your API client
    const token = localStorage.getItem('token'); // or however you get your token
    
    const response = await fetch(`http://localhost:5001/api/v1/template/${templateData.id}`, {
      method: 'PATCH',
      headers: {
        // Only include auth header - let browser set Content-Type for FormData
        'Authorization': `Bearer ${token}`,
      },
      body: formData, // Raw FormData, not JSON
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return handleResponse(response);
  } catch (error) {
    handleError(error);
    throw error;
  }
};
export default api;

