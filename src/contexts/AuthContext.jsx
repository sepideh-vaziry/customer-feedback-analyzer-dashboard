import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

function getStoredAuth() {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const userId = localStorage.getItem('userId');
  const email = localStorage.getItem('email');
  const fullName = localStorage.getItem('fullName');
  const organizationId = localStorage.getItem('organizationId');
  const roles = localStorage.getItem('roles');

  if (!accessToken || !userId) return null;

  return {
    accessToken,
    refreshToken,
    userId,
    email,
    fullName,
    organizationId,
    roles: roles ? JSON.parse(roles) : [],
  };
}

function setStoredAuth(data) {
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('userId', data.userId);
  localStorage.setItem('email', data.email);
  localStorage.setItem('fullName', data.fullName);
  localStorage.setItem('organizationId', data.organizationId);
  localStorage.setItem('roles', JSON.stringify(data.roles || []));
}

function clearStoredAuth() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('email');
  localStorage.removeItem('fullName');
  localStorage.removeItem('organizationId');
  localStorage.removeItem('roles');
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => getStoredAuth());
  const [loading, setLoading] = useState(false);

  const isAuthenticated = useCallback(() => {
    return !!auth?.accessToken;
  }, [auth]);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      const authData = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userId: data.userId,
        email: data.email,
        fullName: data.fullName,
        organizationId: data.organizationId,
        roles: data.roles || [],
      };
      setStoredAuth(authData);
      setAuth(authData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Login failed',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
    } finally {
      clearStoredAuth();
      setAuth(null);
      setLoading(false);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    const storedRefresh = localStorage.getItem('refreshToken');
    if (!storedRefresh) {
      clearStoredAuth();
      setAuth(null);
      return { success: false };
    }

    try {
      const data = await authService.refreshToken(storedRefresh);
      const authData = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userId: data.userId,
        email: data.email,
        fullName: data.fullName,
        organizationId: data.organizationId,
        roles: data.roles || [],
      };
      setStoredAuth(authData);
      setAuth(authData);
      return { success: true };
    } catch (error) {
      clearStoredAuth();
      setAuth(null);
      return { success: false };
    }
  }, []);

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored) {
      setAuth(stored);
    }
  }, []);

  const value = {
    auth,
    loading,
    login,
    logout,
    refreshSession,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
