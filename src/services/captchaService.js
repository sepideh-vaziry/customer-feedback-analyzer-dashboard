import apiClient from './apiClient';

export async function getCaptchaChallenge() {
  const response = await apiClient.get('/api/v1/captcha/challenge');
  return response.data;
}
