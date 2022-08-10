import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const api = axios.create({ baseURL: 'https://florae-back.herokuapp.com' });

//user
export const register = (formData: any) => api.post('/register', formData);
export const login = (formData: any) => api.post('/login', formData);
export const logout = async () => {
  AsyncStorage.getAllKeys().then(async (keys) => await AsyncStorage.multiRemove(keys));
};
//plants
export const getPlants = (token: string) => api.get('/plants', { headers: { Authorization: `Bearer ${token}` } });
export const syncPlants = (plants: any, token: string) => api.post('/plants', plants, { headers: { Authorization: `Bearer ${token}` } });
export const plantIdentify = (plant: any) => api.post('/plants/identify', {plant});
