import apiClient from './apiClient';

const SUBSCRIPTION_BASE = '/api/v1/subscriptions';
const TENANT_BASE = '/api/v1/tenant';
const USAGE_BASE = '/api/v1/usage';

export async function getCurrentSubscription() {
  const response = await apiClient.get(`${SUBSCRIPTION_BASE}/me`);
  return response.data;
}

export async function getAvailablePlans() {
  const response = await apiClient.get(`${SUBSCRIPTION_BASE}/plans`);
  return response.data;
}

export async function upgradeSubscription(planCode) {
  const response = await apiClient.post(`${SUBSCRIPTION_BASE}/upgrade`, { planCode });
  return response.data;
}

export async function cancelSubscription() {
  const response = await apiClient.post(`${SUBSCRIPTION_BASE}/cancel`);
  return response.data;
}

export async function getInvoices() {
  const response = await apiClient.get(`${SUBSCRIPTION_BASE}/invoices`);
  return response.data;
}

export async function getTenantUsage() {
  const response = await apiClient.get(`${TENANT_BASE}/usage`);
  return response.data;
}

export async function getQuotaStatus() {
  const response = await apiClient.get(`${USAGE_BASE}/quota`);
  return response.data;
}
