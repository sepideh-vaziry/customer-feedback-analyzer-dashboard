import { Search, Bell, User, ChevronDown, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { auth, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-border/60 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full max-w-md group">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary-500" />
          <input
            type="text"
            placeholder="Search feedback, insights, or trends..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-bg-base border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all placeholder:text-text-placeholder"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-border-light border border-border">
            <span className="text-[10px] font-medium text-text-muted">⌘K</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <button className="relative p-2.5 rounded-xl hover:bg-bg-hover transition-all duration-200 group">
          <Bell size={18} className="text-text-secondary group-hover:text-text-primary transition-colors" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl hover:bg-bg-hover transition-all duration-200 border border-transparent hover:border-border"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
              {auth?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-text-primary leading-tight">{auth?.fullName || 'Guest'}</p>
              <p className="text-xs text-text-muted leading-tight">{auth?.email || ''}</p>
            </div>
            <ChevronDown size={14} className="text-text-muted" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-border shadow-xl shadow-black/5 py-1.5 animate-fade-in">
              <div className="px-4 py-3 border-b border-border-light">
                <p className="text-sm font-semibold text-text-primary">{auth?.fullName || 'Guest'}</p>
                <p className="text-xs text-text-muted mt-0.5">{auth?.email || ''}</p>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:text-danger-600 hover:bg-danger-50 transition-colors"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
