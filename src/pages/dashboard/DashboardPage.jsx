import { MessageSquare, ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import SentimentDistribution from '../../components/charts/SentimentDistribution';
import FeedbackTrends from '../../components/charts/FeedbackTrends';
import ComplaintCategories from '../../components/charts/ComplaintCategories';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        description="Overview of your customer feedback and AI insights"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Feedback"
          value="3,420"
          change="12.5"
          changeType="positive"
          icon={MessageSquare}
        />
        <StatCard
          title="Positive Sentiment"
          value="62%"
          change="3.2"
          changeType="positive"
          icon={ThumbsUp}
        />
        <StatCard
          title="Negative Sentiment"
          value="14%"
          change="1.8"
          changeType="negative"
          icon={ThumbsDown}
        />
        <StatCard
          title="Open Complaints"
          value="154"
          change="8"
          changeType="negative"
          icon={AlertCircle}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <FeedbackTrends />
        <SentimentDistribution />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComplaintCategories />
        <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
          <h3 className="text-base font-semibold text-text-primary mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              { text: 'New negative review on Instagram', time: '2 min ago', type: 'negative' },
              { text: 'Feature request received via survey', time: '15 min ago', type: 'neutral' },
              { text: 'Positive feedback from support ticket', time: '1 hour ago', type: 'positive' },
              { text: 'Churn risk alert: Enterprise client', time: '3 hours ago', type: 'negative' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                    item.type === 'positive'
                      ? 'bg-success-500'
                      : item.type === 'negative'
                        ? 'bg-danger-500'
                        : 'bg-warning-500'
                  }`}
                />
                <div>
                  <p className="text-sm text-text-primary">{item.text}</p>
                  <p className="text-xs text-text-muted mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
