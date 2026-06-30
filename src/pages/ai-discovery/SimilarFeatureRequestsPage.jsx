import { useState, useCallback } from 'react';
import { Search, AlertTriangle, Lightbulb, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import SearchResultCard from '../../components/ai-discovery/SearchResultCard';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { semanticSearch } from '../../services/semanticSearchService';

export default function SimilarFeatureRequestsPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [minSimilarity, setMinSimilarity] = useState(0.6);

  const search = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setHasSearched(true);
    try {
      const data = await semanticSearch(query.trim(), 20, minSimilarity);
      setResults(data || []);
    } catch (err) {
      setError('Failed to find similar feature requests.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, minSimilarity]);

  const handleSubmit = (e) => {
    e.preventDefault();
    search();
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Similar Feature Requests"
        description="Find feedback with feature requests similar to a given description"
      />

      <form onSubmit={handleSubmit} className="mb-6 max-w-2xl">
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe a feature request..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 disabled:opacity-50 shadow-sm"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : 'Find Similar'}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted">Min Similarity</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={minSimilarity}
            onChange={(e) => setMinSimilarity(Number(e.target.value))}
            className="w-48 accent-primary-600"
          />
          <span className="text-sm font-medium text-text-primary">{Math.round(minSimilarity * 100)}%</span>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-200 text-sm text-danger-700 flex items-center gap-2 font-medium">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {loading && !results.length ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      ) : hasSearched && results.length === 0 ? (
        <EmptyState
          icon={Lightbulb}
          title="No similar feature requests found"
          description="Try a different description to find related feature requests."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {results.map((result, i) => (
            <SearchResultCard key={i} result={result} />
          ))}
        </div>
      )}

      {!hasSearched && (
        <EmptyState
          icon={Search}
          title="Search for similar feature requests"
          description="Enter a feature description to find semantically related feedback."
        />
      )}
    </DashboardLayout>
  );
}
