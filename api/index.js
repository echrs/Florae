import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const api = axios.create({ baseURL: 'https://florae-back.herokuapp.com' });

//user
export const register = (formData) => api.post('/user/register', formData);

export const login = (formData) => api.post('/user/login', formData);

export const logout = async () => {
    await AsyncStorage.removeItem('userCredentials');
};

export const getCurrentUser = async () => {
    return await AsyncStorage.getItem('userCredentials');
};