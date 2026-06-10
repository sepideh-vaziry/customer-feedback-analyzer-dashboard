import { useState } from 'react';
import { Search, Building2, Users, CreditCard, Activity, ArrowRight } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/ui/PageHeader';

function ToolCard({ icon: Icon, title, description, placeholder, onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <div className="bg-bg-card rounded-xl border border-border p-5 shadow-xs">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
          <Icon size={18} className="text-primary-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
          <p className="text-xs text-text-muted">{description}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-sm bg-bg-base border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        />
        <button
          type="submit"
          className="px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}

export default function SupportToolsPage() {
  const [results, setResults] = useState(null);

  const handleOrgLookup = (query) => {
    setResults({ type: 'organization', query });
  };

  const handleUserLookup = (query) => {
    setResults({ type: 'user', query });
  };

  const handleSubscriptionLookup = (query) => {
    setResults({ type: 'subscription', query });
  };

  const handleUsageLookup = (query) => {
    setResults({ type: 'usage', query });
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Support Tools"
        description="Quick-access lookup tools for support operations"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <ToolCard
          icon={Building2}
          title="Organization Lookup"
          description="Find organizations by name or ID"
          placeholder="Enter organization name or ID..."
          onSearch={handleOrgLookup}
        />
        <ToolCard
          icon={Users}
          title="User Lookup"
          description="Find users by email or ID"
          placeholder="Enter user email or ID..."
          onSearch={handleUserLookup}
        />
        <ToolCard
          icon={CreditCard}
          title="Subscription Lookup"
          description="Find subscriptions by organization"
          placeholder="Enter organization name or ID..."
          onSearch={handleSubscriptionLookup}
        />
        <ToolCard
          icon={Activity}
          title="Usage Lookup"
          description="Find usage by organization or user"
          placeholder="Enter organization or user ID..."
          onSearch={handleUsageLookup}
        />
      </div>

      {results && (
        <div className="bg-bg-card rounded-xl border border-border p-5 shadow-xs">
          <h3 className="text-sm font-semibold text-text-primary mb-3 capitalize">
            {results.type} Lookup Results
          </h3>
          <p className="text-sm text-text-muted">
            Searched for: <span className="font-medium text-text-secondary">{results.query}</span>
          </p>
          <div className="mt-4 p-4 bg-bg-base rounded-lg text-sm text-text-muted">
            Lookup results will appear here once the backend API is implemented.
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
