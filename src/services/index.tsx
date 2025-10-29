/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';
import { handleError, handleResponse } from './handleResponse';
import type { Canvas, Template, User } from '../modules';

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

// services/authService.ts (Minimal version using your existing patterns)

export const authLogin = async (loginData: { email: string; password: string }) => {
  try {
    console.log('authLogin: Attempting login for:', loginData.email);
    
    const response = await api.post('/auth/login', loginData);
    const data = handleResponse(response, undefined, 'Post');

    // Extract token from different possible locations  
    const token = data?.token ?? 
                  data?.accessToken ?? 
                  response?.data?.token ?? 
                  response?.data?.accessToken;
    
    console.log('authLogin: Extracted token exists:', !!token);
    console.log('authLogin: Token value (first 20 chars):', token ? token.substring(0, 20) + '...' : 'null');

    if (!token) {
      throw new Error('No authentication token received');
    }

    // ✅ IMPORTANT: Set the authorization header correctly
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Debug: Verify it was set
    console.log('authLogin: Authorization header set to:', api.defaults.headers.common['Authorization']);
    console.log('authLogin: All headers after setting:', api.defaults.headers.common);

    return data;

  } catch (error) {
    console.error('authLogin: Error occurred:', error);
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
    console.log("Using manual authorization header...");
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error("No token available");
    }
    
    const response = await api.get('/template/all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log("✅ Manual header SUCCESS:", response.status);
    return handleResponse(response);
    
  } catch (error: any) {
    console.log("❌ Manual header FAILED:", error.response?.status);
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

export const deleteDownload = async (id:string) => {
  try {
    console.log("delete download...",id);
    const response = await api.delete(`/download/${id}`);
    console.log("download ...",response);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
    throw error;
  }
};
// canvases
//export const getCanvases = () => api.get('/canvases');
export const getCanvases = async () => {
  try {
    console.log("Using manual authorization header...");
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error("No token available");
    }
    
    const response = await api.get('/canvases', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log("✅ Manual header SUCCESS:", response.status);
    return handleResponse(response);
    
  } catch (error: any) {
    console.log("❌ Manual header FAILED:", error.response?.status);
    handleError(error);
    throw error;
  }
};
/* export const getCanvases = async () => {
  try {
    console.log("Fetching payments...");
    const response = await api.get('/canvases');

    return handleResponse(response);
  } catch (error) {
    handleError(error);
    throw error;
  }
}; */
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

    // ✅ Using axios (api instance)
    const response = await api.patch(`/template/${templateData.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    
      transformRequest: [(data) => data], // Prevent axios from transforming FormData
    });

    return handleResponse(response,'post');
    
  } catch (error) {
    handleError(error);
    throw error;
  }
};

/* export async function createTemplateWithFile(templateData:Template, imageFile:File | null) {
 
 try {
    console.log("add template...",templateData.id);
     // Use FormData to send image + data
  const formData = new FormData();
  formData.append('name', templateData.name);
  formData.append('price', templateData.price.toString());
  formData.append('category', templateData.category);
  formData.append('userId', templateData.userId);
  if (imageFile) formData.append('image', imageFile);
for (const pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}
  // Replace with your endpoint
  const response = await api.post('/template', formData);
  console.log("add template response...",response);
  return handleResponse(response);
  } catch (error) {
    handleError(error);
    throw error;
  }
} */

export async function createTemplateWithFile(templateData: Template, imageFile: File | null) {
  try {
    console.log("add template...", templateData.id);
    
    const formData = new FormData();
    formData.append('name', templateData.name);
    formData.append('price', templateData.price.toString());
    formData.append('category', templateData.category);
    formData.append('userId', templateData.userId);
    
    // ✅ ONLY append from imageFile parameter, not from templateData
    if (imageFile) {
      formData.append('image', imageFile);
    }
    console.log("FormData prepared for upload.",imageFile);
    
    // 🔍 Add this debug line to see what you're actually sending
    console.log('ImageFile object:', imageFile);
    console.log('Is File?', imageFile instanceof File);
    
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    console.log("Submitting to /template endpoint...", formData);
    
     const response = await api.post('/template', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // OR even better, don't set it at all:
      // headers: {},
      transformRequest: [(data) => data], // Prevent axios from transforming FormData
    });
    
    console.log("add template response...", response);
    return handleResponse(response,'Post');
  } catch (error) {
    handleError(error);
    throw error;
  }
}
// categories
export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return handleResponse(response);
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// payment 
export const getPayments = async () => {
  try {
    console.log("Fetching payments...");
    const response = await api.get('/payments');

    return handleResponse(response);
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const deletePayment = async (id:string) => {
  try {
    console.log("delete payments...",id);
    const response = await api.delete(`/payments/${id}`);
    console.log("payments ...",response);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Review 
export const getReviews = async () => {
  try {
    console.log("Fetching reviews...");
    const response = await api.get('/reviews');

    return handleResponse(response);
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const deleteReview = async (id:string) => {
  try {
    console.log("delete reviews...",id);
    const response = await api.delete(`/reviews/${id}`);
    console.log("reviews ...",response);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// user
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
export const deleteUser = async (id:string) => {
  try {
    console.log("delete user...",id);
    const response = await api.delete(`/user/${id}`);
    console.log("user ...",response);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
    throw error;
  }
};
 export const updateUser = async (data:User) => {
  try {
    console.log("post user...",data);
    const response = await api.patch(`/user/${data.id}`,data);
    console.log("post user...",response);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
    throw error;
  }
}; 
export async function getAnalytics() {
  //const token = localStorage.getItem("token"); // your stored JWT token
   console.log("Fetching analatics...");
  const response = await api.get('/analytics' );
   console.log("Fetching analatics result...",response);

  return handleResponse(response);
}

export default api;

