import { useState } from 'react';
import { Eye, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { pullConnector } from '../../services/connectorService';

function StatusBadge({ status }) {
  const isActive = status === 'ACTIVE';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive ? 'bg-success-50 text-success-700' : 'bg-warning-50 text-warning-700'
      }`}
    >
      {status}
    </span>
  );
}

function EventTypeBadges({ eventTypes }) {
  if (!eventTypes || eventTypes.length === 0) {
    return <span className="text-xs text-text-muted">All events</span>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {eventTypes.map((type) => (
        <span
          key={type}
          className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-primary-50 text-primary-700"
        >
          {type}
        </span>
      ))}
    </div>
  );
}

export default function ConnectorTable({ connectors, onView, onPullSuccess, loading }) {
  const [pullingId, setPullingId] = useState(null);
  const [pullError, setPullError] = useState('');

  async function handlePull(id) {
    setPullingId(id);
    setPullError('');
    try {
      await pullConnector(id);
      onPullSuccess?.();
    } catch (err) {
      setPullError(err.response?.data?.message || err.message || 'Pull failed');
    } finally {
      setPullingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-text-muted" />
      </div>
    );
  }

  if (connectors.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-text-secondary">No connectors configured yet.</p>
        <p className="text-xs text-text-muted mt-1">Add your first connector using the form above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pullError && (
        <div className="p-3 rounded-lg bg-danger-50 text-sm text-danger-700 flex items-center gap-2">
          <AlertCircle size={16} />
          {pullError}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-base border-b border-border">
              <th className="text-left px-4 py-3 font-medium text-text-secondary">Source</th>
              <th className="text-left px-4 py-3 font-medium text-text-secondary">Status</th>
              <th className="text-left px-4 py-3 font-medium text-text-secondary">Event Types</th>
              <th className="text-left px-4 py-3 font-medium text-text-secondary">Mock</th>
              <th className="text-left px-4 py-3 font-medium text-text-secondary">Last Pulled</th>
              <th className="text-left px-4 py-3 font-medium text-text-secondary">Created</th>
              <th className="text-right px-4 py-3 font-medium text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {connectors.map((c) => (
              <tr key={c.id} className="bg-bg-card hover:bg-bg-base transition-colors">
                <td className="px-4 py-3 font-medium text-text-primary">{c.source}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-4 py-3">
                  <EventTypeBadges eventTypes={c.enabledEventTypes} />
                </td>
                <td className="px-4 py-3">
                  <span className={c.isMock ? 'text-warning-600' : 'text-success-600'}>
                    {c.isMock ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  {c.lastPulledAt ? new Date(c.lastPulledAt).toLocaleString() : 'Never'}
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView?.(c.id)}
                      className="p-1.5 rounded-md hover:bg-border-light text-text-secondary hover:text-text-primary transition-colors"
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handlePull(c.id)}
                      disabled={pullingId === c.id}
                      className="p-1.5 rounded-md hover:bg-border-light text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
                      title="Pull now"
                    >
                      {pullingId === c.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <RefreshCw size={16} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
