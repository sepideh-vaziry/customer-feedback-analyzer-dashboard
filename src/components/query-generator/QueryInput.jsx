import { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

const QUERY_SUGGESTIONS = [
  'Get all customers with their recent orders',
  'Find top 10 best-selling products',
  'List customers who haven\'t purchased in 90 days',
  'Calculate total revenue by product category',
  'Show users with the highest order frequency',
];

const INTENTS = [
  { value: 'SELECT', label: 'Select' },
  { value: 'AGGREGATE', label: 'Aggregate' },
  { value: 'JOIN', label: 'Join' },
  { value: 'REPORTING', label: 'Reporting' },
  { value: 'INSERT', label: 'Insert' },
  { value: 'UPDATE', label: 'Update' },
  { value: 'DELETE', label: 'Delete' },
];

export default function QueryInput({
  value,
  onChange,
  intent,
  onIntentChange,
  explain,
  optimize,
  onExplainChange,
  onOptimizeChange,
  disabled = false,
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-text-secondary mb-1.5">
          Describe Your Query <span className="text-danger-500">*</span>
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="e.g., Get all customers who made purchases in the last 30 days with their total spending"
          rows={4}
          className="input w-full resize-y disabled:opacity-60 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-secondary mb-1.5">
          Intent <span className="text-danger-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {INTENTS.map((opt) => {
            const active = intent === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onIntentChange(opt.value)}
                disabled={disabled}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                  active
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm shadow-primary-500/20'
                    : 'bg-bg-card text-text-secondary border-border hover:border-primary-300 hover:text-text-primary'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary cursor-pointer">
          <input
            type="checkbox"
            checked={explain}
            onChange={(e) => onExplainChange(e.target.checked)}
            disabled={disabled}
            className="w-4 h-4 rounded border-border text-primary-600 focus:ring-primary-500/20"
          />
          Explain the query
        </label>
        <label className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary cursor-pointer">
          <input
            type="checkbox"
            checked={optimize}
            onChange={(e) => onOptimizeChange(e.target.checked)}
            disabled={disabled}
            className="w-4 h-4 rounded border-border text-primary-600 focus:ring-primary-500/20"
          />
          Optimize performance
        </label>
      </div>

      <div className="rounded-xl border border-border bg-bg-base overflow-hidden">
        <button
          type="button"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="flex items-center justify-between w-full px-4 py-2.5 text-left text-sm font-semibold text-text-secondary hover:bg-bg-hover transition-colors"
        >
          <span className="inline-flex items-center gap-2">
            <Lightbulb size={14} className="text-warning-500" />
            Example Queries
          </span>
          {showSuggestions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showSuggestions && (
          <ul className="divide-y divide-border-light border-t border-border">
            {QUERY_SUGGESTIONS.map((s, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(s);
                    setShowSuggestions(false);
                  }}
                  disabled={disabled}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors disabled:opacity-60"
                >
                  <Sparkles size={12} className="text-primary-400 shrink-0" />
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
