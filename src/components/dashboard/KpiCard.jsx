import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const trendConfig = {
  UP: { icon: ArrowUpRight, color: 'text-success-600', bg: 'bg-success-50', border: 'border-success-200', gradient: 'from-success-500/10 to-success-400/5' },
  DOWN: { icon: ArrowDownRight, color: 'text-danger-600', bg: 'bg-danger-50', border: 'border-danger-200', gradient: 'from-danger-500/10 to-danger-400/5' },
  FLAT: { icon: Minus, color: 'text-text-muted', bg: 'bg-bg-base', border: 'border-border', gradient: 'from-slate-100 to-slate-50' },
};

export default function KpiCard({ title, value, unit, changePercent, trend, icon: Icon, loading }) {
  if (loading) {
    return (
      <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="skeleton h-4 w-1/2 mb-4" />
        <div className="skeleton h-8 w-3/4 mb-2" />
        <div className="skeleton h-4 w-1/3" />
      </div>
    );
  }

  const trendKey = trend?.toUpperCase() || 'FLAT';
  const trendMeta = trendConfig[trendKey] || trendConfig.FLAT;
  const TrendIcon = trendMeta.icon;

  return (
    <div className="group bg-bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-3 min-w-0 flex-1">
          <p className="text-sm font-medium text-text-muted truncate">{title}</p>
          <p className="text-3xl font-bold text-text-primary tracking-tight">
            {value}
            {unit && <span className="text-lg font-medium text-text-muted ml-1">{unit}</span>}
          </p>
          {changePercent != null && (
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${trendMeta.bg} ${trendMeta.color} ${trendMeta.border}`}>
                <TrendIcon size={12} />
                {changePercent > 0 ? '+' : ''}{changePercent}%
              </span>
              <span className="text-xs text-text-muted font-medium">vs previous period</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${trendMeta.gradient} flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
            <Icon size={22} className={trendMeta.color} />
          </div>
        )}
      </div>
    </div>
  );
}
