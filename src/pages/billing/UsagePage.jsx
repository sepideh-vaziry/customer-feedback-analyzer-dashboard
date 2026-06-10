import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle, Activity, Cpu, MessageSquare } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import UsageProgressBar from '../../components/billing/UsageProgressBar';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getTenantUsage, getQuotaStatus } from '../../services/billingService';

export default function UsagePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usage, setUsage] = useState(null);
  const [quota, setQuota] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [usageData, quotaData] = await Promise.allSettled([
        getTenantUsage(),
        getQuotaStatus(),
      ]);

      if (usageData.status === 'fulfilled') setUsage(usageData.value);
      if (quotaData.status === 'fulfilled') setQuota(quotaData.value);
    } catch (err) {
      setError('Failed to load usage data.');
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
        title="Usage"
        description="Monitor your organization's resource consumption"
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

      {loading && !usage && !quota ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      ) : !usage && !quota ? (
        <EmptyState
          icon={Activity}
          title="No usage data"
          description="Usage data will appear once your organization starts processing feedback."
        />
      ) : (
        <>
          {quota && (
            <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Cpu size={18} className="text-primary-500" />
                <h3 className="text-base font-semibold text-text-primary">Token Quota</h3>
              </div>
              <UsageProgressBar
                used={quota.consumedTokens || 0}
                limit={quota.budgetTokens || 1}
                label="Tokens Consumed"
              />
              {quota.budgetExceeded && (
                <div className="mt-4 p-3 rounded-lg bg-danger-50 border border-danger-200 text-sm text-danger-700">
                  You have exceeded your token budget for this billing period.
                </div>
              )}
            </div>
          )}

          {usage && (
            <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs mb-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare size={18} className="text-primary-500" />
                <h3 className="text-base font-semibold text-text-primary">AI Token Usage</h3>
              </div>
              <p className="text-sm text-text-muted mb-4">
                Billing Period: <span className="font-medium text-text-primary">{usage.billingPeriod}</span>
              </p>
              <UsageProgressBar
                used={usage.totalTokensUsed || 0}
                limit={usage.monthlyTokenBudget || 1}
                label="Total Tokens Used"
              />
            </div>
          )}

          {usage?.tokensByEventType && Object.keys(usage.tokensByEventType).length > 0 && (
            <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
              <h3 className="text-base font-semibold text-text-primary mb-4">Usage by Event Type</h3>
              <div className="space-y-4">
                {Object.entries(usage.tokensByEventType).map(([eventType, tokens]) => (
                  <div key={eventType} className="flex items-center justify-between p-3 rounded-lg bg-bg-base border border-border">
                    <span className="text-sm text-text-secondary capitalize">{eventType.replace(/_/g, ' ')}</span>
                    <span className="text-sm font-medium text-text-primary">{tokens.toLocaleString()} tokens</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
