import { useState, useMemo } from 'react';
import { ArrowUpDown, Search, Eye, TrendingUp, TrendingDown } from 'lucide-react';
import FeatureRequestBadge from './FeatureRequestBadge';
import EmptyState from '../ui/EmptyState';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function FeatureRequestRankingTable({ features, loading, onView }) {
  const [sortConfig, setSortConfig] = useState({ key: 'occurrenceCount', direction: 'desc' });
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filtered = useMemo(() => {
    let result = [...(features || [])];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          (f.clusterName && f.clusterName.toLowerCase().includes(q)) ||
          (f.title && f.title.toLowerCase().includes(q)) ||
          (f.description && f.description.toLowerCase().includes(q))
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
  }, [features, searchQuery, sortConfig]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!features || features.length === 0) {
    return <EmptyState icon={Search} title="No feature requests found" description="Feature requests will appear as feedback is analyzed." />;
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
          placeholder="Search feature requests..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-bg-base border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
        />
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
                <SortHeader column="clusterName">Feature</SortHeader>
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
                <SortHeader column="occurrenceCount">Occurrences</SortHeader>
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
                <SortHeader column="demandScore">Demand Rate</SortHeader>
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
                Priority
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {filtered.map((feature) => (
              <tr key={feature.clusterId || feature.id} className="hover:bg-bg-base transition-colors">
                <td className="py-3 px-4">
                  <p className="text-sm font-medium text-text-primary">{feature.clusterName || feature.title || 'Untitled'}</p>
                  {feature.description && (
                    <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{feature.description}</p>
                  )}
                </td>
                <td className="py-3 px-4 text-sm text-text-secondary">{feature.occurrenceCount || 0}</td>
                <td className="py-3 px-4">
                  <span className="text-sm text-text-secondary">
                    {feature.demandScore != null ? `${feature.demandScore.toFixed(1)}%` : '—'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <FeatureRequestBadge priority={feature.priority || 'MEDIUM'} />
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onView?.(feature)}
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
