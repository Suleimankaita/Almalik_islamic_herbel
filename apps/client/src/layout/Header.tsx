import { Menu, Search, Plus, ShoppingBag, PackagePlus, Bell, Mail, Moon, ChevronDown } from 'lucide-react';

interface SideBars{
  Open:boolean,
  SetOpen: React.Dispatch<React.SetStateAction<boolean>>
} 

export default function Header({Open,SetOpen}:SideBars): React.JSX.Element {
  return (
    <header className="w-full top-0 z-10 flex items-center gap-4 border-b border-gray-200 bg-white px-6 py-3.5">
      <button className="text-gray-500 hover:text-gray-700 lg:hidden">
        <Menu onClick={()=>SetOpen(prev=>!prev)} size={20} />
      </button>
      <button className="hidden text-gray-400 hover:text-gray-600 lg:block">
        <Menu onClick={()=>SetOpen(prev=>!prev)} size={20} />
      </button>

      {/* Search */}
      <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 max-w-md">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search products, invoices, customers..."
          className="flex-1 bg-transparent text-[13px] text-gray-600 outline-none placeholder:text-gray-400"
        />
        <kbd className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] text-gray-400">
          Ctrl + K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        <button className="flex items-center gap-1.5 rounded-lg border border-brand-green px-3 py-2 text-[13px] font-semibold text-brand-green hover:bg-brand-greenLight">
          <Plus size={15} />
          New Sale
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border border-blue-500 px-3 py-2 text-[13px] font-semibold text-blue-600 hover:bg-blue-50">
          <ShoppingBag size={15} />
          Purchase
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border border-amber-500 px-3 py-2 text-[13px] font-semibold text-amber-600 hover:bg-amber-50">
          <PackagePlus size={15} />
          Product
        </button>

        <div className="mx-1 h-6 w-px bg-gray-200" />

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

        <div className="mx-1 h-6 w-px bg-gray-200" />

        <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50">
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
