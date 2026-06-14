import apiClient from './apiClient';

export async function getCaptchaChallenge() {
  const response = await apiClient.get('/api/v1/captcha/challenge');
  const data = response.data;

  // Backend wraps the Altcha challenge in a base64-encoded JSON string under "challenge" key
  let challenge = data;
  if (data && typeof data.challenge === 'string') {
    try {
      const decoded = atob(data.challenge);
      challenge = JSON.parse(decoded);
    } catch {
      // If decoding fails, use raw data as fallback
    }
  }

  // Backend may omit the algorithm field; Altcha V1 requires it (default to SHA-256)
  if (challenge && typeof challenge === 'object' && !challenge.algorithm) {
    challenge.algorithm = 'SHA-256';
  }

  return challenge;
}
