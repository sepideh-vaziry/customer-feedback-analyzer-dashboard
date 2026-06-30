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

      <div className="bg-bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="flex border-b border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border-b-2 transition-all duration-200 ${
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

      <div className="mt-6 bg-bg-card rounded-2xl border border-border p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
        <div>
          <h3 className="text-sm font-bold text-text-primary">Looking for automated imports?</h3>
          <p className="text-sm text-text-muted font-medium mt-1">
            Set up webhooks and connectors to receive feedback automatically from external systems.
          </p>
        </div>
        <button
          onClick={() => navigate('/connectors')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary-700 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl hover:from-primary-100 hover:to-primary-200 transition-all border border-primary-200 shadow-sm"
        >
          Go to Connectors
          <ArrowRight size={16} />
        </button>
      </div>
    </DashboardLayout>
  );
}
