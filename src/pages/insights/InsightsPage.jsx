import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import { Sparkles } from 'lucide-react';

export default function InsightsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="AI Insights"
        description="AI-generated summaries, recommendations, and anomaly detection"
      />
      <div className="bg-bg-card rounded-2xl border border-border p-12 shadow-sm hover:shadow-md transition-shadow duration-300">
        <EmptyState
          icon={Sparkles}
          title="AI Insights coming soon"
          description="AI-powered analysis, recommendations, and summaries will appear here."
        />
      </div>
    </DashboardLayout>
  );
}
