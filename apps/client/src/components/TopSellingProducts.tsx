import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Package, PackageSearch } from 'lucide-react';

interface TopSaleItem {
  productName?: string;
  totalSold?: number;
  totalRevenue?: number;
  _id?: string;
}

export type TopSellingPeriod = 'today' | 'week' | 'month' | 'all';

const PERIOD_LABELS: Record<TopSellingPeriod, string> = {
  today: 'Today',
  week: 'This Week',
  month: 'This Month',
  all: 'All Time',
};

interface Props {
  topSales?: TopSaleItem[];
  isLoading?: boolean;
  /** Currently active period. Defaults to 'month' to match the old static label. */
  period?: TopSellingPeriod;
  /**
   * Optional: called when the user picks a different period from the
   * dropdown. Wire this up in App.tsx (e.g. feed it into the same
   * dateParams passed to useGetTopSalesQuery) if you want the dropdown to
   * actually refetch data for that window. Without it, the dropdown still
   * opens/closes and highlights a selection, it just won't change what
   * data is shown — which is still an improvement over doing nothing.
   */
  onPeriodChange?: (period: TopSellingPeriod) => void;
}

export default function TopSellingProducts({ topSales = [], isLoading = false, period = 'month', onPeriodChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (next: TopSellingPeriod) => {
    setIsOpen(false);
    onPeriodChange?.(next);
  };

  // No more silent fallback to hardcoded demo data. If there's genuinely
  // nothing in topSales, that's the truth — show an honest empty state
  // instead of dummy products pretending to be real top sellers.
  const displayItems = topSales.map((item, index) => ({
    rank: index + 1,
    name: item.productName || item._id || 'Unnamed product',
    unitsSold: `${item.totalSold ?? 0} pcs`,
    revenue: `₦${Number(item.totalRevenue ?? 0).toLocaleString()}`,
  }));

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-gray-900">Top Selling Products</h3>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsOpen((open) => !open)}
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[12px] font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            {PERIOD_LABELS[period]}
            <ChevronDown size={13} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-9 z-20 w-36 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-xl">
              {(Object.keys(PERIOD_LABELS) as TopSellingPeriod[]).map((key) => (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  className={`block w-full px-3 py-2 text-left text-[12.5px] font-medium transition-colors hover:bg-gray-50 ${
                    key === period ? 'bg-emerald-50/60 text-emerald-600' : 'text-gray-700'
                  }`}
                >
                  {PERIOD_LABELS[key]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <ul className="divide-y divide-gray-50">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="flex animate-pulse items-center gap-3 py-2.5">
              <span className="h-6 w-6 shrink-0 rounded-full bg-gray-100" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-2/3 rounded bg-gray-100" />
                <div className="h-2.5 w-1/3 rounded bg-gray-100" />
              </div>
              <div className="h-3 w-12 rounded bg-gray-100" />
            </li>
          ))}
        </ul>
      ) : displayItems.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <PackageSearch className="h-8 w-8 text-gray-300" />
          <p className="text-[13px] font-medium text-gray-500">No sales recorded for this period</p>
          <p className="text-[11.5px] text-gray-400">Top sellers will show up here once sales come in.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {displayItems.map((p) => (
            <li key={p.rank} className="flex items-center gap-3 py-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-500">
                {p.rank}
              </span>
              <Package size={16} className="text-gray-400" />
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-gray-800">{p.name}</p>
                <p className="text-[11.5px] text-gray-400">{p.unitsSold}</p>
              </div>
              <p className="text-[13px] font-bold text-gray-900">{p.revenue}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
