import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChevronDown } from 'lucide-react';
import { salesOverview } from '../data';
import type { SalesPoint } from '../types';

function formatNaira(value: number) {
  return `₦${(value / 1000).toFixed(0)}K`;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-[11px] text-gray-400">{label}</p>
      <p className="text-[13px] font-bold text-brand-green">₦{payload[0].value.toLocaleString()}</p>
    </div>
  );
}

export default function SalesOverview() {
  const total = salesOverview.reduce((sum: number, p: SalesPoint) => sum + p.sales, 0);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-gray-900">Sales Overview</h3>
        <button className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[12px] font-medium text-gray-600">
          This Month
          <ChevronDown size={13} />
        </button>
      </div>

      <div className="mb-1 flex items-baseline gap-2">
        <p className="text-[26px] font-extrabold tracking-tight text-gray-900">
          ₦{total.toLocaleString()}
        </p>
      </div>
      <p className="mb-4 flex items-center gap-1 text-[12px] font-semibold text-emerald-600">
        Total Sales <span>↑ 16.4% vs last month</span>
      </p>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesOverview} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
              interval={2}
            />
            <YAxis
              tickFormatter={formatNaira}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#22C55E"
              strokeWidth={2.5}
              fill="url(#salesGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#22C55E' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
