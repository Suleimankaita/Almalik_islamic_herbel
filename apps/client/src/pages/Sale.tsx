import { useState, useMemo } from 'react';
import {
  Search, User, Plus, Minus, Trash2, CreditCard, Banknote,
  Smartphone, ShoppingCart, Box, X, ChevronRight
} from 'lucide-react';

// --- Types ---
type Category = 'All Products' | 'Herbs' | 'Oils' | 'Honey' | 'Supplements' | 'Powders' | 'Teas';

type Product = {
  id: string;
  name: string;
  variant: string;
  price: number;
  stock: number;
  image: string;
  category: Category;
  badge?: { text: string; color: string; bgColor: string };
};

type CartItem = Product & {
  quantity: number;
  discount: number;
};

// --- Mock Data ---
const PRODUCTS: Product[] = [
  { id: '1', name: 'Black Seed Oil', variant: '500ml', price: 4000, stock: 120, category: 'Oils', image: 'https://placehold.co/150x150/f8fafc/333333?text=Oil', badge: { text: 'Organic', color: 'text-green-700', bgColor: 'bg-green-50' } },
  { id: '2', name: 'Honey', variant: '500g', price: 3500, stock: 85, category: 'Honey', image: 'https://placehold.co/150x150/f8fafc/333333?text=Honey' },
  { id: '3', name: 'Olive Oil', variant: '250ml', price: 3000, stock: 65, category: 'Oils', image: 'https://placehold.co/150x150/f8fafc/333333?text=Olive', badge: { text: 'Sunnah', color: 'text-green-700', bgColor: 'bg-green-50' } },
  { id: '4', name: 'Nigella Sativa Powder', variant: '100g', price: 2000, stock: 45, category: 'Powders', image: 'https://placehold.co/150x150/f8fafc/333333?text=Powder' },
  { id: '5', name: 'Zamzam Water', variant: '1L', price: 1200, stock: 200, category: 'Supplements', image: 'https://placehold.co/150x150/f8fafc/333333?text=Water' },
  { id: '6', name: 'Ajwa Dates', variant: '500g', price: 2500, stock: 60, category: 'Supplements', image: 'https://placehold.co/150x150/f8fafc/333333?text=Dates' },
  { id: '7', name: 'Sidr Honey', variant: '500g', price: 4500, stock: 30, category: 'Honey', image: 'https://placehold.co/150x150/f8fafc/333333?text=Sidr' },
  { id: '8', name: 'Herbal Tea', variant: '100g', price: 1800, stock: 75, category: 'Teas', image: 'https://placehold.co/150x150/f8fafc/333333?text=Tea' },
  { id: '9', name: 'Habbatus Sauda Capsule', variant: '60', price: 2200, stock: 40, category: 'Supplements', image: 'https://placehold.co/150x150/f8fafc/333333?text=Capsule' },
  { id: '10', name: 'Olive Leaf Extract', variant: '60ml', price: 2800, stock: 50, category: 'Herbs', image: 'https://placehold.co/150x150/f8fafc/333333?text=Extract' },
];

const CATEGORIES: Category[] = ['All Products', 'Herbs', 'Oils', 'Honey', 'Supplements', 'Powders', 'Teas'];
const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash', icon: Banknote },
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'pos', label: 'POS', icon: Smartphone },
];

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // --- Actions ---
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, discount: 0 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear the cart?")) {
      setCart([]);
    }
  };

  // --- Computed / Derived State ---
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesCategory = activeCategory === 'All Products' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.variant.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const subTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subTotal * 0.075; // 7.5% VAT
  const totalDiscount = cart.reduce((acc, item) => acc + item.discount, 0);
  const total = subTotal + tax - totalDiscount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount).replace('NGN', '₦');
  };

  return (
    <div className=" flex flex-col lg:flex-row h-screen bg-gray-100 text-gray-800 font-sans selection:bg-green-100 overflow-hidden">
      
      {/* ================= LEFT PANEL (Products & Search) ================= */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50/50">
        
        {/* Top Action Bar */}
        <div className="flex-none p-4 lg:p-6 pb-2 lg:pb-4 border-b border-gray-200 bg-white shadow-sm z-10">
          <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
            
            {/* Categories Navigation */}
            <div className="flex items-center gap-2 overflow-x-auto w-full xl:w-auto scrollbar-hide pb-2 xl:pb-0">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                    activeCategory === cat 
                      ? 'bg-green-700 text-white shadow-md shadow-green-700/20' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'All Products' && <Box size={16} className={activeCategory === cat ? 'text-white' : 'text-gray-400'} />}
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full xl:w-80 flex-shrink-0 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, SKU..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all"
              />
              {searchQuery && (
                <X size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-700" onClick={() => setSearchQuery('')} />
              )}
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-5 pb-20 lg:pb-0">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  onClick={() => handleAddToCart(product)}
                  className="bg-white rounded-2xl border border-gray-200 p-3 hover:shadow-xl hover:shadow-gray-200/50 hover:border-green-300 transition-all duration-300 relative flex flex-col cursor-pointer group active:scale-[0.98]"
                >
                  {/* Badge */}
                  {product.badge && (
                    <span className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide z-10 ${product.badge.bgColor} ${product.badge.color}`}>
                      {product.badge.text}
                    </span>
                  )}
                  {/* Image */}
                  <div className="h-36 w-full flex items-center justify-center mb-3 bg-gray-50/50 rounded-xl group-hover:bg-green-50/30 transition-colors duration-300 p-2">
                    <img src={product.image} alt={product.name} className="h-full w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-end px-1">
                    <h3 className="text-sm font-bold text-gray-800 leading-tight mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-xs text-gray-400 font-medium mb-3">{product.variant}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-base font-black text-green-700">{formatCurrency(product.price)}</p>
                      <button className="w-8 h-8 bg-gray-100 group-hover:bg-green-700 text-gray-500 group-hover:text-white rounded-lg flex items-center justify-center transition-colors shadow-sm">
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center h-64 text-gray-400">
                 <Box size={48} className="mb-4 opacity-30" />
                 <p className="text-lg font-bold text-gray-600">No products found</p>
                 <p className="text-sm">Try searching for something else.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= RIGHT PANEL (Always Visible Cart & Checkout) ================= */}
      <aside className="w-full lg:w-[320px] bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col shadow-2xl lg:shadow-none z-20 flex-none h-[85vh] lg:h-full rounded-t-3xl lg:rounded-none fixed lg:relative bottom-0 transition-transform duration-300">
        
        {/* Header / Customer */}
        <div className="flex-none p-5 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <ShoppingCart className="text-green-700" size={22} /> Current Order
            </h2>
            {cart.length > 0 && (
              <button onClick={clearCart} className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
                <Trash2 size={14} /> Clear
              </button>
            )}
          </div>
          
          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3 bg-gray-50 cursor-pointer hover:border-green-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 shadow-sm">
                <User size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Walk-in Customer</p>
                <p className="text-[11px] font-medium text-gray-500">Guest</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </div>

        {/* Scrollable Cart Items */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-2 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-70">
              <ShoppingCart size={56} className="mb-4 stroke-1 text-gray-300" />
              <p className="text-base font-bold text-gray-600">Your cart is empty</p>
              <p className="text-xs mt-1 text-center px-8">Add items from the product grid to get started.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {cart.map((item) => (
                <div key={item.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex gap-3 group relative overflow-hidden">
                  {/* Item Image */}
                  <div className="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0 border border-gray-100 p-1 flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  
                  {/* Item Info & Controls */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start pr-6">
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 leading-tight">{item.name}</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">{item.variant} • {formatCurrency(item.price)}</p>
                      </div>
                      <span className="font-black text-gray-800 text-sm">{formatCurrency(item.price * item.quantity)}</span>
                    </div>

                    <div className="flex justify-between items-end mt-2">
                      <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-0.5">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-white hover:text-red-500 hover:shadow-sm rounded transition-all active:scale-95"><Minus size={14} /></button>
                        <span className="w-6 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-white hover:text-green-600 hover:shadow-sm rounded transition-all active:scale-95"><Plus size={14} /></button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button (Appears on hover) */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="absolute right-2 top-2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary & Payment (Always at bottom of sidebar) */}
        <div className="flex-none bg-white border-t border-gray-100 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
          
          {/* Totals Box */}
          <div className="p-5 pb-4 space-y-2.5">
            <div className="flex justify-between text-sm text-gray-500 font-medium">
              <span>Subtotal ({cart.reduce((a,b)=>a+b.quantity, 0)} items)</span>
              <span className="text-gray-800">{formatCurrency(subTotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 font-medium">
              <span>Tax (7.5%)</span>
              <span className="text-gray-800">{formatCurrency(tax)}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600 font-bold">
                <span>Discount</span>
                <span>-{formatCurrency(totalDiscount)}</span>
              </div>
            )}
            
            <div className="pt-3 mt-1 border-t border-dashed border-gray-200 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total</span>
              <span className="text-3xl font-black text-green-700">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Action Buttons & Payment */}
          <div className="px-5 pb-5 flex flex-col gap-3">
            {/* Payment Methods */}
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                const isActive = paymentMethod === method.id;
                return (
                  <button 
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border
                      ${isActive 
                        ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' 
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <Icon size={16} className={isActive ? 'text-green-600' : 'text-gray-400'} /> 
                    {method.label}
                  </button>
                )
              })}
            </div>

            {/* Complete Button */}
            <button 
              disabled={cart.length === 0}
              className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all duration-300 
                ${cart.length > 0 
                  ? 'bg-green-700 hover:bg-green-800 text-white shadow-xl shadow-green-700/20 active:scale-[0.98]' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              Pay {formatCurrency(total)} <ChevronRight size={20} />
            </button>
          </div>
        </div>

      </aside>

      {/* Global styles for hiding scrollbar to keep UI clean */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #9ca3af; }
      `}} />
    </div>
  );
}