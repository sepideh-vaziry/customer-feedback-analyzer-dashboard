import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Lightbulb } from 'lucide-react';
import EmptyState from '../ui/EmptyState';

const COLORS = ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7', '#fffbeb'];

export default function FeatureRequestWidget({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm animate-pulse">
        <div className="skeleton h-5 w-1/3 mb-6" />
        <div className="skeleton h-64 rounded-xl" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="text-base font-bold text-text-primary mb-4">Top Feature Requests</h3>
        <EmptyState icon={Lightbulb} title="No feature requests" description="No feature requests found for this period." />
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.clusterName || 'Unknown',
    count: item.occurrenceCount || 0,
    rate: item.demandRate || 0,
  }));

  return (
    <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 className="text-base font-bold text-text-primary mb-5">Top Feature Requests</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} width={100} />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              cursor={{ fill: '#f8fafc' }}
            />
            <Bar dataKey="count" radius={[0, 8, 8, 0]}>
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
