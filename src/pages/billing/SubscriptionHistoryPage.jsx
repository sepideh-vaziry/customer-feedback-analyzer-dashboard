import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle, Calendar, ArrowUpCircle, ArrowDownCircle, RotateCcw, XCircle, Clock } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getCurrentSubscription, getAvailablePlans } from '../../services/billingService';

const actionIcons = {
  UPGRADE: ArrowUpCircle,
  DOWNGRADE: ArrowDownCircle,
  RENEWAL: RotateCcw,
  CANCELLATION: XCircle,
};

const actionLabels = {
  UPGRADE: 'Upgrade',
  DOWNGRADE: 'Downgrade',
  RENEWAL: 'Renewal',
  CANCELLATION: 'Cancellation',
};

export default function SubscriptionHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);

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
      setError('Failed to load subscription history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const currentPlan = plans.find((p) => p.id === subscription?.subscriptionPlanId);

  const history = [];
  if (subscription?.createdAt) {
    history.push({
      id: 'start',
      action: 'UPGRADE',
      date: subscription.createdAt,
      oldPlan: null,
      newPlan: currentPlan?.name || 'Unknown',
    });
  }
  if (subscription?.canceledAt) {
    history.push({
      id: 'cancel',
      action: 'CANCELLATION',
      date: subscription.canceledAt,
      oldPlan: currentPlan?.name || 'Unknown',
      newPlan: null,
    });
  }

  const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <DashboardLayout>
      <PageHeader
        title="Subscription History"
        description="Track changes to your subscription"
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

      {loading && sortedHistory.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      ) : sortedHistory.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No subscription history"
          description="Subscription history will appear here as changes are made to your plan."
        />
      ) : (
        <div className="bg-bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
          <table className="w-full text-sm">
            <thead className="bg-bg-base border-b border-border">
              <tr>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Action</th>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Old Plan</th>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">New Plan</th>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedHistory.map((item) => {
                const Icon = actionIcons[item.action] || Clock;
                return (
                  <tr key={item.id} className="hover:bg-bg-base/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center shadow-sm">
                          <Icon size={14} className="text-primary-600" />
                        </div>
                        <span className="font-semibold text-text-primary">{actionLabels[item.action] || item.action}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-text-secondary font-medium">{item.oldPlan || '—'}</td>
                    <td className="px-4 py-3.5 text-text-secondary font-medium">{item.newPlan || '—'}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-text-secondary font-medium">
                        <Calendar size={14} />
                        {item.date ? new Date(item.date).toLocaleString() : '—'}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
