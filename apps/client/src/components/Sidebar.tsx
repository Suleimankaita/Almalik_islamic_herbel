import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  Users,
  Building2,
  Receipt,
  BarChart3,
  Bell,
  UserCog,
  Settings,
  DatabaseBackup,
  Leaf,
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: LucideIcon;
  active?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Inventory', icon: Package },
  { label: 'Sales (POS)', icon: ShoppingCart },
  { label: 'Purchases', icon: Truck },
  { label: 'Customers', icon: Users },
  { label: 'Suppliers', icon: Building2 },
  { label: 'Expenses', icon: Receipt },
  { label: 'Reports', icon: BarChart3 },
  { label: 'Notifications', icon: Bell },
  { label: 'Users & Roles', icon: UserCog },
  { label: 'Settings', icon: Settings },
  { label: 'Backup & Restore', icon: DatabaseBackup },
];

export default function Sidebar() {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-greenLight">
          <Leaf className="text-brand-green" size={22} />
        </div>
        <div>
          <p className="text-[15px] font-extrabold leading-tight tracking-tight text-gray-900">
            AL MALIK
          </p>
          <p className="text-[10px] font-semibold leading-tight text-brand-green">
            ISLAMIC MEDICINE
          </p>
          <p className="text-[9px] italic leading-tight text-gray-400">Healing through Sunnah</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <button
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                    item.active
                      ? 'bg-brand-green text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
