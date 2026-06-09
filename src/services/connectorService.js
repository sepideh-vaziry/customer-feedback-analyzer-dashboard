import apiClient from './apiClient';

const CONNECTORS_BASE = '/api/v1/connectors';

export async function createOrUpdateConnector(data) {
  const response = await apiClient.post(CONNECTORS_BASE, data);
  return response.data;
}

export async function getConnectors() {
  const response = await apiClient.get(CONNECTORS_BASE);
  return response.data;
}

export async function getConnector(id) {
  const response = await apiClient.get(`${CONNECTORS_BASE}/${id}`);
  return response.data;
}

export async function pullConnector(id) {
  const response = await apiClient.post(`${CONNECTORS_BASE}/${id}/pull`);
  return response.data;
}
