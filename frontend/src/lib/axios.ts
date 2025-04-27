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
      config.headers.Authorization = `Bearer ${token}`;

      // Log the headers being sent
      console.log('Request headers:', config.headers);
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
    // Log successful responses for debugging
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    // Log the error for debugging
    console.error('Response error:', error);

    // Handle 401 (Unauthorized) responses
    if (error.response && error.response.status === 401) {
      console.log('Authentication error, logging out');
      // Call logout from the store instead of manually removing from localStorage
      useUserStore.getState().logout();
      window.location.href = '/login';
    }

    // Handle 422 (Unprocessable Entity) responses
    if (error.response && error.response.status === 422) {
      console.error('Validation error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
