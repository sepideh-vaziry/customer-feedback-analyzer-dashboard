import { useState, useCallback } from 'react';
import { Search, AlertTriangle, MessageSquare, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import SearchResultCard from '../../components/ai-discovery/SearchResultCard';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { semanticSearch } from '../../services/semanticSearchService';

export default function SimilarFeedbackPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const search = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setHasSearched(true);
    try {
      const data = await semanticSearch(query.trim(), 20, 0.6);
      setResults(data || []);
    } catch (err) {
      setError('Failed to find similar feedback.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    search();
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Similar Feedback"
        description="Find feedback semantically related to a topic or description"
      />

      <form onSubmit={handleSubmit} className="mb-6 max-w-2xl">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a topic or description..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-4 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : 'Find Similar'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-danger-50 border border-danger-200 text-sm text-danger-700 flex items-center gap-2">
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
          icon={MessageSquare}
          title="No similar feedback found"
          description="Try a different description to find related feedback."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((result, i) => (
            <SearchResultCard key={i} result={result} />
          ))}
        </div>
      )}

      {!hasSearched && (
        <EmptyState
          icon={Search}
          title="Search for similar feedback"
          description="Enter a topic or description to find semantically related feedback items."
        />
      )}
    </DashboardLayout>
  );
}
