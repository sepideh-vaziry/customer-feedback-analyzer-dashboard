import { ShieldAlert, ShieldCheck, AlertTriangle, AlertCircle, Users } from 'lucide-react';
import EmptyState from '../ui/EmptyState';

const levelConfig = {
  LOW: { color: 'text-success-600', bg: 'bg-success-50', border: 'border-success-200', bar: 'bg-success-500', icon: ShieldCheck },
  MEDIUM: { color: 'text-warning-600', bg: 'bg-warning-50', border: 'border-warning-200', bar: 'bg-warning-500', icon: AlertCircle },
  HIGH: { color: 'text-danger-600', bg: 'bg-danger-50', border: 'border-danger-200', bar: 'bg-danger-500', icon: AlertTriangle },
  CRITICAL: { color: 'text-danger-700', bg: 'bg-danger-100', border: 'border-danger-300', bar: 'bg-danger-600', icon: ShieldAlert },
};

export default function ChurnRiskWidget({ breakdown, highRiskCustomers, loading }) {
  if (loading) {
    return (
      <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs animate-pulse">
        <div className="h-5 bg-border-light rounded w-1/3 mb-6" />
        <div className="h-48 bg-border-light rounded" />
      </div>
    );
  }

  const hasData = breakdown && breakdown.totalCustomersAssessed > 0;

  if (!hasData) {
    return (
      <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
        <h3 className="text-base font-semibold text-text-primary mb-4">Churn Risk Overview</h3>
        <EmptyState icon={ShieldAlert} title="No churn data" description="No customers have been assessed for churn risk yet." />
      </div>
    );
  }

  const levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const total = breakdown.totalCustomersAssessed || 1;

  return (
    <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
      <h3 className="text-base font-semibold text-text-primary mb-4">Churn Risk Overview</h3>

      {/* Distribution Bars */}
      <div className="space-y-3 mb-6">
        {levels.map((level) => {
          const count = breakdown[`${level.toLowerCase()}Count`] || 0;
          const percent = Math.round((count / total) * 100);
          const config = levelConfig[level];
          const Icon = config.icon;

          return (
            <div key={level} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <Icon size={12} className={config.color} />
                  <span className="font-medium text-text-secondary">{level}</span>
                </div>
                <span className="text-text-muted">{count} ({percent}%)</span>
              </div>
              <div className="h-2 w-full bg-bg-base rounded-full overflow-hidden">
                <div className={`h-full ${config.bar} transition-all duration-500`} style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* High Risk Customers */}
      {highRiskCustomers && highRiskCustomers.length > 0 && (
        <div>
          <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-3">High Risk Customers</p>
          <div className="space-y-2">
            {highRiskCustomers.slice(0, 5).map((customer) => {
              const config = levelConfig[customer.riskLevel] || levelConfig.MEDIUM;
              const scorePercent = customer.riskScore != null ? Math.round(customer.riskScore * 100) : null;

              return (
                <div key={customer.assessmentId} className={`flex items-center justify-between p-2.5 rounded-lg border ${config.border} ${config.bg}`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <Users size={14} className={config.color} />
                    <span className="text-sm text-text-primary truncate">{customer.authorIdentifier}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {scorePercent != null && (
                      <span className={`text-xs font-semibold ${config.color}`}>{scorePercent}%</span>
                    )}
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${config.bg} ${config.color} border ${config.border}`}>
                      {customer.riskLevel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
