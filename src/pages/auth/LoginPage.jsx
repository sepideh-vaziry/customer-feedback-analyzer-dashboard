import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Sparkles, Shield, Zap, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import CaptchaWidget from '../../components/auth/CaptchaWidget';
import logo from '../../assets/logo-with-text.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '', captchaPayload: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const captchaRef = useRef(null);

  function validate() {
    const nextErrors = {};
    if (!form.email.trim()) {
      nextErrors.email = 'Email is required';
    }
    if (!form.password) {
      nextErrors.password = 'Password is required';
    }
    if (!form.captchaPayload.trim()) {
      nextErrors.captchaPayload = 'Captcha verification is required';
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
      captchaPayload: form.captchaPayload,
    });

    if (result.success) {
      navigate('/dashboard');
    } else {
      setApiError(result.error);
      await captchaRef.current?.reset();
    }

    setSubmitting(false);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #312e81 100%)' }}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12">
          <div className="flex items-center">
            <img src={logo} alt="Feedback AI" className="h-18 w-auto object-contain" />
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                Unlock insights from<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                  customer feedback
                </span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed max-w-md">
                AI-powered analysis that transforms customer voices into actionable business intelligence.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <BarChart3 size={20} className="text-primary-400" />
                <span className="text-sm text-slate-300 font-medium">Real-time Analytics</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <Zap size={20} className="text-warning-400" />
                <span className="text-sm text-slate-300 font-medium">AI Discovery</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <Shield size={20} className="text-success-400" />
                <span className="text-sm text-slate-300 font-medium">Churn Prediction</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <Sparkles size={20} className="text-accent-400" />
                <span className="text-sm text-slate-300 font-medium">Smart Insights</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-500">
            Trusted by leading companies worldwide
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center bg-bg-base p-8 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-pattern opacity-50" />

        <div className="relative z-10 w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <img src={logo} alt="Feedback AI" className="h-12 w-auto object-contain" />
          </div>

          <div className="bg-bg-card rounded-2xl border border-border shadow-lg shadow-black/5 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-text-muted font-medium">
                Sign in to your account to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-text-primary mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 text-sm bg-bg-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all placeholder:text-text-placeholder ${
                    errors.email ? 'border-danger-300' : 'border-border'
                  }`}
                />
                {errors.email && (
                  <p className="mt-2 text-xs text-danger-600 font-medium">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-text-primary"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 text-sm bg-bg-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all placeholder:text-text-placeholder ${
                    errors.password ? 'border-danger-300' : 'border-border'
                  }`}
                />
                {errors.password && (
                  <p className="mt-2 text-xs text-danger-600 font-medium">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <CaptchaWidget
                  ref={captchaRef}
                  value={form.captchaPayload}
                  onChange={(payload) =>
                    setForm((prev) => ({ ...prev, captchaPayload: payload }))
                  }
                  error={errors.captchaPayload}
                  disabled={submitting}
                />
              </div>

              {apiError && (
                <div className="p-4 rounded-xl bg-danger-50 border border-danger-200 text-sm text-danger-700 font-medium">
                  {apiError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl hover:from-primary-500 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5"
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

          <p className="text-center text-sm text-text-muted mt-6 font-medium">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
