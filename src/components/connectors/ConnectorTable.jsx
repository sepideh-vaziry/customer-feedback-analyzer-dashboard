import { useState } from 'react';
import { Eye, RefreshCw, Loader2, AlertCircle, Plug } from 'lucide-react';
import { pullConnector } from '../../services/connectorService';

function StatusBadge({ status }) {
  const isActive = status === 'ACTIVE';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
        isActive
          ? 'bg-gradient-to-r from-success-50 to-success-100 text-success-700 border-success-200'
          : 'bg-gradient-to-r from-warning-50 to-warning-100 text-warning-700 border-warning-200'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-success-500' : 'bg-warning-500'}`} />
      {status}
    </span>
  );
}

function EventTypeBadges({ eventTypes }) {
  if (!eventTypes || eventTypes.length === 0) {
    return <span className="text-xs text-text-muted font-medium">All events</span>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {eventTypes.map((type) => (
        <span
          key={type}
          className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border border-primary-200"
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
      <div className="text-center py-16">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 text-primary-400 mb-4 inline-block shadow-sm">
          <Plug size={32} />
        </div>
        <p className="text-lg font-semibold text-text-primary mb-1">No connectors configured yet</p>
        <p className="text-sm text-text-muted font-medium">Add your first connector using the form above</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pullError && (
        <div className="p-4 rounded-xl bg-danger-50 border border-danger-200 text-sm text-danger-700 flex items-center gap-2 font-medium">
          <AlertCircle size={16} />
          {pullError}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-bg-base to-bg-card border-b border-border">
              <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wider">Source</th>
              <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wider">Event Types</th>
              <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wider">Mock</th>
              <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wider">Last Pulled</th>
              <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wider">Created</th>
              <th className="text-right px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {connectors.map((c) => (
              <tr key={c.id} className="bg-bg-card hover:bg-bg-hover transition-colors duration-200">
                <td className="px-4 py-3.5 font-semibold text-text-primary">{c.source}</td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-4 py-3.5">
                  <EventTypeBadges eventTypes={c.enabledEventTypes} />
                </td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.isMock ? 'bg-warning-50 text-warning-700 border border-warning-200' : 'bg-success-50 text-success-700 border border-success-200'}`}>
                    {c.isMock ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-text-secondary font-medium">
                  {c.lastPulledAt ? new Date(c.lastPulledAt).toLocaleString() : 'Never'}
                </td>
                <td className="px-4 py-3.5 text-text-secondary font-medium">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onView?.(c.id)}
                      className="p-2 rounded-lg hover:bg-bg-hover text-text-secondary hover:text-primary-600 transition-all duration-200"
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handlePull(c.id)}
                      disabled={pullingId === c.id}
                      className="p-2 rounded-lg hover:bg-bg-hover text-text-secondary hover:text-primary-600 transition-all duration-200 disabled:opacity-50"
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
