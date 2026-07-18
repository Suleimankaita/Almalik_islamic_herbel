import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { stockStatus } from '../data';

export default function StockStatus() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-[15px] font-bold text-gray-900">Stock Status</h3>

      <div className="flex items-center gap-4">
        <div className="h-[150px] w-[150px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stockStatus}
                dataKey="value"
                nameKey="label"
                innerRadius={48}
                outerRadius={70}
                paddingAngle={2}
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                {stockStatus.map((slice) => (
                  <Cell key={slice.label} fill={slice.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [`${value.toLocaleString()} units`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="flex-1 space-y-3">
          {stockStatus.map((slice) => (
            <li key={slice.label} className="flex items-center justify-between text-[13px]">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-gray-500">{slice.label}</span>
              </div>
              <span className="font-semibold text-gray-800">
                {slice.value.toLocaleString()} ({slice.percent}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
