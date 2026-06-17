import { ShieldAlert, ShieldCheck, AlertTriangle, AlertCircle, Users } from 'lucide-react';
import EmptyState from '../ui/EmptyState';

const levelConfig = {
  LOW: { color: 'text-success-600', bg: 'bg-success-50', border: 'border-success-200', bar: 'bg-gradient-to-r from-success-400 to-success-500', icon: ShieldCheck },
  MEDIUM: { color: 'text-warning-600', bg: 'bg-warning-50', border: 'border-warning-200', bar: 'bg-gradient-to-r from-warning-400 to-warning-500', icon: AlertCircle },
  HIGH: { color: 'text-danger-600', bg: 'bg-danger-50', border: 'border-danger-200', bar: 'bg-gradient-to-r from-danger-400 to-danger-500', icon: AlertTriangle },
  CRITICAL: { color: 'text-danger-700', bg: 'bg-danger-100', border: 'border-danger-300', bar: 'bg-gradient-to-r from-danger-500 to-danger-600', icon: ShieldAlert },
};

export default function ChurnRiskWidget({ breakdown, highRiskCustomers, loading }) {
  if (loading) {
    return (
      <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm animate-pulse">
        <div className="skeleton h-5 w-1/3 mb-6" />
        <div className="skeleton h-48 rounded-xl" />
      </div>
    );
  }

  const hasData = breakdown && breakdown.totalCustomersAssessed > 0;

  if (!hasData) {
    return (
      <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="text-base font-bold text-text-primary mb-4">Churn Risk Overview</h3>
        <EmptyState icon={ShieldAlert} title="No churn data" description="No customers have been assessed for churn risk yet." />
      </div>
    );
  }

  const levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const total = breakdown.totalCustomersAssessed || 1;

  return (
    <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 className="text-base font-bold text-text-primary mb-5">Churn Risk Overview</h3>

      {/* Distribution Bars */}
      <div className="space-y-4 mb-6">
        {levels.map((level) => {
          const count = breakdown[`${level.toLowerCase()}Count`] || 0;
          const percent = Math.round((count / total) * 100);
          const config = levelConfig[level];
          const Icon = config.icon;

          return (
            <div key={level} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Icon size={14} className={config.color} />
                  <span className="font-semibold text-text-secondary">{level}</span>
                </div>
                <span className="text-text-muted font-medium">{count} ({percent}%)</span>
              </div>
              <div className="h-2.5 w-full bg-bg-base rounded-full overflow-hidden">
                <div className={`h-full ${config.bar} transition-all duration-500 rounded-full`} style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* High Risk Customers */}
      {highRiskCustomers && highRiskCustomers.length > 0 && (
        <div>
          <p className="text-xs font-bold text-text-muted uppercase tracking-wide mb-3">High Risk Customers</p>
          <div className="space-y-2">
            {highRiskCustomers.slice(0, 5).map((customer) => {
              const config = levelConfig[customer.riskLevel] || levelConfig.MEDIUM;
              const scorePercent = customer.riskScore != null ? Math.round(customer.riskScore * 100) : null;

              return (
                <div key={customer.assessmentId} className={`flex items-center justify-between p-3 rounded-xl border ${config.border} ${config.bg} hover:shadow-sm transition-shadow duration-200`}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center`}>
                      <Users size={14} className={config.color} />
                    </div>
                    <span className="text-sm font-medium text-text-primary truncate">{customer.authorIdentifier}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {scorePercent != null && (
                      <span className={`text-xs font-bold ${config.color}`}>{scorePercent}%</span>
                    )}
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.bg} ${config.color} border ${config.border}`}>
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
