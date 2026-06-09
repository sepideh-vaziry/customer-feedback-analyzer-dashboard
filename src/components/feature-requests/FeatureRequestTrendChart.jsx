import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';
import EmptyState from '../ui/EmptyState';

const COLORS = ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7', '#fffbeb'];

export default function FeatureRequestTrendChart({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs animate-pulse">
        <div className="h-5 bg-border-light rounded w-1/3 mb-6" />
        <div className="h-64 bg-border-light rounded" />
      </div>
    );
  }

  const labels = data?.labels || [];
  const series = data?.seriesByCategory || {};

  if (labels.length === 0 || Object.keys(series).length === 0) {
    return (
      <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
        <h3 className="text-base font-semibold text-text-primary mb-4">Feature Request Trends</h3>
        <EmptyState icon={TrendingUp} title="No trend data" description="Feature request trends will appear as feedback is analyzed over time." />
      </div>
    );
  }

  const chartData = labels.map((label, i) => {
    const point = { name: label };
    Object.entries(series).forEach(([category, values]) => {
      point[category] = values[i] || 0;
    });
    return point;
  });

  const categories = Object.keys(series);

  return (
    <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
      <h3 className="text-base font-semibold text-text-primary mb-4">Feature Request Trends</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }}
            />
            <Legend iconType="circle" />
            {categories.map((category, index) => (
              <Area
                key={category}
                type="monotone"
                dataKey={category}
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
