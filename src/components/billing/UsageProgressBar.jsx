export default function UsageProgressBar({ used, limit, label, className = '' }) {
  const percent = limit > 0 ? Math.min(Math.round((used / limit) * 100), 100) : 0;
  const isWarning = percent >= 80;
  const isDanger = percent >= 95;

  const barColor = isDanger ? 'bg-danger-500' : isWarning ? 'bg-warning-500' : 'bg-primary-500';

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-text-secondary">{label}</span>
        <span className="font-medium text-text-primary">
          {used.toLocaleString()} / {limit.toLocaleString()}
        </span>
      </div>
      <div className="h-2.5 w-full bg-bg-base rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-text-muted mt-1">{percent}% used</p>
    </div>
  );
}
