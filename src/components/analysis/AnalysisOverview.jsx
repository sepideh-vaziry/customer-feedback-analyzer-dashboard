import { Brain, Frown, Lightbulb, ShieldAlert, FileText } from 'lucide-react';
import SentimentCard from './SentimentCard';
import SummaryCard from './SummaryCard';
import ComplaintCard from './ComplaintCard';
import FeatureRequestCard from './FeatureRequestCard';
import ChurnRiskCard from './ChurnRiskCard';
import AnalysisStatusBadge from './AnalysisStatusBadge';

export default function AnalysisOverview({
  analysis,
  complaints,
  featureRequests,
  churnRisk,
  processing,
  feedbackStatus,
}) {
  const isProcessing = processing || feedbackStatus === 'PROCESSING' || feedbackStatus === 'PENDING';

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className="flex items-center justify-between bg-bg-card rounded-xl border border-border p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
            <Brain size={16} className="text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">AI Analysis Status</p>
            <p className="text-xs text-text-muted">
              {isProcessing
                ? 'Analysis is running. Results will appear automatically.'
                : analysis
                  ? 'Analysis completed'
                  : 'Analysis not started'}
            </p>
          </div>
        </div>
        <AnalysisStatusBadge status={feedbackStatus || 'PENDING'} pulse={isProcessing} />
      </div>

      {/* Sentiment */}
      <SentimentCard
        sentiment={analysis?.sentiment}
        confidence={analysis?.sentimentConfidence}
        reasoning={analysis?.sentimentReasoning}
      />

      {/* AI Summary */}
      <SummaryCard
        summary={analysis?.summaryText}
        model={analysis?.summaryModel}
        analyzedAt={analysis?.sentimentAnalyzedAt}
      />

      {/* Complaints & Feature Requests Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComplaintCard complaints={complaints} />
        <FeatureRequestCard featureRequests={featureRequests} />
      </div>

      {/* Churn Risk */}
      <ChurnRiskCard risk={churnRisk} />
    </div>
  );
}
