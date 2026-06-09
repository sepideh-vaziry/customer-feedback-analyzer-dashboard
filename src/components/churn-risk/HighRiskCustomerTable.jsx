import { useState, useMemo } from 'react';
import { ArrowUpDown, Search, Eye, ShieldAlert } from 'lucide-react';
import RiskLevelBadge from './RiskLevelBadge';
import EmptyState from '../ui/EmptyState';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function HighRiskCustomerTable({ customers, loading, onView }) {
  const [sortConfig, setSortConfig] = useState({ key: 'riskScore', direction: 'desc' });
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filtered = useMemo(() => {
    let result = [...(customers || [])];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          (c.authorIdentifier && c.authorIdentifier.toLowerCase().includes(q)) ||
          (c.recommendation && c.recommendation.toLowerCase().includes(q))
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
  }, [customers, searchQuery, sortConfig]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!customers || customers.length === 0) {
    return <EmptyState icon={ShieldAlert} title="No high-risk customers" description="Churn risk assessments will appear as feedback is analyzed." />;
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
          placeholder="Search customers..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-bg-base border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
        />
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
                <SortHeader column="authorIdentifier">Customer</SortHeader>
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
                <SortHeader column="riskLevel">Risk Level</SortHeader>
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
                <SortHeader column="riskScore">Score</SortHeader>
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
                Recommendation
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {filtered.map((customer) => {
              const scorePercent = customer.riskScore != null ? Math.round(customer.riskScore * 100) : null;
              return (
                <tr key={customer.assessmentId} className="hover:bg-bg-base transition-colors">
                  <td className="py-3 px-4">
                    <p className="text-sm font-medium text-text-primary">{customer.authorIdentifier}</p>
                  </td>
                  <td className="py-3 px-4">
                    <RiskLevelBadge level={customer.riskLevel} />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 bg-bg-base rounded-full overflow-hidden">
                        <div
                          className="h-full bg-danger-500 rounded-full"
                          style={{ width: `${scorePercent || 0}%` }}
                        />
                      </div>
                      <span className="text-sm text-text-secondary">{scorePercent}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <p className="text-sm text-text-secondary line-clamp-2">{customer.recommendation || '—'}</p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onView?.(customer)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-text-muted">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
    </div>
  );
}
