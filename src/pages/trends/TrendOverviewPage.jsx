import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  RefreshCw,
  AlertTriangle,
  Activity,
  TrendingUp,
  Zap,
  Lightbulb,
  Play,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import TrendKpiCard from '../../components/trends/TrendKpiCard';
import TrendImpactCard from '../../components/trends/TrendImpactCard';
import TrendDetailsDrawer from '../../components/trends/TrendDetailsDrawer';
import TrendGrowthChart from '../../components/trends/TrendGrowthChart';
import TrendVelocityChart from '../../components/trends/TrendVelocityChart';
import EmptyState from '../../components/ui/EmptyState';
import {
  getLatestTrends,
  getDashboardTrends,
  getDashboardKpis,
} from '../../services/trendService';
import { useTrendDetection } from '../../hooks/useTrendDetection';

const WINDOWS = [
  { value: 'LAST_7_DAYS', label: 'Last 7 Days' },
  { value: 'LAST_30_DAYS', label: 'Last 30 Days' },
  { value: 'LAST_90_DAYS', label: 'Last 90 Days' },
];

function pickKpiValue(kpis, key) {
  if (!kpis) return null;
  const metrics = kpis.metrics || kpis.kpis || kpis;
  if (!Array.isArray(metrics)) return null;
  const item = metrics.find((m) => m.key === key || m.name === key);
  return item?.value ?? item?.count ?? null;
}

export default function TrendOverviewPage() {
  const [window, setWindow] = useState('LAST_30_DAYS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trendsSnapshot, setTrendsSnapshot] = useState(null);
  const [dashboardTrends, setDashboardTrends] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [selectedTrend, setSelectedTrend] = useState(null);
  const [detectTrigger, setDetectTrigger] = useState(0);

  const detection = useTrendDetection();

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [latestData, trendsData, kpisData] = await Promise.allSettled([
        getLatestTrends({ size: 100 }),
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

  useEffect(() => {
    if (detection.job?.status === 'COMPLETED') {
      loadData();
    }
  }, [detection.job?.status]);

  const handleDetect = async () => {
    const days = window === 'LAST_7_DAYS' ? 7 : window === 'LAST_90_DAYS' ? 90 : 30;
    await detection.start(days);
    setDetectTrigger((n) => n + 1);
  };

  useEffect(() => {
    if (detectTrigger > 0) loadData();
  }, [detectTrigger]);

  const entries = useMemo(
    () => trendsSnapshot?.entries || trendsSnapshot?.content || [],
    [trendsSnapshot]
  );

  const complaintSpikes = useMemo(
    () => entries.filter((e) => e.type === 'COMPLAINT_SPIKE'),
    [entries]
  );
  const emergingTopics = useMemo(
    () => entries.filter((e) => e.type === 'EMERGING_TOPIC'),
    [entries]
  );
  const sentimentShifts = useMemo(
    () => entries.filter((e) => e.type === 'SENTIMENT_SHIFT'),
    [entries]
  );
  const criticalTrends = useMemo(
    () => entries.filter((e) => e.severity === 'CRITICAL' || e.severity === 'HIGH'),
    [entries]
  );

  const activeTrends = pickKpiValue(kpis, 'activeTrends');
  const criticalKpi = pickKpiValue(kpis, 'criticalTrends');
  const emergingKpi = pickKpiValue(kpis, 'emergingTopics');
  const spikesKpi = pickKpiValue(kpis, 'complaintSpikes');
  const velocity = pickKpiValue(kpis, 'trendVelocity');
  const newVsLastWindow = pickKpiValue(kpis, 'newVsLastWindow');

  const activeTrendsValue = activeTrends != null ? activeTrends : entries.length;
  const criticalValue = criticalKpi != null ? criticalKpi : criticalTrends.length;
  const emergingValue = emergingKpi != null ? emergingKpi : emergingTopics.length;
  const spikesValue = spikesKpi != null ? spikesKpi : complaintSpikes.length;

  const growthChartData = useMemo(() => {
    if (!dashboardTrends?.feedbackVolume?.labels) return [];
    return dashboardTrends.feedbackVolume.labels.map((label, i) => ({
      label,
      value: dashboardTrends.feedbackVolume.values[i] || 0,
    }));
  }, [dashboardTrends]);

  const velocityData = useMemo(() => {
    return criticalTrends.slice(0, 8).map((t) => ({
      label: t.subject?.length > 18 ? `${t.subject.slice(0, 16)}…` : t.subject,
      value: Math.abs(Math.round((t.changeRatio || 0) * 100)),
      severity: t.severity,
    }));
  }, [criticalTrends]);

  const detectionRunning = detection.loading || (detection.job && !['COMPLETED', 'FAILED'].includes(detection.job.status));
  const detectionProgress = detection.job?.progress;

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
            className="px-3 py-2.5 text-sm bg-bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          >
            {WINDOWS.map((w) => (
              <option key={w.value} value={w.value}>{w.label}</option>
            ))}
          </select>
          <button
            onClick={handleDetect}
            disabled={detectionRunning}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary-700 bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-xl hover:border-primary-300 transition-all duration-200 disabled:opacity-50 shadow-sm"
          >
            <Play size={16} className={detectionRunning ? 'animate-pulse' : ''} />
            {detectionRunning ? `Detecting${detectionProgress != null ? ` ${detectionProgress}%` : '...'}` : 'Detect Now'}
          </button>
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-text-secondary hover:text-text-primary bg-bg-card border border-border rounded-xl hover:border-primary-300 transition-all duration-200 disabled:opacity-50 shadow-sm"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </PageHeader>

      {(error || detection.error) && (
        <div className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-200 text-sm text-danger-700 flex items-center gap-2 font-medium">
          <AlertTriangle size={16} />
          {detection.error || error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <TrendKpiCard
          title="Active Trends"
          value={activeTrendsValue.toString()}
          changePercent={velocity != null ? Math.round(velocity) : null}
          icon={Activity}
          loading={loading}
        />
        <TrendKpiCard
          title="Critical Trends"
          value={criticalValue.toString()}
          changePercent={newVsLastWindow != null ? Math.round(newVsLastWindow) : null}
          icon={Zap}
          loading={loading}
        />
        <TrendKpiCard
          title="Emerging Topics"
          value={emergingValue.toString()}
          icon={Lightbulb}
          loading={loading}
        />
        <TrendKpiCard
          title="Complaint Spikes"
          value={spikesValue.toString()}
          icon={AlertTriangle}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <TrendGrowthChart data={growthChartData} loading={loading} />
        <TrendVelocityChart data={velocityData} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-text-primary">Critical & High Priority Trends</h3>
            <span className="text-xs font-semibold text-text-muted">{criticalTrends.length} items</span>
          </div>
          {criticalTrends.length === 0 ? (
            <EmptyState
              icon={Zap}
              title="No critical trends"
              description="Critical trends will appear as patterns emerge in your feedback."
            />
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {criticalTrends.map((trend) => (
                <TrendImpactCard
                  key={trend.id || `${trend.subject}-${trend.detectedAt}`}
                  trend={trend}
                  onClick={() => setSelectedTrend(trend)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-text-primary">Latest Emerging Topics</h3>
            <span className="text-xs font-semibold text-text-muted">{emergingTopics.length} items</span>
          </div>
          {emergingTopics.length === 0 ? (
            <EmptyState
              icon={Lightbulb}
              title="No emerging topics"
              description="Emerging topics will be detected as new themes appear in feedback."
            />
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {emergingTopics.map((trend) => (
                <TrendImpactCard
                  key={trend.id || `${trend.subject}-${trend.detectedAt}`}
                  trend={trend}
                  onClick={() => setSelectedTrend(trend)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {sentimentShifts.length > 0 && (
        <div className="mt-6 bg-bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-text-primary">Sentiment Shifts</h3>
            <span className="text-xs font-semibold text-text-muted">{sentimentShifts.length} items</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {sentimentShifts.slice(0, 6).map((trend) => (
              <TrendImpactCard
                key={trend.id || `${trend.subject}-${trend.detectedAt}`}
                trend={trend}
                onClick={() => setSelectedTrend(trend)}
              />
            ))}
          </div>
        </div>
      )}

      {selectedTrend && (
        <TrendDetailsDrawer
          trend={selectedTrend}
          onClose={() => setSelectedTrend(null)}
        />
      )}
    </DashboardLayout>
  );
}