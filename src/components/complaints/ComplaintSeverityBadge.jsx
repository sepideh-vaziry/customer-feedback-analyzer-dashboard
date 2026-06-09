import { ShieldCheck, AlertCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

const config = {
  LOW: { color: 'text-success-600', bg: 'bg-success-50', border: 'border-success-200', icon: ShieldCheck, label: 'Low' },
  MEDIUM: { color: 'text-warning-600', bg: 'bg-warning-50', border: 'border-warning-200', icon: AlertCircle, label: 'Medium' },
  HIGH: { color: 'text-danger-600', bg: 'bg-danger-50', border: 'border-danger-200', icon: AlertTriangle, label: 'High' },
  CRITICAL: { color: 'text-danger-700', bg: 'bg-danger-100', border: 'border-danger-300', icon: ShieldAlert, label: 'Critical' },
};

export default function ComplaintSeverityBadge({ severity, showIcon = true }) {
  const meta = config[severity] || config.MEDIUM;
  const Icon = meta.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${meta.bg} ${meta.color} ${meta.border}`}>
      {showIcon && <Icon size={12} />}
      {meta.label}
    </span>
  );
}
