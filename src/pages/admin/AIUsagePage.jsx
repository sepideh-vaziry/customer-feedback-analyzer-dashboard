import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle, Cpu, PieChart as PieChartIcon, BarChart3, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AdminKpiCard from '../../components/admin/AdminKpiCard';
import { getAIUsage } from '../../services/adminService';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function AIUsagePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usage, setUsage] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAIUsage();
      setUsage(data);
    } catch (err) {
      setError(err.message || 'Failed to load AI usage data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const byProvider = usage?.byProvider || [];
  const byModel = usage?.byModel || [];
  const byOrganization = usage?.byOrganization || [];

  return (
    <AdminLayout>
      <PageHeader
        title="AI Usage"
        description="Monitor AI consumption across the platform"
      >
        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-text-secondary hover:text-text-primary bg-bg-card border border-border rounded-xl hover:border-primary-300 transition-all duration-200 disabled:opacity-50 shadow-sm"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </PageHeader>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-200 text-sm text-danger-700 flex items-center gap-2 font-medium">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <AdminKpiCard
          title="Total AI Cost"
          value={usage?.totalCost != null ? `$${usage.totalCost.toLocaleString()}` : '—'}
          icon={Cpu}
          loading={loading}
        />
        <AdminKpiCard
          title="Total Requests"
          value={usage?.totalRequests?.toLocaleString() || '—'}
          icon={BarChart3}
          loading={loading}
        />
        <AdminKpiCard
          title="Total Tokens"
          value={usage?.totalTokens?.toLocaleString() || '—'}
          icon={TrendingUp}
          loading={loading}
        />
        <AdminKpiCard
          title="Active Providers"
          value={usage?.activeProviders?.toString() || '—'}
          icon={PieChartIcon}
          loading={loading}
        />
      </div>

      {loading && !usage ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      ) : !usage && !error ? (
        <EmptyState
          icon={Cpu}
          title="AI usage data unavailable"
          description="No AI usage data available."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-sm font-bold text-text-primary mb-4">Cost by Provider</h3>
            {byProvider.length === 0 ? (
              <p className="text-sm text-text-muted">No provider data available.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={byProvider} dataKey="cost" nameKey="provider" cx="50%" cy="50%" outerRadius={80} label>
                    {byProvider.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-sm font-bold text-text-primary mb-4">Cost by Model</h3>
            {byModel.length === 0 ? (
              <p className="text-sm text-text-muted">No model data available.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={byModel}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="model" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="cost" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow duration-300 lg:col-span-2">
            <h3 className="text-sm font-bold text-text-primary mb-4">Cost by Organization</h3>
            {byOrganization.length === 0 ? (
              <p className="text-sm text-text-muted">No organization data available.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={byOrganization}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="organizationName" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="cost" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
