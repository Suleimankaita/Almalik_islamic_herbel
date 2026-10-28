import { useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { CalendarDays, ChevronLeft, ChevronRight, History, Loader2, Printer, RefreshCw, Search } from 'lucide-react';
import { GetToken } from '../Features/AppSlice';
import { useGetTransactionsQuery } from '../Features/api/DataSlice';
import { formatCurrency, printSalesReceipt } from '../utils/printSalesReceipt';

interface SaleRecord {
  _id: string;
  ProductName?: string;
  SKU?: string;
  Barcode?: number;
  Quantity?: number;
  SalePrice?: number;
  ActualPrice?: number;
  PaymentMethod?: 'cash' | 'card' | 'pos';
  Date?: string;
  Time?: string;
  createdAt?: string;
  User?: { Username?: string } | string;
}

const PAGE_SIZE = 15;

const cashierName = (user: SaleRecord['User']) =>
  typeof user === 'object' && user ? user.Username || 'Unknown' : user || 'Unknown';

const transactionDate = (sale: SaleRecord) => {
  if (sale.createdAt) return new Date(sale.createdAt).toISOString().split('T')[0];
  return sale.Date || '—';
};

const transactionTime = (sale: SaleRecord) =>
  sale.createdAt ? new Date(sale.createdAt).toLocaleTimeString() : sale.Time;

const paymentLabel = (method: SaleRecord['PaymentMethod']) => {
  if (method === 'card') return 'Card';
  if (method === 'pos') return 'POS';
  return 'Cash';
};

export default function SalesHistory(): React.JSX.Element {
  const token = useSelector(GetToken);
  const [page, setPage] = useState(1);
  const [productName, setProductName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { data, isLoading, isFetching, isError, refetch } = useGetTransactionsQuery({
    token,
    page,
    limit: PAGE_SIZE,
    productName: productName.trim() || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const transactions: SaleRecord[] = data?.transactions ?? [];
  const totalPages = Math.max(1, Number(data?.totalPages) || 1);
  const totalCount = Number(data?.totalCount) || 0;

  const printSale = (sale: SaleRecord) => {
    const createdAt = sale.createdAt ? new Date(sale.createdAt) : null;
    const printed = printSalesReceipt(
      [{
        id: sale._id,
        name: sale.ProductName || 'Product',
        variant: sale.SKU || (sale.Barcode ? String(sale.Barcode) : ''),
        price: Number(sale.SalePrice) || 0,
        quantity: Number(sale.Quantity) || 0,
      }],
      {
        receiptNo: `AM-${sale._id.slice(-8).toUpperCase()}`,
        date: createdAt?.toISOString().split('T')[0] || sale.Date,
        time: createdAt?.toLocaleTimeString() || sale.Time,
        paymentMethod: paymentLabel(sale.PaymentMethod),
        cashier: cashierName(sale.User),
      },
    );

    if (!printed) {
      Swal.fire({ icon: 'error', title: 'Print blocked', text: 'Please allow pop-ups to print receipts.' });
    }
  };

  return (
    <section className="min-h-full bg-slate-50 p-4 text-slate-800 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-700">
              <History size={22} />
              <p className="text-sm font-bold uppercase tracking-wide">Sales</p>
            </div>
            <h1 className="mt-1 text-2xl font-black text-slate-900">Sales History</h1>
            <p className="mt-1 text-sm text-slate-500">Review completed product sales and print a receipt for any sale.</p>
          </div>
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-wait disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
            Refresh
          </button>
        </header>

        <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[minmax(220px,1fr)_180px_180px]">
          <label className="relative block">
            <span className="sr-only">Search product sales</span>
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={productName}
              onChange={(event) => {
                setProductName(event.target.value);
                setPage(1);
              }}
              placeholder="Search product name"
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <label className="relative block">
            <span className="sr-only">Start date</span>
            <CalendarDays size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(event) => {
                setStartDate(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <label className="relative block">
            <span className="sr-only">End date</span>
            <CalendarDays size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => {
                setEndDate(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 sm:px-5">
            <p className="text-sm font-semibold text-slate-700">
              {totalCount} product sale{totalCount === 1 ? '' : 's'}
            </p>
            {isFetching && !isLoading && <span className="text-xs text-slate-400">Updating…</span>}
          </div>

          {isLoading ? (
            <div role="status" className="flex min-h-56 items-center justify-center gap-2 text-sm text-slate-500">
              <Loader2 size={18} className="animate-spin" /> Loading sales history…
            </div>
          ) : isError ? (
            <div role="alert" className="flex min-h-56 flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="font-semibold text-slate-800">Sales history could not be loaded.</p>
              <button type="button" onClick={() => void refetch()} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
                Try again
              </button>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center gap-2 p-6 text-center">
              <History size={32} className="text-slate-300" />
              <p className="font-semibold text-slate-700">No sales found</p>
              <p className="text-sm text-slate-500">Try changing the search or date filters.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Product</th>
                      <th className="px-5 py-3 font-semibold">Quantity</th>
                      <th className="px-5 py-3 font-semibold">Unit price</th>
                      <th className="px-5 py-3 font-semibold">Total</th>
                      <th className="px-5 py-3 font-semibold">Date / time</th>
                      <th className="px-5 py-3 font-semibold">Payment</th>
                      <th className="px-5 py-3 font-semibold">Cashier</th>
                      <th className="px-5 py-3 text-right font-semibold">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((sale) => {
                      const quantity = Number(sale.Quantity) || 0;
                      const unitPrice = Number(sale.SalePrice) || 0;
                      return (
                        <tr key={sale._id} className="hover:bg-slate-50">
                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-800">{sale.ProductName || 'Product'}</p>
                            <p className="mt-0.5 font-mono text-xs text-slate-400">{sale.SKU || sale.Barcode || `#${sale._id.slice(-8)}`}</p>
                          </td>
                          <td className="px-5 py-4 font-medium">{quantity}</td>
                          <td className="px-5 py-4">{formatCurrency(unitPrice)}</td>
                          <td className="px-5 py-4 font-semibold text-slate-800">{formatCurrency(unitPrice * quantity)}</td>
                          <td className="px-5 py-4 text-slate-600">
                            <span>{transactionDate(sale)}</span>
                            {transactionTime(sale) && <span className="block text-xs text-slate-400">{transactionTime(sale)}</span>}
                          </td>
                          <td className="px-5 py-4">{paymentLabel(sale.PaymentMethod)}</td>
                          <td className="px-5 py-4">{cashierName(sale.User)}</td>
                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => printSale(sale)}
                              aria-label={`Print receipt for ${sale.ProductName || 'product'}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                            >
                              <Printer size={14} /> Print
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <footer className="flex items-center justify-between border-t border-slate-100 px-4 py-3 sm:px-5">
                <p className="text-xs text-slate-500">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page <= 1 || isFetching}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    disabled={page >= totalPages || isFetching}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </footer>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
