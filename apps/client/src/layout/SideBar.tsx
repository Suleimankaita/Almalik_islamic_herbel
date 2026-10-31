import { useEffect, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  History,
  Truck,
  Users,
  Building2,
  Receipt,
  BarChart3,
  Bell,
  UserCog,
  Settings,
  HandCoins,
  type LucideIcon,
} from 'lucide-react';
import { GetToken, GetToggle, GetUserDetails, SetToggle } from '../Features/AppSlice';
import { ROLE_ACCESS, normalizeRole } from '../auth/roleAccess';
import { NavLink } from 'react-router-dom';
import Logo from "../assets/Logo.png"
import { useGetLoansQuery } from '../Features/api/DataSlice';
interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Inventory', icon: Package, path: '/inventory' },
  { label: 'Sales (POS)', icon: ShoppingCart, path: '/sales-pos' },
  { label: 'Sales History', icon: History, path: '/sales-history' },
  { label: 'Loans', icon: HandCoins, path: '/loans' },
  { label: 'Paid Loans', icon: HandCoins, path: '/loans/paid' },
  { label: 'Add Product', icon: Truck, path: '/add product' },
  { label: 'Customers', icon: Users, path: '/customers' },
  { label: 'Suppliers', icon: Building2, path: '/suppliers' },
  { label: 'Expenses', icon: Receipt, path: '/expenses' },
  { label: 'Reports', icon: BarChart3, path: '/reports' },
  { label: 'Notifications', icon: Bell, path: '/notifications' },
  { label: 'Users & Roles', icon: UserCog, path: '/users-and-roles' },
  { label: 'Settings', icon: Settings, path: '/settings' },
  // { label: 'Backup & Restore', icon: DatabaseBackup },
];



export default function Sidebar() {
 
  const Open:boolean=useSelector(GetToggle)
  const dispatch=useDispatch()
  const role = normalizeRole((useSelector(GetUserDetails) as { Role?: string } | null)?.Role);
  const token = useSelector(GetToken);
  const [loanAlertDate, setLoanAlertDate] = useState('');
  const { data: loansResponse } = useGetLoansQuery(undefined, {
    skip: !token,
    pollingInterval: 60000,
  });
  useEffect(() => {
    const updateLoanAlertDate = () => {
      setLoanAlertDate(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
    };
    const timer = window.setTimeout(updateLoanAlertDate, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const upcomingLoanAlerts = (loansResponse?.loans ?? []).filter((loan: {
    DueDate?: string;
    PaidDate?: string;
  }) => !loan.PaidDate && loan.DueDate && loan.DueDate <= loanAlertDate).length;
  const visibleNavItems = navItems.filter((item) =>
    token && ROLE_ACCESS[role].includes(item.path),
  );

  return (
    <div className= {` flex flex-col h-full`}>
      {/* Logo */}
      <div className={`${!Open?'hidden':'block'} transition-all ease-in-out flex items-center gap-3 px-6 py-6`}>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-greenLight">
      <img src={Logo} width={100} height={100} className='rounded-full'/>
          {/* <Leaf className="text-brand-green" size={22} /> */}
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
             <button
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
          onClick={() => dispatch(SetToggle(!Open ))}
          aria-label="Close navigation"
        >
          ✕
        </button>
      </div>

<div className={`${Open?'hidden':'block'} transition-all ease-in-out flex items-center gap-3 px-6 py-6`}>
    <img src={Logo} width={100} height={100} className='rounded-full'/>
</div>

      {/* Nav */}
      <nav className={`flex-col w-full ${Open?'justify-center':'justify-center'} flex-1 overflow-y-auto px-3 pb-4`}>
        <ul className={` space-y-1`}>
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <NavLink
                to={item.path}
                end={item.path === '/' || item.path === '/loans'}
                  className={({ isActive }) => ` flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-green text-green-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`${!Open?'w-full':null}`} size={`${Open?17:20}`} />
                  <span className={`${!Open?'hidden':'block'} transition-all ease-in-out`}>{item.label}</span>
                  {item.path === '/notifications' && upcomingLoanAlerts > 0 && (
                    <span className="ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white" aria-label={`${upcomingLoanAlerts} loan payment reminders`}>
                      {upcomingLoanAlerts}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
