import apiClient from './apiClient';

export async function getCaptchaChallenge() {
  const response = await apiClient.get('/api/v1/captcha/challenge');
  const data = response.data;

  // Backend wraps the Altcha challenge in a base64-encoded JSON string under "challenge" key
  if (data && typeof data.challenge === 'string') {
    try {
      const decoded = atob(data.challenge);
      return JSON.parse(decoded);
    } catch {
      // If decoding fails, return raw data as fallback
    }
  }

  return data;
}
