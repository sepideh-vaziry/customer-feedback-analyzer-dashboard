import { X, AlertTriangle, MessageSquare, Users, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ComplaintSeverityBadge from './ComplaintSeverityBadge';

export default function ComplaintDetailsDrawer({ complaint, onClose }) {
  const navigate = useNavigate();
  if (!complaint) return null;

  const changePercent = complaint.changeRatio != null
    ? Math.round(complaint.changeRatio * 100)
    : null;
  const isPositive = (changePercent || 0) > 0;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-bg-card border-l border-border shadow-xl z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">{complaint.categoryName || 'Complaint Details'}</h2>
              <p className="text-sm text-text-muted mt-1">Investigate this complaint</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-border-light text-text-muted hover:text-text-primary transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-4 rounded-xl bg-bg-base border border-border">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={14} className="text-danger-600" />
                <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Occurrences</p>
              </div>
              <p className="text-2xl font-semibold text-text-primary">{complaint.occurrenceCount || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-bg-base border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Users size={14} className="text-primary-600" />
                <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Rate</p>
              </div>
              <p className="text-2xl font-semibold text-text-primary">
                {complaint.severityScore != null ? `${complaint.severityScore.toFixed(1)}%` : '—'}
              </p>
            </div>
          </div>

          {/* Trend */}
          {changePercent != null && (
            <div className={`p-4 rounded-xl border mb-6 ${isPositive ? 'border-danger-200 bg-danger-50' : 'border-success-200 bg-success-50'}`}>
              <div className="flex items-center gap-2">
                {isPositive ? <TrendingUp size={16} className="text-danger-600" /> : <TrendingDown size={16} className="text-success-600" />}
                <p className={`text-sm font-medium ${isPositive ? 'text-danger-700' : 'text-success-700'}`}>
                  {isPositive ? '+' : ''}{changePercent}% change
                </p>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                {isPositive ? 'This complaint is increasing in frequency.' : 'This complaint is decreasing in frequency.'}
              </p>
            </div>
          )}

          {/* Severity */}
          <div className="mb-6">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Severity</p>
            <ComplaintSeverityBadge severity={complaint.severity || 'MEDIUM'} />
          </div>

          {/* Description */}
          {complaint.description && (
            <div className="mb-6">
              <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Description</p>
              <div className="p-4 rounded-xl bg-bg-base border border-border">
                <p className="text-sm text-text-primary leading-relaxed">{complaint.description}</p>
              </div>
            </div>
          )}

          {/* Related Feedback */}
          {complaint.relatedFeedbackIds && complaint.relatedFeedbackIds.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Related Feedback</p>
              <div className="space-y-2">
                {complaint.relatedFeedbackIds.map((id) => (
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

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => { onClose(); navigate(`/complaints/explorer?category=${encodeURIComponent(complaint.categoryName || '')}`); }}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
            >
              Explore Similar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
