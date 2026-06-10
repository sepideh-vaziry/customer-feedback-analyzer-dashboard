import apiClient from './apiClient';

const ADMIN_BASE = '/api/v1/admin';

// Real backend APIs
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

// Placeholder APIs - backend support required
export async function getPlatformOverview() {
  // TODO: Backend API needed for platform overview metrics
  throw new Error('Platform overview API not yet implemented in backend.');
}

export async function getOrganizations() {
  // TODO: Backend API needed for organization management
  throw new Error('Organization management API not yet implemented in backend.');
}

export async function getOrganizationDetails(organizationId) {
  // TODO: Backend API needed for organization details
  throw new Error('Organization details API not yet implemented in backend.');
}

export async function suspendOrganization(organizationId) {
  // TODO: Backend API needed for suspending organizations
  throw new Error('Suspend organization API not yet implemented in backend.');
}

export async function activateOrganization(organizationId) {
  // TODO: Backend API needed for activating organizations
  throw new Error('Activate organization API not yet implemented in backend.');
}

export async function getAllUsers() {
  // TODO: Backend API needed for user management
  throw new Error('User management API not yet implemented in backend.');
}

export async function disableUser(userId) {
  // TODO: Backend API needed for disabling users
  throw new Error('Disable user API not yet implemented in backend.');
}

export async function enableUser(userId) {
  // TODO: Backend API needed for enabling users
  throw new Error('Enable user API not yet implemented in backend.');
}

export async function getAIUsage() {
  // TODO: Backend API needed for AI usage monitoring
  throw new Error('AI usage monitoring API not yet implemented in backend.');
}

export async function getSystemHealth() {
  // TODO: Backend API needed for system health
  throw new Error('System health API not yet implemented in backend.');
}

export async function getAuditLogs() {
  // TODO: Backend API needed for audit logs
  throw new Error('Audit logs API not yet implemented in backend.');
}

export async function getGlobalSettings() {
  // TODO: Backend API needed for global settings
  throw new Error('Global settings API not yet implemented in backend.');
}

export async function updateGlobalSettings(settings) {
  // TODO: Backend API needed for updating global settings
  throw new Error('Update global settings API not yet implemented in backend.');
}
