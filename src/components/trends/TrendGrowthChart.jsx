import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import EmptyState from '../ui/EmptyState';
import { TrendingUp } from 'lucide-react';

export default function TrendGrowthChart({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs animate-pulse">
        <div className="h-4 w-32 bg-border rounded mb-4" />
        <div className="h-64 bg-border rounded" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
        <h3 className="text-base font-semibold text-text-primary mb-4">Trend Growth</h3>
        <EmptyState
          icon={TrendingUp}
          title="No trend data"
          description="Trend growth data will appear as feedback is analyzed over time."
        />
      </div>
    );
  }

  return (
    <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
      <h3 className="text-base font-semibold text-text-primary mb-4">Trend Growth</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
            <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-primary-500)"
              fill="var(--color-primary-500)"
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
