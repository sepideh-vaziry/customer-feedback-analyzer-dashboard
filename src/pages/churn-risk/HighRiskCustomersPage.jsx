import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import HighRiskCustomerTable from '../../components/churn-risk/HighRiskCustomerTable';
import CustomerRiskDrawer from '../../components/churn-risk/CustomerRiskDrawer';
import { getHighRiskCustomers } from '../../services/churnRiskService';

export default function HighRiskCustomersPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getHighRiskCustomers(100);
      setCustomers(data || []);
    } catch (err) {
      setError('Failed to load high-risk customers.');
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
        title="High Risk Customers"
        description="Customers with elevated churn risk scores"
      >
        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary bg-bg-card border border-border rounded-lg hover:border-primary-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </PageHeader>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-danger-50 border border-danger-200 text-sm text-danger-700 flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
        <HighRiskCustomerTable
          customers={customers}
          loading={loading}
          onView={setSelectedCustomer}
        />
      </div>

      {selectedCustomer && (
        <CustomerRiskDrawer
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onRefresh={loadData}
        />
      )}
    </DashboardLayout>
  );
}
