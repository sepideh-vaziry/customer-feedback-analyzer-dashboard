import apiClient from './apiClient';

const FEATURES_BASE = '/api/v1/feature-requests';
const VECTOR_BASE = '/api/v1/vector';

export async function getFeatureDemand(days = 30, limit = 50) {
  const response = await apiClient.get(`${FEATURES_BASE}/demand`, {
    params: { days, limit },
  });
  return response.data;
}

export async function getFeatureClusters() {
  const response = await apiClient.get(`${FEATURES_BASE}/clusters`);
  return response.data;
}

export async function searchFeedback(query, limit = 20, minSimilarity = 0.6) {
  const response = await apiClient.post(`${VECTOR_BASE}/search`, {
    query,
    limit,
    minSimilarity,
  });
  return response.data;
}
