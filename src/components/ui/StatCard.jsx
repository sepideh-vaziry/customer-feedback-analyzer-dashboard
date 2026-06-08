export default function StatCard({ title, value, change, changeType, icon: Icon }) {
  const changeColor = changeType === 'positive'
    ? 'text-success-600'
    : changeType === 'negative'
      ? 'text-danger-600'
      : 'text-warning-600';

  const bgColor = changeType === 'positive'
    ? 'bg-success-50'
    : changeType === 'negative'
      ? 'bg-danger-50'
      : 'bg-warning-50';

  return (
    <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="text-3xl font-semibold text-text-primary">{value}</p>
          {change && (
            <div className="flex items-center gap-1.5">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bgColor} ${changeColor}`}>
                {changeType === 'positive' ? '+' : ''}{change}
              </span>
              <span className="text-xs text-text-muted">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-lg bg-primary-50 text-primary-600">
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
