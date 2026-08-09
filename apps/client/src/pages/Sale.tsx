import { useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useSelector } from 'react-redux';
import { GetToken } from '../Features/AppSlice';
import { useGetAllProductsQuery, useCreateSaleMutation } from '../Features/api/DataSlice';
import {
  Search, User, Plus, Minus, Trash2, CreditCard, Banknote,
  Smartphone, ShoppingCart, Box, X, ChevronRight
} from 'lucide-react';
import Logo from "../assets/Logo.png"

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

// --- Store / receipt config — edit these to match the real business ---
const STORE = {
  name: 'Al Malik Islamic Medicine',
  tagline: 'Halal & Sunnah-based Wellness Store',
  address: 'Kaduna State Unguwar Dosa, Nigeria',
  phone: '+234 8145048160',
  email: 'ALmalik_Islamic_Medicine@gmail.com',
  // Swap for a real hosted logo URL (PNG/SVG) when one is available.
  logoUrl: Logo,
};

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const token = useSelector(GetToken);

  const { data, isLoading, isError, refetch } = useGetAllProductsQuery({ token });
  const [createSaleApi, { isLoading: isCreating }] = useCreateSaleMutation();

  // --- Actions ---
  const handleAddToCart = (product: Product) => {
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

  const clearCart = async () => {
    const res = await Swal.fire({ title: 'Clear cart?', text: 'Remove all items from the cart.', showCancelButton: true, confirmButtonText: 'Clear', icon: 'question' });
    if (res.isConfirmed) setCart([]);
  };

  // --- Computed / Derived State ---
  const productsList = useMemo(() => {
    const raw = Array.isArray(data?.products) ? data.products : [];
    return raw.map((p: any) => ({
      id: p._id || String(p.id || ''),
      name: p.ProductName || 'Product',
      variant: p.Barcode ? String(p.Barcode) : '—',
      price: Number(p.SalePrice ?? p.ActualPrice ?? 0),
      stock: Number(p.Quantity ?? 0),
      image: p.img ? `${import.meta.env.VITE_URI}/img/${p.img}` : 'https://placehold.co/150x150/f8fafc/333333?text=No+Img',
      category: (p.Category || 'All Products') as Category,
      badge: undefined,
    })) as Product[];
  }, [data]);

  const filteredProducts = useMemo(() => {
    const source = productsList.length ? productsList : PRODUCTS;
    return source.filter(p => {
      const matchesCategory = activeCategory === 'All Products' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.variant.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [productsList, activeCategory, searchQuery]);

  const subTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subTotal * 0.075; // 7.5% VAT
  const totalDiscount = cart.reduce((acc, item) => acc + item.discount, 0);
  const total = subTotal ;

  const handlePay = async () => {
    if (cart.length === 0) return;

    const confirm = await Swal.fire({ title: 'Complete sale?', html: `Total: <strong>${formatCurrency(total)}</strong>`, showCancelButton: true, confirmButtonText: 'Pay', icon: 'question' });
    if (!confirm.isConfirmed) return;

    try {
      Swal.fire({ title: 'Processing...', allowOutsideClick: false, didOpen: () => Swal.showLoading(), showConfirmButton: false });

      const saleCart = cart.map(i => ({ id: i.id, name: i.name, variant: i.variant, price: i.price, quantity: i.quantity }));
      const body = { items: cart.map(i => ({ id: i.id, quantity: i.quantity, Quantity: i.quantity })) };
      await createSaleApi(body).unwrap();
      Swal.close();
      const printed = await Swal.fire({ title: 'Sale recorded', text: 'Would you like to print a receipt?', icon: 'success', showCancelButton: true, confirmButtonText: 'Print', cancelButtonText: 'Done' });

      if (printed.isConfirmed) {
        printReceipt(saleCart);
      }

      setCart([]);
      refetch();
    } catch (err: any) {
      Swal.close();
      const msg = err?.data?.message || err?.message || 'Could not complete sale.';
      Swal.fire({ icon: 'error', title: 'Sale failed', text: msg });
    }
  };

  const generateReceiptNo = () => {
    const now = new Date();
    const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `AM-${stamp}-${rand}`;
  };

  const escapeHtml = (value: string) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const printReceipt = (items: { id: string; name: string; variant: string; price: number; quantity: number }[]) => {
    if (!items || !items.length) return;

    const now = new Date();
    const receiptNo = generateReceiptNo();
    const activeMethod = PAYMENT_METHODS.find((m) => m.id === paymentMethod);

    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString()

    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const taxAmt = subtotal * 0.075;
    const totalAmt = subtotal + taxAmt;
    const totalUnits = items.reduce((s, it) => s + it.quantity, 0);

    const lines = items.map(i => `
      <tr>
        <td class="cell item-cell">
          <div class="item-name">${escapeHtml(i.name)}${i.variant ? ` <span class="muted">(${escapeHtml(i.variant)})</span>` : ''}</div>
          <div class="item-id">ID: ${escapeHtml(i.id).slice(-10)}</div>
        </td>
        <td class="cell" style="text-align:center">${i.quantity}</td>
        <td class="cell" style="text-align:right">${formatCurrency(i.price)}</td>
        <td class="cell" style="text-align:right">${formatCurrency(i.price * i.quantity)}</td>
      </tr>
    `).join('');

    const logoBlock = STORE.logoUrl
      ? `<img src="${STORE.logoUrl}" alt="${escapeHtml(STORE.name)}" class="logo-img" />`
      : `<div class="logo-mark">${escapeHtml(
          STORE.name
            .split(' ')
            .map((w) => w[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
        )}</div>`;

    const html = `
      <html>
        <head>
          <title>Receipt · ${receiptNo}</title>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <style>
            @page { size: 80mm auto; margin: 0; }
            * { box-sizing: border-box; }
            body {
              font-family: 'Courier New', Courier, monospace;
              color: #111;
              margin: 0;
              padding: 10px;
              background: #f4f4f5;
              display: flex;
              justify-content: center;
            }
            .receipt {
              width: 320px;
              background: #fff;
              padding: 20px 18px 24px;
              margin: 16px 0;
            }
            .store-header { text-align: center; margin-bottom: 10px; }
            .logo-img { max-width: 64px; max-height: 64px; margin: 0 auto 8px; display: block; object-fit: contain; }
            .logo-mark {
              width: 52px; height: 52px; border-radius: 50%;
              background: #15803d; color: #fff;
              display: flex; align-items: center; justify-content: center;
              margin: 0 auto 8px; font-weight: bold; font-size: 18px; letter-spacing: 0.5px;
            }
            .store-name { font-size: 16px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; margin: 0; }
            .store-tagline { font-size: 10.5px; color: #555; margin: 2px 0 0; }
            .store-meta { font-size: 10px; color: #666; margin-top: 6px; line-height: 1.5; }
            .divider { border: none; border-top: 1px dashed #999; margin: 12px 0; }
            .meta-row { display: flex; justify-content: space-between; font-size: 11px; margin: 3px 0; }
            .meta-row span:first-child { color: #666; }
            .meta-row span:last-child { font-weight: 600; }
            table { width: 100%; border-collapse: collapse; margin-top: 4px; font-size: 11px; }
            thead th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.4px; color: #666; padding: 4px 2px; border-bottom: 1px dashed #999; }
            .cell { padding: 7px 2px; border-bottom: 1px dashed #eee; vertical-align: top; }
            .item-name { font-weight: 600; }
            .item-id { font-size: 9px; color: #888; margin-top: 1px; }
            .muted { color: #888; font-weight: 400; }
            .totals { margin-top: 10px; font-size: 11.5px; }
            .totals-row { display: flex; justify-content: space-between; padding: 3px 0; }
            .totals-row.grand { border-top: 1px dashed #999; margin-top: 6px; padding-top: 8px; font-size: 15px; font-weight: 700; }
            .badge { display: inline-block; font-size: 9.5px; border: 1px solid #15803d; color: #15803d; padding: 2px 8px; border-radius: 999px; margin-top: 8px; }
            .footer { text-align: center; margin-top: 16px; }
            .footer p { margin: 3px 0; }
            .thanks { font-size: 12px; font-weight: 700; }
            .subtext { font-size: 9.5px; color: #777; }
            .barcode { margin: 10px auto 4px; letter-spacing: 3px; font-size: 13px; text-align: center; }
            @media print {
              body { background: #fff; }
              .receipt { margin: 0; width: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="store-header">
              ${logoBlock}
              <p class="store-name">${escapeHtml(STORE.name)}</p>
              <p class="store-tagline">${escapeHtml(STORE.tagline)}</p>
              <p class="store-meta">${escapeHtml(STORE.address)}<br/>${escapeHtml(STORE.phone)} · ${escapeHtml(STORE.email)}</p>
            </div>

            <hr class="divider" />

            <div class="meta-row"><span>Receipt No.</span><span>${receiptNo}</span></div>
            <div class="meta-row"><span>Date</span><span>${dateStr}</span></div>
            <div class="meta-row"><span>Time</span><span>${timeStr}</span></div>
            <div class="meta-row"><span>Payment</span><span>${activeMethod ? activeMethod.label : 'Cash'}</span></div>
            <div class="meta-row"><span>Cashier</span><span>POS Terminal 1</span></div>

            <hr class="divider" />

            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align:center">Qty</th>
                  <th style="text-align:right">Price</th>
                  <th style="text-align:right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${lines}
              </tbody>
            </table>

            <div class="totals">
              <div class="totals-row"><span>Items</span><span>${totalUnits}</span></div>
              <div class="totals-row"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
            <!-- 
    
            <div class="totals-row"><span>VAT (7.5%)</span><span>${formatCurrency(taxAmt)}</span></div>
            <div class="totals-row grand"><span>Total</span><span>${formatCurrency(totalAmt)}</span></div>
            -->
            </div>

            <div class="footer">
              <div class="barcode">*${receiptNo}*</div>
              <p class="thanks">Thank you for shopping with us!</p>
              <p class="subtext">Goods sold are non-refundable after 7 days.</p>
              <span class="badge">Halal Certified · Sunnah Medicine</span>
            </div>
          </div>
        </body>
      </html>
    `;

    const win = window.open('', '_blank', 'toolbar=0,location=0,menubar=0,width=400,height=700');
    if (!win) {
      Swal.fire({ icon: 'error', title: 'Print blocked', text: 'Please allow pop-ups to print receipts.' });
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();

    // Wait for content (and any logo image) to load before printing.
    const triggerPrint = () => {
      win.print();
      setTimeout(() => win.close(), 300);
    };
    const logoEl = win.document.querySelector('.logo-img') as HTMLImageElement | null;
    if (logoEl && !logoEl.complete) {
      logoEl.onload = triggerPrint;
      logoEl.onerror = triggerPrint;
      setTimeout(triggerPrint, 1500); // fallback if the image never fires
    } else {
      setTimeout(triggerPrint, 250);
    }
  };

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
              disabled={cart.length === 0}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${cart.length>0? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
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
