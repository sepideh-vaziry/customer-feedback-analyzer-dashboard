import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Settings"
        description="Manage your organization, integrations, and preferences"
      />
      <EmptyState
        icon={Settings}
        title="Settings coming soon"
        description="Organization settings, integrations, and user preferences will be available here."
      />
    </DashboardLayout>
  );
}
