import { useState, useEffect, useCallback, useMemo } from 'react';
import { RefreshCw, AlertTriangle, Activity, TrendingUp, Zap, Lightbulb } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import TrendKpiCard from '../../components/trends/TrendKpiCard';
import TrendImpactCard from '../../components/trends/TrendImpactCard';
import TrendDetailsDrawer from '../../components/trends/TrendDetailsDrawer';
import TrendGrowthChart from '../../components/trends/TrendGrowthChart';
import TrendVelocityChart from '../../components/trends/TrendVelocityChart';
import EmptyState from '../../components/ui/EmptyState';
import { getLatestTrends, getDashboardTrends, getDashboardKpis } from '../../services/trendService';

export default function TrendOverviewPage() {
  const [window, setWindow] = useState('LAST_30_DAYS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trendsSnapshot, setTrendsSnapshot] = useState(null);
  const [dashboardTrends, setDashboardTrends] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [selectedTrend, setSelectedTrend] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [latestData, trendsData, kpisData] = await Promise.allSettled([
        getLatestTrends(),
        getDashboardTrends(window),
        getDashboardKpis(window),
      ]);

      if (latestData.status === 'fulfilled') setTrendsSnapshot(latestData.value);
      if (trendsData.status === 'fulfilled') setDashboardTrends(trendsData.value);
      if (kpisData.status === 'fulfilled') setKpis(kpisData.value);
    } catch (err) {
      setError('Failed to load trend data.');
    } finally {
      setLoading(false);
    }
  }, [window]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const entries = trendsSnapshot?.entries || [];
  const complaintSpikes = entries.filter((e) => e.type === 'COMPLAINT_SPIKE');
  const emergingTopics = entries.filter((e) => e.type === 'EMERGING_TOPIC');
  const sentimentShifts = entries.filter((e) => e.type === 'SENTIMENT_SHIFT');
  const criticalTrends = entries.filter((e) => e.severity === 'CRITICAL' || e.severity === 'HIGH');

  const growthChartData = useMemo(() => {
    if (!dashboardTrends?.feedbackVolume?.labels) return [];
    return dashboardTrends.feedbackVolume.labels.map((label, i) => ({
      label,
      value: dashboardTrends.feedbackVolume.values[i] || 0,
    }));
  }, [dashboardTrends]);

  const velocityData = useMemo(() => {
    return criticalTrends.map((t) => ({
      label: t.subject,
      value: Math.abs(Math.round((t.changeRatio || 0) * 100)),
      severity: t.severity,
    }));
  }, [criticalTrends]);

  const totalFeedbackMetric = kpis?.metrics?.find((m) => m.key === 'totalFeedback');
  const analyzedFeedbackMetric = kpis?.metrics?.find((m) => m.key === 'analyzedFeedback');

  return (
    <DashboardLayout>
      <PageHeader
        title="Trend Intelligence"
        description="Identify emerging patterns across customer feedback"
      >
        <div className="flex items-center gap-2">
          <select
            value={window}
            onChange={(e) => setWindow(e.target.value)}
            className="px-3 py-2 text-sm bg-bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          >
            <option value="LAST_7_DAYS">Last 7 Days</option>
            <option value="LAST_30_DAYS">Last 30 Days</option>
            <option value="LAST_90_DAYS">Last 90 Days</option>
          </select>
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary bg-bg-card border border-border rounded-lg hover:border-primary-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </PageHeader>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-danger-50 border border-danger-200 text-sm text-danger-700 flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <TrendKpiCard
          title="Active Trends"
          value={entries.length.toString()}
          changePercent={criticalTrends.length > 0 ? criticalTrends.length : null}
          icon={Activity}
          loading={loading}
        />
        <TrendKpiCard
          title="Emerging Topics"
          value={emergingTopics.length.toString()}
          icon={Lightbulb}
          loading={loading}
        />
        <TrendKpiCard
          title="Complaint Spikes"
          value={complaintSpikes.length.toString()}
          icon={AlertTriangle}
          loading={loading}
        />
        <TrendKpiCard
          title="Sentiment Shifts"
          value={sentimentShifts.length.toString()}
          icon={TrendingUp}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TrendGrowthChart data={growthChartData} loading={loading} />
        <TrendVelocityChart data={velocityData} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-text-primary">Critical & High Priority Trends</h3>
            <span className="text-xs text-text-muted">{criticalTrends.length} items</span>
          </div>
          {criticalTrends.length === 0 ? (
            <EmptyState
              icon={Zap}
              title="No critical trends"
              description="Critical trends will appear as patterns emerge in your feedback."
            />
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {criticalTrends.map((trend, i) => (
                <TrendImpactCard
                  key={i}
                  trend={trend}
                  onClick={() => setSelectedTrend(trend)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-text-primary">Latest Emerging Topics</h3>
            <span className="text-xs text-text-muted">{emergingTopics.length} items</span>
          </div>
          {emergingTopics.length === 0 ? (
            <EmptyState
              icon={Lightbulb}
              title="No emerging topics"
              description="Emerging topics will be detected as new themes appear in feedback."
            />
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {emergingTopics.map((trend, i) => (
                <TrendImpactCard
                  key={i}
                  trend={trend}
                  onClick={() => setSelectedTrend(trend)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedTrend && (
        <TrendDetailsDrawer
          trend={selectedTrend}
          onClose={() => setSelectedTrend(null)}
        />
      )}
    </DashboardLayout>
  );
}
