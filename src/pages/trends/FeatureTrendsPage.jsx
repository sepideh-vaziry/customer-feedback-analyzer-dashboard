import { useState, useEffect, useCallback, useMemo } from 'react';
import { RefreshCw, AlertTriangle, TrendingUp, TrendingDown, Search, Lightbulb } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import TrendImpactCard from '../../components/trends/TrendImpactCard';
import TrendDetailsDrawer from '../../components/trends/TrendDetailsDrawer';
import TrendGrowthChart from '../../components/trends/TrendGrowthChart';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getLatestTrends, getDashboardTrends } from '../../services/trendService';

export default function FeatureTrendsPage() {
  const [window, setWindow] = useState('LAST_30_DAYS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trends, setTrends] = useState([]);
  const [dashboardTrends, setDashboardTrends] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedTrend, setSelectedTrend] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [latestData, trendsData] = await Promise.allSettled([
        getLatestTrends(),
        getDashboardTrends(window),
      ]);

      if (latestData.status === 'fulfilled') {
        const all = latestData.value?.entries || [];
        setTrends(all.filter((e) => e.type === 'EMERGING_TOPIC'));
      }
      if (trendsData.status === 'fulfilled') setDashboardTrends(trendsData.value);
    } catch (err) {
      setError('Failed to load feature trends.');
    } finally {
      setLoading(false);
    }
  }, [window]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    return trends.filter((t) =>
      t.subject?.toLowerCase().includes(search.toLowerCase())
    );
  }, [trends, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => (b.changeRatio || 0) - (a.changeRatio || 0));
  }, [filtered]);

  const featureChartData = useMemo(() => {
    if (!dashboardTrends?.feedbackVolume?.labels) return [];
    return dashboardTrends.feedbackVolume.labels.map((label, i) => ({
      label,
      value: dashboardTrends.feedbackVolume.values[i] || 0,
    }));
  }, [dashboardTrends]);

  const totalMentions = useMemo(() => {
    return trends.reduce((sum, t) => sum + (t.currentCount || 0), 0);
  }, [trends]);

  const avgGrowth = useMemo(() => {
    if (trends.length === 0) return 0;
    const sum = trends.reduce((acc, t) => acc + (t.changeRatio || 0), 0);
    return Math.round((sum / trends.length) * 100);
  }, [trends]);

  return (
    <DashboardLayout>
      <PageHeader
        title="Feature Request Trends"
        description="Track which feature requests are gaining momentum"
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-bg-card rounded-xl border border-border p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={16} className="text-primary-500" />
            <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Emerging Topics</span>
          </div>
          <p className="text-2xl font-semibold text-text-primary">{trends.length}</p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-primary-500" />
            <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Total Mentions</span>
          </div>
          <p className="text-2xl font-semibold text-text-primary">{totalMentions}</p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-warning-500" />
            <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Avg Growth</span>
          </div>
          <p className={`text-2xl font-semibold ${avgGrowth > 0 ? 'text-danger-600' : 'text-success-600'}`}>
            {avgGrowth > 0 ? '+' : ''}{avgGrowth}%
          </p>
        </div>
      </div>

      <div className="mb-6">
        <TrendGrowthChart
          data={featureChartData}
          loading={loading}
        />
      </div>

      <div className="mb-4 relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search feature trends..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        />
      </div>

      {loading && trends.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
          <EmptyState
            icon={Lightbulb}
            title="No feature trends"
            description="Feature request trends will appear as new topics emerge in your feedback."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sorted.map((trend, i) => (
            <TrendImpactCard
              key={i}
              trend={trend}
              onClick={() => setSelectedTrend(trend)}
            />
          ))}
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
