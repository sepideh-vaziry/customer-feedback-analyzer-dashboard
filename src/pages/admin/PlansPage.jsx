import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle, Search, Plus, CreditCard, Pencil, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getPlans, createPlan, updatePlan } from '../../services/adminService';

export default function PlansPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    monthlyPrice: '',
    yearlyPrice: '',
    messageLimit: '',
    aiRecommendationsEnabled: false,
    trendAnalysisEnabled: false,
    churnDetectionEnabled: false,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getPlans();
      setPlans(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load plans.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const resetForm = () => {
    setForm({
      name: '',
      code: '',
      description: '',
      monthlyPrice: '',
      yearlyPrice: '',
      messageLimit: '',
      aiRecommendationsEnabled: false,
      trendAnalysisEnabled: false,
      churnDetectionEnabled: false,
    });
    setFormError('');
    setEditingPlan(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name || '',
      code: plan.code || '',
      description: plan.description || '',
      monthlyPrice: plan.monthlyPrice ?? '',
      yearlyPrice: plan.yearlyPrice ?? '',
      messageLimit: plan.messageLimit ?? '',
      aiRecommendationsEnabled: plan.aiRecommendationsEnabled || false,
      trendAnalysisEnabled: plan.trendAnalysisEnabled || false,
      churnDetectionEnabled: plan.churnDetectionEnabled || false,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');

    const payload = {
      ...form,
      monthlyPrice: Number(form.monthlyPrice),
      yearlyPrice: Number(form.yearlyPrice),
      messageLimit: Number(form.messageLimit),
    };

    try {
      if (editingPlan) {
        await updatePlan(editingPlan.id, payload);
      } else {
        await createPlan(payload);
      }
      setShowForm(false);
      resetForm();
      await loadData();
    } catch (err) {
      setFormError(err.message || 'Failed to save plan.');
    } finally {
      setSaving(false);
    }
  };

  const filtered = plans.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <PageHeader
        title="Plans & Pricing"
        description="Manage subscription plans"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-text-secondary hover:text-text-primary bg-bg-card border border-border rounded-xl hover:border-primary-300 transition-all duration-200 disabled:opacity-50 shadow-sm"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-sm"
          >
            <Plus size={16} />
            New Plan
          </button>
        </div>
      </PageHeader>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-200 text-sm text-danger-700 flex items-center gap-2 font-medium">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      <div className="mb-4 relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search plans..."
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
        />
      </div>

      {loading && plans.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No plans"
          description="No subscription plans found."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((plan) => (
            <div key={plan.id} className="bg-bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-text-primary">{plan.name}</h3>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-wide">{plan.code}</p>
                </div>
                <div className="flex items-center gap-1">
                  {plan.active ? (
                    <CheckCircle size={16} className="text-success-600" title="Active" />
                  ) : (
                    <XCircle size={16} className="text-text-muted" title="Inactive" />
                  )}
                  <button
                    onClick={() => handleOpenEdit(plan)}
                    className="p-1.5 rounded-lg hover:bg-border-light text-text-muted hover:text-text-primary transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-text-secondary font-medium mb-4">{plan.description || 'No description.'}</p>

              <div className="space-y-2 text-sm mb-4 flex-1">
                <div className="flex justify-between">
                  <span className="text-text-muted font-medium">Monthly</span>
                  <span className="font-bold text-text-primary">${plan.monthlyPrice ?? '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted font-medium">Yearly</span>
                  <span className="font-bold text-text-primary">${plan.yearlyPrice ?? '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted font-medium">Message Limit</span>
                  <span className="font-bold text-text-primary">{plan.messageLimit?.toLocaleString() ?? '—'}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {plan.aiRecommendationsEnabled && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-primary-50 text-primary-700">
                    AI Recommendations
                  </span>
                )}
                {plan.trendAnalysisEnabled && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-success-50 text-success-700">
                    Trend Analysis
                  </span>
                )}
                {plan.churnDetectionEnabled && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-warning-50 text-warning-700">
                    Churn Detection
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-lg bg-bg-card rounded-2xl border border-border shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-base font-bold text-text-primary">
                {editingPlan ? 'Edit Plan' : 'Create Plan'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-lg hover:bg-border-light text-text-muted hover:text-text-primary transition-colors"
              >
                <XCircle size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-danger-50 border border-danger-200 text-sm text-danger-700 font-medium">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm text-text-secondary mb-1 font-medium">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2.5 text-sm bg-bg-base border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-1 font-medium">Code</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                  required
                  disabled={!!editingPlan}
                  className="w-full px-3 py-2.5 text-sm bg-bg-base border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-1 font-medium">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2.5 text-sm bg-bg-base border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1 font-medium">Monthly Price</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.monthlyPrice}
                    onChange={(e) => setForm((f) => ({ ...f, monthlyPrice: e.target.value }))}
                    required
                    className="w-full px-3 py-2.5 text-sm bg-bg-base border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1 font-medium">Yearly Price</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.yearlyPrice}
                    onChange={(e) => setForm((f) => ({ ...f, yearlyPrice: e.target.value }))}
                    required
                    className="w-full px-3 py-2.5 text-sm bg-bg-base border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-1 font-medium">Message Limit</label>
                <input
                  type="number"
                  min={1}
                  value={form.messageLimit}
                  onChange={(e) => setForm((f) => ({ ...f, messageLimit: e.target.value }))}
                  required
                  className="w-full px-3 py-2.5 text-sm bg-bg-base border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 text-sm text-text-secondary font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.aiRecommendationsEnabled}
                    onChange={(e) => setForm((f) => ({ ...f, aiRecommendationsEnabled: e.target.checked }))}
                    className="w-4 h-4 rounded border-border text-primary-600 focus:ring-primary-500"
                  />
                  AI Recommendations
                </label>
                <label className="flex items-center gap-3 text-sm text-text-secondary font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.trendAnalysisEnabled}
                    onChange={(e) => setForm((f) => ({ ...f, trendAnalysisEnabled: e.target.checked }))}
                    className="w-4 h-4 rounded border-border text-primary-600 focus:ring-primary-500"
                  />
                  Trend Analysis
                </label>
                <label className="flex items-center gap-3 text-sm text-text-secondary font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.churnDetectionEnabled}
                    onChange={(e) => setForm((f) => ({ ...f, churnDetectionEnabled: e.target.checked }))}
                    className="w-4 h-4 rounded border-border text-primary-600 focus:ring-primary-500"
                  />
                  Churn Detection
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-text-secondary bg-bg-base border border-border rounded-xl hover:border-primary-300 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 disabled:opacity-50 shadow-sm"
                >
                  {saving ? 'Saving...' : editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
