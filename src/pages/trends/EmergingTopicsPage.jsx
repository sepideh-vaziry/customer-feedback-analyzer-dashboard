import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle, Lightbulb, TrendingUp, TrendingDown, Search, Calendar } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import TrendStatusBadge from '../../components/trends/TrendStatusBadge';
import TrendDetailsDrawer from '../../components/trends/TrendDetailsDrawer';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getEmergingTopics } from '../../services/trendService';

const WINDOWS = [
  { value: 'LAST_7_DAYS', label: 'Last 7 Days' },
  { value: 'LAST_30_DAYS', label: 'Last 30 Days' },
  { value: 'LAST_90_DAYS', label: 'Last 90 Days' },
];

const STATUS_OPTIONS = ['GROWING', 'EMERGING', 'STABLE', 'DECLINING', 'EXPIRED'];

export default function EmergingTopicsPage() {
  const [window, setWindow] = useState('LAST_30_DAYS');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [topics, setTopics] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const payload = await getEmergingTopics({ window });
      setTopics(payload?.entries || payload?.content || payload || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load emerging topics.');
    } finally {
      setLoading(false);
    }
  }, [window]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = topics.filter((t) => {
    const matchesSearch = !search.trim() || t.subject?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) =>
    (b.changeRatio || 0) - (a.changeRatio || 0)
  );

  return (
    <DashboardLayout>
      <PageHeader
        title="Emerging Topics"
        description="Newly detected themes in customer feedback"
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

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search emerging topics..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 text-sm bg-bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
        >
          <option value="ALL">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
          ))}
        </select>
      </div>

      {loading && topics.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <EmptyState
            icon={Lightbulb}
            title="No emerging topics"
            description="Emerging topics will be detected as new themes appear in your feedback."
          />
        </div>
      ) : (
        <div className="bg-bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
          <table className="w-full text-sm">
            <thead className="bg-bg-base border-b border-border">
              <tr>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Topic</th>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Severity</th>
                <th className="text-right px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Current</th>
                <th className="text-right px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Previous</th>
                <th className="text-right px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Growth</th>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">First Detected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sorted.map((topic) => {
                const isPositive = (topic.changeRatio || 0) > 0;
                const changePercent = topic.changeRatio != null
                  ? Math.round(topic.changeRatio * 100)
                  : null;
                const firstSeen = topic.firstDetectedAt || topic.detectedAt;

                return (
                  <tr
                    key={topic.id || `${topic.subject}-${firstSeen}`}
                    className="hover:bg-bg-base/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center shadow-sm">
                          <Lightbulb size={14} className="text-primary-600" />
                        </div>
                        <span className="font-semibold text-text-primary">{topic.subject}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {topic.status ? <TrendStatusBadge status={topic.status} /> : <span className="text-text-muted">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      <TrendStatusBadge status={topic.severity} />
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-text-primary">{topic.currentCount || 0}</td>
                    <td className="px-4 py-3.5 text-right text-text-secondary font-medium">{topic.previousCount || 0}</td>
                    <td className="px-4 py-3.5 text-right">
                      {changePercent != null ? (
                        <span className={`inline-flex items-center gap-0.5 font-bold ${isPositive ? 'text-danger-600' : 'text-success-600'}`}>
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedTopic && (
        <TrendDetailsDrawer
          trend={selectedTopic}
          onClose={() => setSelectedTopic(null)}
        />
      )}
    </DashboardLayout>
  );
}