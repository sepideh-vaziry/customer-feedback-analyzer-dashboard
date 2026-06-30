import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle, Check, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import PlanCard from '../../components/billing/PlanCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getAvailablePlans, getCurrentSubscription, upgradeSubscription } from '../../services/billingService';

export default function PlansPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [upgrading, setUpgrading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [plansData, subData] = await Promise.allSettled([
        getAvailablePlans(),
        getCurrentSubscription(),
      ]);

      if (plansData.status === 'fulfilled') setPlans(plansData.value || []);
      if (subData.status === 'fulfilled') setSubscription(subData.value);
    } catch (err) {
      setError('Failed to load plans.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpgrade = async () => {
    if (!selectedPlan?.code) return;
    setUpgrading(true);
    try {
      const data = await upgradeSubscription(selectedPlan.code);
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      await loadData();
      setSelectedPlan(null);
    } catch {
      setError('Failed to upgrade subscription.');
    } finally {
      setUpgrading(false);
    }
  };

  const activePlans = plans.filter((p) => p.active !== false);

  return (
    <DashboardLayout>
      <PageHeader
        title="Plans & Pricing"
        description="Compare and select the right plan for your organization"
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

      {selectedPlan ? (
        <div className="max-w-xl mx-auto">
          <button
            onClick={() => setSelectedPlan(null)}
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4"
          >
            <ArrowLeft size={16} />
            Back to Plans
          </button>

          <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Confirm Plan Change</h3>
            <p className="text-sm text-text-secondary mb-6">
              You are about to change to the <strong>{selectedPlan.name}</strong> plan.
            </p>

            <div className="p-4 rounded-xl bg-gradient-to-br from-bg-base to-bg-card border border-border hover:border-primary-200 transition-colors mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Plan</span>
                <span className="text-sm font-medium text-text-primary">{selectedPlan.name}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Monthly Price</span>
                <span className="text-sm font-medium text-text-primary">${selectedPlan.monthlyPrice}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Yearly Price</span>
                <span className="text-sm font-medium text-text-primary">${selectedPlan.yearlyPrice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Message Limit</span>
                <span className="text-sm font-medium text-text-primary">{selectedPlan.messageLimit?.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedPlan(null)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-text-secondary bg-bg-base border border-border rounded-xl hover:border-primary-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:from-primary-500 hover:to-primary-600 transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50"
              >
                <Check size={14} />
                {upgrading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activePlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              current={subscription}
              onSelect={setSelectedPlan}
              selectable
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
