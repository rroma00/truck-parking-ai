import axios from 'axios';

// Vite environments use import.meta.env
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept responses to unwrap the `data` envelope and catch `success: false`
api.interceptors.response.use(
  (response) => {
    // If the backend returned {"success": false, "error": "..."} with a 200 OK
    if (response.data && response.data.success === false) {
      return Promise.reject(new Error(response.data.error || 'API Error'));
    }
    // Return the inner data payload
    return response.data.data;
  },
  (error) => {
    // If the backend returned a 400/500 with {"success": false, "error": "..."}
    if (error.response && error.response.data && error.response.data.error) {
      return Promise.reject(new Error(error.response.data.error));
    }
    return Promise.reject(error);
  }
);

export default api;
