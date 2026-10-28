import { useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useSelector } from 'react-redux';
import { GetToken } from '../Features/AppSlice';
import { useGetAllProductsQuery, useCreateSaleMutation } from '../Features/api/DataSlice';
import {
  Search, User, Plus, Minus, Trash2, CreditCard, Banknote,
  Smartphone, ShoppingCart, Box, X, ChevronRight, RefreshCw
} from 'lucide-react';
import { formatCurrency, printSalesReceipt, type PrintableSaleItem } from '../utils/printSalesReceipt';

// --- Types ---
type Product = {
  id: string;
  name: string;
  variant: string;
  price: number;
  stock: number;
  image: string;
  category: string;
  badge?: { text: string; color: string; bgColor: string };
};

interface ApiProduct {
  _id?: string;
  id?: string;
  ProductName?: string;
  Barcode?: string | number;
  SKU?: string | number;
  SalePrice?: number;
  ActualPrice?: number;
  Quantity?: number;
  img?: string;
  Category?: string;
}

type CartItem = Product & {
  quantity: number;
  discount: number;
};

const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash', icon: Banknote },
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'pos', label: 'POS', icon: Smartphone },
];

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const token = useSelector(GetToken);

  const { data, isLoading, isError, refetch } = useGetAllProductsQuery({ token });
  const [createSaleApi, { isLoading: isCreating }] = useCreateSaleMutation();

  // --- Actions ---
  const handleAddToCart = (product: Product) => {
    if (isCreating) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity + 1 > product.stock) {
          Swal.fire({ icon: 'warning', title: 'Stock limit', text: 'Cannot add more than available stock.' });
          return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      if (product.stock <= 0) {
        Swal.fire({ icon: 'info', title: 'Out of stock', text: 'This product is currently out of stock.' });
        return prev;
      }
      return [...prev, { ...product, quantity: 1, discount: 0 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    if (isCreating) return;
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        if (newQty > item.stock) {
          Swal.fire({ icon: 'warning', title: 'Stock limit', text: `Only ${item.stock} unit(s) are available.` });
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    if (isCreating) return;
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = async () => {
    if (isCreating) return;
    const res = await Swal.fire({ title: 'Clear cart?', text: 'Remove all items from the cart.', showCancelButton: true, confirmButtonText: 'Clear', icon: 'question' });
    if (res.isConfirmed) setCart([]);
  };

  // --- Computed / Derived State ---
  const productsList = useMemo(() => {
    const raw: ApiProduct[] = Array.isArray(data?.products) ? data.products : [];
    return raw.map((p): Product => ({
      id: p._id || String(p.id || ''),
      name: p.ProductName || 'Product',
      variant: p.SKU ? String(p.SKU) : p.Barcode ? String(p.Barcode) : '—',
      price: Number(p.SalePrice ?? p.ActualPrice ?? 0),
      stock: Number(p.Quantity ?? 0),
      image: p.img ? `${import.meta.env.VITE_URI}/img/${p.img}` : 'https://placehold.co/150x150/f8fafc/333333?text=No+Img',
      category: p.Category?.trim() || 'Uncategorized',
      badge: undefined,
    }));
  }, [data]);

  const categories = useMemo(
    () => ['All Products', ...new Set(productsList.map((product) => product.category))],
    [productsList],
  );

  const filteredProducts = useMemo(() => {
    return productsList.filter(p => {
      const matchesCategory = activeCategory === 'All Products' || p.category === activeCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(query) || p.variant.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [productsList, activeCategory, searchQuery]);

  const subTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalDiscount = cart.reduce((acc, item) => acc + item.discount, 0);
  const total = subTotal - totalDiscount;

  const handlePay = async () => {
    if (cart.length === 0 || isCreating) return;

    const confirm = await Swal.fire({ title: 'Complete sale?', html: `Total: <strong>${formatCurrency(total)}</strong>`, showCancelButton: true, confirmButtonText: 'Pay', icon: 'question' });
    if (!confirm.isConfirmed) return;

    try {
      const body = {
        items: cart.map(i => ({ id: i.id, quantity: i.quantity })),
        paymentMethod,
      };
      await createSaleApi(body).unwrap();
      setCart([]);
      void refetch();
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Sale recorded. You can start the next sale.',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    } catch (err: unknown) {
      const error = err as { data?: { message?: string }; message?: string };
      const msg = error.data?.message || error.message || 'Could not complete sale.';
      Swal.fire({ icon: 'error', title: 'Sale failed', text: msg });
    }
  };

  const printReceipt = (items: PrintableSaleItem[]) => {
    const activeMethod = PAYMENT_METHODS.find((method) => method.id === paymentMethod);
    if (!printSalesReceipt(items, { paymentMethod: activeMethod?.label })) {
      Swal.fire({ icon: 'error', title: 'Print blocked', text: 'Please allow pop-ups to print receipts.' });
    }
  };

  return (
    <div className="flex min-h-full flex-col bg-gray-100 font-sans text-gray-800 selection:bg-green-100 lg:h-full lg:flex-row lg:overflow-hidden">
      
      {/* ================= LEFT PANEL (Products & Search) ================= */}
      <div className="flex min-h-[65vh] flex-1 flex-col bg-gray-50/50 lg:h-full lg:min-h-0 lg:overflow-hidden">
        
        {/* Top Action Bar */}
        <div className="flex-none p-4 lg:p-6 pb-2 lg:pb-4 border-b border-gray-200 bg-white shadow-sm z-10">
          <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
            
            {/* Categories Navigation */}
            <div className="flex items-center gap-2 overflow-x-auto w-full xl:w-auto scrollbar-hide pb-2 xl:pb-0">
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
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
            <div className="group relative w-full shrink-0 xl:w-80">
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
        <div className="min-h-[45vh] flex-1 overflow-y-auto p-4 lg:min-h-0 lg:p-6 custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-5 pb-20 lg:pb-0">
            {isLoading ? (
              <div role="status" className="col-span-full flex min-h-64 flex-col items-center justify-center gap-3 text-sm font-semibold text-gray-500">
                <RefreshCw size={22} className="animate-spin text-green-700" />
                Loading products...
              </div>
            ) : isError ? (
              <div role="alert" className="col-span-full flex min-h-64 flex-col items-center justify-center gap-3 text-center">
                <p className="font-bold text-gray-800">Products could not be loaded</p>
                <p className="text-sm text-gray-500">Check your connection and try again.</p>
                <button type="button" onClick={() => void refetch()} className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800">
                  <RefreshCw size={15} /> Try again
                </button>
              </div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  onClick={() => !isCreating && product.stock > 0 && handleAddToCart(product)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      if (!isCreating && product.stock > 0) handleAddToCart(product);
                    }
                  }}
                  role="button"
                  tabIndex={product.stock > 0 && !isCreating ? 0 : -1}
                  aria-disabled={product.stock <= 0 || isCreating}
                  className={`relative group flex flex-col rounded-2xl border bg-white p-3 transition-all duration-300 ${product.stock > 0 && !isCreating ? 'cursor-pointer border-gray-200 hover:border-green-300 hover:shadow-xl hover:shadow-gray-200/50 active:scale-[0.98]' : 'cursor-not-allowed border-gray-100 opacity-60'}`}
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
                    <p className="mb-2 text-xs font-medium text-gray-400">{product.variant}</p>
                    <p className={`mb-3 text-[11px] font-semibold ${product.stock > 0 ? 'text-gray-500' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-base font-black text-green-700">{formatCurrency(product.price)}</p>
                      <span aria-hidden="true" className="w-8 h-8 bg-gray-100 group-hover:bg-green-700 text-gray-500 group-hover:text-white rounded-lg flex items-center justify-center transition-colors shadow-sm">
                        <Plus size={18} />
                      </span>
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
      <aside className="z-20 flex h-[70vh] w-full flex-none flex-col rounded-t-3xl border-t border-gray-200 bg-white shadow-2xl transition-transform duration-300 lg:relative lg:h-full lg:w-85 lg:rounded-none lg:border-l lg:border-t-0 lg:shadow-none">
        
        {/* Header / Customer */}
        <div className="flex-none p-5 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <ShoppingCart className="text-green-700" size={22} /> Current Order
            </h2>
            {cart.length > 0 && (
              <button onClick={clearCart} disabled={isCreating} className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-50">
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
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 p-1">
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
                        <button type="button" aria-label={`Remove one ${item.name}`} onClick={() => updateQuantity(item.id, -1)} disabled={isCreating} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-white hover:text-red-500 hover:shadow-sm rounded transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"><Minus size={14} /></button>
                        <span className="w-6 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
                        <button type="button" aria-label={`Add one ${item.name}`} onClick={() => updateQuantity(item.id, 1)} disabled={item.quantity >= item.stock || isCreating} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-white hover:text-green-600 hover:shadow-sm rounded transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"><Plus size={14} /></button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button (Appears on hover) */}
                  <button 
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    disabled={isCreating}
                    aria-label={`Remove ${item.name} from order`}
                    className="absolute right-2 top-2 rounded-lg p-1.5 text-gray-300 opacity-100 transition-all hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40 md:opacity-0 md:group-hover:opacity-100"
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
            {/* <div className="flex justify-between text-sm text-gray-500 font-medium">
              <span>Tax (7.5%)</span>
              <span className="text-gray-800">{formatCurrency(tax)}</span>
            </div> */}
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
                    disabled={isCreating}
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

            {/* Print Receipt Button */}
            <button
              onClick={() => printReceipt(cart.map(i=>({ id:i.id, name:i.name, variant:i.variant, price:i.price, quantity:i.quantity })))}
              disabled={cart.length === 0 || isCreating}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${cart.length>0 && !isCreating? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              Print Receipt
            </button>

            {/* Complete Button */}
            <button 
              onClick={handlePay}
              disabled={cart.length === 0 || isCreating}
              className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all duration-300 
                ${cart.length > 0 
                  ? 'bg-green-700 hover:bg-green-800 text-white shadow-xl shadow-green-700/20 active:scale-[0.98]' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                } ${isCreating ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {isCreating ? 'Processing…' : `Pay ${formatCurrency(total)}`} <ChevronRight size={20} />
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
