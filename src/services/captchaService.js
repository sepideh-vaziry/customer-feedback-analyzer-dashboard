import apiClient from './apiClient';

export async function getCaptchaChallenge() {
  const response = await apiClient.get('/api/v1/captcha/challenge');
  const data = response.data;

  // Backend returns the Altcha challenge object directly under the "challenge" key
  if (data && typeof data === 'object' && data.challenge) {
    return data.challenge;
  }

  return data;
}
