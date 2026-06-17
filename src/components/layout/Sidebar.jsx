import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
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
  Zap,
  History,
  BrainCircuit,
  GitCompare,
  CreditCard,
  FileText,
  Activity,
  Shield,
  Sparkles,
  Inbox,
  BookOpen,
  ChevronDown,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo-with-text.png';

const baseNavItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    label: 'Feedback',
    icon: MessageSquare,
    children: [
      { to: '/feedback', label: 'Feedback List', icon: MessageSquare },
      { to: '/feedback/import', label: 'Import Feedback', icon: Import },
      { to: '/connectors', label: 'Connectors', icon: Plug },
      { to: '/connectors/webhooks/guide', label: 'Webhook Guide', icon: BookOpen },
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
  {
    label: 'Trend Intelligence',
    icon: Zap,
    children: [
      { to: '/trends', label: 'Overview', icon: BarChart3 },
      { to: '/trends/emerging', label: 'Emerging Topics', icon: Lightbulb },
      { to: '/trends/explorer', label: 'Trend Explorer', icon: Search },
      { to: '/trends/complaints', label: 'Complaint Trends', icon: AlertTriangle },
      { to: '/trends/features', label: 'Feature Trends', icon: TrendingUp },
      { to: '/trends/history', label: 'Trend History', icon: History },
    ],
  },
  {
    label: 'AI Discovery',
    icon: BrainCircuit,
    children: [
      { to: '/ai-discovery', label: 'Semantic Search', icon: Search },
      { to: '/ai-discovery/similar-feedback', label: 'Similar Feedback', icon: MessageSquare },
      { to: '/ai-discovery/similar-complaints', label: 'Similar Complaints', icon: AlertTriangle },
      { to: '/ai-discovery/similar-features', label: 'Similar Features', icon: GitCompare },
      { to: '/ai-discovery/history', label: 'Search History', icon: History },
    ],
  },
  {
    label: 'Billing',
    icon: CreditCard,
    children: [
      { to: '/billing', label: 'Current Plan', icon: CreditCard },
      { to: '/billing/plans', label: 'Plans & Pricing', icon: BarChart3 },
      { to: '/billing/usage', label: 'Usage', icon: Activity },
      { to: '/billing/invoices', label: 'Invoices', icon: FileText },
      { to: '/billing/history', label: 'Subscription History', icon: History },
    ],
  },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/insights', label: 'AI Insights', icon: Sparkles },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function isChildActive(children, pathname) {
  return children.some((child) => pathname === child.to);
}

function SidebarItem({ item, collapsed }) {
  const location = useLocation();
  const hasActiveChild = item.children ? isChildActive(item.children, location.pathname) : false;
  const [expanded, setExpanded] = useState(() => (item.children ? hasActiveChild : true));

  if (item.children) {
    return (
      <div className="space-y-0.5">
        {!collapsed && (
          <button
            onClick={() => setExpanded(!expanded)}
            className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium transition-all duration-200 ${
              hasActiveChild
                ? 'text-white bg-white/10'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon size={18} />
            <span className="flex-1 text-left">{item.label}</span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            />
          </button>
        )}
        {collapsed && (
          <div
            className={`px-3 py-2.5 rounded-xl transition-colors ${
              hasActiveChild ? 'text-white bg-white/10' : 'text-slate-400'
            }`}
            title={item.label}
          >
            <item.icon size={18} />
          </div>
        )}
        {(expanded || collapsed) &&
          item.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  collapsed ? '' : 'ml-2'
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-600/20 to-primary-500/10 text-primary-400 shadow-sm shadow-primary-500/10'
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
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-gradient-to-r from-primary-600/20 to-primary-500/10 text-primary-400 shadow-sm shadow-primary-500/10'
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
  const { auth } = useAuth();

  const roles = auth?.roles || [];
  const isSuperAdmin = roles.includes('ROLE_SUPER_ADMIN');

  const navItems = useMemo(() => {
    const items = [...baseNavItems];
    if (isSuperAdmin) {
      items.push({ to: '/admin', label: 'Admin Portal', icon: Shield });
    }
    return items;
  }, [isSuperAdmin]);

  return (
    <aside
      className={`flex flex-col h-screen transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
      style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      }}
    >
      {/* Logo Area */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/5">
        {!collapsed && (
          <div className="flex items-center">
            <img src={logo} alt="Feedback AI" className="h-12 w-auto object-contain" />
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-lg shadow-primary-500/20 mx-auto">
            <Sparkles size={18} className="text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2.5 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <SidebarItem key={item.label} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
              {auth?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{auth?.fullName || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{auth?.email || ''}</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
              {auth?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        )}
        <div className="mt-3 text-center">
          <span className="text-[10px] text-slate-600 font-medium">v0.1.0</span>
        </div>
      </div>
    </aside>
  );
}
