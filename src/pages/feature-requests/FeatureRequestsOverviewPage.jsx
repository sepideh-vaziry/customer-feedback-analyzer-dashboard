import { useState, useEffect, useCallback } from 'react';
import { Lightbulb, TrendingUp, Users, RefreshCw, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import KpiCard from '../../components/dashboard/KpiCard';
import FeatureRequestTrendChart from '../../components/feature-requests/FeatureRequestTrendChart';
import FeatureRequestRankingTable from '../../components/feature-requests/FeatureRequestRankingTable';
import FeatureRequestDetailsDrawer from '../../components/feature-requests/FeatureRequestDetailsDrawer';
import {
  getFeatureDemand,
  getFeatureClusters,
} from '../../services/featureRequestService';
import { getDashboardTrends } from '../../services/dashboardService';

export default function FeatureRequestsOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [features, setFeatures] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [trends, setTrends] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [featuresData, clustersData, trendsData] = await Promise.allSettled([
        getFeatureDemand(30, 10),
        getFeatureClusters(),
        getDashboardTrends('LAST_30_DAYS'),
      ]);

      if (featuresData.status === 'fulfilled') setFeatures(featuresData.value || []);
      if (clustersData.status === 'fulfilled') setClusters(clustersData.value || []);
      if (trendsData.status === 'fulfilled') setTrends(trendsData.value);
    } catch (err) {
      setError('Failed to load feature request data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalOccurrences = features.reduce((sum, f) => sum + (f.occurrenceCount || 0), 0);

  return (
    <DashboardLayout>
      <PageHeader
        title="Feature Request Intelligence"
        description="Discover, prioritize, and track customer feature requests"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          title="Total Requests"
          value={totalOccurrences.toString()}
          icon={Lightbulb}
          loading={loading}
        />
        <KpiCard
          title="Clusters"
          value={clusters.length.toString()}
          icon={Users}
          loading={loading}
        />
        <KpiCard
          title="Top Request"
          value={features[0]?.clusterName || '—'}
          icon={TrendingUp}
          loading={loading}
        />
        <KpiCard
          title="Unique Features"
          value={features.length.toString()}
          icon={Lightbulb}
          loading={loading}
        />
      </div>

      <div className="mb-6">
        <FeatureRequestTrendChart data={trends?.complaintTrend} loading={loading} />
      </div>

      <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
        <h3 className="text-base font-semibold text-text-primary mb-4">Top Feature Requests</h3>
        <FeatureRequestRankingTable
          features={features}
          loading={loading}
          onView={setSelectedFeature}
        />
      </div>

      {selectedFeature && (
        <FeatureRequestDetailsDrawer
          feature={selectedFeature}
          onClose={() => setSelectedFeature(null)}
        />
      )}
    </DashboardLayout>
  );
}
