import api, { unwrapApiResponse } from './api';

export const login = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

export const register = async (payload) => {
  const response = await api.post('/api/auth/register', payload);
  return unwrapApiResponse(response);
};
