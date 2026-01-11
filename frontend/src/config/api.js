// Centralized API configuration
export const API_CONFIG = {
  backendUrl: import.meta.env.VITE_BACKEND_URL || "https://animerch-rvt0.onrender.com/api",
  // Add other API configurations as needed
  timeout: 10000, // 10 seconds timeout
  retries: 3
};

// Create axios instance with default configuration
import axios from 'axios';

export const api = axios.create({
  baseURL: API_CONFIG.backendUrl,
  timeout: API_CONFIG.timeout,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Export for backwards compatibility
export const backendUrl = API_CONFIG.backendUrl;
export const API_URL = API_CONFIG.backendUrl; // For Redux slices compatibility