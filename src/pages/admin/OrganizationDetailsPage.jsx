import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RefreshCw, AlertTriangle, ArrowLeft, Building2, Users, CreditCard, Cpu, Plug, Activity } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AdminKpiCard from '../../components/admin/AdminKpiCard';
import { getOrganizationDetails } from '../../services/adminService';

export default function OrganizationDetailsPage() {
  const { organizationId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [org, setOrg] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getOrganizationDetails(organizationId);
      setOrg(data);
    } catch (err) {
      setError(err.message || 'Failed to load organization details.');
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <AdminLayout>
      <PageHeader
        title="Organization Details"
        description="View detailed information about an organization"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin/organizations')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-text-secondary hover:text-text-primary bg-bg-card border border-border rounded-xl hover:border-primary-300 transition-all duration-200 shadow-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-text-secondary hover:text-text-primary bg-bg-card border border-border rounded-xl hover:border-primary-300 transition-all duration-200 disabled:opacity-50 shadow-sm"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </PageHeader>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-200 text-sm text-danger-700 flex items-center gap-2 font-medium">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {loading && !org ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      ) : !org && !error ? (
        <div className="bg-bg-card rounded-2xl border border-border p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Building2 size={24} className="text-primary-600" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">Organization details unavailable</h3>
          <p className="text-sm text-text-muted font-medium mt-1">No organization details available.</p>
        </div>
      ) : org ? (
        <div className="space-y-6">
          <div className="bg-bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center shadow-sm">
                <Building2 size={20} className="text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">{org.name || 'Unnamed Organization'}</h2>
                <p className="text-sm text-text-muted font-medium">{org.id}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-muted font-medium">Status:</span>{' '}
                <span className={`font-bold ${
                  org.status === 'ACTIVE' ? 'text-success-600' :
                  org.status === 'SUSPENDED' ? 'text-danger-600' :
                  'text-text-secondary'
                }`}>{org.status || '—'}</span>
              </div>
              <div>
                <span className="text-text-muted font-medium">Plan:</span>{' '}
                <span className="font-bold text-text-primary">{org.plan || '—'}</span>
              </div>
              <div>
                <span className="text-text-muted font-medium">Created:</span>{' '}
                <span className="font-bold text-text-primary">
                  {org.createdAt ? new Date(org.createdAt).toLocaleDateString() : '—'}
                </span>
              </div>
              <div>
                <span className="text-text-muted font-medium">Domain:</span>{' '}
                <span className="font-bold text-text-primary">{org.domain || '—'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <AdminKpiCard
              title="Users"
              value={org.userCount?.toString() || '—'}
              icon={Users}
              loading={loading}
            />
            <AdminKpiCard
              title="Feedback Items"
              value={org.feedbackCount?.toLocaleString() || '—'}
              icon={Activity}
              loading={loading}
            />
            <AdminKpiCard
              title="AI Requests"
              value={org.aiRequestCount?.toLocaleString() || '—'}
              icon={Cpu}
              loading={loading}
            />
            <AdminKpiCard
              title="Connectors"
              value={org.connectorCount?.toString() || '—'}
              icon={Plug}
              loading={loading}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-sm font-bold text-text-primary mb-4">Subscription</h3>
              {org.subscription ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted font-medium">Plan</span>
                    <span className="font-bold text-text-primary">{org.subscription.planName || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted font-medium">Status</span>
                    <span className="font-bold text-text-primary">{org.subscription.status || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted font-medium">Renewal</span>
                    <span className="font-bold text-text-primary">
                      {org.subscription.renewalDate ? new Date(org.subscription.renewalDate).toLocaleDateString() : '—'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-text-muted font-medium">No subscription data available.</p>
              )}
            </div>

            <div className="bg-bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-sm font-bold text-text-primary mb-4">Recent Activity</h3>
              {org.recentActivity && org.recentActivity.length > 0 ? (
                <ul className="space-y-2">
                  {org.recentActivity.map((activity, i) => (
                    <li key={i} className="text-sm text-text-secondary font-medium flex items-center gap-2">
                      <CreditCard size={14} className="text-text-muted" />
                      {activity.description || 'Activity'}
                      <span className="text-text-muted text-xs font-medium">
                        {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-text-muted font-medium">No recent activity.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}
