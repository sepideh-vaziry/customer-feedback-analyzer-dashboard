import apiClient from './apiClient';

const SCHEMAS_BASE = '/api/v1/schemas';
const QUERY_GEN_BASE = '/api/v1/query-generator';

export async function getSchemas() {
  const response = await apiClient.get(SCHEMAS_BASE);
  return response.data;
}

export async function getSchema(schemaId) {
  const response = await apiClient.get(`${SCHEMAS_BASE}/${schemaId}`);
  return response.data;
}

export async function uploadSchema({ schemaName, databaseType, rawDdl, description } = {}) {
  const payload = { databaseType };
  if (schemaName) payload.schemaName = schemaName;
  if (rawDdl) payload.rawDdl = rawDdl;
  if (description) payload.description = description;
  const response = await apiClient.post(`${SCHEMAS_BASE}/upload`, payload);
  return response.data;
}

export async function deleteSchema(schemaId) {
  const response = await apiClient.delete(`${SCHEMAS_BASE}/${schemaId}`);
  return response.data;
}

export async function generateQuery(schemaId, {
  naturalLanguageQuery,
  intent,
  preferredTables,
  maxResults,
  explainQuery = true,
  optimizeQuery = true,
  context,
} = {}) {
  const payload = {
    naturalLanguageQuery,
    intent,
    explainQuery,
    optimizeQuery,
  };
  if (preferredTables && preferredTables.length) payload.preferredTables = preferredTables;
  if (maxResults != null) payload.maxResults = maxResults;
  if (context) payload.context = context;

  const response = await apiClient.post(
    `${QUERY_GEN_BASE}/schemas/${schemaId}/generate`,
    payload
  );
  return response.data;
}

export async function previewQuery(schemaId, { naturalLanguageQuery, contextParameters } = {}) {
  const payload = { naturalLanguageQuery };
  if (contextParameters) payload.contextParameters = contextParameters;
  const response = await apiClient.post(
    `${QUERY_GEN_BASE}/schemas/${schemaId}/preview`,
    payload
  );
  return response.data;
}

export async function getQuery(queryId) {
  const response = await apiClient.get(`${QUERY_GEN_BASE}/queries/${queryId}`);
  return response.data;
}

export async function executeQuery(queryId, { executionParameters } = {}) {
  const payload = {};
  if (executionParameters) payload.executionParameters = executionParameters;
  const response = await apiClient.post(
    `${QUERY_GEN_BASE}/queries/${queryId}/execute`,
    payload
  );
  return response.data;
}

export async function optimizeQuery(queryId) {
  const response = await apiClient.post(`${QUERY_GEN_BASE}/queries/${queryId}/optimize`);
  return response.data;
}

export async function validateQuery(queryId) {
  const response = await apiClient.post(`${QUERY_GEN_BASE}/queries/${queryId}/validate`);
  return response.data;
}