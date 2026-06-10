import { useState, useEffect } from 'react';
import { Search, Clock, Trash2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';

export default function SearchHistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('ai-discovery-history') || '[]');
      setHistory(stored);
    } catch {
      setHistory([]);
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('ai-discovery-history');
    setHistory([]);
  };

  const handleClick = (query) => {
    navigate(`/ai-discovery?search=${encodeURIComponent(query)}`);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Search History"
        description="Your recent AI discovery searches"
      >
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-danger-600 bg-danger-50 rounded-lg hover:bg-danger-100 transition-colors"
          >
            <Trash2 size={16} />
            Clear History
          </button>
        )}
      </PageHeader>

      {history.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No search history"
          description="Your AI discovery searches will appear here. Start searching from the Semantic Search page."
        />
      ) : (
        <div className="bg-bg-card rounded-xl border border-border shadow-xs overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg-base border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Query</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Date</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">Results</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {history.map((item, i) => (
                <tr
                  key={i}
                  className="hover:bg-bg-base/50 cursor-pointer"
                  onClick={() => handleClick(item.query)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Search size={14} className="text-primary-500" />
                      <span className="font-medium text-text-primary">{item.query}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {item.date ? new Date(item.date).toLocaleString() : '—'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-text-secondary">
                    {item.resultCount ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ArrowRight size={16} className="text-text-muted inline" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
