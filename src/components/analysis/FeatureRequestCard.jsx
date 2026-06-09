import { Lightbulb, ArrowUp, ArrowDown, Minus } from 'lucide-react';

const priorityConfig = {
  LOW: { color: 'text-success-600', bg: 'bg-success-50', border: 'border-success-200', icon: ArrowDown },
  MEDIUM: { color: 'text-warning-600', bg: 'bg-warning-50', border: 'border-warning-200', icon: Minus },
  HIGH: { color: 'text-danger-600', bg: 'bg-danger-50', border: 'border-danger-200', icon: ArrowUp },
};

export default function FeatureRequestCard({ featureRequests }) {
  if (!featureRequests || featureRequests.length === 0) {
    return (
      <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-warning-50 flex items-center justify-center">
            <Lightbulb size={16} className="text-warning-600" />
          </div>
          <h3 className="text-base font-semibold text-text-primary">Feature Requests</h3>
        </div>
        <div className="text-center py-6 bg-bg-base rounded-lg border border-border">
          <Lightbulb size={20} className="text-text-muted mx-auto mb-2" />
          <p className="text-sm text-text-muted">No feature requests detected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-warning-50 flex items-center justify-center">
            <Lightbulb size={16} className="text-warning-600" />
          </div>
          <h3 className="text-base font-semibold text-text-primary">Feature Requests</h3>
        </div>
        <span className="text-xs font-medium text-text-muted bg-bg-base px-2 py-1 rounded-md border border-border">
          {featureRequests.length} detected
        </span>
      </div>

      <div className="space-y-3">
        {featureRequests.map((feature) => {
          const config = priorityConfig[feature.priority] || priorityConfig.MEDIUM;
          const Icon = config.icon;

          return (
            <div
              key={feature.id}
              className={`p-3 rounded-lg border ${config.border} ${config.bg}`}
            >
              <div className="flex items-start gap-3">
                <Icon size={16} className={`mt-0.5 ${config.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-text-primary">
                      {feature.title || feature.clusterName || 'Untitled'}
                    </p>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${config.bg} ${config.color} border ${config.border}`}>
                      {feature.priority}
                    </span>
                  </div>
                  {feature.description && (
                    <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                      {feature.description}
                    </p>
                  )}
                  {feature.clusterName && feature.title && (
                    <p className="text-xs text-text-muted mt-1">Cluster: {feature.clusterName}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
