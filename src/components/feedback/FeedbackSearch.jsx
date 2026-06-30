import { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';

export default function FeedbackSearch({ value, onChange, placeholder = 'Search feedback...' }) {
  const [inputValue, setInputValue] = useState(value || '');

  const debouncedChange = useCallback(
    (val) => {
      onChange(val);
    },
    [onChange]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedChange(inputValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue, debouncedChange]);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  return (
    <div className="relative w-full max-w-md">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary-500" />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 text-sm bg-bg-base border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all placeholder:text-text-placeholder"
      />
      {inputValue && (
        <button
          onClick={() => setInputValue('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors p-0.5 rounded-md hover:bg-bg-hover"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
