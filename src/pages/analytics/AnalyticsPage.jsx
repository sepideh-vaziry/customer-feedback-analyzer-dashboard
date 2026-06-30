import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Analytics"
        description="Deep-dive analytics and reporting on customer feedback"
      />
      <div className="bg-bg-card rounded-2xl border border-border p-12 shadow-sm hover:shadow-md transition-shadow duration-300">
        <EmptyState
          icon={BarChart3}
          title="Analytics coming soon"
          description="Detailed analytics, reports, and data exports will be available here."
        />
      </div>
    </DashboardLayout>
  );
}
