import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import { MessageSquare } from 'lucide-react';

export default function FeedbackPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Feedback"
        description="Manage and review customer feedback from all channels"
      />
      <EmptyState
        icon={MessageSquare}
        title="No feedback yet"
        description="Feedback from Instagram, WhatsApp, support tickets, and surveys will appear here."
      />
    </DashboardLayout>
  );
}
