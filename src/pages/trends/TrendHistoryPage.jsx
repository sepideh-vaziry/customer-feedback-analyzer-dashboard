import { useState, useEffect, useCallback, useMemo } from 'react';
import { RefreshCw, AlertTriangle, Search, Calendar, TrendingUp, TrendingDown, Minus, Activity, Play } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import TrendStatusBadge from '../../components/trends/TrendStatusBadge';
import TrendDetailsDrawer from '../../components/trends/TrendDetailsDrawer';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getLatestTrends, detectTrends } from '../../services/trendService';

function getTrendStatus(trend) {
  const ratio = trend.changeRatio || 0;
  if (ratio > 0.5) return 'GROWING';
  if (ratio > 0.1) return 'EMERGING';
  if (ratio > -0.1) return 'STABLE';
  if (ratio > -0.5) return 'DECLINING';
  return 'EXPIRED';
}

export default function TrendHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState('');
  const [trends, setTrends] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedTrend, setSelectedTrend] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getLatestTrends();
      setTrends(data?.entries || []);
    } catch (err) {
      setError('Failed to load trend history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDetect = async () => {
    setDetecting(true);
    try {
      await detectTrends();
      await loadData();
    } catch {
      setError('Failed to trigger trend detection.');
    } finally {
      setDetecting(false);
    }
  };

  const enrichedTrends = useMemo(() => {
    return trends.map((t) => ({
      ...t,
      status: getTrendStatus(t),
    }));
  }, [trends]);

  const filtered = useMemo(() => {
    return enrichedTrends.filter((t) => {
      const matchesSearch = t.subject?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [enrichedTrends, search, filterStatus]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aDate = a.detectedAt ? new Date(a.detectedAt).getTime() : 0;
      const bDate = b.detectedAt ? new Date(b.detectedAt).getTime() : 0;
      return bDate - aDate;
    });
  }, [filtered]);

  return (
    <DashboardLayout>
      <PageHeader
        title="Trend History"
        description="Track the lifecycle of detected trends over time"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={handleDetect}
            disabled={detecting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors disabled:opacity-50"
          >
            <Play size={16} />
            {detecting ? 'Detecting...' : 'Detect Now'}
          </button>
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
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-sm bg-bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="ALL">All Statuses</option>
          <option value="EMERGING">Emerging</option>
          <option value="GROWING">Growing</option>
          <option value="STABLE">Stable</option>
          <option value="DECLINING">Declining</option>
          <option value="EXPIRED">Expired</option>
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
            title="No trend history"
            description="Trend history will be built as snapshots are captured over time."
          />
        </div>
      ) : (
        <div className="bg-bg-card rounded-xl border border-border shadow-xs overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg-base border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Trend</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Type</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Status</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Severity</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">Current</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">Previous</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">Change</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Detected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sorted.map((trend, i) => {
                const isPositive = (trend.changeRatio || 0) > 0;
                const changePercent = trend.changeRatio != null
                  ? Math.round(trend.changeRatio * 100)
                  : null;

                return (
                  <tr
                    key={i}
                    className="hover:bg-bg-base/50 cursor-pointer"
                    onClick={() => setSelectedTrend(trend)}
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-text-primary">{trend.subject}</span>
                    </td>
                    <td className="px-4 py-3">
                      <TrendStatusBadge status={trend.type} />
                    </td>
                    <td className="px-4 py-3">
                      <TrendStatusBadge status={trend.status} />
                    </td>
                    <td className="px-4 py-3">
                      <TrendStatusBadge status={trend.severity} />
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-text-primary">{trend.currentCount || 0}</td>
                    <td className="px-4 py-3 text-right text-text-secondary">{trend.previousCount || 0}</td>
                    <td className="px-4 py-3 text-right">
                      {changePercent != null ? (
                        <span className={`inline-flex items-center gap-0.5 font-medium ${isPositive ? 'text-danger-600' : 'text-success-600'}`}>
                          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {isPositive ? '+' : ''}{changePercent}%
                        </span>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-text-secondary">
                        <Calendar size={14} />
                        {trend.detectedAt ? new Date(trend.detectedAt).toLocaleDateString() : '—'}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
