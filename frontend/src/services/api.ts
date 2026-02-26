import axios from 'axios';

// Create a configured axios instance for the internal Backend REST API
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Append Supabase Bearer JWT if authenticated
api.interceptors.request.use(
    (config) => {
        // In actual implementation, we'll pull this securely straight from the Supabase Session local storage
        const token = localStorage.getItem('sb-access-token');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Global Response error handler logic
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle specific status codes gracefully to trigger UI alerts logic
        if (error.response?.status === 401) {
            console.error('[API Axios] - Unauthorized 401 request trace intercept');
            // Potential redirect action to /login could natively reside here
        }

        return Promise.reject(error);
    }
);

export default api;
