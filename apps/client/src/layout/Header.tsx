import { Menu, Search, Plus, ShoppingBag, PackagePlus, Bell, Mail, Moon, ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { GetToggle, SetToggle } from '../Features/AppSlice';

export default function Header(): React.JSX.Element {
  const Open = useSelector(GetToggle);
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

      <div className="ml-auto flex flex-wrap items-center justify-end gap-2 sm:gap-2.5">
        <button className="flex items-center gap-1.5 rounded-lg border border-brand-green px-2.5 py-2 text-[12px] font-semibold text-brand-green hover:bg-brand-greenLight sm:px-3 sm:text-[13px]">
          <Plus size={15} />
          <span className="hidden sm:inline">New Sale</span>
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border border-blue-500 px-2.5 py-2 text-[12px] font-semibold text-blue-600 hover:bg-blue-50 sm:px-3 sm:text-[13px]">
          <ShoppingBag size={15} />
          <span className="hidden sm:inline">Purchase</span>
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border border-amber-500 px-2.5 py-2 text-[12px] font-semibold text-amber-600 hover:bg-amber-50 sm:px-3 sm:text-[13px]">
          <PackagePlus size={15} />
          <span className="hidden sm:inline">Product</span>
        </button>

        <div className="hidden h-6 w-px bg-gray-200 sm:block" />

        <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-50">
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            8
          </span>
        </button>
        <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-50">
          <Mail size={18} />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[9px] font-bold text-white">
            3
          </span>
        </button>
        <button className="rounded-full p-2 text-gray-500 hover:bg-gray-50">
          <Moon size={18} />
        </button>

        <div className="hidden h-6 w-px bg-gray-200 xl:block" />

        <button className="hidden items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50 lg:flex">
          Main Branch
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50">
          <img
            src="https://i.pravatar.cc/64?img=13"
            alt="Abdullahi"
            className="h-9 w-9 rounded-full object-cover"
          />
          <div className="hidden text-left xl:block">
            <p className="text-[13px] font-semibold leading-tight text-gray-900">Abdullahi</p>
            <p className="text-[11px] leading-tight text-gray-400">Administrator</p>
          </div>
          <ChevronDown size={14} className="hidden text-gray-400 xl:block" />
        </button>
      </div>
    </header>
  );
}
