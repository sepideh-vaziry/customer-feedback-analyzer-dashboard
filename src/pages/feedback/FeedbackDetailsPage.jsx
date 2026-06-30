import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  Info,
  Brain,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import FeedbackDetailsCard from '../../components/feedback/FeedbackDetailsCard';
import AnalysisOverview from '../../components/analysis/AnalysisOverview';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import {
  getFeedbackDetails,
} from '../../services/feedbackManagementService';
import {
  getFeedbackAnalysis,
  getFeedbackComplaints,
  getFeedbackFeatureRequests,
  getChurnRiskForCustomer,
  reanalyzeFeedback,
} from '../../services/analysisService';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Info },
  { id: 'analysis', label: 'Analysis', icon: Brain },
];

export default function FeedbackDetailsPage() {
  const { feedbackId } = useParams();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [complaints, setComplaints] = useState(null);
  const [featureRequests, setFeatureRequests] = useState(null);
  const [churnRisk, setChurnRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [reanalyzing, setReanalyzing] = useState(false);
  const refreshIntervalRef = useRef(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const feedbackData = await getFeedbackDetails(feedbackId);
      setFeedback(feedbackData);

      // Load analysis-related data in parallel
      const [
        analysisResult,
        complaintsResult,
        featureRequestsResult,
      ] = await Promise.allSettled([
        getFeedbackAnalysis(feedbackId),
        getFeedbackComplaints(feedbackId),
        getFeedbackFeatureRequests(feedbackId),
      ]);

      if (analysisResult.status === 'fulfilled') {
        setAnalysis(analysisResult.value);
      }
      if (complaintsResult.status === 'fulfilled') {
        setComplaints(complaintsResult.value);
      }
      if (featureRequestsResult.status === 'fulfilled') {
        setFeatureRequests(featureRequestsResult.value);
      }

      // Load churn risk if customer identifier exists
      if (feedbackData?.customerIdentifier) {
        try {
          const churnData = await getChurnRiskForCustomer(feedbackData.customerIdentifier);
          setChurnRisk(churnData);
        } catch {
          // Churn risk may not be available — ignore
        }
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        setError('Feedback not found.');
      } else if (status === 403) {
        setError('You do not have permission to view this feedback.');
      } else {
        setError('Failed to load feedback details.');
      }
    } finally {
      setLoading(false);
    }
  }, [feedbackId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh while processing
  useEffect(() => {
    const isProcessing = feedback?.status === 'PROCESSING' || feedback?.status === 'PENDING';

    if (isProcessing) {
      refreshIntervalRef.current = setInterval(() => {
        getFeedbackDetails(feedbackId).then((data) => {
          setFeedback(data);
          if (data.status === 'PROCESSED' || data.status === 'FAILED') {
            // Reload analysis data when processing completes
            getFeedbackAnalysis(feedbackId).then(setAnalysis);
            getFeedbackComplaints(feedbackId).then(setComplaints);
            getFeedbackFeatureRequests(feedbackId).then(setFeatureRequests);
          }
        }).catch(() => {
          // ignore refresh errors
        });
      }, 5000);
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [feedback?.status, feedbackId]);

  const handleReanalyze = async () => {
    setReanalyzing(true);
    try {
      const newAnalysis = await reanalyzeFeedback(feedbackId);
      setAnalysis(newAnalysis);
      // Also refresh complaints and feature requests after reanalysis
      try {
        const [newComplaints, newFeatures] = await Promise.all([
          getFeedbackComplaints(feedbackId),
          getFeedbackFeatureRequests(feedbackId),
        ]);
        setComplaints(newComplaints);
        setFeatureRequests(newFeatures);
      } catch {
        // ignore secondary refresh errors
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reanalyze feedback.');
    } finally {
      setReanalyzing(false);
    }
  };

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
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary-600 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl hover:from-primary-100 hover:to-primary-200 transition-all border border-primary-200 shadow-sm"
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

  return (
    <DashboardLayout>
      <PageHeader
        title="Feedback Details"
        description="View detailed information and AI analysis"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={handleReanalyze}
            disabled={reanalyzing}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary-700 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl hover:from-primary-100 hover:to-primary-200 transition-all border border-primary-200 shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={16} className={reanalyzing ? 'animate-spin' : ''} />
            {reanalyzing ? 'Analyzing...' : 'Reanalyze'}
          </button>
          <button
            onClick={() => navigate('/feedback')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-text-secondary hover:text-text-primary bg-bg-card border border-border rounded-xl hover:border-primary-300 transition-all duration-200 shadow-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </PageHeader>

      {/* Tabs */}
      <div className="mb-6 border-b border-border">
        <div className="flex gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-text-muted hover:text-text-secondary'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="max-w-3xl">
          <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <FeedbackDetailsCard feedback={feedback} />
          </div>
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="max-w-4xl">
          <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <AnalysisOverview
              analysis={analysis}
              complaints={complaints}
              featureRequests={featureRequests}
              churnRisk={churnRisk}
              processing={reanalyzing}
              feedbackStatus={feedback?.status}
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
