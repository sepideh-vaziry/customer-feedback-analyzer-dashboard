import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Activity } from 'lucide-react';
import TrendStatusBadge from './TrendStatusBadge';

const typeIcons = {
  COMPLAINT_SPIKE: AlertTriangle,
  EMERGING_TOPIC: Lightbulb,
  SENTIMENT_SHIFT: Activity,
};

export default function TrendImpactCard({ trend, onClick }) {
  const Icon = typeIcons[trend.type] || TrendingUp;
  const isPositive = (trend.changeRatio || 0) > 0;
  const changePercent = trend.changeRatio != null
    ? Math.round(trend.changeRatio * 100)
    : null;

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl bg-bg-card border border-border hover:border-primary-300 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${
            trend.type === 'COMPLAINT_SPIKE' ? 'bg-danger-50 text-danger-600' :
            trend.type === 'EMERGING_TOPIC' ? 'bg-primary-50 text-primary-600' :
            'bg-warning-50 text-warning-600'
          }`}>
            <Icon size={16} />
          </div>
          <span className="text-sm font-medium text-text-primary">{trend.subject}</span>
        </div>
        <TrendStatusBadge status={trend.severity} />
      </div>

      <div className="flex items-center gap-4 mt-3">
        <div>
          <p className="text-xs text-text-muted">Current</p>
          <p className="text-lg font-semibold text-text-primary">{trend.currentCount || 0}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">Previous</p>
          <p className="text-lg font-semibold text-text-primary">{trend.previousCount || 0}</p>
        </div>
        {changePercent != null && (
          <div>
            <p className="text-xs text-text-muted">Change</p>
            <p className={`text-lg font-semibold flex items-center gap-0.5 ${isPositive ? 'text-danger-600' : 'text-success-600'}`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {isPositive ? '+' : ''}{changePercent}%
            </p>
          </div>
        )}
      </div>

      {trend.explanation && (
        <p className="text-xs text-text-secondary mt-3 leading-relaxed line-clamp-2">{trend.explanation}</p>
      )}
    </button>
  );
}
