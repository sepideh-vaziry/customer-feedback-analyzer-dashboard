import { useNavigate } from 'react-router-dom';
import { Eye, ArrowUpDown, Play } from 'lucide-react';
import FeedbackStatusBadge from './FeedbackStatusBadge';
import FeedbackContentPreview from './FeedbackContentPreview';
import EmptyState from '../ui/EmptyState';
import LoadingSpinner from '../ui/LoadingSpinner';
import { MessageSquare } from 'lucide-react';

export default function FeedbackTable({ feedbacks, loading, sortConfig, onSort, onReprocess, reprocessingId }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No feedback found"
        description="Try adjusting your search or filters to find what you're looking for."
      />
    );
  }

  const SortHeader = ({ column, children }) => (
    <button
      onClick={() => onSort?.(column)}
      className="flex items-center gap-1.5 hover:text-text-primary transition-colors group"
    >
      {children}
      <ArrowUpDown size={14} className="text-text-muted group-hover:text-text-secondary transition-colors" />
    </button>
  );

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3.5 px-4 text-xs font-bold text-text-muted uppercase tracking-wider">
              <SortHeader column="createdAt">Created</SortHeader>
            </th>
            <th className="text-left py-3.5 px-4 text-xs font-bold text-text-muted uppercase tracking-wider">
              <SortHeader column="source">Source</SortHeader>
            </th>
            <th className="text-left py-3.5 px-4 text-xs font-bold text-text-muted uppercase tracking-wider">
              Customer
            </th>
            <th className="text-left py-3.5 px-4 text-xs font-bold text-text-muted uppercase tracking-wider">
              Status
            </th>
            <th className="text-left py-3.5 px-4 text-xs font-bold text-text-muted uppercase tracking-wider">
              Content
            </th>
            <th className="text-right py-3.5 px-4 text-xs font-bold text-text-muted uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-light">
          {feedbacks.map((feedback) => (
            <tr
              key={feedback.id}
              className="hover:bg-bg-hover transition-colors duration-200 group"
            >
              <td className="py-3.5 px-4 text-sm text-text-secondary whitespace-nowrap font-medium">
                {formatDate(feedback.createdAt)}
              </td>
              <td className="py-3.5 px-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-bg-base text-text-secondary border border-border hover:border-primary-200 transition-colors">
                  {feedback.source}
                </span>
              </td>
              <td className="py-3.5 px-4">
                <div className="text-sm text-text-primary font-medium">
                  {feedback.customerIdentifier || 'Anonymous'}
                </div>
              </td>
              <td className="py-3.5 px-4">
                <FeedbackStatusBadge status={feedback.status} />
              </td>
              <td className="py-3.5 px-4 max-w-xs">
                <FeedbackContentPreview content={feedback.content} maxLength={60} />
              </td>
              <td className="py-3.5 px-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  {feedback.status !== 'PROCESSED' && (
                    <button
                      onClick={() => onReprocess?.(feedback.id)}
                      disabled={reprocessingId === feedback.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-success-600 hover:text-success-700 hover:bg-success-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-success-200"
                      title="Reprocess feedback"
                    >
                      <Play size={14} />
                      {reprocessingId === feedback.id ? 'Processing...' : 'Process'}
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/feedback/${feedback.id}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all duration-200 border border-transparent hover:border-primary-200"
                    title="View details"
                  >
                    <Eye size={14} />
                    View
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
