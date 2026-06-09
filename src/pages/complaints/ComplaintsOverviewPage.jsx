import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, TrendingUp, MessageSquare, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import KpiCard from '../../components/dashboard/KpiCard';
import ComplaintTrendChart from '../../components/complaints/ComplaintTrendChart';
import ComplaintTable from '../../components/complaints/ComplaintTable';
import ComplaintDetailsDrawer from '../../components/complaints/ComplaintDetailsDrawer';
import {
  getRecurringComplaints,
  getComplaintCategories,
} from '../../services/complaintService';
import { getDashboardTrends } from '../../services/dashboardService';

export default function ComplaintsOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trends, setTrends] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [complaintsData, categoriesData, trendsData] = await Promise.allSettled([
        getRecurringComplaints(30, 10),
        getComplaintCategories(),
        getDashboardTrends('LAST_30_DAYS'),
      ]);

      if (complaintsData.status === 'fulfilled') setComplaints(complaintsData.value || []);
      if (categoriesData.status === 'fulfilled') setCategories(categoriesData.value || []);
      if (trendsData.status === 'fulfilled') setTrends(trendsData.value);
    } catch (err) {
      setError('Failed to load complaint data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalOccurrences = complaints.reduce((sum, c) => sum + (c.occurrenceCount || 0), 0);

  return (
    <DashboardLayout>
      <PageHeader
        title="Complaint Intelligence"
        description="Identify, monitor, and prioritize customer complaints"
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

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          title="Total Complaints"
          value={totalOccurrences.toString()}
          icon={MessageSquare}
          loading={loading}
        />
        <KpiCard
          title="Categories"
          value={categories.length.toString()}
          icon={AlertTriangle}
          loading={loading}
        />
        <KpiCard
          title="Top Complaint"
          value={complaints[0]?.categoryName || '—'}
          icon={TrendingUp}
          loading={loading}
        />
        <KpiCard
          title="Recurring Issues"
          value={complaints.length.toString()}
          icon={AlertTriangle}
          loading={loading}
        />
      </div>

      {/* Trend Chart */}
      <div className="mb-6">
        <ComplaintTrendChart data={trends?.complaintTrend} loading={loading} />
      </div>

      {/* Complaints Table */}
      <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
        <h3 className="text-base font-semibold text-text-primary mb-4">Recurring Complaints</h3>
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
