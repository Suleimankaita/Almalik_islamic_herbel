import React, { useState } from 'react';
import { 
  Package, DollarSign, Barcode, Layers, UploadCloud, Save, 
  CheckCircle2, ArrowLeft, Tag, ShieldCheck, AlertTriangle, 
  Eye, Plus, Trash2, ChevronDown, Image as ImageIcon, Info
} from 'lucide-react';

export default function AddProduct() {
  const [productType, setProductType] = useState('physical');
  const [variants, setVariants] = useState([
    { id: '1', name: '500ml', sku: 'BSO-500', price: '4000', stock: '120' }
  ]);

  const addVariant = () => {
    setVariants([...variants, { id: Date.now().toString(), name: '', sku: '', price: '', stock: '' }]);
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 font-sans text-gray-800">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
        
        {/* ================= PAGE HEADER ================= */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">Add New Product</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Create a new item in your inventory catalog</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
              Save as Draft
            </button>
            <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-green-700 text-white text-sm font-bold hover:bg-green-800 transition-colors shadow-lg shadow-green-700/20 active:scale-95">
              Publish Product
            </button>
          </div>
        </div>

        {/* ================= INVENTORY KPIS ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-700 flex-none">
              <Package size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">Total Catalog</p>
              <p className="text-lg sm:text-xl font-black text-gray-900 mt-0.5">142 Items</p>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-none">
              <Tag size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">Categories</p>
              <p className="text-lg sm:text-xl font-black text-gray-900 mt-0.5">6 Active</p>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600 flex-none">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">Low Stock Alert</p>
              <p className="text-lg sm:text-xl font-black text-gray-900 mt-0.5">4 Items</p>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 flex-none">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">Verified Quality</p>
              <p className="text-lg sm:text-xl font-black text-gray-900 mt-0.5">100%</p>
            </div>
          </div>
        </div>

        {/* ================= MAIN FORM LAYOUT ================= */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* --- LEFT COLUMN (Detailed Inputs) --- */}
          <div className="flex-1 w-full space-y-6">
            
            {/* General Information */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-5">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Info size={18} className="text-green-700" /> General Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Product Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g. Pure Black Seed Oil" 
                    className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">SKU (Stock Keeping Unit)</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="e.g. BSO-500" 
                        className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-mono"
                      />
                      <Barcode size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Category <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-medium">
                        <option>Oils & Extracts</option>
                        <option>Natural Honey</option>
                        <option>Herbal Powders</option>
                        <option>Supplements & Teas</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Product Description</label>
                  <textarea 
                    rows={4} 
                    placeholder="Write a clear, comprehensive description of the product and its benefits..." 
                    className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 resize-none font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-5">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <DollarSign size={18} className="text-green-700" /> Pricing & Inventory
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Selling Price (₦) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    placeholder="4000" 
                    className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-bold text-green-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Compare-at Price (₦)</label>
                  <input 
                    type="number" 
                    placeholder="4500" 
                    className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 line-through text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Initial Stock Qty</label>
                  <input 
                    type="number" 
                    placeholder="100" 
                    className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Variants Management */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-5">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Layers size={18} className="text-green-700" /> Product Variants
                </h2>
                <button 
                  onClick={addVariant}
                  className="text-xs font-bold text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Plus size={14} /> Add Variant
                </button>
              </div>

              <div className="space-y-3">
                {variants.map((v, index) => (
                  <div key={v.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-200">
                    <div className="sm:col-span-3">
                      <label className="block sm:hidden text-[10px] font-bold text-gray-400 uppercase">Variant Name</label>
                      <input 
                        type="text" 
                        value={v.name} 
                        placeholder="Size / Volume (e.g. 500ml)" 
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block sm:hidden text-[10px] font-bold text-gray-400 uppercase">SKU</label>
                      <input 
                        type="text" 
                        value={v.sku} 
                        placeholder="SKU Code" 
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-green-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block sm:hidden text-[10px] font-bold text-gray-400 uppercase">Price</label>
                      <input 
                        type="text" 
                        value={v.price} 
                        placeholder="Price" 
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-green-700 focus:outline-none focus:border-green-500"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block sm:hidden text-[10px] font-bold text-gray-400 uppercase">Stock</label>
                      <input 
                        type="text" 
                        value={v.stock} 
                        placeholder="Stock" 
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                      />
                    </div>
                    <div className="sm:col-span-1 flex justify-end">
                      {variants.length > 1 && (
                        <button 
                          onClick={() => removeVariant(v.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Upload */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <ImageIcon size={18} className="text-green-700" /> Product Images
              </h2>
              <div className="border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center py-10 px-4 text-center cursor-pointer">
                <div className="w-12 h-12 bg-white shadow-sm border border-gray-200 rounded-full flex items-center justify-center text-gray-400 mb-3">
                  <UploadCloud size={22} />
                </div>
                <p className="text-sm font-bold text-gray-800">Drag & drop product images here</p>
                <p className="text-xs text-green-700 mt-1 mb-2 font-bold">or click to browse from device</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Supports PNG, JPG, WebP (Max 5MB)</p>
              </div>
            </div>

          </div>

          {/* --- RIGHT COLUMN (Sticky Sidebar Organization & Status) --- */}
          <div className="w-full lg:w-[380px] xl:w-[420px] flex-none space-y-6 lg:sticky lg:top-6">
            
            {/* Status Panel */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Product Status</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-green-200 bg-green-50/50 cursor-pointer">
                  <input type="radio" name="status" defaultChecked className="text-green-700 focus:ring-green-500" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Active</p>
                    <p className="text-xs text-gray-500">Product will be visible in POS and online store.</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer">
                  <input type="radio" name="status" className="text-green-700 focus:ring-green-500" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Draft</p>
                    <p className="text-xs text-gray-500">Product is hidden from all sales channels.</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Product Type Tags */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Product Organization</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Brand / Supplier</label>
                  <select className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500 font-medium">
                    <option>Al Barakah Herbal Center</option>
                    <option>Sunnah Organics Ltd.</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Tags</label>
                  <input 
                    type="text" 
                    placeholder="Organic, Sunnah, Best Seller..." 
                    className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Separate tags with commas</p>
                </div>
              </div>
            </div>

            {/* Action Summary Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Ready to Launch?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Ensure all required fields are filled correctly before publishing this product to your live database.
              </p>
              <button className="w-full py-3.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-green-700/20 active:scale-[0.98]">
                <CheckCircle2 size={18} /> Save & Publish Product
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}