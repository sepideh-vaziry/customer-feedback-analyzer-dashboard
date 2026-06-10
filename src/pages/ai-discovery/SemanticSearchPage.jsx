import { useState, useCallback, useEffect } from 'react';
import { AlertTriangle, Sparkles, Search, SlidersHorizontal } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import SemanticSearchBox from '../../components/ai-discovery/SemanticSearchBox';
import SearchSuggestionCard from '../../components/ai-discovery/SearchSuggestionCard';
import SearchResultCard from '../../components/ai-discovery/SearchResultCard';
import EmptyState from '../../components/ui/EmptyState';
import { vectorSearch } from '../../services/semanticSearchService';

const SUGGESTIONS = [
  'Why are customers leaving?',
  'What complaints mention integrations?',
  'Show feedback related to pricing',
  'Find customers mentioning performance issues',
  'Which feature requests are similar to Slack integration?',
  'What are the top complaints this month?',
  'Show churn-related feedback',
  'What do customers say about support?',
];

export default function SemanticSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [limit, setLimit] = useState(20);
  const [minSimilarity, setMinSimilarity] = useState(0.7);
  const [showFilters, setShowFilters] = useState(false);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError('');
    setHasSearched(true);
    try {
      const data = await vectorSearch(searchQuery.trim(), limit, minSimilarity);
      setResults(data || []);
    } catch (err) {
      setError('Search failed. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [limit, minSimilarity]);

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    performSearch(suggestion);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="AI Discovery"
        description="Explore feedback using natural language"
      />

      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <SemanticSearchBox
            value={query}
            onChange={setQuery}
            onSubmit={performSearch}
            loading={loading}
            placeholder="Ask anything about your feedback..."
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            <SlidersHorizontal size={14} />
            {showFilters ? 'Hide Filters' : 'Filters'}
          </button>
          {hasSearched && (
            <span className="text-xs text-text-muted">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {showFilters && (
          <div className="mb-6 p-4 rounded-xl bg-bg-card border border-border flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-text-muted mb-1">Result Limit</label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-bg-base border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-text-muted mb-1">Min Similarity</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={minSimilarity}
                  onChange={(e) => setMinSimilarity(Number(e.target.value))}
                  className="flex-1 accent-primary-600"
                />
                <span className="text-sm font-medium text-text-primary w-12 text-right">
                  {Math.round(minSimilarity * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-danger-50 border border-danger-200 text-sm text-danger-700 flex items-center gap-2">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        {!hasSearched ? (
          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-3">Suggested Questions</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTIONS.map((s, i) => (
                <SearchSuggestionCard
                  key={i}
                  suggestion={s}
                  onClick={handleSuggestionClick}
                />
              ))}
            </div>
          </div>
        ) : results.length === 0 && !loading ? (
          <EmptyState
            icon={Search}
            title="No results found"
            description="Try adjusting your query or filters to find what you're looking for."
          />
        ) : (
          <div className="space-y-3">
            {results.map((result, i) => (
              <SearchResultCard key={i} result={result} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
