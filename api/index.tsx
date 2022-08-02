import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const api = axios.create({ baseURL: 'https://florae-back.herokuapp.com' });

//user
export const register = (formData: any) => api.post('/register', formData);
export const login = (formData: any) => api.post('/login', formData);
export const logout = async () => {
  AsyncStorage.getAllKeys().then((keys) => AsyncStorage.multiRemove(keys));
};
export const savePlant = (formData: any, token: string) => api.post('/plants', formData, { headers: { Authorization: `Bearer ${token}` } });
export const editPlant = (plantId: string, formData: any, token: string) =>
  api.patch(`/plants/${plantId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
export const deletePlant = (plantId: string, token: string) => api.delete(`/plants/${plantId}`, { headers: { Authorization: `Bearer ${token}` } });
export const getPlants = (token: string) => api.get('/plants', { headers: { Authorization: `Bearer ${token}` } });
