import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Eye,
  Edit3,
  ArrowRightLeft,
  History,
  Barcode as BarcodeIcon,
  QrCode,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  Save,
  ImageIcon,
  Loader2,
  PackageX,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { GetRoutes, GetToken } from '../Features/AppSlice';
import {
  useGetProductQuery,
  useGetTransactionsQuery,
  useUpdateProductMutation,
} from '../Features/api/DataSlice';
import { toast, ToastContainer } from 'react-toastify';

// ============================================================================
// Types — these mirror the Mongoose `AlmalikProduct` schema field-for-field.
// (Note: the backend field is spelled "Categpry", not "Category" — kept as-is
// so requests/responses line up with the API without a mapping layer.)
// ============================================================================
interface Product {
  _id: string;
  ProductName: string;
  img: string;
  Category: string;
  Supplier: string;
  Barcode: number;
  SKU: string;
  ManufactureDate: string;
  ExpiryDate: string;
  Quantity: number;
  ActualPrice: number;
  SalePrice: number;
  Date: string;
  Time: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Transaction {
  _id: string;
  ProductName?: string;
  Quantity?: number;
  SalePrice?: number;
  ActualPrice?: number;
  Date?: string;
  createdAt?: string;
  User?: { name?: string } | string;
  type?: 'Purchase' | 'Sale' | 'Adjustment';
}

type TabKey = 'view' | 'edit' | 'transfer' | 'history';

const EMPTY_PRODUCT: Product = {
  _id: '',
  ProductName: '',
  img: '',
  Category: '',
  Supplier: '',
  Barcode: 0,
  SKU: '',
  ManufactureDate: '',
  ExpiryDate: '',
  Quantity: 0,
  ActualPrice: 0,
  SalePrice: 0,
  Date: '',
  Time: '',
};

const currency = (value: number | undefined | null) =>
  `$${(Number.isFinite(value) ? (value as number) : 0).toFixed(2)}`;

const userName = (u?: Transaction['User']) =>
  typeof u === 'string' ? u : u?.name ?? 'Unknown';

export default function ProductManagementView(): React.JSX.Element {
  const initialTab = useSelector(GetRoutes) as TabKey | undefined;
  const token = useSelector(GetToken) as string;
  const { id } = useParams<{ id: string }>();

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useGetProductQuery(
    { id, token },
    { pollingInterval: 1000, refetchOnFocus: true },
  );

  const {
    data: txData,
    isLoading: txLoading,
  } = useGetTransactionsQuery(
    { id, token },
    { pollingInterval: 1000, refetchOnFocus: true },
  );
  const [Update, { isLoading: isSaving }] = useUpdateProductMutation();

  const [activeTab, setActiveTab] = useState<TabKey>(initialTab || 'view');
  const [product, setProduct] = useState<Product>(EMPTY_PRODUCT);

  // ---- Edit form state (kept separate from `product` so unsaved edits
  // don't leak into the View tab, and so it can be submitted as FormData) ----
  const [form, setForm] = useState({
    ProductName: '',
    Category: '',
    Supplier: '',
    ActualPrice: '',
    SalePrice: '',
    Quantity: '',
  });
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string>('');

  // ---- Stock adjustment ("Transfer" tab) state ----
  const [adjustment, setAdjustment] = useState({
    direction: 'in' as 'in' | 'out',
    quantity: 1,
    reason: 'Stock Rebalance',
    notes: '',
  });
  const [isAdjusting, setIsAdjusting] = useState(false);

  useEffect(() => {
    if (data?.success && data?.product) {
      const p: Product = { ...EMPTY_PRODUCT, ...data.product };
      setProduct(p);
      setForm({
        ProductName: p.ProductName,
        Category: p.Category,
        Supplier: p.Supplier,
        ActualPrice: String(p.ActualPrice ?? 0),
        SalePrice: String(p.SalePrice ?? 0),
        Quantity: String(p.Quantity ?? 0),
      });
    }
  }, [data]);

  const imgSrc = imgPreview || (product.img ? `${import.meta.env.VITE_URI}/img/${product.img}` : '');

  const inventoryValue = useMemo(
    () => (product.Quantity || 0) * (product.ActualPrice || 0),
    [product.Quantity, product.ActualPrice],
  );

  const stockStatus: 'Low In Stock' | 'Out of Stock' | 'Active' = useMemo(() => {
    if (!product.Quantity) return 'Out of Stock';
    if (product.Quantity < 5) return 'Low In Stock';
    return 'Active';
  }, [product.Quantity]);

  const transactions: Transaction[] = txData?.transactions ?? [];

  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      const body = new FormData();
      if (imgFile) body.append('file', imgFile);
      body.append('ProductName', form.ProductName);
      body.append('Category', form.Category);
      body.append('Supplier', form.Supplier);
      body.append('ActualPrice', form.ActualPrice);
      body.append('SalePrice', form.SalePrice);
      body.append('Quantity', form.Quantity);

      const res: any = await Update({ product: body, token, id });
      if (res?.error) throw new Error(res.error?.data?.message || 'Update failed');

      toast.success('Product updated successfully');
      setActiveTab('view');
    } catch (err: any) {
      toast.error(err?.data?.message || err.message || 'Something went wrong');
    }
  };

  const handleAdjustStock = async () => {
    if (!id) return;
    const delta = adjustment.direction === 'in' ? adjustment.quantity : -adjustment.quantity;
    const newQuantity = (product.Quantity || 0) + delta;

    if (newQuantity < 0) {
      toast.error('Cannot remove more stock than is currently available');
      return;
    }

    try {
      setIsAdjusting(true);
      const body = new FormData();
      body.append('Quantity', String(newQuantity));

      const res: any = await Update({ product: body, token, id });
      if (res?.error) throw new Error(res.error?.data?.message || 'Adjustment failed');

      toast.success(`Stock ${adjustment.direction === 'in' ? 'added' : 'removed'} successfully`);
      setAdjustment({ direction: 'in', quantity: 1, reason: 'Stock Rebalance', notes: '' });
      setActiveTab('history');
    } catch (err: any) {
      toast.error(err?.data?.message || err.message || 'Something went wrong');
    } finally {
      setIsAdjusting(false);
    }
  };

  const tabs: { key: TabKey; label: string; icon: typeof Eye; color: string }[] = [
    { key: 'view', label: 'View Product', icon: Eye, color: 'text-blue-600' },
    { key: 'edit', label: 'Edit Details', icon: Edit3, color: 'text-amber-600' },
    { key: 'transfer', label: 'Adjust Stock', icon: ArrowRightLeft, color: 'text-indigo-600' },
    { key: 'history', label: 'View History', icon: History, color: 'text-emerald-600' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading product…
      </div>
    );
  }

  if (isError || (!isLoading && !product._id)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-500 gap-3 px-4 text-center">
        <PackageX className="w-10 h-10 text-slate-300" />
        <p className="font-medium text-slate-700">We couldn't find this product.</p>
        <p className="text-sm text-slate-400">It may have been removed, or the link is out of date.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 p-4 sm:p-6 md:p-8 font-sans">
      <ToastContainer />
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ===================== TOP BAR / TABS ===================== */}
        <div className="flex flex-col gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${
                  stockStatus === 'Out of Stock'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : stockStatus === 'Low In Stock'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {stockStatus}
              </span>
              {isFetching && <span className="text-xs text-slate-400">Refreshing…</span>}
              <span className="text-xs text-slate-400 font-mono">ID: #{product._id.slice(-8)}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 break-words">
              {product.ProductName || 'Untitled product'}
            </h1>
            <p className="text-sm text-slate-500">{product.Category}</p>
          </div>

          {/* Navigation Controls — scrolls horizontally on small screens */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar">
            {tabs.map(({ key, label, icon: Icon, color }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                  activeTab === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${color}`} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* ===================== TAB: VIEW ===================== */}
        {activeTab === 'view' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <div className="w-32 h-40 sm:w-40 sm:h-48 bg-white rounded-xl border border-slate-200 flex items-center justify-center shadow-sm mb-4 overflow-hidden">
                  {imgSrc ? (
                    <img src={imgSrc} alt={product.ProductName} className="w-full h-full " />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-slate-300" />
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-lg break-words">{product.ProductName}</h3>
                <p className="text-sm text-slate-500 font-mono mt-1">{product.SKU}</p>

                <div className="w-full mt-6 pt-6 border-t border-slate-200 flex justify-around items-center">
                  <div className="flex flex-col items-center">
                    <BarcodeIcon className="w-8 h-8 text-slate-700" />
                    <span className="text-[10px] text-slate-400 font-mono mt-1">{product.Barcode}</span>
                  </div>
                  <div className="h-8 w-px bg-slate-200" />
                  <div className="flex flex-col items-center">
                    <QrCode className="w-7 h-7 text-slate-700" />
                    <span className="text-[10px] text-slate-400 mt-1">Scan QR</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Al Malik Islamic Medicine</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Halal Certified
                  </span>
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                    ✨ Sunnah Medicine
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <p className="text-xs font-medium text-slate-500">Selling Price</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{currency(product.SalePrice)}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <p className="text-xs font-medium text-slate-500">Purchase Price</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-700 mt-1">{currency(product.ActualPrice)}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <p className="text-xs font-medium text-slate-500">In Stock</p>
                  <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">
                    {product.Quantity} <span className="text-xs font-normal text-slate-500">Units</span>
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <p className="text-xs font-medium text-slate-500">Inventory Value</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">{currency(inventoryValue)}</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-6">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Product Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div>
                    <span className="text-slate-400 block text-xs">Category</span>
                    <span className="font-semibold text-slate-800">{product.Category || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Supplier</span>
                    <span className="font-semibold text-slate-800">{product.Supplier || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">SKU</span>
                    <span className="font-semibold text-slate-800 font-mono">{product.SKU || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Barcode</span>
                    <span className="font-semibold text-slate-800 font-mono">{product.Barcode || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Manufacture Date</span>
                    <span className="font-semibold text-slate-800">{product.ManufactureDate || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Expiry Date</span>
                    <span className="font-semibold text-slate-800">{product.ExpiryDate || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Date Added</span>
                    <span className="font-semibold text-slate-800">{product.Date || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Time Added</span>
                    <span className="font-semibold text-slate-800">{product.Time || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: EDIT ===================== */}
        {activeTab === 'edit' && (
          <form
            onSubmit={handleEdit}
            className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 md:p-8 space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Edit Product Attributes</h2>
                <p className="text-sm text-slate-500">Update pricing, category, and stock.</p>
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>

            {/* Image */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product Image</h3>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                  {imgSrc ? (
                    <img src={imgSrc} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-300" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImgChange}
                  className="text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            {/* General Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">General</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={form.ProductName}
                    onChange={(e) => setForm({ ...form, ProductName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={form.Category}
                    onChange={(e) => setForm({ ...form, Category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Supplier</label>
                  <input
                    type="text"
                    value={form.Supplier}
                    onChange={(e) => setForm({ ...form, Supplier: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pricing & Stock</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Purchase Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.ActualPrice}
                    onChange={(e) => setForm({ ...form, ActualPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Selling Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.SalePrice}
                    onChange={(e) => setForm({ ...form, SalePrice: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={form.Quantity}
                    onChange={(e) => setForm({ ...form, Quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('view')}
                className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
              >
                {isSaving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* ===================== TAB: ADJUST STOCK ===================== */}
        {activeTab === 'transfer' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 md:p-8 max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Adjust Stock</h2>
              <p className="text-sm text-slate-500">Record stock coming in or going out for this product.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Current Quantity</span>
              <span className="text-lg font-bold text-slate-900">{product.Quantity} units</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAdjustment({ ...adjustment, direction: 'in' })}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  adjustment.direction === 'in'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4" /> Stock In
              </button>
              <button
                type="button"
                onClick={() => setAdjustment({ ...adjustment, direction: 'out' })}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  adjustment.direction === 'out'
                    ? 'bg-red-50 text-red-700 border-red-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" /> Stock Out
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={adjustment.direction === 'out' ? product.Quantity : undefined}
                  value={adjustment.quantity}
                  onChange={(e) =>
                    setAdjustment({ ...adjustment, quantity: Math.max(1, parseInt(e.target.value) || 1) })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Reason</label>
                <select
                  value={adjustment.reason}
                  onChange={(e) => setAdjustment({ ...adjustment, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option>Stock Rebalance</option>
                  <option>Supplier Delivery</option>
                  <option>Damaged / Expired</option>
                  <option>Customer Return</option>
                  <option>Inventory Correction</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
              <textarea
                rows={3}
                placeholder="Optional remarks…"
                value={adjustment.notes}
                onChange={(e) => setAdjustment({ ...adjustment, notes: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveTab('view')}
                className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjustStock}
                disabled={isAdjusting}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isAdjusting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRightLeft className="w-4 h-4" />}
                {isAdjusting ? 'Saving…' : 'Confirm Adjustment'}
              </button>
            </div>
          </div>
        )}

        {/* ===================== TAB: HISTORY ===================== */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Stock Audit Log & History</h2>
                <p className="text-sm text-slate-500">
                  Transactions recorded for {product.ProductName || 'this product'}.
                </p>
              </div>
              <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 self-start sm:self-auto">
                <Clock className="w-4 h-4 text-slate-400" /> Filter Logs
              </button>
            </div>

            {txLoading ? (
              <div className="flex items-center justify-center py-12 text-slate-400 text-sm gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading history…
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2 border border-dashed border-slate-200 rounded-xl">
                <History className="w-8 h-8 text-slate-300" />
                <p className="text-sm">No transactions recorded yet.</p>
              </div>
            ) : (
              <>
                {/* Table — desktop / tablet */}
                <div className="hidden sm:block bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="px-5 py-3.5">Log Ref</th>
                          <th className="px-5 py-3.5">Quantity</th>
                          <th className="px-5 py-3.5">Sale Price</th>
                          <th className="px-5 py-3.5">Cost Price</th>
                          <th className="px-5 py-3.5">Timestamp</th>
                          <th className="px-5 py-3.5">Performed By</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {transactions.map((tx) => (
                          <tr key={tx._id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-5 py-4 font-mono text-xs font-semibold text-slate-900">
                              #{tx._id.slice(-6)}
                            </td>
                            <td className="px-5 py-4 font-bold text-slate-800">{tx.Quantity ?? '—'}</td>
                            <td className="px-5 py-4 text-slate-700">{currency(tx.SalePrice)}</td>
                            <td className="px-5 py-4 text-slate-700">{currency(tx.ActualPrice)}</td>
                            <td className="px-5 py-4 text-xs text-slate-500">
                              {tx.Date || tx.createdAt || '—'}
                            </td>
                            <td className="px-5 py-4 text-xs font-medium text-slate-700">{userName(tx.User)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cards — mobile */}
                <div className="sm:hidden space-y-3">
                  {transactions.map((tx) => (
                    <div key={tx._id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold text-slate-900">#{tx._id.slice(-6)}</span>
                        <span className="text-xs text-slate-400">{tx.Date || tx.createdAt || '—'}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-slate-400">Qty</p>
                          <p className="font-bold text-slate-800">{tx.Quantity ?? '—'}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Sale</p>
                          <p className="font-semibold text-slate-700">{currency(tx.SalePrice)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Cost</p>
                          <p className="font-semibold text-slate-700">{currency(tx.ActualPrice)}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 pt-1 border-t border-slate-100">
                        By {userName(tx.User)}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
