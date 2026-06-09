import apiClient from './apiClient';

const COMPLAINTS_BASE = '/api/v1/complaints';
const VECTOR_BASE = '/api/v1/vector';

export async function getRecurringComplaints(days = 30, limit = 50) {
  const response = await apiClient.get(`${COMPLAINTS_BASE}/recurring`, {
    params: { days, limit },
  });
  return response.data;
}

export async function getComplaintCategories() {
  const response = await apiClient.get(`${COMPLAINTS_BASE}/categories`);
  return response.data;
}

export async function findSimilarComplaints(description, limit = 10, minSimilarity = 0.7) {
  const response = await apiClient.get(`${VECTOR_BASE}/complaints/similar`, {
    params: { description, limit, minSimilarity },
  });
  return response.data;
}
