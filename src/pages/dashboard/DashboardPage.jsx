import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Lightbulb,
  ShieldAlert,
  Users,
  RefreshCw,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import KpiCard from '../../components/dashboard/KpiCard';
import DashboardFilters from '../../components/dashboard/DashboardFilters';
import SentimentWidget from '../../components/dashboard/SentimentWidget';
import SentimentTrendWidget from '../../components/dashboard/SentimentTrendWidget';
import ComplaintWidget from '../../components/dashboard/ComplaintWidget';
import FeatureRequestWidget from '../../components/dashboard/FeatureRequestWidget';
import ChurnRiskWidget from '../../components/dashboard/ChurnRiskWidget';
import TrendWidget from '../../components/dashboard/TrendWidget';
import ActivityWidget from '../../components/dashboard/ActivityWidget';
import {
  getDashboardKpis,
  getDashboardAnalytics,
  getDashboardTrends,
  getLatestTrends,
  getRecurringComplaints,
  getFeatureDemand,
  getHighRiskCustomers,
} from '../../services/dashboardService';

export default function DashboardPage() {
  const [window, setWindow] = useState('LAST_30_DAYS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [kpis, setKpis] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [trends, setTrends] = useState(null);
  const [latestTrends, setLatestTrends] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [featureRequests, setFeatureRequests] = useState([]);
  const [highRiskCustomers, setHighRiskCustomers] = useState([]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [
        kpiData,
        analyticsData,
        trendsData,
        latestTrendsData,
        complaintsData,
        featureData,
        churnData,
      ] = await Promise.allSettled([
        getDashboardKpis(window),
        getDashboardAnalytics(window),
        getDashboardTrends(window),
        getLatestTrends(),
        getRecurringComplaints(30, 8),
        getFeatureDemand(30, 8),
        getHighRiskCustomers(5),
      ]);

      if (kpiData.status === 'fulfilled') setKpis(kpiData.value?.metrics || []);
      if (analyticsData.status === 'fulfilled') setAnalytics(analyticsData.value);
      if (trendsData.status === 'fulfilled') setTrends(trendsData.value);
      if (latestTrendsData.status === 'fulfilled') setLatestTrends(latestTrendsData.value);
      if (complaintsData.status === 'fulfilled') setComplaints(complaintsData.value || []);
      if (featureData.status === 'fulfilled') setFeatureRequests(featureData.value || []);
      if (churnData.status === 'fulfilled') setHighRiskCustomers(churnData.value || []);
    } catch (err) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [window]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const kpiCards = useMemo(() => {
    const iconMap = {
      totalFeedback: MessageSquare,
      positiveFeedback: ThumbsUp,
      negativeFeedback: ThumbsDown,
      featureRequests: Lightbulb,
      recurringComplaints: AlertCircle,
      highRiskCustomers: ShieldAlert,
      analyzedFeedback: Users,
      analysisCoverage: Users,
      netSentiment: ThumbsUp,
    };

    return kpis.map((kpi) => ({
      title: kpi.label || kpi.key,
      value: kpi.value,
      unit: kpi.unit,
      changePercent: kpi.changePercent,
      trend: kpi.trend,
      icon: iconMap[kpi.key] || MessageSquare,
    }));
  }, [kpis]);

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        description="Overview of your customer feedback and AI insights"
      >
        <div className="flex items-center gap-2">
          <DashboardFilters window={window} onChange={setWindow} />
          <button
            onClick={loadDashboard}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-border-light text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </PageHeader>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-danger-50 border border-danger-200 text-sm text-danger-700 flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiCards.length > 0 ? (
          kpiCards.map((kpi, index) => (
            <KpiCard key={index} {...kpi} loading={loading} />
          ))
        ) : (
          <>
            <KpiCard title="Total Feedback" value={analytics?.totalFeedback?.toString() || '0'} icon={MessageSquare} loading={loading} />
            <KpiCard title="Analyzed" value={analytics?.analyzedFeedback?.toString() || '0'} icon={Users} loading={loading} />
            <KpiCard title="Coverage" value={`${Math.round(analytics?.analysisCoveragePercent || 0)}`} unit="%" icon={ThumbsUp} loading={loading} />
            <KpiCard title="Net Sentiment" value={`${Math.round(analytics?.sentimentBreakdown?.netSentimentScore || 0)}`} icon={ThumbsUp} loading={loading} />
          </>
        )}
      </div>

      {/* Sentiment Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SentimentTrendWidget data={trends?.sentimentTrend} loading={loading} />
        <SentimentWidget data={analytics?.sentimentBreakdown} loading={loading} />
      </div>

      {/* Complaints & Feature Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ComplaintWidget data={complaints} loading={loading} />
        <FeatureRequestWidget data={featureRequests} loading={loading} />
      </div>

      {/* Churn Risk & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChurnRiskWidget
          breakdown={analytics?.churnRiskBreakdown}
          highRiskCustomers={highRiskCustomers}
          loading={loading}
        />
        <TrendWidget data={latestTrends} loading={loading} />
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityWidget loading={loading} />
        </div>
        <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
          <h3 className="text-base font-semibold text-text-primary mb-4">Feedback by Source</h3>
          {analytics?.feedbackBySource?.length > 0 ? (
            <div className="space-y-3">
              {analytics.feedbackBySource.map((source) => (
                <div key={source.source} className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">{source.source}</span>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-24 bg-bg-base rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: `${source.percent || 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-text-primary w-10 text-right">
                      {source.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted text-center py-8">No source data available</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
