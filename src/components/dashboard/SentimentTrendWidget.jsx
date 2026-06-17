import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import EmptyState from '../ui/EmptyState';

export default function SentimentTrendWidget({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm animate-pulse">
        <div className="skeleton h-5 w-1/3 mb-6" />
        <div className="skeleton h-64 rounded-xl" />
      </div>
    );
  }

  const labels = data?.labels || [];
  const positive = data?.positiveValues || [];
  const negative = data?.negativeValues || [];
  const neutral = data?.neutralValues || [];

  if (labels.length === 0) {
    return (
      <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="text-base font-bold text-text-primary mb-4">Sentiment Trend</h3>
        <EmptyState icon={TrendingUp} title="No trend data" description="Sentiment trends will appear as feedback is analyzed over time." />
      </div>
    );
  }

  const chartData = labels.map((label, i) => ({
    name: label,
    positive: positive[i] || 0,
    negative: negative[i] || 0,
    neutral: neutral[i] || 0,
  }));

  return (
    <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 className="text-base font-bold text-text-primary mb-5">Sentiment Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorNeu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
            />
            <Area type="monotone" dataKey="positive" stroke="#22c55e" strokeWidth={2.5} fill="url(#colorPos)" />
            <Area type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2.5} fill="url(#colorNeg)" />
            <Area type="monotone" dataKey="neutral" stroke="#f59e0b" strokeWidth={2.5} fill="url(#colorNeu)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
