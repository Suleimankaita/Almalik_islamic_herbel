import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Users,
  UserPlus,
  UserCheck,
  TrendingUp,
  Search,
  Filter,
  Download,
  MoreVertical,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Check,
  Edit2,
  Trash2,
  Eye
} from 'lucide-react';

// --- Types ---
interface Customer {
  id: string;
  name: string;
  email: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
  status: 'VIP' | 'Active' | 'Inactive';
  lastActive: string;
  avatar: string;
}

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  subtext: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  delay?: number;
}

// --- Expanded Mock Data (For Pagination & Search) ---
const initialCustomers: Customer[] = [
  { id: 'CUS-1029', name: 'Eleanor Pena', email: 'eleanor.pena@example.com', location: 'New York, USA', totalOrders: 24, totalSpent: 1250.00, status: 'VIP', lastActive: '2 hours ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80' },
  { id: 'CUS-1028', name: 'Guy Hawkins', email: 'guy.hawkins@example.com', location: 'London, UK', totalOrders: 8, totalSpent: 345.50, status: 'Active', lastActive: '1 day ago', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&q=80' },
  { id: 'CUS-1027', name: 'Kristin Watson', email: 'kristin.w@example.com', location: 'Sydney, AUS', totalOrders: 1, totalSpent: 45.00, status: 'Inactive', lastActive: '2 months ago', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80' },
  { id: 'CUS-1026', name: 'Cody Fisher', email: 'cody.fisher@example.com', location: 'Toronto, CAN', totalOrders: 15, totalSpent: 890.25, status: 'VIP', lastActive: '5 hours ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80' },
  { id: 'CUS-1025', name: 'Jane Cooper', email: 'jane.cooper@example.com', location: 'Berlin, GER', totalOrders: 4, totalSpent: 120.00, status: 'Active', lastActive: '3 days ago', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80' },
  { id: 'CUS-1024', name: 'Robert Fox', email: 'robert.fox@example.com', location: 'Paris, FRA', totalOrders: 32, totalSpent: 2150.75, status: 'VIP', lastActive: '1 hour ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80' },
  { id: 'CUS-1023', name: 'Jacob Jones', email: 'jacob.jones@example.com', location: 'Austin, USA', totalOrders: 2, totalSpent: 65.00, status: 'Inactive', lastActive: '1 month ago', avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop&q=80' },
  { id: 'CUS-1022', name: 'Courtney Henry', email: 'courtney.h@example.com', location: 'Dublin, IRE', totalOrders: 6, totalSpent: 210.00, status: 'Active', lastActive: '4 days ago', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&q=80' },
  { id: 'CUS-1021', name: 'Albert Flores', email: 'albert.f@example.com', location: 'Tokyo, JPN', totalOrders: 11, totalSpent: 540.20, status: 'Active', lastActive: '12 hours ago', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80' },
  { id: 'CUS-1020', name: 'Bessie Cooper', email: 'bessie.c@example.com', location: 'Dubai, UAE', totalOrders: 45, totalSpent: 3400.00, status: 'VIP', lastActive: '15 mins ago', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80' },
];

// --- Hooks ---
function useOnClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// --- Sub-Components ---

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon: Icon, subtext, trend, delay = 0 }) => (
  <div 
    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in-up opacity-0 fill-mode-forwards flex flex-col justify-between"
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
          {trend && (
            <span className={`flex items-center text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-500'}`}>
              {trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
    <span className="mt-4 text-xs text-gray-400">{subtext}</span>
  </div>
);

const StatusBadge = ({ status }: { status: Customer['status'] }) => {
  const styles = {
    VIP: 'bg-[#FDF3E1] text-[#B87C2B] border-[#FDF3E1]',
    Active: 'bg-[#E8F3EB] text-[#2C5234] border-[#E8F3EB]',
    Inactive: 'bg-gray-100 text-gray-600 border-gray-100'
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      {status === 'VIP' && <span className="mr-1 h-1.5 w-1.5 rounded-full bg-[#B87C2B]"></span>}
      {status === 'Active' && <span className="mr-1 h-1.5 w-1.5 rounded-full bg-[#2C5234]"></span>}
      {status === 'Inactive' && <span className="mr-1 h-1.5 w-1.5 rounded-full bg-gray-400"></span>}
      {status}
    </span>
  );
};

// --- Main Page Component ---

export default function CustomersPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);

  const itemsPerPage = 5;
  const dropdownRef:any = useRef(null) ;

  // Initialize
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle Click Outside for Dropdown
  useOnClickOutside(dropdownRef, () => {
    setActiveDropdown(null);
  });

  // Search Logic
  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, customers]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Toast Helper
  const showToast = (message: string) => {
    setToast({ message, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  };

  // Actions
  const handleDelete = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
    setActiveDropdown(null);
    showToast('Customer deleted successfully');
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] px-4 py-8 sm:px-6 lg:px-8 font-sans overflow-hidden">
      
      {/* Toast Notification */}
      {toast && (
        <div
          key={toast.id}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-white shadow-xl animate-in slide-in-from-bottom-5 fade-in duration-300"
        >
          <Check size={18} className="text-green-400" />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

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
      `}</style>

      <div className="relative z-10 mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="relative mb-8 animate-fade-in-up opacity-0 fill-mode-forwards">
          <div className="relative z-10 w-full md:w-2/3">
            <h1 className="text-3xl sm:text-4xl font-serif text-[#1e3a24] tracking-tight">
              Customers
            </h1>
            <div className="my-3 flex items-center text-[#C19A5B] opacity-60">
              <div className="h-px w-12 bg-current"></div>
              <Leaf size={14} className="mx-2" />
              <div className="h-px w-12 bg-current"></div>
            </div>
            <p className="text-sm sm:text-base text-gray-500">Manage your customer base, view their activity, and analyze retention.</p>
          </div>
          
          {/* Botanical Image Decoration */}
          <div className="absolute right-0 top-0 h-32 w-48 sm:w-64 md:h-40 md:w-80 pointer-events-none overflow-hidden mask-image-gradient">
             <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#FAF9F6] z-10" />
             <img 
               src="https://images.unsplash.com/photo-1505367807804-94917b1fb931?q=80&w=800&auto=format&fit=crop" 
               alt="Botanical decoration" 
               className="w-full h-full object-cover object-left-top opacity-30 mix-blend-multiply"
             />
          </div>
        </div>

        {/* Summary Cards (KPIs) */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard title="Total Customers" value={customers.length.toString()} subtext="Across all platforms" icon={Users} trend={{ value: '+12%', isPositive: true }} delay={100} />
          <SummaryCard title="Active This Month" value="845" subtext="Placed an order recently" icon={UserCheck} delay={150} />
          <SummaryCard title="New Customers" value="124" subtext="Joined in the last 30 days" icon={UserPlus} trend={{ value: '+5.2%', isPositive: true }} delay={200} />
          <SummaryCard title="Retention Rate" value="85.4%" subtext="Returning customers" icon={TrendingUp} delay={250} />
        </div>

        {/* Table & Filters Section */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm animate-fade-in-up opacity-0 fill-mode-forwards" style={{ animationDelay: '300ms' }}>
          
          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search customers by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 focus:border-[#2C5234] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2C5234] transition-colors"
              />
            </div>
            
            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => showToast('Filters applied')}
                className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Filter size={16} className="text-gray-400" />
                Filters
              </button>
              <button 
                onClick={() => showToast('Exporting data as CSV...')}
                className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Download size={16} className="text-gray-400" />
                Export
              </button>
              <button 
                onClick={() => showToast('Add customer modal opened')}
                className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-[#2C5234] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1e3a24] transition-colors shadow-sm"
              >
                <UserPlus size={16} />
                Add Customer
              </button>
            </div>
          </div>

          {/* Table Container (Min-height prevents dropdown clipping if few rows exist) */}
          <div className="overflow-x-auto min-h-[350px]">
            <table className="w-full min-w-[900px] text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Orders</th>
                  <th className="px-6 py-4">Total Spent</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map((customer) => (
                    <tr key={customer.id} className="group hover:bg-[#F3F6F4]/50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <img 
                            src={customer.avatar} 
                            alt={customer.name} 
                            className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{customer.name}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-0.5">
                              <Mail size={12} className="mr-1" />
                              {customer.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-gray-600">
                          <MapPin size={14} className="mr-1.5 text-gray-400" />
                          {customer.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                        {customer.totalOrders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                        ${customer.totalSpent.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={customer.status} />
                        <p className="text-[11px] text-gray-400 mt-1">Last active {customer.lastActive}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === customer.id ? null : customer.id);
                          }}
                          className={`p-1.5 rounded-md transition-colors ${
                            activeDropdown === customer.id ? 'bg-[#F3F6F4] text-[#2C5234]' : 'text-gray-400 hover:text-[#2C5234] hover:bg-gray-100'
                          }`}
                        >
                          <MoreVertical size={18} />
                        </button>

                        {/* Action Dropdown Menu */}
                        {activeDropdown === customer.id && (
                          <div 
                            ref={dropdownRef}
                            className="absolute right-8 top-10 z-50 w-48 rounded-xl border border-gray-100 bg-white py-1.5 shadow-lg ring-1 ring-black ring-opacity-5 animate-in zoom-in-95 duration-100"
                          >
                            <button 
                              onClick={() => { showToast(`Viewing ${customer.name}'s profile`); setActiveDropdown(null); }}
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#F3F6F4] hover:text-[#2C5234] transition-colors"
                            >
                              <Eye size={16} /> View Profile
                            </button>
                            <button 
                              onClick={() => { showToast(`Editing ${customer.name}`); setActiveDropdown(null); }}
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#F3F6F4] hover:text-[#2C5234] transition-colors"
                            >
                              <Edit2 size={16} /> Edit Details
                            </button>
                            <div className="my-1 border-t border-gray-100"></div>
                            <button 
                              onClick={() => handleDelete(customer.id)}
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={16} /> Delete Customer
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Search size={32} className="text-gray-300 mb-3" />
                        <p className="text-lg font-medium text-gray-900">No customers found</p>
                        <p className="text-sm">We couldn't find anyone matching "{searchQuery}"</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          {filteredCustomers.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 px-6 py-4">
              <span className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * itemsPerPage, filteredCustomers.length)}</span> of <span className="font-medium text-gray-900">{filteredCustomers.length}</span> customers
              </span>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const page = idx + 1;
                  return (
                    <button 
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                        currentPage === page 
                          ? 'border-[#2C5234] bg-[#2C5234] text-white shadow-sm' 
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}