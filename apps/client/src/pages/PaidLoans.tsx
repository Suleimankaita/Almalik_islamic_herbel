import { Link } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, RefreshCw } from 'lucide-react';
import { useGetLoansQuery } from '../Features/api/DataSlice';

interface LoanRecord {
  _id: string;
  CustomerName: string;
  Phone?: string;
  Details?: string;
  Type: 'product' | 'money';
  ItemName?: string;
  Quantity?: number;
  Amount: number;
  CollectedDate: string;
  DueDate?: string;
  PaidDate: string;
}

const currency = (amount: number) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: 'NGN' }).format(amount);

export default function PaidLoans() {
  const { data, isLoading, isError, refetch } = useGetLoansQuery(undefined, { pollingInterval: 60000 });
  const paidLoans: LoanRecord[] = (data?.loans ?? []).filter((loan: LoanRecord) => Boolean(loan.PaidDate));
  const totalRecovered = paidLoans.reduce((sum, loan) => sum + Number(loan.Amount || 0), 0);

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/loans" className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-emerald-800 hover:text-emerald-950">
            <ArrowLeft size={16} /> Back to loans
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900">Paid loans</h1>
          <p className="mt-1 text-sm text-gray-500">A history of customer loans marked as paid.</p>
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </header>

      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-sm font-medium text-emerald-800">Total repaid</p>
        <p className="mt-1 text-3xl font-bold text-emerald-950">{currency(totalRecovered)}</p>
        <p className="mt-1 text-sm text-emerald-800">{paidLoans.length} paid loan(s)</p>
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <p role="status" className="p-5 text-sm text-gray-500">Loading paid loans...</p>
        ) : isError ? (
          <div role="alert" className="flex items-center justify-between gap-3 p-5 text-sm text-red-700">
            <span>Paid loans could not be loaded.</span>
            <button type="button" onClick={() => void refetch()} className="font-semibold underline">Try again</button>
          </div>
        ) : paidLoans.length === 0 ? (
          <div className="p-10 text-center">
            <BadgeCheck className="mx-auto text-gray-300" size={36} />
            <h2 className="mt-3 font-semibold text-gray-900">No paid loans yet</h2>
            <p className="mt-1 text-sm text-gray-500">When a loan is repaid, it will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Loan</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Collected</th>
                  <th className="px-5 py-3">Due</th>
                  <th className="px-5 py-3">Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paidLoans.map((loan) => (
                  <tr key={loan._id}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{loan.CustomerName}</p>
                      {loan.Phone && <p className="mt-1 text-xs text-gray-500">{loan.Phone}</p>}
                      {loan.Details && <p className="mt-1 max-w-xs text-xs text-gray-500">{loan.Details}</p>}
                    </td>
                    <td className="px-5 py-4 text-gray-700">
                      {loan.Type === 'money' ? 'Money lent' : `${loan.ItemName || 'Product'} × ${loan.Quantity ?? 1}`}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900">{currency(Number(loan.Amount || 0))}</td>
                    <td className="px-5 py-4 text-gray-700">{loan.CollectedDate || '—'}</td>
                    <td className="px-5 py-4 text-gray-700">{loan.DueDate || '—'}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">{loan.PaidDate}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-gray-200 bg-gray-50">
                <tr>
                  <td colSpan={2} className="px-5 py-3 font-semibold text-gray-900">Total repaid</td>
                  <td className="px-5 py-3 font-bold text-emerald-800">{currency(totalRecovered)}</td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
