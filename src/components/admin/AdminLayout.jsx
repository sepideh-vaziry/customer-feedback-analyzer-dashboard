import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Cpu,
  HeartPulse,
  ClipboardList,
  Settings,
  Wrench,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { useState } from 'react';
import logo from '../../assets/logo.png';

const adminNavItems = [
  { to: '/admin', label: 'Platform Overview', icon: LayoutDashboard },
  { to: '/admin/organizations', label: 'Organizations', icon: Building2 },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { to: '/admin/plans', label: 'Plans & Pricing', icon: CreditCard },
  { to: '/admin/ai-usage', label: 'AI Usage', icon: Cpu },
  { to: '/admin/system-health', label: 'System Health', icon: HeartPulse },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: ClipboardList },
  { to: '/admin/settings', label: 'Global Settings', icon: Settings },
  { to: '/admin/support', label: 'Support Tools', icon: Wrench },
];

function AdminSidebarItem({ item, collapsed }) {
  return (
    <NavLink
      to={item.to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-primary-600/20 text-primary-400'
            : 'text-slate-400 hover:bg-white/5 hover:text-white'
        }`
      }
      title={collapsed ? item.label : undefined}
    >
      <item.icon size={18} />
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );
}

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-bg-base">
      <aside
        className={`flex flex-col bg-bg-sidebar text-text-inverse h-screen transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="Admin Portal" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-semibold text-sm tracking-tight">Admin Portal</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {adminNavItems.map((item) => (
            <AdminSidebarItem key={item.to} item={item} collapsed={collapsed} />
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <LayoutDashboard size={14} />
            {!collapsed && <span>Back to App</span>}
          </NavLink>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
