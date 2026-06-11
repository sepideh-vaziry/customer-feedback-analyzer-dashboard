import apiClient from './apiClient';

const FEEDBACK_BASE = '/api/v1/feedback';

export async function getFeedbackList() {
  const response = await apiClient.get(FEEDBACK_BASE);
  return response.data;
}

export async function getFeedbackDetails(feedbackId) {
  const response = await apiClient.get(`${FEEDBACK_BASE}/${feedbackId}`);
  return response.data;
}

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

export async function reprocessFeedback(feedbackId) {
  const response = await apiClient.post(`${FEEDBACK_BASE}/${feedbackId}/reprocess`);
  return response.data;
}
