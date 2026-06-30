import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import FeatureRequestRankingTable from '../../components/feature-requests/FeatureRequestRankingTable';
import FeatureRequestDetailsDrawer from '../../components/feature-requests/FeatureRequestDetailsDrawer';
import { getFeatureDemand } from '../../services/featureRequestService';

export default function DemandRankingPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [features, setFeatures] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getFeatureDemand(90, 100);
      setFeatures(data || []);
    } catch (err) {
      setError('Failed to load demand ranking.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <DashboardLayout>
      <PageHeader
        title="Demand Ranking"
        description="Feature requests ranked by customer demand"
      >
        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-text-secondary hover:text-text-primary bg-bg-card border border-border rounded-xl hover:border-primary-300 transition-all duration-200 disabled:opacity-50 shadow-sm"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </PageHeader>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-200 text-sm text-danger-700 flex items-center gap-2 font-medium">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
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
