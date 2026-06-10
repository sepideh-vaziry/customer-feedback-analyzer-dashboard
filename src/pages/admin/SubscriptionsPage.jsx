import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle, Search, CreditCard, Eye } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getAllSubscriptions } from '../../services/adminService';

export default function SubscriptionsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);
  const [search, setSearch] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllSubscriptions();
      setSubscriptions(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load subscriptions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = subscriptions.filter((s) =>
    s.organizationName?.toLowerCase().includes(search.toLowerCase()) ||
    s.planName?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '—';

  return (
    <AdminLayout>
      <PageHeader
        title="Subscriptions"
        description="Manage all platform subscriptions"
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

      <div className="mb-4 relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search subscriptions..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        />
      </div>

      {loading && subscriptions.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No subscriptions"
          description="Subscriptions will appear here once the backend API is implemented."
        />
      ) : (
        <div className="bg-bg-card rounded-xl border border-border shadow-xs overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg-base border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Organization</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Plan</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Status</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Renewal Date</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Revenue</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-bg-base/50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-text-primary">{s.organizationName || '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{s.planName || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      s.status === 'ACTIVE'
                        ? 'bg-success-50 text-success-700'
                        : s.status === 'CANCELLED'
                        ? 'bg-danger-50 text-danger-700'
                        : s.status === 'PAST_DUE'
                        ? 'bg-warning-50 text-warning-700'
                        : 'bg-text-muted/10 text-text-muted'
                    }`}>
                      {s.status || 'UNKNOWN'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{formatDate(s.renewalDate)}</td>
                  <td className="px-4 py-3 text-text-secondary">
                    {s.revenue != null ? `$${s.revenue}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1.5 rounded-lg hover:bg-border-light text-text-muted hover:text-text-primary transition-colors" title="View">
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
