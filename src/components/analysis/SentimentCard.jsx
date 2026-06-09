import { Zap, Frown, MessageSquare, Minus } from 'lucide-react';

const sentimentConfig = {
  POSITIVE: {
    label: 'Positive',
    color: 'text-success-600',
    bg: 'bg-success-50',
    border: 'border-success-200',
    bar: 'bg-success-500',
    icon: Zap,
  },
  NEGATIVE: {
    label: 'Negative',
    color: 'text-danger-600',
    bg: 'bg-danger-50',
    border: 'border-danger-200',
    bar: 'bg-danger-500',
    icon: Frown,
  },
  NEUTRAL: {
    label: 'Neutral',
    color: 'text-warning-600',
    bg: 'bg-warning-50',
    border: 'border-warning-200',
    bar: 'bg-warning-500',
    icon: MessageSquare,
  },
  MIXED: {
    label: 'Mixed',
    color: 'text-primary-600',
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    bar: 'bg-primary-500',
    icon: MessageSquare,
  },
};

export default function SentimentCard({ sentiment, confidence, reasoning }) {
  const config = sentimentConfig[sentiment] || {
    label: 'Unknown',
    color: 'text-text-muted',
    bg: 'bg-bg-base',
    border: 'border-border',
    bar: 'bg-text-muted',
    icon: Minus,
  };

  const Icon = config.icon;
  const confidencePercent = confidence != null ? Math.round(confidence * 100) : null;

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} p-6`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center shadow-sm`}>
            <Icon size={20} className={config.color} />
          </div>
          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Sentiment</p>
            <p className={`text-2xl font-semibold ${config.color}`}>{config.label}</p>
          </div>
        </div>

        {confidencePercent != null && (
          <div className="text-right">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Confidence</p>
            <p className="text-2xl font-semibold text-text-primary">{confidencePercent}%</p>
          </div>
        )}
      </div>

      {confidencePercent != null && (
        <div className="mt-4">
          <div className="h-2 w-full bg-white/60 rounded-full overflow-hidden">
            <div
              className={`h-full ${config.bar} transition-all duration-500`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
        </div>
      )}

      {reasoning && (
        <div className="mt-4 pt-4 border-t border-black/5">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-1">Reasoning</p>
          <p className="text-sm text-text-secondary leading-relaxed">{reasoning}</p>
        </div>
      )}
    </div>
  );
}
