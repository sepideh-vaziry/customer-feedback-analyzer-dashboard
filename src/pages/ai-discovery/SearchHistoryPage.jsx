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
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-danger-700 bg-gradient-to-r from-danger-50 to-danger-100 rounded-xl hover:from-danger-100 hover:to-danger-200 transition-all border border-danger-200 shadow-sm"
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
        <div className="bg-bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
          <table className="w-full text-sm">
            <thead className="bg-bg-base border-b border-border">
              <tr>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Query</th>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Date</th>
                <th className="text-right px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Results</th>
                <th className="text-right px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {history.map((item, i) => (
                <tr
                  key={i}
                  className="hover:bg-bg-base/50 cursor-pointer transition-colors"
                  onClick={() => handleClick(item.query)}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center shadow-sm">
                        <Search size={14} className="text-primary-600" />
                      </div>
                      <span className="font-semibold text-text-primary">{item.query}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {item.date ? new Date(item.date).toLocaleString() : '—'}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right text-text-secondary font-medium">
                    {item.resultCount ?? '—'}
                  </td>
                  <td className="px-4 py-3.5 text-right">
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
