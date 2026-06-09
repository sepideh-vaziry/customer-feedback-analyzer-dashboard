import { useState, useEffect, useCallback, useMemo } from 'react';
import { RefreshCw, AlertTriangle, Search, TrendingUp, TrendingDown, Activity, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import TrendImpactCard from '../../components/trends/TrendImpactCard';
import TrendDetailsDrawer from '../../components/trends/TrendDetailsDrawer';
import TrendStatusBadge from '../../components/trends/TrendStatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getLatestTrends, getDashboardTrends } from '../../services/trendService';

export default function TrendExplorerPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trends, setTrends] = useState([]);
  const [dashboardTrends, setDashboardTrends] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [selectedTrend, setSelectedTrend] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [latestData, trendsData] = await Promise.allSettled([
        getLatestTrends(),
        getDashboardTrends('LAST_30_DAYS'),
      ]);

      if (latestData.status === 'fulfilled') setTrends(latestData.value?.entries || []);
      if (trendsData.status === 'fulfilled') setDashboardTrends(trendsData.value);
    } catch (err) {
      setError('Failed to load trend data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    return trends.filter((t) => {
      const matchesSearch = t.subject?.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === 'ALL' || t.type === filterType;
      const matchesSeverity = filterSeverity === 'ALL' || t.severity === filterSeverity;
      return matchesSearch && matchesType && matchesSeverity;
    });
  }, [trends, search, filterType, filterSeverity]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => (b.changeRatio || 0) - (a.changeRatio || 0));
  }, [filtered]);

  return (
    <DashboardLayout>
      <PageHeader
        title="Trend Explorer"
        description="Inspect and analyze specific trends across feedback"
      >
        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary bg-bg-card border border-border rounded-lg hover:border-primary-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </PageHeader>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-danger-50 border border-danger-200 text-sm text-danger-700 flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trends..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 text-sm bg-bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="ALL">All Types</option>
          <option value="COMPLAINT_SPIKE">Complaint Spike</option>
          <option value="EMERGING_TOPIC">Emerging Topic</option>
          <option value="SENTIMENT_SHIFT">Sentiment Shift</option>
        </select>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="px-3 py-2 text-sm bg-bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {loading && trends.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
          <EmptyState
            icon={Activity}
            title="No trends found"
            description="Try adjusting your filters or check back after more feedback is analyzed."
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
