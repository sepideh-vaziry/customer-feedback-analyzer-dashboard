import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import FeedbackSearch from '../../components/feedback/FeedbackSearch';
import FeedbackFilters from '../../components/feedback/FeedbackFilters';
import FeedbackTable from '../../components/feedback/FeedbackTable';
import { getFeedbackList, reprocessFeedback } from '../../services/feedbackManagementService';

export default function FeedbackListPage() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ source: '', status: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [reprocessingId, setReprocessingId] = useState(null);

  const loadFeedbacks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getFeedbackList();
      setFeedbacks(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const handleReprocess = useCallback(async (feedbackId) => {
    setReprocessingId(feedbackId);
    setError('');
    try {
      await reprocessFeedback(feedbackId);
      await loadFeedbacks();
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to reprocess feedback';
      setError(message);
    } finally {
      setReprocessingId(null);
    }
  }, [loadFeedbacks]);

  const filteredFeedbacks = useMemo(() => {
    let result = [...feedbacks];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          (f.content && f.content.toLowerCase().includes(query)) ||
          (f.customerName && f.customerName.toLowerCase().includes(query)) ||
          (f.customerEmail && f.customerEmail.toLowerCase().includes(query)) ||
          (f.customerIdentifier && f.customerIdentifier.toLowerCase().includes(query)) ||
          (f.externalId && f.externalId.toLowerCase().includes(query))
      );
    }

    if (filters.source) {
      result = result.filter((f) => f.source === filters.source);
    }

    if (filters.status) {
      result = result.filter((f) => f.status === filters.status);
    }

    result.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal == null) return sortConfig.direction === 'asc' ? -1 : 1;
      if (bVal == null) return sortConfig.direction === 'asc' ? 1 : -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortConfig.direction === 'asc'
        ? aVal > bVal ? 1 : -1
        : aVal < bVal ? 1 : -1;
    });

    return result;
  }, [feedbacks, searchQuery, filters, sortConfig]);

  return (
    <DashboardLayout>
      <PageHeader
        title="Feedback List"
        description="Browse, search, and manage all customer feedback"
      >
        <button
          onClick={loadFeedbacks}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary bg-bg-card border border-border rounded-lg hover:border-primary-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </PageHeader>

      <div className="space-y-6">
        {error && (
          <div className="p-4 rounded-lg bg-danger-50 border border-danger-200 text-sm text-danger-700 flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 lg:items-start">
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-bg-card rounded-xl border border-border p-4 shadow-xs">
              <FeedbackFilters filters={filters} onChange={setFilters} />
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-4">
            <div className="bg-bg-card rounded-xl border border-border p-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <FeedbackSearch
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search content, customer, email, ID..."
                />
                <span className="text-sm text-text-muted">
                  {filteredFeedbacks.length} result{filteredFeedbacks.length !== 1 ? 's' : ''}
                </span>
              </div>

              <FeedbackTable
                feedbacks={filteredFeedbacks}
                loading={loading}
                sortConfig={sortConfig}
                onSort={handleSort}
                onReprocess={handleReprocess}
                reprocessingId={reprocessingId}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
