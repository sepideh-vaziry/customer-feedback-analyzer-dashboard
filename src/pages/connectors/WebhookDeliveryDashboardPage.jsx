import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Inbox,
  RotateCcw,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Shield,
  KeyRound,
  Ban,
  Plus,
  Info,
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';
import {
  getConnectors,
  getWebhookDeliveries,
  replayWebhookDelivery,
  getConnectorCredentials,
  rotateConnectorCredential,
  revokeConnectorCredential,
} from '../../services/connectorService';

const STATUS_OPTIONS = ['ALL', 'PENDING', 'SUCCESS', 'FAILED', 'DISCARDED'];

const STATUS_STYLES = {
  PENDING: 'bg-warning-50 text-warning-700',
  SUCCESS: 'bg-success-50 text-success-700',
  FAILED: 'bg-danger-50 text-danger-700',
  DISCARDED: 'bg-slate-100 text-slate-600',
};

const STATUS_ICONS = {
  PENDING: Clock,
  SUCCESS: CheckCircle2,
  FAILED: XCircle,
  DISCARDED: Trash2,
};

function StatusBadge({ status }) {
  const Icon = STATUS_ICONS[status] || Info;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-600'}`}
    >
      <Icon size={12} />
      {status}
    </span>
  );
}

function WebhookDeliveryRow({ delivery, onReplay, replayingId }) {
  const [expanded, setExpanded] = useState(false);
  const isFailed = delivery.status === 'FAILED';
  const isReplaying = replayingId === delivery.id;

  return (
    <>
      <tr
        className={`bg-bg-card hover:bg-bg-base transition-colors ${isFailed ? 'cursor-pointer' : ''}`}
        onClick={() => isFailed && setExpanded((e) => !e)}
      >
        <td className="px-4 py-3">
          <StatusBadge status={delivery.status} />
        </td>
        <td className="px-4 py-3 text-sm text-text-secondary">
          {delivery.receivedAt ? new Date(delivery.receivedAt).toLocaleString() : '—'}
        </td>
        <td className="px-4 py-3 text-sm text-text-secondary">
          {delivery.processedAt ? new Date(delivery.processedAt).toLocaleString() : '—'}
        </td>
        <td className="px-4 py-3 text-sm text-text-primary">
          {delivery.retryCount ?? 0}
        </td>
        <td className="px-4 py-3 text-sm text-text-secondary max-w-xs truncate">
          {delivery.errorMessage || '—'}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-end gap-2">
            {isFailed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReplay(delivery.id);
                }}
                disabled={isReplaying}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors disabled:opacity-50"
                title="Replay delivery"
              >
                {isReplaying ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <RotateCcw size={12} />
                )}
                Replay
              </button>
            )}
            {isFailed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded((ex) => !ex);
                }}
                className="p-1.5 rounded-md hover:bg-border-light text-text-muted hover:text-text-primary transition-colors"
                title="Toggle details"
              >
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>
        </td>
      </tr>
      {expanded && isFailed && (
        <tr className="bg-bg-base">
          <td colSpan={6} className="px-4 py-3">
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-text-muted">Delivery ID:</span>{' '}
                <span className="font-mono text-text-primary">{delivery.id}</span>
              </div>
              <div>
                <span className="text-text-muted">Idempotency Key:</span>{' '}
                <span className="font-mono text-text-primary">{delivery.idempotencyKey || '—'}</span>
              </div>
              {delivery.feedbackId && (
                <div>
                  <span className="text-text-muted">Feedback ID:</span>{' '}
                  <span className="font-mono text-text-primary">{delivery.feedbackId}</span>
                </div>
              )}
              {delivery.errorMessage && (
                <div className="p-2 rounded-lg bg-danger-50 border border-danger-200 text-danger-700">
                  <span className="font-medium">Error:</span> {delivery.errorMessage}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function WebhookDeliveryDashboardPage() {
  const { connectorId } = useParams();
  const navigate = useNavigate();

  const [connectors, setConnectors] = useState([]);
  const [selectedConnectorId, setSelectedConnectorId] = useState(connectorId || '');
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [replayingId, setReplayingId] = useState(null);
  const [replayError, setReplayError] = useState('');
  const [replaySuccess, setReplaySuccess] = useState('');

  const [activeTab, setActiveTab] = useState('deliveries');
  const [credentials, setCredentials] = useState([]);
  const [credentialsLoading, setCredentialsLoading] = useState(false);
  const [credentialsError, setCredentialsError] = useState('');
  const [rotating, setRotating] = useState(false);
  const [revokingId, setRevokingId] = useState(null);

  const [page, setPage] = useState(0);
  const pageSize = 10;

  const loadConnectors = useCallback(async () => {
    try {
      const data = await getConnectors();
      setConnectors(data || []);
    } catch {
      setConnectors([]);
    }
  }, []);

  const loadDeliveries = useCallback(async () => {
    if (!selectedConnectorId) return;
    setLoading(true);
    setError('');
    try {
      const status = statusFilter === 'ALL' ? undefined : statusFilter;
      const data = await getWebhookDeliveries(selectedConnectorId, status);
      setDeliveries(data || []);
      setPage(0);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load deliveries');
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  }, [selectedConnectorId, statusFilter]);

  const loadCredentials = useCallback(async () => {
    if (!selectedConnectorId) return;
    setCredentialsLoading(true);
    setCredentialsError('');
    try {
      const data = await getConnectorCredentials(selectedConnectorId);
      setCredentials(data || []);
    } catch (err) {
      setCredentialsError(err.response?.data?.message || err.message || 'Failed to load credentials');
      setCredentials([]);
    } finally {
      setCredentialsLoading(false);
    }
  }, [selectedConnectorId]);

  useEffect(() => {
    loadConnectors();
  }, [loadConnectors]);

  useEffect(() => {
    if (selectedConnectorId) {
      loadDeliveries();
      if (activeTab === 'credentials') {
        loadCredentials();
      }
    }
  }, [selectedConnectorId, statusFilter, activeTab, loadDeliveries, loadCredentials]);

  useEffect(() => {
    if (connectorId) {
      setSelectedConnectorId(connectorId);
    }
  }, [connectorId]);

  const stats = useMemo(() => {
    const total = deliveries.length;
    const succeeded = deliveries.filter((d) => d.status === 'SUCCESS').length;
    const failed = deliveries.filter((d) => d.status === 'FAILED').length;
    const discarded = deliveries.filter((d) => d.status === 'DISCARDED').length;
    return { total, succeeded, failed, discarded };
  }, [deliveries]);

  const paginatedDeliveries = useMemo(() => {
    const start = page * pageSize;
    return deliveries.slice(start, start + pageSize);
  }, [deliveries, page]);

  const totalPages = Math.ceil(deliveries.length / pageSize);

  async function handleReplay(deliveryId) {
    setReplayingId(deliveryId);
    setReplayError('');
    setReplaySuccess('');
    try {
      await replayWebhookDelivery(selectedConnectorId, deliveryId);
      setReplaySuccess('Delivery replayed successfully');
      await loadDeliveries();
    } catch (err) {
      setReplayError(err.response?.data?.message || err.message || 'Replay failed');
    } finally {
      setReplayingId(null);
    }
  }

  async function handleRotate() {
    setRotating(true);
    setCredentialsError('');
    try {
      await rotateConnectorCredential(selectedConnectorId);
      await loadCredentials();
    } catch (err) {
      setCredentialsError(err.response?.data?.message || err.message || 'Failed to rotate credential');
    } finally {
      setRotating(false);
    }
  }

  async function handleRevoke(credentialId) {
    setRevokingId(credentialId);
    setCredentialsError('');
    try {
      await revokeConnectorCredential(selectedConnectorId, credentialId);
      await loadCredentials();
    } catch (err) {
      setCredentialsError(err.response?.data?.message || err.message || 'Failed to revoke credential');
    } finally {
      setRevokingId(null);
    }
  }

  const selectedConnector = connectors.find((c) => c.id === selectedConnectorId);

  return (
    <DashboardLayout>
      <PageHeader
        title="Webhook Delivery Dashboard"
        description="Monitor and manage webhook deliveries for your connectors"
      >
        <button
          onClick={() => navigate('/connectors')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-text-secondary hover:text-text-primary bg-bg-card border border-border rounded-xl hover:border-primary-300 transition-all duration-200 shadow-sm"
        >
          <ArrowLeft size={16} />
          Back to Connectors
        </button>
      </PageHeader>

      <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300 mb-6">
        <label className="block text-sm font-bold text-text-primary mb-1.5">
          Select Connector
        </label>
        <select
          value={selectedConnectorId}
          onChange={(e) => {
            const id = e.target.value;
            setSelectedConnectorId(id);
            if (id) {
              navigate(`/connectors/${id}/webhooks`, { replace: true });
            }
          }}
          className="w-full max-w-md px-3 py-2.5 text-sm bg-bg-base border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
        >
          <option value="">Choose a connector...</option>
          {connectors.map((c) => (
            <option key={c.id} value={c.id}>
              {c.source} — {c.id}
            </option>
          ))}
        </select>
      </div>

      {!selectedConnectorId ? (
        <EmptyState
          icon={Inbox}
          title="No connector selected"
          description="Select a connector above to view its webhook deliveries."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Received"
              value={stats.total}
              icon={Inbox}
            />
            <StatCard
              title="Succeeded"
              value={stats.succeeded}
              changeType="positive"
              icon={CheckCircle2}
            />
            <StatCard
              title="Failed"
              value={stats.failed}
              changeType="negative"
              icon={XCircle}
            />
            <StatCard
              title="Discarded"
              value={stats.discarded}
              changeType="neutral"
              icon={Trash2}
            />
          </div>

          <div className="bg-bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-4 border-b border-border px-6 py-3">
              <button
                onClick={() => setActiveTab('deliveries')}
                className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
                  activeTab === 'deliveries'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                Deliveries
              </button>
              <button
                onClick={() => {
                  setActiveTab('credentials');
                  loadCredentials();
                }}
                className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
                  activeTab === 'credentials'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                Credentials
              </button>
            </div>

            {activeTab === 'deliveries' && (
              <>
                <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
                  <label className="text-sm font-medium text-text-secondary">Status:</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 text-sm bg-bg-base border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s === 'ALL' ? 'All Statuses' : s}
                      </option>
                    ))}
                  </select>
                </div>

                {replaySuccess && (
                  <div className="mx-6 mt-4 p-3 rounded-xl bg-success-50 text-sm text-success-700 flex items-center gap-2 font-medium">
                    <CheckCircle2 size={16} />
                    {replaySuccess}
                  </div>
                )}
                {replayError && (
                  <div className="mx-6 mt-4 p-3 rounded-xl bg-danger-50 text-sm text-danger-700 flex items-center gap-2 font-medium">
                    <AlertCircle size={16} />
                    {replayError}
                  </div>
                )}

                {error && (
                  <div className="mx-6 mt-4 p-3 rounded-xl bg-danger-50 text-sm text-danger-700 flex items-center gap-2 font-medium">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="flex items-center justify-center py-24">
                    <LoadingSpinner size="xl" />
                  </div>
                ) : deliveries.length === 0 ? (
                  <EmptyState
                    icon={Inbox}
                    title="No deliveries"
                    description={
                      statusFilter === 'ALL'
                        ? 'No webhook deliveries found for this connector yet.'
                        : `No ${statusFilter.toLowerCase()} deliveries found.`
                    }
                  />
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-bg-base border-b border-border">
                            <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Status</th>
                            <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Received At</th>
                            <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Processed At</th>
                            <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Retries</th>
                            <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Error</th>
                            <th className="text-right px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {paginatedDeliveries.map((d) => (
                            <WebhookDeliveryRow
                              key={d.id}
                              delivery={d}
                              onReplay={handleReplay}
                              replayingId={replayingId}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      totalElements={deliveries.length}
                      size={pageSize}
                      onPageChange={setPage}
                    />
                  </>
                )}
              </>
            )}

            {activeTab === 'credentials' && (
              <div className="p-6 space-y-6">
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 text-sm text-primary-800 flex items-start gap-3">
                  <Info size={18} className="shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">Webhook Signature Verification</p>
                    <p>
                      External systems must send an <code className="bg-primary-100 px-1 rounded">X-Webhook-Signature</code> header
                      containing the HMAC-SHA256 of the payload. The secret is generated during connector registration and stored encrypted.
                    </p>
                    <p className="text-xs text-primary-700 font-medium">
                      Rate limit: 20 requests/minute per connector. Returns 429 Too Many Requests if exceeded.
                    </p>
                  </div>
                </div>

                {credentialsError && (
                  <div className="p-3 rounded-xl bg-danger-50 text-sm text-danger-700 flex items-center gap-2 font-medium">
                    <AlertCircle size={16} />
                    {credentialsError}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-text-primary">Credentials</h3>
                  <button
                    onClick={handleRotate}
                    disabled={rotating}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:from-primary-500 hover:to-primary-600 transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50"
                  >
                    {rotating ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Plus size={14} />
                    )}
                    Rotate Credential
                  </button>
                </div>

                {credentialsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner size="xl" />
                  </div>
                ) : credentials.length === 0 ? (
                  <EmptyState
                    icon={KeyRound}
                    title="No credentials"
                    description="No credentials found for this connector."
                  />
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-bg-base border-b border-border">
                          <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Key Name</th>
                          <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Status</th>
                          <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Last Used</th>
                          <th className="text-right px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {credentials.map((cred) => (
                          <tr key={cred.id} className="bg-bg-card hover:bg-bg-base transition-colors">
                            <td className="px-4 py-3.5 font-semibold text-text-primary">{cred.keyName}</td>
                            <td className="px-4 py-3.5">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  cred.status === 'ACTIVE'
                                    ? 'bg-success-50 text-success-700 border border-success-200'
                                    : 'bg-danger-50 text-danger-700 border border-danger-200'
                                }`}
                              >
                                {cred.status}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-text-secondary font-medium">
                              {cred.lastUsedAt ? new Date(cred.lastUsedAt).toLocaleString() : 'Never'}
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center justify-end gap-2">
                                {cred.status === 'ACTIVE' && (
                                  <button
                                    onClick={() => handleRevoke(cred.id)}
                                    disabled={revokingId === cred.id}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-danger-50 text-danger-700 hover:bg-danger-100 transition-colors disabled:opacity-50"
                                  >
                                    {revokingId === cred.id ? (
                                      <Loader2 size={12} className="animate-spin" />
                                    ) : (
                                      <Ban size={12} />
                                    )}
                                    Revoke
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
