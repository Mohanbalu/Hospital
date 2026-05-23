import { jwtDecode } from 'jwt-decode';
import { ROLE_HOME_ROUTES } from './constants';

const AUTH_STORAGE_KEY = 'hms_auth';

const isBrowser = typeof window !== 'undefined';

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const decodeJwt = (token) => {
  if (!token) {
    return null;
  }

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token, skewMs = 0) => {
  const decodedToken = decodeJwt(token);
  if (!decodedToken?.exp) {
    return true;
  }

  return decodedToken.exp * 1000 <= Date.now() + skewMs;
};

export const getTokenExpiry = (token) => {
  const decodedToken = decodeJwt(token);
  if (!decodedToken?.exp) {
    return null;
  }

  return new Date(decodedToken.exp * 1000);
};

export const buildAuthState = (token, role, extra = {}) => ({
  token,
  role,
  expiresAt: getTokenExpiry(token)?.toISOString() ?? null,
  ...extra,
});

export const getAuthState = () => {
  if (!isBrowser) {
    return null;
  }

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  const parsed = safeParse(rawValue);
  if (!parsed?.token) {
    return null;
  }

  if (isTokenExpired(parsed.token)) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }

  return parsed;
};

export const setAuthState = (authState) => {
  if (!isBrowser || !authState?.token) {
    return;
  }

  const nextState = buildAuthState(authState.token, authState.role, authState);
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState));
};

export const clearAuthState = () => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const getStoredToken = () => getAuthState()?.token ?? null;
export const getStoredRole = () => getAuthState()?.role ?? null;

export const getDefaultRouteForRole = (role) => ROLE_HOME_ROUTES[role] || '/login';

export const hasAnyRole = (role, allowedRoles = []) => allowedRoles.length === 0 || allowedRoles.includes(role);

export const isSessionValid = () => Boolean(getStoredToken()) && !isTokenExpired(getStoredToken());