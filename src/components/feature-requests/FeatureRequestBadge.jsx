import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

const config = {
  LOW: { color: 'text-success-600', bg: 'bg-success-50', border: 'border-success-200', icon: ArrowDown, label: 'Low' },
  MEDIUM: { color: 'text-warning-600', bg: 'bg-warning-50', border: 'border-warning-200', icon: Minus, label: 'Medium' },
  HIGH: { color: 'text-danger-600', bg: 'bg-danger-50', border: 'border-danger-200', icon: ArrowUp, label: 'High' },
};

export default function FeatureRequestBadge({ priority }) {
  const meta = config[priority] || config.MEDIUM;
  const Icon = meta.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${meta.bg} ${meta.color} ${meta.border}`}>
      <Icon size={12} />
      {meta.label}
    </span>
  );
}
