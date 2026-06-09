import { Activity, MessageSquare, Brain, Plug, ShieldAlert } from 'lucide-react';

const activityIcons = {
  feedback: MessageSquare,
  analysis: Brain,
  connector: Plug,
  churn: ShieldAlert,
};

const activityColors = {
  feedback: 'bg-primary-50 text-primary-600',
  analysis: 'bg-success-50 text-success-600',
  connector: 'bg-warning-50 text-warning-600',
  churn: 'bg-danger-50 text-danger-600',
};

export default function ActivityWidget({ activities, loading }) {
  if (loading) {
    return (
      <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs animate-pulse">
        <div className="h-5 bg-border-light rounded w-1/3 mb-6" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-border-light rounded" />
          ))}
        </div>
      </div>
    );
  }

  const items = activities || [
    { type: 'feedback', text: 'New feedback received from webhook', time: '2 min ago' },
    { type: 'analysis', text: 'AI analysis completed for 15 feedback items', time: '15 min ago' },
    { type: 'connector', text: 'Zendesk connector synchronized successfully', time: '1 hour ago' },
    { type: 'churn', text: 'High churn risk detected: Enterprise client', time: '3 hours ago' },
  ];

  return (
    <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
          <Activity size={16} className="text-primary-600" />
        </div>
        <h3 className="text-base font-semibold text-text-primary">Recent Activity</h3>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => {
          const Icon = activityIcons[item.type] || MessageSquare;
          const colorClass = activityColors[item.type] || activityColors.feedback;

          return (
            <div key={index} className="flex items-start gap-3">
              <div className={`p-1.5 rounded-md ${colorClass} flex-shrink-0 mt-0.5`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary">{item.text}</p>
                <p className="text-xs text-text-muted mt-0.5">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
