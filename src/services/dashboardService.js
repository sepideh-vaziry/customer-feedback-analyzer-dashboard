import apiClient from './apiClient';

const DASHBOARD_BASE = '/api/v1/dashboard';
const TRENDS_BASE = '/api/v1/trends';
const COMPLAINTS_BASE = '/api/v1/complaints';
const FEATURES_BASE = '/api/v1/feature-requests';
const CHURN_BASE = '/api/v1/churn-risk';

export async function getDashboardKpis(window = 'LAST_30_DAYS') {
  const response = await apiClient.get(`${DASHBOARD_BASE}/kpis`, { params: { window } });
  return response.data;
}

export async function getDashboardAnalytics(window = 'LAST_30_DAYS') {
  const response = await apiClient.get(`${DASHBOARD_BASE}/analytics`, { params: { window } });
  return response.data;
}

export async function getDashboardTrends(window = 'LAST_30_DAYS') {
  const response = await apiClient.get(`${DASHBOARD_BASE}/trends`, { params: { window } });
  return response.data;
}

export async function getLatestTrends() {
  const response = await apiClient.get(`${TRENDS_BASE}/latest`);
  return response.data;
}

export async function getRecurringComplaints(days = 30, limit = 10) {
  const response = await apiClient.get(`${COMPLAINTS_BASE}/recurring`, { params: { days, limit } });
  return response.data;
}

export async function getComplaintCategories() {
  const response = await apiClient.get(`${COMPLAINTS_BASE}/categories`);
  return response.data;
}

export async function getFeatureDemand(days = 30, limit = 10) {
  const response = await apiClient.get(`${FEATURES_BASE}/demand`, { params: { days, limit } });
  return response.data;
}

export async function getFeatureClusters() {
  const response = await apiClient.get(`${FEATURES_BASE}/clusters`);
  return response.data;
}

export async function getHighRiskCustomers(limit = 10) {
  const response = await apiClient.get(`${CHURN_BASE}/high-risk`, { params: { limit } });
  return response.data;
}

export async function getChurnRiskByLevel(level) {
  const response = await apiClient.get(`${CHURN_BASE}/by-level`, { params: { level } });
  return response.data;
}
