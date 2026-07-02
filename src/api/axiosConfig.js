import axios from 'axios';

// Base URL untuk API
const BASE_URL = 'http://localhost:3000';

// Membuat instance axios dengan konfigurasi default
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor untuk menambahkan token atau logging
axiosInstance.interceptors.request.use(
  (config) => {
    // Bisa menambahkan token authentication di sini jika diperlukan
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle error secara global
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server merespons dengan status error
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      // Request dibuat tapi tidak ada response
      console.error('Request error:', error.request);
    } else {
      // Error dalam setup request
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
