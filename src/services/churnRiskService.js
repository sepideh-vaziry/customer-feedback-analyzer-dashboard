import apiClient from './apiClient';

const CHURN_BASE = '/api/v1/churn-risk';

export async function getHighRiskCustomers(limit = 50) {
  const response = await apiClient.get(`${CHURN_BASE}/high-risk`, {
    params: { limit },
  });
  return response.data;
}

export async function getCustomerRisk(authorIdentifier) {
  const response = await apiClient.get(`${CHURN_BASE}/customer`, {
    params: { authorIdentifier },
  });
  return response.data;
}

export async function getChurnRiskByLevel(level) {
  const response = await apiClient.get(`${CHURN_BASE}/by-level`, {
    params: { level },
  });
  return response.data;
}

export async function assessChurnRisk(authorIdentifier) {
  const response = await apiClient.post(`${CHURN_BASE}/assess`, null, {
    params: { authorIdentifier },
  });
  return response.data;
}
