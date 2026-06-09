import { X, ShieldAlert, Users, MessageSquare, TrendingUp, TrendingDown, ArrowRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import RiskLevelBadge from './RiskLevelBadge';
import { assessChurnRisk } from '../../services/churnRiskService';

export default function CustomerRiskDrawer({ customer, onClose, onRefresh }) {
  const navigate = useNavigate();
  const [assessing, setAssessing] = useState(false);

  if (!customer) return null;

  const scorePercent = customer.riskScore != null ? Math.round(customer.riskScore * 100) : null;

  const handleAssess = async () => {
    if (!customer.authorIdentifier) return;
    setAssessing(true);
    try {
      await assessChurnRisk(customer.authorIdentifier);
      onRefresh?.();
    } catch {
      // ignore
    } finally {
      setAssessing(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-bg-card border-l border-border shadow-xl z-50 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">{customer.authorIdentifier}</h2>
              <p className="text-sm text-text-muted mt-1">Customer churn risk profile</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-border-light text-text-muted hover:text-text-primary transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className={`p-4 rounded-xl border mb-6 ${scorePercent && scorePercent >= 70 ? 'border-danger-200 bg-danger-50' : scorePercent && scorePercent >= 40 ? 'border-warning-200 bg-warning-50' : 'border-success-200 bg-success-50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Risk Score</p>
                <p className={`text-3xl font-semibold ${scorePercent && scorePercent >= 70 ? 'text-danger-700' : scorePercent && scorePercent >= 40 ? 'text-warning-700' : 'text-success-700'}`}>
                  {scorePercent}%
                </p>
              </div>
              <RiskLevelBadge level={customer.riskLevel} />
            </div>
            <div className="h-2 w-full bg-white/60 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-danger-500 transition-all duration-500"
                style={{ width: `${scorePercent || 0}%` }}
              />
            </div>
          </div>

          {customer.signals && customer.signals.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Churn Signals</p>
              <div className="flex flex-wrap gap-1.5">
                {customer.signals.map((signal, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium px-2 py-1 rounded-md bg-bg-base text-text-secondary border border-border"
                  >
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          )}

          {customer.recommendation && (
            <div className="mb-6">
              <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Recommendation</p>
              <div className="p-4 rounded-xl bg-bg-base border border-border">
                <p className="text-sm text-text-primary leading-relaxed">{customer.recommendation}</p>
              </div>
            </div>
          )}

          {customer.assessedFeedbackCount != null && (
            <div className="mb-6">
              <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Assessment Basis</p>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <MessageSquare size={14} />
                Based on {customer.assessedFeedbackCount} feedback item(s)
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleAssess}
              disabled={assessing}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={assessing ? 'animate-spin' : ''} />
              {assessing ? 'Assessing...' : 'Reassess Risk'}
            </button>
            <button
              onClick={() => { onClose(); navigate(`/feedback?search=${encodeURIComponent(customer.authorIdentifier)}`); }}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-text-secondary bg-bg-base border border-border rounded-lg hover:border-primary-300 transition-colors"
            >
              View Feedback
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
