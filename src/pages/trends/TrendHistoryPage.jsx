import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  RefreshCw,
  AlertTriangle,
  Search,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Play,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import TrendStatusBadge from '../../components/trends/TrendStatusBadge';
import TrendDetailsDrawer from '../../components/trends/TrendDetailsDrawer';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getTrendHistory } from '../../services/trendService';
import { useTrendDetection } from '../../hooks/useTrendDetection';

const WINDOWS = [
  { value: 7, label: 'Last 7 Days' },
  { value: 30, label: 'Last 30 Days' },
  { value: 90, label: 'Last 90 Days' },
];

const STATUS_OPTIONS = ['ALL', 'EMERGING', 'GROWING', 'STABLE', 'DECLINING', 'EXPIRED'];

const PAGE_SIZE = 20;

export default function TrendHistoryPage() {
  const [windowDays, setWindowDays] = useState(90);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [historyPage, setHistoryPage] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedTrend, setSelectedTrend] = useState(null);
  const [detectTrigger, setDetectTrigger] = useState(0);

  const detection = useTrendDetection();

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        days: windowDays,
        page,
        size: PAGE_SIZE,
      };
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const data = await getTrendHistory(params);
      setHistoryPage(data || null);
    } catch (err) {
      setError('Failed to load trend history.');
    } finally {
      setLoading(false);
    }
  }, [windowDays, statusFilter, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (detection.job?.status === 'COMPLETED') {
      loadData();
    }
  }, [detection.job?.status]);

  const entries = historyPage?.entries || historyPage?.content || historyPage?.items || (Array.isArray(historyPage) ? historyPage : []);
  const totalPages = historyPage?.totalPages ?? Math.max(1, Math.ceil((historyPage?.totalElements ?? entries.length) / PAGE_SIZE));
  const totalElements = historyPage?.totalElements ?? entries.length;

  const filtered = useMemo(() => {
    if (!search.trim()) return entries;
    const q = search.toLowerCase();
    return entries.filter((t) => t.subject?.toLowerCase().includes(q));
  }, [entries, search]);

  const handleDetect = async () => {
    await detection.start(windowDays);
    setDetectTrigger((n) => n + 1);
  };

  useEffect(() => {
    if (detectTrigger > 0) loadData();
  }, [detectTrigger]);

  const detectionRunning = detection.loading || (detection.job && !['COMPLETED', 'FAILED'].includes(detection.job.status));
  const detectionStatus = detection.job?.status;
  const detectionProgress = detection.job?.progress;

  return (
    <DashboardLayout>
      <PageHeader
        title="Trend History"
        description="Track the lifecycle of detected trends over time"
      >
        <div className="flex items-center gap-2">
          <select
            value={windowDays}
            onChange={(e) => { setWindowDays(Number(e.target.value)); setPage(0); }}
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

      {detectionStatus === 'COMPLETED' && !detection.error && (
        <div className="mb-6 p-3 rounded-xl bg-success-50 border border-success-200 text-sm text-success-700 font-medium">
          Detection completed. Trend history refreshed.
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
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="px-3 py-2.5 text-sm bg-bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === 'ALL' ? 'All Statuses' : s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      {loading && entries.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <EmptyState
            icon={Activity}
            title="No trend history"
            description="Trend history will be built as snapshots are captured over time."
          />
        </div>
      ) : (
        <div className="bg-bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
          <table className="w-full text-sm">
            <thead className="bg-bg-base border-b border-border">
              <tr>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Trend</th>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Severity</th>
                <th className="text-right px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Current</th>
                <th className="text-right px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Previous</th>
                <th className="text-right px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Change</th>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">First Seen</th>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((trend) => {
                const isPositive = (trend.changeRatio || 0) > 0;
                const changePercent = trend.changeRatio != null
                  ? Math.round(trend.changeRatio * 100)
                  : null;
                const firstSeen = trend.firstDetectedAt || trend.detectedAt;
                const lastSeen = trend.lastSeenAt || trend.detectedAt;
                const key = trend.id || `${trend.subject}-${firstSeen}-${lastSeen}`;

                return (
                  <tr
                    key={key}
                    className="hover:bg-bg-base/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedTrend(trend)}
                  >
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-text-primary">{trend.subject}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      {trend.type ? <TrendStatusBadge status={trend.type} /> : <span className="text-text-muted">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      {trend.status ? <TrendStatusBadge status={trend.status} /> : <span className="text-text-muted">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      {trend.severity ? <TrendStatusBadge status={trend.severity} /> : <span className="text-text-muted">—</span>}
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-text-primary">{trend.currentCount || 0}</td>
                    <td className="px-4 py-3.5 text-right text-text-secondary font-medium">{trend.previousCount || 0}</td>
                    <td className="px-4 py-3.5 text-right">
                      {changePercent != null ? (
                        <span className={`inline-flex items-center gap-0.5 font-semibold ${isPositive ? 'text-danger-600' : 'text-success-600'}`}>
                          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {isPositive ? '+' : ''}{changePercent}%
                        </span>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-text-secondary font-medium">
                        <Calendar size={14} />
                        {firstSeen ? new Date(firstSeen).toLocaleDateString() : '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-text-secondary font-medium">
                        <Calendar size={14} />
                        {lastSeen ? new Date(lastSeen).toLocaleDateString() : '—'}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-bg-base">
              <p className="text-xs text-text-muted font-medium">
                Showing page {page + 1} of {totalPages} · {totalElements} total
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0 || loading}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-text-secondary bg-bg-card border border-border rounded-lg hover:border-primary-300 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft size={14} />
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1 || loading}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-text-secondary bg-bg-card border border-border rounded-lg hover:border-primary-300 transition-colors disabled:opacity-50"
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
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