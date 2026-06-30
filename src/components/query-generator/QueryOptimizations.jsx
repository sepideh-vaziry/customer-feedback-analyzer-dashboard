import { Zap, TrendingUp, Database, Layers, ArrowUpRight } from 'lucide-react';

const TYPE_META = {
  INDEX: { label: 'Index', icon: Database, accent: 'text-primary-600 bg-primary-50' },
  JOIN_ORDER: { label: 'Join Order', icon: Layers, accent: 'text-accent-600 bg-accent-50' },
  PARTITIONING: { label: 'Partitioning', icon: TrendingUp, accent: 'text-warning-600 bg-warning-50' },
  LIMIT: { label: 'Limit', icon: ArrowUpRight, accent: 'text-success-600 bg-success-50' },
};

export default function QueryOptimizations({ suggestions = [] }) {
  if (!suggestions.length) return null;

  return (
    <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-warning-50 text-warning-600">
          <Zap size={16} />
        </div>
        <h3 className="text-base font-bold text-text-primary">
          Optimization Suggestions
        </h3>
        <span className="text-xs font-semibold text-text-muted ml-1">
          {suggestions.length}
        </span>
      </div>

      <ul className="space-y-3">
        {suggestions.map((s, idx) => {
          const meta = TYPE_META[s.type] || TYPE_META.INDEX;
          const Icon = meta.icon;
          const improvement = s.estimatedImprovementPercent;
          return (
            <li
              key={idx}
              className="p-4 rounded-xl border border-border bg-bg-base hover:border-primary-200 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded-lg shrink-0 ${meta.accent}`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                      {meta.label}
                    </span>
                    {improvement != null && improvement > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-success-700 bg-success-50 px-2 py-0.5 rounded-full">
                        <TrendingUp size={10} />
                        ~{Math.round(improvement)}% faster
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-primary leading-relaxed">
                    {s.suggestion}
                  </p>
                  {s.suggestedSql && (
                    <pre className="mt-2 px-3 py-2 bg-slate-900 text-slate-100 text-xs font-mono rounded-lg overflow-x-auto">
                      {s.suggestedSql}
                    </pre>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
