const statusStyles = {
  PENDING: 'bg-warning-50 text-warning-700 border-warning-200',
  PROCESSING: 'bg-primary-50 text-primary-700 border-primary-200',
  PROCESSED: 'bg-success-50 text-success-700 border-success-200',
  FAILED: 'bg-danger-50 text-danger-700 border-danger-200',
};

export default function FeedbackStatusBadge({ status }) {
  const style = statusStyles[status] || 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}
    >
      {status}
    </span>
  );
}
