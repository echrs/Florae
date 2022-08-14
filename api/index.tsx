import axios from 'axios';

const api = axios.create({ baseURL: 'https://florae-back.herokuapp.com' });

//user
export const register = (formData: any) => api.post('/users/register', formData);
export const login = (formData: any) => api.post('/users/login', formData);
export const resetPassword = (formData: any, token: string) =>
  api.post('/users/resetpassword', formData, { headers: { Authorization: `Bearer ${token}` } });
export const editUser = (userId: string, formData: any, token: string) =>
  api.patch(`/users/${userId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
//plants
export const getPlants = (token: string) => api.get('/plants', { headers: { Authorization: `Bearer ${token}` } });
export const syncPlants = (plants: any, token: string) => api.post('/plants', plants, { headers: { Authorization: `Bearer ${token}` } });
export const plantIdentify = (plant: any, token: string) => api.post('/plants/identify', { plant }, { headers: { Authorization: `Bearer ${token}` } });
