import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const trendConfig = {
  UP: { icon: TrendingUp, color: 'text-success-600', bg: 'bg-success-50' },
  DOWN: { icon: TrendingDown, color: 'text-danger-600', bg: 'bg-danger-50' },
  FLAT: { icon: Minus, color: 'text-text-muted', bg: 'bg-bg-base' },
};

export default function KpiCard({ title, value, unit, changePercent, trend, icon: Icon, loading }) {
  if (loading) {
    return (
      <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs animate-pulse">
        <div className="h-4 bg-border-light rounded w-1/2 mb-4" />
        <div className="h-8 bg-border-light rounded w-3/4 mb-2" />
        <div className="h-4 bg-border-light rounded w-1/3" />
      </div>
    );
  }

  const trendKey = trend?.toUpperCase() || 'FLAT';
  const trendMeta = trendConfig[trendKey] || trendConfig.FLAT;
  const TrendIcon = trendMeta.icon;

  return (
    <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2 min-w-0">
          <p className="text-sm font-medium text-text-secondary truncate">{title}</p>
          <p className="text-3xl font-semibold text-text-primary">
            {value}
            {unit && <span className="text-lg font-normal text-text-muted ml-1">{unit}</span>}
          </p>
          {changePercent != null && (
            <div className="flex items-center gap-1.5">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${trendMeta.bg} ${trendMeta.color}`}>
                <TrendIcon size={12} />
                {changePercent > 0 ? '+' : ''}{changePercent}%
              </span>
              <span className="text-xs text-text-muted">vs previous period</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-lg bg-primary-50 text-primary-600 flex-shrink-0">
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
