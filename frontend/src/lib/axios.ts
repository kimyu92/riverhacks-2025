import axios from 'axios';
import { BACKEND_HOST_URI } from '../constants/baseUri';
import { useUserStore } from '../stores/useUserStore';

const axiosInstance = axios.create({
  baseURL: BACKEND_HOST_URI,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from Zustand store instead of localStorage
    const token = useUserStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 (Unauthorized) responses
    if (error.response && error.response.status === 401) {
      // Call logout from the store instead of manually removing from localStorage
      useUserStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
