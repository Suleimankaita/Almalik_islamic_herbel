import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, Package, AlertTriangle, Clock, 
  Users, ShoppingBag, ArrowRight, Activity, DollarSign, 
  Percent, ShieldCheck, Eye, EyeOff, Layers, Sparkles
} from 'lucide-react';

// --- TYPES & INTERFACES ---
interface SaleItem {
  id: string;
  customerName: string;
  itemsCount: number;
  total: number;
  time: string;
  status: 'Completed' | 'Refunded';
}

interface PurchaseItem {
  id: string;
  supplierName: string;
  itemsCount: number;
  total: number;
  date: string;
  status: 'Received' | 'Pending';
}

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

interface ProductPerformance {
  sku: string;
  name: string;
  arabicName?: string;
  unitsSold: number;
  revenue: number;
}

type UserRole = 'Owner' | 'Manager' | 'Cashier' | 'Inventory Officer' | 'Sales Officer';

export default function Dashboard() {
  // State for role simulation
  const [currentRole, setCurrentRole] = useState<UserRole>('Owner');
  const [showSensitiveData, setShowSensitiveData] = useState<boolean>(true);

  // --- COMPREHENSIVE DATA STATE ---
  const financialMetrics = {
    todaySales: 1850.00,
    todayProfit: 620.00,
    monthlySales: 48250.00,
    monthlyProfit: 16400.00,
    inventoryValue: 125400.00,
    totalProductsInStock: 3420,
  };

  const inventoryAlerts = {
    outOfStock: 3,
    lowStock: 14,
    expiringSoon: 8, // next 90 days
    expiredProducts: 1,
  };

  const relationCounts = {
    activeCustomers: 412,
    activeSuppliers: 24,
  };

  const recentSales: SaleItem[] = [
    { id: "TX-1092", customerName: "Abdurrahman Khan", itemsCount: 3, total: 85.00, time: "10 mins ago", status: 'Completed' },
    { id: "TX-1091", customerName: "Fatima Al-Harbi", itemsCount: 1, total: 25.00, time: "25 mins ago", status: 'Completed' },
    { id: "TX-1090", customerName: "Anonymous Walk-in", itemsCount: 2, total: 42.50, time: "1 hour ago", status: 'Completed' },
    { id: "TX-1089", customerName: "Yousef Mansoor", itemsCount: 4, total: 110.00, time: "3 hours ago", status: 'Completed' }
  ];

  const recentPurchases: PurchaseItem[] = [
    { id: "PO-402", supplierName: "Yemen Sidr Farms Ltd", itemsCount: 40, total: 1800.00, date: "Today, 09:30 AM", status: 'Received' },
    { id: "PO-401", supplierName: "Al-Barakah Global Corp", itemsCount: 100, total: 2500.00, date: "Yesterday", status: 'Received' },
    { id: "PO-400", supplierName: "Himalaya Herb Import", itemsCount: 15, total: 450.00, date: "3 days ago", status: 'Pending' }
  ];

  const recentExpenses: Expense[] = [
    { id: "EXP-88", category: "Rent & Utilities", amount: 1200.00, description: "Monthly shop rent contribution", date: "01/07/2026" },
    { id: "EXP-87", category: "Packaging", amount: 150.00, description: "Custom herbal amber bottles", date: "14/07/2026" },
    { id: "EXP-86", category: "Logistics", amount: 85.00, description: "Import customs delivery charge", date: "15/07/2026" }
  ];

  const topSellingProducts: ProductPerformance[] = [
    { sku: "HABB-001", name: "Premium Black Seed Oil", arabicName: "حبة البركة ممتاز", unitsSold: 240, revenue: 3600.00 },
    { sku: "HON-002", name: "Royal Sidr Honey (Yemen)", arabicName: "عسل سدر ملكي", unitsSold: 45, revenue: 2025.00 },
    { sku: "SEN-003", name: "Organic Senna Leaves", arabicName: "سنا مكي عضوي", unitsSold: 180, revenue: 1440.00 }
  ];

  const leastSellingProducts: ProductPerformance[] = [
    { sku: "CAP-012", name: "Empty Gelatin Capsules (Size 0)", arabicName: "كبسولات فارغة", unitsSold: 2, revenue: 16.00 },
    { sku: "MISW-09", name: "Standard Olive Wood Miswak", arabicName: "سواك زيتون", unitsSold: 5, revenue: 10.00 }
  ];

  // Helper function to check role access
  const hasAccess = (allowedRoles: UserRole[]) => {
    return allowedRoles.includes(currentRole);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] text-gray-800 p-4 md:p-8 font-sans">
      
      {/* --- UPPER CONTROLS & HEADER --- */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-emerald-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-600 rounded-lg text-white">
              <Sparkles size={20} />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-emerald-950">
              Almalik Islamic Medicine
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">Herbal Center Operational Hub • Welcome, {currentRole}</p>
        </div>

        {/* Action controls (Simulation tool pane) */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-emerald-50">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50/50 rounded-lg text-xs font-semibold text-emerald-800">
            <ShieldCheck size={14} />
            <span>Simulate Role:</span>
          </div>
          <select 
            value={currentRole} 
            onChange={(e) => setCurrentRole(e.target.value as UserRole)}
            className="text-sm border-0 focus:ring-2 focus:ring-emerald-500 rounded-lg bg-gray-50 px-3 py-1.5 font-medium cursor-pointer text-gray-700"
          >
            <option value="Owner">Owner (All Access)</option>
            <option value="Manager">Manager</option>
            <option value="Cashier">Cashier</option>
            <option value="Inventory Officer">Inventory Officer</option>
            <option value="Sales Officer">Sales Officer</option>
          </select>

          {hasAccess(['Owner', 'Manager']) && (
            <button 
              onClick={() => setShowSensitiveData(!showSensitiveData)}
              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
              title="Toggle financial privacy"
            >
              {showSensitiveData ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
      </header>

      {/* --- SECTION 1: PRIMARY FINANCIAL METRICS GRID --- */}
      <section className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          Financial Performance Indices
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Today's Sales */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-6 -mt-6 transition-all group-hover:scale-110" />
            <div className="flex justify-between items-start mb-4">
              <span className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                <ShoppingBag size={20} />
              </span>
              <span className="text-emerald-600 text-xs font-bold flex items-center bg-emerald-50 px-2 py-1 rounded-lg">
                <TrendingUp size={12} className="mr-1" /> +12% vs yest.
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase">Today's Sales</p>
            <h3 className="text-2xl font-extrabold text-emerald-950 mt-1">${financialMetrics.todaySales.toLocaleString()}</h3>
          </div>

          {/* Today's Profit (Sensitive Data) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full -mr-6 -mt-6 transition-all group-hover:scale-110" />
            <div className="flex justify-between items-start mb-4">
              <span className="p-3 bg-teal-50 text-teal-700 rounded-xl">
                <DollarSign size={20} />
              </span>
              <span className="text-emerald-600 text-xs font-bold flex items-center bg-emerald-50 px-2 py-1 rounded-lg">
                <Percent size={12} className="mr-1" /> 33.5% margin
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase">Today's Profit</p>
            <h3 className="text-2xl font-extrabold text-emerald-950 mt-1">
              {hasAccess(['Owner', 'Manager']) ? (
                showSensitiveData ? `$${financialMetrics.todayProfit.toLocaleString()}` : '••••••'
              ) : (
                <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded">Owner/Mgr Only</span>
              )}
            </h3>
          </div>

          {/* Monthly Sales */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50/50 rounded-bl-full -mr-6 -mt-6 transition-all group-hover:scale-110" />
            <div className="flex justify-between items-start mb-4">
              <span className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                <TrendingUp size={20} />
              </span>
              <span className="text-emerald-600 text-xs font-bold flex items-center bg-emerald-50 px-2 py-1 rounded-lg">
                Target: 96% met
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase">Monthly Sales</p>
            <h3 className="text-2xl font-extrabold text-emerald-950 mt-1">${financialMetrics.monthlySales.toLocaleString()}</h3>
          </div>

          {/* Monthly Profit (Sensitive Data) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-6 -mt-6 transition-all group-hover:scale-110" />
            <div className="flex justify-between items-start mb-4">
              <span className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
                <Activity size={20} />
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase">Monthly Profit</p>
            <h3 className="text-2xl font-extrabold text-emerald-950 mt-1">
              {hasAccess(['Owner', 'Manager']) ? (
                showSensitiveData ? `$${financialMetrics.monthlyProfit.toLocaleString()}` : '••••••'
              ) : (
                <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded">Owner/Mgr Only</span>
              )}
            </h3>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: HEALTH & ALERT CENTER (INVENTORY METRICS) --- */}
      <section className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Stock Counter */}
          <div className="lg:col-span-1 bg-gradient-to-br from-emerald-900 to-emerald-950 p-6 rounded-2xl text-white shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="p-2.5 bg-emerald-800/60 rounded-xl text-emerald-200">
                  <Package size={22} />
                </span>
                <span className="text-emerald-300 text-xs font-semibold px-2 py-1 bg-emerald-800/40 rounded-lg">
                  Est. Stock Valuation
                </span>
              </div>
              <p className="text-emerald-300/80 text-xs font-medium uppercase tracking-wider">Inventory Value</p>
              <h3 className="text-3xl font-black tracking-tight mt-1">
                {hasAccess(['Owner', 'Manager']) ? (
                  showSensitiveData ? `$${financialMetrics.inventoryValue.toLocaleString()}` : '••••••'
                ) : (
                  <span className="text-sm font-semibold text-emerald-300">Restricted</span>
                )}
              </h3>
            </div>

            <div className="mt-8 border-t border-emerald-800 pt-4 flex justify-between items-center text-emerald-200">
              <div>
                <p className="text-2xl font-bold">{financialMetrics.totalProductsInStock}</p>
                <p className="text-[10px] uppercase text-emerald-400 font-bold">Total Items in Stock</p>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-sm font-bold text-emerald-300">{relationCounts.activeCustomers}</p>
                  <p className="text-[9px] uppercase tracking-wider text-emerald-400">Customers</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-emerald-300">{relationCounts.activeSuppliers}</p>
                  <p className="text-[9px] uppercase tracking-wider text-emerald-400">Suppliers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Warnings / Risks */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
            <h3 className="text-sm font-bold text-emerald-950 mb-4 flex items-center gap-1.5">
              <AlertTriangle size={16} className="text-amber-500" />
              Real-time Risk Management
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 h-full pb-6">
              
              {/* Out of Stock */}
              <div className="bg-red-50/50 p-4 rounded-xl border border-red-100/50 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span className="text-[10px] font-bold text-red-700 bg-red-100/80 px-1.5 py-0.5 rounded">Critical</span>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-red-950">{inventoryAlerts.outOfStock}</h4>
                  <p className="text-xs text-red-900 font-semibold">Out of Stock</p>
                </div>
              </div>

              {/* Low Stock */}
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/50 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded">Action Req.</span>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-amber-955">{inventoryAlerts.lowStock}</h4>
                  <p className="text-xs text-amber-900 font-semibold">Low Stock Items</p>
                </div>
              </div>

              {/* Expiring Soon */}
              <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100/50 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span className="text-[10px] font-bold text-orange-700 bg-orange-100/80 px-1.5 py-0.5 rounded">&lt; 90 Days</span>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-orange-950">{inventoryAlerts.expiringSoon}</h4>
                  <p className="text-xs text-orange-900 font-semibold">Expiring Soon</p>
                </div>
              </div>

              {/* Expired Products */}
              <div className="bg-[#5c4033]/5 p-4 rounded-xl border border-[#5c4033]/10 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="w-2 h-2 rounded-full bg-amber-950"></span>
                  <span className="text-[10px] font-bold text-amber-950 bg-amber-100 px-1.5 py-0.5 rounded">Wasted</span>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-amber-950">{inventoryAlerts.expiredProducts}</h4>
                  <p className="text-xs text-amber-900 font-semibold">Expired Products</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* --- SECTION 3: RECENT ACTIVITIES (SALES & PURCHASES & EXPENSES) --- */}
      <section className="mb-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Recent Sales Activity */}
        <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
              <Layers size={16} className="text-emerald-700" />
              Recent POS Register Actions
            </h3>
            <button className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1">
              Go to POS Register <ArrowRight size={12} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-semibold uppercase">
                  <th className="pb-3">Receipt ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3 text-center">Items</th>
                  <th className="pb-3 text-right">Total Invoice</th>
                  <th className="pb-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="py-3.5 font-bold text-emerald-900">{sale.id}</td>
                    <td className="py-3.5 font-medium">{sale.customerName}</td>
                    <td className="py-3.5 text-center font-medium">{sale.itemsCount}</td>
                    <td className="py-3.5 text-right font-black text-emerald-950">${sale.total.toFixed(2)}</td>
                    <td className="py-3.5 text-right text-gray-400">{sale.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
          <h3 className="text-sm font-bold text-emerald-950 mb-4 flex items-center gap-1.5">
            <DollarSign size={16} className="text-emerald-700" />
            Recent Shop Expenses
          </h3>

          <div className="space-y-4">
            {recentExpenses.map((expense) => (
              <div key={expense.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-xl hover:bg-emerald-50/20 transition-colors border border-transparent hover:border-emerald-100/30">
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">{expense.category}</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">{expense.description}</p>
                  <span className="text-[9px] text-gray-300 font-semibold block mt-1">{expense.date}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-red-700">-${expense.amount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* --- SECTION 4: PURCHASES & PRODUCT PERFORMANCE SPLIT --- */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Recent Purchases from Suppliers */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
          <h3 className="text-sm font-bold text-emerald-950 mb-4 flex items-center gap-1.5">
            <Clock size={16} className="text-emerald-700" />
            Supplier Acquisitions
          </h3>

          <div className="space-y-4">
            {recentPurchases.map((purchase) => (
              <div key={purchase.id} className="p-3 bg-gray-50 rounded-xl flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gray-800">{purchase.supplierName}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      purchase.status === 'Received' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>{purchase.status}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">{purchase.itemsCount} units • {purchase.date}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-950">${purchase.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
          <h3 className="text-sm font-bold text-emerald-950 mb-4 flex items-center gap-1.5">
            <TrendingUp size={16} className="text-emerald-700" />
            Top Selling Remedies
          </h3>

          <div className="space-y-3">
            {topSellingProducts.map((prod) => (
              <div key={prod.sku} className="flex justify-between items-center border-b border-gray-50 pb-2.5 last:border-0 last:pb-0">
                <div>
                  <div className="flex items-baseline gap-1">
                    <h4 className="text-xs font-bold text-gray-800">{prod.name}</h4>
                    {prod.arabicName && <span className="text-[10px] text-emerald-700 font-medium font-arabic">({prod.arabicName})</span>}
                  </div>
                  <span className="text-[9px] text-gray-400 font-semibold">{prod.sku} • {prod.unitsSold} units sold</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-950">${prod.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Least Selling Products */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
          <h3 className="text-sm font-bold text-emerald-950 mb-4 flex items-center gap-1.5">
            <TrendingDown size={16} className="text-amber-600" />
            Least Selling Stock
          </h3>

          <div className="space-y-3">
            {leastSellingProducts.map((prod) => (
              <div key={prod.sku} className="flex justify-between items-center border-b border-gray-50 pb-2.5 last:border-0 last:pb-0">
                <div>
                  <div className="flex items-baseline gap-1">
                    <h4 className="text-xs font-medium text-gray-700">{prod.name}</h4>
                    {prod.arabicName && <span className="text-[10px] text-gray-400 font-arabic">({prod.arabicName})</span>}
                  </div>
                  <span className="text-[9px] text-gray-400 font-semibold">{prod.sku} • Only {prod.unitsSold} units sold</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-800">${prod.revenue.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

    </div>
  );
}