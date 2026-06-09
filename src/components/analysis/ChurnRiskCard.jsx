import { ShieldAlert, ShieldCheck, AlertTriangle, AlertCircle, TrendingUp } from 'lucide-react';

const riskConfig = {
  LOW: {
    label: 'Low Risk',
    color: 'text-success-600',
    bg: 'bg-success-50',
    border: 'border-success-200',
    bar: 'bg-success-500',
    icon: ShieldCheck,
  },
  MEDIUM: {
    label: 'Medium Risk',
    color: 'text-warning-600',
    bg: 'bg-warning-50',
    border: 'border-warning-200',
    bar: 'bg-warning-500',
    icon: AlertCircle,
  },
  HIGH: {
    label: 'High Risk',
    color: 'text-danger-600',
    bg: 'bg-danger-50',
    border: 'border-danger-200',
    bar: 'bg-danger-500',
    icon: AlertTriangle,
  },
  CRITICAL: {
    label: 'Critical Risk',
    color: 'text-danger-700',
    bg: 'bg-danger-100',
    border: 'border-danger-300',
    bar: 'bg-danger-600',
    icon: ShieldAlert,
  },
};

export default function ChurnRiskCard({ risk }) {
  if (!risk) {
    return (
      <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-danger-50 flex items-center justify-center">
            <ShieldAlert size={16} className="text-danger-600" />
          </div>
          <h3 className="text-base font-semibold text-text-primary">Churn Risk</h3>
        </div>
        <div className="text-center py-6 bg-bg-base rounded-lg border border-border">
          <ShieldAlert size={20} className="text-text-muted mx-auto mb-2" />
          <p className="text-sm text-text-muted">No churn risk assessment available</p>
        </div>
      </div>
    );
  }

  const config = riskConfig[risk.riskLevel] || riskConfig.MEDIUM;
  const Icon = config.icon;
  const scorePercent = risk.riskScore != null ? Math.round(risk.riskScore * 100) : null;

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} p-6`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center shadow-sm">
            <Icon size={20} className={config.color} />
          </div>
          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Churn Risk</p>
            <p className={`text-2xl font-semibold ${config.color}`}>{config.label}</p>
          </div>
        </div>

        {scorePercent != null && (
          <div className="text-right">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Score</p>
            <p className="text-2xl font-semibold text-text-primary">{scorePercent}%</p>
          </div>
        )}
      </div>

      {scorePercent != null && (
        <div className="mt-4">
          <div className="h-2 w-full bg-white/60 rounded-full overflow-hidden">
            <div
              className={`h-full ${config.bar} transition-all duration-500`}
              style={{ width: `${scorePercent}%` }}
            />
          </div>
        </div>
      )}

      {risk.assessedFeedbackCount != null && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-text-muted">
          <TrendingUp size={12} />
          Based on {risk.assessedFeedbackCount} feedback item(s)
        </div>
      )}

      {risk.recommendation && (
        <div className="mt-4 pt-4 border-t border-black/5">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-1">Recommendation</p>
          <p className="text-sm text-text-secondary leading-relaxed">{risk.recommendation}</p>
        </div>
      )}

      {risk.signals && risk.signals.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Risk Signals</p>
          <div className="flex flex-wrap gap-1.5">
            {risk.signals.map((signal, i) => (
              <span
                key={i}
                className={`text-xs font-medium px-2 py-1 rounded-md ${config.bg} ${config.color} border ${config.border}`}
              >
                {signal}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
