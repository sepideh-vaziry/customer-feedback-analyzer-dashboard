import apiClient from './apiClient';

const FEEDBACK_BASE = '/api/v1/feedback';
const CHURN_BASE = '/api/v1/churn-risk';

export async function getFeedbackAnalysis(feedbackId) {
  const response = await apiClient.get(`${FEEDBACK_BASE}/${feedbackId}/analysis`);
  return response.data;
}

export async function getFeedbackComplaints(feedbackId) {
  const response = await apiClient.get(`${FEEDBACK_BASE}/${feedbackId}/complaints`);
  return response.data;
}

export async function getFeedbackFeatureRequests(feedbackId) {
  const response = await apiClient.get(`${FEEDBACK_BASE}/${feedbackId}/feature-requests`);
  return response.data;
}

export async function reanalyzeFeedback(feedbackId) {
  const response = await apiClient.post(`${FEEDBACK_BASE}/${feedbackId}/analysis/reanalyze`);
  return response.data;
}

export async function getChurnRiskForCustomer(authorIdentifier) {
  const response = await apiClient.get(`${CHURN_BASE}/customer`, {
    params: { authorIdentifier },
  });
  return response.data;
}

export async function assessChurnRisk(authorIdentifier) {
  const response = await apiClient.post(`${CHURN_BASE}/assess`, null, {
    params: { authorIdentifier },
  });
  return response.data;
}
