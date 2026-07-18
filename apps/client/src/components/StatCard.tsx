import {
  ShoppingCart,
  Wallet,
  Box,
  Layers,
  AlertTriangle,
  XCircle,
  CalendarClock,
  CalendarX,
  Users,
  Truck,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import type { StatCardData, MiniStatData } from '../types';

const iconMap: Record<StatCardData['icon'] | MiniStatData['icon'], LucideIcon> = {
  sales: ShoppingCart,
  profit: Wallet,
  inventory: Box,
  stock: Layers,
  lowStock: AlertTriangle,
  outOfStock: XCircle,
  expiringSoon: CalendarClock,
  expired: CalendarX,
  customers: Users,
  suppliers: Truck,
};

interface Props {
  data: StatCardData;
}

export function StatCard({ data }: Props) {
  const Icon = iconMap[data.icon];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <p className="text-[12.5px] font-medium text-gray-500">{data.label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${data.iconBg}`}>
          <Icon size={16} className={data.iconColor} />
        </div>
      </div>
      <p className="mb-2 text-[22px] font-extrabold tracking-tight text-gray-900">{data.value}</p>
      {data.trend ? (
        <div className="flex items-center gap-1 text-[11.5px] font-semibold text-emerald-600">
          <TrendingUp size={13} />
          <span>
            {data.trend.direction === 'up' ? '↑' : '↓'} {data.trend.value}
          </span>
        </div>
      ) : (
        <p className="text-[11.5px] text-gray-400">{data.sublabel}</p>
      )}
    </div>
  );
}

interface MiniProps {
  data: MiniStatData;
}

export function MiniStatCard({ data }: MiniProps) {
  const Icon = iconMap[data.icon];
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${data.iconBg}`}>
        <Icon size={18} className={data.iconColor} />
      </div>
      <div>
        <p className="text-[12px] text-gray-500">{data.label}</p>
        <p className="text-[19px] font-extrabold leading-tight text-gray-900">{data.value}</p>
        <p className="text-[11px] text-gray-400">{data.sublabel}</p>
      </div>
    </div>
  );
}
