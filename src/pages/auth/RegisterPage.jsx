import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { register } from '../../services/authService';
import logo from '../../assets/logo-with-text.png';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    organizationName: '',
    captchaChallenge: '',
    captchaSolution: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

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
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <img src={logo} alt="Feedback AI" className="h-32 object-contain" />
        </div>

        <div className="bg-bg-card rounded-2xl border border-border p-8 shadow-xs">
          <h1 className="text-lg font-semibold text-text-primary mb-1">
            Create your account
          </h1>
          <p className="text-sm text-text-secondary mb-6">
            Start analyzing customer feedback with AI
          </p>

          {success ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 size={48} className="text-success-500 mb-4" />
              <h2 className="text-lg font-semibold text-text-primary mb-2">
                Account created!
              </h2>
              <p className="text-sm text-text-secondary">
                Redirecting you to sign in...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-text-primary mb-1.5"
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
                    className={`w-full px-3 py-2.5 text-sm bg-bg-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all ${
                      errors.firstName ? 'border-danger-300' : 'border-border'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1.5 text-xs text-danger-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-text-primary mb-1.5"
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
                    className={`w-full px-3 py-2.5 text-sm bg-bg-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all ${
                      errors.lastName ? 'border-danger-300' : 'border-border'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-1.5 text-xs text-danger-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

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
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className={`w-full px-3 py-2.5 text-sm bg-bg-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all ${
                    errors.password ? 'border-danger-300' : 'border-border'
                  }`}
                />
                {errors.password && (
                  <p className="mt-1.5 text-xs text-danger-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="organizationName"
                  className="block text-sm font-medium text-text-primary mb-1.5"
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
                  className={`w-full px-3 py-2.5 text-sm bg-bg-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all ${
                    errors.organizationName ? 'border-danger-300' : 'border-border'
                  }`}
                />
                {errors.organizationName && (
                  <p className="mt-1.5 text-xs text-danger-600">
                    {errors.organizationName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="captchaChallenge"
                    className="block text-sm font-medium text-text-primary mb-1.5"
                  >
                    Captcha Challenge
                  </label>
                  <input
                    id="captchaChallenge"
                    name="captchaChallenge"
                    type="text"
                    value={form.captchaChallenge}
                    onChange={handleChange}
                    placeholder="Challenge"
                    className="w-full px-3 py-2.5 text-sm bg-bg-base border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="captchaSolution"
                    className="block text-sm font-medium text-text-primary mb-1.5"
                  >
                    Captcha Solution
                  </label>
                  <input
                    id="captchaSolution"
                    name="captchaSolution"
                    type="text"
                    value={form.captchaSolution}
                    onChange={handleChange}
                    placeholder="Solution"
                    className="w-full px-3 py-2.5 text-sm bg-bg-base border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                </div>
              </div>

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
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-text-secondary mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
