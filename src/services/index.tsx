
import axios from 'axios';
//import api from './api';
console.log('API base URL:', localStorage.getItem('token'));
 const api = axios.create({
  baseURL: 'https://server.thimly.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ1MjQ3OTQwLTQ5NDMtNDJkZi04OGRjLWRkYWVhNDMzMzJhYiIsInVzZXJuYW1lIjoic2F3eSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc1NzAyNjUxOSwiZXhwIjoxNzY0ODAyNTE5fQ.AmEUW31NzkXQZzYN2YPjfUHba4D_4yIcSPOyp0qUdOc`,
  },
}); 

// Auth



export const authRegister = (registerData: any) =>
  api.post('/auth/register', registerData);

// IMPORTANT: adjust token property name based on your API response
export const authLogin = async (loginData: any) => {
  const res = await api.post('/auth/login', loginData);
  // Example response shapes — pick the right one for your API:
  // const token = res.data.token;
  // const token = res.data.accessToken;
  const token = res.data.token ?? res.data.accessToken;

  if (!token) throw new Error('Token not found in response');

  localStorage.setItem('token', token);
  return res.data; // return whatever you need (user, roles, etc.)
};

export const getTemplates = () => api.get('/template/all');
export const getCanvases = () => api.get('/canvases');
export const getDownloads = () => api.get('/download');
export default api;
