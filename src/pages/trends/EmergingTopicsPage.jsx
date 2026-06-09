import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle, Lightbulb, TrendingUp, TrendingDown, Search, Calendar } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import TrendStatusBadge from '../../components/trends/TrendStatusBadge';
import TrendDetailsDrawer from '../../components/trends/TrendDetailsDrawer';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getLatestTrends } from '../../services/trendService';

export default function EmergingTopicsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [topics, setTopics] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getLatestTrends();
      const all = data?.entries || [];
      setTopics(all.filter((e) => e.type === 'EMERGING_TOPIC'));
    } catch (err) {
      setError('Failed to load emerging topics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = topics.filter((t) =>
    t.subject?.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) =>
    (b.changeRatio || 0) - (a.changeRatio || 0)
  );

  return (
    <DashboardLayout>
      <PageHeader
        title="Emerging Topics"
        description="Newly detected themes in customer feedback"
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

      <div className="mb-4 relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emerging topics..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        />
      </div>

      {loading && topics.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
          <EmptyState
            icon={Lightbulb}
            title="No emerging topics"
            description="Emerging topics will be detected as new themes appear in your feedback."
          />
        </div>
      ) : (
        <div className="bg-bg-card rounded-xl border border-border shadow-xs overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg-base border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Topic</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Severity</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">Current</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">Previous</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">Growth</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">First Detected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sorted.map((topic, i) => {
                const isPositive = (topic.changeRatio || 0) > 0;
                const changePercent = topic.changeRatio != null
                  ? Math.round(topic.changeRatio * 100)
                  : null;

                return (
                  <tr
                    key={i}
                    className="hover:bg-bg-base/50 cursor-pointer"
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
                          <Lightbulb size={14} />
                        </div>
                        <span className="font-medium text-text-primary">{topic.subject}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <TrendStatusBadge status={topic.severity} />
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-text-primary">{topic.currentCount || 0}</td>
                    <td className="px-4 py-3 text-right text-text-secondary">{topic.previousCount || 0}</td>
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
                        {topic.detectedAt ? new Date(topic.detectedAt).toLocaleDateString() : '—'}
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
