import { useState, useEffect, useCallback } from 'react';
import { Tag, RefreshCw, AlertTriangle, ArrowUpDown } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getComplaintCategories, getRecurringComplaints } from '../../services/complaintService';

export default function ComplaintCategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryStats, setCategoryStats] = useState({});

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [categoriesData, complaintsData] = await Promise.allSettled([
        getComplaintCategories(),
        getRecurringComplaints(90, 100),
      ]);

      if (categoriesData.status === 'fulfilled') {
        setCategories(categoriesData.value || []);
      }

      if (complaintsData.status === 'fulfilled') {
        const stats = {};
        (complaintsData.value || []).forEach((c) => {
          stats[c.categoryName] = c;
        });
        setCategoryStats(stats);
      }
    } catch (err) {
      setError('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <DashboardLayout>
        <PageHeader title="Complaint Categories" description="All complaint categories detected by AI" />
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Complaint Categories"
        description="All complaint categories detected by AI"
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

      {categories.length === 0 ? (
        <EmptyState icon={Tag} title="No categories found" description="Categories will appear as feedback is analyzed." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const stats = categoryStats[category];
            return (
              <div
                key={category}
                className="bg-bg-card rounded-xl border border-border p-5 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-danger-50 flex items-center justify-center">
                      <Tag size={16} className="text-danger-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary">{category}</h3>
                  </div>
                </div>

                {stats ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-muted">Occurrences</span>
                      <span className="text-sm font-medium text-text-primary">{stats.occurrenceCount || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-muted">Rate</span>
                      <span className="text-sm font-medium text-text-primary">
                        {stats.occurrenceRate ? `${(stats.occurrenceRate * 100).toFixed(1)}%` : '—'}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-bg-base rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-danger-500 rounded-full"
                        style={{ width: `${Math.min((stats.occurrenceCount || 0) * 2, 100)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-text-muted">No data for this period</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
