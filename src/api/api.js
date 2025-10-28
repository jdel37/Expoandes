import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.5:4000/api',
  headers: { 'Content-Type': 'application/json' },
});

export default api;
