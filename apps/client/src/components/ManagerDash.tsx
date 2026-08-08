import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Search, Bell, Mail, Calendar, ChevronDown, DollarSign, ShoppingBag, 
  Users, Package, Check, X, Leaf
} from 'lucide-react';

// --- Mock Data ---

const salesData = [
  { name: 'May 25', value: 400 },
  { name: 'May 26', value: 750 },
  { name: 'May 27', value: 600 },
  { name: 'May 28', value: 850 },
  { name: 'May 29', value: 900 },
  { name: 'May 30', value: 800 },
  { name: 'May 31', value: 1245.80 },
];

const bestSellingData = [
  { id: 1, name: 'Ashwagandha Capsules', sold: 32, revenue: '$640.00' },
  { id: 2, name: 'Moringa Powder', sold: 25, revenue: '$425.00' },
  { id: 3, name: 'Turmeric & Ginger Capsules', sold: 20, revenue: '$360.00' },
  { id: 4, name: 'Black Seed Oil', sold: 18, revenue: '$324.00' },
  { id: 5, name: 'Senna Leaves', sold: 15, revenue: '$270.00' },
];

const recentOrders = [
  { id: '#ORD12568', customer: 'Ahmed Almalik', product: 'Ashwagandha Capsules × 2', status: 'Completed', statusColor: 'bg-green-100 text-green-700', total: '$49.99' },
  { id: '#ORD12567', customer: 'Fatima Zahra', product: 'Moringa Powder × 1', status: 'Processing', statusColor: 'bg-orange-100 text-orange-700', total: '$34.50' },
  { id: '#ORD12566', customer: 'Youssef Hassan', product: 'Turmeric Capsules × 1', status: 'Shipped', statusColor: 'bg-blue-100 text-blue-700', total: '$22.75' },
  { id: '#ORD12565', customer: 'Sara Ahmed', product: 'Black Seed Oil × 1', status: 'Completed', statusColor: 'bg-green-100 text-green-700', total: '$15.99' },
  { id: '#ORD12564', customer: 'Khaled Mahmoud', product: 'Senna Leaves × 1', status: 'Cancelled', statusColor: 'bg-red-100 text-red-700', total: '$29.90' },
];

const tasks = [
  { id: 1, text: 'Process pending orders', subtext: '6 orders pending', priority: 'High', priorityColor: 'bg-red-50 text-red-600', checked: false },
  { id: 2, text: 'Update product stock', subtext: '12 products low in stock', priority: 'Medium', priorityColor: 'bg-orange-50 text-orange-600', checked: true },
  { id: 3, text: 'Prepare daily sales report', subtext: 'Due today at 6:00 PM', priority: 'Low', priorityColor: 'bg-blue-50 text-blue-600', checked: false },
  { id: 4, text: 'Clean and organize store', subtext: 'Completed', priority: 'Done', priorityColor: 'bg-green-50 text-green-700', checked: true },
  { id: 5, text: 'Follow up with customers', subtext: '3 customers', priority: 'Low', priorityColor: 'bg-blue-50 text-blue-600', checked: false },
];

const inventoryData = [
  { name: 'In Stock', value: 85, percentage: '66.4%', color: '#16a34a' },
  { name: 'Low Stock', value: 25, percentage: '19.5%', color: '#eab308' },
  { name: 'Out of Stock', value: 10, percentage: '7.8%', color: '#ef4444' },
  { name: 'Others', value: 8, percentage: '6.3%', color: '#9ca3af' },
];

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-800">
      
      {/* Top Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
           <Leaf className="w-8 h-8 text-[#2c5228]" />
           <span className="font-bold text-lg tracking-wider text-[#1e3b1c]">ALMALIK HERBEL</span>
        </div>
        <div className="flex-1 max-w-xl px-8 hidden md:block">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <input 
               type="text" 
               placeholder="Search products, orders..." 
               className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20" 
             />
           </div>
        </div>
        <div className="flex items-center gap-4">
           <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
             <Bell className="w-5 h-5" />
             <span className="absolute top-1 right-1 w-2 h-2 bg-green-700 rounded-full border border-white flex items-center justify-center text-[8px] text-white font-bold leading-none w-3.5 h-3.5">5</span>
           </button>
           <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
             <Mail className="w-5 h-5" />
             <span className="absolute top-1 right-1 w-2 h-2 bg-green-700 rounded-full border border-white flex items-center justify-center text-[8px] text-white font-bold leading-none w-3.5 h-3.5">2</span>
           </button>
           <div className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer">
             <img src="https://ui-avatars.com/api/?name=Suleiman+Yusuf+Kaita&background=e2e8f0&color=1e293b" alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
             <div className="hidden sm:block">
               <div className="text-sm font-semibold text-gray-900 leading-tight">Suleiman Yusuf Kaita</div>
               <div className="text-xs text-gray-500">Staff</div>
             </div>
             <ChevronDown className="w-4 h-4 text-gray-400" />
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
           <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Good morning, Suleiman <Leaf className="w-6 h-6 text-green-600 drop-shadow-sm" />
              </h1>
              <p className="text-gray-500 text-sm mt-1">Here's your performance and tasks overview.</p>
           </div>
           <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
              <Calendar className="w-4 h-4 text-gray-500" />
              May 31, 2025
              <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
           </button>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
             <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <DollarSign className="w-6 h-6" />
             </div>
             <div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Today's Sales</div>
                <div className="text-2xl font-bold text-gray-900">$1,245.80</div>
                <div className="text-xs flex items-center mt-1">
                  <span className="font-semibold text-green-600 mr-1">↑ 12.6%</span> <span className="text-gray-400">vs yesterday</span>
                </div>
             </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
             <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <ShoppingBag className="w-6 h-6" />
             </div>
             <div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Orders Processed</div>
                <div className="text-2xl font-bold text-gray-900">18</div>
                <div className="text-xs flex items-center mt-1">
                  <span className="font-semibold text-green-600 mr-1">↑ 20.0%</span> <span className="text-gray-400">vs yesterday</span>
                </div>
             </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
             <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Users className="w-6 h-6" />
             </div>
             <div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Customers Served</div>
                <div className="text-2xl font-bold text-gray-900">27</div>
                <div className="text-xs flex items-center mt-1">
                  <span className="font-semibold text-green-600 mr-1">↑ 8.0%</span> <span className="text-gray-400">vs yesterday</span>
                </div>
             </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
             <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Package className="w-6 h-6" />
             </div>
             <div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Products Sold</div>
                <div className="text-2xl font-bold text-gray-900">56</div>
                <div className="text-xs flex items-center mt-1">
                  <span className="font-semibold text-green-600 mr-1">↑ 15.2%</span> <span className="text-gray-400">vs yesterday</span>
                </div>
             </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sales Overview */}
          <div className="lg:col-span-8 bg-white border border-gray-100 shadow-sm rounded-2xl p-5 md:p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Sales Overview</h2>
              <button className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
                This Week <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="flex-1 min-h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(val) => `$${val >= 1000 ? (val/1000).toFixed(1) + 'k' : val}`} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`$${value}`, 'Sales']}
                  />
                  <Area type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Best Selling Products */}
          <div className="lg:col-span-4 bg-white border border-gray-100 shadow-sm rounded-2xl p-5 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Best Selling Products</h2>
              <a href="#" className="text-sm font-medium text-green-600 hover:underline">View all</a>
            </div>
            <div className="space-y-5">
              {bestSellingData.map(item => (
                <div key={item.id} className="flex items-center justify-between group">
                   <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center text-green-700 font-bold text-lg">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                         <div className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{item.name}</div>
                         <div className="text-xs text-gray-500 mt-0.5">{item.sold} sold</div>
                      </div>
                   </div>
                   <div className="text-sm font-bold text-gray-900">{item.revenue}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Recent Orders */}
          <div className="lg:col-span-5 bg-white border border-gray-100 shadow-sm rounded-2xl p-5 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
              <a href="#" className="text-sm font-medium text-green-600 hover:underline">View all</a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100 uppercase tracking-wider">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Products</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 text-gray-500">{order.id}</td>
                      <td className="py-4 font-medium text-gray-900 flex items-center gap-2">
                        <img src={`https://ui-avatars.com/api/?name=${order.customer.replace(' ', '+')}&background=random&size=24`} alt={order.customer} className="w-6 h-6 rounded-full" />
                        {order.customer}
                      </td>
                      <td className="py-4 text-gray-600">{order.product}</td>
                      <td className="py-4">
                         <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${order.statusColor}`}>
                           {order.status}
                         </span>
                      </td>
                      <td className="py-4 font-bold text-gray-900 text-right">{order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* My Tasks */}
          <div className="lg:col-span-4 bg-white border border-gray-100 shadow-sm rounded-2xl p-5 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">My Tasks</h2>
              <a href="#" className="text-sm font-medium text-green-600 hover:underline">View all</a>
            </div>
            <div className="flex flex-col space-y-5">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3">
                  <button className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.checked ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300 hover:border-green-600'}`}>
                     {task.checked && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <div className="flex-1">
                     <div className={`text-sm ${task.checked ? 'text-gray-400 line-through' : 'text-gray-900 font-semibold'}`}>{task.text}</div>
                     <div className="text-xs text-gray-500 mt-0.5">{task.subtext}</div>
                  </div>
                  <div className={`px-2 py-1 text-[10px] font-bold rounded-md ${task.priorityColor}`}>
                     {task.priority}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Summary */}
          <div className="lg:col-span-3 bg-white border border-gray-100 shadow-sm rounded-2xl p-5 md:p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-gray-900">Inventory Summary</h2>
              <a href="#" className="text-sm font-medium text-green-600 hover:underline">View all</a>
            </div>
            <div className="relative h-48 flex items-center justify-center my-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryData}
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {inventoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-3xl font-bold text-gray-900">128</div>
                <div className="text-xs font-medium text-gray-500 text-center leading-tight mt-1">Total<br/>Products</div>
              </div>
            </div>
            <div className="space-y-3">
              {inventoryData.map(item => (
                 <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                       <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                       <span className="text-gray-600 font-medium">{item.name}</span>
                    </div>
                    <div className="text-gray-500">
                       <span className="font-bold text-gray-900 mr-1">{item.value}</span> 
                       <span className="text-xs">({item.percentage})</span>
                    </div>
                 </div>
              ))}
            </div>
          </div>
        </div>

        {/* Announcement Footer */}
        <div className="bg-gradient-to-r from-[#eef7ec] to-[#f6fbf4] border border-green-100 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white rounded-xl shadow-sm">
               <Leaf className="w-6 h-6 text-green-700" />
             </div>
             <div>
               <div className="font-bold text-gray-900 text-base">Announcement</div>
               <div className="text-sm text-gray-600 mt-0.5">New herbal products are arriving next week. Stay tuned!</div>
             </div>
          </div>
          <button className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 hover:text-gray-900 text-gray-400 transition-colors shadow-sm self-end sm:self-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}