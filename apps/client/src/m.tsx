import { useEffect, useMemo, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { DateRange, Range, RangeKeyDict } from 'react-date-range';
import { format, startOfDay, endOfDay, isSameDay, differenceInCalendarDays } from 'date-fns';
import { Calendar as CalendarIcon, ChevronDown, X, RefreshCw } from 'lucide-react';

// CSS styles required by react-date-range
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { StatCard, MiniStatCard } from './components/StatCard';
import SalesOverview from './components/SalesOverview';
import StockStatus from './components/StockStatus';
import RecentTransactions from './components/RecentTransactions';
import RecentPurchases from './components/RecentPurchases';
import TopSellingProducts from './components/TopSellingProducts';
import ExpiringSoon from './components/ExpiringSoon';
import QuoteBanner from './components/QuoteBanner';
import { statCards as defaultStatCards, miniStats as defaultMiniStats } from './data';
import { useGetAllProductsQuery, useGetTopSalesQuery, useGetTransactionsQuery } from './Features/api/DataSlice';
import { GetToken, GetUserDetails } from './Features/AppSlice';

interface Transaction {
  _id?: string;
  ProductName?: string;
  Quantity?: number;
  SalePrice?: number;
  ActualPrice?: number;
  Date?: string; // 'yyyy-MM-dd'
  Time?: string;
  createdAt?: string;
}

interface Product {
  _id: string;
  Barcode?: number;
  SKU?: string;
  ProductName: string;
  img?: string;
  Quantity: number;
  ActualPrice: number;
  SalePrice: number;
  Date?: string;
  Time?: string;
  createdAt?: string;
  updatedAt?: string;
  ManufactureDate?: string;
  ExpiryDate?: string;
}

const EXPIRY_WINDOW_DAYS = 30;

export default function App() {
  const token = useSelector(GetToken);
  const userDetails = useSelector(GetUserDetails);
  const username = userDetails?.Username || 'User';
  const Pname = `Assalamu Alaikum, ${username}`;

  const [name, setName] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isAllSales, setIsAllSales] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Date Range State
  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: startOfDay(new Date()),
      endDate: endOfDay(new Date()),
      key: 'selection',
    },
  ]);

  // Extract selected dates for API query
  const selectedStartDate = dateRange[0].startDate ? format(dateRange[0].startDate, 'yyyy-MM-dd') : null;
  const selectedEndDate = dateRange[0].endDate ? format(dateRange[0].endDate, 'yyyy-MM-dd') : null;

  // Shared date filter params sent to the API. Empty object = no date
  // constraint (all-time). This requires the corresponding endpoints in
  // DataSlice.ts to accept `startDate` / `endDate` query args. If they
  // don't yet, the client-side filter below still keeps the UI correct.
  const dateParams =
    isAllSales || !selectedStartDate || !selectedEndDate
      ? {}
      : { startDate: selectedStartDate, endDate: selectedEndDate };

  const {
    data: apiResponse,
    isLoading: isProductsLoading,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useGetAllProductsQuery(
    { token },
    {
      // skip is required here — without it this fires even when there's no
      // token yet (e.g. on first mount before auth resolves), which just
      // produces a guaranteed 401/unauthenticated error every load.
      skip: !token,
      pollingInterval: 10000,
      refetchOnFocus: true,
    }
  );

  const {
    data: transactionsResponse,
    isLoading: isTransactionsLoading,
    isError: isTransactionsError,
    refetch: refetchTransactions,
  } = useGetTransactionsQuery(
    { token, page: 1, limit: 100, ...dateParams },
    {
      skip: !token,
      // 1s polling means every open dashboard tab hits your API ~3600x/hr
      // per query. 10s is already generous for a "live" dashboard feel;
      // drop lower only if you've confirmed the backend can take it.
      pollingInterval: 10000,
      refetchOnFocus: true,
    }
  );

  const {
    data: topSalesResponse,
    isLoading: isTopSalesLoading,
    isError: isTopSalesError,
    refetch: refetchTopSales,
  } = useGetTopSalesQuery(
    { token, limit: 5, ...dateParams },
    {
      skip: !token,
      pollingInterval: 10000,
      refetchOnFocus: true,
    }
  );

  const isLoading = isProductsLoading || isTransactionsLoading || isTopSalesLoading;
  const isError = isProductsError || isTransactionsError || isTopSalesError;

  const refetchAll = () => {
    void refetchProducts();
    void refetchTransactions();
    void refetchTopSales();
  };

  const {
    count = 0,
    availableCount = 0,
    lowStockCount = 0,
    lowStockProducts = [],
    products = [],
    threshold = 5,
  } = apiResponse || {};

  const transactions: Transaction[] = transactionsResponse?.transactions || [];
  const topSales = topSalesResponse?.topSales || [];

  // ---------------------------------------------------------------------
  // Date filtering (client-side safety net)
  // ---------------------------------------------------------------------
  // Filters by tx.Date within the selected range. Guards against tx.Date
  // being missing/malformed, and against `transactions` itself being
  // undefined during a transient loading/error state.
  const filteredTransactions = useMemo(() => {
    const safeTransactions = Array.isArray(transactions) ? transactions : [];

    if (isAllSales || !selectedStartDate || !selectedEndDate) {
      return safeTransactions;
    }

    return safeTransactions.filter((tx) => {
      const txDate = tx?.Date;
      // No date on the record -> can't place it in range. Exclude rather
      // than silently including it (which would inflate totals).
      if (!txDate || typeof txDate !== 'string') return false;
      return txDate >= selectedStartDate && txDate <= selectedEndDate;
    });
  }, [transactions, isAllSales, selectedStartDate, selectedEndDate]);

  // True only when a specific (non "all sales") range is active AND it
  // matched nothing. Lets child components render an explicit "no sales
  // in this range" empty state instead of looking broken.
  const hasNoResultsForRange =
    !isAllSales && !!selectedStartDate && !!selectedEndDate && filteredTransactions.length === 0;

  const sortedTransactions = useMemo(
    () =>
      [...filteredTransactions].sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      }),
    [filteredTransactions]
  );

  const salesSummary = useMemo(() => {
    // Explicit early-out: always return a fully-formed zero object rather
    // than letting an empty array fall through reduce's initial value by
    // accident, so every consumer downstream sees the same shape.
    if (filteredTransactions.length === 0) {
      return { totalSales: 0, totalProfit: 0, points: [] as Array<{ date: string; sales: number }> };
    }

    const summary = filteredTransactions.reduce(
      (acc, tx) => {
        const quantity = Number(tx?.Quantity ?? 1);
        const salePrice = Number(tx?.SalePrice ?? 0);
        const actualPrice = Number(tx?.ActualPrice ?? 0);

        // Skip records with bad numeric data instead of letting NaN
        // poison the running total for every transaction after it.
        if (Number.isNaN(quantity) || Number.isNaN(salePrice) || Number.isNaN(actualPrice)) {
          return acc;
        }

        const revenue = salePrice * quantity;
        const profit = (salePrice - actualPrice) * quantity;
        const dateKey = tx?.Date || (tx?.createdAt ? tx.createdAt.slice(0, 10) : 'Unknown');

        acc.totalSales += revenue;
        acc.totalProfit += profit;

        const existing = acc.points.find((item) => item.date === dateKey);
        if (existing) {
          existing.sales += revenue;
        } else {
          acc.points.push({ date: dateKey, sales: revenue });
        }

        return acc;
      },
      { totalSales: 0, totalProfit: 0, points: [] as Array<{ date: string; sales: number }> }
    );

    summary.points.sort((a, b) => a.date.localeCompare(b.date));
    return summary;
  }, [filteredTransactions]);

  // ---------------------------------------------------------------------
  // Products expiring soon (drives the ExpiringSoon container)
  // ---------------------------------------------------------------------
  const expiringProducts = useMemo(() => {
    const today = startOfDay(new Date());

    return (products as Product[])
      .filter((p) => {
        if (!p?.ExpiryDate) return false;
        const expiry = new Date(p.ExpiryDate);
        if (Number.isNaN(expiry.getTime())) return false;
        const daysUntilExpiry = differenceInCalendarDays(expiry, today);
        return daysUntilExpiry >= 0 && daysUntilExpiry <= EXPIRY_WINDOW_DAYS;
      })
      .map((p) => ({
        ...p,
        daysUntilExpiry: differenceInCalendarDays(new Date(p.ExpiryDate as string), today),
      }))
      .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
  }, [products]);

  // Counts needed to drive the outOfStock / expired stat cards.
  const outOfStockCount = useMemo(
    () => (products as Product[]).filter((p) => Number(p?.Quantity ?? 0) <= 0).length,
    [products]
  );

  const expiredProductsCount = useMemo(() => {
    const today = startOfDay(new Date());
    return (products as Product[]).filter((p) => {
      if (!p?.ExpiryDate) return false;
      const expiry = new Date(p.ExpiryDate);
      return !Number.isNaN(expiry.getTime()) && expiry < today;
    }).length;
  }, [products]);

  // Most recently added/updated products, newest first — drives
  // RecentPurchases (stand-in for a dedicated purchases endpoint; swap for
  // a real purchase-order API if/when one exists).
  const recentPurchases = useMemo(() => {
    return [...(products as Product[])]
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 5);
  }, [products]);

  // Typing effect for greeting header
  useEffect(() => {
    let next = 0;
    const timer = window.setInterval(() => {
      next += 1;
      setName(Pname.slice(0, next));

      if (next >= Pname.length) {
        window.clearInterval(timer);
      }
    }, 100);

    return () => window.clearInterval(timer);
  }, [Pname]);

  // Close DatePicker popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick action handlers
  const handleSelectToday = () => {
    setIsAllSales(false);
    setDateRange([
      {
        startDate: startOfDay(new Date()),
        endDate: endOfDay(new Date()),
        key: 'selection',
      },
    ]);
    setShowDatePicker(false);
  };

  const handleSelectAllSales = () => {
    setIsAllSales(true);
    setShowDatePicker(false);
  };

  const handleDateChange = (rangesByKey: RangeKeyDict) => {
    const { selection } = rangesByKey;
    setIsAllSales(false);
    setDateRange([selection]);
  };

  // Check if current range is Today
  const isTodaySelected =
    !isAllSales &&
    dateRange[0].startDate &&
    dateRange[0].endDate &&
    isSameDay(dateRange[0].startDate, new Date()) &&
    isSameDay(dateRange[0].endDate, new Date());

  // Dynamically update stat cards with live metrics, matched by `icon`.
  // `icon` is a typed union shared by StatCardData/MiniStatData
  // (see components/StatCard.tsx), so this is a reliable discriminator —
  // unlike matching on `title`/`label` text, which breaks the moment
  // copy changes in data.ts.
  const updatedStatCards = defaultStatCards.map((card) => {
    switch (card.icon) {
      case 'inventory':
        return { ...card, value: isLoading ? '...' : count };
      case 'stock':
        return { ...card, value: isLoading ? '...' : availableCount };
      case 'lowStock':
        return { ...card, value: isLoading ? '...' : lowStockCount };
      case 'outOfStock':
        return { ...card, value: isLoading ? '...' : outOfStockCount };
      case 'sales':
        return { ...card, value: isLoading ? '...' : `₦${salesSummary.totalSales.toLocaleString()}` };
      case 'profit':
        return { ...card, value: isLoading ? '...' : `₦${salesSummary.totalProfit.toLocaleString()}` };
      case 'expiringSoon':
        return { ...card, value: isLoading ? '...' : expiringProducts.length };
      case 'expired':
        return { ...card, value: isLoading ? '...' : expiredProductsCount };
      default:
        // 'customers' / 'suppliers' (or anything else): no live source for
        // these yet, so keep whatever static value data.ts provides rather
        // than showing a wrong number.
        return card;
    }
  });

  const updatedMiniStats = defaultMiniStats.map((stat) => {
    switch (stat.icon) {
      case 'inventory':
        return { ...stat, value: isLoading ? '...' : count };
      case 'stock':
        return { ...stat, value: isLoading ? '...' : availableCount };
      case 'lowStock':
        return { ...stat, value: isLoading ? '...' : lowStockCount };
      case 'outOfStock':
        return { ...stat, value: isLoading ? '...' : outOfStockCount };
      case 'sales':
        return { ...stat, value: isLoading ? '...' : `₦${salesSummary.totalSales.toLocaleString()}` };
      case 'profit':
        return { ...stat, value: isLoading ? '...' : `₦${salesSummary.totalProfit.toLocaleString()}` };
      case 'expiringSoon':
        return { ...stat, value: isLoading ? '...' : expiringProducts.length };
      case 'expired':
        return { ...stat, value: isLoading ? '...' : expiredProductsCount };
      default:
        return stat;
    }
  });

  return (
    <div className="flex bg-[#F6F7F9] min-h-screen">
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 space-y-5 p-6">
          {/* Header & Date Controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center gap-2 text-[22px] font-extrabold text-gray-900">
                {name} <span>👋</span>
              </h1>
              <p className="text-[13px] text-gray-500">
                {isAllSales
                  ? 'Showing metrics for all-time sales.'
                  : isTodaySelected
                  ? "Here's what's happening with your business today."
                  : `Showing metrics from ${format(dateRange[0].startDate!, 'MMM dd, yyyy')} to ${format(
                      dateRange[0].endDate!,
                      'MMM dd, yyyy'
                    )}.`}
              </p>
            </div>

            {/* Date Range Selector Dropdown */}
            <div className="relative flex items-center gap-2" ref={datePickerRef}>
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <CalendarIcon className="h-4 w-4 text-emerald-600" />
                <span>
                  {isAllSales
                    ? 'All Time Sales'
                    : `${format(dateRange[0].startDate!, 'MMM dd, yyyy')} - ${format(
                        dateRange[0].endDate!,
                        'MMM dd, yyyy'
                      )}`}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>

              <button
                onClick={handleSelectToday}
                className={`rounded-lg border px-3 py-2 text-[13px] font-medium transition-colors ${
                  isTodaySelected
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-semibold'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Today
              </button>

              <button
                onClick={handleSelectAllSales}
                className={`rounded-lg border px-3 py-2 text-[13px] font-medium transition-colors ${
                  isAllSales
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-semibold'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                All Sales
              </button>

              {/* Date Range Popover */}
              {showDatePicker && (
                <div className="absolute right-0 top-12 z-50 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-2">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Select Range</span>
                    <button onClick={() => setShowDatePicker(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <DateRange
                    ranges={dateRange}
                    onChange={handleDateChange}
                    moveRangeOnFirstSelection={false}
                    months={1}
                    direction="horizontal"
                    rangeColors={['#10b981']}
                  />
                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <button
                      onClick={handleSelectAllSales}
                      className="text-xs font-semibold text-emerald-600 hover:underline"
                    >
                      Fetch All-Time Sales
                    </button>
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      Apply Filter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* API Error Alert */}
          {isError && (
            <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <span>Failed to load product stock & sales data. Please verify your token or connection.</span>
              <button onClick={refetchAll} className="flex items-center gap-1 font-semibold hover:underline">
                <RefreshCw className="h-4 w-4" /> Retry
              </button>
            </div>
          )}

          {/* No-results banner for the selected range (distinct from the
              error state above: the request succeeded, it just matched
              nothing) */}
          {!isLoading && !isError && hasNoResultsForRange && (
            <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <span>
                No sales found between {format(dateRange[0].startDate!, 'MMM dd, yyyy')} and{' '}
                {format(dateRange[0].endDate!, 'MMM dd, yyyy')}. Figures below are showing 0 for this range.
              </span>
              <button onClick={handleSelectAllSales} className="flex items-center gap-1 font-semibold hover:underline">
                View All-Time Sales
              </button>
            </div>
          )}

          {/* Stat Cards Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {updatedStatCards.map((card) => (
              <StatCard key={card.id} data={card} />
            ))}
          </div>

          {/* Mini Stat Cards Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {updatedMiniStats.map((stat) => (
              <MiniStatCard key={stat.id} data={stat} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_1.1fr_0.8fr]">
            <SalesOverview sales={salesSummary.points} isLoading={isLoading} isEmpty={hasNoResultsForRange} />
            <RecentTransactions transactions={sortedTransactions} isLoading={isLoading} />
            <StockStatus
              count={count}
              availableCount={availableCount}
              lowStockCount={lowStockCount}
              lowStockProducts={lowStockProducts}
              threshold={threshold}
              isLoading={isLoading}
            />
          </div>

          {/* Secondary Grid */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <TopSellingProducts topSales={topSales} isLoading={isLoading} />
            <RecentPurchases purchases={recentPurchases} isLoading={isLoading} />
            <ExpiringSoon products={expiringProducts} isLoading={isLoading} />
          </div>

          <QuoteBanner />
        </main>
      </div>
    </div>
  );
}
