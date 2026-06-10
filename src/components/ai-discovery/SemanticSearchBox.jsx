import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

export default function SemanticSearchBox({
  value,
  onChange,
  onSubmit,
  placeholder = 'Ask anything about your feedback...',
  loading = false,
}) {
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !loading) {
      onSubmit?.(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`flex items-center gap-3 px-4 py-3 bg-bg-card border rounded-xl transition-all ${
          focused
            ? 'border-primary-500 ring-2 ring-primary-500/20'
            : 'border-border hover:border-primary-300'
        }`}
      >
        {loading ? (
          <Loader2 size={20} className="text-primary-500 animate-spin flex-shrink-0" />
        ) : (
          <Search size={20} className="text-text-muted flex-shrink-0" />
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          disabled={loading}
        />
        {value.trim() && (
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            Search
          </button>
        )}
      </div>
    </form>
  );
}
