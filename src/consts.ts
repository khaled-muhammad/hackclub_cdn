import axios from "axios";
import { toast } from 'react-toastify';

export const API_BASE_URL = "/api";

// http instance
export const session = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

session.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

session.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshResponse = await session.post('/auth/refresh', {}, {
          withCredentials: true,
          headers: { ...originalRequest.headers }
        });

        if (refreshResponse.data.success) {
          try {
            const userResponse = await session.get('/auth/me', {
              withCredentials: true
            });
            
            if (userResponse.data.user) {
              window.dispatchEvent(new CustomEvent('tokenRefreshed', {
                detail: { user: userResponse.data.user }
              }));
            }
          } catch (userError) {
            console.error('Failed to fetch user data after token refresh:', userError);
          }
          
          return session(originalRequest);
        }
      } catch (refreshError) {
        if (originalRequest.url !== '/auth/me') {
          window.dispatchEvent(new CustomEvent('authLogout'));
          toast.error('Session expired. Please login again.');
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default session;