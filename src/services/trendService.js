import apiClient from './apiClient';

const TRENDS_BASE = '/api/v1/trends';
const DASHBOARD_BASE = '/api/v1/dashboard';

export async function getLatestTrends() {
  const response = await apiClient.get(`${TRENDS_BASE}/latest`);
  return response.data;
}

export async function detectTrends() {
  const response = await apiClient.post(`${TRENDS_BASE}/detect`);
  return response.data;
}

export async function getDashboardTrends(window = 'LAST_30_DAYS') {
  const response = await apiClient.get(`${DASHBOARD_BASE}/trends`, {
    params: { window },
  });
  return response.data;
}

export async function getDashboardKpis(window = 'LAST_30_DAYS') {
  const response = await apiClient.get(`${DASHBOARD_BASE}/kpis`, {
    params: { window },
  });
  return response.data;
}
