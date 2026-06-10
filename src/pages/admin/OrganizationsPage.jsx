import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle, Search, Building2, Eye, Ban, CheckCircle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/ui/PageHeader';
import OrganizationStatusBadge from '../../components/admin/OrganizationStatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getOrganizations, suspendOrganization, activateOrganization } from '../../services/adminService';

export default function OrganizationsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [organizations, setOrganizations] = useState([]);
  const [search, setSearch] = useState('');
  const [actionInProgress, setActionInProgress] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getOrganizations();
      setOrganizations(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load organizations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSuspend = async (id) => {
    setActionInProgress(id);
    try {
      await suspendOrganization(id);
      await loadData();
    } catch {
      // error handled by loadData
    } finally {
      setActionInProgress(null);
    }
  };

  const handleActivate = async (id) => {
    setActionInProgress(id);
    try {
      await activateOrganization(id);
      await loadData();
    } catch {
      // error handled by loadData
    } finally {
      setActionInProgress(null);
    }
  };

  const filtered = organizations.filter((org) =>
    org.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <PageHeader
        title="Organizations"
        description="Manage all organizations on the platform"
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
          placeholder="Search organizations..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        />
      </div>

      {loading && organizations.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No organizations"
          description="No organizations found."
        />
      ) : (
        <div className="bg-bg-card rounded-xl border border-border shadow-xs overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg-base border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Name</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Status</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Plan</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Created</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((org) => (
                <tr key={org.id} className="hover:bg-bg-base/50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-text-primary">{org.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <OrganizationStatusBadge status={org.status} />
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{org.plan || '—'}</td>
                  <td className="px-4 py-3 text-text-secondary">
                    {org.createdAt ? new Date(org.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-border-light text-text-muted hover:text-text-primary transition-colors" title="View">
                        <Eye size={14} />
                      </button>
                      {org.status !== 'SUSPENDED' ? (
                        <button
                          onClick={() => handleSuspend(org.id)}
                          disabled={actionInProgress === org.id}
                          className="p-1.5 rounded-lg hover:bg-danger-50 text-text-muted hover:text-danger-600 transition-colors disabled:opacity-50"
                          title="Suspend"
                        >
                          <Ban size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(org.id)}
                          disabled={actionInProgress === org.id}
                          className="p-1.5 rounded-lg hover:bg-success-50 text-text-muted hover:text-success-600 transition-colors disabled:opacity-50"
                          title="Activate"
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}
                    </div>
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
