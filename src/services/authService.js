import apiClient from './apiClient';

const AUTH_BASE = '/api/v1/auth';

export async function register(data) {
  const response = await apiClient.post(`${AUTH_BASE}/register`, data);
  return response.data;
}

export async function login(data) {
  const response = await apiClient.post(`${AUTH_BASE}/login`, data);
  return response.data;
}

export async function refreshToken(refreshTokenValue) {
  const response = await apiClient.post(`${AUTH_BASE}/refresh`, {
    refreshToken: refreshTokenValue,
  });
  return response.data;
}

export async function logout() {
  // Client-side logout only; backend may not have a logout endpoint
  return Promise.resolve();
}
