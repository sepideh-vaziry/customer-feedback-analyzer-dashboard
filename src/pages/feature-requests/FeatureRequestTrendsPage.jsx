import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import DashboardFilters from '../../components/dashboard/DashboardFilters';
import FeatureRequestTrendChart from '../../components/feature-requests/FeatureRequestTrendChart';
import EmptyState from '../../components/ui/EmptyState';
import { getDashboardTrends, getLatestTrends } from '../../services/dashboardService';

export default function FeatureRequestTrendsPage() {
  const [window, setWindow] = useState('LAST_30_DAYS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trends, setTrends] = useState(null);
  const [latestTrends, setLatestTrends] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [trendsData, latestData] = await Promise.allSettled([
        getDashboardTrends(window),
        getLatestTrends(),
      ]);

      if (trendsData.status === 'fulfilled') setTrends(trendsData.value);
      if (latestData.status === 'fulfilled') setLatestTrends(latestData.value);
    } catch (err) {
      setError('Failed to load trend data.');
    } finally {
      setLoading(false);
    }
  }, [window]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const featureTrends = latestTrends?.entries?.filter(
    (e) => e.type === 'EMERGING_TOPIC' || e.subject?.toLowerCase().includes('feature')
  ) || [];

  return (
    <DashboardLayout>
      <PageHeader
        title="Feature Request Trends"
        description="Track how feature request demand changes over time"
      >
        <div className="flex items-center gap-2">
          <DashboardFilters window={window} onChange={setWindow} />
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-border-light text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </PageHeader>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-danger-50 border border-danger-200 text-sm text-danger-700 flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      <div className="mb-6">
        <FeatureRequestTrendChart data={trends?.complaintTrend} loading={loading} />
      </div>

      <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
        <h3 className="text-base font-semibold text-text-primary mb-4">Emerging Feature Trends</h3>

        {featureTrends.length === 0 ? (
          <EmptyState icon={TrendingUp} title="No feature trends detected" description="Trends will appear as feedback is analyzed over time." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureTrends.map((entry, index) => {
              const isPositive = (entry.changeRatio || 0) > 0;
              const changePercent = entry.changeRatio != null
                ? Math.round(entry.changeRatio * 100)
                : null;

              return (
                <div key={index} className="p-4 rounded-xl bg-bg-base border border-border">
                  <p className="text-sm font-medium text-text-primary">{entry.subject}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-lg font-semibold text-text-primary">{entry.currentCount || 0}</span>
                    {changePercent != null && (
                      <span className={`text-xs font-medium flex items-center gap-0.5 ${isPositive ? 'text-success-600' : 'text-danger-600'}`}>
                        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {isPositive ? '+' : ''}{changePercent}%
                      </span>
                    )}
                  </div>
                  {entry.explanation && (
                    <p className="text-xs text-text-secondary mt-2 leading-relaxed">{entry.explanation}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
