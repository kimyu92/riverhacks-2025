import axios from 'axios';
import { BACKEND_HOST_URI } from '../constants/baseUri';
import { useUserStore } from '../stores/useUserStore';

const axiosInstance = axios.create({
  baseURL: BACKEND_HOST_URI,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Add this to ensure cookies are sent with requests
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from Zustand store instead of localStorage
    const token = useUserStore.getState().accessToken;

    // Debug token
    console.log('Current token:', token);

    if (token) {
      // Ensure headers object exists
      config.headers = config.headers || {};

      // Set the Authorization header with the Bearer token
      // Make sure there's a space between Bearer and the token
      config.headers.Authorization = `Bearer ${token.trim()}`;
    } else {
      console.warn('No token found in store');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log the error for debugging
    console.error('Response error:', error);

    // Handle 401 (Unauthorized) responses
    if (error.response && error.response.status === 401) {
      console.log('Authentication error:', error.response.data);
      // Don't automatically logout - this allows for debugging
      // useUserStore.getState().logout();
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
