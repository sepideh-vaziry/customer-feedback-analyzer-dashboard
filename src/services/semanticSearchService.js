import apiClient from './apiClient';

const SEMANTIC_BASE = '/api/v1/semantic';
const VECTOR_BASE = '/api/v1/vector';

export async function vectorSearch(query, limit = 20, minSimilarity = 0.7) {
  const response = await apiClient.post(`${VECTOR_BASE}/search`, {
    query,
    limit,
    minSimilarity,
  });
  return response.data;
}

export async function semanticSearch(query, limit = 20, minSimilarity = 0.7) {
  const response = await apiClient.post(`${SEMANTIC_BASE}/search`, {
    query,
    limit,
    minSimilarity,
  });
  return response.data;
}

export async function findSimilarComplaints(description, limit = 20, minSimilarity = 0.7) {
  const response = await apiClient.get(`${VECTOR_BASE}/complaints/similar`, {
    params: { description, limit, minSimilarity },
  });
  return response.data;
}

export async function getVectorHealth() {
  const response = await apiClient.get(`${VECTOR_BASE}/health`);
  return response.data;
}

export async function embedFeedback(feedbackId) {
  const response = await apiClient.post(`${SEMANTIC_BASE}/feedback/${feedbackId}/embed`);
  return response.data;
}
