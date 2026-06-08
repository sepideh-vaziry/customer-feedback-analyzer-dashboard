import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Billing', count: 45 },
  { name: 'Support', count: 32 },
  { name: 'Features', count: 28 },
  { name: 'Performance', count: 21 },
  { name: 'UI/UX', count: 16 },
  { name: 'Other', count: 12 },
];

export default function ComplaintCategories() {
  return (
    <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
      <h3 className="text-base font-semibold text-text-primary mb-6">Complaint Categories</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '13px',
              }}
              cursor={{ fill: '#f8fafc' }}
            />
            <Bar dataKey="count" fill="#ef4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
