import { Sparkles } from 'lucide-react';

export default function SearchSuggestionCard({ suggestion, onClick }) {
  return (
    <button
      onClick={() => onClick?.(suggestion)}
      className="w-full text-left p-3 rounded-lg bg-bg-base border border-border hover:border-primary-300 hover:bg-primary-50/30 transition-colors"
    >
      <div className="flex items-center gap-2">
        <Sparkles size={14} className="text-primary-500 flex-shrink-0" />
        <span className="text-sm text-text-primary">{suggestion}</span>
      </div>
    </button>
  );
}
