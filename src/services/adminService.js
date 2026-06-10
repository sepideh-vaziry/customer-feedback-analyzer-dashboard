import apiClient from './apiClient';

const ADMIN_BASE = '/api/v1/admin';

// Subscriptions & Plans
export async function getAllSubscriptions() {
  const response = await apiClient.get(`${ADMIN_BASE}/subscriptions`);
  return response.data;
}

export async function getPlans() {
  const response = await apiClient.get(`/api/v1/subscriptions/plans`);
  return response.data;
}

export async function createPlan(planData) {
  const response = await apiClient.post(`${ADMIN_BASE}/subscriptions/plans`, planData);
  return response.data;
}

export async function updatePlan(id, planData) {
  const response = await apiClient.put(`${ADMIN_BASE}/subscriptions/plans/${id}`, planData);
  return response.data;
}

// Platform Overview
export async function getPlatformOverview() {
  const response = await apiClient.get(`${ADMIN_BASE}/overview`);
  return response.data;
}

// Organizations
export async function getOrganizations({ page = 0, size = 20 } = {}) {
  const response = await apiClient.get(`${ADMIN_BASE}/organizations`, {
    params: { page, size },
  });
  return response.data;
}

export async function getOrganizationDetails(organizationId) {
  const response = await apiClient.get(`${ADMIN_BASE}/organizations/${organizationId}`);
  return response.data;
}

export async function suspendOrganization(organizationId) {
  const response = await apiClient.post(`${ADMIN_BASE}/organizations/${organizationId}/suspend`);
  return response.data;
}

export async function activateOrganization(organizationId) {
  const response = await apiClient.post(`${ADMIN_BASE}/organizations/${organizationId}/activate`);
  return response.data;
}

// Users
export async function getAllUsers({ page = 0, size = 20, search = '' } = {}) {
  const response = await apiClient.get(`${ADMIN_BASE}/users`, {
    params: { page, size, search },
  });
  return response.data;
}

export async function disableUser(userId) {
  const response = await apiClient.post(`${ADMIN_BASE}/users/${userId}/disable`);
  return response.data;
}

export async function enableUser(userId) {
  const response = await apiClient.post(`${ADMIN_BASE}/users/${userId}/enable`);
  return response.data;
}

// AI Usage
export async function getAIUsage() {
  const response = await apiClient.get(`${ADMIN_BASE}/ai-usage`);
  return response.data;
}

// System Health
export async function getSystemHealth() {
  const response = await apiClient.get(`${ADMIN_BASE}/system-health`);
  return response.data;
}

// Audit Logs
export async function getAuditLogs({ page = 0, size = 20 } = {}) {
  const response = await apiClient.get(`${ADMIN_BASE}/audit-logs`, {
    params: { page, size },
  });
  return response.data;
}

// Global Settings
export async function getGlobalSettings() {
  const response = await apiClient.get(`${ADMIN_BASE}/settings`);
  return response.data;
}

export async function updateGlobalSettings(settings) {
  const response = await apiClient.put(`${ADMIN_BASE}/settings`, settings);
  return response.data;
}
