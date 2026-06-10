import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle, Calendar, CreditCard, Users, RotateCcw, XCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import SubscriptionStatusBadge from '../../components/billing/SubscriptionStatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getCurrentSubscription, getAvailablePlans, cancelSubscription } from '../../services/billingService';

export default function CurrentPlanPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [subData, plansData] = await Promise.allSettled([
        getCurrentSubscription(),
        getAvailablePlans(),
      ]);

      if (subData.status === 'fulfilled') setSubscription(subData.value);
      if (plansData.status === 'fulfilled') setPlans(plansData.value || []);
    } catch (err) {
      setError('Failed to load subscription data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const currentPlan = plans.find((p) => p.id === subscription?.subscriptionPlanId);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelSubscription();
      await loadData();
      setShowCancelConfirm(false);
    } catch {
      setError('Failed to cancel subscription.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <PageHeader title="Current Plan" description="Your subscription details" />
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Current Plan"
        description="Your subscription details"
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

      {!subscription ? (
        <EmptyState
          icon={CreditCard}
          title="No subscription found"
          description="You don't have an active subscription. Browse available plans to get started."
        />
      ) : (
        <>
          <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-text-primary">{currentPlan?.name || 'Unknown Plan'}</h2>
                <p className="text-sm text-text-muted mt-1">{currentPlan?.description}</p>
              </div>
              <SubscriptionStatusBadge status={subscription.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-bg-base border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard size={14} className="text-primary-500" />
                  <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Price</span>
                </div>
                <p className="text-lg font-semibold text-text-primary">
                  ${subscription.billingCycle === 'YEARLY' ? currentPlan?.yearlyPrice : currentPlan?.monthlyPrice}
                  <span className="text-sm text-text-muted font-normal">/{subscription.billingCycle === 'YEARLY' ? 'year' : 'month'}</span>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-bg-base border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-primary-500" />
                  <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Start Date</span>
                </div>
                <p className="text-lg font-semibold text-text-primary">
                  {subscription.startDate ? new Date(subscription.startDate).toLocaleDateString() : '—'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-bg-base border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <RotateCcw size={14} className="text-primary-500" />
                  <span className="text-xs font-medium text-text-muted uppercase tracking-wide">End Date</span>
                </div>
                <p className="text-lg font-semibold text-text-primary">
                  {subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : '—'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-bg-base border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Users size={14} className="text-primary-500" />
                  <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Seats</span>
                </div>
                <p className="text-lg font-semibold text-text-primary">{subscription.seats || 1}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {subscription.autoRenew && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-success-50 text-success-700 border border-success-200">
                  Auto-renew enabled
                </span>
              )}
              {subscription.trial && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-200">
                  Trial
                </span>
              )}
            </div>
          </div>

          {subscription.status === 'ACTIVE' && (
            <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
              <h3 className="text-base font-semibold text-text-primary mb-4">Plan Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-danger-600 bg-danger-50 rounded-lg hover:bg-danger-100 transition-colors"
                >
                  <XCircle size={16} />
                  Cancel Subscription
                </button>
              </div>
            </div>
          )}

          {showCancelConfirm && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
              <div className="bg-bg-card rounded-xl border border-border shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-2">Cancel Subscription?</h3>
                <p className="text-sm text-text-secondary mb-6">
                  Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="px-4 py-2 text-sm font-medium text-text-secondary bg-bg-base border border-border rounded-lg hover:border-primary-300 transition-colors"
                  >
                    Keep Subscription
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="px-4 py-2 text-sm font-medium text-white bg-danger-600 rounded-lg hover:bg-danger-700 transition-colors disabled:opacity-50"
                  >
                    {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
