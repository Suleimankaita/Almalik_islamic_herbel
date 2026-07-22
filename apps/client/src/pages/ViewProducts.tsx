import React, { useState } from 'react';
import { 
  Eye, Edit3, ArrowRightLeft, History, Check, X, 
  Barcode, QrCode, AlertTriangle, Package, MapPin, 
  DollarSign, ShieldCheck, Save, ArrowDownLeft, ArrowUpRight, Clock
} from 'lucide-react';

// Sample initial product data
const initialProduct = {
  id: "1005",
  name: "Premium Black Seed Oil",
  arabicName: "زيت الحبة السوداء الممتاز",
  scientificName: "Nigella sativa",
  sku: "BS-OIL-500",
  barcode: "628123456789",
  category: "Black Seed",
  brand: "Al Malik Bio",
  supplier: "Green Heritage Farms",
  batch: "BS-2024-11",
  mfgDate: "2024-05-10",
  expiryDate: "2025-10-15",
  country: "Saudi Arabia",
  shelf: "A3",
  rack: "2",
  unit: "Bottle",
  weight: "500g",
  purchasePrice: 15.50,
  sellingPrice: 24.99,
  wholesalePrice: 21.00,
  stockQuantity: 250,
  minStock: 50,
  maxStock: 500,
  tax: 5,
  discount: 0,
  halal: true,
  organic: true,
  sunnah: true,
  prescriptionRequired: false,
  status: "Available",
  description: "Premium cold-pressed black seed oil sourced from organic farms. Rich in thymoquinone and essential fatty acids to support overall body health and immunity."
};

// Sample stock movement history
const stockHistoryLogs = [
  { id: "LOG-902", type: "Purchase", qty: "+150", stockAfter: 250, date: "2026-07-10 10:30 AM", user: "Admin Ali", ref: "PO-4091", note: "Supplier delivery received & verified" },
  { id: "LOG-884", type: "Sale", qty: "-10", stockAfter: 100, date: "2026-07-08 04:15 PM", user: "POS Terminal 1", ref: "INV-8821", note: "Customer store purchase" },
  { id: "LOG-820", type: "Transfer", qty: "-25", stockAfter: 110, date: "2026-06-30 02:00 PM", user: "Staff Tariq", ref: "TR-0042", note: "Moved from Shelf A3 to POS Front Shelf" },
  { id: "LOG-750", type: "Adjustment", qty: "-2", stockAfter: 135, date: "2026-06-15 11:00 AM", user: "Manager Sani", ref: "ADJ-102", note: "Damaged bottle during shelf restocking" },
];

export default function ProductManagementView() {
  const [activeTab, setActiveTab] = useState('view'); // 'view' | 'edit' | 'transfer' | 'history'
  const [product, setProduct] = useState(initialProduct);

  // Transfer form state
  const [transferData, setTransferData] = useState({
    fromLocation: "Shelf A3 (Main Store)",
    toLocation: "Shelf B1 (Front Display)",
    quantity: 10,
    reason: "Stock Rebalance",
    notes: ""
  });

  return (
    <div className="min-h-screen bg-white text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ========================================================= */}
        {/* TOP BAR / NAVIGATION TABS                                  */}
        {/* ========================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {product.status}
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: #{product.id}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">{product.name}</h1>
            <p className="text-sm text-slate-500 dir-rtl font-medium">{product.arabicName}</p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('view')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'view' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-4 h-4 text-blue-600" /> View Product
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'edit' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-4 h-4 text-amber-600" /> Edit Details
            </button>
            <button
              onClick={() => setActiveTab('transfer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'transfer' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4 text-indigo-600" /> Transfer Stock
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'history' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-4 h-4 text-emerald-600" /> View History
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: VIEW PRODUCT PAGE                                  */}
        {/* ========================================================= */}
        {activeTab === 'view' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Image & Quick Stats */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <div className="w-40 h-48 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-7xl shadow-sm mb-4">
                  🌿
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{product.name}</h3>
                <p className="text-sm text-slate-500 font-mono mt-1">{product.sku}</p>

                {/* Barcode & QR Code Preview */}
                <div className="w-full mt-6 pt-6 border-t border-slate-200 flex justify-around items-center">
                  <div className="flex flex-col items-center">
                    <Barcode className="w-8 h-8 text-slate-700" />
                    <span className="text-[10px] text-slate-400 font-mono mt-1">{product.barcode}</span>
                  </div>
                  <div className="h-8 w-px bg-slate-200"></div>
                  <div className="flex flex-col items-center">
                    <QrCode className="w-7 h-7 text-slate-700" />
                    <span className="text-[10px] text-slate-400 mt-1">Scan QR</span>
                  </div>
                </div>
              </div>

              {/* Special Flags Badges */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Certifications & Attributes</h4>
                <div className="flex flex-wrap gap-2">
                  {product.halal && (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Halal Certified
                    </span>
                  )}
                  {product.organic && (
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                      🌱 100% Organic
                    </span>
                  )}
                  {product.sunnah && (
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                      ✨ Sunnah Medicine
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Full Attributes */}
            <div className="lg:col-span-8 space-y-6">
              {/* Financial & Stock KPI Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <p className="text-xs font-medium text-slate-500">Selling Price</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">${product.sellingPrice.toFixed(2)}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <p className="text-xs font-medium text-slate-500">Purchase Price</p>
                  <p className="text-2xl font-bold text-slate-700 mt-1">${product.purchasePrice.toFixed(2)}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <p className="text-xs font-medium text-slate-500">In Stock</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{product.stockQuantity} <span className="text-xs font-normal text-slate-500">Units</span></p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <p className="text-xs font-medium text-slate-500">Inventory Value</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">${(product.stockQuantity * product.purchasePrice).toFixed(2)}</p>
                </div>
              </div>

              {/* Data Grid */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Product Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div>
                    <span className="text-slate-400 block text-xs">Scientific Name</span>
                    <span className="font-semibold text-slate-800 italic">{product.scientificName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Category</span>
                    <span className="font-semibold text-slate-800">{product.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Supplier</span>
                    <span className="font-semibold text-slate-800">{product.supplier}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Brand</span>
                    <span className="font-semibold text-slate-800">{product.brand}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Storage Location</span>
                    <span className="font-semibold text-slate-800">Shelf {product.shelf}, Rack {product.rack}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Batch & Expiry</span>
                    <span className="font-semibold text-slate-800">{product.batch} (Exp: {product.expiryDate})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Weight & Unit</span>
                    <span className="font-semibold text-slate-800">{product.weight} / {product.unit}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Tax / Discount</span>
                    <span className="font-semibold text-slate-800">{product.tax}% Tax / {product.discount}% Disc</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <span className="text-slate-400 block text-xs mb-1">Description</span>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: EDIT DETAILS PAGE                                  */}
        {/* ========================================================= */}
        {activeTab === 'edit' && (
          <form onSubmit={(e) => { e.preventDefault(); setActiveTab('view'); }} className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Edit Product Attributes</h2>
                <p className="text-sm text-slate-500">Update pricing, localization, and stock parameters.</p>
              </div>
              <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>

            {/* General Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">General & Names</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Product Name</label>
                  <input type="text" value={product.name} onChange={(e) => setProduct({...product, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Arabic Name</label>
                  <input type="text" value={product.arabicName} dir="rtl" onChange={(e) => setProduct({...product, arabicName: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Scientific Name</label>
                  <input type="text" value={product.scientificName} onChange={(e) => setProduct({...product, scientificName: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>

            {/* Pricing & Stock Limits */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pricing & Stock Thresholds</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Purchase Price ($)</label>
                  <input type="number" step="0.01" value={product.purchasePrice} onChange={(e) => setProduct({...product, purchasePrice: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Selling Price ($)</label>
                  <input type="number" step="0.01" value={product.sellingPrice} onChange={(e) => setProduct({...product, sellingPrice: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Min Alert Stock</label>
                  <input type="number" value={product.minStock} onChange={(e) => setProduct({...product, minStock: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Max Cap Stock</label>
                  <input type="number" value={product.maxStock} onChange={(e) => setProduct({...product, maxStock: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>

            {/* Attributes & Checkboxes */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Special Certifications</h3>
              <div className="flex flex-wrap gap-6 text-sm font-medium">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={product.halal} onChange={(e) => setProduct({...product, halal: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
                  Halal Certified
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={product.organic} onChange={(e) => setProduct({...product, organic: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
                  100% Organic
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={product.sunnah} onChange={(e) => setProduct({...product, sunnah: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
                  Sunnah Medicine
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button type="button" onClick={() => setActiveTab('view')} className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
              <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save Changes</button>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* TAB 3: TRANSFER STOCK PAGE                                */}
        {/* ========================================================= */}
        {activeTab === 'transfer' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 max-w-3xl mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Transfer Stock Location</h2>
              <p className="text-sm text-slate-500">Move inventory between shelves, racks, or retail branches.</p>
            </div>

            {/* Source & Destination */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">From Source Location</label>
                <div className="flex items-center gap-2 font-medium text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 text-sm">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>Shelf A3 (Current Stock: {product.stockQuantity})</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">To Destination Location</label>
                <select 
                  value={transferData.toLocation}
                  onChange={(e) => setTransferData({...transferData, toLocation: e.target.value})}
                  className="w-full bg-white p-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option>Shelf B1 (Front POS Display)</option>
                  <option>Warehouse Section C (Bulk Storage)</option>
                  <option>Branch 2 - City Center Store</option>
                </select>
              </div>
            </div>

            {/* Quantity and Reason */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Transfer Quantity</label>
                <input 
                  type="number" 
                  max={product.stockQuantity} 
                  min="1"
                  value={transferData.quantity}
                  onChange={(e) => setTransferData({...transferData, quantity: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Reason for Transfer</label>
                <select 
                  value={transferData.reason}
                  onChange={(e) => setTransferData({...transferData, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option>Stock Rebalance</option>
                  <option>Display Replenishment</option>
                  <option>Inter-branch Request</option>
                  <option>Quarantine / Inspection</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Notes / Instructions</label>
              <textarea 
                // rows="3" 
                placeholder="Optional transfer remarks..." 
                value={transferData.notes}
                onChange={(e) => setTransferData({...transferData, notes: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button onClick={() => setActiveTab('view')} className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
              <button onClick={() => { alert('Transfer complete!'); setActiveTab('history'); }} className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4" /> Complete Transfer
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: VIEW HISTORY PAGE                                  */}
        {/* ========================================================= */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Stock Audit Log & History</h2>
                <p className="text-sm text-slate-500">Every inventory movement recorded for #{product.id} ({product.name}).</p>
              </div>
              <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" /> Filter Logs
              </button>
            </div>

            {/* History Log Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3.5">Log Ref</th>
                      <th className="px-5 py-3.5">Action Type</th>
                      <th className="px-5 py-3.5">Quantity Change</th>
                      <th className="px-5 py-3.5">Stock After</th>
                      <th className="px-5 py-3.5">Timestamp</th>
                      <th className="px-5 py-3.5">Performed By</th>
                      <th className="px-5 py-3.5">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stockHistoryLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-4 font-mono text-xs font-semibold text-slate-900">{log.id}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                            log.type === 'Purchase' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            log.type === 'Sale' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            log.type === 'Transfer' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {log.type === 'Purchase' && <ArrowDownLeft className="w-3.5 h-3.5" />}
                            {log.type === 'Sale' && <ArrowUpRight className="w-3.5 h-3.5" />}
                            {log.type}
                          </span>
                        </td>
                        <td className={`px-5 py-4 font-bold text-sm ${log.qty.startsWith('+') ? 'text-emerald-600' : 'text-slate-800'}`}>
                          {log.qty}
                        </td>
                        <td className="px-5 py-4 font-medium text-slate-900">{log.stockAfter} units</td>
                        <td className="px-5 py-4 text-xs text-slate-500">{log.date}</td>
                        <td className="px-5 py-4 text-xs font-medium text-slate-700">{log.user}</td>
                        <td className="px-5 py-4 text-xs text-slate-500 max-w-xs truncate">{log.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}