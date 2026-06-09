import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function TrendKpiCard({ title, value, changePercent, icon: Icon, loading }) {
  if (loading) {
    return (
      <div className="bg-bg-card rounded-xl border border-border p-5 shadow-xs animate-pulse">
        <div className="h-4 w-24 bg-border rounded mb-3" />
        <div className="h-8 w-16 bg-border rounded" />
      </div>
    );
  }

  const isPositive = (changePercent || 0) > 0;
  const isNeutral = changePercent == null || changePercent === 0;

  return (
    <div className="bg-bg-card rounded-xl border border-border p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon size={16} className="text-primary-500" />}
        <span className="text-xs font-medium text-text-muted uppercase tracking-wide">{title}</span>
      </div>
      <div className="flex items-end gap-3">
        <p className="text-2xl font-semibold text-text-primary">{value}</p>
        {!isNeutral && (
          <span className={`text-xs font-medium flex items-center gap-0.5 mb-1 ${isPositive ? 'text-danger-600' : 'text-success-600'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {isPositive ? '+' : ''}{changePercent}%
          </span>
        )}
        {isNeutral && changePercent != null && (
          <span className="text-xs font-medium text-text-muted flex items-center gap-0.5 mb-1">
            <Minus size={12} />
            0%
          </span>
        )}
      </div>
    </div>
  );
}
