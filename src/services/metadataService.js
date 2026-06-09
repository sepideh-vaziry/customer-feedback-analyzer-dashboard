import apiClient from './apiClient';

const METADATA_BASE = '/api/v1/metadata';

export async function getMetadata() {
  const response = await apiClient.get(`${METADATA_BASE}/info`);
  return response.data;
}
