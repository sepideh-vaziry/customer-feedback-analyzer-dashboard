import { Activity, MessageSquare, Brain, Plug, ShieldAlert } from 'lucide-react';

const activityIcons = {
  feedback: MessageSquare,
  analysis: Brain,
  connector: Plug,
  churn: ShieldAlert,
};

const activityColors = {
  feedback: 'bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600',
  analysis: 'bg-gradient-to-br from-success-50 to-success-100 text-success-600',
  connector: 'bg-gradient-to-br from-warning-50 to-warning-100 text-warning-600',
  churn: 'bg-gradient-to-br from-danger-50 to-danger-100 text-danger-600',
};

export default function ActivityWidget({ activities, loading }) {
  if (loading) {
    return (
      <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm animate-pulse">
        <div className="skeleton h-5 w-1/3 mb-6" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-12 rounded-xl" />
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
    <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center shadow-sm">
          <Activity size={18} className="text-primary-600" />
        </div>
        <h3 className="text-base font-bold text-text-primary">Recent Activity</h3>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => {
          const Icon = activityIcons[item.type] || MessageSquare;
          const colorClass = activityColors[item.type] || activityColors.feedback;

          return (
            <div key={index} className="flex items-start gap-3 p-3 rounded-xl hover:bg-bg-hover transition-colors duration-200 group">
              <div className={`p-2 rounded-lg ${colorClass} flex-shrink-0 mt-0.5 shadow-sm`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary group-hover:text-primary-700 transition-colors">{item.text}</p>
                <p className="text-xs text-text-muted font-medium mt-0.5">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
