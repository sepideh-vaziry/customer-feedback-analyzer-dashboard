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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center shadow-sm">
          <Filter size={14} className="text-primary-600" />
        </div>
        <span className="text-sm font-bold text-text-primary">Filters</span>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto flex items-center gap-1 text-xs font-semibold text-danger-600 hover:text-danger-700 transition-colors px-2 py-1 rounded-lg hover:bg-danger-50"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold text-text-muted uppercase tracking-wide">Source</p>
        <div className="flex flex-wrap gap-1.5">
          {sourceOptions.map((source) => (
            <button
              key={source}
              onClick={() => handleSourceChange(source)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                filters.source === source
                  ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border border-primary-200 shadow-sm'
                  : 'bg-bg-base text-text-secondary border border-border hover:border-primary-300 hover:text-text-primary'
              }`}
            >
              {source}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold text-text-muted uppercase tracking-wide">Status</p>
        <div className="flex flex-wrap gap-1.5">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                filters.status === status
                  ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border border-primary-200 shadow-sm'
                  : 'bg-bg-base text-text-secondary border border-border hover:border-primary-300 hover:text-text-primary'
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
