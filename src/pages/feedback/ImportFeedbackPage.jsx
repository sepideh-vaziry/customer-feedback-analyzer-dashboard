import { useState } from 'react';
import { FileText, Upload, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import ManualFeedbackForm from '../../components/feedback/ManualFeedbackForm';
import CsvUploadForm from '../../components/feedback/CsvUploadForm';

const tabs = [
  { id: 'manual', label: 'Manual Entry', icon: FileText },
  { id: 'csv', label: 'CSV Upload', icon: Upload },
];

export default function ImportFeedbackPage() {
  const [activeTab, setActiveTab] = useState('manual');
  const navigate = useNavigate();

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
        </div>
      </div>

      <div className="mt-6 bg-bg-card rounded-xl border border-border p-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Looking for automated imports?</h3>
          <p className="text-sm text-text-secondary mt-1">
            Set up webhooks and connectors to receive feedback automatically from external systems.
          </p>
        </div>
        <button
          onClick={() => navigate('/connectors')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
        >
          Go to Connectors
          <ArrowRight size={16} />
        </button>
      </div>
    </DashboardLayout>
  );
}
