import { X, Lightbulb, MessageSquare, Users, TrendingUp, TrendingDown, ArrowRight, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FeatureRequestBadge from './FeatureRequestBadge';

const priorityConfig = {
  LOW: { color: 'text-success-600', bg: 'bg-success-50', border: 'border-success-200', icon: ArrowDown },
  MEDIUM: { color: 'text-warning-600', bg: 'bg-warning-50', border: 'border-warning-200', icon: Minus },
  HIGH: { color: 'text-danger-600', bg: 'bg-danger-50', border: 'border-danger-200', icon: ArrowUp },
};

export default function FeatureRequestDetailsDrawer({ feature, onClose }) {
  const navigate = useNavigate();
  if (!feature) return null;

  const changePercent = feature.changeRatio != null
    ? Math.round(feature.changeRatio * 100)
    : null;
  const isPositive = (changePercent || 0) > 0;
  const priorityMeta = priorityConfig[feature.priority || 'MEDIUM'];
  const PriorityIcon = priorityMeta.icon;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-bg-card border-l border-border shadow-xl z-50 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">{feature.clusterName || feature.title || 'Feature Request'}</h2>
              <p className="text-sm text-text-muted mt-1">Investigate this feature request</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-border-light text-text-muted hover:text-text-primary transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-4 rounded-xl bg-bg-base border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb size={14} className="text-warning-600" />
                <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Occurrences</p>
              </div>
              <p className="text-2xl font-semibold text-text-primary">{feature.occurrenceCount || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-bg-base border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Users size={14} className="text-primary-600" />
                <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Demand Rate</p>
              </div>
              <p className="text-2xl font-semibold text-text-primary">
                {feature.demandScore != null ? `${feature.demandScore.toFixed(1)}%` : '—'}
              </p>
            </div>
          </div>

          {changePercent != null && (
            <div className={`p-4 rounded-xl border mb-6 ${isPositive ? 'border-success-200 bg-success-50' : 'border-warning-200 bg-warning-50'}`}>
              <div className="flex items-center gap-2">
                {isPositive ? <TrendingUp size={16} className="text-success-600" /> : <TrendingDown size={16} className="text-warning-600" />}
                <p className={`text-sm font-medium ${isPositive ? 'text-success-700' : 'text-warning-700'}`}>
                  {isPositive ? '+' : ''}{changePercent}% change
                </p>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                {isPositive ? 'This feature request is growing in demand.' : 'This feature request is slowing down.'}
              </p>
            </div>
          )}

          <div className="mb-6">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Priority</p>
            <FeatureRequestBadge priority={feature.priority || 'MEDIUM'} />
          </div>

          {feature.description && (
            <div className="mb-6">
              <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Description</p>
              <div className="p-4 rounded-xl bg-bg-base border border-border">
                <p className="text-sm text-text-primary leading-relaxed">{feature.description}</p>
              </div>
            </div>
          )}

          {feature.relatedFeedbackIds && feature.relatedFeedbackIds.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Related Feedback</p>
              <div className="space-y-2">
                {feature.relatedFeedbackIds.map((id) => (
                  <button
                    key={id}
                    onClick={() => { onClose(); navigate(`/feedback/${id}`); }}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-bg-base border border-border hover:border-primary-300 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare size={14} className="text-text-muted" />
                      <span className="text-sm text-text-primary font-mono">{id.slice(0, 8)}...</span>
                    </div>
                    <ArrowRight size={14} className="text-text-muted" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => { onClose(); navigate(`/feature-requests/explorer?query=${encodeURIComponent(feature.clusterName || feature.title || '')}`); }}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
            >
              Explore Related
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
