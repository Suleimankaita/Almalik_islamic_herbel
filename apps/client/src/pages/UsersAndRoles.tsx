import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Users,
  Shield,
  UserPlus,
  Search,
  MoreVertical,
  Mail,
  Check,
  Edit2,
  Trash2,
  Key,
  Leaf,
  ShieldCheck
} from 'lucide-react';

// --- Types ---
interface UserEntry {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Store Manager' | 'Inventory Editor' | 'Customer Support' | 'Customer';
  status: 'Active' | 'Pending' | 'Deactivated';
  lastLogin: string;
  avatar: string;
}

interface RoleEntry {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  permissions: string[];
  color: string;
}

// --- Mock Data ---
const initialUsers: UserEntry[] = [
  { id: 'USR-001', name: 'Suleiman Kaita', email: 'suleiman@almalikherbel.com', role: 'Super Admin', status: 'Active', lastLogin: 'Just now', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80' },
  { id: 'USR-002', name: 'Amina Bello', email: 'amina@almalikherbel.com', role: 'Store Manager', status: 'Active', lastLogin: '2 hours ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80' },
  { id: 'USR-003', name: 'Ibrahim Sani', email: 'ibrahim@almalikherbel.com', role: 'Inventory Editor', status: 'Active', lastLogin: 'Yesterday', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80' },
  { id: 'USR-004', name: 'Zainab Umar', email: 'zainab@almalikherbel.com', role: 'Customer Support', status: 'Pending', lastLogin: 'Never', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80' },
  { id: 'USR-005', name: 'Kabiru Ahmed', email: 'kabiru@almalikherbel.com', role: 'Customer Support', status: 'Deactivated', lastLogin: '2 weeks ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80' },
];

const rolesData: RoleEntry[] = [
  { id: 'ROL-1', name: 'Super Admin', description: 'Full system access with permissions to manage settings, billing, and all user roles.', usersCount: 1, permissions: ['All Permissions', 'Billing Management', 'Role Assignment'], color: 'bg-[#2C5234] text-white' },
  { id: 'ROL-2', name: 'Store Manager', description: 'Can oversee store analytics, inventory levels, pricing structures, and order fulfillment.', usersCount: 2, permissions: ['View Analytics', 'Manage Orders', 'Update Inventory'], color: 'bg-[#6A8E61] text-white' },
  { id: 'ROL-3', name: 'Inventory Editor', description: 'Specialized access focused strictly on stock updates, herbal batch tracking, and warehouse logs.', usersCount: 4, permissions: ['Update Inventory', 'View Products', 'Stock Reports'], color: 'bg-[#C19A5B] text-white' },
  { id: 'ROL-4', name: 'Customer Support', description: 'Handles client inquiries, order returns, and shipping status verification.', usersCount: 8, permissions: ['View Customers', 'Manage Support Tickets', 'View Orders'], color: 'bg-gray-200 text-gray-800' },
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
const RoleBadge = ({ role }: { role: UserEntry['role'] }) => {
  const styles: Record<string, string> = {
    'Super Admin': 'bg-[#FDF3E1] text-[#B87C2B] border-[#FDF3E1]',
    'Store Manager': 'bg-[#E8F3EB] text-[#2C5234] border-[#E8F3EB]',
    'Inventory Editor': 'bg-[#F3F4F6] text-gray-700 border-gray-200',
    'Customer Support': 'bg-blue-50 text-blue-700 border-blue-100',
    'Customer': 'bg-gray-100 text-gray-600 border-gray-100'
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${styles[role] || 'bg-gray-100 text-gray-700'}`}>
      {role}
    </span>
  );
};

const StatusBadge = ({ status }: { status: UserEntry['status'] }) => {
  const styles = {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Deactivated: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${status === 'Active' ? 'bg-emerald-500' : status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'}`} />
      {status}
    </span>
  );
};

// --- Main Page Component ---
export default function UsersAndRolesPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [users, setUsers] = useState<UserEntry[]>(initialUsers);
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

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    setActiveDropdown(null);
    showToast('User successfully removed from system.');
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
              Users & Roles
            </h1>
            <div className="my-3 flex items-center text-[#C19A5B] opacity-60">
              <div className="h-px w-12 bg-current"></div>
              <Leaf size={14} className="mx-2" />
              <div className="h-px w-12 bg-current"></div>
            </div>
            <p className="text-sm sm:text-base text-gray-500">Manage administrative permissions, staff accounts, and role security hierarchies.</p>
          </div>
          
          {/* Botanical Image Decoration */}
          <div className="absolute right-0 top-0 h-32 w-48 sm:w-64 md:h-40 md:w-80 pointer-events-none overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#FAF9F6] z-10" />
             <img 
               src="https://images.unsplash.com/photo-1550505096-7bbdeecb3e4f?q=80&w=800&auto=format&fit=crop" 
               alt="Botanical decoration" 
               className="w-full h-full object-cover object-left-top opacity-30 mix-blend-multiply"
             />
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mb-6 flex items-center gap-2 border-b border-gray-200 pb-2 animate-fade-in-up opacity-0 fill-mode-forwards" style={{ animationDelay: '100ms' }}>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
              activeTab === 'users'
                ? 'bg-[#2C5234] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Users size={16} /> Team Members ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
              activeTab === 'roles'
                ? 'bg-[#2C5234] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Shield size={16} /> Roles & Permissions ({rolesData.length})
          </button>
        </div>

        {/* Tab Content 1: Users Directory */}
        {activeTab === 'users' && (
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm animate-fade-in-up opacity-0 fill-mode-forwards" style={{ animationDelay: '200ms' }}>
            
            {/* Toolbar */}
            <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search staff by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 focus:border-[#2C5234] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2C5234] transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#2C5234]"
                >
                  <option value="All">All Roles</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Store Manager">Store Manager</option>
                  <option value="Inventory Editor">Inventory Editor</option>
                  <option value="Customer Support">Customer Support</option>
                </select>

                <button 
                  onClick={() => showToast('Invitation modal triggered')}
                  className="flex items-center gap-2 rounded-xl bg-[#2C5234] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1e3a24] transition-colors shadow-sm"
                >
                  <UserPlus size={16} />
                  Invite New User
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto min-h-[350px]">
              <table className="w-full min-w-[900px] text-left text-sm text-gray-600">
                <thead className="bg-gray-50/50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Assigned Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Last Login</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="group hover:bg-[#F3F6F4]/50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <img 
                              src={user.avatar} 
                              alt={user.name} 
                              className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <div className="flex items-center text-xs text-gray-500 mt-0.5">
                                <Mail size={12} className="mr-1" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <RoleBadge role={user.role} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={user.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                          {user.lastLogin}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(activeDropdown === user.id ? null : user.id);
                            }}
                            className={`p-1.5 rounded-md transition-colors ${
                              activeDropdown === user.id ? 'bg-[#F3F6F4] text-[#2C5234]' : 'text-gray-400 hover:text-[#2C5234] hover:bg-gray-100'
                            }`}
                          >
                            <MoreVertical size={18} />
                          </button>

                          {activeDropdown === user.id && (
                            <div 
                              ref={dropdownRef}
                              className="absolute right-8 top-10 z-50 w-48 rounded-xl border border-gray-100 bg-white py-1.5 shadow-lg ring-1 ring-black ring-opacity-5 animate-in zoom-in-95 duration-100"
                            >
                              <button 
                                onClick={() => { showToast(`Editing permissions for ${user.name}`); setActiveDropdown(null); }}
                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#F3F6F4] hover:text-[#2C5234] transition-colors"
                              >
                                <Edit2 size={16} /> Edit Role
                              </button>
                              <button 
                                onClick={() => { showToast(`Password reset link sent to ${user.email}`); setActiveDropdown(null); }}
                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#F3F6F4] hover:text-[#2C5234] transition-colors"
                              >
                                <Key size={16} /> Reset Password
                              </button>
                              <div className="my-1 border-t border-gray-100"></div>
                              <button 
                                onClick={() => handleDeleteUser(user.id)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 size={16} /> Remove User
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <Search size={32} className="text-gray-300 mb-3" />
                          <p className="text-lg font-medium text-gray-900">No members found</p>
                          <p className="text-sm">No user records matched your criteria.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
              <span className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-900">{filteredUsers.length}</span> members
              </span>
              <span className="text-xs text-gray-400">Almalik Herbal Access Control v2.4</span>
            </div>

          </div>
        )}

        {/* Tab Content 2: Roles & Permissions Matrix */}
        {activeTab === 'roles' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 animate-fade-in-up opacity-0 fill-mode-forwards" style={{ animationDelay: '200ms' }}>
            {rolesData.map((role, idx) => (
              <div 
                key={role.id}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center rounded-xl px-3 py-1 text-xs font-semibold ${role.color}`}>
                      {role.name}
                    </span>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                      {role.usersCount} Active User{role.usersCount > 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                  
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Key Permissions</p>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((perm, pIdx) => (
                        <span key={pIdx} className="inline-flex items-center gap-1 rounded-lg bg-[#F3F6F4] px-2.5 py-1 text-xs text-[#2C5234]">
                          <ShieldCheck size={12} /> {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                  <button 
                    onClick={() => showToast(`Configuring permissions for ${role.name}`)}
                    className="text-sm font-medium text-[#2C5234] hover:underline"
                  >
                    Edit Permissions
                  </button>
                  <button 
                    onClick={() => showToast(`Duplicated role: ${role.name}`)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Clone Role
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}