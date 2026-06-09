import apiClient from './apiClient';

const FEEDBACK_BASE = '/api/v1/feedback';

export async function createFeedback(data) {
  const response = await apiClient.post(FEEDBACK_BASE, data);
  return response.data;
}

export async function uploadCsv(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post(`${FEEDBACK_BASE}/csv`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}
