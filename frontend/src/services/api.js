import axios from 'axios';
import { clearAuthState, getAuthState, isTokenExpired } from '../utils/storage';

export const AUTH_EVENTS = {
  LOGOUT: 'hms:logout',
  TOKEN_EXPIRED: 'hms:token-expired',
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

const triggerLogout = (reason = AUTH_EVENTS.LOGOUT) => {
  clearAuthState();
  window.dispatchEvent(new CustomEvent(reason));
};

api.interceptors.request.use(
  (config) => {
    const authState = getAuthState();

    if (authState?.token) {
      if (isTokenExpired(authState.token)) {
        triggerLogout(AUTH_EVENTS.TOKEN_EXPIRED);
        return Promise.reject(new Error('Authentication token expired'));
      }

      config.headers.Authorization = `Bearer ${authState.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      triggerLogout(AUTH_EVENTS.TOKEN_EXPIRED);
    }

    return Promise.reject(error);
  },
);

export const unwrapApiResponse = (response) => response?.data?.data ?? response?.data ?? null;

export default api;
