import { useState, useEffect, useCallback, useMemo } from 'react';
import { RefreshCw, AlertTriangle, TrendingUp, TrendingDown, Search, Lightbulb } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import TrendImpactCard from '../../components/trends/TrendImpactCard';
import TrendDetailsDrawer from '../../components/trends/TrendDetailsDrawer';
import TrendGrowthChart from '../../components/trends/TrendGrowthChart';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getEmergingTopics, getDashboardTrends } from '../../services/trendService';

const WINDOWS = [
  { value: 'LAST_7_DAYS', label: 'Last 7 Days' },
  { value: 'LAST_30_DAYS', label: 'Last 30 Days' },
  { value: 'LAST_90_DAYS', label: 'Last 90 Days' },
];

const SEVERITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export default function FeatureTrendsPage() {
  const [window, setWindow] = useState('LAST_30_DAYS');
  const [severity, setSeverity] = useState([]);
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
      const [trendsData, dashboardData] = await Promise.allSettled([
        getEmergingTopics({ window, severity }),
        getDashboardTrends(window),
      ]);
      if (trendsData.status === 'fulfilled') {
        const payload = trendsData.value;
        setTrends(payload?.entries || payload?.content || payload || []);
      }
      if (dashboardData.status === 'fulfilled') setDashboardTrends(dashboardData.value);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load feature trends.');
    } finally {
      setLoading(false);
    }
  }, [window, severity]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    if (!search.trim()) return trends;
    const q = search.toLowerCase();
    return trends.filter((t) => t.subject?.toLowerCase().includes(q));
  }, [trends, search]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => (b.changeRatio || 0) - (a.changeRatio || 0)),
    [filtered]
  );

  const featureChartData = useMemo(() => {
    if (dashboardTrends?.featureRequestTrend?.labels) {
      const labels = dashboardTrends.featureRequestTrend.labels;
      const series = dashboardTrends.featureRequestTrend.seriesByCluster || {};
      return labels.map((label, i) => {
        const point = { label };
        Object.entries(series).forEach(([cluster, values]) => {
          point[cluster] = values[i] || 0;
        });
        return point;
      });
    }
    if (!dashboardTrends?.feedbackVolume?.labels) return [];
    return dashboardTrends.feedbackVolume.labels.map((label, i) => ({
      label,
      value: dashboardTrends.feedbackVolume.values[i] || 0,
    }));
  }, [dashboardTrends]);

  const totalMentions = useMemo(
    () => trends.reduce((sum, t) => sum + (t.currentCount || 0), 0),
    [trends]
  );

  const avgGrowth = useMemo(() => {
    if (trends.length === 0) return 0;
    const sum = trends.reduce((acc, t) => acc + (t.changeRatio || 0), 0);
    return Math.round((sum / trends.length) * 100);
  }, [trends]);

  const toggleSeverity = (value) => {
    setSeverity((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

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
            className="px-3 py-2.5 text-sm bg-bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          >
            {WINDOWS.map((w) => (
              <option key={w.value} value={w.value}>{w.label}</option>
            ))}
          </select>
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

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-200 text-sm text-danger-700 flex items-center gap-2 font-medium">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <div className="bg-bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center shadow-sm">
              <Lightbulb size={14} className="text-primary-600" />
            </div>
            <span className="text-xs font-bold text-text-muted uppercase tracking-wide">Emerging Topics</span>
          </div>
          <p className="text-2xl font-bold text-text-primary">{trends.length}</p>
        </div>
        <div className="bg-bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center shadow-sm">
              <TrendingUp size={14} className="text-primary-600" />
            </div>
            <span className="text-xs font-bold text-text-muted uppercase tracking-wide">Total Mentions</span>
          </div>
          <p className="text-2xl font-bold text-text-primary">{totalMentions}</p>
        </div>
        <div className="bg-bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-warning-50 to-warning-100 flex items-center justify-center shadow-sm">
              <TrendingUp size={14} className="text-warning-600" />
            </div>
            <span className="text-xs font-bold text-text-muted uppercase tracking-wide">Avg Growth</span>
          </div>
          <p className={`text-2xl font-bold ${avgGrowth > 0 ? 'text-danger-600' : 'text-success-600'}`}>
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

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search feature trends..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {SEVERITY_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => toggleSeverity(s)}
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                severity.includes(s)
                  ? 'bg-primary-50 border-primary-200 text-primary-700'
                  : 'bg-bg-card border-border text-text-secondary hover:border-primary-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading && trends.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <EmptyState
            icon={Lightbulb}
            title="No feature trends"
            description="Feature request trends will appear as new topics emerge in your feedback."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {sorted.map((trend) => (
            <TrendImpactCard
              key={trend.id || `${trend.subject}-${trend.detectedAt}`}
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