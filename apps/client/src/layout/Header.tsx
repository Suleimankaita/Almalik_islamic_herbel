import { Menu, Search, Plus, ShoppingBag, PackagePlus, Bell, Mail, ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { GetToggle, GetToken, SetToggle } from '../Features/AppSlice';
import { GetUserDetails } from '../Features/AppSlice';
import { useGetLowStockProductsQuery, useGetUserSettingsQuery } from '../Features/api/DataSlice';
import { Link, useLocation } from 'react-router-dom';


interface UserInfo{
  Username:string,
  Role:string
}

const normalizePathname = (pathname: string): string => {
  try {
    return decodeURIComponent(pathname).toLowerCase();
  } catch {
    return pathname.toLowerCase();
  }
};

export default function Header(): React.JSX.Element {
  const location = useLocation();
  const currentPath = normalizePathname(location.pathname);
  const currentPage = currentPath === '/'
    ? 'Dashboard'
    : currentPath.startsWith('/inventory/view-products/')
      ? 'Inventory'
      : ({
          '/sales-pos': 'Sales (POS)',
          '/sales (pos)': 'Sales (POS)',
          '/inventory': 'Inventory',
          '/add product': 'Add Product',
          '/customers': 'Customers',
          '/suppliers': 'Suppliers',
          '/expenses': 'Expenses',
          '/reports': 'Reports',
          '/notifications': 'Notifications',
          '/users-and-roles': 'Users & Roles',
          '/settings': 'Settings',
          '/purchase': 'Purchase Orders',
          '/messages': 'Messages',
        } as Record<string, string>)[currentPath] || '';
  const Open = useSelector(GetToggle);
  const token=useSelector(GetToken)
  const { data: settingsData } = useGetUserSettingsQuery(token, {
    pollingInterval: 1000,
  });
  const { data: lowStockData } = useGetLowStockProductsQuery(
    undefined,
    { skip: !token, pollingInterval: 30000, refetchOnFocus: true },
  );
  const {Username,Role}:UserInfo=useSelector(GetUserDetails)
  const dispatch = useDispatch();

  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-gray-200 bg-white px-3 py-3 sm:px-4 lg:px-6">
      <button
        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
        onClick={() =>{
          dispatch(SetToggle(!Open))}}
        aria-label="Toggle navigation"
      >
        <Menu size={20} />
      </button>

      <button
        className="hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 lg:block"
        onClick={() => dispatch(SetToggle(!Open))}
        aria-label="Collapse sidebar"
      >
        <Menu size={20} />
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 sm:max-w-md">
        <Search size={16} className="shrink-0 text-gray-400" />
        <input
          type="text"
          placeholder="Search products, invoices, customers..."
          className="min-w-0 flex-1 bg-transparent text-[13px] text-gray-600 outline-none placeholder:text-gray-400"
        />
        <kbd className="hidden rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] text-gray-400 sm:block">
          Ctrl + K
        </kbd>
      </div>
      {currentPage && (
        <div aria-current="page" className="hidden rounded-lg bg-green-50 px-3 py-2 text-xs font-bold text-green-800 md:block">
          {currentPage}
        </div>
      )}

      <div className="ml-auto flex flex-wrap items-center justify-end gap-2 sm:gap-2.5">
        <Link to="/sales-pos" className="flex items-center gap-1.5 rounded-lg border border-brand-green px-2.5 py-2 text-[12px] font-semibold text-brand-green hover:bg-brand-greenLight sm:px-3 sm:text-[13px]">
          <Plus size={15} />
          <span className="hidden sm:inline">New Sale</span>
        </Link>
        <Link to="/purchase" className="flex items-center gap-1.5 rounded-lg border border-blue-500 px-2.5 py-2 text-[12px] font-semibold text-blue-600 hover:bg-blue-50 sm:px-3 sm:text-[13px]">
          <ShoppingBag size={15} />
          <span className="hidden sm:inline">Purchase</span>
        </Link>
        <Link to="/add product" className="flex items-center gap-1.5 rounded-lg border border-amber-500 px-2.5 py-2 text-[12px] font-semibold text-amber-600 hover:bg-amber-50 sm:px-3 sm:text-[13px]">
          <PackagePlus size={15} />
          <span className="hidden sm:inline">Product</span>
        </Link>

        <div className="hidden h-6 w-px bg-gray-200 sm:block" />

        <Link to="/notifications" aria-label="Open notifications" className="relative rounded-full p-2 text-gray-500 hover:bg-gray-50">
          <Bell size={18} />
          {Number(lowStockData?.count ?? 0) > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
              {Number(lowStockData.count) > 99 ? '99+' : lowStockData.count}
            </span>
          )}
        </Link>
        <Link to="/messages" aria-label="Open messages" className="relative rounded-full p-2 text-gray-500 hover:bg-gray-50">
          <Mail size={18} />
        </Link>

        <div className="hidden h-6 w-px bg-gray-200 xl:block" />

        <span className="hidden items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-[13px] font-medium text-gray-700 lg:flex">
          Main Branch
          <ChevronDown size={14} className="text-gray-400" />
        </span>

        <Link to="/settings" className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50">
          <img
            src={import.meta.env.VITE_URI + "/img/" + (settingsData?.user?.Img || "man.png")}
            alt={Username||"Username"}
            className="h-9 w-9 rounded-full object-cover"
          />
          <div className="hidden text-left xl:block">
            <p className="text-[13px] font-semibold leading-tight text-gray-900">{Username||"Username "}</p>
            <p className="text-[11px] leading-tight text-gray-400">{Role}</p>
          </div>
          <ChevronDown size={14} className="hidden text-gray-400 xl:block" />
        </Link>
      </div>
    </header>
  );
}
