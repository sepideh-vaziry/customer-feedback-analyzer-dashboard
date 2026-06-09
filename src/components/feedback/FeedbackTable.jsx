import { useNavigate } from 'react-router-dom';
import { Eye, ArrowUpDown } from 'lucide-react';
import FeedbackStatusBadge from './FeedbackStatusBadge';
import FeedbackContentPreview from './FeedbackContentPreview';
import EmptyState from '../ui/EmptyState';
import LoadingSpinner from '../ui/LoadingSpinner';
import { MessageSquare } from 'lucide-react';

export default function FeedbackTable({ feedbacks, loading, sortConfig, onSort }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
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
      className="flex items-center gap-1 hover:text-text-primary transition-colors"
    >
      {children}
      <ArrowUpDown size={14} className="text-text-muted" />
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
            <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
              <SortHeader column="createdAt">Created</SortHeader>
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
              <SortHeader column="source">Source</SortHeader>
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
              Customer
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
              Status
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
              Content
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-light">
          {feedbacks.map((feedback) => (
            <tr
              key={feedback.id}
              className="hover:bg-bg-base transition-colors group"
            >
              <td className="py-3 px-4 text-sm text-text-secondary whitespace-nowrap">
                {formatDate(feedback.createdAt)}
              </td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-bg-base text-text-secondary border border-border">
                  {feedback.source}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm text-text-primary">
                  {feedback.customerIdentifier || 'Anonymous'}
                </div>
              </td>
              <td className="py-3 px-4">
                <FeedbackStatusBadge status={feedback.status} />
              </td>
              <td className="py-3 px-4 max-w-xs">
                <FeedbackContentPreview content={feedback.content} maxLength={60} />
              </td>
              <td className="py-3 px-4 text-right">
                <button
                  onClick={() => navigate(`/feedback/${feedback.id}`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors"
                  title="View details"
                >
                  <Eye size={14} />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
