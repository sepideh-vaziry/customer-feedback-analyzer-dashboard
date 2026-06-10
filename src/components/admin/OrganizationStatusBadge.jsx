const statusConfig = {
  ACTIVE: { label: 'Active', className: 'bg-success-50 text-success-700 border-success-200' },
  SUSPENDED: { label: 'Suspended', className: 'bg-danger-50 text-danger-700 border-danger-200' },
  PENDING: { label: 'Pending', className: 'bg-warning-50 text-warning-700 border-warning-200' },
  TRIAL: { label: 'Trial', className: 'bg-primary-50 text-primary-700 border-primary-200' },
};

export default function OrganizationStatusBadge({ status }) {
  const config = statusConfig[status] || { label: status || 'Unknown', className: 'bg-bg-base text-text-secondary border-border' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
}
