import { X, TrendingUp, TrendingDown, Activity, MessageSquare, AlertTriangle, Lightbulb, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TrendStatusBadge from './TrendStatusBadge';

export default function TrendDetailsDrawer({ trend, onClose }) {
  const navigate = useNavigate();

  if (!trend) return null;

  const isPositive = (trend.changeRatio || 0) > 0;
  const changePercent = trend.changeRatio != null
    ? Math.round(trend.changeRatio * 100)
    : null;
  const growthRate = trend.previousCount > 0
    ? Math.round(((trend.currentCount - trend.previousCount) / trend.previousCount) * 100)
    : 0;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-bg-card border-l border-border shadow-xl z-50 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">{trend.subject}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <TrendStatusBadge status={trend.type} />
                <TrendStatusBadge status={trend.severity} />
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-border-light text-text-muted hover:text-text-primary transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-4 rounded-xl bg-bg-base border border-border">
              <div className="flex items-center gap-1.5 mb-1">
                <Activity size={14} className="text-primary-500" />
                <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Current Volume</p>
              </div>
              <p className="text-2xl font-semibold text-text-primary">{trend.currentCount || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-bg-base border border-border">
              <div className="flex items-center gap-1.5 mb-1">
                {isPositive ? <TrendingUp size={14} className="text-danger-500" /> : <TrendingDown size={14} className="text-success-500" />}
                <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Change</p>
              </div>
              <p className={`text-2xl font-semibold ${isPositive ? 'text-danger-600' : 'text-success-600'}`}>
                {isPositive ? '+' : ''}{changePercent != null ? changePercent : 0}%
              </p>
            </div>
            <div className="p-4 rounded-xl bg-bg-base border border-border">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar size={14} className="text-primary-500" />
                <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Previous</p>
              </div>
              <p className="text-2xl font-semibold text-text-primary">{trend.previousCount || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-bg-base border border-border">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp size={14} className="text-primary-500" />
                <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Growth Rate</p>
              </div>
              <p className={`text-2xl font-semibold ${growthRate > 0 ? 'text-danger-600' : 'text-success-600'}`}>
                {growthRate > 0 ? '+' : ''}{growthRate}%
              </p>
            </div>
          </div>

          {trend.explanation && (
            <div className="mb-6">
              <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Explanation</p>
              <div className="p-4 rounded-xl bg-bg-base border border-border">
                <p className="text-sm text-text-primary leading-relaxed">{trend.explanation}</p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Related Areas</p>
            <div className="flex flex-wrap gap-2">
              {trend.type === 'COMPLAINT_SPIKE' && (
                <button
                  onClick={() => { onClose(); navigate('/complaints'); }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-danger-600 bg-danger-50 rounded-lg hover:bg-danger-100 transition-colors"
                >
                  <AlertTriangle size={14} />
                  View Complaints
                </button>
              )}
              {trend.type === 'EMERGING_TOPIC' && (
                <button
                  onClick={() => { onClose(); navigate('/feature-requests'); }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <Lightbulb size={14} />
                  View Feature Requests
                </button>
              )}
              {trend.type === 'SENTIMENT_SHIFT' && (
                <button
                  onClick={() => { onClose(); navigate('/analytics'); }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-warning-600 bg-warning-50 rounded-lg hover:bg-warning-100 transition-colors"
                >
                  <Activity size={14} />
                  View Analytics
                </button>
              )}
              <button
                onClick={() => { onClose(); navigate(`/feedback?search=${encodeURIComponent(trend.subject)}`); }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-text-secondary bg-bg-base border border-border rounded-lg hover:border-primary-300 transition-colors"
              >
                <MessageSquare size={14} />
                Search Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
