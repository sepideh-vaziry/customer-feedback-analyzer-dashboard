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
      <EmptyState
        icon={BarChart3}
        title="Analytics coming soon"
        description="Detailed analytics, reports, and data exports will be available here."
      />
    </DashboardLayout>
  );
}
