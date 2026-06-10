export default function AdminKpiCard({ title, value, icon: Icon, loading }) {
  if (loading) {
    return (
      <div className="bg-bg-card rounded-xl border border-border p-5 shadow-xs animate-pulse">
        <div className="h-4 w-24 bg-border rounded mb-3" />
        <div className="h-8 w-16 bg-border rounded" />
      </div>
    );
  }

  return (
    <div className="bg-bg-card rounded-xl border border-border p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon size={16} className="text-primary-500" />}
        <span className="text-xs font-medium text-text-muted uppercase tracking-wide">{title}</span>
      </div>
      <p className="text-2xl font-semibold text-text-primary">{value}</p>
    </div>
  );
}
