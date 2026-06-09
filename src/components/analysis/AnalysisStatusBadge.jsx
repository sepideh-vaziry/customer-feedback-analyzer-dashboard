const statusConfig = {
  PENDING: { bg: 'bg-warning-50', text: 'text-warning-700', border: 'border-warning-200', label: 'Pending' },
  PROCESSING: { bg: 'bg-primary-50', text: 'text-primary-700', border: 'border-primary-200', label: 'Processing' },
  COMPLETED: { bg: 'bg-success-50', text: 'text-success-700', border: 'border-success-200', label: 'Completed' },
  FAILED: { bg: 'bg-danger-50', text: 'text-danger-700', border: 'border-danger-200', label: 'Failed' },
};

export default function AnalysisStatusBadge({ status, pulse = false }) {
  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      {pulse && status === 'PROCESSING' && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
        </span>
      )}
      {config.label}
    </span>
  );
}
