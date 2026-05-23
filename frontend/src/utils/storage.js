import { jwtDecode } from 'jwt-decode';
import { ROLE_HOME_ROUTES } from './constants';

const AUTH_STORAGE_KEY = 'hms_auth';

const isBrowser = typeof window !== 'undefined';

export const getAuthState = () => {
  if (!isBrowser) {
    return null;
  }

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (!parsed?.token) {
      return null;
    }

    if (isTokenExpired(parsed.token)) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const setAuthState = (authState) => {
  if (!isBrowser || !authState?.token) {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
};

export const clearAuthState = () => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const getStoredToken = () => getAuthState()?.token ?? null;
export const getStoredRole = () => getAuthState()?.role ?? null;

export const isTokenExpired = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    if (!decodedToken?.exp) {
      return false;
    }
    return decodedToken.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

export const getDefaultRouteForRole = (role) => ROLE_HOME_ROUTES[role] || '/login';
