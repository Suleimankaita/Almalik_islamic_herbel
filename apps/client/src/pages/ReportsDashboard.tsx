import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, DollarSign, 
  ShoppingCart, Calendar, Download, Filter, RefreshCw, 
  CreditCard, Package, ArrowUpRight, ArrowDownRight, MoreHorizontal,
  ChevronDown
} from 'lucide-react';

// --- Mock Data ---
const TOP_PRODUCTS = [
  { id: '1', name: 'Black Seed Oil (500ml)', sku: 'BSO-500', sold: 342, revenue: 1368000, stock: 45, trend: 'up', image: 'https://placehold.co/40x40/f8fafc/333333?text=Oil' },
  { id: '2', name: 'Sidr Honey (500g)', sku: 'HON-500', sold: 289, revenue: 1011500, stock: 12, trend: 'up', image: 'https://placehold.co/40x40/f8fafc/333333?text=Hon' },
  { id: '3', name: 'Olive Oil (250ml)', sku: 'OLV-250', sold: 215, revenue: 645000, stock: 85, trend: 'down', image: 'https://placehold.co/40x40/f8fafc/333333?text=Olv' },
  { id: '4', name: 'Zamzam Water (1L)', sku: 'ZAM-1L', sold: 198, revenue: 237600, stock: 120, trend: 'up', image: 'https://placehold.co/40x40/f8fafc/333333?text=Ztw' },
  { id: '5', name: 'Nigella Sativa Powder', sku: 'NSP-100', sold: 156, revenue: 312000, stock: 6, trend: 'down', image: 'https://placehold.co/40x40/f8fafc/333333?text=Pwd' },
];

const CATEGORY_SALES = [
  { name: 'Oils & Extracts', sales: 2450000, percentage: 45, gradient: 'from-emerald-400 to-emerald-600', shadow: 'shadow-emerald-500/30' },
  { name: 'Natural Honey', sales: 1580000, percentage: 30, gradient: 'from-amber-400 to-amber-500', shadow: 'shadow-amber-500/30' },
  { name: 'Supplements', sales: 850000, percentage: 15, gradient: 'from-blue-400 to-blue-600', shadow: 'shadow-blue-500/30' },
  { name: 'Herbal Powders', sales: 520000, percentage: 10, gradient: 'from-purple-400 to-purple-600', shadow: 'shadow-purple-500/30' },
];

const WEEKLY_REVENUE = [
  { day: 'Mon', value: 45000, height: 'h-[40%]' },
  { day: 'Tue', value: 62000, height: 'h-[60%]' },
  { day: 'Wed', value: 38000, height: 'h-[35%]' },
  { day: 'Thu', value: 89000, height: 'h-[80%]' },
  { day: 'Fri', value: 135000, height: 'h-[100%]' },
  { day: 'Sat', value: 95000, height: 'h-[75%]' },
  { day: 'Sun', value: 54000, height: 'h-[45%]' },
];

// --- Mini Sparkline Component ---
const Sparkline = ({ color, trend }: { color: string, trend: 'up' | 'down' }) => (
  <svg className={`w-16 h-8 ${color} opacity-60`} viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {trend === 'up' ? (
      <path d="M0 20 Q 10 15, 20 18 T 40 8 T 60 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    ) : (
      <path d="M0 2 Q 10 5, 20 8 T 40 18 T 60 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    )}
  </svg>
);

export default function ReportsDashboard() {
  const [dateRange, setDateRange] = useState('This Week');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount).replace('NGN', '₦');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8 font-sans text-slate-800 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-6 lg:gap-8">
        
        {/* ================= HEADER & CONTROLS ================= */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700 shadow-inner">
                <BarChart3 size={24} />
              </div>
              Analytics Overview
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">Track your store's performance in real-time.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Refresh Button */}
            <button 
              onClick={handleRefresh}
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all shadow-sm"
            >
              <RefreshCw size={18} className={isRefreshing ? "animate-spin text-emerald-600" : ""} />
            </button>

            {/* Date Range Selector */}
            <div className="relative flex-1 sm:flex-none group">
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200 text-sm font-bold text-slate-700 rounded-xl pl-10 pr-10 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all cursor-pointer shadow-sm group-hover:border-slate-300"
              >
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
              <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-emerald-500 transition-colors pointer-events-none" />
              <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Export */}
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-slate-900/20 hover:shadow-emerald-700/30 active:scale-95">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* ================= KPI CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          
          {/* Gross Revenue */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                <DollarSign size={24} />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-lg shadow-sm">
                <ArrowUpRight size={14} /> +12.5%
              </span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Total Revenue</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{formatCurrency(5400000)}</h3>
              </div>
              <Sparkline color="text-emerald-500" trend="up" />
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                <ShoppingCart size={24} />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-lg shadow-sm">
                <ArrowUpRight size={14} /> +8.2%
              </span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Total Orders</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">1,248</h3>
              </div>
              <Sparkline color="text-blue-500" trend="up" />
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
                <CreditCard size={24} />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 border border-red-100 px-2.5 py-1.5 rounded-lg shadow-sm">
                <ArrowDownRight size={14} /> -2.4%
              </span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Avg. Value</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{formatCurrency(4326)}</h3>
              </div>
              <Sparkline color="text-amber-500" trend="down" />
            </div>
          </div>

          {/* Items Sold */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-fuchsia-500"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
                <Package size={24} />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-lg shadow-sm">
                <ArrowUpRight size={14} /> +15.3%
              </span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Items Sold</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">3,892</h3>
              </div>
              <Sparkline color="text-purple-500" trend="up" />
            </div>
          </div>

        </div>

        {/* ================= CHARTS SECTION ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          
          {/* Enhanced Revenue Bar Chart */}
          <div className="lg:col-span-2 bg-white p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden">
            {/* Subtle background mesh/blob (optional aesthetic) */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div>
                <h3 className="text-lg font-black text-slate-900">Revenue Overview</h3>
                <p className="text-sm text-slate-500 mt-1 font-medium">Daily income trajectory for {dateRange.toLowerCase()}</p>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-black text-emerald-600 tracking-tight">{formatCurrency(498000)}</h2>
                <p className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-1 mt-1">
                  <TrendingUp size={14} /> On track to beat last week
                </p>
              </div>
            </div>
            
            {/* Custom Bar Chart with Gradients */}
            <div className="flex-1 flex items-end justify-between gap-3 sm:gap-6 h-56 sm:h-72 mt-auto border-b-2 border-slate-100 pb-2 relative z-10">
              
              {/* Background Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
                <div className="border-t border-dashed border-slate-300 w-full h-0"></div>
                <div className="border-t border-dashed border-slate-300 w-full h-0"></div>
                <div className="border-t border-dashed border-slate-300 w-full h-0"></div>
                <div className="border-t border-dashed border-slate-300 w-full h-0"></div>
              </div>

              {/* Bars */}
              {WEEKLY_REVENUE.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group z-10 relative">
                  
                  {/* Tooltip */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out transform group-hover:-translate-y-2 bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xl whitespace-nowrap z-50 pointer-events-none">
                    {formatCurrency(day.value)}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                  </div>

                  {/* Enhanced Bar */}
                  <div className={`w-full max-w-[48px] bg-slate-100 rounded-t-xl transition-all duration-500 relative overflow-hidden ${day.height} group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]`}>
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-xl h-full transition-transform duration-500 origin-bottom scale-y-95 group-hover:scale-y-100">
                      {/* Glossy overlay */}
                      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent"></div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400 mt-4 group-hover:text-emerald-600 transition-colors">{day.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Sales by Category */}
          <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-slate-900">Category Split</h3>
              <button className="w-8 h-8 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col justify-center gap-7">
              {CATEGORY_SALES.map((cat, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-end mb-2.5">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{cat.name}</p>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">{formatCurrency(cat.sales)}</p>
                    </div>
                    <span className="text-sm font-black text-slate-900">{cat.percentage}%</span>
                  </div>
                  {/* Progress Bar Container */}
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                    {/* Glowing Progress Bar Fill */}
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${cat.gradient} relative overflow-hidden transition-all duration-1000 ease-out`}
                      style={{ width: `${cat.percentage}%` }}
                    >
                      {/* Shimmer effect */}
                      <div className="absolute top-0 left-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-8 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-sm font-bold transition-colors border border-slate-200/50">
              Explore All Categories
            </button>
          </div>
        </div>

        {/* ================= DATA TABLES & INSIGHTS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          
          {/* Top Selling Products - Spans 2 Columns */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-xl">
              <div>
                <h3 className="text-lg font-black text-slate-900">Top Performing Products</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">Ranked by overall sales volume</p>
              </div>
              <button className="px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-xl hover:bg-emerald-100 transition-colors">
                View Report
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-4">Product Details</th>
                    <th className="px-6 py-4 text-center">Qty Sold</th>
                    <th className="px-6 py-4 text-right">Revenue Generated</th>
                    <th className="px-6 py-4 text-center">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {TOP_PRODUCTS.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl border border-slate-200 object-cover bg-white shadow-sm group-hover:scale-105 transition-transform" />
                            {product.stock <= 10 && (
                               <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{product.name}</p>
                            <p className="text-[11px] text-slate-500 font-mono mt-1 font-semibold">{product.sku} • {product.stock} in stock</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-slate-100 px-3 py-1 rounded-lg font-bold text-slate-700">
                          {product.sold}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-slate-900 text-base">
                        {formatCurrency(product.revenue)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          {product.trend === 'up' ? (
                            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg font-bold text-xs">
                              <TrendingUp size={14} /> Up
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg font-bold text-xs">
                              <TrendingDown size={14} /> Down
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Smart Insights Panel */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col text-white relative">
            {/* Decorative background vectors */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="p-6 lg:p-8 border-b border-white/10 relative z-10">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                Automated Insights
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">AI-driven analysis of your data</p>
            </div>
            
            <div className="p-4 lg:p-6 space-y-4 relative z-10">
              
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center flex-none group-hover:scale-110 transition-transform">
                    <TrendingDown size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Critical Stock Alert</h4>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      <span className="font-bold text-white">Nigella Sativa Powder</span> is almost depleted (6 left). Estimated runout in 48 hours.
                    </p>
                    <button className="mt-3 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                      Restock Now <ArrowUpRight size={14}/>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-none group-hover:scale-110 transition-transform">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Growth Opportunity</h4>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      <span className="font-bold text-white">Sidr Honey</span> sales are up 42%. Consider bundling with Zamzam water to increase AOV.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Global styles for the shimmer effect */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}