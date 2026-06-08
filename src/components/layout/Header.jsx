import { Search, Bell, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { auth, logout } = useAuth();

  return (
    <header className="h-16 bg-bg-header border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search feedback, insights, or trends..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-bg-base border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-border-light transition-colors">
          <Bell size={18} className="text-text-secondary" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <User size={16} className="text-primary-600" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-text-primary">{auth?.fullName || 'Guest'}</p>
            <p className="text-xs text-text-muted">{auth?.email || ''}</p>
          </div>
          <button
            onClick={logout}
            className="ml-2 px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-danger-600 hover:bg-danger-50 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
