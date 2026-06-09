import { Calendar } from 'lucide-react';

const WINDOWS = [
  { value: 'LAST_7_DAYS', label: 'Last 7 Days' },
  { value: 'LAST_30_DAYS', label: 'Last 30 Days' },
  { value: 'LAST_90_DAYS', label: 'Last 90 Days' },
];

export default function DashboardFilters({ window, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <Calendar size={16} className="text-text-muted" />
      <div className="flex items-center bg-bg-card border border-border rounded-lg p-0.5">
        {WINDOWS.map((w) => (
          <button
            key={w.value}
            onClick={() => onChange(w.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              window === w.value
                ? 'bg-primary-50 text-primary-700'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {w.label}
          </button>
        ))}
      </div>
    </div>
  );
}
