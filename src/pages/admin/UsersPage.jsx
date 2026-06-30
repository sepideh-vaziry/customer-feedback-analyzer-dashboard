import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle, Search, Users, Eye, Ban, CheckCircle, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';
import { getAllUsers, disableUser, enableUser } from '../../services/adminService';

export default function UsersPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(null);

  const loadData = useCallback(async (pageNum = page, searchQuery = search) => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllUsers({ page: pageNum, size, search: searchQuery });
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setPage(data.page || 0);
    } catch (err) {
      setError(err.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [page, size, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    loadData(newPage);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(0);
    loadData(0, value);
  };

  const handleDisable = async (id) => {
    setActionInProgress(id);
    try {
      await disableUser(id);
      await loadData();
    } catch {
      // error handled by loadData
    } finally {
      setActionInProgress(null);
    }
  };

  const handleEnable = async (id) => {
    setActionInProgress(id);
    try {
      await enableUser(id);
      await loadData();
    } catch {
      // error handled by loadData
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Users"
        description="Manage all users across organizations"
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
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
        />
      </div>

      {loading && users.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users"
          description="No users found."
        />
      ) : (
        <div className="bg-bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
          <table className="w-full text-sm">
            <thead className="bg-bg-base border-b border-border">
              <tr>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Email</th>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Organization</th>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Role</th>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-bg-base/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-text-primary">{u.name}</span>
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary font-medium">{u.email}</td>
                  <td className="px-4 py-3.5 text-text-secondary font-medium">{u.organizationName || '—'}</td>
                  <td className="px-4 py-3.5 text-text-secondary font-medium">{u.role || '—'}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                      u.status === 'ACTIVE'
                        ? 'bg-success-50 text-success-700'
                        : u.status === 'DISABLED'
                        ? 'bg-danger-50 text-danger-700'
                        : 'bg-warning-50 text-warning-700'
                    }`}>
                      {u.status || 'UNKNOWN'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="p-1.5 rounded-lg hover:bg-border-light text-text-muted hover:text-text-primary transition-colors"
                        title="View"
                      >
                        <Eye size={14} />
                      </button>
                      {u.status !== 'DISABLED' ? (
                        <button
                          onClick={() => handleDisable(u.id)}
                          disabled={actionInProgress === u.id}
                          className="p-1.5 rounded-lg hover:bg-danger-50 text-text-muted hover:text-danger-600 transition-colors disabled:opacity-50"
                          title="Disable"
                        >
                          <Ban size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEnable(u.id)}
                          disabled={actionInProgress === u.id}
                          className="p-1.5 rounded-lg hover:bg-success-50 text-text-muted hover:text-success-600 transition-colors disabled:opacity-50"
                          title="Enable"
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}
                    </div>
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

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedUser(null)} />
          <div className="relative w-full max-w-md h-full bg-bg-card border-l border-border shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-base font-semibold text-text-primary">User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg hover:bg-border-light text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-lg font-semibold text-primary-600">
                  {selectedUser.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-text-primary">{selectedUser.name}</h3>
                  <p className="text-sm text-text-muted">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase tracking-wide">ID</label>
                  <p className="text-sm text-text-primary mt-1 font-mono">{selectedUser.id}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase tracking-wide">Status</label>
                  <span className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    selectedUser.status === 'ACTIVE'
                      ? 'bg-success-50 text-success-700'
                      : selectedUser.status === 'DISABLED'
                      ? 'bg-danger-50 text-danger-700'
                      : 'bg-warning-50 text-warning-700'
                  }`}>
                    {selectedUser.status || 'UNKNOWN'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase tracking-wide">Role</label>
                  <p className="text-sm text-text-primary mt-1">{selectedUser.role || '—'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase tracking-wide">Organization</label>
                  <p className="text-sm text-text-primary mt-1">{selectedUser.organizationName || '—'}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wide">Last Login</label>
                <p className="text-sm text-text-primary mt-1">
                  {selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString() : 'Never'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
