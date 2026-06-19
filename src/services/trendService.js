import apiClient from './apiClient';

const TRENDS_BASE = '/api/v1/trends';
const DASHBOARD_BASE = '/api/v1/dashboard';

export async function getLatestTrends({
  type,
  severity,
  minChangeRatio,
  sort = 'detectedAt,desc',
  page = 0,
  size = 50,
} = {}) {
  const params = { sort, page, size };
  if (type) params.type = type;
  if (severity && severity.length) params.severity = severity.join(',');
  if (minChangeRatio != null) params.minChangeRatio = minChangeRatio;

  const response = await apiClient.get(`${TRENDS_BASE}/latest`, { params });
  return response.data;
}

export async function getComplaintTrends({
  window: windowParam,
  severity,
  page = 0,
  size = 50,
} = {}) {
  const params = { page, size };
  if (windowParam) params.window = windowParam;
  if (severity && severity.length) params.severity = severity.join(',');
  const response = await apiClient.get(`${TRENDS_BASE}/complaints`, { params });
  return response.data;
}

export async function getEmergingTopics({
  window: windowParam,
  severity,
  page = 0,
  size = 50,
} = {}) {
  const params = { page, size };
  if (windowParam) params.window = windowParam;
  if (severity && severity.length) params.severity = severity.join(',');
  const response = await apiClient.get(`${TRENDS_BASE}/emerging-topics`, { params });
  return response.data;
}

export async function getSentimentShifts({
  window: windowParam,
  severity,
  page = 0,
  size = 50,
} = {}) {
  const params = { page, size };
  if (windowParam) params.window = windowParam;
  if (severity && severity.length) params.severity = severity.join(',');
  const response = await apiClient.get(`${TRENDS_BASE}/sentiment-shifts`, { params });
  return response.data;
}

export async function getTrendHistory({
  days = 90,
  type,
  severity,
  status,
  page = 0,
  size = 20,
} = {}) {
  const params = { days, page, size };
  if (type) params.type = type;
  if (severity && severity.length) params.severity = severity.join(',');
  if (status) params.status = status;
  const response = await apiClient.get(`${TRENDS_BASE}/history`, { params });
  return response.data;
}

export async function detectTrends({ windowDays = 7 } = {}) {
  const response = await apiClient.post(
    `${TRENDS_BASE}/detect`,
    null,
    { params: { windowDays } }
  );
  return response.data;
}

export function getDetectionJobLocation(headers) {
  const location = headers?.location || headers?.Location;
  if (!location) return null;
  const match = location.match(/\/detect\/([^/?#]+)/);
  return match ? match[1] : null;
}

export async function getDetectionJob(jobId) {
  const response = await apiClient.get(`${TRENDS_BASE}/detect/${jobId}`);
  return response.data;
}

export async function getDashboardTrends(window = 'LAST_30_DAYS') {
  const response = await apiClient.get(`${DASHBOARD_BASE}/trends`, {
    params: { window },
  });
  return response.data;
}

export async function getDashboardKpis(window = 'LAST_30_DAYS') {
  const response = await apiClient.get(`${DASHBOARD_BASE}/kpis`, {
    params: { window },
  });
  return response.data;
}
