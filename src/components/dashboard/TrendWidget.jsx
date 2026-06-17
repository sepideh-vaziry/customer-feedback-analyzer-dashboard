import { TrendingUp, TrendingDown, AlertTriangle, MessageSquare, Zap } from 'lucide-react';
import EmptyState from '../ui/EmptyState';

const typeConfig = {
  COMPLAINT_SPIKE: { icon: AlertTriangle, color: 'text-danger-600', bg: 'bg-gradient-to-br from-danger-50 to-danger-100/50', border: 'border-danger-200' },
  EMERGING_TOPIC: { icon: MessageSquare, color: 'text-primary-600', bg: 'bg-gradient-to-br from-primary-50 to-primary-100/50', border: 'border-primary-200' },
  SENTIMENT_SHIFT: { icon: Zap, color: 'text-warning-600', bg: 'bg-gradient-to-br from-warning-50 to-warning-100/50', border: 'border-warning-200' },
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
      <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm animate-pulse">
        <div className="skeleton h-5 w-1/3 mb-6" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-20 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const entries = data?.entries || [];

  if (entries.length === 0) {
    return (
      <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="text-base font-bold text-text-primary mb-4">Trends</h3>
        <EmptyState icon={TrendingUp} title="No trends detected" description="Trends will appear as feedback is analyzed over time." />
      </div>
    );
  }

  return (
    <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-text-primary">Trends</h3>
        <span className="text-xs text-text-muted font-medium bg-bg-base px-2.5 py-1 rounded-full border border-border">
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
              className={`p-4 rounded-xl border ${config.border} ${config.bg} hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg bg-white/80 flex-shrink-0 mt-0.5`}>
                    <Icon size={18} className={config.color} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {entry.subject}
                    </p>
                    {entry.explanation && (
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                        {entry.explanation}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/80 ${severityConfig[entry.severity] || 'text-text-muted'}`}>
                        {entry.severity}
                      </span>
                      {changePercent != null && (
                        <span className={`text-xs font-bold flex items-center gap-0.5 ${isPositive ? 'text-danger-600' : 'text-success-600'}`}>
                          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {isPositive ? '+' : ''}{changePercent}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-bold text-text-primary">{entry.currentCount || 0}</p>
                  <p className="text-xs text-text-muted font-medium">mentions</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
