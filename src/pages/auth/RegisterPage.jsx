import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, Sparkles, Shield, Zap, BarChart3 } from 'lucide-react';
import { register } from '../../services/authService';
import CaptchaWidget from '../../components/auth/CaptchaWidget';
import logo from '../../assets/logo-with-text.png';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    organizationName: '',
    captchaPayload: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const captchaRef = useRef(null);

  function validate() {
    const nextErrors = {};
    if (!form.firstName.trim()) {
      nextErrors.firstName = 'First name is required';
    }
    if (!form.lastName.trim()) {
      nextErrors.lastName = 'Last name is required';
    }
    if (!form.organizationName.trim()) {
      nextErrors.organizationName = 'Organization name is required';
    }
    if (!form.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Please enter a valid email';
    }
    if (!form.password) {
      nextErrors.password = 'Password is required';
    } else if (form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters';
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

    try {
      await register(form);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setApiError(error.response?.data?.message || error.message || 'Registration failed');
      await captchaRef.current?.reset();
    } finally {
      setSubmitting(false);
    }
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
                Start analyzing<br />
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
                Create your account
              </h2>
              <p className="mt-2 text-sm text-text-muted font-medium">
                Start analyzing customer feedback with AI
              </p>
            </div>

            {success ? (
              <div className="flex flex-col items-center py-8 text-center animate-fade-in">
                <div className="p-4 rounded-full bg-gradient-to-br from-success-50 to-success-100 mb-4 shadow-sm">
                  <CheckCircle2 size={48} className="text-success-500" />
                </div>
                <h2 className="text-xl font-bold text-text-primary mb-2">
                  Account created!
                </h2>
                <p className="text-sm text-text-muted font-medium">
                  Redirecting you to sign in...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-semibold text-text-primary mb-2"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className={`w-full px-4 py-3 text-sm bg-bg-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all placeholder:text-text-placeholder ${
                        errors.firstName ? 'border-danger-300' : 'border-border'
                      }`}
                    />
                    {errors.firstName && (
                      <p className="mt-2 text-xs text-danger-600 font-medium">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-semibold text-text-primary mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className={`w-full px-4 py-3 text-sm bg-bg-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all placeholder:text-text-placeholder ${
                        errors.lastName ? 'border-danger-300' : 'border-border'
                      }`}
                    />
                    {errors.lastName && (
                      <p className="mt-2 text-xs text-danger-600 font-medium">{errors.lastName}</p>
                    )}
                  </div>
                </div>

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
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-text-primary mb-2"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="At least 8 characters"
                    className={`w-full px-4 py-3 text-sm bg-bg-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all placeholder:text-text-placeholder ${
                      errors.password ? 'border-danger-300' : 'border-border'
                    }`}
                  />
                  {errors.password && (
                    <p className="mt-2 text-xs text-danger-600 font-medium">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="organizationName"
                    className="block text-sm font-semibold text-text-primary mb-2"
                  >
                    Organization Name
                  </label>
                  <input
                    id="organizationName"
                    name="organizationName"
                    type="text"
                    value={form.organizationName}
                    onChange={handleChange}
                    placeholder="Acme Corp"
                    className={`w-full px-4 py-3 text-sm bg-bg-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all placeholder:text-text-placeholder ${
                      errors.organizationName ? 'border-danger-300' : 'border-border'
                    }`}
                  />
                  {errors.organizationName && (
                    <p className="mt-2 text-xs text-danger-600 font-medium">
                      {errors.organizationName}
                    </p>
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
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-sm text-text-muted mt-6 font-medium">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
