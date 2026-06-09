const statusConfig = {
  EMERGING: { label: 'Emerging', className: 'bg-primary-50 text-primary-700 border-primary-200' },
  GROWING: { label: 'Growing', className: 'bg-success-50 text-success-700 border-success-200' },
  STABLE: { label: 'Stable', className: 'bg-slate-50 text-slate-600 border-slate-200' },
  DECLINING: { label: 'Declining', className: 'bg-warning-50 text-warning-700 border-warning-200' },
  EXPIRED: { label: 'Expired', className: 'bg-muted-50 text-muted-600 border-muted-200' },
  COMPLAINT_SPIKE: { label: 'Complaint Spike', className: 'bg-danger-50 text-danger-700 border-danger-200' },
  EMERGING_TOPIC: { label: 'Emerging Topic', className: 'bg-primary-50 text-primary-700 border-primary-200' },
  SENTIMENT_SHIFT: { label: 'Sentiment Shift', className: 'bg-warning-50 text-warning-700 border-warning-200' },
};

export default function TrendStatusBadge({ status }) {
  const config = statusConfig[status] || { label: status || 'Unknown', className: 'bg-bg-base text-text-secondary border-border' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
}
