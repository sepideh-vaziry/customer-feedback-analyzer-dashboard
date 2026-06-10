import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle, Building2, Users, CreditCard, Cpu, MessageSquare, TrendingUp } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/ui/PageHeader';
import AdminKpiCard from '../../components/admin/AdminKpiCard';
import EmptyState from '../../components/ui/EmptyState';
import { getPlatformOverview } from '../../services/adminService';

export default function PlatformOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overview, setOverview] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getPlatformOverview();
      setOverview(data);
    } catch (err) {
      setError(err.message || 'Failed to load platform overview.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <AdminLayout>
      <PageHeader
        title="Platform Overview"
        description="High-level metrics for the entire platform"
      >
        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary bg-bg-card border border-border rounded-lg hover:border-primary-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </PageHeader>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-danger-50 border border-danger-200 text-sm text-danger-700 flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AdminKpiCard
          title="Organizations"
          value={overview?.totalOrganizations?.toString() || '—'}
          icon={Building2}
          loading={loading}
        />
        <AdminKpiCard
          title="Total Users"
          value={overview?.totalUsers?.toString() || '—'}
          icon={Users}
          loading={loading}
        />
        <AdminKpiCard
          title="Active Subscriptions"
          value={overview?.activeSubscriptions?.toString() || '—'}
          icon={CreditCard}
          loading={loading}
        />
        <AdminKpiCard
          title="Feedback Processed"
          value={overview?.totalFeedback?.toLocaleString() || '—'}
          icon={MessageSquare}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AdminKpiCard
          title="AI Requests"
          value={overview?.totalAiRequests?.toLocaleString() || '—'}
          icon={Cpu}
          loading={loading}
        />
        <AdminKpiCard
          title="Monthly Revenue"
          value={overview?.monthlyRevenue != null ? `$${overview.monthlyRevenue}` : '—'}
          icon={TrendingUp}
          loading={loading}
        />
        <AdminKpiCard
          title="Suspended Orgs"
          value={overview?.suspendedOrganizations?.toString() || '—'}
          icon={Building2}
          loading={loading}
        />
        <AdminKpiCard
          title="Monthly Active Users"
          value={overview?.monthlyActiveUsers?.toString() || '—'}
          icon={Users}
          loading={loading}
        />
      </div>

      {!loading && !overview && !error && (
        <EmptyState
          icon={TrendingUp}
          title="Platform overview unavailable"
          description="No platform overview data available."
        />
      )}
    </AdminLayout>
  );
}
