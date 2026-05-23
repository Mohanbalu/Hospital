import axios from 'axios';
import { clearAuthState, getAuthState, isTokenExpired } from '../utils/storage';

export const AUTH_EVENTS = {
  LOGOUT: 'hms:logout',
  TOKEN_EXPIRED: 'hms:token-expired',
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const isBrowser = typeof window !== 'undefined';

const isAuthEndpoint = (url = '') => /\/api\/auth\/(login|register)$/i.test(url);

const isApiResponseEnvelope = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(payload, 'success')
    && Object.prototype.hasOwnProperty.call(payload, 'message')
    && Object.prototype.hasOwnProperty.call(payload, 'timestamp');
};

const resolveResponseBody = (response) => response?.data ?? response ?? null;

const redirectToLogin = (reason = 'session-expired') => {
  if (!isBrowser) {
    return;
  }

  const currentPath = window.location.pathname || '';
  if (currentPath === '/login') {
    return;
  }

  window.location.replace(`/login?reason=${encodeURIComponent(reason)}`);
};

const handleAuthFailure = (eventName, reason) => {
  clearAuthState();

  if (isBrowser) {
    window.dispatchEvent(new CustomEvent(eventName, { detail: { reason } }));
  }

  redirectToLogin(reason);
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const requestUrl = config?.url || '';

    if (isAuthEndpoint(requestUrl)) {
      return config;
    }

    const authState = getAuthState();

    if (authState?.token) {
      if (isTokenExpired(authState.token)) {
        handleAuthFailure(AUTH_EVENTS.TOKEN_EXPIRED, 'token-expired');
        return Promise.reject(new Error('Authentication token expired'));
      }

      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${authState.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || '';
    const authRequest = isAuthEndpoint(requestUrl);

    if (status === 401 && !authRequest) {
      handleAuthFailure(AUTH_EVENTS.TOKEN_EXPIRED, 'unauthorized');
    } else if (status === 403 && !authRequest) {
      if (isBrowser) {
        window.dispatchEvent(new CustomEvent('hms:forbidden', {
          detail: {
            reason: 'forbidden',
            message: error?.response?.data?.message || 'Access denied',
            path: requestUrl,
          },
        }));
      }
    }

    if (import.meta.env.DEV) {
      // Centralized logging keeps the UI components lightweight.
      // eslint-disable-next-line no-console
      console.error('API request failed', {
        url: requestUrl,
        status,
        message: error?.response?.data?.message || error?.message,
      });
    }

    return Promise.reject(error);
  },
);

export const unwrapApiResponse = (response) => {
  const body = resolveResponseBody(response);

  if (body === null || body === undefined) {
    return null;
  }

  if (isApiResponseEnvelope(body)) {
    return body.data ?? null;
  }

  if (response && Object.prototype.hasOwnProperty.call(response, 'data') && response.data === body) {
    return body;
  }

  return body;
};

export const getApiErrorResponse = (error) => error?.response?.data ?? null;

export default api;
