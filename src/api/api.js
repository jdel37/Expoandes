import axios from 'axios';
import { NETWORK_CONFIG } from '../config/network';

const api = axios.create({
  baseURL: NETWORK_CONFIG.API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export default api;
