import { Filter, X } from 'lucide-react';

const sourceOptions = [
  'MANUAL', 'CSV', 'INSTAGRAM', 'WHATSAPP', 'ZENDESK',
  'TYPEFORM', 'WEBHOOK', 'EMAIL', 'SURVEY',
  'SUPPORT_TICKET', 'TRUSTPILOT', 'LIVE_CHAT', 'OTHER'
];

const statusOptions = ['PENDING', 'PROCESSING', 'PROCESSED', 'FAILED'];

export default function FeedbackFilters({ filters, onChange }) {
  const hasActiveFilters = filters.source || filters.status;

  const handleSourceChange = (source) => {
    onChange({ ...filters, source: filters.source === source ? '' : source });
  };

  const handleStatusChange = (status) => {
    onChange({ ...filters, status: filters.status === status ? '' : status });
  };

  const clearFilters = () => {
    onChange({ source: '', status: '' });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-text-muted" />
        <span className="text-sm font-medium text-text-secondary">Filters</span>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto flex items-center gap-1 text-xs text-danger-600 hover:text-danger-700 transition-colors"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Source</p>
        <div className="flex flex-wrap gap-1.5">
          {sourceOptions.map((source) => (
            <button
              key={source}
              onClick={() => handleSourceChange(source)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filters.source === source
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-bg-base text-text-secondary border border-border hover:border-primary-300'
              }`}
            >
              {source}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Status</p>
        <div className="flex flex-wrap gap-1.5">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filters.status === status
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-bg-base text-text-secondary border border-border hover:border-primary-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
