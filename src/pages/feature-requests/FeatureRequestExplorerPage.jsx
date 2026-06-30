import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, RefreshCw, AlertTriangle, MessageSquare, ArrowRight } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { searchFeedback } from '../../services/featureRequestService';

export default function FeatureRequestExplorerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [inputValue, setInputValue] = useState(searchParams.get('query') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await searchFeedback(searchQuery, 20, 0.6);
      setResults(data || []);
    } catch (err) {
      setError('Failed to search for related feedback.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const q = searchParams.get('query');
    if (q) {
      setQuery(q);
      setInputValue(q);
      search(q);
    }
  }, [searchParams, search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery(inputValue);
    if (inputValue.trim()) {
      setSearchParams({ query: inputValue });
      search(inputValue);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Feature Request Explorer"
        description="Investigate feature requests and find related feedback"
      />

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe a feature to find related feedback..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:from-primary-500 hover:to-primary-600 transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : 'Explore'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-200 text-sm text-danger-700 flex items-center gap-2 font-medium">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {loading && results.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      ) : query && results.length === 0 && !loading ? (
        <EmptyState
          icon={MessageSquare}
          title="No related feedback found"
          description="Try a different description or check back later."
        />
      ) : results.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-text-muted">
            Found <span className="font-medium text-text-primary">{results.length}</span> related feedback items for "{query}"
          </p>
          {results.map((item) => (
            <div
              key={item.feedbackId}
              className="bg-bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-bg-base text-text-secondary border border-border">
                      {item.source}
                    </span>
                    <span className="text-xs text-text-muted">
                      {item.similarity ? `${(item.similarity * 100).toFixed(1)}% match` : ''}
                    </span>
                    {item.sentiment && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-primary-50 text-primary-700 border border-primary-200">
                        {item.sentiment}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-primary leading-relaxed line-clamp-3">
                    {item.content || item.summaryText || 'No content'}
                  </p>
                  {item.complaintCategories && item.complaintCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.complaintCategories.map((cat) => (
                        <span
                          key={cat}
                          className="text-xs px-2 py-0.5 rounded-full bg-danger-50 text-danger-700 border border-danger-200"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <a
                  href={`/feedback/${item.feedbackId}`}
                  className="flex-shrink-0 p-2 rounded-lg hover:bg-primary-50 text-text-muted hover:text-primary-600 transition-colors"
                  title="View feedback"
                >
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </DashboardLayout>
  );
}
