import { useState, useEffect, useCallback } from 'react';
import { Plug, Loader2, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import ConnectorForm from '../../components/connectors/ConnectorForm';
import ConnectorTable from '../../components/connectors/ConnectorTable';
import ConnectorDetailsModal from '../../components/connectors/ConnectorDetailsModal';
import { getConnectors } from '../../services/connectorService';

export default function ConnectorsPage() {
  const [connectors, setConnectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const loadConnectors = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getConnectors();
      setConnectors(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load connectors');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConnectors();
  }, [loadConnectors]);

  return (
    <DashboardLayout>
      <PageHeader
        title="Connectors"
        description="Manage external source integrations for feedback ingestion"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                <Plug size={16} className="text-primary-600" />
              </div>
              <h3 className="text-base font-semibold text-text-primary">New Connector</h3>
            </div>
            <ConnectorForm onSuccess={loadConnectors} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-text-primary">Your Connectors</h3>
              <button
                onClick={loadConnectors}
                disabled={loading}
                className="p-2 rounded-lg hover:bg-border-light text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <Loader2 size={16} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-danger-50 text-sm text-danger-700 flex items-center gap-2 mb-4">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <ConnectorTable
              connectors={connectors}
              loading={loading}
              onView={setSelectedId}
              onPullSuccess={loadConnectors}
            />
          </div>
        </div>
      </div>

      {selectedId && (
        <ConnectorDetailsModal
          connectorId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </DashboardLayout>
  );
}
