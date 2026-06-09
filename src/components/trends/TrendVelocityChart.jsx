import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import EmptyState from '../ui/EmptyState';
import { Zap } from 'lucide-react';

export default function TrendVelocityChart({ data, loading }) {
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
        <h3 className="text-base font-semibold text-text-primary mb-4">Trend Velocity</h3>
        <EmptyState
          icon={Zap}
          title="No velocity data"
          description="Trend velocity will be calculated as more feedback is analyzed."
        />
      </div>
    );
  }

  return (
    <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
      <h3 className="text-base font-semibold text-text-primary mb-4">Trend Velocity</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    entry.severity === 'CRITICAL'
                      ? 'var(--color-danger-500)'
                      : entry.severity === 'HIGH'
                      ? 'var(--color-warning-500)'
                      : 'var(--color-primary-500)'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
