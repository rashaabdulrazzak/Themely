
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://server.thimly.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
  },
});

// Auth
export const authRegister = (registerData:any) => {
  return api.post('/auth/register',registerData);
};

export const authLogin = (loginData:any) => {
  return api.post('/auth/login', loginData);
 
};


export const getTemplates=() => {
  return api.get('/template/all');
}

export const getCanvases=() => {
  return api.get('/canvases');
}

export default api;
