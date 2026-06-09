import { TrendingUp, TrendingDown, AlertTriangle, MessageSquare, Lightbulb, Zap } from 'lucide-react';
import EmptyState from '../ui/EmptyState';

const typeConfig = {
  COMPLAINT_SPIKE: { icon: AlertTriangle, color: 'text-danger-600', bg: 'bg-danger-50', border: 'border-danger-200' },
  EMERGING_TOPIC: { icon: MessageSquare, color: 'text-primary-600', bg: 'bg-primary-50', border: 'border-primary-200' },
  SENTIMENT_SHIFT: { icon: Zap, color: 'text-warning-600', bg: 'bg-warning-50', border: 'border-warning-200' },
};

const severityConfig = {
  LOW: 'text-success-600',
  MEDIUM: 'text-warning-600',
  HIGH: 'text-danger-600',
  CRITICAL: 'text-danger-700',
};

export default function TrendWidget({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs animate-pulse">
        <div className="h-5 bg-border-light rounded w-1/3 mb-6" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-border-light rounded" />
          ))}
        </div>
      </div>
    );
  }

  const entries = data?.entries || [];

  if (entries.length === 0) {
    return (
      <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
        <h3 className="text-base font-semibold text-text-primary mb-4">Trends</h3>
        <EmptyState icon={TrendingUp} title="No trends detected" description="Trends will appear as feedback is analyzed over time." />
      </div>
    );
  }

  return (
    <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-text-primary">Trends</h3>
        <span className="text-xs text-text-muted">
          {data.windowDays || 30} days
        </span>
      </div>

      <div className="space-y-3">
        {entries.map((entry, index) => {
          const config = typeConfig[entry.type] || typeConfig.EMERGING_TOPIC;
          const Icon = config.icon;
          const isPositive = (entry.changeRatio || 0) > 0;
          const changePercent = entry.changeRatio != null
            ? Math.round(entry.changeRatio * 100)
            : null;

          return (
            <div
              key={index}
              className={`p-4 rounded-lg border ${config.border} ${config.bg}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Icon size={18} className={`mt-0.5 ${config.color}`} />
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {entry.subject}
                    </p>
                    {entry.explanation && (
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                        {entry.explanation}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-xs font-medium ${severityConfig[entry.severity] || 'text-text-muted'}`}>
                        {entry.severity}
                      </span>
                      {changePercent != null && (
                        <span className={`text-xs font-medium flex items-center gap-0.5 ${isPositive ? 'text-danger-600' : 'text-success-600'}`}>
                          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {isPositive ? '+' : ''}{changePercent}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-semibold text-text-primary">{entry.currentCount || 0}</p>
                  <p className="text-xs text-text-muted">mentions</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
