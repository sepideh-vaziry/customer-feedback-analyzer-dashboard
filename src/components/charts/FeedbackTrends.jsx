import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', feedback: 420, positive: 280, negative: 60 },
  { name: 'Feb', feedback: 380, positive: 250, negative: 55 },
  { name: 'Mar', feedback: 510, positive: 340, negative: 72 },
  { name: 'Apr', feedback: 470, positive: 310, negative: 65 },
  { name: 'May', feedback: 590, positive: 400, negative: 80 },
  { name: 'Jun', feedback: 640, positive: 430, negative: 90 },
];

export default function FeedbackTrends() {
  return (
    <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
      <h3 className="text-base font-semibold text-text-primary mb-6">Feedback Trends</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorFeedback" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '13px',
              }}
            />
            <Area
              type="monotone"
              dataKey="feedback"
              stroke="#2563eb"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorFeedback)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
