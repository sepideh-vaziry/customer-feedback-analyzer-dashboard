import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AlertCircle,
  Brain,
  Frown,
  Lightbulb,
  Zap,
  ShieldAlert,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import FeedbackDetailsCard from '../../components/feedback/FeedbackDetailsCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import {
  getFeedbackDetails,
  getFeedbackAnalysis,
  reanalyzeFeedback,
} from '../../services/feedbackManagementService';

const sentimentConfig = {
  POSITIVE: { color: 'text-success-600', bg: 'bg-success-50', icon: Zap },
  NEGATIVE: { color: 'text-danger-600', bg: 'bg-danger-50', icon: Frown },
  NEUTRAL: { color: 'text-warning-600', bg: 'bg-warning-50', icon: MessageSquare },
  MIXED: { color: 'text-primary-600', bg: 'bg-primary-50', icon: MessageSquare },
};

export default function FeedbackDetailsPage() {
  const { feedbackId } = useParams();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reanalyzing, setReanalyzing] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [feedbackData, analysisData] = await Promise.allSettled([
        getFeedbackDetails(feedbackId),
        getFeedbackAnalysis(feedbackId),
      ]);

      if (feedbackData.status === 'fulfilled') {
        setFeedback(feedbackData.value);
      } else {
        const status = feedbackData.reason?.response?.status;
        if (status === 404) {
          setError('Feedback not found.');
        } else if (status === 403) {
          setError('You do not have permission to view this feedback.');
        } else {
          setError('Failed to load feedback details.');
        }
        setLoading(false);
        return;
      }

      if (analysisData.status === 'fulfilled') {
        setAnalysis(analysisData.value);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [feedbackId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleReanalyze = async () => {
    setReanalyzing(true);
    try {
      const newAnalysis = await reanalyzeFeedback(feedbackId);
      setAnalysis(newAnalysis);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reanalyze feedback.');
    } finally {
      setReanalyzing(false);
    }
  };

  const aiSections = [
    { label: 'Sentiment', icon: Brain },
    { label: 'Summary', icon: MessageSquare },
    { label: 'Complaints', icon: Frown },
    { label: 'Feature Requests', icon: Lightbulb },
    { label: 'Churn Risk', icon: ShieldAlert },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24">
          <EmptyState
            icon={AlertCircle}
            title={error}
            description=""
            action={
              <button
                onClick={() => navigate('/feedback')}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Feedback List
              </button>
            }
          />
        </div>
      </DashboardLayout>
    );
  }

  const sentiment = analysis?.sentiment;
  const sentimentMeta = sentimentConfig[sentiment] || sentimentConfig.NEUTRAL;
  const SentimentIcon = sentimentMeta.icon;

  return (
    <DashboardLayout>
      <PageHeader
        title="Feedback Details"
        description="View detailed information and AI analysis"
      >
        <button
          onClick={() => navigate('/feedback')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary bg-bg-card border border-border rounded-lg hover:border-primary-300 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <FeedbackDetailsCard feedback={feedback} />
        </div>

        <div className="space-y-6">
          {/* AI Analysis Summary Card */}
          <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Brain size={16} className="text-primary-600" />
                </div>
                <h3 className="text-base font-semibold text-text-primary">AI Analysis</h3>
              </div>
              <button
                onClick={handleReanalyze}
                disabled={reanalyzing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors disabled:opacity-50"
                title="Reanalyze feedback"
              >
                <RefreshCw size={14} className={reanalyzing ? 'animate-spin' : ''} />
                {reanalyzing ? 'Analyzing...' : 'Reanalyze'}
              </button>
            </div>

            {analysis ? (
              <div className="space-y-4">
                {sentiment && (
                  <div className={`p-3 rounded-lg ${sentimentMeta.bg} flex items-center gap-3`}>
                    <SentimentIcon size={18} className={sentimentMeta.color} />
                    <div>
                      <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
                        Sentiment
                      </p>
                      <p className={`text-sm font-semibold ${sentimentMeta.color}`}>
                        {sentiment}
                        {analysis.sentimentConfidence && (
                          <span className="ml-2 text-xs font-normal text-text-muted">
                            {(analysis.sentimentConfidence * 100).toFixed(1)}% confidence
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {analysis.summaryText && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
                      Summary
                    </p>
                    <p className="text-sm text-text-primary leading-relaxed">
                      {analysis.summaryText}
                    </p>
                  </div>
                )}

                {analysis.sentimentReasoning && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
                      Reasoning
                    </p>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {analysis.sentimentReasoning}
                    </p>
                  </div>
                )}

                {analysis.summaryModel && (
                  <p className="text-xs text-text-muted">
                    Model: {analysis.summaryModel}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Brain size={24} className="text-text-muted mx-auto mb-2" />
                <p className="text-sm text-text-muted">Analysis not available yet</p>
              </div>
            )}
          </div>

          {/* Future AI Features Placeholder */}
          <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-warning-50 flex items-center justify-center">
                <Lightbulb size={16} className="text-warning-600" />
              </div>
              <h3 className="text-base font-semibold text-text-primary">Upcoming Insights</h3>
            </div>

            <div className="space-y-3">
              {aiSections.map((section) => {
                const Icon = section.icon;
                const hasData =
                  section.label === 'Sentiment'
                    ? !!analysis?.sentiment
                    : false;

                return (
                  <div
                    key={section.label}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      hasData
                        ? 'border-success-200 bg-success-50'
                        : 'border-border-light bg-bg-base'
                    }`}
                  >
                    <Icon
                      size={16}
                      className={hasData ? 'text-success-600' : 'text-text-muted'}
                    />
                    <span
                      className={`text-sm ${
                        hasData ? 'text-success-700 font-medium' : 'text-text-muted'
                      }`}
                    >
                      {section.label}
                    </span>
                    {hasData && (
                      <span className="ml-auto text-xs text-success-600 font-medium">
                        Available
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
