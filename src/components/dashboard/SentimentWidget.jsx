import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Smile, Frown, Minus, Zap } from 'lucide-react';
import EmptyState from '../ui/EmptyState';

const COLORS = {
  POSITIVE: '#22c55e',
  NEGATIVE: '#ef4444',
  NEUTRAL: '#f59e0b',
  MIXED: '#3b82f6',
};

const ICONS = {
  POSITIVE: Zap,
  NEGATIVE: Frown,
  NEUTRAL: Minus,
  MIXED: Smile,
};

export default function SentimentWidget({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm animate-pulse">
        <div className="skeleton h-5 w-1/3 mb-6" />
        <div className="skeleton h-64 rounded-xl" />
      </div>
    );
  }

  if (!data || data.totalAnalyzed === 0) {
    return (
      <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="text-base font-bold text-text-primary mb-4">Sentiment Distribution</h3>
        <EmptyState icon={Smile} title="No sentiment data" description="Analyze feedback to see sentiment breakdown." />
      </div>
    );
  }

  const chartData = [
    { name: 'Positive', value: data.positiveCount || 0, key: 'POSITIVE' },
    { name: 'Negative', value: data.negativeCount || 0, key: 'NEGATIVE' },
    { name: 'Neutral', value: data.neutralCount || 0, key: 'NEUTRAL' },
  ].filter((d) => d.value > 0);

  return (
    <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 className="text-base font-bold text-text-primary mb-5">Sentiment Distribution</h3>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {chartData.map((item) => {
          const Icon = ICONS[item.key];
          const percent = data.totalAnalyzed ? Math.round((item.value / data.totalAnalyzed) * 100) : 0;
          return (
            <div key={item.key} className="text-center p-4 rounded-xl bg-gradient-to-br from-bg-base to-bg-card border border-border hover:border-primary-200 transition-all duration-200 hover:-translate-y-0.5">
              <Icon size={18} className="mx-auto mb-2" style={{ color: COLORS[item.key] }} />
              <p className="text-xl font-bold text-text-primary">{percent}%</p>
              <p className="text-xs text-text-muted font-medium mt-0.5">{item.name}</p>
            </div>
          );
        })}
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
              {chartData.map((entry) => (
                <Cell key={entry.key} fill={COLORS[entry.key]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
            />
            <Legend verticalAlign="bottom" height={24} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
