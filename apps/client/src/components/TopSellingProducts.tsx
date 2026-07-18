import { ChevronDown } from 'lucide-react';
import { topSellingProducts } from '../data';

export default function TopSellingProducts() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-gray-900">Top Selling Products</h3>
        <button className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[12px] font-medium text-gray-600">
          This Month
          <ChevronDown size={13} />
        </button>
      </div>

      <ul className="divide-y divide-gray-50">
        {topSellingProducts.map((p) => (
          <li key={p.rank} className="flex items-center gap-3 py-2.5">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-500">
              {p.rank}
            </span>
            <span className="text-lg">{p.emoji}</span>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-gray-800">{p.name}</p>
              <p className="text-[11.5px] text-gray-400">{p.unitsSold}</p>
            </div>
            <p className="text-[13px] font-bold text-gray-900">{p.revenue}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
