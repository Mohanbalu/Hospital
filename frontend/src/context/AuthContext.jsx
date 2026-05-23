import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AUTH_EVENTS } from '../services/api';
import { login as loginRequest, register as registerRequest } from '../services/authService';
import { clearAuthState, getAuthState, getDefaultRouteForRole, setAuthState } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthStateState] = useState(() => getAuthState());

  useEffect(() => {
    const handleLogout = () => {
      setAuthStateState(null);
    };

    const handleStorage = () => {
      setAuthStateState(getAuthState());
    };

    window.addEventListener(AUTH_EVENTS.LOGOUT, handleLogout);
    window.addEventListener(AUTH_EVENTS.TOKEN_EXPIRED, handleLogout);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(AUTH_EVENTS.LOGOUT, handleLogout);
      window.removeEventListener(AUTH_EVENTS.TOKEN_EXPIRED, handleLogout);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const login = async (credentials) => {
    const response = await loginRequest(credentials);
    const nextAuthState = {
      token: response.token,
      role: response.role,
    };

    setAuthState(nextAuthState);
    setAuthStateState(nextAuthState);

    return {
      ...response,
      redirectTo: getDefaultRouteForRole(response.role),
    };
  };

  const register = async (payload) => registerRequest(payload);

  const logout = () => {
    clearAuthState();
    setAuthStateState(null);
    window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGOUT));
  };

  const value = useMemo(
    () => ({
      authState,
      token: authState?.token ?? null,
      role: authState?.role ?? null,
      isAuthenticated: Boolean(authState?.token),
      login,
      register,
      logout,
    }),
    [authState],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};

export default AuthContext;
