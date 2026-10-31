import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Bell, HandCoins, Plus, RefreshCw, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  useCreateLoanMutation,
  useGetAllProductsQuery,
  useGetLoansQuery,
  useUpdateLoanPaymentMutation,
} from '../Features/api/DataSlice';

interface LoanRecord {
  _id: string;
  CustomerName: string;
  Phone: string;
  Details: string;
  Type: 'product' | 'money';
  ItemName: string;
  Quantity?: number;
  Amount: number;
  CollectedDate: string;
  DueDate: string;
  PaidDate: string;
}

interface InventoryProduct {
  _id: string;
  ProductName: string;
  Quantity: number;
  SalePrice: number;
}

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const currency = (amount: number) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: 'NGN' }).format(amount);
const dateDifference = (date: string, from = today()) =>
  Math.round((new Date(`${date}T00:00:00`).getTime() - new Date(`${from}T00:00:00`).getTime()) / 86400000);

export default function Loans() {
  const [type, setType] = useState<'product' | 'money'>('product');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [amount, setAmount] = useState('');
  const [collectedDate, setCollectedDate] = useState(today());
  const [dueDate, setDueDate] = useState(today());
  const [paidDates, setPaidDates] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'due' | 'overdue' | 'paid'>('all');
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted',
  );
  const notifiedLoans = useRef(new Set<string>());

  const { data: loansData, isLoading, isError, refetch } = useGetLoansQuery(undefined, { pollingInterval: 60000 });
  const { data: productsData } = useGetAllProductsQuery({ filter: 'all' });
  const [createLoan, { isLoading: isCreating }] = useCreateLoanMutation();
  const [updatePayment, { isLoading: isUpdatingPayment }] = useUpdateLoanPaymentMutation();
  const loans: LoanRecord[] = useMemo(() => loansData?.loans ?? [], [loansData]);
  const products: InventoryProduct[] = productsData?.products ?? [];
  const selectedProduct = products.find((product) => product._id === productId);
  const outstandingLoans = useMemo(() => loans.filter((loan) => !loan.PaidDate), [loans]);
  const totalLoaned = loans.reduce((total, loan) => total + Number(loan.Amount || 0), 0);
  const outstandingAmount = outstandingLoans.reduce((total, loan) => total + Number(loan.Amount || 0), 0);
  const recoveredAmount = loans.filter((loan) => loan.PaidDate).reduce((total, loan) => total + Number(loan.Amount || 0), 0);
  const dueTodayLoans = outstandingLoans.filter((loan) => loan.DueDate && dateDifference(loan.DueDate) === 0);
  const overdueLoans = outstandingLoans.filter((loan) => loan.DueDate && dateDifference(loan.DueDate) < 0);
  const filteredLoans = loans.filter((loan) => {
    const matchesSearch = `${loan.CustomerName} ${loan.Phone} ${loan.ItemName} ${loan.Details}`.toLowerCase().includes(search.trim().toLowerCase());
    const daysUntilDue = loan.DueDate ? dateDifference(loan.DueDate) : null;
    const matchesFilter = filter === 'all'
      || (filter === 'paid' && Boolean(loan.PaidDate))
      || (filter === 'due' && !loan.PaidDate && daysUntilDue === 0)
      || (filter === 'overdue' && !loan.PaidDate && daysUntilDue !== null && daysUntilDue < 0);
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    if (!notificationsEnabled) return;
    for (const loan of outstandingLoans) {
      if (!loan.DueDate || dateDifference(loan.DueDate) > 0 || notifiedLoans.current.has(loan._id)) continue;
      const dueStatus = dateDifference(loan.DueDate) < 0 ? 'is overdue' : 'is due today';
      new Notification(`Loan payment ${dueStatus}`, {
        body: `${loan.CustomerName}: ${loan.ItemName || 'Money loan'} — ${currency(loan.Amount)}`,
      });
      notifiedLoans.current.add(loan._id);
    }
  }, [loans, notificationsEnabled, outstandingLoans]);

  const handleCreateLoan = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setMessageType('success');
    try {
      await createLoan({
        customerName,
        phone,
        details,
        type,
        collectedDate,
        dueDate,
        ...(type === 'product'
          ? { productId, quantity: Number(quantity) }
          : { amount: Number(amount) }),
      }).unwrap();
      setCustomerName('');
      setPhone('');
      setDetails('');
      setProductId('');
      setQuantity('1');
      setAmount('');
      setCollectedDate(today());
      setDueDate(today());
      setMessage('Loan recorded successfully.');
      setMessageType('success');
    } catch (error) {
      const response = error as { data?: { message?: string }; message?: string };
      setMessage(response.data?.message || response.message || 'Unable to record loan.');
      setMessageType('error');
    }
  };

  const enableNotifications = async () => {
    if (!('Notification' in window)) {
      setMessage('Browser notifications are not supported here. In-app due alerts will still appear.');
      setMessageType('error');
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationsEnabled(permission === 'granted');
    if (permission !== 'granted') {
      setMessage('Notifications were not enabled. In-app due alerts will still appear.');
      setMessageType('error');
    }
  };

  const handlePaymentDate = async (loan: LoanRecord) => {
    setMessage('');
    setMessageType('success');
    try {
      await updatePayment({
        id: loan._id,
        paidDate: paidDates[loan._id] ?? loan.PaidDate ?? '',
      }).unwrap();
      setMessage('Payment date saved.');
      setMessageType('success');
    } catch (error) {
      const response = error as { data?: { message?: string }; message?: string };
      setMessage(response.data?.message || response.message || 'Unable to update payment date.');
      setMessageType('error');
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Loans</h1>
          <p className="mt-1 text-sm text-gray-500">Record products collected or money lent, and track repayments.</p>
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw size={16} /> Refresh
        </button>
        {'Notification' in window && (
          <button
            type="button"
            onClick={() => void enableNotifications()}
            disabled={notificationsEnabled}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 disabled:cursor-default disabled:opacity-60"
          >
            <Bell size={16} /> {notificationsEnabled ? 'Reminders enabled' : 'Enable reminders'}
          </button>
        )}
      </header>

      {(dueTodayLoans.length > 0 || overdueLoans.length > 0) && (
        <section role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 shrink-0 text-amber-700" size={21} />
            <div>
              <h2 className="font-semibold">Payment reminders</h2>
              <p className="mt-1 text-sm">
                {overdueLoans.length > 0 && `${overdueLoans.length} overdue payment${overdueLoans.length === 1 ? '' : 's'}`}
                {overdueLoans.length > 0 && dueTodayLoans.length > 0 && ' · '}
                {dueTodayLoans.length > 0 && `${dueTodayLoans.length} payment${dueTodayLoans.length === 1 ? '' : 's'} due today`}
              </p>
              <p className="mt-1 text-xs text-amber-800">Open the loan list below to contact the customer and record payment.</p>
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total loans issued</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{currency(totalLoaned)}</p>
          <p className="mt-1 text-xs text-gray-500">{loans.length} loan record(s)</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <p className="text-sm text-amber-800">Still outstanding</p>
          <p className="mt-1 text-2xl font-bold text-amber-950">{currency(outstandingAmount)}</p>
          <p className="mt-1 text-xs text-amber-800">{outstandingLoans.length} unpaid loan(s)</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 shadow-sm">
          <p className="text-sm text-green-800">Repaid</p>
          <p className="mt-1 text-2xl font-bold text-green-950">{currency(recoveredAmount)}</p>
          <p className="mt-1 text-xs text-green-800">{loans.filter((loan) => loan.PaidDate).length} paid loan(s)</p>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <HandCoins className="text-emerald-700" size={21} />
          <h2 className="text-lg font-semibold text-gray-900">Record a loan</h2>
        </div>
        <form onSubmit={handleCreateLoan} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm font-medium text-gray-700">
            Customer name
            <input required value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal" />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Phone (optional)
            <input value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal" />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Customer details (optional)
            <input value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Address or repayment notes" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal" />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Loan type
            <select value={type} onChange={(event) => setType(event.target.value as 'product' | 'money')} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-normal">
              <option value="product">Product collected</option>
              <option value="money">Money lent</option>
            </select>
          </label>
          {type === 'product' ? (
            <>
              <label className="text-sm font-medium text-gray-700">
                Product
                <select required value={productId} onChange={(event) => setProductId(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-normal">
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id} disabled={product.Quantity < 1}>
                      {product.ProductName} ({product.Quantity} available)
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-gray-700">
                Quantity
                <input required type="number" min="1" max={selectedProduct?.Quantity} step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal" />
              </label>
              <div className="self-end pb-2 text-sm text-gray-600">
                Loan value: <span className="font-semibold text-gray-900">{currency((selectedProduct?.SalePrice ?? 0) * Number(quantity || 0))}</span>
              </div>
            </>
          ) : (
            <label className="text-sm font-medium text-gray-700">
              Amount (NGN)
              <input required type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal" />
            </label>
          )}
          <label className="text-sm font-medium text-gray-700">
            Collection date
            <input
              required
              type="date"
              value={collectedDate}
              onChange={(event) => {
                const nextDate = event.target.value;
                setCollectedDate(nextDate);
                if (dueDate < nextDate) setDueDate(nextDate);
              }}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Payment due date
            <input required type="date" min={collectedDate} value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal" />
          </label>
          <div className="flex items-end">
            <button type="submit" disabled={isCreating} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 py-2.5 font-semibold text-white hover:bg-emerald-900 disabled:opacity-60 sm:w-auto">
              <Plus size={17} /> {isCreating ? 'Saving...' : 'Record loan'}
            </button>
          </div>
        </form>
        {message && <p role={messageType === 'error' ? 'alert' : 'status'} className={`mt-4 text-sm ${messageType === 'error' ? 'text-red-700' : 'text-emerald-800'}`}>{message}</p>}
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Loan history</h2>
            <p className="mt-1 text-xs text-gray-500">Payment reminders update while this page is open.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/loans/paid" className="inline-flex items-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100">
              View paid loans
            </Link>
            <label className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customer or item" className="rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm" />
            </label>
            <select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)} aria-label="Filter loans" className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
              <option value="all">All loans</option>
              <option value="due">Due today</option>
              <option value="overdue">Overdue</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
        {isLoading ? (
          <p className="p-5 text-sm text-gray-500">Loading loans...</p>
        ) : isError ? (
          <p className="p-5 text-sm text-red-700">Could not load loans. Try refreshing.</p>
        ) : loans.length === 0 ? (
          <p className="p-5 text-sm text-gray-500">No loans recorded yet.</p>
        ) : filteredLoans.length === 0 ? (
          <p className="p-5 text-sm text-gray-500">No loans match this search or filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3">Customer details</th>
                  <th className="px-5 py-3">Loan</th>
                  <th className="px-5 py-3">Value</th>
                  <th className="px-5 py-3">Collected</th>
                  <th className="px-5 py-3">Due date</th>
                  <th className="px-5 py-3">Paid date</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLoans.map((loan) => {
                  const paidDate = paidDates[loan._id] ?? loan.PaidDate ?? '';
                  const daysUntilDue = loan.DueDate ? dateDifference(loan.DueDate) : null;
                  const dueLabel = loan.PaidDate ? 'Paid' : daysUntilDue === null ? 'No due date' : daysUntilDue < 0 ? `Overdue ${Math.abs(daysUntilDue)}d` : daysUntilDue === 0 ? 'Due today' : `Due in ${daysUntilDue}d`;
                  return (
                    <tr key={loan._id}>
                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-900">{loan.CustomerName}</div>
                        {loan.Phone && <div className="text-xs text-gray-500">{loan.Phone}</div>}
                        {loan.Details && <div className="mt-1 max-w-xs text-xs text-gray-500">{loan.Details}</div>}
                      </td>
                      <td className="px-5 py-4 text-gray-700">
                        {loan.Type === 'money' ? 'Money lent' : `${loan.ItemName} × ${loan.Quantity}`}
                      </td>
                      <td className="px-5 py-4 text-gray-700">{currency(loan.Amount)}</td>
                      <td className="px-5 py-4 text-gray-700">{loan.CollectedDate}</td>
                      <td className={`px-5 py-4 font-medium ${!loan.PaidDate && daysUntilDue !== null && daysUntilDue <= 0 ? 'text-red-700' : 'text-gray-700'}`}>
                        {loan.DueDate || '—'}
                        {!loan.PaidDate && daysUntilDue !== null && daysUntilDue <= 0 && <div className="mt-1 text-xs">{dueLabel}</div>}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="date"
                            value={paidDate}
                            min={loan.CollectedDate}
                            onChange={(event) => setPaidDates((current) => ({ ...current, [loan._id]: event.target.value }))}
                            aria-label={`Payment date for ${loan.CustomerName}`}
                            className="rounded-md border border-gray-300 px-2 py-1.5"
                          />
                          <button
                            type="button"
                            disabled={isUpdatingPayment}
                            onClick={() => void handlePaymentDate(loan)}
                            className="rounded-md bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-900 disabled:opacity-60"
                          >
                            Save
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${loan.PaidDate ? 'bg-green-100 text-green-800' : daysUntilDue !== null && daysUntilDue <= 0 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                          {loan.PaidDate ? 'Paid' : dueLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
