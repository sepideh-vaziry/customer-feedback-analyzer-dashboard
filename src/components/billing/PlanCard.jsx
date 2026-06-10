import { Check, Zap } from 'lucide-react';

export default function PlanCard({ plan, current, onSelect, selectable = false }) {
  const isCurrent = current?.subscriptionPlanId === plan.id;

  const features = [
    { label: 'AI Recommendations', enabled: plan.aiRecommendationsEnabled },
    { label: 'Trend Analysis', enabled: plan.trendAnalysisEnabled },
    { label: 'Churn Detection', enabled: plan.churnDetectionEnabled },
  ];

  return (
    <div className={`p-6 rounded-xl border transition-all ${
      isCurrent
        ? 'border-primary-500 bg-primary-50/30'
        : 'border-border bg-bg-card hover:border-primary-300'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">{plan.name}</h3>
        {isCurrent && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
            Current
          </span>
        )}
      </div>

      <p className="text-sm text-text-secondary mb-4">{plan.description}</p>

      <div className="mb-4">
        <span className="text-3xl font-bold text-text-primary">${plan.monthlyPrice}</span>
        <span className="text-sm text-text-muted">/month</span>
        {plan.yearlyPrice > 0 && (
          <p className="text-xs text-text-muted mt-1">
            or ${plan.yearlyPrice}/year
          </p>
        )}
      </div>

      <div className="mb-4">
        <p className="text-sm text-text-secondary">
          <span className="font-medium text-text-primary">{plan.messageLimit?.toLocaleString()}</span> messages/month
        </p>
      </div>

      <div className="space-y-2 mb-6">
        {features.map((f) => (
          <div key={f.label} className="flex items-center gap-2 text-sm">
            <Check size={14} className={f.enabled ? 'text-success-500' : 'text-text-muted'} />
            <span className={f.enabled ? 'text-text-primary' : 'text-text-muted line-through'}>
              {f.label}
            </span>
          </div>
        ))}
      </div>

      {selectable && !isCurrent && (
        <button
          onClick={() => onSelect?.(plan)}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Zap size={14} />
          Select Plan
        </button>
      )}

      {isCurrent && (
        <button
          disabled
          className="w-full px-4 py-2.5 text-sm font-medium text-text-secondary bg-bg-base border border-border rounded-lg cursor-default"
        >
          Current Plan
        </button>
      )}
    </div>
  );
}
