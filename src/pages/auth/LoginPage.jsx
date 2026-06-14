import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getCaptchaChallenge } from '../../services/captchaService';
import logo from '../../assets/logo-with-text.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '', captchaChallenge: '', captchaSolution: '' });
  const [captchaImage, setCaptchaImage] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  async function fetchCaptcha() {
    try {
      const data = await getCaptchaChallenge();
      const challenge = data.challengeId || data.captchaChallenge || data.challenge || '';
      const image = data.imageBase64 || data.captchaImage || data.image || '';
      setForm((prev) => ({ ...prev, captchaChallenge: challenge, captchaSolution: '' }));
      setCaptchaImage(image);
    } catch {
      setCaptchaImage('');
    }
  }

  useEffect(() => {
    fetchCaptcha();
  }, []);

  function validate() {
    const nextErrors = {};
    if (!form.email.trim()) {
      nextErrors.email = 'Email is required';
    }
    if (!form.password) {
      nextErrors.password = 'Password is required';
    }
    if (!form.captchaSolution.trim()) {
      nextErrors.captchaSolution = 'Captcha solution is required';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError('');

    const result = await login({
      email: form.email,
      password: form.password,
      captchaChallenge: form.captchaChallenge,
      captchaSolution: form.captchaSolution,
    });

    if (result.success) {
      navigate('/dashboard');
    } else {
      setApiError(result.error);
      await fetchCaptcha();
    }

    setSubmitting(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center mb-8">
          <img src={logo} alt="Feedback AI" className="h-32 w-auto object-contain" style={{ height: '128px' }} />
        </div>

        <div className="bg-bg-card rounded-2xl border border-border p-8 shadow-xs">
          <h1 className="text-lg font-semibold text-text-primary mb-1">
            Sign in to your account
          </h1>
          <p className="text-sm text-text-secondary mb-6">
            Enter your credentials to continue
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-primary mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full px-3 py-2.5 text-sm bg-bg-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all ${
                  errors.email ? 'border-danger-300' : 'border-border'
                }`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-danger-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-primary mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full px-3 py-2.5 text-sm bg-bg-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all ${
                  errors.password ? 'border-danger-300' : 'border-border'
                }`}
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-danger-600">
                  {errors.password}
                </p>
              )}
            </div>

            {captchaImage && (
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <img
                    src={`data:image/png;base64,${captchaImage}`}
                    alt="Captcha"
                    className="rounded border border-border"
                  />
                </div>
                <input
                  id="captchaSolution"
                  name="captchaSolution"
                  type="text"
                  value={form.captchaSolution}
                  onChange={handleChange}
                  placeholder="Enter captcha solution"
                  className={`w-full px-3 py-2.5 text-sm bg-bg-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all ${
                    errors.captchaSolution ? 'border-danger-300' : 'border-border'
                  }`}
                />
                {errors.captchaSolution && (
                  <p className="mt-1.5 text-xs text-danger-600">{errors.captchaSolution}</p>
                )}
                <button
                  type="button"
                  onClick={fetchCaptcha}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Refresh captcha
                </button>
              </div>
            )}

            {apiError && (
              <div className="p-3 rounded-lg bg-danger-50 text-sm text-danger-700">
                {apiError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-text-secondary mt-6">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
