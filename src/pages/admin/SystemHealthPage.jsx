import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle, HeartPulse, CheckCircle, AlertCircle, XCircle, MinusCircle, Activity, Clock, Zap } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AdminKpiCard from '../../components/admin/AdminKpiCard';
import { getSystemHealth } from '../../services/adminService';

const statusConfig = {
  HEALTHY: { icon: CheckCircle, color: 'text-success-600', bg: 'bg-success-50', border: 'border-success-200', label: 'Healthy' },
  WARNING: { icon: AlertCircle, color: 'text-warning-600', bg: 'bg-warning-50', border: 'border-warning-200', label: 'Warning' },
  DEGRADED: { icon: MinusCircle, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'Degraded' },
  DOWN: { icon: XCircle, color: 'text-danger-600', bg: 'bg-danger-50', border: 'border-danger-200', label: 'Down' },
};

function HealthCard({ name, status, message, lastChecked }) {
  const config = statusConfig[status] || statusConfig.DOWN;
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border p-5 shadow-xs ${config.bg} ${config.border}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-text-primary">{name}</h3>
        <Icon size={20} className={config.color} />
      </div>
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-xs font-semibold uppercase tracking-wide ${config.color}`}>
          {config.label}
        </span>
      </div>
      {message && <p className="text-xs text-text-secondary mt-1">{message}</p>}
      {lastChecked && (
        <p className="text-xs text-text-muted mt-2">
          Last checked: {new Date(lastChecked).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}

export default function SystemHealthPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [health, setHealth] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getSystemHealth();
      setHealth(data);
    } catch (err) {
      setError(err.message || 'Failed to load system health.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const services = health?.services || [];
  const metrics = health?.metrics || {};

  return (
    <AdminLayout>
      <PageHeader
        title="System Health"
        description="Monitor platform infrastructure status"
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
          title="Requests / Min"
          value={metrics.requestsPerMinute?.toLocaleString() || '—'}
          icon={Activity}
          loading={loading}
        />
        <AdminKpiCard
          title="Avg Response Time"
          value={metrics.avgResponseTimeMs != null ? `${metrics.avgResponseTimeMs}ms` : '—'}
          icon={Clock}
          loading={loading}
        />
        <AdminKpiCard
          title="Error Rate"
          value={metrics.errorRate != null ? `${metrics.errorRate}%` : '—'}
          icon={AlertTriangle}
          loading={loading}
        />
        <AdminKpiCard
          title="Active Sessions"
          value={metrics.activeSessions?.toLocaleString() || '—'}
          icon={Zap}
          loading={loading}
        />
      </div>

      {loading && !health ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      ) : !health && !error ? (
        <EmptyState
          icon={HeartPulse}
          title="System health unavailable"
          description="System health data will appear once the backend API is implemented."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc) => (
            <HealthCard
              key={svc.name}
              name={svc.name}
              status={svc.status}
              message={svc.message}
              lastChecked={svc.lastChecked}
            />
          ))}
          {services.length === 0 && (
            <div className="col-span-full">
              <EmptyState
                icon={HeartPulse}
                title="No service data"
                description="Service health data will appear once the backend API is implemented."
              />
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
