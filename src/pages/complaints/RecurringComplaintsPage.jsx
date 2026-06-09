import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import ComplaintTable from '../../components/complaints/ComplaintTable';
import ComplaintDetailsDrawer from '../../components/complaints/ComplaintDetailsDrawer';
import { getRecurringComplaints } from '../../services/complaintService';

export default function RecurringComplaintsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getRecurringComplaints(90, 100);
      setComplaints(data || []);
    } catch (err) {
      setError('Failed to load recurring complaints.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <DashboardLayout>
      <PageHeader
        title="Recurring Complaints"
        description="Complaints that appear across multiple feedback items"
      >
        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary bg-bg-card border border-border rounded-lg hover:border-primary-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </PageHeader>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-danger-50 border border-danger-200 text-sm text-danger-700 flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
        <ComplaintTable
          complaints={complaints}
          loading={loading}
          onView={setSelectedComplaint}
        />
      </div>

      {selectedComplaint && (
        <ComplaintDetailsDrawer
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </DashboardLayout>
  );
}
