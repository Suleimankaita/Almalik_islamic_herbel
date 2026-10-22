import { useMemo, useState, type FormEvent } from 'react';
import { ArrowUpDown, Barcode, Boxes, LoaderCircle, PackageSearch, Search, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GetToken } from '../Features/AppSlice';
import { useGetAllProductsQuery } from '../Features/api/DataSlice';

interface SearchProduct {
  _id?: string;
  id?: string;
  ProductName?: string;
  SKU?: string | number;
  Barcode?: string | number;
  Category?: string;
  Supplier?: string;
  Quantity?: number;
  ActualPrice?: number;
  SalePrice?: number;
  img?: string;
}

type StockFilter = 'all' | 'available' | 'low' | 'out';
type SortOrder = 'relevance' | 'name' | 'price-low' | 'price-high' | 'stock';

const currency = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 2,
});

export default function ProductSearch(): React.JSX.Element {
  const token = useSelector(GetToken);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [searchDraft, setSearchDraft] = useState({ query, value: query });
  const input = searchDraft.query === query ? searchDraft.value : query;
  const [category, setCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('relevance');
  const { data, isLoading, isFetching, isError, refetch } = useGetAllProductsQuery(
    { token },
    { refetchOnFocus: true },
  );

  const products: SearchProduct[] = useMemo(
    () => Array.isArray(data?.products) ? data.products : [],
    [data],
  );
  const threshold = Number(data?.threshold ?? 5);
  const categories = useMemo(
    () => [...new Set(products.map((product) => product.Category?.trim()).filter((value): value is string => Boolean(value)))].sort((a, b) => a.localeCompare(b)),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const matched = products.filter((product) => {
      const text = [
        product.ProductName,
        product.SKU,
        product.Barcode,
        product.Category,
        product.Supplier,
      ].filter(Boolean).join(' ').toLocaleLowerCase();
      const quantity = Number(product.Quantity ?? 0);
      const matchesQuery = !normalizedQuery || text.includes(normalizedQuery);
      const matchesCategory = category === 'all' || product.Category === category;
      const matchesStock = stockFilter === 'all'
        || (stockFilter === 'out' && quantity <= 0)
        || (stockFilter === 'low' && quantity > 0 && quantity <= threshold)
        || (stockFilter === 'available' && quantity > threshold);
      return matchesQuery && matchesCategory && matchesStock;
    });

    if (sortOrder === 'name') matched.sort((a, b) => (a.ProductName ?? '').localeCompare(b.ProductName ?? ''));
    if (sortOrder === 'price-low') matched.sort((a, b) => Number(a.SalePrice ?? a.ActualPrice ?? 0) - Number(b.SalePrice ?? b.ActualPrice ?? 0));
    if (sortOrder === 'price-high') matched.sort((a, b) => Number(b.SalePrice ?? b.ActualPrice ?? 0) - Number(a.SalePrice ?? a.ActualPrice ?? 0));
    if (sortOrder === 'stock') matched.sort((a, b) => Number(b.Quantity ?? 0) - Number(a.Quantity ?? 0));
    return matched;
  }, [products, query, category, stockFilter, sortOrder, threshold]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = input.trim();
    setSearchParams(next ? { q: next } : {});
  };

  const clearFilters = () => {
    setCategory('all');
    setStockFilter('all');
    setSortOrder('relevance');
  };

  return (
    <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Catalog</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Find a product</h1>
          <p className="mt-2 text-sm text-gray-500">Search your inventory by product name, SKU, barcode, category, or supplier.</p>
        </div>
        <Link to="/inventory" className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-emerald-300 hover:text-emerald-800">
          Browse inventory
        </Link>
      </div>

      <form onSubmit={submitSearch} role="search" className="mb-6 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50">
        <Search className="ml-2 shrink-0 text-emerald-700" size={21} />
        <input
          autoFocus
          value={input}
          onChange={(event) => setSearchDraft({ query, value: event.target.value })}
          placeholder="Try a product name, SKU, or barcode…"
          aria-label="Search inventory products"
          className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400"
        />
        {input && (
          <button type="button" onClick={() => setSearchDraft({ query, value: '' })} aria-label="Clear search" className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
            <X size={17} />
          </button>
        )}
        <button type="submit" className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800">
          Search
        </button>
      </form>

      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5" aria-label="Search filters">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800">Refine results</h2>
          <button type="button" onClick={clearFilters} className="text-xs font-semibold text-emerald-700 hover:text-emerald-900">
            Clear filters
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-xs font-semibold text-gray-500">
            Category
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 outline-none focus:border-emerald-500">
              <option value="all">All categories</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-gray-500">
            Stock status
            <select value={stockFilter} onChange={(event) => setStockFilter(event.target.value as StockFilter)} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 outline-none focus:border-emerald-500">
              <option value="all">Any stock status</option>
              <option value="available">In stock</option>
              <option value="low">Low stock</option>
              <option value="out">Out of stock</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-gray-500">
            Sort by
            <span className="relative mt-1.5 block">
              <ArrowUpDown size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)} className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm font-medium text-gray-800 outline-none focus:border-emerald-500">
                <option value="relevance">Relevance</option>
                <option value="name">Name</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="stock">Stock quantity</option>
              </select>
            </span>
          </label>
        </div>
      </section>

      <div className="mb-4 flex min-h-6 items-center justify-between gap-3">
        <p className="text-sm text-gray-600" aria-live="polite">
          {query ? <>Results for <span className="font-bold text-gray-900">“{query}”</span> · {filteredProducts.length} found</> : `${filteredProducts.length} products in your catalog`}
        </p>
        {isFetching && !isLoading && <span className="inline-flex items-center gap-1.5 text-xs text-gray-400"><LoaderCircle size={14} className="animate-spin" /> Updating</span>}
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center">
          <LoaderCircle className="mx-auto animate-spin text-emerald-700" size={30} />
          <p className="mt-3 text-sm text-gray-500">Loading your product catalog…</p>
        </div>
      ) : isError ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-10 text-center">
          <PackageSearch className="mx-auto text-red-500" size={30} />
          <p className="mt-3 font-bold text-gray-900">Couldn’t load products</p>
          <p className="mt-1 text-sm text-gray-600">Check your connection and try again.</p>
          <button type="button" onClick={() => void refetch()} className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Retry</button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500"><PackageSearch size={27} /></div>
          <h2 className="mt-4 text-lg font-bold text-gray-900">{query ? 'No matching products' : 'No products to show'}</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">{query ? 'Try another spelling, SKU, barcode, or clear the filters.' : 'Add products to your inventory and search them here.'}</p>
          {query && <button type="button" onClick={clearFilters} className="mt-4 text-sm font-semibold text-emerald-700 hover:text-emerald-900">Clear filters</button>}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => {
            const id = product._id || product.id;
            const quantity = Number(product.Quantity ?? 0);
            const status = quantity <= 0
              ? { label: 'Out of stock', classes: 'bg-red-50 text-red-700' }
              : quantity <= threshold
                ? { label: 'Low stock', classes: 'bg-amber-50 text-amber-800' }
                : { label: 'In stock', classes: 'bg-emerald-50 text-emerald-800' };
            const price = Number(product.SalePrice ?? product.ActualPrice ?? 0);
            const imageUrl = product.img ? `${import.meta.env.VITE_URI}/img/${product.img}` : '';

            return (
              <article key={id || `${product.ProductName}-${product.SKU}`} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
                <div className="flex items-start gap-4 p-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                    {imageUrl
                      ? <img src={imageUrl} alt={product.ProductName || 'Product'} loading="lazy" className="h-full w-full object-cover" />
                      : <Boxes className="text-gray-300" size={30} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="line-clamp-2 font-bold leading-snug text-gray-900">{product.ProductName || 'Unnamed product'}</h2>
                      <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${status.classes}`}>{status.label}</span>
                    </div>
                    <p className="mt-1 truncate text-xs text-gray-500">{product.Category || 'Uncategorized'}</p>
                    <p className="mt-2 text-lg font-extrabold tabular-nums text-emerald-800">{currency.format(price)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-gray-100 px-4 py-3 text-xs">
                  <div><span className="text-gray-400">SKU</span><p className="mt-0.5 truncate font-semibold text-gray-700">{product.SKU || '—'}</p></div>
                  <div><span className="text-gray-400">Stock</span><p className="mt-0.5 font-semibold text-gray-700">{quantity}</p></div>
                  <div className="col-span-2 flex items-center gap-1.5 truncate text-gray-500">
                    <Barcode size={13} className="shrink-0" /> {product.Barcode || 'No barcode'}
                    {product.Supplier && <span className="ml-auto truncate pl-2">{product.Supplier}</span>}
                  </div>
                </div>
                <div className="flex gap-2 border-t border-gray-100 p-3">
                  {id ? (
                    <Link to={`/inventory/view-products/${encodeURIComponent(id)}`} className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-center text-xs font-bold text-gray-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800">
                      View details
                    </Link>
                  ) : (
                    <span className="flex-1 rounded-lg border border-gray-100 px-3 py-2 text-center text-xs text-gray-400">Details unavailable</span>
                  )}
                  <Link to="/sales-pos" className="flex-1 rounded-lg bg-emerald-700 px-3 py-2 text-center text-xs font-bold text-white transition hover:bg-emerald-800">
                    Open in POS
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
