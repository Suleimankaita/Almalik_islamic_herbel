import React, { useState, useEffect } from 'react';
import {
  Wallet,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  ArrowDown,
  ChevronDown,
  Calendar,
  Download,
  MoreVertical,
  Leaf
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// --- Types ---
interface Transaction {
  id: string;
  date: string;
  orderId: string;
  productName: string;
  qty: number;
  category: string;
  paymentMethod: string;
  amount: number;
  status: string;
  image: string;
}

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  subtext: string;
  badge?: {
    text: string;
    isPositive: boolean;
  };
  delay?: number;
}

// --- Mock Data ---
const areaChartData = [
  { name: 'Dec 2024', value: 100 },
  { name: 'Jan 2025', value: 220 },
  { name: 'Feb 2025', value: 240 },
  { name: 'Mar 2025', value: 280 },
  { name: 'Apr 2025', value: 180 },
  { name: 'May 2025', value: 210 },
];

const pieChartData = [
  { name: 'Herbs', value: 642.50, color: '#2C5234', percent: '51%' },
  { name: 'Supplements', value: 387.25, color: '#6A8E61', percent: '31%' },
  { name: 'Wellness Products', value: 148.00, color: '#C19A5B', percent: '12%' },
  { name: 'Others', value: 77.00, color: '#D1D5DB', percent: '6%' },
];

const transactions: Transaction[] = [
  {
    id: '1', date: 'May 28, 2025', orderId: '#ALM12568', productName: 'Ashwagandha Capsules',
    qty: 1, category: 'Supplements', paymentMethod: 'Visa •••• 4242', amount: 34.99, status: 'Completed',
    image: 'https://images.unsplash.com/photo-1629851609101-57640fb65f21?w=100&h=100&fit=crop&q=80'
  },
  {
    id: '2', date: 'May 24, 2025', orderId: '#ALM12537', productName: 'Moringa Powder',
    qty: 1, category: 'Herbs', paymentMethod: 'Mastercard •••• 8888', amount: 22.50, status: 'Completed',
    image: 'https://images.unsplash.com/photo-1615486511484-92e172054c04?w=100&h=100&fit=crop&q=80'
  },
  {
    id: '3', date: 'May 20, 2025', orderId: '#ALM12506', productName: 'Turmeric & Ginger Capsules',
    qty: 2, category: 'Supplements', paymentMethod: 'Visa •••• 4242', amount: 49.98, status: 'Completed',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100&h=100&fit=crop&q=80'
  },
  {
    id: '4', date: 'May 15, 2025', orderId: '#ALM12476', productName: 'Black Seed Oil',
    qty: 1, category: 'Wellness Products', paymentMethod: 'PayPal', amount: 18.99, status: 'Completed',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&h=100&fit=crop&q=80'
  },
  {
    id: '5', date: 'May 10, 2025', orderId: '#ALM12435', productName: 'Senna Leaves',
    qty: 1, category: 'Herbs', paymentMethod: 'Visa •••• 4242', amount: 16.75, status: 'Completed',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100&h=100&fit=crop&q=80'
  }
];

// --- Sub-Components ---

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon: Icon, subtext, badge, delay = 0 }) => (
  <div 
    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in-up opacity-0 fill-mode-forwards"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F3F6F4] text-[#2C5234]">
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          {badge && (
            <span className={`flex items-center text-xs font-medium ${badge.isPositive ? 'text-green-600' : 'text-green-600'}`}>
              {!badge.isPositive && <ArrowDown size={12} className="mr-0.5" />}
              {badge.text}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400">{subtext}</span>
      </div>
    </div>
  </div>
);

const CategoryBadge = ({ category }: { category: string }) => {
  let bg = 'bg-gray-100';
  let text = 'text-gray-700';

  if (category === 'Supplements' || category === 'Herbs') {
    bg = 'bg-[#E8F3EB]';
    text = 'text-[#2C5234]';
  } else if (category === 'Wellness Products') {
    bg = 'bg-[#FDF3E1]';
    text = 'text-[#B87C2B]';
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${bg} ${text}`}>
      {category}
    </span>
  );
};

// --- Main Page Component ---

export default function ExpenseHistory() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FAF9F6] px-4 py-8 sm:px-6 lg:px-8 font-sans">
      
      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .fill-mode-forwards {
          animation-fill-mode: forwards;
        }
        .recharts-tooltip-cursor { fill: rgba(44, 82, 52, 0.05); }
      `}</style>

      <div className="mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="relative mb-8 animate-fade-in-up opacity-0 fill-mode-forwards">
          <div className="relative z-10 w-2/3">
            <h1 className="text-3xl sm:text-4xl font-serif text-[#1e3a24] tracking-tight">
              Expense History
            </h1>
            <div className="my-3 flex items-center text-[#C19A5B] opacity-60">
              <div className="h-px w-12 bg-current"></div>
              <Leaf size={14} className="mx-2" />
              <div className="h-px w-12 bg-current"></div>
            </div>
            <p className="text-sm sm:text-base text-gray-500">Track and manage all your expenses in one place.</p>
          </div>
          
          {/* Botanical Image Decoration (Right aligned) */}
          <div className="absolute right-0 top-0 h-32 w-64 md:h-40 md:w-80 pointer-events-none overflow-hidden mask-image-gradient">
             <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#FAF9F6] z-10" />
             <img 
               src="https://images.unsplash.com/photo-1550505096-7bbdeecb3e4f?q=80&w=800&auto=format&fit=crop" 
               alt="Botanical decoration" 
               className="w-full h-full object-cover object-left-top opacity-60 mix-blend-multiply"
             />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard title="Total Spent" value="$1,254.75" subtext="All time" icon={Wallet} delay={100} />
          <SummaryCard title="This Month" value="$246.30" subtext="vs last month" icon={ShoppingBag} badge={{ text: '12.5%', isPositive: false }} delay={150} />
          <SummaryCard title="Total Orders" value="14" subtext="All time" icon={ShoppingCart} delay={200} />
          <SummaryCard title="Average Order Value" value="$89.62" subtext="All time" icon={TrendingUp} delay={250} />
        </div>

        {/* Charts Section */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Line Chart: Spending Overview */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2 animate-fade-in-up opacity-0 fill-mode-forwards" style={{ animationDelay: '300ms' }}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Spending Overview</h2>
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Last 6 Months <ChevronDown size={16} />
              </button>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2C5234" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2C5234" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#111827', fontWeight: 600 }}
                    formatter={(value: unknown) => {
                      const numericValue = typeof value === 'number' ? value : Number(value ?? 0);
                      return [`$${numericValue.toFixed(2)}`, ''];
                    }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#2C5234" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart: Top Categories */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm animate-fade-in-up opacity-0 fill-mode-forwards" style={{ animationDelay: '350ms' }}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Top Categories</h2>
              <button className="text-sm font-medium text-[#2C5234] hover:underline">View all</button>
            </div>
            <div className="relative flex h-48 items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Inner Icon for Donut Chart */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="rounded-full bg-[#F3F6F4] p-3 text-[#2C5234]">
                  <Leaf size={24} strokeWidth={1.5} />
                </div>
              </div>
            </div>
            
            {/* Custom Legend */}
            <div className="mt-4 flex flex-col gap-3">
              {pieChartData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">${item.value.toFixed(2)}</span>
                    <span className="text-xs text-gray-400">({item.percent})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters and Table Section */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm animate-fade-in-up opacity-0 fill-mode-forwards" style={{ animationDelay: '400ms' }}>
          
          {/* Toolbar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Calendar size={16} className="text-gray-400" />
                May 1, 2024 – May 31, 2025
                <ChevronDown size={16} className="text-gray-400 ml-1" />
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                All Categories
                <ChevronDown size={16} className="text-gray-400 ml-1" />
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                All Payment Methods
                <ChevronDown size={16} className="text-gray-400 ml-1" />
              </button>
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Download size={16} />
              Export
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm text-gray-600">
              <thead className="border-b border-gray-100 text-xs font-medium uppercase text-gray-400">
                <tr>
                  <th className="pb-4 font-semibold">Date</th>
                  <th className="pb-4 font-semibold">Order ID</th>
                  <th className="pb-4 font-semibold">Description</th>
                  <th className="pb-4 font-semibold">Category</th>
                  <th className="pb-4 font-semibold">Payment Method</th>
                  <th className="pb-4 font-semibold">Amount</th>
                  <th className="pb-4 font-semibold">Status</th>
                  <th className="pb-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 whitespace-nowrap">{tx.date}</td>
                    <td className="py-4 text-gray-900 whitespace-nowrap">{tx.orderId}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={tx.image} alt={tx.productName} className="h-10 w-10 rounded-lg object-cover bg-gray-100 border border-gray-200/60" />
                        <div>
                          <p className="font-medium text-gray-900">{tx.productName}</p>
                          <p className="text-xs text-gray-500">Qty: {tx.qty}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 whitespace-nowrap">
                      <CategoryBadge category={tx.category} />
                    </td>
                    <td className="py-4 whitespace-nowrap">{tx.paymentMethod}</td>
                    <td className="py-4 font-semibold text-gray-900 whitespace-nowrap">${tx.amount.toFixed(2)}</td>
                    <td className="py-4 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-full bg-[#E8F3EB] px-2.5 py-1 text-xs font-medium text-[#2C5234]">
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </div>
  );
}