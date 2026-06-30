import { useState, useEffect, useCallback, useMemo } from 'react';
import { RefreshCw, AlertTriangle, Lightbulb, Target, ShieldCheck, TrendingUp, Users, MessageSquare } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getHighRiskCustomers, getChurnRiskByLevel } from '../../services/churnRiskService';
import { getDashboardAnalytics } from '../../services/dashboardService';

function InsightCard({ icon: Icon, title, children, className = '' }) {
  return (
    <div className={`bg-bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center shadow-sm">
          <Icon size={16} className="text-primary-600" />
        </div>
        <h3 className="text-sm font-bold text-text-primary">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function SignalBar({ label, count, total, colorClass }) {
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-text-secondary font-medium">{label}</span>
        <span className="font-bold text-text-primary">{count} <span className="text-text-muted font-medium">({percent}%)</span></span>
      </div>
      <div className="h-2 w-full bg-bg-base rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-500`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default function RetentionInsightsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [highRiskCustomers, setHighRiskCustomers] = useState([]);
  const [criticalCustomers, setCriticalCustomers] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [analyticsData, highRiskData, criticalData] = await Promise.allSettled([
        getDashboardAnalytics('LAST_30_DAYS'),
        getHighRiskCustomers(100),
        getChurnRiskByLevel('CRITICAL'),
      ]);

      if (analyticsData.status === 'fulfilled') setAnalytics(analyticsData.value);
      if (highRiskData.status === 'fulfilled') setHighRiskCustomers(highRiskData.value || []);
      if (criticalData.status === 'fulfilled') setCriticalCustomers(criticalData.value || []);
    } catch (err) {
      setError('Failed to load retention insights.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const insights = useMemo(() => {
    const allAtRisk = [...highRiskCustomers, ...criticalCustomers];
    const signalCounts = {};
    let withSignals = 0;

    allAtRisk.forEach((c) => {
      if (c.signals && c.signals.length > 0) {
        withSignals++;
        c.signals.forEach((s) => {
          signalCounts[s] = (signalCounts[s] || 0) + 1;
        });
      }
    });

    const sortedSignals = Object.entries(signalCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    const breakdown = analytics?.churnRiskBreakdown;
    const total = breakdown?.totalCustomersAssessed || 0;
    const highCritical = (breakdown?.highCount || 0) + (breakdown?.criticalCount || 0);
    const atRiskPercent = total > 0 ? Math.round((highCritical / total) * 100) : 0;

    return {
      sortedSignals,
      withSignals,
      totalAtRisk: allAtRisk.length,
      atRiskPercent,
      totalAssessed: total,
      highCritical,
      criticalCount: breakdown?.criticalCount || 0,
      avgScore: total > 0
        ? Math.round(
            ((breakdown?.lowCount || 0) * 15 + (breakdown?.mediumCount || 0) * 40 + (breakdown?.highCount || 0) * 70 + (breakdown?.criticalCount || 0) * 90) / total
          )
        : 0,
    };
  }, [highRiskCustomers, criticalCustomers, analytics]);

  const opportunities = useMemo(() => {
    const ops = [];
    if (insights.criticalCount > 0) {
      ops.push({
        title: 'Critical Risk Intervention',
        description: `${insights.criticalCount} customer(s) are at critical risk and need immediate attention.`,
        impact: 'High',
      });
    }
    if (insights.atRiskPercent > 20) {
      ops.push({
        title: 'Proactive Outreach Campaign',
        description: `${insights.atRiskPercent}% of customers are at high or critical risk. Consider a targeted retention campaign.`,
        impact: 'High',
      });
    }
    if (insights.sortedSignals.some(([s]) => s.toLowerCase().includes('pricing') || s.toLowerCase().includes('cost'))) {
      ops.push({
        title: 'Pricing Review',
        description: 'Multiple at-risk customers mention pricing concerns. Review pricing strategy or offer retention discounts.',
        impact: 'Medium',
      });
    }
    if (insights.sortedSignals.some(([s]) => s.toLowerCase().includes('support') || s.toLowerCase().includes('service'))) {
      ops.push({
        title: 'Support Experience Improvement',
        description: 'Support experience is a recurring churn signal. Invest in faster resolution and better communication.',
        impact: 'Medium',
      });
    }
    if (insights.sortedSignals.some(([s]) => s.toLowerCase().includes('feature') || s.toLowerCase().includes('missing'))) {
      ops.push({
        title: 'Feature Gap Closure',
        description: 'Missing features are driving churn. Prioritize the most requested capabilities.',
        impact: 'Medium',
      });
    }
    if (ops.length === 0 && insights.totalAtRisk > 0) {
      ops.push({
        title: 'Monitor Risk Trends',
        description: 'Continue monitoring customer feedback for early churn signals.',
        impact: 'Low',
      });
    }
    return ops;
  }, [insights]);

  return (
    <DashboardLayout>
      <PageHeader
        title="Retention Insights"
        description="Discover opportunities to retain at-risk customers"
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

      {loading && !analytics ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <div className="bg-bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center shadow-sm">
                  <Users size={14} className="text-primary-600" />
                </div>
                <span className="text-xs font-bold text-text-muted uppercase tracking-wide">Customers Assessed</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">{insights.totalAssessed}</p>
            </div>
            <div className="bg-bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-danger-50 to-danger-100 flex items-center justify-center shadow-sm">
                  <AlertTriangle size={14} className="text-danger-600" />
                </div>
                <span className="text-xs font-bold text-text-muted uppercase tracking-wide">High + Critical</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">{insights.highCritical}</p>
              <p className="text-xs text-text-muted font-medium mt-1">{insights.atRiskPercent}% of total</p>
            </div>
            <div className="bg-bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-warning-50 to-warning-100 flex items-center justify-center shadow-sm">
                  <TrendingUp size={14} className="text-warning-600" />
                </div>
                <span className="text-xs font-bold text-text-muted uppercase tracking-wide">Avg Risk Score</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">{insights.avgScore}%</p>
            </div>
            <div className="bg-bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-success-50 to-success-100 flex items-center justify-center shadow-sm">
                  <MessageSquare size={14} className="text-success-600" />
                </div>
                <span className="text-xs font-bold text-text-muted uppercase tracking-wide">With Signals</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">{insights.withSignals}</p>
              <p className="text-xs text-text-muted font-medium mt-1">Of {insights.totalAtRisk} at-risk</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            <InsightCard icon={AlertTriangle} title="Most Common Churn Signals">
              {insights.sortedSignals.length === 0 ? (
                <EmptyState
                  icon={ShieldCheck}
                  title="No signals detected"
                  description="Churn signals will appear as customers are assessed."
                />
              ) : (
                <div className="mt-2">
                  {insights.sortedSignals.map(([signal, count]) => (
                    <SignalBar
                      key={signal}
                      label={signal}
                      count={count}
                      total={insights.withSignals}
                      colorClass="from-danger-400 to-danger-600"
                    />
                  ))}
                </div>
              )}
            </InsightCard>

            <InsightCard icon={Lightbulb} title="Retention Opportunities">
              {opportunities.length === 0 ? (
                <EmptyState
                  icon={ShieldCheck}
                  title="No opportunities yet"
                  description="Insights will appear as more data is collected."
                />
              ) : (
                <div className="space-y-3">
                  {opportunities.map((op, i) => (
                    <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-bg-base to-bg-card border border-border hover:border-primary-200 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold text-text-primary">{op.title}</p>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          op.impact === 'High' ? 'bg-danger-50 text-danger-700 border-danger-200' :
                          op.impact === 'Medium' ? 'bg-warning-50 text-warning-700 border-warning-200' :
                          'bg-success-50 text-success-700 border-success-200'
                        }`}>
                          {op.impact} Impact
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary font-medium leading-relaxed">{op.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </InsightCard>
          </div>

          <InsightCard icon={Target} title="Risk Distribution Summary">
            {insights.totalAssessed === 0 ? (
              <EmptyState
                icon={ShieldCheck}
                title="No assessment data"
                description="Risk distribution will appear once customers are evaluated."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                <div className="p-4 rounded-xl bg-gradient-to-br from-success-50 to-success-100 border border-success-200">
                  <p className="text-xs font-bold text-success-700 uppercase tracking-wide">Low Risk</p>
                  <p className="text-2xl font-bold text-success-800 mt-1">{analytics?.churnRiskBreakdown?.lowCount || 0}</p>
                  <p className="text-xs text-success-600 font-medium mt-1">
                    {insights.totalAssessed > 0 ? Math.round(((analytics?.churnRiskBreakdown?.lowCount || 0) / insights.totalAssessed) * 100) : 0}% of total
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
                  <p className="text-xs font-bold text-primary-700 uppercase tracking-wide">Medium Risk</p>
                  <p className="text-2xl font-bold text-primary-800 mt-1">{analytics?.churnRiskBreakdown?.mediumCount || 0}</p>
                  <p className="text-xs text-primary-600 font-medium mt-1">
                    {insights.totalAssessed > 0 ? Math.round(((analytics?.churnRiskBreakdown?.mediumCount || 0) / insights.totalAssessed) * 100) : 0}% of total
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-warning-50 to-warning-100 border border-warning-200">
                  <p className="text-xs font-bold text-warning-700 uppercase tracking-wide">High Risk</p>
                  <p className="text-2xl font-bold text-warning-800 mt-1">{analytics?.churnRiskBreakdown?.highCount || 0}</p>
                  <p className="text-xs text-warning-600 font-medium mt-1">
                    {insights.totalAssessed > 0 ? Math.round(((analytics?.churnRiskBreakdown?.highCount || 0) / insights.totalAssessed) * 100) : 0}% of total
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-danger-50 to-danger-100 border border-danger-200">
                  <p className="text-xs font-bold text-danger-700 uppercase tracking-wide">Critical Risk</p>
                  <p className="text-2xl font-bold text-danger-800 mt-1">{analytics?.churnRiskBreakdown?.criticalCount || 0}</p>
                  <p className="text-xs text-danger-600 font-medium mt-1">
                    {insights.totalAssessed > 0 ? Math.round(((analytics?.churnRiskBreakdown?.criticalCount || 0) / insights.totalAssessed) * 100) : 0}% of total
                  </p>
                </div>
              </div>
            )}
          </InsightCard>
        </>
      )}
    </DashboardLayout>
  );
}
