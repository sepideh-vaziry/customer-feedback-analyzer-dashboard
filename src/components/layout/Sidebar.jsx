import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Sparkles,
  TrendingUp,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Import,
  Plug,
  AlertTriangle,
  Search,
  Tag,
  Repeat,
  Lightbulb,
  ShieldAlert,
  UserSearch,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    label: 'Feedback',
    icon: MessageSquare,
    children: [
      { to: '/feedback', label: 'Feedback List', icon: MessageSquare },
      { to: '/feedback/import', label: 'Import Feedback', icon: Import },
      { to: '/connectors', label: 'Connectors', icon: Plug },
    ],
  },
  {
    label: 'Complaints',
    icon: AlertTriangle,
    children: [
      { to: '/complaints', label: 'Overview', icon: BarChart3 },
      { to: '/complaints/categories', label: 'Categories', icon: Tag },
      { to: '/complaints/recurring', label: 'Recurring', icon: Repeat },
      { to: '/complaints/explorer', label: 'Explorer', icon: Search },
    ],
  },
  {
    label: 'Feature Requests',
    icon: Lightbulb,
    children: [
      { to: '/feature-requests', label: 'Overview', icon: BarChart3 },
      { to: '/feature-requests/demand', label: 'Demand Ranking', icon: TrendingUp },
      { to: '/feature-requests/explorer', label: 'Explorer', icon: Search },
      { to: '/feature-requests/trends', label: 'Trends', icon: TrendingUp },
    ],
  },
  {
    label: 'Churn Risk',
    icon: ShieldAlert,
    children: [
      { to: '/churn-risk', label: 'Overview', icon: BarChart3 },
      { to: '/churn-risk/high-risk', label: 'High Risk Customers', icon: AlertTriangle },
      { to: '/churn-risk/explorer', label: 'Customer Explorer', icon: UserSearch },
      { to: '/churn-risk/trends', label: 'Risk Trends', icon: TrendingUp },
      { to: '/churn-risk/insights', label: 'Retention Insights', icon: Lightbulb },
    ],
  },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/insights', label: 'AI Insights', icon: Sparkles },
  { to: '/trends', label: 'Trends', icon: TrendingUp },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function SidebarItem({ item, collapsed }) {
  const [expanded, setExpanded] = useState(true);

  if (item.children) {
    return (
      <div className="space-y-1">
        {!collapsed && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <item.icon size={18} />
            <span className="flex-1 text-left">{item.label}</span>
          </button>
        )}
        {collapsed && (
          <div className="px-3 py-2 rounded-lg text-slate-400" title={item.label}>
            <item.icon size={18} />
          </div>
        )}
        {(expanded || collapsed) &&
          item.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  collapsed ? '' : 'ml-4'
                } ${
                  isActive
                    ? 'bg-primary-600/20 text-primary-400'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
              title={collapsed ? child.label : undefined}
            >
              <child.icon size={16} />
              {!collapsed && <span>{child.label}</span>}
            </NavLink>
          ))}
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
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

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col bg-bg-sidebar text-text-inverse h-screen transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="font-semibold text-sm tracking-tight">Feedback AI</span>
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

      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => (
          <SidebarItem key={item.label} item={item} collapsed={collapsed} />
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        {!collapsed && <div className="text-xs text-slate-500">v0.1.0</div>}
      </div>
    </aside>
  );
}
