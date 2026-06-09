import { useState, useCallback } from 'react';
import { Search, RefreshCw, AlertTriangle, MessageSquare, ShieldAlert } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import CustomerRiskDrawer from '../../components/churn-risk/CustomerRiskDrawer';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getCustomerRisk, assessChurnRisk } from '../../services/churnRiskService';

export default function CustomerExplorerPage() {
  const [identifier, setIdentifier] = useState('');
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assessing, setAssessing] = useState(false);

  const search = useCallback(async () => {
    if (!identifier.trim()) return;
    setLoading(true);
    setError('');
    setCustomer(null);
    try {
      const data = await getCustomerRisk(identifier.trim());
      setCustomer(data);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        setError('No churn risk assessment found for this customer.');
      } else {
        setError('Failed to load customer risk data.');
      }
    } finally {
      setLoading(false);
    }
  }, [identifier]);

  const handleAssess = async () => {
    if (!identifier.trim()) return;
    setAssessing(true);
    try {
      const data = await assessChurnRisk(identifier.trim());
      setCustomer(data);
      setError('');
    } catch (err) {
      setError('Failed to assess churn risk.');
    } finally {
      setAssessing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    search();
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Customer Explorer"
        description="Investigate churn risk for a specific customer"
      />

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter customer identifier..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !identifier.trim()}
            className="px-4 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : 'Search'}
          </button>
          <button
            type="button"
            onClick={handleAssess}
            disabled={assessing || !identifier.trim()}
            className="px-4 py-2.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors disabled:opacity-50"
          >
            {assessing ? <RefreshCw size={16} className="animate-spin" /> : 'Assess'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-danger-50 border border-danger-200 text-sm text-danger-700 flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {loading && !customer ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      ) : customer ? (
        <div className="max-w-2xl">
          <CustomerRiskDrawer
            customer={customer}
            onClose={() => {}}
            onRefresh={search}
          />
        </div>
      ) : (
        <EmptyState
          icon={ShieldAlert}
          title="Search for a customer"
          description="Enter a customer identifier to view their churn risk profile."
        />
      )}
    </DashboardLayout>
  );
}
