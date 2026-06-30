const statusStyles = {
  PENDING: 'bg-gradient-to-r from-warning-50 to-warning-100 text-warning-700 border-warning-200',
  PROCESSING: 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border-primary-200',
  PROCESSED: 'bg-gradient-to-r from-success-50 to-success-100 text-success-700 border-success-200',
  FAILED: 'bg-gradient-to-r from-danger-50 to-danger-100 text-danger-700 border-danger-200',
};

export default function FeedbackStatusBadge({ status }) {
  const style = statusStyles[status] || 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === 'PROCESSED' ? 'bg-success-500' :
        status === 'FAILED' ? 'bg-danger-500' :
        status === 'PROCESSING' ? 'bg-primary-500' :
        'bg-warning-500'
      }`} />
      {status}
    </span>
  );
}
