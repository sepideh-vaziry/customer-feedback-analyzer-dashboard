import { useState, useEffect, useCallback, useMemo } from 'react';
import { RefreshCw, AlertTriangle, TrendingUp, TrendingDown, Search } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import TrendImpactCard from '../../components/trends/TrendImpactCard';
import TrendDetailsDrawer from '../../components/trends/TrendDetailsDrawer';
import TrendGrowthChart from '../../components/trends/TrendGrowthChart';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getComplaintTrends, getDashboardTrends } from '../../services/trendService';

const WINDOWS = [
  { value: 'LAST_7_DAYS', label: 'Last 7 Days' },
  { value: 'LAST_30_DAYS', label: 'Last 30 Days' },
  { value: 'LAST_90_DAYS', label: 'Last 90 Days' },
];

const SEVERITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export default function ComplaintTrendsPage() {
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
        getComplaintTrends({ window, severity }),
        getDashboardTrends(window),
      ]);
      if (trendsData.status === 'fulfilled') {
        const payload = trendsData.value;
        setTrends(payload?.entries || payload?.content || payload || []);
      }
      if (dashboardData.status === 'fulfilled') setDashboardTrends(dashboardData.value);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load complaint trends.');
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

  const complaintChartData = useMemo(() => {
    if (!dashboardTrends?.complaintTrend?.labels) return [];
    const labels = dashboardTrends.complaintTrend.labels;
    const series = dashboardTrends.complaintTrend.seriesByCategory || {};
    return labels.map((label, i) => {
      const point = { label };
      Object.entries(series).forEach(([category, values]) => {
        point[category] = values[i] || 0;
      });
      return point;
    });
  }, [dashboardTrends]);

  const totalComplaints = useMemo(
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
        title="Complaint Trends"
        description="Track how complaints are growing over time"
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
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-danger-50 to-danger-100 flex items-center justify-center shadow-sm">
              <AlertTriangle size={14} className="text-danger-600" />
            </div>
            <span className="text-xs font-bold text-text-muted uppercase tracking-wide">Complaint Spikes</span>
          </div>
          <p className="text-2xl font-bold text-text-primary">{trends.length}</p>
        </div>
        <div className="bg-bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center shadow-sm">
              <TrendingUp size={14} className="text-primary-600" />
            </div>
            <span className="text-xs font-bold text-text-muted uppercase tracking-wide">Total Occurrences</span>
          </div>
          <p className="text-2xl font-bold text-text-primary">{totalComplaints}</p>
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
          data={complaintChartData}
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
            placeholder="Search complaint trends..."
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
            icon={AlertTriangle}
            title="No complaint trends"
            description="Complaint trends will appear as patterns are detected in your feedback."
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