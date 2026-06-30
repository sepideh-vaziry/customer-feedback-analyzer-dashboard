import { useState, useEffect, useCallback } from 'react';
import { ShieldAlert, Users, TrendingUp, Activity, RefreshCw, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import KpiCard from '../../components/dashboard/KpiCard';
import RiskDistributionChart from '../../components/churn-risk/RiskDistributionChart';
import HighRiskCustomerTable from '../../components/churn-risk/HighRiskCustomerTable';
import CustomerRiskDrawer from '../../components/churn-risk/CustomerRiskDrawer';
import { getHighRiskCustomers } from '../../services/churnRiskService';
import { getDashboardAnalytics } from '../../services/dashboardService';

export default function ChurnRiskOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [highRiskCustomers, setHighRiskCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [analyticsData, customersData] = await Promise.allSettled([
        getDashboardAnalytics('LAST_30_DAYS'),
        getHighRiskCustomers(10),
      ]);

      if (analyticsData.status === 'fulfilled') setAnalytics(analyticsData.value);
      if (customersData.status === 'fulfilled') setHighRiskCustomers(customersData.value || []);
    } catch (err) {
      setError('Failed to load churn risk data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const breakdown = analytics?.churnRiskBreakdown;
  const totalAssessed = breakdown?.totalCustomersAssessed || 0;
  const highAndCritical = (breakdown?.highCount || 0) + (breakdown?.criticalCount || 0);
  const avgScore = totalAssessed > 0
    ? Math.round(
        ((breakdown?.lowCount || 0) * 15 + (breakdown?.mediumCount || 0) * 40 + (breakdown?.highCount || 0) * 70 + (breakdown?.criticalCount || 0) * 90) / totalAssessed
      )
    : 0;

  return (
    <DashboardLayout>
      <PageHeader
        title="Churn Risk Intelligence"
        description="Identify at-risk customers and take action before churn"
      >
        <button
          onClick={loadData}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <KpiCard
          title="Customers Evaluated"
          value={totalAssessed.toString()}
          icon={Users}
          loading={loading}
        />
        <KpiCard
          title="High + Critical"
          value={highAndCritical.toString()}
          icon={ShieldAlert}
          loading={loading}
        />
        <KpiCard
          title="Avg Risk Score"
          value={`${avgScore}%`}
          icon={Activity}
          loading={loading}
        />
        <KpiCard
          title="Critical Risk"
          value={(breakdown?.criticalCount || 0).toString()}
          icon={TrendingUp}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <RiskDistributionChart data={breakdown} loading={loading} />
        <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="text-base font-bold text-text-primary mb-5">High Risk Customers</h3>
          <HighRiskCustomerTable
            customers={highRiskCustomers}
            loading={loading}
            onView={setSelectedCustomer}
          />
        </div>
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
