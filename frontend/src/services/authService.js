import api, { unwrapApiResponse } from './api';
import { clearAuthState, setAuthState } from '../utils/storage';

const persistAuthSession = (payload) => {
  if (!payload?.token) {
    return;
  }

  setAuthState({
    token: payload.token,
    role: payload.role,
    email: payload.email,
    issuedAt: Date.now(),
  });
};

export const login = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  const payload = unwrapApiResponse(response) || response?.data || {};
  persistAuthSession(payload);
  return payload;
};

export const register = async (payload) => {
  const response = await api.post('/api/auth/register', payload);
  return unwrapApiResponse(response);
};

export const logout = () => {
  clearAuthState();

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('hms:logout'));
  }
};
