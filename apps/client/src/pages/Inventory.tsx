import React, { useEffect, useMemo, useState } from 'react';
import { 
  Search, Filter, Eye, Edit, Copy, QrCode, Barcode, 
  ArrowRightLeft, SlidersHorizontal, History, Trash2, Archive,
  AlertCircle, TrendingUp
} from 'lucide-react';
import type { productsDatas } from '../types';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SetRoutes } from '../Features/AppSlice';

const productsData:productsDatas[] = [
  { 
    id: 1005, 
    image: '🌿', 
    name: 'Premium Black Seed Oil', 
    sku: 'BS-OIL-500', 
    category: 'Black Seed', 
    supplier: 'Green Heritage Farms',
    stock: 250, 
    price: 24.99,
    status: 'Available',
    batch: 'BS-2024-11',
    expiry: '2025-10-15',
    desc: 'Premium cold-pressed black seed oil sourced from organic farms. Known for its high thymoquinone content, this traditional remedy supports immune health.'
  },
  { 
    id: 1004, 
    image: '🍯', 
    name: 'Premium Honey 250g', 
    sku: 'HON-250', 
    category: 'Honey', 
    supplier: 'Golden Hives Co.',
    stock: 50, 
    price: 18.50,
    status: 'Low Stock',
    batch: 'HON-2024-02',
    expiry: '2026-05-20',
    desc: 'Pure, unfiltered raw mountain honey. Naturally crystallized and rich in antioxidants.'
  },
  { 
    id: 1003, 
    image: '🫖', 
    name: 'Herbal Tea Blend', 
    sku: 'TEA-001', 
    category: 'Herbs', 
    supplier: 'Nature Extracts',
    stock: 200, 
    price: 12.00,
    status: 'Available',
    batch: 'TEA-2024-08',
    expiry: '2025-12-01',
    desc: 'A soothing blend of chamomile, mint, and proprietary herbs to support digestion and relaxation.'
  },
  { 
    id: 1006, 
    image: '🧴', 
    name: 'Olive Oil Lotion', 
    sku: 'OO-LOT-100', 
    category: 'Honey', 
    supplier: 'Olea Botanicals',
    stock: 0, 
    price: 15.99,
    status: 'Out of Stock',
    batch: 'OO-2024-01',
    expiry: '2025-06-10',
    desc: 'Hydrating body lotion infused with extra virgin olive oil and vitamin E.'
  },
];

export default function AlMalikInventory():React.JSX.
Element {
  const dispatch=useDispatch()
  const [selectedProduct, setSelectedProduct] = useState<productsDatas>(productsData[0]);
  const [SearchResult,SetSearch]=useState<string>('')
  const [Cate,setcate]=useState<string>('All Categories')
 
  const data = useMemo(() => {
  const filteredProducts = productsData.filter((res) =>
    res.name.toLowerCase().trim().includes(SearchResult.toLowerCase().trim()) &&
    (Cate === "All Categories" || res.category === Cate)
  );

  return filteredProducts;
}, [SearchResult, Cate, productsData]);

  const navigate=useNavigate()



  
  return (
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8 font-sans text-gray-800">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
        
        {/* =======================
            LEFT COLUMN: PRODUCTS 
            ======================= */}
        <div className="xl:col-span-6 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products</h1>
          </div>

          {/* Search & Filters */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  onChange={(e)=>SetSearch(e.target.value)}
                  placeholder="Search products by name, SKU, or Barcode..." 
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm text-gray-700 shadow-sm">
                <Filter className="w-4 h-4" /> Filter all
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <select onChange={(e)=>setcate(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
                <option>All Categories</option>
                <option>Black Seed</option>
                <option>Honey</option>
                <option>Herbs</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
                <option>Supplier</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
                <option>Stock Status</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
                <option>Expiry</option>
              </select>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              {data.length?(

              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/80 text-gray-600 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3.5 w-12"><input type="checkbox" className="rounded text-blue-600 cursor-pointer" /></th>
                    <th className="px-4 py-3.5">ID</th>
                    <th className="px-4 py-3.5">Product</th>
                    <th className="px-4 py-3.5">SKU</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Stock</th>
                    <th className="px-4 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  
                  {data.map((prod) => (
                    <tr 
                      key={prod.id} 
                      onClick={() => setSelectedProduct(prod)}
                      className={`cursor-pointer hover:bg-gray-50 transition-colors ${selectedProduct.id === prod.id ? 'bg-blue-50/40' : ''}`}
                    >
                      <td className="px-4 py-3.5">
                        <input type="checkbox" checked={selectedProduct.id === prod.id} readOnly className="rounded text-blue-600 cursor-pointer" />
                      </td>
                      <td className="px-4 py-3.5 font-medium text-gray-900">{prod.id}</td>
                      <td className="px-4 py-3.5 flex items-center gap-3">
                        <div className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200 text-lg">
                          {prod.image}
                        </div>
                        <span className="font-medium text-gray-900">{prod.name}</span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500">{prod.sku}</td>
                      <td className="px-4 py-3.5 text-gray-500">{prod.category}</td>
                      <td className="px-4 py-3.5 text-gray-900 font-medium">{prod.stock}</td>
                      <td className="px-4 py-3.5">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                          prod.status === 'Available' ? 'bg-green-100 text-green-700 border border-green-200' : 
                          prod.status === 'Low Stock' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                          'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                          {prod.status}
                        </span>
                      </td>
                    </tr>
                  ))
                  
                  }
                </tbody>
              </table>
              ):(
                <main className='w-full bg-slate-100 h-16 flex justify-center items-center '>
                  <h1>Product Not found <span className='text-amber-950'>{SearchResult}</span></h1>
                </main>
              )}

            </div>
          </div>
        </div>

        {/* =======================
            MIDDLE COLUMN: DETAILS 
            ======================= */}
        <div className="xl:col-span-4 flex flex-col gap-5">
          <h2 className="text-xl font-bold text-gray-900 hidden xl:block tracking-tight">Product Details</h2>
          
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex-1 flex flex-col">
            
            {/* Header / Main Info */}
            <div className="flex gap-6 mb-8">
              <div className="w-32 h-40 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200 text-6xl shadow-inner">
                {selectedProduct.image}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold text-amber-600 mb-1.5 tracking-widest uppercase">Legendary</div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">{selectedProduct.name}</h3>
                  </div>
                  <div className="text-sm font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                    ID: {selectedProduct.id}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-sm mt-3">
                  <div className="text-gray-500">Scientific Name</div>
                  <div className="font-medium text-gray-900 italic">Nigella sativa</div>
                  <div className="text-gray-500">SKU</div>
                  <div className="font-medium text-gray-900">{selectedProduct.sku}</div>
                  <div className="text-gray-500">Barcode</div>
                  <div className="font-medium text-gray-900 flex items-center gap-2">
                    662123456789 <Barcode className="w-4 h-4 text-gray-400"/>
                  </div>
                </div>
              </div>
            </div>

            {/* General Info Grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm mb-6 pb-6 border-b border-gray-100">
              <div className="text-gray-500">Category</div>
              <div className="font-medium text-gray-900">{selectedProduct.category}</div>
              
              <div className="text-gray-500">Supplier</div>
              <div className="font-medium text-gray-900">{selectedProduct.supplier}</div>
              
              <div className="text-gray-500">Batch</div>
              <div className="font-medium text-gray-900">{selectedProduct.batch}</div>
              
              <div className="text-gray-500">Manufacture Date</div>
              <div className="font-medium text-gray-900">2024-05-10</div>
              
              <div className="text-gray-500">Expiry Date</div>
              <div className="font-medium text-red-600 flex items-center gap-1.5">
                {selectedProduct.expiry} <AlertCircle className="w-4 h-4" />
              </div>
            </div>

            {/* Financial & Certifications Grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm mb-6 pb-6 border-b border-gray-100">
              <div className="text-gray-500">Purchase Price</div>
              <div className="font-medium text-gray-900">${(selectedProduct.price * 0.6).toFixed(2)}</div>
              
              <div className="text-gray-500">Selling Price</div>
              <div className="font-bold text-green-700 text-base">${selectedProduct.price.toFixed(2)}</div>
              
              <div className="text-gray-500">Stock Quantity</div>
              <div className="font-medium text-gray-900">{selectedProduct.stock} Units</div>
              
              <div className="text-gray-500">Halal Certified</div>
              <div className="font-medium text-gray-900">Yes</div>
              
              <div className="text-gray-500">Sunnah Medicine</div>
              <div className="font-medium text-gray-900">Yes</div>
            </div>

            {/* Description */}
            <div className="mt-auto">
              <div className="text-sm font-semibold text-gray-900 mb-2.5">Product Description</div>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                {selectedProduct.desc}
              </p>
            </div>
          </div>
        </div>

        {/* =======================
            RIGHT COLUMN: ACTIONS 
            ======================= */}
        <div className="xl:col-span-2 flex flex-col gap-5">
          <h2 className="text-xl font-bold text-gray-900 hidden xl:block tracking-tight">Actions</h2>
          
          <div className="flex flex-col gap-2.5">
            {[
              { icon: Eye, label: 'View Product'  },
              { icon: Edit, label: 'Edit Details' },
              { icon: Copy, label: 'Duplicate' },
              { icon: Barcode, label: 'Print Barcode' },
              { icon: QrCode, label: 'Print QR Code' },
              { icon: ArrowRightLeft, label: 'Transfer Stock' },
              { icon: SlidersHorizontal, label: 'Adjust Inventory' },
              { icon: History, label: 'View History' },
            ].map((action, i) => (
              <button onClick={()=>{
                const ms=action.label==="View Product"?"view":action.label.startsWith("Edit")?"edit":action.label==="Transfer Stock"?"transfer":"history"
                dispatch(SetRoutes(ms))

                navigate(`/Inventory/ViewProucts/${selectedProduct?.id}`)}} key={i} className="flex items-center gap-3 w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700">
                <action.icon className="w-4 h-4 text-blue-600/70" />
                {action.label}
              </button>
            ))}
            
            <hr className="my-2 border-gray-100" />
            
            <button className="flex items-center gap-3 w-full px-4 py-2.5 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium text-red-700">
              <Trash2 className="w-4 h-4" />
              Delete Product
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-600">
              <Archive className="w-4 h-4" />
              Archive
            </button>
          </div>

          {/* Quick Stats Cards */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mt-4">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Stock Movement
            </h3>
            <div className="h-28 w-full flex items-end gap-2 justify-between">
              {/* Decorative CSS Bar Chart */}
              {[30, 45, 25, 70, 90, 50, 80].map((h, i) => (
                <div key={i} className="w-full bg-blue-50 rounded-t-md relative group" style={{ height: `${h}%` }}>
                  <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-md transition-all group-hover:bg-blue-600" style={{ height: `${h * 0.8}%` }}></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-400 mt-3 px-1">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-sm">
             <div className="flex justify-between items-start">
               <div>
                 <h3 className="text-sm font-bold text-amber-900 mb-1">Expiring Soon</h3>
                 <p className="text-3xl font-black text-amber-700">4</p>
               </div>
               <div className="bg-amber-100 p-2 rounded-lg">
                 <AlertCircle className="w-5 h-5 text-amber-600" />
               </div>
             </div>
             <p className="text-xs font-medium text-amber-800/80 mt-3">Items need immediate attention</p>
          </div>
        </div>

      </div>
    </div>
  );
}