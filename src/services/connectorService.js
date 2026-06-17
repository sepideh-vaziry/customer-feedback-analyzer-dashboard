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

export async function getWebhookDeliveries(connectorId, status) {
  const params = status ? { status } : {};
  const response = await apiClient.get(`${CONNECTORS_BASE}/${connectorId}/webhooks/deliveries`, { params });
  return response.data;
}

export async function replayWebhookDelivery(connectorId, deliveryId) {
  const response = await apiClient.post(`${CONNECTORS_BASE}/${connectorId}/webhooks/deliveries/${deliveryId}/replay`);
  return response.data;
}

export async function getConnectorCredentials(connectorId) {
  const response = await apiClient.get(`${CONNECTORS_BASE}/${connectorId}/credentials`);
  return response.data;
}

export async function rotateConnectorCredential(connectorId) {
  const response = await apiClient.post(`${CONNECTORS_BASE}/${connectorId}/credentials/rotate`);
  return response.data;
}

export async function revokeConnectorCredential(connectorId, credentialId) {
  const response = await apiClient.post(`${CONNECTORS_BASE}/${connectorId}/credentials/${credentialId}/revoke`);
  return response.data;
}
