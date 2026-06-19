import { X, TrendingUp, TrendingDown, Activity, MessageSquare, AlertTriangle, Lightbulb, Calendar, Users } from 'lucide-react';
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

  const isSentimentShift = trend.type === 'SENTIMENT_SHIFT';
  const sentimentRows = isSentimentShift
    ? [
        { label: 'Positive', prev: trend.previousPositivePercent, curr: trend.currentPositivePercent, tone: 'text-success-600' },
        { label: 'Negative', prev: trend.previousNegativePercent, curr: trend.currentNegativePercent, tone: 'text-danger-600' },
        { label: 'Neutral', prev: trend.previousNeutralPercent, curr: trend.currentNeutralPercent, tone: 'text-text-secondary' },
      ]
    : [];

  const deepLinks = [];
  if (trend.type === 'COMPLAINT_SPIKE') {
    deepLinks.push({
      key: 'category',
      label: trend.categoryId ? 'View Category' : 'View Complaints',
      icon: AlertTriangle,
      tone: 'text-danger-600 bg-danger-50 hover:bg-danger-100',
      to: trend.categoryId
        ? `/complaints/categories/${trend.categoryId}`
        : '/complaints',
    });
  } else if (trend.type === 'EMERGING_TOPIC') {
    deepLinks.push({
      key: 'cluster',
      label: trend.clusterId ? 'View Cluster' : 'View Feature Requests',
      icon: Lightbulb,
      tone: 'text-primary-600 bg-primary-50 hover:bg-primary-100',
      to: trend.clusterId
        ? `/feature-requests/clusters/${trend.clusterId}`
        : '/feature-requests',
    });
  } else if (trend.type === 'SENTIMENT_SHIFT') {
    deepLinks.push({
      key: 'analytics',
      label: 'View Analytics',
      icon: Activity,
      tone: 'text-warning-600 bg-warning-50 hover:bg-warning-100',
      to: '/analytics',
    });
  }

  const handleDeepLink = (to) => {
    onClose();
    navigate(to);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-bg-card border-l border-border shadow-xl z-50 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">{trend.subject}</h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <TrendStatusBadge status={trend.type} />
                <TrendStatusBadge status={trend.severity} />
                {trend.status && <TrendStatusBadge status={trend.status} />}
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
            {trend.affectedCustomers != null && (
              <div className="p-4 rounded-xl bg-bg-base border border-border col-span-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <Users size={14} className="text-primary-500" />
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Affected Customers</p>
                </div>
                <p className="text-2xl font-semibold text-text-primary">{trend.affectedCustomers}</p>
              </div>
            )}
          </div>

          {isSentimentShift && sentimentRows.some((r) => r.prev != null || r.curr != null) && (
            <div className="mb-6">
              <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Sentiment Shift</p>
              <div className="rounded-xl bg-bg-base border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-bg-card">
                    <tr>
                      <th className="text-left px-3 py-2 text-xs font-medium text-text-muted uppercase tracking-wide">Sentiment</th>
                      <th className="text-right px-3 py-2 text-xs font-medium text-text-muted uppercase tracking-wide">Previous</th>
                      <th className="text-right px-3 py-2 text-xs font-medium text-text-muted uppercase tracking-wide">Current</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light">
                    {sentimentRows.map((row) => (
                      <tr key={row.label}>
                        <td className="px-3 py-2 font-medium text-text-primary">{row.label}</td>
                        <td className="px-3 py-2 text-right text-text-secondary">
                          {row.prev != null ? `${row.prev.toFixed(1)}%` : '—'}
                        </td>
                        <td className={`px-3 py-2 text-right font-semibold ${row.tone}`}>
                          {row.curr != null ? `${row.curr.toFixed(1)}%` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {trend.explanation && (
            <div className="mb-6">
              <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Explanation</p>
              <div className="p-4 rounded-xl bg-bg-base border border-border">
                <p className="text-sm text-text-primary leading-relaxed">{trend.explanation}</p>
              </div>
            </div>
          )}

          {trend.detectedAt && (
            <div className="mb-6 flex items-center gap-1.5 text-xs text-text-secondary">
              <Calendar size={14} />
              First detected {new Date(trend.detectedAt).toLocaleDateString()}
            </div>
          )}

          <div className="mb-6">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Related Areas</p>
            <div className="flex flex-wrap gap-2">
              {deepLinks.map((link) => {
                const LinkIcon = link.icon;
                return (
                  <button
                    key={link.key}
                    onClick={() => handleDeepLink(link.to)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${link.tone}`}
                  >
                    <LinkIcon size={14} />
                    {link.label}
                  </button>
                );
              })}
              {trend.relatedFeedbackIds?.length ? (
                <button
                  onClick={() => handleDeepLink(`/feedback?ids=${trend.relatedFeedbackIds.join(',')}`)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-text-secondary bg-bg-base border border-border rounded-lg hover:border-primary-300 transition-colors"
                >
                  <MessageSquare size={14} />
                  View Related Feedback
                </button>
              ) : (
                <button
                  onClick={() => handleDeepLink(`/feedback?search=${encodeURIComponent(trend.subject)}`)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-text-secondary bg-bg-base border border-border rounded-lg hover:border-primary-300 transition-colors"
                >
                  <MessageSquare size={14} />
                  Search Feedback
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}