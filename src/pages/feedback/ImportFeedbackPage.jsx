import { useState } from 'react';
import { FileText, Upload, Webhook } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import ManualFeedbackForm from '../../components/feedback/ManualFeedbackForm';
import CsvUploadForm from '../../components/feedback/CsvUploadForm';
import WebhookDocumentation from '../../components/feedback/WebhookDocumentation';

const tabs = [
  { id: 'manual', label: 'Manual Entry', icon: FileText },
  { id: 'csv', label: 'CSV Upload', icon: Upload },
  { id: 'webhook', label: 'Webhook', icon: Webhook },
];

export default function ImportFeedbackPage() {
  const [activeTab, setActiveTab] = useState('manual');

  return (
    <DashboardLayout>
      <PageHeader
        title="Import Feedback"
        description="Add customer feedback through multiple channels"
      />

      <div className="bg-bg-card rounded-xl border border-border shadow-xs overflow-hidden">
        <div className="flex border-b border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'manual' && <ManualFeedbackForm />}
          {activeTab === 'csv' && <CsvUploadForm />}
          {activeTab === 'webhook' && <WebhookDocumentation />}
        </div>
      </div>
    </DashboardLayout>
  );
}
