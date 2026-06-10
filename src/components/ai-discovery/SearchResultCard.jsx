import { useNavigate } from 'react-router-dom';
import { MessageSquare, Calendar, Tag, ExternalLink } from 'lucide-react';
import SimilarityBadge from './SimilarityBadge';

const sentimentColors = {
  POSITIVE: 'text-success-600 bg-success-50 border-success-200',
  NEGATIVE: 'text-danger-600 bg-danger-50 border-danger-200',
  NEUTRAL: 'text-text-secondary bg-bg-base border-border',
  MIXED: 'text-warning-600 bg-warning-50 border-warning-200',
};

export default function SearchResultCard({ result, onClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(result);
    } else if (result.feedbackId) {
      navigate(`/feedback/${result.feedbackId}`);
    }
  };

  const sentiment = result.sentiment || 'NEUTRAL';
  const sentimentClass = sentimentColors[sentiment] || sentimentColors.NEUTRAL;

  return (
    <div
      onClick={handleClick}
      className="p-4 rounded-xl bg-bg-card border border-border hover:border-primary-300 transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <MessageSquare size={14} className="text-primary-500" />
          <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
            {result.source || 'Feedback'}
          </span>
        </div>
        <SimilarityBadge score={result.similarity} />
      </div>

      <p className="text-sm text-text-primary leading-relaxed mb-3 line-clamp-3">
        {result.summaryText || result.content || 'No content available'}
      </p>

      <div className="flex items-center flex-wrap gap-2">
        {result.sentiment && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${sentimentClass}`}>
            {sentiment}
          </span>
        )}
        {result.complaintCategories?.map((cat, i) => (
          <span key={i} className="text-xs font-medium px-2 py-0.5 rounded-full bg-danger-50 text-danger-700 border border-danger-200">
            {cat}
          </span>
        ))}
        {result.createdAt && (
          <span className="text-xs text-text-muted flex items-center gap-1 ml-auto">
            <Calendar size={12} />
            {new Date(result.createdAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
