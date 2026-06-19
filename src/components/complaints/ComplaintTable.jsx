import { useState, useMemo } from 'react';
import { ArrowUpDown, Search, Eye, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import ComplaintSeverityBadge from './ComplaintSeverityBadge';
import EmptyState from '../ui/EmptyState';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function ComplaintTable({ complaints, loading, onView }) {
  const [sortConfig, setSortConfig] = useState({ key: 'occurrenceCount', direction: 'desc' });
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filtered = useMemo(() => {
    let result = [...(complaints || [])];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          (c.categoryName && c.categoryName.toLowerCase().includes(q)) ||
          (c.description && c.description.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      const aVal = a[sortConfig.key] ?? 0;
      const bVal = b[sortConfig.key] ?? 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [complaints, searchQuery, sortConfig]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!complaints || complaints.length === 0) {
    return <EmptyState icon={Search} title="No complaints found" description="Complaints will appear as feedback is analyzed." />;
  }

  const SortHeader = ({ column, children }) => (
    <button onClick={() => handleSort(column)} className="flex items-center gap-1 hover:text-text-primary transition-colors">
      {children}
      <ArrowUpDown size={14} className="text-text-muted" />
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search complaints..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-bg-base border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
        />
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
                <SortHeader column="categoryName">Category</SortHeader>
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
                <SortHeader column="occurrenceCount">Occurrences</SortHeader>
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
                <SortHeader column="severityScore">Rate</SortHeader>
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
                Severity
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {filtered.map((complaint) => (
              <tr key={complaint.categoryId || complaint.id} className="hover:bg-bg-base transition-colors">
                <td className="py-3 px-4">
                  <p className="text-sm font-medium text-text-primary">{complaint.categoryName || 'Uncategorized'}</p>
                  {complaint.description && (
                    <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{complaint.description}</p>
                  )}
                </td>
                <td className="py-3 px-4 text-sm text-text-secondary">{complaint.occurrenceCount || 0}</td>
                <td className="py-3 px-4">
                  <span className="text-sm text-text-secondary">{complaint.severityScore != null ? `${complaint.severityScore.toFixed(1)}%` : '—'}</span>
                </td>
                <td className="py-3 px-4">
                  <ComplaintSeverityBadge severity={complaint.severity || 'MEDIUM'} />
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onView?.(complaint)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors"
                  >
                    <Eye size={14} />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-text-muted">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
    </div>
  );
}
