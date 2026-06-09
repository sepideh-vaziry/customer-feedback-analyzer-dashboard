import { useEffect, useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { getConnector } from '../../services/connectorService';

export default function ConnectorDetailsModal({ connectorId, onClose }) {
  const [connector, setConnector] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await getConnector(connectorId);
        setConnector(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load connector');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [connectorId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-bg-card rounded-2xl border border-border shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-text-primary">Connector Details</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-border-light text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-text-muted" />
            </div>
          ) : error ? (
            <div className="p-3 rounded-lg bg-danger-50 text-sm text-danger-700 flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          ) : connector ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Status</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    connector.status === 'ACTIVE'
                      ? 'bg-success-50 text-success-700'
                      : 'bg-warning-50 text-warning-700'
                  }`}
                >
                  {connector.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Source</span>
                <span className="text-sm font-medium text-text-primary">{connector.source}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Created</span>
                <span className="text-sm font-medium text-text-primary">
                  {new Date(connector.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Last Pulled</span>
                <span className="text-sm font-medium text-text-primary">
                  {connector.lastPulledAt
                    ? new Date(connector.lastPulledAt).toLocaleString()
                    : 'Never'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Mock Mode</span>
                <span
                  className={`text-sm font-medium ${
                    connector.isMock ? 'text-warning-600' : 'text-success-600'
                  }`}
                >
                  {connector.isMock ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Connector ID</span>
                <span className="text-sm font-mono text-text-primary">{connector.id}</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="px-6 py-4 border-t border-border bg-bg-base">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-bg-card border border-border text-sm font-medium text-text-primary rounded-lg hover:bg-border-light transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
