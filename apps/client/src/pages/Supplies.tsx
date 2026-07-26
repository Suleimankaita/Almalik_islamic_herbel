import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Truck,
  Package,
  Plus,
  Search,
  Download,
  MoreVertical,
  Mail,
  Phone,
  Check,
  Edit2,
  Trash2,
  Eye,
  Leaf,
  Clock,
  DollarSign,
  ShoppingBag
} from 'lucide-react';

// --- Types ---
interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: 'Raw Herbs' | 'Packaging & Bottles' | 'Lab & Testing' | 'Logistics';
  itemsSupplied: number;
  leadTime: string;
  status: 'Active' | 'On Hold' | 'Inactive';
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

// --- Mock Data ---
const initialSuppliers: Supplier[] = [
  {
    id: 'SUP-501',
    name: 'Katsina Organic Botanicals',
    contactPerson: 'Alhaji Mansur',
    email: 'mansur@katsinabotanicals.ng',
    phone: '+234 803 123 4567',
    category: 'Raw Herbs',
    itemsSupplied: 14,
    leadTime: '3-5 days',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80'
  },
  {
    id: 'SUP-502',
    name: 'Savannah Leaf & Root Co.',
    contactPerson: 'Dr. Fatima Lawal',
    email: 'orders@savannahleaf.com',
    phone: '+234 802 987 6543',
    category: 'Raw Herbs',
    itemsSupplied: 22,
    leadTime: '2-4 days',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80'
  },
  {
    id: 'SUP-503',
    name: 'Sahel Eco-Packaging Solutions',
    contactPerson: 'Chinedu Okafor',
    email: 'support@sahelpack.ng',
    phone: '+234 814 555 7890',
    category: 'Packaging & Bottles',
    itemsSupplied: 8,
    leadTime: '5-7 days',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80'
  },
  {
    id: 'SUP-504',
    name: 'Zaria Quality Lab Tests',
    contactPerson: 'Prof. Yakubu Bello',
    email: 'y.bello@zarialabs.org',
    phone: '+234 809 333 2211',
    category: 'Lab & Testing',
    itemsSupplied: 5,
    leadTime: '1-2 days',
    status: 'On Hold',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80'
  },
  {
    id: 'SUP-505',
    name: 'Trans-Sahel Express Logistics',
    contactPerson: 'Musa Dankolo',
    email: 'dispatch@transsahel.ng',
    phone: '+234 816 777 8899',
    category: 'Logistics',
    itemsSupplied: 1,
    leadTime: '1 day',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&q=80'
  }
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

const CategoryBadge = ({ category }: { category: Supplier['category'] }) => {
  const styles: Record<string, string> = {
    'Raw Herbs': 'bg-[#E8F3EB] text-[#2C5234] border-[#E8F3EB]',
    'Packaging & Bottles': 'bg-[#FDF3E1] text-[#B87C2B] border-[#FDF3E1]',
    'Lab & Testing': 'bg-purple-50 text-purple-700 border-purple-100',
    'Logistics': 'bg-blue-50 text-blue-700 border-blue-100'
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${styles[category] || 'bg-gray-100 text-gray-700'}`}>
      {category}
    </span>
  );
};

const StatusBadge = ({ status }: { status: Supplier['status'] }) => {
  const styles = {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'On Hold': 'bg-amber-50 text-amber-700 border-amber-200',
    Inactive: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${status === 'Active' ? 'bg-emerald-500' : status === 'On Hold' ? 'bg-amber-500' : 'bg-rose-500'}`} />
      {status}
    </span>
  );
};

// --- Main Page Component ---
export default function SuppliesPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);

  const dropdownRef:any = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useOnClickOutside(dropdownRef, () => {
    setActiveDropdown(null);
  });

  const showToast = (message: string) => {
    setToast({ message, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((sup) => {
      const matchesSearch = sup.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            sup.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            sup.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || sup.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [suppliers, searchQuery, categoryFilter]);

  const handleDeleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
    setActiveDropdown(null);
    showToast('Supplier removed from record.');
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

      <div className="mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="relative mb-8 animate-fade-in-up opacity-0 fill-mode-forwards">
          <div className="relative z-10 w-full md:w-2/3">
            <h1 className="text-3xl sm:text-4xl font-serif text-[#1e3a24] tracking-tight">
              Supplies & Vendors
            </h1>
            <div className="my-3 flex items-center text-[#C19A5B] opacity-60">
              <div className="h-px w-12 bg-current"></div>
              <Leaf size={14} className="mx-2" />
              <div className="h-px w-12 bg-current"></div>
            </div>
            <p className="text-sm sm:text-base text-gray-500">Manage herbal raw material suppliers, packaging vendors, batch lead times, and fulfillment contracts.</p>
          </div>
          
          {/* Botanical Image Decoration */}
          <div className="absolute right-0 top-0 h-32 w-48 sm:w-64 md:h-40 md:w-80 pointer-events-none overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#FAF9F6] z-10" />
             <img 
               src="https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop" 
               alt="Botanical decoration" 
               className="w-full h-full object-cover object-left-top opacity-30 mix-blend-multiply"
             />
          </div>
        </div>

        {/* Summary Cards (KPIs) */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard title="Active Vendors" value={suppliers.length.toString()} subtext="Verified herbal & packaging partners" icon={Truck} trend={{ value: '+2 new', isPositive: true }} delay={100} />
          <SummaryCard title="Catalog Items" value="50+" subtext="Raw leaves, roots & bottles" icon={Package} delay={150} />
          <SummaryCard title="Avg Lead Time" value="3.2 Days" subtext="Fast regional transit" icon={Clock} delay={200} />
          <SummaryCard title="Monthly Spend" value="₦2.4M" subtext="Raw materials & restocking" icon={DollarSign} trend={{ value: '-4.1%', isPositive: true }} delay={250} />
        </div>

        {/* Table & Filters Section */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm animate-fade-in-up opacity-0 fill-mode-forwards" style={{ animationDelay: '300ms' }}>
          
          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search vendors by name, contact, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 focus:border-[#2C5234] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2C5234] transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#2C5234]"
              >
                <option value="All">All Categories</option>
                <option value="Raw Herbs">Raw Herbs</option>
                <option value="Packaging & Bottles">Packaging & Bottles</option>
                <option value="Lab & Testing">Lab & Testing</option>
                <option value="Logistics">Logistics</option>
              </select>

              <button 
                onClick={() => showToast('Exporting vendor inventory data...')}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Download size={16} className="text-gray-400" />
                Export
              </button>

              <button 
                onClick={() => showToast('Add new supplier modal opened')}
                className="flex items-center gap-2 rounded-xl bg-[#2C5234] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1e3a24] transition-colors shadow-sm"
              >
                <Plus size={16} />
                Add Supplier
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto min-h-[350px]">
            <table className="w-full min-w-[950px] text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4">Vendor / Supplier</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Contact Person</th>
                  <th className="px-6 py-4">Items / Lead Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((supplier) => (
                    <tr key={supplier.id} className="group hover:bg-[#F3F6F4]/50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <img 
                            src={supplier.avatar} 
                            alt={supplier.name} 
                            className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{supplier.name}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-0.5">
                              <Mail size={12} className="mr-1" />
                              {supplier.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <CategoryBadge category={supplier.category} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-medium text-gray-900">{supplier.contactPerson}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-0.5">
                          <Phone size={12} className="mr-1" />
                          {supplier.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-gray-900 font-medium">{supplier.itemsSupplied} products</p>
                        <p className="text-xs text-gray-400 mt-0.5">Lead time: {supplier.leadTime}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={supplier.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === supplier.id ? null : supplier.id);
                          }}
                          className={`p-1.5 rounded-md transition-colors ${
                            activeDropdown === supplier.id ? 'bg-[#F3F6F4] text-[#2C5234]' : 'text-gray-400 hover:text-[#2C5234] hover:bg-gray-100'
                          }`}
                        >
                          <MoreVertical size={18} />
                        </button>

                        {activeDropdown === supplier.id && (
                          <div 
                            ref={dropdownRef}
                            className="absolute right-8 top-10 z-55 w-48 rounded-xl border border-gray-100 bg-white py-1.5 shadow-lg ring-1 ring-black ring-opacity-5 animate-in zoom-in-95 duration-100"
                          >
                            <button 
                              onClick={() => { showToast(`Viewing purchase orders for ${supplier.name}`); setActiveDropdown(null); }}
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#F3F6F4] hover:text-[#2C5234] transition-colors"
                            >
                              <Eye size={16} /> View Catalog
                            </button>
                            <button 
                              onClick={() => { showToast(`Placing restock order with ${supplier.name}`); setActiveDropdown(null); }}
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#F3F6F4] hover:text-[#2C5234] transition-colors"
                            >
                              <ShoppingBag size={16} /> Restock Order
                            </button>
                            <button 
                              onClick={() => { showToast(`Editing supplier info for ${supplier.name}`); setActiveDropdown(null); }}
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#F3F6F4] hover:text-[#2C5234] transition-colors"
                            >
                              <Edit2 size={16} /> Edit Details
                            </button>
                            <div className="my-1 border-t border-gray-100"></div>
                            <button 
                              onClick={() => handleDeleteSupplier(supplier.id)}
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={16} /> Remove Vendor
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
                        <p className="text-lg font-medium text-gray-900">No suppliers found</p>
                        <p className="text-sm">No records matched your search parameters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
            <span className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{filteredSuppliers.length}</span> active suppliers
            </span>
            <span className="text-xs text-gray-400">Almalik Herbal Center Inventory Engine</span>
          </div>

        </div>
      </div>
    </div>
  );
}