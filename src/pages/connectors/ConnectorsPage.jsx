import { useState, useEffect, useCallback } from 'react';
import { Plug, Loader2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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
      >
        <button
          onClick={() => navigate('/connectors/webhooks/guide')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary-700 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl hover:from-primary-100 hover:to-primary-200 transition-all border border-primary-200 shadow-sm"
        >
          <ArrowUpRight size={16} />
          Webhook Guide
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center shadow-sm">
                <Plug size={18} className="text-primary-600" />
              </div>
              <h3 className="text-base font-bold text-text-primary">New Connector</h3>
            </div>
            <ConnectorForm onSuccess={loadConnectors} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-text-primary">Your Connectors</h3>
              <button
                onClick={loadConnectors}
                disabled={loading}
                className="p-2.5 rounded-xl hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-all duration-200 disabled:opacity-50 border border-transparent hover:border-border"
                title="Refresh"
              >
                <Loader2 size={16} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-danger-50 border border-danger-200 text-sm text-danger-700 flex items-center gap-2 font-medium mb-4">
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
