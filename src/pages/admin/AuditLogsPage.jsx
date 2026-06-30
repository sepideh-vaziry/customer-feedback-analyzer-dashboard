import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle, Search, ClipboardList, Eye, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';
import { getAuditLogs } from '../../services/adminService';

export default function AuditLogsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const loadData = useCallback(async (pageNum = page) => {
    setLoading(true);
    setError('');
    try {
      const data = await getAuditLogs({ page: pageNum, size });
      setLogs(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setPage(data.page || 0);
    } catch (err) {
      setError(err.message || 'Failed to load audit logs.');
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    loadData(newPage);
  };

  const filtered = logs.filter((log) =>
    log.user?.toLowerCase().includes(search.toLowerCase()) ||
    log.action?.toLowerCase().includes(search.toLowerCase()) ||
    log.resource?.toLowerCase().includes(search.toLowerCase()) ||
    log.organization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <PageHeader
        title="Audit Logs"
        description="Review platform activity and security events"
      >
        <button
          onClick={() => loadData()}
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

      <div className="mb-4 relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search audit logs..."
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
        />
      </div>

      {loading && logs.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No audit logs"
          description="No audit logs found."
        />
      ) : (
        <div className="bg-bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
          <table className="w-full text-sm">
            <thead className="bg-bg-base border-b border-border">
              <tr>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Timestamp</th>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">User</th>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Organization</th>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Action</th>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Resource</th>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Result</th>
                <th className="text-right px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-bg-base/50 transition-colors">
                  <td className="px-4 py-3.5 text-text-secondary font-medium whitespace-nowrap">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-3.5 text-text-primary font-semibold">{log.user || '—'}</td>
                  <td className="px-4 py-3.5 text-text-secondary font-medium">{log.organization || '—'}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-primary-50 text-primary-700">
                      {log.action || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary font-medium">{log.resource || '—'}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                      log.result === 'SUCCESS'
                        ? 'bg-success-50 text-success-700'
                        : log.result === 'FAILURE'
                        ? 'bg-danger-50 text-danger-700'
                        : 'bg-text-muted/10 text-text-muted'
                    }`}>
                      {log.result || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-1.5 rounded-lg hover:bg-border-light text-text-muted hover:text-text-primary transition-colors"
                      title="View Details"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            size={size}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {selectedLog && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedLog(null)} />
          <div className="relative w-full max-w-md h-full bg-bg-card border-l border-border shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-base font-semibold text-text-primary">Audit Log Details</h2>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-lg hover:bg-border-light text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wide">Timestamp</label>
                <p className="text-sm text-text-primary mt-1">
                  {selectedLog.timestamp ? new Date(selectedLog.timestamp).toLocaleString() : '—'}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wide">Actor</label>
                <p className="text-sm text-text-primary mt-1">{selectedLog.user || '—'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wide">Organization</label>
                <p className="text-sm text-text-primary mt-1">{selectedLog.organization || '—'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wide">Action</label>
                <p className="text-sm text-text-primary mt-1">{selectedLog.action || '—'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wide">Resource</label>
                <p className="text-sm text-text-primary mt-1">{selectedLog.resource || '—'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wide">Result</label>
                <p className="text-sm text-text-primary mt-1">{selectedLog.result || '—'}</p>
              </div>
              {selectedLog.metadata && (
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase tracking-wide">Metadata</label>
                  <pre className="mt-1 p-3 bg-bg-base rounded-lg text-xs text-text-secondary overflow-x-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
